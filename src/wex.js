export const WEX_VERSION = '3.1.1'

import { ScopeX } from './vendor/ScopeX'
import { isNone, isFunction, isString, isObject, isEqual, getNodeAttrs, camelCase, parseKey, parseMustache, sanitizeSvg } from './utils.js'
import { VMLocalStorage } from './store.js'
import { reactive, toRaw, isReactive, subscribe, Effect, untrack, track, trigger, flush, runEffects, readList, runLeaf, mutationCount, setAfterFlush } from './reactive.js'

export { reactive, toRaw, isReactive, untrack, flush as __flush }

// jQuery подключается через useJQuery($) (или находится в window.jQuery): нужен для $('#tpl').state(...),
// старых директив/компонентов ($el в compile/affect), jQuery-событий и view.find()
let $ = null
export const setDollar = (d) => { $ = d }
export const getDollar = () => $

export const config = {
  autoForce: false,   // true: view.update(fn) без мутаций через прокси перерисовывает всё view (поведение Wex 2)
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

// directive(name, compile, affect, priority)  как в Wex 2:
//   compile($el, attrs)       на элементе при создании; может вернуть новую разметку (строка, узлы, jQuery)
//   affect($el, attrs)        после вставки в DOM и при каждом изменении прочитанных данных; может вернуть revoke()
//   this = { $root, scope, view, component }  (в compile: { scope, view, compile, interpolate })
// directive(name, { compile, mounted($el, attrs, data), updated(...), unmounted($el, data), priority })
function normDirective(compile, affect) {
  if (compile && typeof compile === 'object' && !(compile instanceof View)) {
    return { compile: compile.compile || null, affect: null, life: compile }
  }
  if (compile && !isFunction(compile)) throw new Error('Wex: directive(name, compile, affect, priority)')
  return { compile: compile || null, affect: affect || null, life: null }
}
export function directive(name, compile, affect, priority) { globalDirectives.set(name, normDirective(compile, affect)); globalVer++ }

// component(name, View) | component(name, 'url', { lazy }) | component(name, compile($el, attrs, slot), affect)
function normComponent(name, src, extra) {
  if (src instanceof View) return { view: src }
  if (isString(src)) return { remote: loadRemote(src, extra) }
  if (isFunction(src)) return { legacy: { compile: src, affect: isFunction(extra) ? extra : null } }
  throw new Error(`Wex: component("${name}") принимает View, URL или функцию compile($el, attrs, slot)`)
}
export function component(name, src, extra) { globalComponents.set(name.toLowerCase(), normComponent(name, src, extra)); globalVer++ }

// ---------- очередь «после вставки в DOM»: affect/mounted старых директив ----------
let postQ = []
let postDepth = 0
export function postTask(fn) {
  postQ.push(fn)
  if (postDepth === 0) Promise.resolve().then(runPost)
}
export function runPost() {
  if (postDepth) return
  while (postQ.length) {
    const q = postQ
    postQ = []
    q.forEach((f) => { try { f() } catch (e) { console.error(e) } })
  }
}
setAfterFlush(runPost)

// ---------- блоки: владелец эффектов и очистки ----------
class Block {
  constructor(parent, view) {
    this.view = view
    this.parent = parent || null
    this.effects = null
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
    if (ef) for (let i = 0; i < ef.length; i++) ef[i].stop()
    if (this.children) Array.from(this.children).forEach(c => c.dispose())
    if (this.cleanups) this.cleanups.forEach((f) => { try { f() } catch (e) { console.error(e) } })
    if (this.linked && this.parent && this.parent.children) this.parent.children.delete(this)
    this.effects = null
  }
}

export function effect(block, fn) {
  if (block.static) { untrack(fn); return null }
  const e = new Effect(fn)
  e.view = block.view
  e.run()
  // ничего реактивного не прочитано (константа): эффект больше никогда не сработает, держать его незачем
  if (e.deps === null || e.deps.length === 0) { e.active = false; return null }
  ;(block.effects || (block.effects = [])).push(e)
  block.link()
  return e
}

function leaf(block, run, a, b, c, d) {
  if (block.static) { untrack(() => run(a, b, c, d)); return }
  const e = runLeaf(run, a, b, c, d)
  if (e === null) return
  e.view = block.view
  ;(block.effects || (block.effects = [])).push(e)
  block.link()
}

function collectAll(block, out) {
  if (block.effects) block.effects.forEach((e) => { if (e.active) out.push(e) })
  if (block.children) block.children.forEach(c => collectAll(c, out))
}

function collectEffects(block, view, out) {
  if (block.effects) block.effects.forEach((e) => { if (e.active && e.view === view) out.push(e) })
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

export function ev(view, h, data, ctx) {
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
// w-for="todo in todos" | "todo, index in todos" | "... traceby todo.id"; ключ также можно задать атрибутом w-key="todo.id"
const WFOR_RE = /^\s*([A-Za-z_$][\w$]*)\s*(?:,\s*([A-Za-z_$][\w$]*))?\s+in\s+([\s\S]+?)(?:\s+traceby\s+([\s\S]+?))?\s*$/
const BUILTIN = new Set(['w-class', 'w-value', 'w-disabled', 'w-checked', 'w-selected', 'w-bind', 'w-src', 'w-html', 'w-id', 'w-on', 'w-transition'])

export function getPlan(html, view) {
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
  && !ops.some(o => o.path.length === 1 && (o.t === 'if' || o.t === 'for' || o.t === 'slot' || o.replace))
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
    const m = WFOR_RE.exec(attr)
    if (!m) throw new Error('w-for should match formatter `value, index in data` (ключ: `traceby expr` или атрибут w-key="expr")')
    const vname = m[1]
    const kname = m[2]
    const list = m[3].trim()
    const trace = (m[4] || el.getAttribute('w-key') || '').trim() || undefined
    const row = el.cloneNode(true)
    row.removeAttribute('w-for')
    row.removeAttribute('w-key')
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
    const entry = env.comps.get(tag)
    const attrs = getNodeAttrs(el)
    const slotHtml = entry && entry.legacy ? el.innerHTML : null
    ;[...el.attributes].forEach((a) => { if (a.name[0] === ':' || a.name[0] === '@') el.removeAttribute(a.name) })
    const f = doc.createDocumentFragment()
    while (el.firstChild) f.appendChild(el.firstChild)
    const has = f.childNodes.length && (f.childElementCount || f.textContent.trim())
    const slotPlan = has ? makePlan(f, env) : null
    planAttrs(el, path, ops, env)
    // legacy-компонент и компонент с другим корневым тегом заменяют свой элемент
    const replace = !!entry && (!!entry.legacy || (!!entry.view && entry.view.tag !== 'template'))
    ops.push({ t: 'comp', path, name: tag, attrs, slotPlan, slotHtml, replace })
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
      // атрибут директивы остаётся в DOM (плагины ищут по нему); attrs - слепок всех атрибутов элемента
      const def = env.dirs.get(name)
      ops.push({ t: 'dir', path, name, expr: value, attrs: getNodeAttrs(el), replace: !!def.compile })
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

// путь до узла превращается в цепочку firstChild/nextSibling: на каждый шаблон генерируется одна функция
function buildResolver(plan) {
  const ops = plan.ops
  if (!ops.length) return null
  const start = plan.rootEl ? 1 : 0
  const base = plan.rootEl ? 'el' : 'f'
  const parts = ops.map((op) => {
    let e = base
    const p = op.path
    for (let j = start; j < p.length; j++) {
      if (p[j] > 8) e += '.childNodes[' + p[j] + ']'
      else { e += '.firstChild'; for (let k = 0; k < p[j]; k++) e += '.nextSibling' }
    }
    return e
  })
  return new Function(base, 'return [' + parts.join(',') + ']')
}

export function instantiate(plan, view, data, parentBlock, opts) {
  const block = new Block(parentBlock, view)
  if (opts && opts.static) block.static = true
  const ops = plan.ops
  const n = ops.length
  let inst
  if (plan.rootEl) {
    const el = plan.rootEl.cloneNode(true)
    inst = { frag: null, block, rootItems: null, simple: true, el }
    if (n) {
      const refs = (plan.res === undefined ? (plan.res = buildResolver(plan)) : plan.res)(el)
      for (let i = 0; i < n; i++) applyOp(ops[i], refs[i], view, data, block)
    }
    return inst
  }
  const frag = plan.frag.cloneNode(true)
  const refs = n ? (plan.res === undefined ? (plan.res = buildResolver(plan)) : plan.res)(frag) : null
  const rootItems = Array.from(frag.childNodes)
  inst = { frag, block, rootItems, simple: false, el: null }
  for (let i = 0; i < n; i++) applyOp(ops[i], refs[i], view, data, block)
  return inst
}

export function instNodes(inst) {
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

// редкие операции (встроенные w-директивы, w-on, старые директивы и компоненты) регистрирует directives.js
export const OPS = Object.create(null)

function applyOp(op, node, view, data, block) {
  switch (op.t) {
    case 'text': return bindText(op, node, view, data, block)
    case 'attr': return bindAttr(op, node, view, data, block)
    case 'if': return bindIf(op, node, view, data, block)
    case 'for': return bindFor(op, node, view, data, block)
    case 'slot': return bindSlot(op, node, view, data, block)
    case 'comp': return bindComp(op, node, view, data, block)
    default: return OPS[op.t](op, node, view, data, block)
  }
}

function textRun(op, node, view, data) {
  const parts = op.parts
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
}
function bindText(op, node, view, data, block) { leaf(block, textRun, op, node, view, data) }

function attrRun(op, el, view, data) {
  const { name, parts } = op
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
}
function bindAttr(op, el, view, data, block) { leaf(block, attrRun, op, el, view, data) }

function bindIf(op, anchor, view, data, block) {
  let inst = null
  if (op.path.length === 1) anchor.__dyn = { nodes: () => (inst ? instNodes(inst).concat(anchor) : [anchor]) }
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
  // строка = { __proto__: данные родителя, [vname]: элемент }: литерал определяет свойство, не вызывая set-ловушку прокси
  const mk = op.mk || (op.mk = new Function('d', 'i', 'return {__proto__:d,' + JSON.stringify(vname) + ':i}'))
  const rows = new Map()   // ключ -> строка; живёт между рендерами, не пересоздаётся
  let order = []
  let stamp = 0
  // nodes() нужен только строкам, у которых эта операция стоит в корне (вложенным якорь не требуется)
  if (op.path.length === 1) {
    anchor.__dyn = {
      nodes() {
        const out = []
        for (const r of order) out.push(...instNodes(r.inst))
        out.push(anchor)
        return out
      },
    }
  }
  const scratch = trace ? mk(data, undefined) : null
  if (trace && kname) own(scratch, kname, undefined)

  const createRow = (item, key, kv) => {
    const rd = mk(data, item)
    let kh = null
    if (kname) {
      kh = { v: kv }
      Object.defineProperty(rd, kname, { get() { track(kh, 'v'); return kh.v }, enumerable: true, configurable: true })
    }
    const inst = instantiate(op.sub, view, rd, block)
    if (trace && key !== undefined && inst.simple && inst.el.nodeType === 1) inst.el.setAttribute('data-id', key)
    if (stats) stats.rows++
    return { key, raw: toRaw(item), inst, kh, idx: 0, rd, stamp }
  }
  const dropRow = (r) => { instRemove(r.inst); r.inst.block.dispose() }

  effect(block, () => {
    const t0 = stats ? performance.now() : 0
    const src = ev(view, op.listH, data, op)
    let items, kvs = null, n = 0
    if (Array.isArray(src)) {
      items = readList(src)
      n = items.length
    }
    else if (!isNone(src) && typeof src === 'object') {
      kvs = Object.keys(src)
      n = kvs.length
      items = new Array(n)
      for (let i = 0; i < n; i++) items[i] = src[kvs[i]]
    }
    else items = []
    if (config.debug && n === 0 && Array.isArray(src)) report(`w-for «${op.list}»: массив пустой`, { view, expr: op.list })

    // keys === null: ключ = индекс. Ключи считаются внутри эффекта: смена ключа перестраивает список
    let keys = kvs
    if (trace) {
      keys = new Array(n)
      const seen = new Set()
      for (let i = 0; i < n; i++) {
        scratch[vname] = items[i]
        if (kname) scratch[kname] = kvs ? kvs[i] : i
        let k = ev(view, op.traceH, scratch, op)
        if (seen.has(k)) { let j = 1; while (seen.has(k + '#' + j)) j++; k = k + '#' + j }
        seen.add(k)
        keys[i] = k
      }
    }

    untrack(() => {
      const parent = anchor.parentNode
      stamp++
      const newRows = new Array(n)

      if (rows.size === 0) {
        // первый рендер: всё одним фрагментом
        // маленький список вставляется сразу, фрагмент нужен только большому
        const f = n > 16 ? anchor.ownerDocument.createDocumentFragment() : parent
        const ref = n > 16 ? null : anchor
        for (let i = 0; i < n; i++) {
          const key = keys ? keys[i] : i
          const r = createRow(items[i], key, kvs ? kvs[i] : i)
          r.idx = i
          newRows[i] = r
          rows.set(key, r)
          instMove(r.inst, f, ref)
        }
        if (n > 16) parent.insertBefore(f, anchor)
        order = newRows
        return
      }

      const srcIdx = new Array(n)
      let refresh = null, inOrder = true, last = -1, hasNew = false, claimed = 0, removed = false
      for (let i = 0; i < n; i++) {
        const key = keys ? keys[i] : i
        let r = rows.get(key)
        if (r) {
          const raw = toRaw(items[i])
          if (r.raw !== raw) {
            if (typeof raw !== 'object' || raw === null) { dropRow(r); rows.delete(key); r = undefined; removed = true }   // примитив: проще пересоздать
            else { r.raw = raw; r.rd[vname] = items[i]; (refresh || (refresh = [])).push(r) }   // тот же ключ, новый объект: строка остаётся
          }
        }
        if (r) {
          r.stamp = stamp
          claimed++
          if (r.kh && r.kh.v !== (kvs ? kvs[i] : i)) { r.kh.v = kvs ? kvs[i] : i; trigger(r.kh, 'v', 'set') }
          newRows[i] = r
          const ix = r.idx
          srcIdx[i] = ix
          if (ix < last) inOrder = false
          last = ix
        }
        else { newRows[i] = null; srcIdx[i] = -1; hasNew = true }
      }
      // строки, которых больше нет в данных
      if (rows.size > claimed) {
        rows.forEach((r, key) => { if (r.stamp !== stamp) { dropRow(r); rows.delete(key); removed = true } })
      }

      if (hasNew || !inOrder || removed) {
        const stable = inOrder ? null : lis(srcIdx)
        let ref = anchor
        for (let i = n - 1; i >= 0; i--) {
          let r = newRows[i]
          if (!r) {
            const key = keys ? keys[i] : i
            r = newRows[i] = createRow(items[i], key, kvs ? kvs[i] : i)
            rows.set(key, r)
            instMove(r.inst, parent, ref)
          }
          else if (stable && !stable[i]) instMove(r.inst, parent, ref)
          r.idx = i
          ref = instFirst(r.inst)
        }
      }
      order = newRows
      // строки с подменённым объектом перечитывают свои привязки (эффекты заново соберут зависимости на новом объекте)
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
  if (op.path.length === 1) anchor.__dyn = { nodes: () => (inst ? instNodes(inst).concat(anchor) : [anchor]) }
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
  if (entry.legacy) return untrack(() => OPS.legacyComp(entry.legacy, op, host, view, data, block))
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

export function mountComponent(proto, op, host, view, data, block) {
  const parentPath = view.__path || ['root']
  if (parentPath.length > config.maxDepth) {
    report(`Превышена глубина вложенности компонентов (${config.maxDepth}), «${op.name}» не создан`, { level: 'error', view, hint: 'Рекурсивный компонент без условия выхода: остановите рекурсию через w-if.' })
    host.setAttribute('data-wex-error', 'max-depth')
    return null
  }
  const comp = proto.clone()
  comp.__path = parentPath.concat(op.name)
  comp.__parent = view
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

  // шаблон компонента не <template>: вместо хост-элемента встаёт его тег (с атрибутами и маркерами begin/end)
  let target = host
  if (proto.tag !== 'template') {
    const doc = host.ownerDocument
    target = doc.createElement(proto.tag)
    const attrs = Object.assign({}, getNodeAttrs(host), proto.attributes, { 'data-hoist': op.name })
    Object.keys(attrs).forEach((k) => { try { target.setAttribute(k, attrs[k]) } catch (e) { /* :prop и т.п. */ } })
    const begin = doc.createComment(` ${op.name} begin `)
    const end = doc.createComment(` ${op.name} end `)
    host.replaceWith(begin, target, end)
    host.__dyn = { nodes: () => [begin, target, end] }
  }
  comp.mount(target)
  mounted = true
  block.onDispose(() => comp.destroy())
  return comp
}

// ---------- события и встроенные директивы ----------
const NON_BUBBLING = ['focus', 'blur', 'mouseenter', 'mouseleave', 'pointerenter', 'pointerleave', 'scroll', 'load', 'error', 'toggle']

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
    const T = { state: init => createView(inner, init), vm: () => createView(inner, () => ({}), null, null, true) }
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
  if (value && typeof value === 'object' && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(Object.getPrototypeOf(value) || {}) === null)) {
    const out = {}
    Object.keys(value).forEach((k) => { out[k] = cloneState(value[k]) })
    return out
  }
  return value
}

// open: пропы создают ключи state (для удалённых компонентов без <script>, у которых нет своего начального state)
export function createView(html, initState = {}, tplEl = null, attrsExpr = null, open = false) {
  const id = (tplEl && (tplEl.id || tplEl.getAttribute('w-id'))) || ('v' + (++viewSeq))
  const view = new View()
  const components = new Map()   // только свои; глобальные и родительские ищутся при обращении (нужно для рекурсивных компонентов)
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

  let envVer = globalVer
  const invalidate = () => { sigCache = null; envCache = null; envVer = globalVer }
  const tick = {}   // «что-то изменилось в state»: на него подписаны affect/updated старых директив

  // ---- события ----
  const hasListeners = (event) => handlers.some(h => h.event === event)
      || !!($ && tplEl && $._data(tplEl, 'events') && $._data(tplEl, 'events')[event])

  function emit(event, ...args) {
    if (event[0] !== '$') {
      if (outside) {
        const lower = ('@' + event).toLowerCase()
        const key = ('@' + event) in outside ? '@' + event : Object.keys(outside).find(k => k.toLowerCase() === lower)
        if (key && isFunction(outside[key])) outside[key](...args)
      }
      return
    }
    handlers.slice().forEach((h) => {
      if (h.event !== event) return
      if (h.once) handlers.splice(handlers.indexOf(h), 1)
      h.fn.call(view, state, ...args)
    })
    // подписчики, повешенные через jQuery на элемент шаблона: $(tpl).on('$mount', (e, state) => ...)
    if ($ && tplEl) {
      const evs = $._data(tplEl, 'events')
      if (evs && evs[event]) $(tplEl).triggerHandler(event, args)
    }
  }

  const wrapEvent = e => ($ && $.event && $.event.fix ? $.event.fix(e) : e)

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
      if (isFunction(cb)) res = cb.call(target, wrapEvent(e))
      if (res === false) { e.preventDefault(); e.stopPropagation() }
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
      let je = null
      for (let el = e.target; el && el !== r; el = el.parentNode) {
        if (direct && el !== e.target) break
        const h = el.__wOn && el.__wOn[event]
        if (!h || h.view !== view) continue
        const fn = view.fn(h.fname)
        if (!fn) continue
        if (!je) { je = wrapEvent(e); if (je !== e) je.delegateTarget = r }
        if (je !== e) je.currentTarget = el
        const res = h.params
            ? fn.call(view, state, ...h.params.map(p => ev(view, p, h.data)))
            : fn.call(view, state)
        const out = isFunction(res) ? res.call(el, je) : res
        if (out === false) { je.preventDefault(); je.stopPropagation() }
        if (je !== e ? je.isPropagationStopped() : e.cancelBubble) break
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
    let real = key in state ? key : lower[key.toLowerCase()]
    if (!real) { if (!open) return; real = key }
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
      trigger(tick, 'v', 'set')
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
    if (!hasListeners('$update')) return true
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
    if (el && el.jquery) el = el[0]
    if (isMounted) {
      if (!el || el === root) return view
      view.unmount()
    }
    // повторный mount() без аргументов: рядом с шаблоном уже стоит корень этого view
    if (!el && tplEl && tplEl.nextElementSibling && tplEl.nextElementSibling.getAttribute('w-name') === id) return view
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
    postDepth++
    try { render() } finally { postDepth-- }
    runPost()
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
    runPost()
  }

  let forcePending = false
  function scheduleForce() {
    if (forcePending) return
    forcePending = true
    Promise.resolve().then(() => { forcePending = false; forceUpdate() })
  }

  function update(next) {
    if (next === true) { forceUpdate(); return view }
    if (state && next) {
      if (isFunction(next)) {
        const m0 = mutationCount()
        const res = next(state)
        if (isObject(res)) Object.assign(state, res)
        // изменения не через прокси (Chart.js, экземпляры классов): перерисовать вручную, как в Wex 2
        else if (config.autoForce && mutationCount() === m0) scheduleForce()
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
      runPost()
    }
    return view
  }

  function fn(name, action) {
    if (!action) return fns[name]
    fns[name] = action
    return view
  }

  function clone() {
    const nv = createView(html, isFunction(initState) ? initState : cloneState(initState), tplEl, attrsExpr, open)
    each(fns, (action, name) => nv.fn(name, action))
    handlers.forEach(h => nv.__addHandler(h))
    actions.forEach(a => nv.on(...[a.event, a.selector, a.fn].filter(Boolean)))
    components.forEach((entry, name) => nv.__setComponent(name, entry))
    directives.forEach((def, name) => { if (globalDirectives.get(name) !== def) nv.__setDirective(name, def) })
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
    find(sel) {
      if ($) return root ? $(root).find(sel) : $()
      return root ? Array.from(root.querySelectorAll(sel)) : []
    },
    component(name, src, extra) {
      components.set(name.toLowerCase(), normComponent(name, src, extra))
      invalidate()
      if (src instanceof View && src !== view) view.on('$beforeDestroy', () => src.destroy())
      return view
    },
    directive(name, compile, affect) { directives.set(name, normDirective(compile, affect)); invalidate(); return view },
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
    __component: name => components.get(name) || (view.__parent && view.__parent.__component(name)) || globalComponents.get(name),
    __comps: () => components,
    __setComponent(name, entry) { components.set(name, entry); invalidate() },
    __directive: name => directives.get(name),
    __tick: tick,
    __subscribe: ensureSubscribed,
    __setDirective(name, def) { directives.set(name, def); invalidate() },
    __addHandler(h) { handlers.push({ ...h }) },
    __delegate: delegate,
    __setProp(key, value) { if (!state) { outside = outside || {}; outside[key] = value } else setProp(key, value) },
    __sig() {
      if (envVer !== globalVer) invalidate()
      if (sigCache === null) sigCache = Array.from(view.__env().comps.keys()).sort().join() + '|' + Array.from(directives.keys()).sort().join()
      return sigCache
    },
    __env() {
      if (envVer !== globalVer) invalidate()
      if (!envCache) {
        // глобальные, затем родительские (от внешнего к внутреннему), затем свои
        const comps = new Map(globalComponents)
        const chain = []
        for (let v = view; v; v = v.__parent) chain.unshift(v)
        chain.forEach(v => v.__comps().forEach((e, k) => comps.set(k, e)))
        envCache = { comps, dirs: new Map(directives) }
      }
      return envCache
    },
  })
  Object.defineProperties(view, {
    state: { get: () => state },
    root: { get: () => root },
    __state: { get: () => state },
    __root: { get: () => root },
    tag: { value: tplEl ? tplEl.localName : 'template' },
    attributes: { value: tplEl ? getNodeAttrs(tplEl) : {} },
    // outside выставляет родитель до mount
    __outside: { get: () => outside, set: (v) => { outside = v } },
    __slot: { value: null, writable: true },
    __path: { value: null, writable: true },
    __parent: { value: null, writable: true },
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