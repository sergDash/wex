/*
 * Wex $: собственный минимальный аналог jQuery. Без внешних зависимостей.
 * Достаточен для интерфейса Wex 2: $('#tpl').state(...).mount(), $el в compile/affect старых директив и компонентов,
 * события, поиск. Если на странице есть настоящий jQuery, Wex использует его (useJQuery), а этот $ не нужен.
 */
const NON_BUBBLING = ['focus', 'blur', 'mouseenter', 'mouseleave', 'pointerenter', 'pointerleave', 'scroll', 'load', 'error', 'toggle']
const PX = /^(width|height|top|left|right|bottom|margin.*|padding.*|fontSize|lineHeight|borderWidth|maxWidth|minWidth|maxHeight|minHeight)$/
const EV_PROPS = ['altKey', 'ctrlKey', 'shiftKey', 'metaKey', 'button', 'buttons', 'clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY',
    'key', 'code', 'keyCode', 'charCode', 'detail', 'relatedTarget', 'data', 'inputType', 'deltaX', 'deltaY', 'isTrusted']

class WEvent {
    constructor(e) {
        this.originalEvent = e
        this.type = e.type
        this.target = e.target
        this.currentTarget = e.currentTarget
        this.timeStamp = e.timeStamp
        for (const p of EV_PROPS) if (p in e) this[p] = e[p]
        this.which = e.which != null ? e.which : (e.keyCode || e.charCode || (e.button != null ? e.button + 1 : undefined))
    }
    preventDefault() { this.originalEvent.preventDefault(); this._d = true }
    stopPropagation() { this.originalEvent.stopPropagation(); this._s = true }
    stopImmediatePropagation() { this.originalEvent.stopImmediatePropagation(); this._s = true }
    isDefaultPrevented() { return !!this._d || this.originalEvent.defaultPrevented }
    isPropagationStopped() { return !!this._s || this.originalEvent.cancelBubble }
}


// ---------- ajax: XMLHttpRequest + интерфейс jqXHR (done / fail / always / then / abort) ----------
const toQuery = (data) => {
    if (data == null || typeof data === 'string') return data || ''
    const sp = new URLSearchParams()
    const add = (k, v) => {
        if (v == null) return
        if (Array.isArray(v)) v.forEach((x, i) => add(typeof x === 'object' ? k + '[' + i + ']' : k + '[]', x))
        else if (typeof v === 'object') Object.keys(v).forEach(n => add(k + '[' + n + ']', v[n]))
        else sp.append(k, v)
    }
    Object.keys(data).forEach(k => add(k, data[k]))
    return sp.toString()
}

