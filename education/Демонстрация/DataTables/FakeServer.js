// ---------- фейковый сервер: все данные из JSON через $wire, остальное считаем здесь
let cache = null
const loadAll = () => cache || (cache = new Promise(res => $wire.get('./products.json').done(res)))

function matches(row, f) {
    const cs = !!f.case_sensitive
    const n = x => (typeof x === 'string' && !cs ? x.toLowerCase() : x)
    const a = n(row[f.field])
    const v = Array.isArray(f.value) ? f.value.map(n) : n(f.value)
    switch (f.operator) {
        case 'equals': return a === v
        case 'not_equals': return a !== v
        case 'contains': return String(a).includes(v)
        case 'not_contains': return !String(a).includes(v)
        case 'starts_with': return String(a).startsWith(v)
        case 'ends_with': return String(a).endsWith(v)
        case 'greater_than': return a > v
        case 'less_than': return a < v
        case 'greater_or_equal': return a >= v
        case 'less_or_equal': return a <= v
        case 'between': return a >= v[0] && a <= v[1]
        case 'not_between': return a < v[0] || a > v[1]
        case 'in': return v.includes(a)
        case 'not_in': return !v.includes(a)
        case 'is_null': return row[f.field] == null
        case 'is_not_null': return row[f.field] != null
        case 'is_empty': return row[f.field] === ''
        case 'is_not_empty': return row[f.field] != null && row[f.field] !== ''
    }
    return true
}

function fakeServer(url, body) {
    console.log('REQUEST', url, JSON.stringify(body))
    return loadAll().then(all => {
        let rows = all.slice()
        const items = body.filters.items
        rows = rows.filter(r => body.filters.match === 'any' ? items.some(f => matches(r, f)) : items.every(f => matches(r, f)))
        if (body.search) {
            const q = body.search.value.toLowerCase()
            const fields = body.search.field ? [body.search.field] : body.columns
            rows = rows.filter(r => fields.some(k => String(r[k]).toLowerCase().includes(q)))
        }
        body.sort.slice().reverse().forEach(s => {
            rows.sort((x, y) => (x[s.field] > y[s.field] ? 1 : x[s.field] < y[s.field] ? -1 : 0) * (s.dir === 'desc' ? -1 : 1))
        })
        const per = body.per_page, total = rows.length, last = Math.max(1, Math.ceil(total / per))
        const page = Math.min(body.page, last), start = (page - 1) * per
        const data = rows.slice(start, start + per).map(r => Object.fromEntries(body.columns.map(k => [k, r[k]])))
        // формат как у Laravel paginate()
        const res = { current_page: page, data, from: total ? start + 1 : null, to: total ? start + data.length : null, last_page: last, per_page: per, total }
        return new Promise(r => setTimeout(() => r(res), 250))
    })
}