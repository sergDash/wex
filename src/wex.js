export const WEX_VERSION = '3.0.0'

import { ScopeX } from './vendor/ScopeX'
import { isNone, isFunction, isString, isObject, isEqual, getNodeAttrs, camelCase, parseKey, parseMustache, sanitizeSvg } from './utils.js'
import { VMLocalStorage } from './store.js'
import { reactive, toRaw, isReactive, subscribe, Effect, untrack, track, trigger, flush, runEffects } from './reactive.js'

export { reactive, toRaw, isReactive, untrack, flush as __flush }

export const config = {
  debug: typeof window !== 'undefined' && window.WEX_DEBUG !== undefined
      ? !!window.WEX_DEBUG
      : typeof location !== 'undefined' && /^(localhost|127\.|\[::1\])/.test(location.hostname),
  maxDepth: 50,
}

// window.WEX_PROFILE = true до загрузки: время в window.WEX_STATS (мс)
const stats = typeof window !== 'undefined' && window.WEX_PROFILE
    ? (window.WEX_STATS = { instantiate: 0, list: 0, rows: 0 }) : null

export function View() {}

// ---------- диагностика ----------
const reported = new Set()
export function report(title, ctx = {}) {
  const level = ctx.level || 'warn'
  if (level !== 'error' && !config.debug) return
  const path = (ctx.view && ctx.view.__path) || ['root']
  const key = [title, path.join('>'), ctx.attr, ctx.expr].join('|')
  if (reported.has(key)) return
  reported.add(key)
  const color = level === 'error' ? '#e11d48' : '#d97706'
  console.groupCollapsed(`%cWex%c ${title}`, `background:${color};color:#fff;padding:1px 5px;border-radius:3px`, '')
  console.log('Цепочка компонентов:', path.join(' › '))
  if (ctx.attr) console.log('Атрибут:', ctx.attr)
  if (ctx.expr) console.log('Выражение:', ctx.expr)
  if (ctx.hint) console.log('Подсказка:', ctx.hint)
  console.groupEnd()
}

// ---------- глобальные реестры ----------
const globalScope = new ScopeX({}, { filters: {} })
const globalComponents = new Map()   // name -> { view } | { remote }
const globalDirectives = new Map()   // name -> { fn } | { mounted, updated, unmounted }
let globalVer = 0

export function filter(name, fn) { globalScope.filters[name] = fn }

function normDirective(def) {
  if (isFunction(def)) return { fn: def }
  if (def && typeof def === 'object') return def
  throw new Error('Wex: directive(name, fn | { mounted, updated, unmounted })')
}
export function directive(name, def) { globalDirectives.set(name, normDirective(def)); globalVer++ }

function normComponent(name, src, opts) {
  if (src instanceof View) return { view: src }
  if (isString(src)) return { remote: loadRemote(src, opts) }
  throw new Error(`Wex 3: component("${name}") принимает view или URL; функции-компоненты удалены`)
}
export function component(name, src, opts) { globalComponents.set(name.toLowerCase(), normComponent(name, src, opts)); globalVer++ }

// ---------- блоки: владелец эффектов и очистки ----------
class Block {
  constructor(parent, view) {
    this.view = view
    this.parent = parent || null
    this.effects = []
    this.cleanups = null
    this.children = null
    this.disposed = false
    this.static = parent ? parent.static : false
    this.linked = false
  }
  // пустой блок (статичная строка) в родителя не регистрируется: ни Set.add, ни Set.delete
  link() {
    if (this.linked) return
    this.linked = true
    const p = this.parent
    if (p) { (p.children || (p.children = new Set())).add(this); p.link() }
  }
  onDispose(fn) { this.link(); (this.cleanups || (this.cleanups = [])).push(fn) }
  dispose() {
    if (this.disposed) return
    this.disposed = true
    const ef = this.effects
    for (let i = 0; i < ef.length; i++) ef[i].stop()
    if (this.children) Array.from(this.children).forEach(c => c.dispose())
    if (this.cleanups) this.cleanups.forEach((f) => { try { f() } catch (e) { console.error(e) } })
    if (this.linked && this.parent && this.parent.children) this.parent.children.delete(this)
    this.effects = []
  }
}

function effect(block, fn) {
  if (block.static) { untrack(fn); return null }
  const e = new Effect(fn)
  e.view = block.view
  block.effects.push(e)
  block.link()
  e.run()
  return e
}

function collectAll(block, out) {
  block.effects.forEach((e) => { if (e.active) out.push(e) })
  if (block.children) block.children.forEach(c => collectAll(c, out))
}

function collectEffects(block, view, out) {
  block.effects.forEach((e) => { if (e.active && e.view === view) out.push(e) })
  if (block.children) block.children.forEach(c => collectEffects(c, view, out))
}

// Простые пути (a, a.b.c) читаются напрямую, без компилятора ScopeX; остальное идёт через ScopeX.
// holder = { expr, fn, sc }: скомпилированная функция кэшируется прямо на узле плана
const PATH_RE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/
const RESERVED = new Set(['true', 'false', 'null', 'undefined', 'this', '$locals'])
function makeFn(sc, expr) {
  if (PATH_RE.test(expr) && !RESERVED.has(expr.split('.')[0])) {
    const keys = expr.split('.'), n = keys.length, k0 = keys[0]
    if (n === 1) return s => s[k0]
    if (n === 2) { const k1 = keys[1]; return (s) => { const a = s[k0]; return a == null ? undefined : a[k1] } }
    return (s) => { let v = s[k0]; for (let i = 1; i < n && v != null; i++) v = v[keys[i]]; return v }
  }
  return sc.compile(expr)
}

