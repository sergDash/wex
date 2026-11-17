const WEX_VERSION = '1.3.5';

import { ScopeX } from './vendor/ScopeX'
import { isNone, each, isObject, isFunction, isString, uniqueArray, isEqual } from './vendor/ts-fns'
import { camelCase, parseKey, getNodeName, getNodeAttrs, createAttrsText } from './utils.js'
import { VMLocalStorage } from './store.js'
import { reactive, toRaw, isReactive, subscribe } from './reactive.js'

// ScopeX.$new создавал полноценный ScopeX с НОВЫМ кэшем скомпилированных выражений: на каждую итерацию w-for
// каждое выражение заново разбиралось и компилировалось через new Function. Дочерний scope теперь делит
// compile (и кэш) с родителем. Семантика $new та же: locals получает прототип = данные родителя.
if (!ScopeX.prototype.$new.__shared) {
  const isPlainObj = v => v && typeof v === 'object' && v.constructor === Object
  const sharedNew = function (locals) {
    locals = locals || {}
    const data = isPlainObj(locals) ? Object.setPrototypeOf(locals, this.data) : Object.assign({}, locals)
    const child = Object.create(ScopeX.prototype)
    child.options = this.options
    child.filters = this.filters
    child.compile = this.compile
    child.data = data
    return child
  }
  sharedNew.__shared = true
  ScopeX.prototype.$new = sharedNew
}

let vmId = 0
let $ = null
export function View() {}
const SYMBOL = {}

export const config = {
  // по умолчанию debug включён только на localhost
  debug: typeof window !== 'undefined' && window.WEX_DEBUG !== undefined
      ? !!window.WEX_DEBUG
      : typeof location !== 'undefined' && /^(localhost|127\.|\[::1\])/.test(location.hostname),
  maxDepth: 50,     // максимальная вложенность компонентов
  syncMounts: 50,   // сколько компонентов монтировать синхронно за тик, остальные по кадрам (Infinity = как раньше)
  mountBudget: 10,  // мс на кадр для отложенного монтирования
}

const reported = new Set()

// window.WEX_PROFILE = true до загрузки: время рендеров копится в window.WEX_STATS (мс)
const profile = typeof window !== 'undefined' && window.WEX_PROFILE
    ? (window.WEX_STATS = { compile: 0, diff: 0, affect: 0, renders: 0 })
    : null

function scopeSnapshot(scp) {
  const out = {}
  try {
    const data = scp.data || {}
    for (const k in data) {
      const v = data[k]
      out[k] = v && typeof v === 'object'
          ? (Array.isArray(v) ? `Array(${v.length})` : `{${Object.keys(v).slice(0, 6).join(', ')}}`)
          : v
    }
  } catch (e) {}
  return out
}

// level: 'error' пишется всегда, 'warn' только при config.debug
export function report(title, ctx = {}) {
  const level = ctx.level || 'warn'
  if (level !== 'error' && !config.debug) return

  const path = (ctx.view && ctx.view.__path) || ['root']
  const key = [title, path.join('>'), ctx.attr, ctx.expr].join('|')
  if (reported.has(key)) return   // не спамим 1500 одинаковых сообщений
  reported.add(key)

  const color = level === 'error' ? '#e11d48' : '#d97706'
  console.groupCollapsed(`%cWex%c ${title}`, `background:${color};color:#fff;padding:1px 5px;border-radius:3px`, '')
  console.log('Цепочка компонентов:', path.join(' › '))
  if (ctx.attr)   console.log('Атрибут:', ctx.attr)
  if (ctx.expr)   console.log('Выражение:', ctx.expr)
  if (ctx.source) console.log('Место в шаблоне:', ctx.source)
  if (ctx.scope)  console.log('Доступные переменные:', scopeSnapshot(ctx.scope))
  if (ctx.el)     console.log('Элемент (можно кликнуть):', ctx.el)
  if (ctx.hint)   console.log('Подсказка:', ctx.hint)
  console.groupEnd()
}

function safeParse(scp, exp, ctx) {
  try { return scp.parse(exp) }
  catch (e) {
    report(`Ошибка в выражении «${exp}»: ${e.message}`, { ...ctx, expr: exp, scope: scp, level: 'error' })
    return undefined
  }
}

function checkInterpolation(text, scp, ctx) {
  if (!config.debug || text.indexOf('{{') === -1) return
  text.replace(/\{\{([\s\S]+?)\}\}/g, (m, raw) => {
    const expr = raw.trim()
    try {
      const v = scp.parse(expr)
      if (isNone(v)) {
        report(`«{{ ${expr} }}» вернул ${v}`, { ...ctx, expr, scope: scp })
      }
    } catch (e) {
      if (expr.indexOf('|') === -1) {   // фильтры parse может не понимать
        report(`Ошибка в «{{ ${expr} }}»: ${e.message}`, { ...ctx, expr, scope: scp, level: 'error' })
      }
    }
    return m
  })
}

// ---------------

const globalComponents = []
const globalDirectives = []
const globalFilters = {}

// bigger priority come first
function _push(list, name, compile, affect, priority = 10) {
  for (let i = 0, len = list.length; i < len; i ++) {
    const item = list[i]
    if (item[0] === name) {
      list[i] = [name, compile, affect, priority]
      return
    }
    if (item[3] < priority) {
      list.splice(i, 0, [name, compile, affect, priority])
      return
    }
  }
  list.push([name, compile, affect, priority])
}

// ---------- жизненный цикл директив ----------
// directive(name, { compile, mounted, updated, unmounted, priority })
//   compile($el, attrs)                  как раньше, на виртуальном дереве
//   mounted($el, attrs, data)            один раз, когда элемент появился в DOM
//   updated($el, attrs, data)            на каждый следующий рендер
//   unmounted($el, data)                 когда элемент удалён из DOM или view размонтирован
// this = { $root, scope, view, component } (как у affect). data живёт столько же, сколько элемент.
function lifecycleAffect(name, def) {
  return function ($el, attrs) {
    const el = $el[0]
    const bag = el.__wDirs || (el.__wDirs = {})
    let rec = bag[name]
    if (!rec) {
      rec = bag[name] = { def, data: {}, ctx: this }
      if (def.mounted) def.mounted.call(this, $el, attrs, rec.data)
    }
    else {
      rec.ctx = this
      if (def.updated) def.updated.call(this, $el, attrs, rec.data)
    }
  }
}

function normalizeDirective(name, compile, affect, priority) {
  if (compile && typeof compile === 'object' && !(compile instanceof View)) {
    const def = compile
    return [def.compile || null, lifecycleAffect(name, def), def.priority !== undefined ? def.priority : priority]
  }
  return [compile, affect, priority]
}

function teardownDirectives(el) {
  const run = (node) => {
    const bag = node.__wDirs
    if (!bag) return
    delete node.__wDirs
    Object.keys(bag).forEach((name) => {
      const rec = bag[name]
      if (!rec.def.unmounted) return
      try { rec.def.unmounted.call(rec.ctx, $(node), rec.data) }
      catch (e) { console.error(e) }
    })
  }
  run(el)
  if (el.querySelectorAll) el.querySelectorAll('*').forEach(run)
}