export function ajax(url, options) {
    if (url && typeof url === 'object') { options = url; url = options.url }
    const o = Object.assign({ method: 'GET', headers: {}, cache: true, timeout: 0 }, options || {})
    const method = String(o.method || o.type || 'GET').toUpperCase()
    const ctx = o.context || null
    const lists = { done: [], fail: [], always: [] }
    let status = 'pending'
    let args = []
    let nativePromise = null

    const jq = {
        readyState: 0, status: 0, statusText: '', responseText: '', responseJSON: undefined,
        done(fn) { lists.done.push(fn); if (status === 'resolved') fn.apply(ctx, args); return jq },
        fail(fn) { lists.fail.push(fn); if (status === 'rejected') fn.apply(ctx, args); return jq },
        always(fn) { lists.always.push(fn); if (status !== 'pending') fn.apply(ctx, args); return jq },
        state: () => status,
        promise() {
            return nativePromise || (nativePromise = new Promise((res, rej) => { lists.done.push((d) => res(d)); lists.fail.push((x, t, e) => rej(Object.assign(new Error(t + (e ? ': ' + e : '')), { jqXHR: x, textStatus: t }))); if (status === 'resolved') res(args[0]); if (status === 'rejected') rej(new Error(args[1])) }))
        },
        then(a, b) { return jq.promise().then(a, b) },
        catch(b) { return jq.promise().catch(b) },
        abort(text) { if (status === 'pending') { xhr.abort(); finish(false, 'abort', text || 'abort') } return jq },
        getResponseHeader: name => xhr.getResponseHeader(name),
        getAllResponseHeaders: () => xhr.getAllResponseHeaders(),
        setRequestHeader(n, v) { o.headers[n] = v; return jq },
    }

    const finish = (ok, textStatus, errorOrData) => {
        if (status !== 'pending') return
        status = ok ? 'resolved' : 'rejected'
        args = ok ? [errorOrData, textStatus, jq] : [jq, textStatus, errorOrData]
        const run = (list) => list.slice().forEach((fn) => { try { fn.apply(ctx, args) } catch (e) { console.error(e) } })
        run(ok ? lists.done : lists.fail)
        run(lists.always)
        const cb = ok ? o.success : o.error
        if (typeof cb === 'function') cb.apply(ctx, args)
        if (typeof o.complete === 'function') o.complete.call(ctx, jq, textStatus)
    }

    const xhr = new XMLHttpRequest()
    let target = url == null ? o.url : url
    let body = null
    const hasBody = method !== 'GET' && method !== 'HEAD'
    let contentType = o.contentType === false ? false : (o.contentType || (hasBody ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined))

    if (o.data != null) {
        if (!hasBody) { const q = toQuery(o.data); if (q) target += (target.indexOf('?') === -1 ? '?' : '&') + q }
        else if (typeof o.data === 'string' || (typeof FormData !== 'undefined' && o.data instanceof FormData) || (typeof Blob !== 'undefined' && o.data instanceof Blob)) body = o.data
        else if (contentType && contentType.indexOf('json') !== -1) body = JSON.stringify(o.data)
        else body = toQuery(o.data)
        if (typeof FormData !== 'undefined' && body instanceof FormData) contentType = false
    }
    if (o.cache === false && !hasBody) target += (target.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now()

    xhr.open(method, target, true, o.username, o.password)
    if (o.xhrFields) Object.assign(xhr, o.xhrFields)
    if (o.withCredentials) xhr.withCredentials = true
    const headers = Object.assign({}, o.headers)
    const has = n => Object.keys(headers).some(k => k.toLowerCase() === n.toLowerCase())
    if (contentType && body != null && !has('content-type')) headers['Content-Type'] = contentType
    if (!has('accept')) headers.Accept = o.dataType === 'json' ? 'application/json, text/javascript, */*; q=0.01' : '*/*'
    if (!has('x-requested-with') && !/^[a-z]+:\/\//i.test(target)) headers['X-Requested-With'] = 'XMLHttpRequest'
    Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]))
    if (o.timeout) xhr.timeout = o.timeout

    xhr.onload = () => {
        jq.readyState = 4
        jq.status = xhr.status
        jq.statusText = xhr.statusText
        jq.responseText = xhr.responseText
        const ct = xhr.getResponseHeader('Content-Type') || ''
        const ok = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304
        let data = xhr.responseText
        const type = o.dataType || (/json/.test(ct) ? 'json' : /xml/.test(ct) ? 'xml' : 'text')
        if (type === 'json' || (!o.dataType && data && /^\s*[\[{]/.test(data) && /json/.test(ct))) {
            if (data === '') data = undefined
            else {
                try { data = JSON.parse(data); jq.responseJSON = data }
                catch (e) { if (ok) { finish(false, 'parsererror', e); return } data = undefined }
            }
        }
        else if (xhr.status === 204) data = undefined
        if (ok) finish(true, xhr.status === 204 ? 'nocontent' : xhr.status === 304 ? 'notmodified' : 'success', data)
        else {
            if (data !== undefined && jq.responseJSON === undefined && /json/.test(ct)) { try { jq.responseJSON = JSON.parse(xhr.responseText) } catch (e) { /* не JSON */ } }
            finish(false, 'error', xhr.statusText)
        }
    }
    xhr.onerror = () => { jq.readyState = 4; finish(false, 'error', '') }
    xhr.ontimeout = () => { jq.readyState = 4; finish(false, 'timeout', 'timeout') }
    xhr.send(body)
    return jq
}

export function createDollar() {
    class W {
        constructor(nodes) {
            const n = nodes.length
            for (let i = 0; i < n; i++) this[i] = nodes[i]
            this.length = n
        }
    }
    const fn = W.prototype
    fn.jquery = 'wex-$'

    const parseHTML = (html) => {
        const t = document.createElement('template')
        t.innerHTML = html
        return Array.from(t.content.childNodes)
    }
    const toNodes = (sel, ctx) => {
        if (sel == null || sel === '') return []
        if (sel instanceof W) return Array.from(sel)
        if (typeof sel === 'string') {
            const s = sel.trim()
            if (s[0] === '<') return parseHTML(s)
            const root = ctx ? (ctx instanceof W ? ctx[0] : ctx) : document
            return root ? Array.from(root.querySelectorAll(s)) : []
        }
        if (sel.nodeType || sel === window) return [sel]
        if (typeof sel.length === 'number' && typeof sel !== 'function') return Array.from(sel)
        return []
    }
    // содержимое для append/replaceWith и т.п.: строка HTML, узел, коллекция, массив
    const contentNodes = (c) => {
        if (c == null) return []
        if (typeof c === 'string') return parseHTML(c)
        if (c.nodeType) return [c]
        return Array.from(c).reduce((a, x) => a.concat(contentNodes(x)), [])
    }
    const eachEl = (w, cb) => { for (let i = 0; i < w.length; i++) cb(w[i], i) }
    // вставка нескольким целям: всем, кроме последней, достаются копии
    const place = (w, content, put) => {
        const src = contentNodes(content)
        eachEl(w, (el, i) => put(el, i < w.length - 1 ? src.map(n => n.cloneNode(true)) : src))
        return w
    }

    const $ = function (sel, ctx) {
        if (typeof sel === 'function') {
            if (document.readyState !== 'loading') sel($)
            else document.addEventListener('DOMContentLoaded', () => sel($))
            return undefined
        }
        return new W(toNodes(sel, ctx))
    }
    $.fn = fn

    // ---------- выборка и обход ----------
    Object.assign(fn, {
        get(i) { return i === undefined ? Array.from(this) : this[i < 0 ? this.length + i : i] },
        toArray() { return Array.from(this) },
        eq(i) { const el = this[i < 0 ? this.length + i : i]; return new W(el ? [el] : []) },
        first() { return this.eq(0) },
        last() { return this.eq(-1) },
        slice(a, b) { return new W(Array.from(this).slice(a, b)) },
        each(cb) { for (let i = 0; i < this.length; i++) if (cb.call(this[i], i, this[i]) === false) break; return this },
        map(cb) { return new W(Array.from(this).map((el, i) => cb.call(el, i, el)).filter(v => v != null)) },
        filter(sel) {
            const test = typeof sel === 'function' ? (el, i) => sel.call(el, i, el) : (el) => (typeof sel === 'string' ? el.matches && el.matches(sel) : el === sel)
            return new W(Array.from(this).filter(test))
        },
        not(sel) {
            const test = typeof sel === 'function' ? (el, i) => sel.call(el, i, el) : (el) => (typeof sel === 'string' ? el.matches && el.matches(sel) : el === sel)
            return new W(Array.from(this).filter((el, i) => !test(el, i)))
        },
        is(sel) { return Array.from(this).some((el, i) => (typeof sel === 'function' ? sel.call(el, i, el) : typeof sel === 'string' ? el.matches && el.matches(sel) : el === (sel instanceof W ? sel[0] : sel))) },
        find(sel) { const out = []; eachEl(this, (el) => { if (el.querySelectorAll) out.push(...el.querySelectorAll(sel)) }); return new W(out) },
        closest(sel) { const out = []; eachEl(this, (el) => { const c = el.closest && el.closest(sel); if (c && out.indexOf(c) === -1) out.push(c) }); return new W(out) },
        parent() { const out = []; eachEl(this, (el) => { const p = el.parentNode; if (p && p.nodeType === 1 && out.indexOf(p) === -1) out.push(p) }); return new W(out) },
        children(sel) { const out = []; eachEl(this, (el) => { for (const c of el.children || []) if (!sel || c.matches(sel)) out.push(c) }); return new W(out) },
        next() { const out = []; eachEl(this, (el) => { if (el.nextElementSibling) out.push(el.nextElementSibling) }); return new W(out) },
        prev() { const out = []; eachEl(this, (el) => { if (el.previousElementSibling) out.push(el.previousElementSibling) }); return new W(out) },
        siblings() { const out = []; eachEl(this, (el) => { for (const c of (el.parentNode ? el.parentNode.children : [])) if (c !== el) out.push(c) }); return new W(out) },
        index() { const el = this[0]; return el && el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : -1 },
    })

    // ---------- атрибуты, свойства, классы, стили ----------
    Object.assign(fn, {
        attr(name, val) {
            if (name && typeof name === 'object') { for (const k in name) this.attr(k, name[k]); return this }
            if (val === undefined) { const v = this[0] && this[0].getAttribute(name); return v === null ? undefined : v }
            eachEl(this, (el) => { if (val === null) el.removeAttribute(name); else el.setAttribute(name, val) })
            return this
        },
        removeAttr(name) { eachEl(this, el => el.removeAttribute(name)); return this },
        prop(name, val) {
            if (name && typeof name === 'object') { for (const k in name) this.prop(k, name[k]); return this }
            if (val === undefined) return this[0] ? this[0][name] : undefined
            eachEl(this, (el) => { el[name] = val })
            return this
        },
        val(v) {
            if (v === undefined) return this[0] ? this[0].value : undefined
            eachEl(this, (el) => { el.value = v == null ? '' : v })
            return this
        },
        data(key, val) {
            if (val === undefined) {
                const el = this[0]
                if (!el) return undefined
                if (el.__wexData && key in el.__wexData) return el.__wexData[key]
                const raw = el.dataset ? el.dataset[key] : undefined
                if (raw === undefined) return undefined
                try { return JSON.parse(raw) } catch (e) { return raw }
            }
            eachEl(this, (el) => { (el.__wexData || (el.__wexData = {}))[key] = val })
            return this
        },
        hasClass(c) { return Array.from(this).some(el => el.classList && el.classList.contains(c)) },
        addClass(c) { const cs = String(c).split(/\s+/).filter(Boolean); eachEl(this, el => el.classList.add(...cs)); return this },
        removeClass(c) { const cs = String(c).split(/\s+/).filter(Boolean); eachEl(this, el => el.classList.remove(...cs)); return this },
        toggleClass(c, state) {
            String(c).split(/\s+/).filter(Boolean).forEach(cl => eachEl(this, el => (state === undefined ? el.classList.toggle(cl) : el.classList.toggle(cl, !!state))))
            return this
        },
        css(name, val) {
            if (name && typeof name === 'object') { for (const k in name) this.css(k, name[k]); return this }
            if (val === undefined) return this[0] ? getComputedStyle(this[0])[name] : undefined
            eachEl(this, (el) => {
                const v = typeof val === 'number' && PX.test(name) ? val + 'px' : val
                if (name.indexOf('-') !== -1) el.style.setProperty(name, v)
                else el.style[name] = v
            })
            return this
        },
        show() { eachEl(this, (el) => { el.style.display = '' }); return this },
        hide() { eachEl(this, (el) => { el.style.display = 'none' }); return this },
        toggle(state) { eachEl(this, (el) => { const show = state === undefined ? el.style.display === 'none' : !!state; el.style.display = show ? '' : 'none' }); return this },
        width(v) { if (v === undefined) return this[0] ? this[0].getBoundingClientRect().width : undefined; return this.css('width', v) },
        height(v) { if (v === undefined) return this[0] ? this[0].getBoundingClientRect().height : undefined; return this.css('height', v) },
        offset() {
            const el = this[0]
            if (!el) return undefined
            const r = el.getBoundingClientRect()
            return { top: r.top + window.pageYOffset, left: r.left + window.pageXOffset }
        },
        focus() { eachEl(this, el => el.focus && el.focus()); return this },
        blur() { eachEl(this, el => el.blur && el.blur()); return this },
        click() { eachEl(this, el => el.click && el.click()); return this },
    })

    // ---------- содержимое ----------
    Object.assign(fn, {
        html(v) {
            if (v === undefined) return this[0] ? this[0].innerHTML : undefined
            eachEl(this, (el) => {
                if (typeof v === 'string') el.innerHTML = v
                else { el.textContent = ''; contentNodes(v).forEach(n => el.appendChild(n)) }
            })
            return this
        },
        text(v) {
            if (v === undefined) return this[0] ? this[0].textContent : undefined
            eachEl(this, (el) => { el.textContent = v })
            return this
        },
        empty() { eachEl(this, (el) => { el.textContent = '' }); return this },
        remove() { eachEl(this, el => el.remove()); return this },
        detach() { return this.remove() },
        clone() { return new W(Array.from(this).map(el => el.cloneNode(true))) },
        append(c) { return place(this, c, (el, ns) => ns.forEach(n => el.appendChild(n))) },
        prepend(c) { return place(this, c, (el, ns) => el.prepend(...ns)) },
        after(c) { return place(this, c, (el, ns) => el.after(...ns)) },
        before(c) { return place(this, c, (el, ns) => el.before(...ns)) },
        replaceWith(c) { return place(this, c, (el, ns) => el.replaceWith(...ns)) },
        appendTo(target) { $(target).append(this); return this },
        prependTo(target) { $(target).prepend(this); return this },
    })

    // ---------- события: реестр на элементе нужен для $._data(el, 'events') ----------
    const fix = e => new WEvent(e)
    const addHandler = (el, typeSpec, selector, handler, once) => {
        const [type, ...ns] = typeSpec.split('.')
        if (!type) return
        const capture = NON_BUBBLING.indexOf(type) !== -1
        const rec = { type, ns: ns.join('.'), selector, handler, once, capture }
        rec.listener = (e) => {
            let target = el
            if (selector) {
                target = e.target && e.target.closest ? e.target.closest(selector) : null
                if (!target || !el.contains(target)) return
            }
            const we = fix(e)
            we.currentTarget = target
            if (selector) we.delegateTarget = el
            if (once) removeHandlers(el, type, rec.ns, selector, handler)
            const r = handler.call(target, we, ...(e.__wexExtra || []))
            if (r === false) { we.preventDefault(); we.stopPropagation() }
        }
        const reg = el.__wexEv || (el.__wexEv = {})
        ;(reg[type] || (reg[type] = [])).push(rec)
        el.addEventListener(type, rec.listener, capture)
    }
    const removeHandlers = (el, type, ns, selector, handler) => {
        const reg = el.__wexEv
        if (!reg) return
        Object.keys(reg).forEach((t) => {
            if (type && t !== type) return
            reg[t] = reg[t].filter((rec) => {
                const hit = (!ns || rec.ns === ns) && (selector === undefined || rec.selector === selector) && (!handler || rec.handler === handler)
                if (hit) el.removeEventListener(rec.type, rec.listener, rec.capture)
                return !hit
            })
            if (!reg[t].length) delete reg[t]
        })
    }
    const bind = (w, types, selector, handler, once) => {
        if (typeof selector === 'function') { handler = selector; selector = undefined }
        String(types).split(/\s+/).filter(Boolean).forEach(spec => eachEl(w, el => addHandler(el, spec, selector, handler, once)))
        return w
    }
    const fire = (w, type, extra, bubbles) => {
        eachEl(w, (el) => {
            if (type === 'click' && bubbles && extra == null && el.click) { el.click(); return }
            const e = new Event(type, { bubbles, cancelable: true })
            e.__wexExtra = extra == null ? [] : Array.isArray(extra) ? extra : [extra]
            el.dispatchEvent(e)
        })
        return w
    }
    Object.assign(fn, {
        on(types, selector, handler) { return bind(this, types, selector, handler, false) },
        one(types, selector, handler) { return bind(this, types, selector, handler, true) },
        off(types, selector, handler) {
            if (typeof selector === 'function') { handler = selector; selector = undefined }
            eachEl(this, (el) => {
                if (!types) removeHandlers(el)
                else String(types).split(/\s+/).filter(Boolean).forEach((spec) => { const [t, ...ns] = spec.split('.'); removeHandlers(el, t, ns.join('.'), selector, handler) })
            })
            return this
        },
        trigger(type, extra) { return fire(this, type, extra, true) },
        triggerHandler(type, extra) { return fire(this, type, extra, false) },
    })

    // ---------- статические ----------
    $.ajax = ajax
    $.get = (url, data, success, dataType) => (typeof data === 'function' ? ajax({ url, success: data, dataType: success }) : ajax({ url, data, success, dataType }))
    $.getJSON = (url, data, success) => (typeof data === 'function' ? ajax({ url, success: data, dataType: 'json' }) : ajax({ url, data, success, dataType: 'json' }))
    $.post = (url, data, success, dataType) => (typeof data === 'function' ? ajax({ url, method: 'POST', success: data, dataType: success }) : ajax({ url, method: 'POST', data, success, dataType }))
    $.event = { fix }
    $._data = (el, key) => (key === 'events' ? el.__wexEv : undefined)
    $.noop = () => {}
    $.isFunction = v => typeof v === 'function'
    $.isArray = Array.isArray
    $.isPlainObject = (v) => {
        if (!v || typeof v !== 'object') return false
        const p = Object.getPrototypeOf(v)
        return p === null || p === Object.prototype || Object.getPrototypeOf(p) === null
    }
    $.trim = s => (s == null ? '' : String(s).trim())
    $.contains = (a, b) => a !== b && a.contains(b)
    $.parseHTML = html => parseHTML(html)
    $.each = (obj, cb) => {
        if (Array.isArray(obj) || (obj && typeof obj.length === 'number')) { for (let i = 0; i < obj.length; i++) if (cb.call(obj[i], i, obj[i]) === false) break }
        else for (const k of Object.keys(obj || {})) if (cb.call(obj[k], k, obj[k]) === false) break
        return obj
    }
    $.extend = function (...args) {
        let deep = false
        if (typeof args[0] === 'boolean') deep = args.shift()
        const target = args.shift() || {}
        for (const src of args) {
            if (!src) continue
            for (const k of Object.keys(src)) {
                const v = src[k]
                if (deep && $.isPlainObject(v)) target[k] = $.extend(true, $.isPlainObject(target[k]) ? target[k] : {}, v)
                else if (deep && Array.isArray(v)) target[k] = $.extend(true, Array.isArray(target[k]) ? target[k] : [], v)
                else if (v !== undefined) target[k] = v
            }
        }
        return target
    }
    return $
}