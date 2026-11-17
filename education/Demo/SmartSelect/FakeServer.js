// ---------- фейковый сервер: данные из JSON через $wire (нужен http-сервер, не file://), поиск и пагинацию считаем здесь
const load = file => new Promise(res => $wire.get(file).done(res))
const cache = {}
const loadAll = file => cache[file] || (cache[file] = load(file))
const delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms))

// transport для createSelect: (url) => Promise. Случайная задержка видна в статусе "Loading…"
// и заодно показывает защиту от устаревших ответов (быстрый ввод).
function fakeServer(url) {
    const u = new URL(url, location.href)
    const q = (u.searchParams.get('q') || '').toLowerCase().trim()
    const page = parseInt(u.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(u.searchParams.get('per_page') || '5', 10)
    const ms = 150 + Math.random() * 450
    console.log('REQUEST', url)

    if (u.pathname === '/api/products') {
        return loadAll('./Products.json').then(all => {
            const rows = all.filter(p => !q || p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
            return delay(ms, { data: rows.slice(0, 8) })   // топ-8, как в живом поиске
        })
    }
    if (u.pathname === '/api/categories') {
        return loadAll('./Categories.json').then(all => {
            const rows = all.filter(c => !q || c.label.toLowerCase().includes(q))
            const from = (page - 1) * pageSize
            return delay(ms, rows.slice(from, from + pageSize))   // голый массив тоже поддерживается
        })
    }
    return Promise.reject(new Error('404 ' + url))
}