// удаляемый узел: размонтировать компоненты и директивы внутри
function disposeNode(node) {
  if (node.nodeType !== 1) return
  const els = [node, ...node.querySelectorAll('*')]
  els.forEach((el) => {
    const comp = el.__jQvmComponent
    if (comp) {
      comp.__cancelled = true
      comp.unmount()
      delete el.__jQvmComponent
    }
  })
  teardownDirectives(node)
}

export function component(name, compile, affect) {
  _push(globalComponents, name, compile, affect)
}

export function directive(name, compile, affect, priority) {
  const [c, a, p] = normalizeDirective(name, compile, affect, priority)
  _push(globalDirectives, name, c, a, p)
}

export function filter(name, fn) {
  globalFilters[name] = fn
}

const nativeImport = new Function('u', 'return import(u)') // в обход бандлера
const remoteCache = {}

function startLoad(entry, url) {
  if (entry.started) return entry
  entry.started = true

  const fetchText = async (tries = 3) => {
    for (let i = 0; ; i ++) {
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

  fetchText()
      .then(async (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const tpl = doc.querySelector('template')
        if (!tpl) throw new Error(`Wex: no <template> in ${url}`)

        const $tpl = $(`<template>${tpl.innerHTML}</template>`)
        const code = doc.querySelector('script[type="module"]')?.textContent

        let view = null
        if (code) {
          const blobUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
          try {
            view = (await nativeImport(blobUrl)).default($tpl)
          }
          finally {
            URL.revokeObjectURL(blobUrl)
          }
        }
        else {
          view = $tpl.vm()
        }

        if (!(view instanceof View)) {
          throw new Error(`Wex: ${url} must export default a function returning a view`)
        }

        entry.view = view
        const waiters = [...entry.waiters]
        entry.waiters.clear()
        waiters.forEach((v) => {
          try { v.update(true) }
          catch (e) { console.error(`Wex: ошибка обновления после загрузки ${url}`, e) }
        })
      })
      .catch((e) => {
        entry.started = false // следующая попытка (наведение, рендер) загрузит заново
        console.error(e)
      })

  return entry
}

function loadRemote(url, { lazy = false } = {}) {
  let entry = remoteCache[url]
  if (!entry) {
    entry = remoteCache[url] = { view: null, waiters: new Set(), started: false, load: () => startLoad(entry, url) }
  }
  if (!lazy) entry.load()
  return entry
}

// для роутера: прогреть компонент заранее
export function preloadComponent(url) {
  return loadRemote(url)
}

// ----------- compiler ---------------

// clear and revoke effects
function prepare($root) {
  const root = $root[0]
  const records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || []

  if (!records.length) {
    return
  }

  records.forEach((record) => {
    // reset effects
    if (record.revoke) {
      record.revoke()
    }
  })

  // clear
  records.length = 0
}

function compile($root, components, directives, state, view, [template, scope, isolate]) {
  if (config.debug && /<(img|iframe|source|video|audio|script|link)\b[^>]*\s(src|href|srcset)\s*=\s*["'][^"']*\{\{/i.test(template)) {
    report('«{{ }}» внутри src/href: браузер запросит сырую строку и получит 404', {
      view, level: 'error', source: template.slice(0, 160),
      hint: 'Используйте w-src="выражение" вместо src="{{ }}"',
    })
  }

  const root = $root[0]
  const records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || []

  const entry = protoOf(template)
  const box = entry.box.cloneNode(true)
  let dynamic = false   // после compile-функции, вернувшей новую разметку, кэш наличия директив неточен

  // пропускаем всё, где нет «{{»: раньше каждый атрибут и текст гонялся через regexp и перезаписывался
  const interpolateNode = (el, scp) => {
    if (el.attributes.length) {
      const list = [...el.attributes]
      for (let i = 0; i < list.length; i ++) {
        const { name, value } = list[i]
        if (name.charCodeAt(0) === 64 || value.indexOf('{{') === -1) continue   // '@'

        checkInterpolation(value, scp, { view, el, attr: name })
        const text = interpolateText(scp, value)

        // атрибут целиком из одного {{ }} и результат пустой: не пишем "undefined" в DOM
        if ((text === 'undefined' || text === 'null') && /^\{\{[^}]+\}\}$/.test(value.trim())) {
          el.removeAttribute(name)
          continue
        }
        setAttrSafe(el, name, text)
      }
    }

    for (let child = el.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === 3) {
        const text = child.textContent
        if (text.indexOf('{{') !== -1) {
          checkInterpolation(text, scp, { view, el })
          child.textContent = interpolateText(scp, text)
        }
      }
      else if (child.nodeType === 1) {
        interpolateNode(child, scp)
      }
    }
  }

  // для ctx.interpolate в пользовательских директивах (принимает jQuery, как раньше)
  const interpolate = ($el, scp = scope) => {
    $el.each(function() { interpolateNode(this, scp) })
  }

  const createIterator = (onCompile, onAffect, markDynamic) => function() {
    const el = this
    // уже обработан вложенным compile (w-for) — повторно не трогаем
    if (el.__jQvmIterated) return
    const attrs = getNodeAttrs(el)
    const name = getNodeName(el)
    const els = [el]

    const inner = el.innerHTML
    const slot = (locals) => {
      const $root = $('<div />')
      const subScope = locals ? locals instanceof ScopeX ? scope.$new(locals.data) : scope.$new(locals) : scope
      const nodes = compile($root, components, directives, state, view, [inner, subScope])
      affect($root, scope, view)
      return nodes
    }
    slot.template = inner
    slot.nodes = [...el.childNodes]

    const record = {
      affect: onAffect, attrs, els, slot, scope,
      source: config.debug ? el.outerHTML.slice(0, 160) : '',
    }

    const useComponent = (proto) => {
      // экземпляр создаётся в affect() и привязывается к конкретному DOM-элементу
      record.view = proto
      record.name = name
      record.state = state

      if (proto.tag !== 'template') {
        const { tag, attributes } = proto
        const doc = el.ownerDocument
        const tagEl = doc.createElement(tag)

        const attrsText = createAttrsText(attrs)
        const begin = doc.createComment(` ${name} ${attrsText} begin `)
        const end = doc.createComment(` ${name} ${attrsText} end `)

        Object.assign(attrs, attributes, { ['data-hoist']: name })
        Object.keys(attrs).forEach(k => setAttrSafe(tagEl, k, attrs[k]))
        el.replaceWith(begin, tagEl, end)
        els.length = 0
        els.push(begin, tagEl, end)
      }
      else {
        el.textContent = ''
      }
    }

    // register a view as component
    if (onCompile instanceof View) {
      useComponent(onCompile)
    }
    else if (typeof onCompile === 'function') {
      // функции-компоненты получают jQuery-обёртку, как раньше
      const $el = $(el)
      // developers can recompile inside fn
      const boundCompile = compile.bind(null, $root, components, directives, state, view)
      const ctx = {
        scope,
        view,
        compile: (temp, scp = scope) => boundCompile([temp, scp]),
        interpolate,
      }
      const output = onCompile.call(ctx, $el, attrs, slot)

      if (output && output instanceof View) {
        useComponent(output)
      }
      else if (!isNone(output) && $el !== output) {
        if (markDynamic) markDynamic()
        const newEls = $('<div />').html(output)[0].childNodes
        $el.replaceWith(newEls)
        els.length = 0
        els.push(...newEls)
      }
    }

    records.push(record)
    el.__jQvmIterated = true
    els.forEach((item) => {
      item.__jQvmCompiledRecord = record
      item.__jQvmIterated = true
    })
  }

  // directives have higher priority than components

  directives.forEach(([name, onCompile, onAffect]) => {
    const selector = selectorOf(name)
    if (!dynamic && !protoHas(entry, selector)) return
    const found = box.querySelectorAll(selector)
    for (let i = 0; i < found.length; i ++) {
      const el = found[i]
      const attrs = getNodeAttrs(el)

      let els = [el]
      if (typeof onCompile === 'function') {
        // developers can recompile inside fn
        const boundCompile = compile.bind(null, $root, components, directives, state, view)
        const ctx = {
          scope,
          view,
          compile: (temp, scp = scope, isl = isolate) => boundCompile([temp, scp, isl]),
          interpolate,
        }

        if (onCompile.native) {
          // встроенные директивы получают сам элемент и работают без jQuery
          const output = onCompile.call(ctx, el, attrs)
          if (!isNone(output) && output !== el) {
            const nodes = toNodes(output)
            if (!(nodes.length === 1 && nodes[0].nodeType === 8)) dynamic = true   // комментарий новой разметки не добавляет
            el.replaceWith(...nodes)
            els = nodes
          }
        }
        else {
          const $el = $(el)
          const output = onCompile.call(ctx, $el, attrs)
          if (!isNone(output) && $el !== output) {
            dynamic = true
            const $newEls = $(output)
            $el.replaceWith($newEls)
            els = [...$newEls]
          }
        }
      }

      if (isolate) {
        el.removeAttribute(name)
      }

      const record = { affect: onAffect, attrs, els, scope }
      records.push(record)
      els.forEach(item => item.__jQvmCompiledRecord = record)
    }
  })

  components.forEach(([name, compile, affect]) => {
    if (name === 'slot') {
      return
    }
    if (!dynamic && !protoHas(entry, name)) return
    const iterate = createIterator(compile, affect, () => { dynamic = true })
    const found = box.querySelectorAll(name)
    for (let i = 0; i < found.length; i ++) iterate.call(found[i])
  })

  interpolateNode(box, scope)

  // slot will only render with the host scope
  const slotComponent = components.find(item => item[0] === 'slot')
  if (slotComponent && (dynamic || protoHas(entry, 'slot'))) {
    const [name, compile, affect] = slotComponent
    const iterate = createIterator(compile, affect)
    const found = box.querySelectorAll(name)
    for (let i = 0; i < found.length; i ++) iterate.call(found[i])
  }

  return [...box.childNodes]
}

// ---------- интерполяция: строка с {{ }} разбирается один раз ----------
// Раньше на каждый атрибут и текст каждого рендера: match + replace + trim + slice по regexp.
// Порядок и результат те же, что у ScopeX.interpolate (undefined превращается в "undefined").
const mustacheCache = new Map()

function parseMustache(str) {
  let parts = mustacheCache.get(str)
  if (!parts) {
    parts = []
    const re = /\{\{(.*?)\}\}(?!\})/g
    let last = 0, m
    while ((m = re.exec(str))) {
      if (m.index > last) parts.push(str.slice(last, m.index))
      parts.push({ expr: m[1].trim() })
      last = re.lastIndex
    }
    if (parts.length && last < str.length) parts.push(str.slice(last))
    if (mustacheCache.size > 5000) mustacheCache.clear()
    mustacheCache.set(str, parts)
  }
  return parts
}