function ev(view, h, data, ctx) {
  try {
    const sc = view.__scope()
    if (typeof h === 'string') return sc.compile(h)(data)
    let fn = h.fn
    if (h.sc !== sc) { fn = h.fn = makeFn(sc, h.expr); h.sc = sc }
    return fn(data)
  }
  catch (e) {
    const expr = typeof h === 'string' ? h : h.expr
    report(`Ошибка в выражении «${expr}»: ${e.message}`, { view, attr: ctx && ctx.attr, expr, level: 'error' })
    return undefined
  }
}

// ---------- план шаблона: разбирается один раз ----------
const planCache = new Map()   // сигнатура реестра -> Map(html -> plan)
const WFOR_RE = /^[a-z][a-zA-Z0-9_$]*(,[a-z][a-zA-Z0-9_$]*){0,1} in [a-z][a-zA-Z0-9_$]*( traceby [a-z][a-zA-Z0-9_$.]*)?/
const BUILTIN = new Set(['w-class', 'w-value', 'w-disabled', 'w-checked', 'w-selected', 'w-bind', 'w-src', 'w-html', 'w-id', 'w-on', 'w-transition'])

function getPlan(html, view) {
  const sig = view.__sig()
  let m = planCache.get(sig)
  if (!m) planCache.set(sig, (m = new Map()))
  let plan = m.get(html)
  if (!plan) {
    const tpl = document.createElement('template')
    tpl.innerHTML = html
    plan = makePlan(tpl.content, view.__env())
    if (m.size > 2000) m.clear()
    m.set(html, plan)
  }
  return plan
}

function makePlan(frag, env) {
  const ops = []
  walk(frag, [], ops, env)
  // единственный корневой элемент без структурной директивы: клонируем его напрямую, без фрагмента
  const kids = frag.childNodes
  const rootEl = kids.length === 1 && kids[0].nodeType === 1
  && !ops.some(o => o.path.length === 1 && (o.t === 'if' || o.t === 'for' || o.t === 'slot'))
      ? kids[0] : null
  return { frag, ops, rootEl }
}

function fragOf(node) {
  const f = node.ownerDocument.createDocumentFragment()
  f.appendChild(node)
  return f
}

function walk(parent, path, ops, env) {
  const kids = parent.childNodes
  for (let i = 0; i < kids.length; i++) {
    const node = kids[i]
    if (node.nodeType === 3) {
      if (node.data.indexOf('{{') !== -1) {
        const parts = parseMustache(node.data)
        if (parts.length) ops.push({ t: 'text', path: path.concat(i), parts })
      }
    }
    else if (node.nodeType === 1) planElement(node, path.concat(i), ops, env, parent)
  }
}

function planElement(el, path, ops, env, parent) {
  const doc = el.ownerDocument
  const tag = el.localName

  if (el.hasAttribute('w-for')) {
    const attr = el.getAttribute('w-for')
    if (!WFOR_RE.test(attr)) throw new Error('w-for should match formatter `value,key in data traceby id`!')
    const [kv, , list, , trace] = attr.split(' ')
    const [vname, kname] = kv.split(',')
    const row = el.cloneNode(true)
    row.removeAttribute('w-for')
    parent.replaceChild(doc.createComment(' w-for '), el)
    ops.push({ t: 'for', path, vname, kname, list, trace, listH: { expr: list }, traceH: trace ? { expr: trace } : null, sub: makePlan(fragOf(row), env) })
    return
  }

  if (el.hasAttribute('w-if')) {
    const expr = el.getAttribute('w-if')
    const row = el.cloneNode(true)
    row.removeAttribute('w-if')
    parent.replaceChild(doc.createComment(' w-if '), el)
    ops.push({ t: 'if', path, expr, sub: makePlan(fragOf(row), env) })
    return
  }

  if (tag === 'slot') {
    const props = {}
    for (const a of getNodeAttrs(el) && [...el.attributes]) if (a.name[0] === ':') props[camelCase(a.name.slice(1))] = a.value
    const f = doc.createDocumentFragment()
    while (el.firstChild) f.appendChild(el.firstChild)
    const fallback = f.childNodes.length ? makePlan(f, env) : null
    parent.replaceChild(doc.createComment(' slot '), el)
    ops.push({ t: 'slot', path, props, fallback })
    return
  }

  if (tag === 'w-static' || env.comps.has(tag)) {
    const attrs = getNodeAttrs(el)
    ;[...el.attributes].forEach((a) => { if (a.name[0] === ':' || a.name[0] === '@') el.removeAttribute(a.name) })
    const f = doc.createDocumentFragment()
    while (el.firstChild) f.appendChild(el.firstChild)
    const has = f.childNodes.length && (f.childElementCount || f.textContent.trim())
    const slotPlan = has ? makePlan(f, env) : null
    planAttrs(el, path, ops, env)
    ops.push({ t: 'comp', path, name: tag, attrs, slotPlan })
    return
  }

  planAttrs(el, path, ops, env)
  walk(el, path, ops, env)
}

