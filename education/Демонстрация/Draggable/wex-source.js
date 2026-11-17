/*
 * Wex Source: общий источник данных для видов (DataTable, Kanban, ...) и панели фильтров.
 * Без интерфейса. Хранит запрос (фильтры, поиск, сортировку), собирает JSON по протоколу DataTable
 * и грузит данные через transport. Компоненты получают источник ПО ИМЕНИ: в Wex пропсы клонируются
 * и хешируются на каждом обновлении, поэтому объекты с данными в пропсы не передаём.
 *
 *   const orders = createSource('orders', { url: '/api/orders', columns: [{ field: 'status', label: 'Status' }] })
 *   orders.on('change', () => ...)          // изменился запрос (фильтры, поиск, сортировка)
 *   orders.fetch({ page: 1, perPage: 20, extra: [{ field: 'status', operator: 'equals', value: 'new' }] })
 *        .then(({ rows, total, page, lastPage }) => ...)
 */
(function (global) {
    'use strict'

    const DEFAULTS = {
        url: '',
        rowKey: 'id',
        columns: [],                // [{ field, label, type, caseSensitive, virtual, operators }]
        caseSensitive: false,       // для текстовых операторов; на колонке: caseSensitive
        match: 'all',               // all | any
        transport: null,            // (url, body) => jqXHR | Promise. По умолчанию $wire.post(url, body)
        request: { page: 'page', perPage: 'per_page', sort: 'sort', filters: 'filters', search: 'search', columns: 'columns' },
        response: { data: 'data', total: 'total', page: 'current_page', perPage: 'per_page', lastPage: 'last_page', from: 'from', to: 'to' }
    }

    const registry = {}
    let uid = 0

    const get = (obj, path) => String(path).split('.').reduce((v, k) => (v == null ? v : v[k]), obj)
    const num = (v, d) => (v == null || v === '' || isNaN(+v) ? d : +v)
    const plain = x => JSON.parse(JSON.stringify(x))

    function createSource(name, userOptions) {
        const user = userOptions || {}
        const o = Object.assign({}, DEFAULTS, user)
        o.request = Object.assign({}, DEFAULTS.request, user.request)
        o.response = Object.assign({}, DEFAULTS.response, user.response)

        const listeners = {}
        const columns = (o.columns || []).map(c => Object.assign({}, c, {
            type: c.type || 'text', label: c.label != null ? c.label : c.field, virtual: !!c.virtual
        }))

        const src = {
            name,
            url: o.url,
            rowKey: o.rowKey,
            columns,
            options: o,
            filters: [],              // [{ id, field, operator, value, label }]
            search: { field: '', value: '' },
            sort: [],                 // [{ field, dir }]
            selection: {},            // { key: true }: выбор строк (таблица), сбрасывается при смене вида

            on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); return src },
            off(evt, fn) { listeners[evt] = (listeners[evt] || []).filter(f => f !== fn); return src },
            emit(evt, payload) { (listeners[evt] || []).slice().forEach(fn => fn(payload)); return src },

            // ---- запрос
            addFilter(item) {
                const f = Object.assign({ id: ++uid }, item)
                src.filters = src.filters.concat(f)
                src.emit('change', { type: 'filters' })
                return f.id
            },
            removeFilter(id) {
                src.filters = src.filters.filter(f => String(f.id) !== String(id))
                src.emit('change', { type: 'filters' })
                return src
            },
            setFilters(list) {
                src.filters = (list || []).map(f => Object.assign({ id: ++uid }, f))
                src.emit('change', { type: 'filters' })
                return src
            },
            clearFilters() { return src.setFilters([]) },
            setSearch(value, field) {
                src.search = { field: field || '', value: String(value || '').trim() }
                src.emit('change', { type: 'search' })
                return src
            },
            setSort(list) {
                src.sort = (list || []).map(s => ({ field: s.field, dir: s.dir === 'desc' ? 'desc' : 'asc' }))
                src.emit('change', { type: 'sort' })
                return src
            },
            clearSelection() {
                if (Object.keys(src.selection).length) { src.selection = {}; src.emit('selection', { keys: [] }) }
                return src
            },
            selected() { return Object.keys(src.selection).filter(k => src.selection[k]) },

            // ---- протокол
            // opts: { page, perPage, sort (переопределяет src.sort), extra: [условия сверх фильтров источника] }
            payload(opts) {
                const q = opts || {}
                const k = o.request
                const body = {}
                body[k.page] = q.page || 1
                body[k.perPage] = q.perPage || 15
                body[k.sort] = (q.sort || src.sort).map(s => ({ field: s.field, dir: s.dir }))
                body[k.search] = src.search.value ? { field: src.search.field || null, value: src.search.value } : null
                body[k.filters] = {
                    match: o.match,
                    items: src.filters.concat(q.extra || []).map((f) => {
                        const col = columns.find(c => c.field === f.field) || {}
                        const item = { field: f.field, operator: f.operator }
                        if (f.value !== undefined) item.value = f.value
                        if (col.type === 'text') item.case_sensitive = col.caseSensitive != null ? !!col.caseSensitive : o.caseSensitive
                        return item
                    })
                }
                body[k.columns] = columns.filter(c => !c.virtual).map(c => c.field)
                return plain(body)
            },

            fetch(opts) {
                const send = o.transport || ((url, body) => global.$wire.post(url, body))
                const body = src.payload(opts)
                const m = o.response
                return Promise.resolve(send(o.url, body)).then((res) => {
                    const rows = get(res, m.data) || []
                    return {
                        rows,
                        total: num(get(res, m.total), null),
                        page: num(get(res, m.page), body[o.request.page]),
                        perPage: num(get(res, m.perPage), body[o.request.perPage]),
                        lastPage: Math.max(1, num(get(res, m.lastPage), 1)),
                        from: num(get(res, m.from), 0),
                        to: num(get(res, m.to), 0),
                        raw: res
                    }
                })
            }
        }

        registry[name] = src
        return src
    }

    createSource.get = name => registry[name]
    global.createSource = createSource
    global.getSource = name => registry[name]
})(window)