function interpolateText(scp, str) {
  const parts = parseMustache(str)
  if (!parts.length) return str
  let out = ''
  for (let i = 0; i < parts.length; i ++) {
    const part = parts[i]
    out += typeof part === 'string' ? part : String(scp.parse(part.expr))
  }
  return out
}

// ---------- разбор шаблона один раз ----------
// Дальше каждый рендер (и каждая итерация w-for) клонирует готовое дерево: cloneNode заметно быстрее innerHTML.
let inertDoc = null
const protoCache = new Map()

function protoOf(html) {
  let entry = protoCache.get(html)
  if (!entry) {
    inertDoc = inertDoc || document.implementation.createHTMLDocument('')
    const box = inertDoc.createElement('div')
    box.innerHTML = html
    if (protoCache.size > 2000) protoCache.clear()
    entry = { box, has: new Map() }
    protoCache.set(html, entry)
  }
  return entry
}

const selCache = new Map()
const selectorOf = (name) => {
  let sel = selCache.get(name)
  if (!sel) selCache.set(name, (sel = '[' + name + ']'))
  return sel
}

// есть ли в шаблоне элементы по селектору; результат кэшируется на строку шаблона
function protoHas(entry, selector) {
  let v = entry.has.get(selector)
  if (v === undefined) {
    v = entry.box.querySelector(selector) !== null
    entry.has.set(selector, v)
  }
  return v
}

// ---------- keyed diff ----------
// Ключ узла:
//   'g|…'  глобальный в пределах view: w-for ... traceby (ставит __wKey) и id. Узел и компонент
//          переезжают между контейнерами, а не пересоздаются.
//   'l|…'  локальный (ручной data-id): ищется только среди детей того же родителя.
function keyOf(node) {
  if (node.nodeType !== 1) return undefined
  if (node.__wKey !== undefined) return node.__wKey
  const id = node.getAttribute('id')
  if (id) return 'g|id|' + id
  const d = node.getAttribute('data-id')
  if (d !== null) return 'l|' + node.nodeName + '|' + d
  return undefined
}

const IGNORE_ATTRS = ['style', 'class', 'w-name']
const attrNames = el => [...el.attributes].map(a => a.name).filter(n => IGNORE_ATTRS.indexOf(n) === -1)

// результат нативной директивы -> список узлов
function toNodes(output) {
  if (typeof output === 'string') {
    const tpl = document.createElement('template')
    tpl.innerHTML = output
    return [...tpl.content.childNodes]
  }
  if (output.nodeType) return [output]
  return [...output]
}

function setAttrSafe(el, name, value) {
  try { el.setAttribute(name, value) }
  catch (e) { $(el).attr(name, value) }
}