function planAttrs(el, path, ops, env) {
  const list = [...el.attributes]
  for (let i = 0; i < list.length; i++) {
    const { name, value } = list[i]
    if (BUILTIN.has(name)) {
      el.removeAttribute(name)
      if (name === 'w-on') {
        const [event, method] = value.split(':')
        const [fname, params] = parseKey(method)
        ops.push({ t: 'on', path, event, fname, params })
      }
      else ops.push({ t: name, path, expr: value })
    }
    else if (env.dirs.has(name)) {
      el.removeAttribute(name)
      ops.push({ t: 'dir', path, name, expr: value })
    }
    else if (name.charCodeAt(0) !== 64 && name.charCodeAt(0) !== 58 && value.indexOf('{{') !== -1) {
      if (config.debug && /^(src|href|srcset)$/.test(name)) {
        report('«{{ }}» внутри src/href: браузер запросит сырую строку и получит 404', { level: 'error', attr: name, hint: 'Используйте w-src="выражение"' })
      }
      const parts = parseMustache(value)
      if (parts.length) ops.push({ t: 'attr', path, name, parts, whole: /^\{\{[^}]+\}\}$/.test(value.trim()) })
    }
  }
}

// ---------- экземпляр плана ----------
function resolve(root, path) {
  let n = root
  for (let i = 0; i < path.length; i++) n = n.childNodes[path[i]]
  return n
}

function instantiate(plan, view, data, parentBlock, opts) {
  const block = new Block(parentBlock, view)
  if (opts && opts.static) block.static = true
  const ops = plan.ops
  const n = ops.length
  let inst
  if (plan.rootEl) {
    const el = plan.rootEl.cloneNode(true)
    inst = { frag: null, block, rootItems: null, simple: true, el }
    if (n) {
      const refs = new Array(n)
      for (let i = 0; i < n; i++) {
        const p = ops[i].path
        let node = el
        for (let j = 1; j < p.length; j++) node = node.childNodes[p[j]]
        refs[i] = node
      }
      for (let i = 0; i < n; i++) applyOp(ops[i], refs[i], view, data, block)
    }
    return inst
  }
  const frag = plan.frag.cloneNode(true)
  const refs = new Array(n)
  for (let i = 0; i < n; i++) refs[i] = resolve(frag, ops[i].path)
  const rootItems = Array.from(frag.childNodes)
  inst = { frag, block, rootItems, simple: false, el: null }
  for (let i = 0; i < n; i++) applyOp(ops[i], refs[i], view, data, block)
  return inst
}

function instNodes(inst) {
  if (inst.simple) return [inst.el]
  const out = []
  for (const n of inst.rootItems) {
    if (n.__dyn) out.push(...n.__dyn.nodes())
    else out.push(n)
  }
  return out
}
function instFirst(inst) { return inst.simple ? inst.el : instNodes(inst)[0] }
function instMove(inst, parent, ref) {
  if (inst.simple) parent.insertBefore(inst.el, ref)
  else if (inst.frag.firstChild) parent.insertBefore(inst.frag, ref)
  else instNodes(inst).forEach(n => parent.insertBefore(n, ref))
}
function instRemove(inst) {
  if (inst.simple) inst.el.remove()
  else instNodes(inst).forEach(n => n.remove())
}

function applyOp(op, node, view, data, block) {
  switch (op.t) {
    case 'text': return bindText(op, node, view, data, block)
    case 'attr': return bindAttr(op, node, view, data, block)
    case 'if': return bindIf(op, node, view, data, block)
    case 'for': return bindFor(op, node, view, data, block)
    case 'slot': return bindSlot(op, node, view, data, block)
    case 'comp': return bindComp(op, node, view, data, block)
    case 'on': return bindOn(op, node, view, data)
    case 'dir': return bindDir(op, node, view, data, block)
    default: return bindBuiltin(op, node, view, data, block)
  }
}

function bindText(op, node, view, data, block) {
  const parts = op.parts
  effect(block, () => {
    let s = ''
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (typeof p === 'string') s += p
      else {
        const v = ev(view, p, data, op)
        if (config.debug && isNone(v)) report(`«{{ ${p.expr} }}» вернул ${v}`, { view, expr: p.expr })
        s += String(v)
      }
    }
    if (node.data !== s) node.data = s
  })
}

function bindAttr(op, el, view, data, block) {
  const { name, parts } = op
  effect(block, () => {
    if (op.whole) {
      const v = ev(view, parts[0], data, op)
      if (isNone(v)) { el.removeAttribute(name); return }
      const s = String(v)
      if (el.getAttribute(name) !== s) el.setAttribute(name, s)
      return
    }
    let s = ''
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      s += typeof p === 'string' ? p : String(ev(view, p, data, op))
    }
    if (el.getAttribute(name) !== s) el.setAttribute(name, s)
  })
}

function bindIf(op, anchor, view, data, block) {
  let inst = null
  anchor.__dyn = { nodes: () => (inst ? instNodes(inst).concat(anchor) : [anchor]) }
  effect(block, () => {
    const ok = !!ev(view, op, data, op)
    if (ok) {
      if (!inst) {
        inst = untrack(() => instantiate(op.sub, view, data, block))
        instMove(inst, anchor.parentNode, anchor)
      }
    }
    else if (inst) {
      instRemove(inst)
      inst.block.dispose()
      inst = null
    }
  })
}

function lis(arr) {
  const n = arr.length
  const res = new Array(n).fill(false)
  const tails = []
  const prev = new Array(n).fill(-1)
  for (let i = 0; i < n; i++) {
    const v = arr[i]
    if (v < 0) continue
    let lo = 0, hi = tails.length
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[tails[mid]] < v) lo = mid + 1; else hi = mid }
    if (lo > 0) prev[i] = tails[lo - 1]
    tails[lo] = i
  }
  let k = tails.length ? tails[tails.length - 1] : -1
  while (k >= 0) { res[k] = true; k = prev[k] }
  return res
}

// прототип строки - реактивный прокси: обычное присваивание ушло бы в его set-ловушку и записало бы в state
function own(o, k, v) { Object.defineProperty(o, k, { value: v, writable: true, enumerable: true, configurable: true }) }

