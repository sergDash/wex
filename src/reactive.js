/*
 * Wex reactive layer ES-модуль, подключается из wex.js.
 *
 *  reactive(v)            -> прокси (один raw = один прокси); не plain-объекты возвращаются как есть
 *  toRaw(v) / isReactive(v)
 *  subscribe(target, fn)  -> unsubscribe; fn({ target, key, type }) синхронно при мутации target
 *                            или любого вложенного объекта (связи «ребёнок -> родитель» строятся при чтении/записи)
 */
const RAW = Symbol('wex.raw')
const proxies = new WeakMap()   // raw -> proxy
const subs = new WeakMap()      // raw -> Set<fn>
const parents = new WeakMap()   // raw child -> Set<raw parent>

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const isPlain = (v) => {
    if (v === null || typeof v !== 'object') return false
    if (Array.isArray(v)) return true
    const p = Object.getPrototypeOf(v)
    return p === Object.prototype || p === null
}

export const toRaw = (v) => (v && typeof v === 'object' && v[RAW]) || v
export const isReactive = (v) => !!(v && typeof v === 'object' && v[RAW])

function link(child, parent) {
    let set = parents.get(child)
    if (!set) parents.set(child, (set = new Set()))
    set.add(parent)
}

function notify(raw, info) {
    const seen = new Set()
    const fns = new Set()
    const stack = [raw]
    while (stack.length) {
        const cur = stack.pop()
        if (seen.has(cur)) continue
        seen.add(cur)
        const s = subs.get(cur)
        if (s) s.forEach(fn => fns.add(fn))
        const p = parents.get(cur)
        if (p) p.forEach(x => stack.push(x))
    }
    fns.forEach((fn) => { try { fn(info) } catch (e) { console.error(e) } })
}

const searchers = {}
;['includes', 'indexOf', 'lastIndexOf'].forEach((name) => {
    searchers[name] = function (...args) {
        const raw = toRaw(this)
        let res = raw[name](...args)
        if (res === false || res === -1) res = raw[name](...args.map(toRaw))
        return res
    }
})

const handler = {
    get(target, key, receiver) {
        if (key === RAW) return target
        if (Array.isArray(target) && hasOwn(searchers, key)) return searchers[key]

        // receiver не передаём: объект может быть прототипом чужого объекта (локальный scope ScopeX)
        const value = Reflect.get(target, key)
        if (typeof key === 'symbol' || !isPlain(value)) return value

        const d = Object.getOwnPropertyDescriptor(target, key)
        if (d && !d.configurable && !d.writable) return value   // инвариант Proxy

        const raw = toRaw(value)
        link(raw, target)
        return reactive(raw)
    },

    // ScopeX.$new делает Object.setPrototypeOf(locals, state): присваивание `x = 1` в дочернем scope
    // приходит сюда с receiver = locals. Пишем строго в target, иначе значение осядет на locals и state не изменится.
    set(target, key, value) {
        const next = toRaw(value)
        const had = hasOwn(target, key)
        const prev = target[key]
        const ok = Reflect.set(target, key, next)
        if (ok && (!had || prev !== next)) {
            if (isPlain(next)) link(next, target)
            notify(target, { target, key, type: had ? 'set' : 'add' })
        }
        return ok
    },

    deleteProperty(target, key) {
        const had = hasOwn(target, key)
        const ok = Reflect.deleteProperty(target, key)
        if (ok && had) notify(target, { target, key, type: 'delete' })
        return ok
    },
}

export function reactive(value) {
    if (!isPlain(value)) return value
    const raw = toRaw(value)
    let p = proxies.get(raw)
    if (!p) {
        if (Object.isFrozen(raw)) return raw
        p = new Proxy(raw, handler)
        proxies.set(raw, p)
    }
    return p
}

export function subscribe(target, fn) {
    const raw = toRaw(target)
    let set = subs.get(raw)
    if (!set) subs.set(raw, (set = new Set()))
    set.add(fn)
    return () => { set.delete(fn) }
}

export const shareState = reactive