function diffAndPatch($root, nodes) {
  const claimed = new Set()     // старые узлы, уже занятые новым деревом
  const pending = []            // кандидаты на удаление: решение после обхода всего дерева
  const localCache = new Map()
  let globalIdx = null

  const addTo = (map, key, el) => {
    const list = map.get(key)
    if (list) list.push(el)
    else map.set(key, [el])
  }

  const localIndex = (parent) => {
    let map = localCache.get(parent)
    if (!map) {
      map = new Map()
      for (let c = parent.firstElementChild; c; c = c.nextElementSibling) {
        const k = keyOf(c)
        if (k !== undefined) addTo(map, k, c)
      }
      localCache.set(parent, map)
    }
    return map
  }

  // одноразовый обход (лениво, только если ключ не найден среди детей); в чужие view не заходим
  const globalIndex = () => {
    if (!globalIdx) {
      globalIdx = new Map()
      const walk = (el) => {
        for (let c = el.firstElementChild; c; c = c.nextElementSibling) {
          const k = keyOf(c)
          if (k !== undefined && k[0] === 'g') addTo(globalIdx, k, c)
          if (!c.__jQvmComponent) walk(c)
        }
      }
      walk($root[0])
    }
    return globalIdx
  }

  const pick = (list) => {
    if (!list) return null
    for (let i = 0; i < list.length; i ++) {
      if (!claimed.has(list[i])) return list[i]
    }
    return null
  }

  const take = (key, parent) => {
    let el = pick(localIndex(parent).get(key))
    if (!el && key[0] === 'g') el = pick(globalIndex().get(key))
    if (el) claimed.add(el)
    return el
  }

  // we will not use next to replace current node, so we should transform record info to old node
  const transferRecord = (current, next) => {
    const record = next.__jQvmCompiledRecord
    if (!record) {
      return
    }

    const { els } = record
    els.forEach((el, i) => {
      if (el === next) {
        els[i] = current
      }
    })
    current.__jQvmCompiledRecord = record
  }

  const patchAttrs = (current, next) => {
    // update/add attrs
    const na = next.attributes
    for (let i = 0; i < na.length; i ++) {
      const { name, value } = na[i]
      if (current.getAttribute(name) !== value) setAttrSafe(current, name, value)
    }
    // remove no use attrs (style, class и w-name не трогаем)
    const ca = current.attributes
    for (let i = ca.length - 1; i >= 0; i --) {
      const name = ca[i].name
      if (name === 'style' || name === 'class' || name === 'w-name') continue
      if (!next.hasAttribute(name)) current.removeAttribute(name)
    }
  }

  const patchNode = (current, next) => {
    // для компонента сравниваем со снимком атрибутов ДО патча
    const isComp = !!current.__jQvmComponent
    let pre = null
    if (isComp) {
      pre = {
        wName: current.getAttribute('w-name'),
        id: current.getAttribute('id'),
        dataId: current.getAttribute('data-id'),
        names: attrNames(current),
      }
    }

    patchAttrs(current, next)
    if (next.__wKey !== undefined) current.__wKey = next.__wKey
    transferRecord(current, next)

    // dont diff component inner content
    if (isComp && current.nodeName === next.nodeName) {
      if (pre.wName === next.getAttribute('w-name')) return

      const nid = next.getAttribute('id')
      if ((pre.id || nid) && pre.id === nid) return

      const nd = next.getAttribute('data-id')
      if ((pre.dataId || nd) && pre.dataId === nd) return

      if (
          current.getAttribute('data-hoist') === next.getAttribute('data-hoist')
          && isEqual(pre.names, attrNames(next))
      ) {
        return
      }
    }

    diffAndPatchChildren(current, [...next.childNodes])
  }

  const diffAndPatchChildren = (parentNode, nextChildren) => {
    // пустой родитель без ключей: просто добавляем всё разом
    if (!parentNode.childNodes.length && !nextChildren.some(n => keyOf(n) !== undefined)) {
      nextChildren.forEach((child) => {
        parentNode.appendChild(child)
      })
      return
    }

    // инвариант: после шага i parentNode.childNodes[i] соответствует nextChildren[i]
    nextChildren.forEach((next, i) => {
      const current = parentNode.childNodes[i] || null
      const key = keyOf(next)

      if (key !== undefined) {
        const found = take(key, parentNode)
        if (found) {
          if (found !== current) parentNode.insertBefore(found, current)
          patchNode(found, next)
        }
        else {
          parentNode.insertBefore(next, current)
        }
      }
      else if (!current) {
        parentNode.appendChild(next)
      }
      // чужой ключевой узел не патчим под безключевой: вставляем рядом
      else if (next.nodeName !== current.nodeName || keyOf(current) !== undefined) {
        parentNode.insertBefore(next, current)
      }
      // diff and patch element
      else if (next.nodeName.indexOf('#') !== 0) {
        patchNode(current, next)
      }
      // diff and patch text
      else if (next.textContent !== current.textContent) {
        current.textContent = next.textContent
      }
    })

    // хвост: не удаляем сразу, узел мог переехать в другой контейнер
    for (let i = parentNode.childNodes.length - 1, start = nextChildren.length; i >= start; i --) {
      pending.push(parentNode.childNodes[i])
    }
  }

  diffAndPatchChildren($root[0], nodes)

  pending.forEach((node) => {
    const parent = node.parentNode
    if (claimed.has(node) || !parent) return
    disposeNode(node)
    parent.removeChild(node)
  })
}

// ---------- очередь отложенного монтирования ----------
const mountQueue = []
let mountScheduled = false
let flushing = false
let collecting = null
let syncCount = 0

const nextFrame = fn => (document.hidden ? setTimeout(fn, 0) : requestAnimationFrame(fn))

function shouldDefer() {
  return flushing || syncCount >= config.syncMounts
}

function noteSyncMount() {
  if (syncCount === 0) Promise.resolve().then(() => { syncCount = 0 })
  syncCount ++
}

function scheduleMount(job) {
  // задачи, созданные внутри текущей задачи (дети), встают в начало очереди:
  // получается обход в глубину, то есть порядок как в документе
  if (collecting) collecting.push(job)
  else mountQueue.push(job)

  if (!mountScheduled) {
    mountScheduled = true
    nextFrame(flushMounts)
  }
}

function flushMounts() {
  mountScheduled = false
  flushing = true
  const start = performance.now()

  while (mountQueue.length && performance.now() - start < config.mountBudget) {
    const job = mountQueue.shift()
    collecting = []
    try { job() }
    catch (e) { console.error(e) }
    if (collecting.length) mountQueue.unshift(...collecting)
    collecting = null
  }

  flushing = false
  if (mountQueue.length) {
    mountScheduled = true
    nextFrame(flushMounts)
  }
}

