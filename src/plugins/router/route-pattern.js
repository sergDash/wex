// route-pattern.js
// Синтаксис: {id}  {id?}  {id:\d+}  {slug:[a-z-]+}  {path*}
// Ограничение: внутри {name:regex} нельзя использовать фигурные скобки (\d{2} не сработает).
// Если нужно, пишите \d\d или используйте regex:
// Группы ( ) внутри {name:regex} допустимы: индексы параметров считаются с их учётом.

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const dec = s => { try { return decodeURIComponent(s) } catch { return s } }
const countGroups = src => new RegExp(src + '|').exec('').length - 1

const tokenRe = /\{(\w+)(\?|\*)?(?::([^}]+))?\}/g
const compiled = new Map()
const compiledRaw = new Map()

export function compileRoute(pattern) {
    const cached = compiled.get(pattern)
    if (cached) return cached

    const keys = []     // имена параметров
    const groups = []   // номера их capture-групп в итоговой регулярке
    let src = ''
    let last = 0
    let n = 0           // сколько capture-групп уже открыто

    for (const m of pattern.matchAll(tokenRe)) {
        let literal = pattern.slice(last, m.index)
        const [, name, mod, custom] = m
        const body = custom || (mod === '*' ? '.*' : '[^/]+')

        keys.push(name)
        groups.push(++n)
        n += countGroups(body)

        if (mod === '?') {
            // необязательный параметр забирает слеш перед собой
            const slash = literal.endsWith('/')
            if (slash) literal = literal.slice(0, -1)
            src += esc(literal) + (slash ? '(?:/' : '(?:') + '(' + body + '))?'
        }
        else {
            src += esc(literal) + '(' + body + ')'
        }
        last = m.index + m[0].length
    }

    // завершающий слеш шаблона не обязателен ни в шаблоне, ни в адресе
    let tail = pattern.slice(last)
    if (tail.endsWith('/')) tail = tail.slice(0, -1)
    src += esc(tail)

    const result = { regex: new RegExp('^' + src + '/?$'), keys, groups }
    compiled.set(pattern, result)
    return result
}

function compileRaw(pattern) {
    let re = compiledRaw.get(pattern)
    if (re) return re
    const body = pattern.slice(6).trim()
    const i = body.lastIndexOf('/')
    if (body[0] !== '/' || i < 1) {
        throw new Error(`route: неверная запись regex: «${pattern}», ожидается regex:/.../flags`)
    }
    // g и y делают exec состоятельным (lastIndex) и ломают повторные проверки
    re = new RegExp(body.slice(1, i), body.slice(i + 1).replace(/[gy]/g, ''))
    compiledRaw.set(pattern, re)
    return re
}

export function matchRoute(pattern, pathname) {
    // regex: сырая регулярка, результат: params[0], params[1] ... (+ именованные группы)
    if (pattern.startsWith('regex:')) {
        const m = compileRaw(pattern).exec(pathname)
        if (!m) return null
        const params = {}
        m.slice(1).forEach((v, k) => { params[k] = v })
        if (m.groups) Object.assign(params, m.groups)
        return params
    }

    const { regex, keys, groups } = compileRoute(pattern)
    const m = regex.exec(pathname)
    if (!m) return null
    const params = {}
    keys.forEach((k, i) => {
        const v = m[groups[i]]
        if (v !== undefined) params[k] = dec(v)
    })
    return params
}

// route('post.show', { id: 5, page: 2 }) -> '/post/5?page=2'
export function buildRoute(pattern, params = {}) {
    const used = new Set()
    let url = pattern.replace(/(\/?)\{(\w+)(\?|\*)?(?::[^}]+)?\}/g, (all, slash, name, mod) => {
        const v = params[name]
        if (v === undefined || v === null) {
            if (mod === '?') return ''
            throw new Error(`route: не хватает параметра «${name}» для ${pattern}`)
        }
        used.add(name)
        const enc = mod === '*' ? String(v).split('/').map(encodeURIComponent).join('/') : encodeURIComponent(v)
        return slash + enc
    })
    if (url === '') url = '/'

    const rest = []
    Object.keys(params).forEach((k) => {
        if (used.has(k)) return
        const v = params[k]
        if (v === undefined || v === null) return
            ;[].concat(v).forEach(x => rest.push(encodeURIComponent(k) + '=' + encodeURIComponent(x)))
    })
    if (rest.length) url += (url.includes('?') ? '&' : '?') + rest.join('&')
    return url
}