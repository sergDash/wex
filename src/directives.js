/*
 * Встроенные w-директивы и совместимость со Wex 2: всё, что не входит в горячий путь ядра.
 * Ядро (core.js) знает только text / attr / if / for / slot / comp; остальное подключается через OPS.
 */
import { OPS, effect, ev, report, config, instantiate, getPlan, instNodes, mountComponent, postTask, View, getDollar } from './wex.js'
import { track, untrack } from './reactive.js'
import { isNone, isFunction, isString, parseMustache, getNodeAttrs, sanitizeSvg } from './utils.js'

const $ = (...a) => getDollar()(...a)

// scope для старых директив: scope.parse / assign / $new / data / filters
class LScope {
    constructor(view, data) { this.view = view; this.data = data }
    parse(exp) { return ev(this.view, exp, this.data) }
    assign(key, value) { const f = this.view.__scope().compile(key); if (f.assign) f.assign(this.data, value) }
    $new(locals) { return new LScope(this.view, childData(this.data, locals instanceof LScope ? locals.data : locals || {})) }
    interpolate(str) { return interpolateString(this.view, this.data, str) }
    get filters() { return this.view.__scope().filters }
}
// локальные переменные поверх родительских данных; значения читаются «вживую»
function childData(parent, locals) {
    const o = { __proto__: parent }
    Object.keys(locals).forEach((k) => {
        Object.defineProperty(o, k, { get: () => locals[k], set: (v) => { locals[k] = v }, enumerable: true, configurable: true })
    })
    return o
}
function interpolateString(view, data, str) {
    const parts = parseMustache(str)
    if (!parts.length) return str
    let out = ''
    for (const p of parts) out += typeof p === 'string' ? p : String(ev(view, p, data))
    return out
}
function interpolateNode(el, view, data) {
    for (const a of [...el.attributes]) {
        if (a.name.charCodeAt(0) !== 64 && a.value.indexOf('{{') !== -1) el.setAttribute(a.name, interpolateString(view, data, a.value))
    }
    for (let c = el.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3 && c.data.indexOf('{{') !== -1) c.data = interpolateString(view, data, c.data)
        else if (c.nodeType === 1) interpolateNode(c, view, data)
    }
}

function markupToHtml(out) {
    if (isString(out)) return out
    const h = document.createElement('div')
    $(h).append(out)
    return h.innerHTML
}

function compileInst(html, view, data, block) {
    return instantiate(getPlan(html, view), view, data, block)
}

// заменяет элемент разметкой, скомпилированной в текущем scope; строки списка находят замену через el.__dyn
function replaceWith(el, html, view, data, block) {
    const inst = compileInst(html, view, data, block)
    el.replaceWith(...(inst.simple ? [inst.el] : Array.from(inst.frag.childNodes)))
    el.__dyn = { nodes: () => instNodes(inst) }
    return inst
}

function legacyCtx(view, data, block) {
    return {
        scope: new LScope(view, data),
        view,
        compile: (temp, scp) => {
            const inst = compileInst(temp, view, scp ? scp.data : data, block)
            return inst.simple ? [inst.el] : Array.from(inst.frag.childNodes)
        },
        interpolate: ($el, scp) => { const d = scp ? scp.data : data; $el.each(function () { interpolateNode(this, view, d) }) },
    }
}

// affect / mounted / updated / unmounted: после вставки в DOM, затем при каждом изменении прочитанных данных
function legacyAffect(block, view, data, nodes, attrs, affect, life, component) {
    if (!affect && !life) return
    block.link()
    postTask(() => {
        if (block.disposed) return
        const bag = nodes.map(() => ({}))
        const started = []
        let revokes = []
        const run = (list) => list.forEach((f) => { try { f() } catch (e) { console.error(e) } })
        view.__subscribe()
        effect(block, () => {
            track(view.__tick, 'v')   // как в Wex 2: affect вызывается при каждом изменении state
            run(revokes)
            revokes = []
            const ctx = { $root: $(view.root), scope: new LScope(view, data), view, component }
            nodes.forEach((n, i) => {
                const $n = $(n)
                if (affect) { const r = affect.call(ctx, $n, attrs); if (isFunction(r)) revokes.push(r) }
                if (life) {
                    if (!started[i]) { started[i] = true; if (life.mounted) life.mounted.call(ctx, $n, attrs, bag[i]) }
                    else if (life.updated) life.updated.call(ctx, $n, attrs, bag[i])
                }
            })
        })
        block.onDispose(() => {
            run(revokes)
            if (life && life.unmounted) nodes.forEach((n, i) => { try { life.unmounted.call({ view }, $(n), bag[i]) } catch (e) { console.error(e) } })
        })
    })
}

function bindDir(op, el, view, data, block) {
    const def = view.__directive(op.name)
    if (!def) return
    if (!$) { report(`Директива «${op.name}» требует jQuery: вызовите Wex.useJQuery($)`, { level: 'error', view }); return }
    let nodes = [el]
    if (def.compile) {
        const $el = $(el)
        const out = def.compile.call(legacyCtx(view, data, block), $el, op.attrs)
        if (!isNone(out) && out !== $el && out !== el) nodes = instNodes(replaceWith(el, markupToHtml(out), view, data, block))
    }
    legacyAffect(block, view, data, nodes, op.attrs, def.affect, def.life, null)
}

function bindLegacyComp({ compile, affect }, op, host, view, data, block) {
    if (!$) { report(`Компонент «${op.name}» требует jQuery: вызовите Wex.useJQuery($)`, { level: 'error', view }); return }
    const $el = $(host)
    const slot = (locals) => {
        if (!op.slotPlan) return []
        const d = locals ? childData(data, locals instanceof LScope ? locals.data : locals) : data
        const inst = instantiate(op.slotPlan, view, d, block)
        return inst.simple ? [inst.el] : Array.from(inst.frag.childNodes)
    }
    slot.template = op.slotHtml || ''
    const t = document.createElement('template')
    t.innerHTML = slot.template
    slot.nodes = Array.from(t.content.childNodes)

    const out = compile.call(legacyCtx(view, data, block), $el, op.attrs, slot)
    let comp = null
    let nodes = [host]
    if (out instanceof View) comp = mountComponent(out, op, host, view, data, block)
    else if (!isNone(out) && out !== $el && out !== host) nodes = instNodes(replaceWith(host, markupToHtml(out), view, data, block))
    legacyAffect(block, view, data, nodes, op.attrs, affect, null, comp)
}

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



OPS.on = bindOn
OPS.dir = bindDir
OPS.legacyComp = bindLegacyComp
;['w-class', 'w-value', 'w-disabled', 'w-checked', 'w-selected', 'w-id', 'w-src', 'w-html', 'w-bind', 'w-transition'].forEach((n) => { OPS[n] = bindBuiltin })