function affect($root, scope, view) {
  const root = $root[0]
  const records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || []

  records.forEach((record) => {
    const { affect, attrs, els, view: proto, scope: localScope, name, source } = record
    const finalScope = localScope && localScope !== scope ? localScope : scope

    if (proto) {
      const { state, slot } = record
      const slotInner = slot.template.trim()

      els.forEach((el) => {
        if (el.nodeName.indexOf('#') === 0) return

        const $el = $(el)
        let component = el.__jQvmComponent
        const isNew = !component

        if (isNew) {
          // --- защита от бесконечной рекурсии ---
          const parentPath = view.__path || ['root']
          if (parentPath.length > config.maxDepth) {
            report(`Превышена глубина вложенности компонентов (${config.maxDepth}), «${name}» не создан`, {
              level: 'error', view, el, source,
              hint: 'Рекурсивный компонент без условия выхода или циклические данные. Остановите рекурсию через w-if.',
            })
            $el.empty().attr('data-wex-error', 'max-depth')
            return
          }
          component = proto.clone()
          component.__path = parentPath.concat(name)
        }
        record.component = component

        // --- props ---
        const outside = {}
        each(attrs, (exp, attr) => {
          if (attr.indexOf(':') === 0) {
            const ctx = { view, el, attr, expr: exp, source }
            const value = safeParse(finalScope, exp, ctx)
            if (isNone(value)) {
              report(`Проп «${attr.substring(1)}» компонента «${name}» получил ${value}`, { ...ctx, scope: finalScope })
            }
            outside[camelCase(attr.substring(1))] = value
          }
          else if (attr.indexOf('@') === 0) {
            const event = camelCase(attr.substring(1))
            const [fname, params] = parseKey(exp)
            const fn = view.fn(fname)
            outside['@' + event] = function(...args) {
              let res = null
              if (params) {
                const values = params.map(arg => finalScope.parse(arg))
                res = fn.call(view, state, ...values)
              }
              else {
                res = fn.call(view, state)
              }
              if (isFunction(res)) return res.apply(this, args)
            }
          }
          else if (attr.indexOf('_') !== 0) {
            outside[camelCase(attr)] = exp
          }
        })
        component.update(outside, SYMBOL)

        component.component('slot', function() {
          const { scope } = this
          return slotInner ? slot(scope) : ''
        })

        // --- монтирование ---
        if (isNew) {
          el.__jQvmComponent = component
          if (shouldDefer()) {
            component.__pending = true
            scheduleMount(() => {
              component.__pending = false
              if (el.__jQvmComponent !== component || component.__cancelled) return
              component.mount($el)
            })
          }
          else {
            noteSyncMount()
            component.mount($el)
          }
        }
        else if (component.__pending) {
          // ждёт своей очереди; свежие props уже переданы выше
        }
        else if (!$el.attr('w-name')) {
          component.mount($el)
        }
        else if (slotInner) {
          component.update(true)
        }
      })

      els.forEach((el) => { delete el.__jQvmCompiledRecord })
    }

    if (typeof affect !== 'function') return

    els.forEach((el) => {
      const $el = $(el)
      const ctx = { $root, scope: finalScope, view, component: record.component }
      const revoke = affect.call(ctx, $el, attrs)
      if (typeof revoke === 'function') record.revoke = revoke
    })
  })
}

// ---------------- main ---------------

// начальное состояние клона: свои копии plain-данных (state по ссылке живёт только через props и shareState)
function cloneState(value) {
  if (Array.isArray(value)) return value.map(cloneState)
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    const out = {}
    Object.keys(value).forEach((k) => { out[k] = cloneState(value[k]) })
    return out
  }
  return value
}

