// wex.doc.js
// Схема документа (JSON) и рендер JSON → HTML.
// Без зависимостей. Редактор не нужен: файл можно подключать отдельно на публичных страницах.
// Подключать после wex.js.
//
//   <div w-doc="post.body"></div>
//
// Схема (первая итерация):
//   { root: { type: 'root', children: [ блоки ] } }
//   блоки:   heading { tag: 'h1'..'h6' }, paragraph; у обоих: align, meta, children
//   inline:  text { text, format: ['bold','italic','underline','strikethrough','code','subscript','superscript'] },
//            link { url, children }, linebreak
//   meta:    { classes: ['text-sm', ...] }  необязательное, только для рендера в UI

import { directive, report } from '../wex.js'

export const FORMATS = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript']
const FORMAT_TAG = {
    bold: 'strong', italic: 'em', underline: 'u', strikethrough: 's',
    code: 'code', subscript: 'sub', superscript: 'sup',
}
const ALIGNS = ['left', 'center', 'right', 'justify']

// ---------- утилиты ----------

export const esc = s => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

// пропускаем только http(s), mailto, tel и относительные адреса; javascript: и прочее отбрасываем
export function safeUrl(url) {
    const u = String(url == null ? '' : url).trim()
    const probe = u.replace(/[\u0000-\u0020\u007f-\u009f]/g, '')
    if (!probe) return null
    if (/^[a-z][a-z0-9+.\-]*:/i.test(probe)) {
        return /^(https?|mailto|tel):/i.test(probe) ? probe : null
    }
    return u.replace(/[\u0000-\u001f\u007f-\u009f]/g, '')
}

// классы из meta.classes: только безопасные токены (Quas/Tailwind-подобные)
const CLASS_RE = /^[\w\-:\/\[\].%#!(),]+$/
export const classOk = c => typeof c === 'string' && CLASS_RE.test(c)

export const emptyDoc = () => ({ root: { type: 'root', children: [{ type: 'paragraph', children: [] }] } })
export const isDoc = d => !!(d && d.root && Array.isArray(d.root.children))
export const clone = v => JSON.parse(JSON.stringify(v))

// JSON с отсортированными ключами: одинаковые документы дают одинаковую строку
export const stable = v => JSON.stringify(v == null ? null : v, (k, x) => (
    x && typeof x === 'object' && !Array.isArray(x)
        ? Object.keys(x).sort().reduce((o, key) => (o[key] = x[key], o), {})
        : x
))

export function addStyle(id, css) {
    if (typeof document === 'undefined' || document.getElementById(id)) return
    const s = document.createElement('style')
    s.id = id
    const nonce = window.Quas && window.Quas.CSSNonce
    if (nonce) s.nonce = nonce
    s.textContent = css
    document.head.appendChild(s)
}

// Wex при каждом рендере сверяет детей элемента с шаблоном и удаляет «лишних».
// Эта заглушка заставляет diff пропустить содержимое элемента (см. diffAndPatchNode в wex.js:
// ветка `current.__jQvmComponent`) и вызывает onDestroy, когда элемент убирают из DOM.
export function protect(el, onDestroy) {
    el.__jQvmComponent = {
        __cancelled: false,
        update() {},
        unmount() { if (onDestroy) onDestroy() },
    }
}

// ---------- рендер ----------

const NODES = {}

// registerNode('image', (node, ctx) => '<img ...>') — так подключаются новые типы узлов
export function registerNode(type, fn) { NODES[type] = fn }

export function renderNode(node, ctx) {
    const fn = node && NODES[node.type]
    return fn ? fn(node, ctx || {}) : ''
}

export const renderNodes = (nodes, ctx) => (Array.isArray(nodes) ? nodes : []).map(n => renderNode(n, ctx)).join('')
export const renderChildren = (node, ctx) => renderNodes(node.children, ctx)

const classAttr = (meta) => {
    const list = meta && Array.isArray(meta.classes) ? meta.classes.filter(classOk) : []
    return list.length ? ` class="${esc(list.join(' '))}"` : ''
}
const alignAttr = a => (ALIGNS.includes(a) ? ` style="text-align:${a}"` : '')

registerNode('root', (n, ctx) => renderChildren(n, ctx))

registerNode('paragraph', (n, ctx) => (
    `<p${classAttr(n.meta)}${alignAttr(n.align)}>${renderChildren(n, ctx) || '<br>'}</p>`
))

registerNode('heading', (n, ctx) => {
    const tag = /^h[1-6]$/.test(n.tag) ? n.tag : 'h2'
    return `<${tag}${classAttr(n.meta)}${alignAttr(n.align)}>${renderChildren(n, ctx) || '<br>'}</${tag}>`
})

registerNode('text', (n) => {
    let html = esc(n.text == null ? '' : n.text)
    const format = Array.isArray(n.format) ? n.format : []
    for (const f of FORMATS) {
        if (format.includes(f)) html = `<${FORMAT_TAG[f]}>${html}</${FORMAT_TAG[f]}>`
    }
    return html
})

registerNode('linebreak', () => '<br>')

registerNode('link', (n, ctx) => {
    const url = safeUrl(n.url)
    const inner = renderChildren(n, ctx)
    return url ? `<a href="${esc(url)}" rel="noopener noreferrer"${classAttr(n.meta)}>${inner}</a>` : inner
})

export function renderDoc(doc) {
    return isDoc(doc) ? renderNode(doc.root, {}) : ''
}

// ---------- стили контента (общие для редактора и вывода) ----------
// :where() сбрасывает специфичность, чтобы meta.classes (Quas-утилиты) всегда выигрывали

addStyle('wxe-doc', `
:where(.wxe-doc){line-height:1.7}
:where(.wxe-doc) h1{font-size:2rem;line-height:1.2;font-weight:700;margin:1.2em 0 .5em}
:where(.wxe-doc) h2{font-size:1.5rem;line-height:1.3;font-weight:700;margin:1.1em 0 .5em}
:where(.wxe-doc) h3{font-size:1.25rem;line-height:1.4;font-weight:600;margin:1em 0 .4em}
:where(.wxe-doc) h4,:where(.wxe-doc) h5,:where(.wxe-doc) h6{font-weight:600;margin:1em 0 .4em}
:where(.wxe-doc) p{margin:.75em 0}
:where(.wxe-doc) a{color:#2563eb;text-decoration:underline}
html.dark :where(.wxe-doc) a{color:#60a5fa}
:where(.wxe-doc) code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em;padding:.1em .35em;border-radius:4px;background:rgba(127,127,127,.18)}
:where(.wxe-doc)>:first-child{margin-top:0}
:where(.wxe-doc)>:last-child{margin-bottom:0}
`)

// ---------- директива ----------
// w-html не подходит: он чистит содержимое как SVG и вырежет ссылки.
// HTML выставляется в фазе affect, уже после интерполяции {{ }}, поэтому текст статьи не вычисляется как выражение.

directive('w-doc', null, function ($el, attrs) {
    const el = $el[0]
    const expr = attrs['w-doc']
    let doc
    try { doc = this.scope.parse(expr) }
    catch (e) {
        report(`w-doc: ошибка в выражении «${expr}»: ${e.message}`, { view: this.view, el, expr, level: 'error' })
        return
    }

    el.classList.add('wxe-doc')
    const key = stable(doc)
    if (el.__wdocKey === undefined) protect(el)
    if (el.__wdocKey !== key) {
        el.__wdocKey = key
        el.innerHTML = renderDoc(doc)
    }
})

if (typeof window !== 'undefined') {
    window.WexDoc = { renderDoc, registerNode, renderNode, renderNodes, safeUrl, esc }
}