function bindFor(op, anchor, view, data, block) {
  const { vname, kname, trace } = op
  let rows = new Map()
  let order = []
  anchor.__dyn = {
    nodes() {
      const out = []
      for (const r of order) out.push(...instNodes(r.inst))
      out.push(anchor)
      return out
    },
  }
  const scratch = trace ? Object.create(data) : null
  if (trace) { own(scratch, vname, undefined); if (kname) own(scratch, kname, undefined) }

  const createRow = (item, key, kv) => {
    const rd = Object.create(data)
    own(rd, vname, item)
    let kh = null
    if (kname) {
      kh = { v: kv }
      Object.defineProperty(rd, kname, { get() { track(kh, 'v'); return kh.v }, enumerable: true, configurable: true })
    }
    const inst = instantiate(op.sub, view, rd, block)
    if (trace && inst.simple && inst.el.nodeType === 1) inst.el.setAttribute('data-id', key)
    if (stats) stats.rows++
    return { key, raw: toRaw(item), inst, kh, idx: 0, rd }
  }

  effect(block, () => {
    const t0 = stats ? performance.now() : 0
    const src = ev(view, op.listH, data, op)
    const items = []
    const kvs = []
    if (isNone(src)) { /* пусто */ }
    else if (Array.isArray(src)) {
      for (let i = 0, n = src.length; i < n; i++) { items.push(src[i]); kvs.push(i) }
    }
    else if (typeof src === 'object') {
      const ks = Object.keys(src)
      for (let i = 0; i < ks.length; i++) { items.push(src[ks[i]]); kvs.push(ks[i]) }
    }
    const n = items.length
    if (config.debug && n === 0 && Array.isArray(src)) report(`w-for «${op.list}»: массив пустой`, { view, expr: op.list })

    // ключи вычисляются внутри эффекта: смена ключа перестраивает список
    const keys = new Array(n)
    if (trace) {
      const seen = new Set()
      for (let i = 0; i < n; i++) {
        scratch[vname] = items[i]
        if (kname) scratch[kname] = kvs[i]
        let k = ev(view, op.traceH, scratch, op)
        if (seen.has(k)) { let j = 1; while (seen.has(k + '#' + j)) j++; k = k + '#' + j }
        seen.add(k)
        keys[i] = k
      }
    }
    else for (let i = 0; i < n; i++) keys[i] = kvs[i]

    untrack(() => {
      const parent = anchor.parentNode
      const next = new Map()
      const newRows = new Array(n)

      if (order.length === 0) {
        // первый рендер: всё одним фрагментом
        const f = anchor.ownerDocument.createDocumentFragment()
        for (let i = 0; i < n; i++) {
          const r = createRow(items[i], keys[i], kvs[i])
          r.idx = i
          newRows[i] = r
          next.set(r.key, r)
          instMove(r.inst, f, null)
        }
        parent.insertBefore(f, anchor)
        rows = next
        order = newRows
        return
      }

      const old = rows
      const srcIdx = new Array(n)
      let refresh = null
      for (let i = 0; i < n; i++) {
        const r = old.get(keys[i])
        if (r) {
          old.delete(keys[i])
          const raw = toRaw(items[i])
          // тот же ключ, но другой объект (например, список перезагружен с сервера): строка остаётся, в неё подставляется новый элемент
          if (r.raw !== raw) { r.raw = raw; r.rd[vname] = items[i]; (refresh || (refresh = [])).push(r) }
          if (r.kh && r.kh.v !== kvs[i]) { r.kh.v = kvs[i]; trigger(r.kh, 'v', 'set') }
          newRows[i] = r
          srcIdx[i] = r.idx
        }
        else { newRows[i] = null; srcIdx[i] = -1 }
      }
      // что осталось в old, того больше нет
      old.forEach((r) => { instRemove(r.inst); r.inst.block.dispose() })

      const stable = lis(srcIdx)
      let ref = anchor
      for (let i = n - 1; i >= 0; i--) {
        let r = newRows[i]
        if (!r) { r = newRows[i] = createRow(items[i], keys[i], kvs[i]); instMove(r.inst, parent, ref) }
        else if (!stable[i]) instMove(r.inst, parent, ref)
        r.idx = i
        next.set(r.key, r)
        ref = instFirst(r.inst)
      }
      rows = next
      order = newRows
      // строки с подменённым элементом перечитывают свои привязки (их эффекты заново соберут зависимости на новом объекте)
      if (refresh) {
        const list = []
        refresh.forEach(r => collectAll(r.inst.block, list))
        runEffects(list)
      }
    })
    if (stats) stats.list += performance.now() - t0
  })
}

function bindSlot(op, anchor, view, data, block) {
  const slot = view.__slot
  let inst = null
  anchor.__dyn = { nodes: () => (inst ? instNodes(inst).concat(anchor) : [anchor]) }
  untrack(() => {
    if (slot && slot.plan) {
      let sd = slot.data
      const keys = Object.keys(op.props)
      if (keys.length) {
        sd = Object.create(slot.data)
        keys.forEach((k) => {
          const exp = op.props[k]
          Object.defineProperty(sd, k, { get: () => ev(view, exp, data, op), enumerable: true, configurable: true })
        })
      }
      inst = instantiate(slot.plan, slot.view, sd, slot.block, { static: slot.static })
      block.onDispose(() => inst.block.dispose())
    }
    else if (op.fallback) {
      inst = instantiate(op.fallback, view, data, block)
    }
    if (inst) instMove(inst, anchor.parentNode, anchor)
  })
}