function vm(initState = {}) {
  const template = this
  const $template = $(template)
  const hash = $template.attr('id') || $template.attr('w-id') || (vmId ++, vmId)
  const root = `[w-name=${hash}]`

  let state = null
  let scope = null
  let outside = null

  let mountTo = null
  let isMounted = false
  let isUnmounted = false

  let rootEl = null
  let templateHtml = null
  const getTemplateHtml = () => (templateHtml === null ? (templateHtml = $template.html()) : templateHtml)

  const getMountNode = () => {
    return mountTo ? $(mountTo) : $template.next(root)
  }

  const actions = []
  const view = new View()

  // -----------

  const components = [...globalComponents]
  const directives = [...globalDirectives]
  const filters = { ...globalFilters }
  const fns = {}

  function component(name, compile, affect) {
    // component('my-button', './components/button.html')
    if (isString(compile)) {
      const entry = loadRemote(compile, affect)   // affect здесь = { lazy: true }
      const placeholder = () => { entry.load(); return entry.view || '' }
      placeholder.remote = entry
      compile = placeholder
      affect = undefined
    }

    if (compile && compile.remote) {
      const { remote } = compile
      if (remote.view) {
        view.update(true)
      }
      else {
        remote.waiters.add(view)
      }
    }

    _push(components, name, compile, affect)
    if (compile && compile instanceof View) {
      view.on('$beforeDestroy', () => compile.destroy())
    }
    return view
  }

  function directive(name, compile, affect, priority) {
    const [c, a, p] = normalizeDirective(name, compile, affect, priority)
    _push(directives, name, c, a, p)
    return view
  }

  function filter(name, fn) {
    filters[name] = fn
    return view
  }

  // ------------ планировщик рендера ------------
  // Любая мутация state (или вложенного объекта) помечает view грязным; рендер батчится в микротаске.
  // hold()/release(): на время drag и подобных операций рендер откладывается, release() выполняет его синхронно.

  let dirty = false
  let queued = false
  let held = 0
  let skipped = false      // рендер был отменён через $update + prevent
  let lastInfo = null
  let unsubscribe = null

  const schedule = (info) => {
    lastInfo = info
    dirty = true
    if (queued || held || !isMounted) return
    queued = true
    Promise.resolve().then(flush)
  }

  function flush() {
    queued = false
    if (!dirty || held || !state || !isMounted) return
    dirty = false
    if (change(lastInfo)) render(true)
  }

  // -------------

  // props приходят по ссылке: реактивные данные родителя остаются теми же объектами
  const assignOutsideState = (state, outsideState) => {
    if (!state) return false

    const keys = {}
    Object.keys(state).forEach((k) => { keys[k.toLowerCase()] = k })

    let changed = false
    each(outsideState, (value, key) => {
      if (key[0] === '@') return
      const realKey = key in state ? key : keys[key.toLowerCase()]
      if (!realKey) return

      const prev = toRaw(state[realKey])
      const next = toRaw(value)
      if (prev === next) return
      // литерал из выражения (`:x="{a:1}"`) создаётся заново на каждый рендер родителя: сравниваем по содержимому
      if (!isReactive(value) && isEqual(prev, next)) return

      state[realKey] = next
      changed = true
    })
    return changed
  }

  function init(initState) {
    const next = isFunction(initState) ? initState.call(view) : initState

    if (!next || typeof next !== 'object') {
      throw new Error('initState should must be an object')
    }

    state = reactive(next)   // shareState отдаёт один и тот же прокси всем view
    if (outside) {
      assignOutsideState(state, outside)
    }
    unsubscribe = subscribe(state, schedule)
    scope = new ScopeX(state, { filters })

    // setupSpecialEvents should be invoked here
    // because these events should be registered before $init triggered
    setupSpecialEvents()
    view.emit('$init')
  }

  function render(isUpdating) {
    if (isUpdating && !isMounted) {
      return
    }

    if (!shouldUpdate()) {
      skipped = true
      return
    }
    skipped = false

    const $root = getMountNode()

    const t0 = profile ? performance.now() : 0
    prepare($root)

    const nodes = compile($root, components, directives, state, view, [getTemplateHtml(), scope])
    const t1 = profile ? performance.now() : 0

    if (isUpdating) {
      diffAndPatch($root, nodes)
    }
    else {
      $root.html(nodes)
    }
    const t2 = profile ? performance.now() : 0

    affect($root, scope, view)

    if (profile) {
      profile.compile += t1 - t0
      profile.diff += t2 - t1
      profile.affect += performance.now() - t2
      profile.renders ++
    }

    const attrs = $template.attr('attrs')
    if (attrs) {
      const props = scope.parse(attrs)
      each(props, (value, key) => {
        if (key === 'class') {
          const items = value.split(' ')
          items.forEach(item => $root.addClass(item))
        }
        else if (key === 'style') {
          if (isObject(value)) {
            $root.css(value)
          }
          else if (isString(value)) {
            const style = $root.attr('style') || ''
            const rules = style.split(';').concat(value.split(';')).filter(item => !!item)
            const stylesheet = uniqueArray(rules).join(';')
            $root.attr('style', stylesheet)
          }
        }
        else {
          $root.attr(key, value)
        }
      })
    }

    $template.trigger('$render')
  }

  function change(info) {
    let flag = true
    const prevent = () => flag = false
    $template.trigger('$change', [state, info, prevent])
    if (flag) {
      VMLocalStorage.reloadJqvmLocalStorage(state, '$change')
    }
    return flag
  }

  function shouldUpdate() {
    let flag = true
    const prevent = () => flag = false
    $template.trigger('$update', [state, prevent])
    return flag
  }

  function mount(el) {
    if (isMounted) {
      if (el) {
        if (el === mountTo) {
          return view
        }

        // when change a new root to mount, unmount the original one
        view.unmount()
      }
      else {
        return view
      }
    }

    if ($template.next(root).length) {
      return view
    }

    if (!isUnmounted) {
      init(initState)
    }

    let $root = null

    mountTo = el || null // cache mount node

    if (el) {
      $root = $(el)
      $root.attr('w-name', hash)
    }
    // like $('<template>aaa</template>').vm(...)
    else if (!$(document).find($template).length) {
      throw new Error('el should must be passed by view.mount')
    }
    else {
      $root = $('<div />', { 'w-name': hash, })
      $template.after($root)
    }

    rootEl = $root[0]
    render()
    dirty = false

    VMLocalStorage.reloadJqvmLocalStorage(state, '$mount')

    $template.trigger('$mount', [state])

    isMounted = true
    isUnmounted = false

    return view
  }

  function unmount() {
    if (!isMounted) {
      return view
    }

    const $root = getMountNode()

    if (!$root.length) {
      return
    }

    $template.trigger('$unmount')

    teardownDirectives($root[0])

    if (mountTo) {
      $root.html('')
      $root.removeAttr('w-name')
    }
    else {
      $root.remove()
    }

    mountTo = null
    rootEl = null
    isMounted = false
    isUnmounted = true

    return view
  }

  function destroy() {
    $template.trigger('$beforeDestroy')

    const $root = getMountNode()

    unmount()

    if (unsubscribe) unsubscribe()
    unsubscribe = null
    state = null
    scope = null
    actions.length = 0

    const root = $root[0]
    if (root) {
      delete root.__jQvmComponentInstances
      delete root.__jQvmCompiledRecords
    }

    $template.trigger('$destroy')
  }

  function update(nextState, type) {
    // props от родителя: рендер запустит подписка на state
    if (type === SYMBOL) {
      outside = nextState
      if (state) assignOutsideState(state, nextState)
      return view
    }

    // force update
    if (nextState === true) {
      if (isMounted) {
        dirty = false
        render(true)
      }
      return view
    }

    // when nextState passed, assign to state will trigger rerender
    if (state && nextState) {
      if (isFunction(nextState)) {
        const res = nextState(state)
        if (isObject(res)) {
          Object.assign(state, res)
        }
        else {
          schedule(null)   // мутации не-plain объектов (Chart.js) не видны прокси: помечаем вручную
        }
      }
      else if (isObject(nextState)) {
        Object.assign(state, nextState)
      }
    }

    return view
  }

  // отложить рендер до release(); вызовы вкладываются
  function hold() {
    held ++
    return view
  }

  // release() рендерит синхронно, если за время hold что-то изменилось (или рендер был отменён через $update + prevent)
  function release() {
    if (held > 0 && -- held === 0) {
      if (dirty) flush()
      else if (skipped) render(true)
    }
    return view
  }

  function bind(args, once) {
    const info = [...args]
    const fn = info.pop()
    const [event, selector] = info;

    const handle = function(e, ...eventArgs) {
      const event = e.handleObj.origType
      // stop broadcast the event
      if (event[0] === '$') {
        e.stopPropagation()
        if (e.target !== e.currentTarget) {
          return
        }
      }

      let res = null
      if (event[0] === '$') {
        fn.call(view, state, ...eventArgs)
      }
      else {
        const callback = fn.call(view, state)
        if (isFunction(callback)) {
          res = callback.call(this, e, ...eventArgs)
        }
      }

      if (once) {
        unbind(args)
      }

      return res
    }

    const item = { once, event, selector, fn, handle }
    actions.push(item)

    // events will be bound when $mount by `setup`
    // developers may invoke this.on(...) after view mounted, at this time, the event callback should be bound immediately
    if (isMounted) {
      const $root = getMountNode()
      const type = once ? 'one' : 'on'
      if (event[0] === '$') {
        $template[type](event, handle)
      }
      else {
        const info = [event, selector].filter(Boolean)
        $root[type](...info, handle)
      }
    }
  }

  function unbind(args) {
    const info = [...args]
    const fn = info.pop()
    const [event, selector] = info;

    const $root = getMountNode()
    actions.forEach((item, i) => {
      if (event === item.event && selector === item.selector && fn === item.fn) {
        const { event, selector, handle } = item
        const args = [event, selector, handle].filter(Boolean)
        if (event[0] === '$') {
          $template.off(...args)
        }
        else {
          $root.off(...args)
        }
        actions.splice(i, 1)
      }
    })
  }

  function emit(event, ...args) {
    // trigger those passed to components, only works for components
    if (outside) {
      const lower = ('@' + event).toLowerCase()
      const key = ('@' + event) in outside
          ? '@' + event
          : Object.keys(outside).find(k => k.toLowerCase() === lower)
      if (key && isFunction(outside[key])) {
        outside[key](...args)
      }
    }

    // only works for events begin with $
    if (event[0] !== '$') {
      return
    }
    // trigger those bind to view root: один trigger на событие (каждый обработчик вызывается один раз)
    if (actions.some(item => item.event === event)) {
      $template.trigger(event, args)
    }
  }

  function setupSpecialEvents() {
    actions.forEach((item) => {
      const { event, handle } = item
      if (['$init', '$destroy', '$beforeDestroy', '$mount'].indexOf(event) === -1) {
        return
      }
      $template.one(event, handle)
    })
  }

  function setup() {
    $template.on('$mount', function() {
      const $root = getMountNode()
      actions.forEach((item) => {
        const { once, event, selector, handle } = item
        if (['$init', '$destroy', '$beforeDestroy', '$mount', '$clone'].indexOf(event) > -1) {
          return
        }
        const type = once ? 'one' : 'on'
        if (event[0] === '$') {
          $template[type](event, handle)
        }
        else {
          const info = [event, selector].filter(Boolean)
          $root[type](...info, handle)
        }
      })
    })

    $template.on('$unmount', () => {
      const $root = getMountNode()

      actions.forEach((item) => {
        const { event, selector, handle } = item

        if (event[0] === '$') return

        const info = [event, selector].filter(Boolean)
        $root.off(...info, handle)
      })
    })
  }

  function find(selector) {
    const $root = getMountNode()
    return $root.find(selector)
  }

  function method(name,action) {
    return fn(name,action)
  }

  function fn(name, action) {
    if (!action) {
      return fns[name]
    }
    else {
      fns[name] = action
    }
    return view
  }

  function clone() {
    // свой <template> и своя копия начального состояния на каждый экземпляр
    const newView = vm.call($template.clone(), isFunction(initState) ? initState : cloneState(initState))
    each(fns, (action, name) => {
      newView.fn(name, action)
    })
    each(actions, (item) => {
      const { type, event, selector, fn } = item
      const info = [event, selector].filter(Boolean)
      const m = type === 'one' ? 'once' : 'on'
      newView[m](...info, fn)
    })
    each(components, (item) => {
      if (globalComponents.includes(item)) {
        return
      }
      newView.component(...item)
    })
    each(directives, (item) => {
      if (globalDirectives.includes(item)) {
        return
      }
      newView.directive(...item)
    })
    each(filters, (fn, name) => {
      newView.filter(name, fn)
    })

    // clone action
    actions.forEach((item) => {
      const { event, fn } = item
      if (event !== '$clone') {
        return
      }
      fn.call(view, state, newView)
    })

    return newView
  }

  function plugin(fn) {
    const lifecycle = fn.call({
      view,
      scope,
    })
    if (lifecycle) {
      const events = Object.keys(lifecycle)
      events.forEach((event) => {
        view.on(event, lifecycle[event])
      })
    }
    return view
  }

  Object.assign(view, {
    once(...args) {
      bind(args, true)
      return view
    },
    on(...args) {
      bind(args)
      return view
    },
    off(...args) {
      unbind(args)
      return view
    },
    emit,
    mount,
    unmount,
    destroy,
    update,
    hold,
    release,
    find,
    component,
    directive,
    filter,
    plugin,
    fn,
    method: fn,
    clone,
  })

  const tempEl = $template[0]
  const tag = getNodeName(tempEl)
  const attributes = getNodeAttrs(tempEl)
  Object.defineProperties(view, {
    tag: { value: tag },
    attributes: { value: attributes },
    __state: { get: () => state },   // для делегированных обработчиков w-on
    __root: { get: () => rootEl },
  })

  setup()

  return view
}

