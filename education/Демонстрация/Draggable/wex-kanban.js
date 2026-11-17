/*
 * Wex Kanban: компонент <Kanban> поверх общего источника (wex-source.js) и перетаскивания (wex-draggable.js).
 *
 *   const kanban = createKanban({ cards: { OrderCard } })
 *   kanban.view.on('$kanbanCardMove', (state, e) => $wire.post('/api/orders/' + e.id + '/move', e))
 *   <Kanban source="orders" groupBy="status" :boards="boards" card="OrderCard" position="position"></Kanban>
 *
 * Каждая доска это тот же запрос протокола с условием «groupBy equals значение доски» и своей страницей.
 * Дизайн карточки целиком ваш: компонент-рендерер получает prop `row`.
 * Зависимости: jQuery, Wex, Quas, wex-source.js, wex-draggable.js (порядок подключения именно такой).
 */
(function (global) {
    'use strict'

    const $ = global.jQuery
    const { component } = global.jqvm

    const DEFAULTS = {
        name: 'Kanban',             // имя тега
        perGroup: 20,               // карточек на доску за один запрос
        cards: {},                  // { ИмяТега: WexView }: компоненты карточек, регистрируются глобально
        reportUnknown: true,        // проверять записи со статусом вне списка досок и писать критическое сообщение
        moreText: 'Показать ещё',
        minColumn: 220,             // минимальная ширина доски, px
        classes: {                  // классы Quas на обёртке; переопределяются по ключам
            root: '',
            board: 'rounded bg-[#f5f5f5] dark:bg-slate-800',
            header: 'flex h-[35px] items-center gap-2 px-3 text-[11px] font-bold text-[#929292] dark:text-slate-400',
            count: 'text-[10px] font-normal text-[#aaa]',
            cards: 'flex min-h-[40px] flex-col gap-[3px] px-1 pb-1',
            card: '',
            more: 'mx-1 mb-1 w-[calc(100%-0.5rem)] rounded py-1.5 text-[11px] text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
        }
    }

    const plain = x => JSON.parse(JSON.stringify(x))

    // report из ядра Wex, если он доступен в jqvm; иначе console.error в том же духе
    function report(title, ctx) {
        const r = global.jqvm && global.jqvm.report
        if (typeof r === 'function') r(title, ctx)
        else console.error('[Kanban] ' + title, ctx && ctx.hint ? ctx.hint : '')
    }

    // ВАЖНО: источник в w-for должен начинаться с имени из 2+ символов (col.rows, а не b.rows): так устроена регулярка в ядре Wex
    function template(o, chain) {
        const C = o.classes
        return `<template>
<div class="kb ${C.root}" style="display:grid;gap:8px;align-items:start;grid-template-columns:{{ cols }}">
  <section w-for="col in list traceby col.key" class="${C.board}">
    <header class="${C.header}"><span>{{ col.label }}</span><span w-if="!!col.countText" class="${C.count}">{{ col.countText }}</span></header>
    <div class="kb-cards ${C.cards}" data-container="{{ col.value }}">
      <div w-for="item in col.rows traceby item.key" class="kb-card ${C.card}">
        <span w-if="!card">{{ item.label }}</span>
        ${chain}
      </div>
    </div>
    <button w-if="!!col.more" type="button" class="kb-more ${C.more}" data-board="{{ col.value }}">${o.moreText}</button>
  </section>
</div>
</template>`
    }

    function createKanban(userOptions) {
        const user = userOptions || {}
        const o = Object.assign({}, DEFAULTS, user)
        o.classes = Object.assign({}, DEFAULTS.classes, user.classes)

        if (typeof global.getSource !== 'function') throw new Error('Kanban: подключите wex-source.js до wex-kanban.js')
        if (typeof global.dragWith !== 'function') throw new Error('Kanban: подключите wex-draggable.js до wex-kanban.js')

        // компоненты карточек регистрируются глобально; в шаблоне выбираются по prop `card`
        Object.keys(o.cards).forEach(n => component(n, o.cards[n]))
        const chain = Object.keys(o.cards)
            .map(n => `<${n} w-if="card==='${n}'" :row="item.row"></${n}>`).join('')

        const subs = new Map()      // state -> { src, onChange }
        const tokens = new Map()    // state -> { значение доски: номер последнего запроса }

        const nextToken = (s, value) => {
            const t = tokens.get(s) || {}
            tokens.set(s, t)
            return (t[value] = (t[value] || 0) + 1)
        }
        const isCurrent = (s, value, tok) => (tokens.get(s) || {})[value] === tok

        const normalize = raw => (Array.isArray(raw) ? raw : []).map((b) => {
            const isObj = b && typeof b === 'object'
            const rawValue = isObj ? b.value : b
            return {
                key: 'board:' + rawValue,       // не пересекается с ключами карточек в data-id
                value: String(rawValue), raw: rawValue,
                label: isObj && b.label != null ? b.label : String(rawValue),
                rows: [], total: null, countText: '', page: 0, more: false
            }
        })

        const wrap = (r, rowKey) => ({
            key: String(r[rowKey]),
            label: String(r.title != null ? r.title : r.name != null ? r.name : r[rowKey]),
            row: r
        })

        // порядок: пользовательская сортировка источника главнее; иначе position (если задан); иначе как отдал сервер
        const sortFor = (s, src) => (src.sort.length ? src.sort : (s.position ? [{ field: s.position, dir: 'asc' }] : []))
        const canReorder = (s, src) => !!s.position && !src.sort.length

        function loadBoard(s, v, src, value, reset) {
            const cur = s.list.find(b => b.value === value)
            if (!cur) return Promise.resolve()
            const page = reset ? 1 : cur.page + 1
            const tok = nextToken(s, value)
            return src.fetch({
                page, perPage: s.perGroup, sort: sortFor(s, src),
                extra: [{ field: s.groupBy, operator: 'equals', value: cur.raw }]
            }).then((res) => {
                if (!isCurrent(s, value, tok)) return
                const list = plain(s.list)
                const b = list.find(x => x.value === value)
                if (!b) return
                const rows = res.rows.map(r => wrap(r, src.rowKey))
                b.rows = reset ? rows : b.rows.concat(rows)
                b.page = res.page
                b.total = res.total
                b.countText = res.total == null ? '' : String(res.total)
                b.more = res.page < res.lastPage
                s.list = list
            }).catch((err) => {
                report('Kanban «' + s.source + '»: не удалось загрузить доску «' + value + '»', { level: 'error', view: v, hint: String(err && err.message || err) })
            })
        }

        // записи со статусом вне списка досок не показываются, но о них сообщаем
        function checkUnknown(s, v, src) {
            if (!o.reportUnknown || !s.list.length) return
            const values = s.list.map(b => b.raw)
            src.fetch({ page: 1, perPage: 1, sort: [], extra: [{ field: s.groupBy, operator: 'not_in', value: values }] })
                .then((res) => {
                    if (res.total > 0) {
                        report('Kanban «' + s.source + '»: пришёл пришелец! ' + res.total + ' записей со статусом вне досок [' + values.join(', ') + '], карточки не показаны', {
                            level: 'error', view: v,
                            hint: 'Добавьте значение в boards или проверьте статусы на сервере'
                        })
                    }
                })
                .catch(() => {})
        }

        function loadAll(s, v, src) {
            s.list.forEach(b => loadBoard(s, v, src, b.value, true))
            checkUnknown(s, v, src)
        }

        function onDrop(s, v, e) {
            if (!e.moved) return
            const list = plain(s.list)
            const from = list.find(b => b.value === e.from)
            const to = list.find(b => b.value === e.to)
            if (!from || !to) return
            const card = from.rows.find(c => c.key === String(e.id))
            if (!card) return

            // оптимистичное обновление: сервер подтверждает или откатывает через e.revert()
            const row = Object.assign({}, card.row, { [s.groupBy]: to.raw })
            const moved = { key: card.key, label: card.label, row }
            const rest = from.rows.filter(c => c.key !== card.key)
            const base = from === to ? rest : to.rows
            const at = Math.max(0, Math.min(e.index, base.length))
            const next = base.slice(0, at).concat(moved, base.slice(at))
            if (from === to) from.rows = next
            else {
                from.rows = rest
                to.rows = next
                if (from.total != null) { from.total -= 1; from.countText = String(from.total) }
                if (to.total != null) { to.total += 1; to.countText = String(to.total) }
            }
            s.list = list

            const src = global.getSource(s.source)
            const payload = {
                id: e.id, from: e.from, to: e.to, index: e.index, before: e.before, after: e.after,
                row, source: s.source, groupBy: s.groupBy,
                revert: () => {
                    loadBoard(s, v, src, e.from, true)
                    if (e.to !== e.from) loadBoard(s, v, src, e.to, true)
                }
            }
            v.emit('$kanbanCardMove', payload)     // .on('$kanbanCardMove', (state, e) => ...)
            v.emit('cardMove', payload)            // <Kanban @cardMove="onMove">
        }

        const view = $(template(o, chain).trim())
            .state(() => ({
                // props
                source: '', groupBy: '', boards: [], card: '', position: '', perGroup: o.perGroup,
                // данные
                list: [], cols: '', reorder: false
            }))

            .on('$mount', function (s) {
                const v = this
                const src = global.getSource(s.source)
                if (!src) {
                    report('Kanban: источник «' + s.source + '» не найден', { level: 'error', view: v, hint: 'Вызовите createSource("' + s.source + '", {...}) до mount' })
                    return
                }
                if (!s.groupBy) {
                    report('Kanban: не задан groupBy (поле, по которому строятся доски)', { level: 'error', view: v })
                    return
                }
                s.perGroup = parseInt(s.perGroup, 10) || o.perGroup
                s.list = normalize(s.boards)
                s.cols = 'repeat(' + Math.max(1, s.list.length) + ', minmax(' + o.minColumn + 'px, 1fr))'
                s.reorder = canReorder(s, src)

                // фильтры, поиск или сортировка поменялись в источнике: перезагружаем все доски
                const onChange = () => { s.reorder = canReorder(s, src); loadAll(s, v, src) }
                src.on('change', onChange)
                subs.set(s, { src, onChange })
                loadAll(s, v, src)
            })
            .on('$unmount', function (s) { const d = subs.get(s); if (d) { d.src.off('change', d.onChange); subs.delete(s) } tokens.delete(s) })
            .on('$destroy', function (s) { const d = subs.get(s); if (d) { d.src.off('change', d.onChange); subs.delete(s) } tokens.delete(s) })

            .on('click', '.kb-more', function (s) {
                const v = this
                return function (e) {
                    const src = global.getSource(s.source)
                    if (src) loadBoard(s, v, src, e.currentTarget.getAttribute('data-board'), false)
                }
            })

        global.dragWith(view, (s, v) => ({
            rootSelector: '.kb',
            mode: 'list',
            containers: '.kb-cards',
            // внутри доски карточки переставляются только при заданном position и без пользовательской сортировки
            canDrop: ctx => ctx.from !== ctx.to || s.reorder,
            on: { drop: e => onDrop(s, v, e) }
        }))

        component(o.name, view)

        const plugin = function () { return {} }
        plugin.view = view
        return plugin
    }

    global.createKanban = createKanban
})(window)