// ---------- компоненты ----------
function bindComp(op, host, view, data, block) {
  if (op.name === 'w-static') {
    if (op.slotPlan) {
      const inst = untrack(() => instantiate(op.slotPlan, view, data, block, { static: true }))
      instMove(inst, host, null)
    }
    return
  }
  const entry = view.__component(op.name)
  if (!entry) return
  const start = (proto) => { if (!block.disposed) untrack(() => mountComponent(proto, op, host, view, data, block)) }
  if (entry.remote) {
    const r = entry.remote
    r.load()
    if (r.view) start(r.view)
    else {
      const w = () => start(r.view)
      r.waiters.add(w)
      block.onDispose(() => r.waiters.delete(w))
    }
  }
  else start(entry.view)
}

function mountComponent(proto, op, host, view, data, block) {
  const parentPath = view.__path || ['root']
  if (parentPath.length > config.maxDepth) {
    report(`Превышена глубина вложенности компонентов (${config.maxDepth}), «${op.name}» не создан`, { level: 'error', view, hint: 'Рекурсивный компонент без условия выхода: остановите рекурсию через w-if.' })
    host.setAttribute('data-wex-error', 'max-depth')
    return
  }
  const comp = proto.clone()
  comp.__path = parentPath.concat(op.name)
  const outside = {}
  comp.__outside = outside
  let mounted = false

  for (const attr in op.attrs) {
    const exp = op.attrs[attr]
    const c = attr.charCodeAt(0)
    if (c === 58) {   // :prop
      const key = camelCase(attr.slice(1))
      effect(block, () => {
        const v = ev(view, exp, data, { attr })
        if (isNone(v)) report(`Проп «${attr.slice(1)}» компонента «${op.name}» получил ${v}`, { view, attr, expr: exp })
        if (!mounted) outside[key] = v
        else comp.__setProp(key, v)
      })
    }
    else if (c === 64) {   // @event
      const event = camelCase(attr.slice(1))
      const [fname, params] = parseKey(exp)
      outside['@' + event] = function (...args) {
        const fn = view.fn(fname)
        if (!fn) return
        const st = view.state
        const res = params ? fn.call(view, st, ...params.map(p => ev(view, p, data))) : fn.call(view, st)
        if (isFunction(res)) return res.apply(this, args)
      }
    }
    else if (attr[0] !== '_') outside[camelCase(attr)] = exp
  }

  comp.__slot = op.slotPlan ? { plan: op.slotPlan, view, data, block } : null
  comp.mount(host)
  mounted = true
  block.onDispose(() => comp.destroy())
}

// ---------- события и встроенные директивы ----------
const NON_BUBBLING = ['focus', 'blur', 'mouseenter', 'mouseleave', 'pointerenter', 'pointerleave', 'scroll', 'load', 'error', 'toggle']

function bindOn(op, el, view, data) {
  const h = el.__wOn || (el.__wOn = {})
  h[op.event] = { view, fname: op.fname, params: op.params, data }
  view.__delegate(op.event)
}

const BIND_CHANGE = '[type=checkbox],[type=radio],[type=color],[type=date],[type=datetime-local],[type=week],[type=file],select'

function bindBuiltin(op, el, view, data, block) {
  const expr = op.expr
  switch (op.t) {
    case 'w-class': {
      let prev = []
      effect(block, () => {
        const obj = ev(view, op, data, op) || {}
        const next = []
        for (const key in obj) if (obj[key]) key.split(/\s+/).filter(Boolean).forEach(c => next.push(c))
        prev.forEach((c) => { if (next.indexOf(c) === -1) el.classList.remove(c) })
        next.forEach(c => el.classList.add(c))
        prev = next
      })
      return
    }
    case 'w-value':
      return effect(block, () => {
        const v = ev(view, op, data, op)
        const s = isNone(v) ? '' : String(v)
        if (el.value !== s) el.value = s
      })
    case 'w-disabled': return effect(block, () => { el.disabled = !!ev(view, op, data, op) })
    case 'w-checked': return effect(block, () => { el.checked = !!ev(view, op, data, op) })
    case 'w-selected': return effect(block, () => { el.selected = !!ev(view, op, data, op) })
    case 'w-id':
      return effect(block, () => {
        const v = ev(view, op, data, op)
        if (v === null) el.removeAttribute('id')
        else if (v !== undefined) el.setAttribute('id', v)
      })
    case 'w-src':
      return effect(block, () => {
        const v = ev(view, op, data, op)
        if (isNone(v)) { report(`w-src получил ${v}: src не выставлен`, { view, attr: 'w-src', expr }); return }
        el.setAttribute('src', v)
      })
    case 'w-html':
      return effect(block, () => {
        const v = ev(view, expr.replace(/^\{\{\s*|\s*\}\}$/g, ''), data, op)
        el.innerHTML = sanitizeSvg(isNone(v) ? '' : String(v))
      })
    case 'w-bind': {
      const checkbox = el.matches('[type=checkbox]')
      const radio = el.matches('[type=radio]')
      effect(block, () => {
        const v = ev(view, op, data, op)
        if (checkbox) el.checked = !!v
        else if (radio) el.checked = v === el.value
        else {
          const s = isNone(v) ? '' : String(v)
          if (el.value !== s) el.value = s
        }
      })
      el.addEventListener(el.matches(BIND_CHANGE) ? 'change' : 'input', (e) => {
        const fn = view.__scope().compile(expr)
        if (fn.assign) fn.assign(data, checkbox ? el.checked : e.target.value)
      })
      return
    }
    case 'w-transition': {
      const transition = expr || 'opacity 0.25s ease'
      const finalTransition = /(opacity|all|transform)/.test(transition) ? transition : `opacity ${transition}`
      el.style.transition = finalTransition
      el.style.opacity = '0'
      const show = () => { el.style.opacity = '1' }
      if (document.hidden) setTimeout(show, 0)
      else requestAnimationFrame(() => requestAnimationFrame(show))
      setTimeout(show, 500)
      const originalRemove = el.remove
      el.remove = function () {
        el.style.opacity = '0'
        const d = getComputedStyle(el).transitionDuration
        const ms = d.includes('ms') ? parseFloat(d) : parseFloat(d) * 1000
        setTimeout(() => originalRemove.call(el), ms || 250)
      }
      block.onDispose(() => { el.remove = originalRemove })
    }
  }
}