// register inside directives

const WFOR_RE = /^[a-z][a-zA-Z0-9_$]*(,[a-z][a-zA-Z0-9_$]*){0,1} in [a-z][a-zA-Z0-9_$]*( traceby [a-z][a-zA-Z0-9_$.]*)?/

function wFor(el, attrs) {
  const attr = attrs['w-for']

  if (!WFOR_RE.test(attr)) {
    throw new Error('w-for should match formatter `value,key in data traceby id`!')
  }

  const doc = el.ownerDocument
  const nodeName = getNodeName(el)

  const [kv, , dataKey, , traceBy] = attr.split(' ')
  const [valueName, keyName] = kv.split(',')

  const { scope: parentScope, compile } = this
  const data = parentScope.parse(dataKey)

  if (config.debug && Array.isArray(data) && data.length === 0) {
    report(`w-for «${attr}»: массив пустой, отрисовывать нечего`, {
      view: this.view, el, expr: dataKey, scope: parentScope,
      hint: 'Если данные грузятся асинхронно, проверьте, что они дошли до этого компонента (см. пропсы)',
    })
  }

  // make it not be able to compile again
  el.removeAttribute('w-for')
  if (traceBy) {
    el.setAttribute('data-id', `{{${traceBy}}}`) // modify the template, this will be compiled
  }

  // глобальный ключ: один и тот же список в разных контейнерах (колонки канбана) даёт совместимые ключи,
  // поэтому keyed diff переносит узел и компонент между контейнерами
  const keyScope = nodeName + '|' + dataKey + '|' + traceBy

  const frag = doc.createDocumentFragment()
  frag.appendChild(doc.createComment(` ${nodeName} w-for="${attr}" begin `))

  const temp = el.outerHTML
  each(isNone(data) ? [] : data, (value, key) => {
    const newScope = {
      [valueName]: value,
    }
    if (keyName) {
      newScope[keyName] = key
    }
    const scope = parentScope.$new(newScope)

    const nodes = compile(temp, scope, true)
    for (let i = 0; i < nodes.length; i ++) {
      const n = nodes[i]
      if (traceBy && n.nodeType === 1) {
        const id = n.getAttribute('data-id')
        if (id !== null) n.__wKey = 'g|' + keyScope + '|' + id
      }
      frag.appendChild(n)
    }
  })

  frag.appendChild(doc.createComment(` ${nodeName} w-for="${attr}" end `))
  el.replaceWith(frag)
}
wFor.native = true
directive('w-for', wFor)

function sanitizeSvg(str) {
  const tpl = document.createElement('template')
  tpl.innerHTML = str

  tpl.content
      .querySelectorAll('script,foreignObject,iframe,object,embed,style,animate,set')
      .forEach(n => n.remove())

  tpl.content.querySelectorAll('*').forEach((el) => {
    ;[...el.attributes].forEach(({ name, value }) => {
      const n = name.toLowerCase()
      const v = value.trim().toLowerCase()
      const badHref = (n === 'href' || n === 'xlink:href') && !v.startsWith('#')
      if (n.startsWith('on') || badHref) {
        el.removeAttribute(name)
      }
    })
  })

  return tpl.innerHTML
}
function wHtml(el, attrs) {
  // принимаем и w-html="item.icon", и w-html="{{ item.icon }}"
  const exp = attrs['w-html'].replace(/^\{\{\s*|\s*\}\}$/g, '')
  const ctx = { view: this.view, el, attr: 'w-html', expr: exp }
  const html = safeParse(this.scope, exp, ctx)
  if (isNone(html)) report(`w-html получил ${html}`, { ...ctx, scope: this.scope })

  el.removeAttribute('w-html')
  el.innerHTML = sanitizeSvg(isNone(html) ? '' : String(html))
}
wHtml.native = true
directive('w-html', wHtml)

