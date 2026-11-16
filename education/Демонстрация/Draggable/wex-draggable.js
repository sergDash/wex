/*
 * Wex Draggable: универсальное перетаскивание (ядро на чистом JS + привязка к Wex).
 *
 * Ядро ничего не знает о данных: оно двигает «призрак» и «плейсхолдер», а по отпусканию отдаёт событие drop.
 * DOM элементов не меняется: исходный элемент только прячется, поэтому перестановку делает Wex по изменению state.
 *
 * Режимы:
 *   list  — списки с переносом между контейнерами (канбан)
 *   flow  — перестановка в сетке, которая переносит строки (галерея)
 *   cells — размещение в любую свободную ячейку CSS-сетки (стикеры)
 *
 *   const dd = createDraggable({ root: el, mode: 'list', containers: '[data-container]' })
 *   dd.on('drop', e => console.log(e))
 *   dragWith(view, (state, v) => ({ rootSelector: '.board', mode: 'list', on: { drop(e) {...} } }))
 */
(function (global) {
    'use strict'

    const DEFAULTS = {
        mode: 'list',               // list | flow | cells
        root: null,                 // Element | () => Element
        items: '[data-id]',         // что перетаскиваем (прямые дети контейнера)
        containers: null,           // селектор контейнеров (прямой родитель элементов); null: контейнер = root
        containerAttr: 'data-container',   // значение контейнера (колонка, статус) читается отсюда
        idAttr: 'data-id',
        handle: null,               // селектор «ручки» внутри элемента; null: весь элемент
        ignore: 'input,textarea,select,button,a,label,[contenteditable="true"],[data-dd-ignore]',
        threshold: 5,               // px до начала перетаскивания (иначе это обычный клик)
        touchDelay: 180,            // мс удержания для тача (иначе это прокрутка)
        direction: 'vertical',      // list: vertical | horizontal
        scroll: { edge: 48, speed: 16 },   // автопрокрутка у краёв; scroll: false отключает
        canDrop: null,              // (ctx) => boolean: запретить конкретное место
        metrics: null,              // cells: (container) => { cols: [px], rows: [px], gapX, gapY }; по умолчанию из CSS
        extraRows: 0,               // cells: сколько дополнительных рядов ниже существующих разрешено
        place: null,                // cells: (el, x, y, w, h) => void; по умолчанию grid-column / grid-row
        ghostParent: null,          // куда класть «призрак»; по умолчанию document.body
        classes: { ghost: '', placeholder: '', invalid: '' },   // свои классы (Quas); без них применяются встроенные стили
        on: null,                    // { start, move, drop, cancel }
        swap: false,                 // flow: менять местами с карточкой под курсором, а не вставлять
    }

    const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

    function createDraggable(userOptions) {
        const user = userOptions || {}
        const o = Object.assign({}, DEFAULTS, user)
        o.scroll = o.scroll === false ? false : Object.assign({}, DEFAULTS.scroll, user.scroll)
        o.classes = Object.assign({}, DEFAULTS.classes, user.classes)

        const listeners = {}
        let pending = null        // нажатие, которое ещё может стать перетаскиванием
        let drag = null           // идущее перетаскивание
        let raf = 0, scrollRaf = 0
        let destroyed = false

        const rootEl = () => (typeof o.root === 'function' ? o.root() : o.root)
        const idOf = el => el.getAttribute(o.idAttr)
        const valueOf = c => (c && c.getAttribute(o.containerAttr)) || ''

        const emit = (name, payload) => {
            ;(listeners[name] || []).slice().forEach(fn => fn(payload))
            if (o.on && typeof o.on[name] === 'function') o.on[name](payload)
        }

        // ---------------------------------------------------------------- поиск мест

        const itemsIn = c => [...c.children].filter(el => el.matches(o.items) && el !== drag.item && el !== drag.ph)

        function containerAt(x, y) {
            const root = rootEl()
            if (!root) return null
            const stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)]
            for (const el of stack) {
                if (!el) continue
                if (o.containers) {
                    const c = el.closest(o.containers)
                    if (c && root.contains(c)) return c
                } else if (el === root || root.contains(el)) return root
            }
            return null
        }

        // list/flow: перед каким элементом вставить плейсхолдер (null: в конец)
        function refFor(container, x, y) {
            const list = itemsIn(container)
            if (!list.length) return null

            if (o.mode === 'flow') {
                const keep = () => (drag.ph.parentNode === container ? nextItem(drag.ph) : null)

                // 1) курсор над плейсхолдером: ничего не меняем
                if (drag.ph.parentNode === container) {
                    const pr = drag.ph.getBoundingClientRect()
                    if (x >= pr.left && x <= pr.right && y >= pr.top && y <= pr.bottom) return keep()
                }

                // 2) курсор над карточкой: решаем по её середине
                for (const el of list) {
                    const r = el.getBoundingClientRect()
                    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
                        return x < r.left + r.width / 2 ? el : nextItem(el)
                    }
                }

                // 3) курсор в зазоре между колонками или в пустой ячейке ряда:
                //    берём карточки этого ряда, ближайшую по X
                const row = list.filter(el => { const r = el.getBoundingClientRect(); return y >= r.top && y <= r.bottom })
                if (row.length) {
                    let best = row[0], bd = Infinity
                    for (const el of row) {
                        const r = el.getBoundingClientRect()
                        const d = Math.max(r.left - x, 0, x - r.right)
                        if (d < bd) { bd = d; best = el }
                    }
                    const r = best.getBoundingClientRect()
                    return x < r.left + r.width / 2 ? best : nextItem(best)
                }

                // 4) вертикальный зазор между рядами: остаёмся на месте
                if (drag.ph.parentNode === container) return keep()

                // 5) чужой контейнер, курсор мимо карточек: ближайшая карточка
                let best = list[0], bd = Infinity
                for (const el of list) {
                    const r = el.getBoundingClientRect()
                    const d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom))
                    if (d < bd) { bd = d; best = el }
                }
                const r = best.getBoundingClientRect()
                return y < r.top || (y <= r.bottom && x < r.left + r.width / 2) ? best : nextItem(best)
            }

            const horizontal = o.direction === 'horizontal'
            for (const el of list) {
                const r = el.getBoundingClientRect()
                if (horizontal ? x < r.left + r.width / 2 : y < r.top + r.height / 2) return el
            }
            return null
        }

        function nextItem(el) {
            let n = el.nextElementSibling
            while (n && (!n.matches(o.items) || n === drag.item || n === drag.ph)) n = n.nextElementSibling
            return n
        }

        function neighbours(ph) {
            let prev = ph.previousElementSibling
            while (prev && (!prev.matches(o.items) || prev === drag.item)) prev = prev.previousElementSibling
            let next = ph.nextElementSibling
            while (next && (!next.matches(o.items) || next === drag.item)) next = next.nextElementSibling
            let index = 0
            for (let n = ph.previousElementSibling; n; n = n.previousElementSibling) if (n.matches(o.items) && n !== drag.item) index++
            return { before: next ? idOf(next) : null, after: prev ? idOf(prev) : null, index }
        }

        // ---------------------------------------------------------------- cells

        function measure(container) {
            if (typeof o.metrics === 'function') return o.metrics(container)
            const cs = getComputedStyle(container)
            const sizes = v => String(v).split(' ').map(parseFloat).filter(n => !isNaN(n))
            return { cols: sizes(cs.gridTemplateColumns), rows: sizes(cs.gridTemplateRows), gapX: parseFloat(cs.columnGap) || 0, gapY: parseFloat(cs.rowGap) || 0 }
        }

        const starts = (sizes, gap) => { let s = 0; return sizes.map((n) => { const v = s; s += n + gap; return v }) }
        const nearest = (arr, v) => arr.reduce((b, s, i) => (Math.abs(s - v) < Math.abs(arr[b] - v) ? i : b), 0)
        const cellOf = el => ({
            x: parseInt(el.getAttribute('data-x'), 10) || 0, y: parseInt(el.getAttribute('data-y'), 10) || 0,
            w: parseInt(el.getAttribute('data-w'), 10) || 1, h: parseInt(el.getAttribute('data-h'), 10) || 1
        })
        const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

        const placeCells = (el, x, y, w, h) => {
            if (typeof o.place === 'function') return o.place(el, x, y, w, h)
            el.style.gridColumn = (x + 1) + ' / span ' + w
            el.style.gridRow = (y + 1) + ' / span ' + h
        }

        // ---------------------------------------------------------------- перетаскивание

        function makePlaceholder(item, rect) {
            const ph = document.createElement('div')
            ph.setAttribute('data-dd-placeholder', '')
            const cs = getComputedStyle(item)
            ph.style.boxSizing = 'border-box'
            ph.style.flex = '0 0 auto'
            if (o.mode !== 'cells') {
                ph.style.height = rect.height + 'px'
                if (o.mode === 'flow') ph.style.width = rect.width + 'px'
                ph.style.margin = cs.margin
            }
            if (o.classes.placeholder) ph.className = o.classes.placeholder
            else { ph.style.border = '2px dashed #cbd5e1'; ph.style.borderRadius = '4px'; ph.style.background = 'rgba(148,163,184,.12)' }
            return ph
        }

        function makeGhost(item, rect) {
            const g = item.cloneNode(true)
            g.removeAttribute(o.idAttr)
            g.removeAttribute('id')
            g.setAttribute('data-dd-ghost', '')
            g.style.cssText += ';position:fixed;left:0;top:0;margin:0;box-sizing:border-box;pointer-events:none;z-index:2147483000;will-change:transform;width:' + rect.width + 'px;height:' + rect.height + 'px'
            if (o.classes.ghost) g.className += ' ' + o.classes.ghost
            else { g.style.opacity = '.95'; g.style.boxShadow = '0 8px 24px rgba(15,23,42,.25)' }
            ;(o.ghostParent || document.body).appendChild(g)
            return g
        }

        function begin(p, e) {
            const item = p.item
            const rect = item.getBoundingClientRect()
            const container = item.parentElement
            const root = rootEl()
            drag = {
                item, id: idOf(item), rect, from: valueOf(container), fromContainer: container,
                grabX: p.sx - rect.left, grabY: p.sy - rect.top, x: e.clientX, y: e.clientY,
                valid: true, touch: p.type === 'touch', moved: false, prevDisplay: item.style.display, event: e
            }
            drag.ph = makePlaceholder(item, rect)
            drag.ghost = makeGhost(item, rect)

            let fromIndex = 0
            for (let n = item.previousElementSibling; n; n = n.previousElementSibling) if (n.matches(o.items)) fromIndex++
            drag.fromIndex = fromIndex
            drag.fromCell = o.mode === 'cells' ? cellOf(item) : null

            if (o.mode === 'cells') {
                const c = cellOf(item)
                placeCells(drag.ph, c.x, c.y, c.w, c.h)
                container.appendChild(drag.ph)
            } else container.insertBefore(drag.ph, item)
            item.style.display = 'none'

            document.body.style.userSelect = 'none'
            document.body.style.webkitUserSelect = 'none'
            if (root) root.setAttribute('data-dd-dragging', '')
            moveGhost()
            emit('start', { id: drag.id, el: item, from: drag.from, index: fromIndex, event: e })
            if (o.scroll) scrollLoop()
        }

        function moveGhost() {
            drag.ghost.style.transform = 'translate3d(' + (drag.x - drag.grabX) + 'px,' + (drag.y - drag.grabY) + 'px,0)'
        }

        function setValid(valid) {
            drag.valid = valid
            const cls = o.classes.invalid
            if (cls) cls.split(' ').filter(Boolean).forEach(c => drag.ph.classList.toggle(c, !valid))
            else drag.ph.style.borderColor = valid ? '#cbd5e1' : '#f87171'
        }

        function update() {
            if (!drag) return
            const { x, y } = drag
            const container = containerAt(x, y)
            if (!container) { drag.over = null; return }
            drag.over = container
            if (o.mode === 'flow' && o.swap) return updateSwap(container, x, y)

            if (o.mode === 'cells') {
                const m = measure(container)
                const cr = container.getBoundingClientRect()
                const me = cellOf(drag.item)
                const colStarts = starts(m.cols, m.gapX)
                const rowSizes = m.rows.concat(Array.from({ length: o.extraRows }, () => m.rows[m.rows.length - 1] || 0))
                const rowStarts = starts(rowSizes, m.gapY)
                const gx = x - drag.grabX - cr.left + container.scrollLeft
                const gy = y - drag.grabY - cr.top + container.scrollTop
                const cx = Math.max(0, Math.min(nearest(colStarts, gx), m.cols.length - me.w))
                const cy = Math.max(0, Math.min(nearest(rowStarts, gy), rowSizes.length - me.h))
                const target = { x: cx, y: cy, w: me.w, h: me.h }
                let free = true
                for (const el of container.children) {
                    if (el === drag.item || el === drag.ph || !el.matches(o.items)) continue
                    if (overlap(target, cellOf(el))) { free = false; break }
                }
                placeCells(drag.ph, cx, cy, me.w, me.h)
                if (drag.ph.parentNode !== container) container.appendChild(drag.ph)
                const ctx = { id: drag.id, el: drag.item, from: drag.from, to: valueOf(container), container, mode: o.mode, x: cx, y: cy, w: me.w, h: me.h }
                const ok = free && (!o.canDrop || o.canDrop(ctx) !== false)
                setValid(ok)
                drag.target = target
                drag.container = container
                emit('move', Object.assign({ valid: ok, event: drag.event }, ctx))
                return
            }

            const ref = refFor(container, x, y)
            const parentIdx = (() => { let i = 0; for (const el of itemsIn(container)) { if (el === ref) break; i++ } return i })()
            const ctx = { id: drag.id, el: drag.item, from: drag.from, to: valueOf(container), container, mode: o.mode, index: parentIdx }
            const ok = !o.canDrop || o.canDrop(ctx) !== false
            if (ok && (drag.ph.parentNode !== container || nextItem(drag.ph) !== ref)) container.insertBefore(drag.ph, ref)
            setValid(ok)
            drag.container = ok ? container : drag.container
            emit('move', Object.assign({ valid: ok, event: drag.event }, ctx))
        }

        function swapNodes(a, b) {
            const m = document.createComment('')
            a.parentNode.insertBefore(m, a)
            b.parentNode.insertBefore(a, b)
            m.parentNode.insertBefore(b, m)
            m.remove()
        }

        function updateSwap(container, x, y) {
            const inside = el => { const r = el.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom }
            if (!inside(drag.ph)) {                       // над плейсхолдером ничего не меняем
                const hit = itemsIn(container).find(inside)
                if (hit) {
                    const was = drag.swapWith
                    if (was) { swapNodes(drag.ph, was); drag.swapWith = null }   // откат предыдущего обмена
                    if (hit !== was) { swapNodes(drag.ph, hit); drag.swapWith = hit }
                }
            }
            const ctx = { id: drag.id, el: drag.item, from: drag.from, to: valueOf(container), container, mode: o.mode, swap: true, with: drag.swapWith ? idOf(drag.swapWith) : null }
            const ok = !o.canDrop || o.canDrop(ctx) !== false
            setValid(ok)
            drag.container = container
            emit('move', Object.assign({ valid: ok, event: drag.event }, ctx))
        }

        function cleanup() {
            if (!drag) return
            const { item, ph, ghost } = drag
            if (ph.parentNode) ph.parentNode.removeChild(ph)
            if (ghost.parentNode) ghost.parentNode.removeChild(ghost)
            item.style.display = drag.prevDisplay
            document.body.style.userSelect = ''
            document.body.style.webkitUserSelect = ''
            const root = rootEl()
            if (root) root.removeAttribute('data-dd-dragging')
            cancelAnimationFrame(raf); cancelAnimationFrame(scrollRaf)
            raf = scrollRaf = 0
            drag = null
        }

        function finish(commit, e) {
            const d = drag
            if (!d) return
            // после перетаскивания браузер шлёт click: гасим его
            const swallow = (ev) => { ev.stopPropagation(); ev.preventDefault() }
            window.addEventListener('click', swallow, true)
            setTimeout(() => window.removeEventListener('click', swallow, true), 0)

            const swapWith = d.swapWith
            if (swapWith) { swapNodes(d.ph, swapWith); d.swapWith = null }

            let payload = null
            if (commit && d.valid && d.container) {
                if (o.mode === 'flow' && o.swap) {
                    let withIndex = -1
                    if (swapWith) { withIndex = 0; for (let n = swapWith.previousElementSibling; n; n = n.previousElementSibling) if (n.matches(o.items)) withIndex++ }
                    payload = { id: d.id, el: d.item, swap: true, with: swapWith ? idOf(swapWith) : null, withIndex, fromIndex: d.fromIndex, from: d.from, to: d.from, moved: !!swapWith, event: e }
                } else if (o.mode === 'cells') {
                    const t = d.target
                    payload = {
                        id: d.id, el: d.item, from: d.fromCell, to: { x: t.x, y: t.y }, w: t.w, h: t.h,
                        fromContainer: d.from, toContainer: valueOf(d.container),
                        moved: t.x !== d.fromCell.x || t.y !== d.fromCell.y || valueOf(d.container) !== d.from, event: e
                    }
                } else if (d.ph.parentNode) {
                    const nb = neighbours(d.ph)
                    const to = valueOf(d.ph.parentNode)
                    payload = {
                        id: d.id, el: d.item, from: d.from, to, index: nb.index, before: nb.before, after: nb.after, fromIndex: d.fromIndex,
                        moved: to !== d.from || nb.index !== d.fromIndex, event: e
                    }
                }
            }
            const id = d.id, el = d.item
            cleanup()
            if (payload) emit('drop', payload)
            else emit('cancel', { id, el })
        }

        // автопрокрутка ближайших прокручиваемых предков и окна
        function scrollables(el) {
            const out = []
            for (let n = el; n && n !== document.body; n = n.parentElement) {
                const cs = getComputedStyle(n)
                if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (n.scrollHeight > n.clientHeight || n.scrollWidth > n.clientWidth)) out.push(n)
            }
            return out
        }

        function scrollLoop() {
            scrollRaf = requestAnimationFrame(() => {
                if (!drag) return
                const { edge, speed } = o.scroll
                const { x, y } = drag
                let scrolled = false
                const push = (r, set) => {
                    const dt = y - r.top, db = r.bottom - y, dl = x - r.left, dr = r.right - x
                    if (dt < edge && dt > -edge) { set(0, -speed * (1 - dt / edge)); scrolled = true }
                    else if (db < edge && db > -edge) { set(0, speed * (1 - db / edge)); scrolled = true }
                    if (dl < edge && dl > -edge) { set(-speed * (1 - dl / edge), 0); scrolled = true }
                    else if (dr < edge && dr > -edge) { set(speed * (1 - dr / edge), 0); scrolled = true }
                }
                const base = drag.over || rootEl()
                if (base) scrollables(base).forEach(n => push(n.getBoundingClientRect(), (dx, dy) => { n.scrollLeft += dx; n.scrollTop += dy }))
                push({ top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth }, (dx, dy) => window.scrollBy(dx, dy))
                if (scrolled) update()
                scrollLoop()
            })
        }

        // ---------------------------------------------------------------- события указателя

        function onDown(e) {
            if (destroyed || drag || pending) return
            if (e.pointerType === 'mouse' && e.button !== 0) return
            const root = rootEl()
            if (!root || !e.target.closest || !root.contains(e.target)) return
            const item = e.target.closest(o.items)
            if (!item || !root.contains(item)) return
            if (o.handle) { const h = e.target.closest(o.handle); if (!h || !item.contains(h)) return }
            else if (o.ignore) { const ig = e.target.closest(o.ignore); if (ig && item.contains(ig)) return }

            pending = { item, sx: e.clientX, sy: e.clientY, type: e.pointerType === 'touch' ? 'touch' : 'mouse', last: e }
            if (pending.type === 'touch') {
                pending.timer = setTimeout(() => { if (pending) { const p = pending; pending = null; begin(p, p.last); attach() } }, o.touchDelay)
            }
            attach()
        }

        function onMove(e) {
            if (pending) {
                pending.last = e
                const dist = Math.hypot(e.clientX - pending.sx, e.clientY - pending.sy)
                if (pending.type === 'touch') {
                    if (dist > o.threshold) { clearTimeout(pending.timer); pending = null; detach() }   // это прокрутка
                    return
                }
                if (dist > o.threshold) { const p = pending; pending = null; begin(p, e) }
                return
            }
            if (!drag) return
            drag.x = e.clientX
            drag.y = e.clientY
            drag.event = e
            moveGhost()
            if (!raf) raf = requestAnimationFrame(() => { raf = 0; update() })
        }

        function onUp(e) {
            if (pending) { clearTimeout(pending.timer); pending = null; detach(); return }
            if (drag) {
                const root = rootEl()
                const r = root && root.getBoundingClientRect()
                // отпустили далеко за пределами доски: отмена
                const far = r && (e.clientX < r.left - 80 || e.clientX > r.right + 80 || e.clientY < r.top - 80 || e.clientY > r.bottom + 80)
                update()
                finish(!far, e)
            }
            detach()
        }

        function onCancel() {
            if (pending) { clearTimeout(pending.timer); pending = null }
            if (drag) finish(false)
            detach()
        }

        const onKey = (e) => { if (e.key === 'Escape' && drag) { finish(false); detach() } }
        const onTouchMove = (e) => { if (drag && drag.touch && e.cancelable) e.preventDefault() }
        const onNativeDrag = (e) => {
            const root = rootEl()
            if (root && root.contains(e.target) && e.target.closest && e.target.closest(o.items)) e.preventDefault()
        }

        let attached = false
        function attach() {
            if (attached) return
            attached = true
            document.addEventListener('pointermove', onMove)
            document.addEventListener('pointerup', onUp)
            document.addEventListener('pointercancel', onCancel)
            document.addEventListener('keydown', onKey)
            document.addEventListener('touchmove', onTouchMove, { passive: false })
        }
        function detach() {
            if (!attached) return
            attached = false
            document.removeEventListener('pointermove', onMove)
            document.removeEventListener('pointerup', onUp)
            document.removeEventListener('pointercancel', onCancel)
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('touchmove', onTouchMove)
        }

        document.addEventListener('pointerdown', onDown)
        document.addEventListener('dragstart', onNativeDrag)

        const api = {
            on(name, fn) { (listeners[name] = listeners[name] || []).push(fn); return api },
            off(name, fn) { listeners[name] = (listeners[name] || []).filter(f => f !== fn); return api },
            cancel() { if (drag) { finish(false); detach() } },
            destroy() {
                destroyed = true
                if (drag) finish(false)
                if (pending) clearTimeout(pending.timer)
                pending = null
                detach()
                document.removeEventListener('pointerdown', onDown)
                document.removeEventListener('dragstart', onNativeDrag)
            },
            get dragging() { return !!drag },
            // для тестов
            _update: update
        }
        return api
    }

    // ---------------------------------------------------------------- привязка к Wex
    // Один экземпляр на смонтированный компонент. На время перетаскивания рендер Wex замораживается ($update + prevent),
    // а по drop состояние меняет обработчик, и Wex сам переставляет элементы по traceby (data-id).
    function dragWith(view, make) {
        const live = new Map()
        const stop = (state) => { const d = live.get(state); if (d) { d.destroy(); live.delete(state) } }

        view.on('$mount', function (state) {
            const v = this
            const opts = Object.assign({}, make(state, v))
            if (opts.rootSelector && !opts.root) opts.root = () => v.find(opts.rootSelector)[0]
            live.set(state, createDraggable(opts))
        })
        view.on('$unmount', function (state) { stop(state) })
        view.on('$destroy', function (state) { stop(state) })
        view.on('$update', function (state) {
            const prevent = arguments[arguments.length - 1]
            const d = live.get(state)
            if (d && d.dragging && typeof prevent === 'function') prevent()
        })
        return view
    }

    createDraggable.dragWith = dragWith
    global.createDraggable = createDraggable
    global.dragWith = dragWith
})(window)