// directive(name, fn)  fn(el, b) выполняется в эффекте, может вернуть cleanup
// directive(name, { mounted(el, b), updated(el, b), unmounted(el, b) })   b.get() читает выражение (с отслеживанием)
function bindDir(op, el, view, data, block) {
  const def = view.__directive(op.name)
  if (!def) return
  const b = {
    el, view, expr: op.expr, data, store: {},
    get state() { return view.state },
    get: () => ev(view, op.expr, data, op),
    parse: e => ev(view, e, data, op),
  }
  if (def.fn) {
    let clean = null
    effect(block, () => {
      if (clean) clean()
      const r = def.fn.call(b, el, b)
      clean = isFunction(r) ? r : null
    })
    block.onDispose(() => { if (clean) clean() })
  }
  else {
    let mounted = false
    effect(block, () => {
      if (!mounted) { mounted = true; if (def.mounted) def.mounted.call(b, el, b) }
      else if (def.updated) def.updated.call(b, el, b)
    })
    if (def.unmounted) block.onDispose(() => def.unmounted.call(b, el, b))
  }
}

// ---------- удалённые компоненты ----------
const nativeImport = new Function('u', 'return import(u)')
const remoteCache = {}

function startLoad(entry, url) {
  if (entry.started) return entry
  entry.started = true
  const fetchText = async (tries = 3) => {
    for (let i = 0; ; i++) {
      try {
        const r = await fetch(url)
        if (!r.ok) throw new Error(`Wex: cannot load component ${url} (${r.status})`)
        return await r.text()
      }
      catch (e) {
        if (i >= tries - 1) throw e
        await new Promise(res => setTimeout(res, 300 * 2 ** i))
      }
    }
  }
  fetchText().then(async (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const tpl = doc.querySelector('template')
    if (!tpl) throw new Error(`Wex: no <template> in ${url}`)
    const inner = tpl.innerHTML
    // то, что раньше было $tpl: объект с .state(init) и .vm()
    const T = { state: init => createView(inner, init), vm: () => createView(inner, () => ({})) }
    const code = doc.querySelector('script[type="module"]')?.textContent
    let v
    if (code) {
      const blobUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
      try { v = (await nativeImport(blobUrl)).default(T) }
      finally { URL.revokeObjectURL(blobUrl) }
    }
    else v = T.vm()
    if (!(v instanceof View)) throw new Error(`Wex: ${url} must export default a function returning a view`)
    entry.view = v
    const ws = [...entry.waiters]
    entry.waiters.clear()
    ws.forEach((w) => { try { w() } catch (e) { console.error(e) } })
  }).catch((e) => { entry.started = false; console.error(e) })
  return entry
}

function loadRemote(url, { lazy = false } = {}) {
  let entry = remoteCache[url]
  if (!entry) entry = remoteCache[url] = { view: null, waiters: new Set(), started: false, load: () => startLoad(entry, url) }
  if (!lazy) entry.load()
  return entry
}
export function preloadComponent(url) { return loadRemote(url) }

// ---------- view ----------
let viewSeq = 0
function cloneState(value) {
  if (Array.isArray(value)) return value.map(cloneState)
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    const out = {}
    Object.keys(value).forEach((k) => { out[k] = cloneState(value[k]) })
    return out
  }
  return value
}