function wIf(el, attrs) {
  const attr = attrs['w-if']
  const value = this.scope.parse(attr)
  return value ? el : el.ownerDocument.createComment(` ${getNodeName(el)} w-if="${attr}" (hidden) `)
}
wIf.native = true
directive('w-if', wIf)

function wId(el, attrs) {
  const value = this.scope.parse(attrs['w-id'])
  if (value === null) el.removeAttribute('id')
  else if (value !== undefined) el.setAttribute('id', value)   // как jQuery.attr: undefined ничего не меняет
}
wId.native = true
directive('w-id', wId)

function wClass(el, attrs) {
  const obj = this.scope.parse(attrs['w-class'])
  each(obj, (value, key) => {
    if (value) {
      const names = key.split(/\s+/).filter(Boolean)
      if (names.length) el.classList.add(...names)
    }
  })
}
wClass.native = true
directive('w-class', wClass)

directive('w-value', null, function($el, attrs) {
  const attr = attrs['w-value']
  const value = this.scope.parse(attr)
  $el.val(value)
})

directive('w-disabled', null, function($el, attrs) {
  const attr = attrs['w-disabled']
  const value = this.scope.parse(attr)
  $el.prop('disabled', !!value)
})

directive('w-checked', null, function($el, attrs) {
  const attr = attrs['w-checked']
  const value = this.scope.parse(attr)
  $el.prop('checked', !!value)
})

directive('w-selected', null, function($el, attrs) {
  const attr = attrs['w-selected']
  const value = this.scope.parse(attr)
  $el.prop('selected', !!value)
})

const BIND_CHANGE = '[type=checkbox],[type=radio],[type=color],[type=date],[type=datetime-local],[type=week],[type=file],select'

function bindSync($el, ctx, attrs, data) {
  const attr = attrs['w-bind']
  const value = ctx.scope.parse(attr)
  data.scope = ctx.scope
  data.attr = attr

  if ($el.is('[type=checkbox]')) {
    $el.prop('checked', !!value)
  }
  else if ($el.is('[type=radio]')) {
    $el.prop('checked', value === $el.val())
  }
  else {
    $el.val(value)
  }
}

directive('w-bind', {
  mounted($el, attrs, data) {
    const el = $el[0]
    const checkbox = el.matches('[type=checkbox]')
    bindSync($el, this, attrs, data)
    // scope и путь обновляются на каждом рендере (w-for пересоздаёт локальный scope), слушатель один
    data.listener = (e) => {
      data.scope.assign(data.attr, checkbox ? el.checked : e.target.value)
    }
    el.addEventListener(el.matches(BIND_CHANGE) ? 'change' : 'input', data.listener)
  },
  updated($el, attrs, data) {
    bindSync($el, this, attrs, data)
  },
})
directive('w-src', null, function($el, attrs) {
  const attr = attrs['w-src']
  const ctx = { view: this.view, el: $el[0], attr: 'w-src', expr: attr }
  const value = safeParse(this.scope, attr, ctx)
  if (isNone(value)) {
    report(`w-src получил ${value}: src не выставлен, запрос не отправлен`, { ...ctx, scope: this.scope })
    return
  }
  $el.attr('src', value)
})

// Делегирование: один слушатель на событие на корень view, обработчик ищется по expando элемента (el.__wOn).
// Раньше на каждый рендер для каждого w-on строился путь nth-of-type и заново вешался jQuery-обработчик.
const NON_BUBBLING = ['focus', 'blur', 'mouseenter', 'mouseleave', 'pointerenter', 'pointerleave', 'scroll', 'load', 'error', 'toggle']

function delegateOn(root, event) {
  const set = root.__wDelegates || (root.__wDelegates = new Set())
  if (set.has(event)) return
  set.add(event)

  const direct = NON_BUBBLING.indexOf(event) !== -1
  root.addEventListener(event, (e) => {
    let je = null
    for (let el = e.target; el && el !== root; el = el.parentNode) {
      if (direct && el !== e.target) break
      const h = el.__wOn && el.__wOn[event]
      // обработчик чужого view (компонент внутри нашего DOM) обслуживает его собственный корень
      if (!h || h.root !== root) continue

      if (!je) {
        je = $.event && $.event.fix ? $.event.fix(e) : e   // jQuery.Event: originalEvent, which и т.д., как раньше
        if (je !== e) je.delegateTarget = root
      }
      if (je !== e) je.currentTarget = el

      const state = h.view.__state
      let res
      if (h.params) {
        const args = h.params.map(arg => h.scope.parse(arg))
        res = h.fn.call(h.view, state, ...args)
      }
      else {
        res = h.fn.call(h.view, state)
      }
      if (typeof res === 'function') res = res.call(el, je)

      if (res === false) {
        je.preventDefault()
        je.stopPropagation()
      }
      if (je.isPropagationStopped ? je.isPropagationStopped() : e.cancelBubble) break
    }
  }, direct)
}

directive('w-on', null, function($el, attrs) {
  const el = $el[0]
  const attr = attrs['w-on']
  const [event, method] = attr.split(':')
  const [name, params] = parseKey(method)

  const { view, scope } = this
  const fn = view.fn(name)
  const root = view.__root
  if (!fn || !root) {
    return
  }

  const handlers = el.__wOn || (el.__wOn = {})
  handlers[event] = { root, fn, params, scope, view }
  delegateOn(root, event)

  // prepare() вызывает перед следующим рендером: не остаётся обработчиков от пропавших атрибутов
  return () => { delete handlers[event] }
})

directive('w-transition', null, function ($el, attrs) {
  const el = $el[0]
  // повторный рендер не должен заново гасить уже показанный элемент
  if (el.__wTransitionDone) return
  el.__wTransitionDone = true

  const raw = attrs['w-transition']
  const transition = raw || 'opacity 0.25s ease'
  const hasProp = /(opacity|all|transform)/.test(transition)
  const finalTransition = hasProp ? transition : `opacity ${transition}`

  $el.css({ transition: finalTransition, opacity: 0 })

  const show = () => $el.css('opacity', 1)
  if (document.hidden) {
    setTimeout(show, 0)
  } else {
    requestAnimationFrame(() => requestAnimationFrame(show))
  }
  setTimeout(show, 500) // страховка, если кадры так и не придут

  const originalRemove = el.remove
  el.remove = function () {
    $el.css('opacity', 0)
    const duration = getComputedStyle(el).transitionDuration
    const ms = duration.includes('ms') ? parseFloat(duration) : parseFloat(duration) * 1000
    setTimeout(() => originalRemove.call(el), ms || 250)
  }

  return () => { el.remove = originalRemove }
})

component(
    'w-static',
    () => $('<template><slot></slot></template>')
        .vm()
        .on('$update', (state, e, prevent) => {
          prevent()
        })
)

// --------------------------------

export function useJQuery(jQuery) {
  $ = jQuery
  $.fn.vm = vm
  $.fn.state = function(...args) {
    return this.vm(...args)
  }

  return $
}

console.log('[Wex]: загружена версия: ' + WEX_VERSION);