function createView(html, initState = {}, tplEl = null, attrsExpr = null) {
  const id = (tplEl && (tplEl.id || tplEl.getAttribute('w-id'))) || ('v' + (++viewSeq))
  const view = new View()
  const components = new Map(globalComponents)
  const directives = new Map(globalDirectives)
  const ownFilters = {}
  let scope = globalScope
  let sigCache = null
  let envCache = null

  let state = null
  let outside = null
  let root = null
  let rootInst = null
  let isMounted = false
  let isUnmounted = false
  const fns = {}
  const handlers = []   // $-события: { event, fn, once }
  const actions = []    // DOM-события на корне: { event, selector, fn, once, listener }
  let unsubscribe = null
  const delegated = new Map()

  let held = 0
  const skipped = new Set()
  let changePending = false
  let lastInfo = null
  let prevented = false
  let gateId = -1
  let gateOpen = true

  const invalidate = () => { sigCache = null; envCache = null }

  // ---- события ----
  function emit(event, ...args) {
    if (outside) {
      const lower = ('@' + event).toLowerCase()
      const key = ('@' + event) in outside ? '@' + event : Object.keys(outside).find(k => k.toLowerCase() === lower)
      if (key && isFunction(outside[key])) outside[key](...args)
    }
    if (event[0] !== '$') return
    handlers.slice().forEach((h) => {
      if (h.event !== event) return
      if (h.once) handlers.splice(handlers.indexOf(h), 1)
      h.fn.call(view, state, ...args)
    })
  }

  function attach(a) {
    if (!root || a.listener) return
    const direct = NON_BUBBLING.indexOf(a.event) !== -1
    a.listener = function (e) {
      let target = root
      if (a.selector) {
        target = e.target.closest ? e.target.closest(a.selector) : null
        if (!target || !root.contains(target)) return
      }
      const cb = a.fn.call(view, state)
      let res
      if (isFunction(cb)) res = cb.call(target, e)
      if (a.once) view.off(a.event, a.selector, a.fn)
      return res
    }
    root.addEventListener(a.event, a.listener, direct)
    a.capture = direct
  }
  function detach(a) {
    if (root && a.listener) root.removeEventListener(a.event, a.listener, a.capture)
    a.listener = null
  }

  function bindArgs(args, once) {
    const info = [...args]
    const fn = info.pop()
    const [event, selector] = info
    if (event[0] === '$') {
      handlers.push({ event, fn, once })
      if (event === '$change') ensureSubscribed()
    }
    else {
      const a = { event, selector, fn, once, listener: null }
      actions.push(a)
      if (isMounted) attach(a)
    }
    return view
  }

  // w-on: один слушатель на событие на корень view, обработчик ищется по expando элемента
  function delegate(event) {
    if (delegated.has(event) || !root) return
    const direct = NON_BUBBLING.indexOf(event) !== -1
    const r = root
    const listener = (e) => {
      for (let el = e.target; el && el !== r; el = el.parentNode) {
        if (direct && el !== e.target) break
        const h = el.__wOn && el.__wOn[event]
        if (!h || h.view !== view) continue
        const fn = view.fn(h.fname)
        if (!fn) continue
        const res = h.params
            ? fn.call(view, state, ...h.params.map(p => ev(view, p, h.data)))
            : fn.call(view, state)
        const out = isFunction(res) ? res.call(el, e) : res
        if (out === false) { e.preventDefault(); e.stopPropagation() }
        if (e.cancelBubble) break
      }
    }
    r.addEventListener(event, listener, direct)
    delegated.set(event, { listener, direct, root: r })
  }

  // ---- state ----
  function assignProps(obj) {
    const lower = {}
    Object.keys(state).forEach((k) => { lower[k.toLowerCase()] = k })
    for (const key in obj) if (key[0] !== '@') setProp(key, obj[key], lower)
  }
  function setProp(key, value, lower) {
    if (!lower) { lower = {}; Object.keys(state).forEach((k) => { lower[k.toLowerCase()] = k }) }
    const real = key in state ? key : lower[key.toLowerCase()]
    if (!real) return
    const prev = toRaw(state[real])
    const next = toRaw(value)
    if (prev === next) return
    if (!isReactive(value) && isEqual(prev, next)) return
    state[real] = next
  }

  function init() {
    const next = isFunction(initState) ? initState.call(view) : initState
    if (!next || typeof next !== 'object') throw new Error('initState should must be an object')
    state = reactive(next)
    if (outside) assignProps(outside)
    if (state.storage) ensureSubscribed()
    emit('$init')
  }

  function ensureSubscribed() {
    if (unsubscribe || !state) return
    unsubscribe = subscribe(state, (info) => {
      lastInfo = info
      if (changePending) return
      changePending = true
      Promise.resolve().then(flushChange)
    })
  }
  function flushChange() {
    if (!changePending) return
    changePending = false
    if (!state) return
    let flag = true
    emit('$change', state, lastInfo, () => { flag = false })
    if (flag) VMLocalStorage.reloadJqvmLocalStorage(state, '$change')
    else prevented = true
  }
  function shouldUpdate() {
    let flag = true
    emit('$update', state, () => { flag = false })
    return flag
  }

  // вызывается планировщиком перед запуском эффектов этого view
  view.__gate = (flushId) => {
    if (gateId === flushId) return gateOpen
    gateId = flushId
    let open = held === 0
    if (open) {
      flushChange()
      open = !prevented
      prevented = false
      if (open) open = shouldUpdate()
    }
    return (gateOpen = open)
  }
  view.skipped = skipped

  // ---- рендер ----
  function render() {
    const plan = getPlan(html, view)
    rootInst = instantiate(plan, view, state, null)
    root.textContent = ''
    instMove(rootInst, root, null)
    if (attrsExpr) {
      effect(rootInst.block, () => {
        const props = ev(view, attrsExpr, state) || {}
        for (const key in props) {
          const value = props[key]
          if (key === 'class') String(value).split(' ').filter(Boolean).forEach(c => root.classList.add(c))
          else if (key === 'style') {
            if (isObject(value)) Object.assign(root.style, value)
            else if (isString(value)) root.setAttribute('style', value)
          }
          else root.setAttribute(key, value)
        }
      })
    }
    emit('$render')
  }

  function mount(el) {
    if (isMounted) {
      if (!el || el === root) return view
      view.unmount()
    }
    if (!isUnmounted) init()
    let target = typeof el === 'string' ? document.querySelector(el) : el
    if (!target) {
      if (tplEl && tplEl.parentNode) {
        target = document.createElement('div')
        tplEl.after(target)
      }
      else throw new Error('el should must be passed by view.mount')
    }
    root = target
    root.setAttribute('w-name', id)
    render()
    actions.forEach(attach)
    VMLocalStorage.reloadJqvmLocalStorage(state, '$mount')
    isMounted = true
    isUnmounted = false
    emit('$mount', state)
    return view
  }

  function unmount() {
    if (!isMounted) return view
    emit('$unmount')
    actions.forEach(detach)
    delegated.forEach(({ listener, direct, root: r }, event) => r.removeEventListener(event, listener, direct))
    delegated.clear()
    if (rootInst) rootInst.block.dispose()
    rootInst = null
    skipped.clear()
    root.textContent = ''
    root.removeAttribute('w-name')
    root = null
    isMounted = false
    isUnmounted = true
    return view
  }

  function destroy() {
    emit('$beforeDestroy')
    unmount()
    if (unsubscribe) unsubscribe()
    unsubscribe = null
    emit('$destroy')
    state = null
    handlers.length = 0
    actions.length = 0
  }

  function forceUpdate() {
    if (!isMounted || !rootInst) return
    const list = []
    collectEffects(rootInst.block, view, list)
    skipped.forEach((e) => { if (list.indexOf(e) === -1) list.push(e) })
    skipped.clear()
    runEffects(list)
  }

  function update(next) {
    if (next === true) { forceUpdate(); return view }
    if (state && next) {
      if (isFunction(next)) {
        const res = next(state)
        if (isObject(res)) Object.assign(state, res)
      }
      else if (isObject(next)) Object.assign(state, next)
    }
    return view
  }

  function hold() { held++; return view }
  function release() {
    if (held > 0 && --held === 0) {
      flush()
      if (skipped.size) {
        const list = Array.from(skipped)
        skipped.clear()
        runEffects(list)
      }
    }
    return view
  }

  function fn(name, action) {
    if (!action) return fns[name]
    fns[name] = action
    return view
  }

  function clone() {
    const nv = createView(html, isFunction(initState) ? initState : cloneState(initState), tplEl, attrsExpr)
    each(fns, (action, name) => nv.fn(name, action))
    handlers.forEach(h => nv.__addHandler(h))
    actions.forEach(a => nv.on(...[a.event, a.selector, a.fn].filter(Boolean)))
    components.forEach((entry, name) => { if (globalComponents.get(name) !== entry) nv.__setComponent(name, entry) })
    directives.forEach((def, name) => { if (globalDirectives.get(name) !== def) nv.directive(name, def) })
    Object.keys(ownFilters).forEach(k => nv.filter(k, ownFilters[k]))
    handlers.forEach((h) => { if (h.event === '$clone') h.fn.call(view, state, nv) })
    return nv
  }
  function each(obj, cb) { Object.keys(obj).forEach(k => cb(obj[k], k)) }

  Object.assign(view, {
    mount, unmount, destroy, update, hold, release, emit, clone, fn, method: fn,
    on(...a) { return bindArgs(a, false) },
    once(...a) { return bindArgs(a, true) },
    off(...args) {
      const info = [...args]
      const f = info.pop()
      const [event, selector] = info
      if (event[0] === '$') {
        const i = handlers.findIndex(h => h.event === event && h.fn === f)
        if (i > -1) handlers.splice(i, 1)
      }
      else {
        const i = actions.findIndex(a => a.event === event && a.selector === selector && a.fn === f)
        if (i > -1) { detach(actions[i]); actions.splice(i, 1) }
      }
      return view
    },
    find(sel) { return root ? Array.from(root.querySelectorAll(sel)) : [] },
    component(name, src, opts) { components.set(name.toLowerCase(), normComponent(name, src, opts)); invalidate(); return view },
    directive(name, def) { directives.set(name, normDirective(def)); invalidate(); return view },
    filter(name, f) {
      ownFilters[name] = f
      scope = new ScopeX({}, { filters: Object.assign({}, globalScope.filters, ownFilters) })
      return view
    },
    plugin(f) {
      const life = f.call({ view, get state() { return state } })
      if (life) Object.keys(life).forEach(ev2 => view.on(ev2, life[ev2]))
      return view
    },
    // ---- внутреннее ----
    __scope: () => scope,
    __component: name => components.get(name),
    __setComponent(name, entry) { components.set(name, entry); invalidate() },
    __directive: name => directives.get(name),
    __addHandler(h) { handlers.push({ ...h }) },
    __delegate: delegate,
    __setProp(key, value) { if (!state) { outside = outside || {}; outside[key] = value } else setProp(key, value) },
    __sig() {
      if (sigCache === null) sigCache = Array.from(components.keys()).sort().join() + '|' + Array.from(directives.keys()).sort().join()
      return sigCache
    },
    __env() {
      return envCache || (envCache = { comps: new Set(components.keys()), dirs: new Set(directives.keys()) })
    },
  })
  Object.defineProperties(view, {
    state: { get: () => state },
    root: { get: () => root },
    // outside выставляет родитель до mount
    __outside: { get: () => outside, set: (v) => { outside = v } },
    __slot: { value: null, writable: true },
    __path: { value: null, writable: true },
  })
  return view
}

// view('<p>{{ x }}</p>', () => ({ x: 1 }))   или   view(document.querySelector('template#t'), init)   или   view('#t', init)
export function view(source, initState, opts = {}) {
  let el = null
  let html = source
  if (typeof source !== 'string') { el = source; html = el.innerHTML }
  else if (source.indexOf('<') === -1 && source.indexOf('{{') === -1) {
    el = document.querySelector(source)
    if (!el) throw new Error(`Wex: template ${source} not found`)
    html = el.innerHTML
  }
  const attrsExpr = opts.attrs || (el && el.getAttribute && el.getAttribute('attrs')) || null
  return createView(html, initState, el, attrsExpr)
}


export default { view, component, directive, filter, preloadComponent, config, report, reactive, toRaw, isReactive, untrack, VERSION: WEX_VERSION }
if (typeof window !== 'undefined') window.Wex = { __flush: flush, view, component, directive, filter, preloadComponent, config, report, reactive, toRaw, isReactive, untrack, VERSION: WEX_VERSION }
console.log('[Wex]: загружена версия: ' + WEX_VERSION)