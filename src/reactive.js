/*
 * Wex 3 reactive layer: отслеживание зависимостей (как Vue/Solid).
 *  reactive / toRaw / isReactive / subscribe(root, fn)  - как раньше
 *  Effect, untrack, track, trigger, flush               - новое
 * Эффект запоминает пары (объект, ключ), которые прочитал, и перезапускается только при их мутации.
 */
const RAW = Symbol('wex.raw')
const ITERATE = Symbol('wex.iterate')
const proxies = new WeakMap()
const targetMap = new WeakMap()   // raw -> Map<key, Set<Effect>>
const subs = new WeakMap()        // raw -> Set<fn>   (подписка на любое изменение поддерева)
const parents = new WeakMap()     // raw child -> Set<raw parent>
let subCount = 0
let activeEffect = null
let seq = 0

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
const isPlain = (v) => {
    if (v === null || typeof v !== 'object') return false
    if (Array.isArray(v)) return true
    const p = Object.getPrototypeOf(v)
    return p === Object.prototype || p === null
}
export const toRaw = (v) => (v && typeof v === 'object' && v[RAW]) || v
export const isReactive = (v) => !!(v && typeof v === 'object' && v[RAW])

// ---------- эффекты ----------
export class Effect {
    constructor(fn) { this.fn = fn; this.id = ++seq; this.deps = []; this.active = true; this.queued = false; this.view = null }
    run() {
        if (!this.active) return
        cleanup(this)
        const prev = activeEffect
        activeEffect = this
        try { return this.fn() } finally { activeEffect = prev }
    }
    stop() { if (this.active) { cleanup(this); this.active = false } }
}

function cleanup(e) {
    const d = e.deps
    for (let i = 0; i < d.length; i++) d[i].delete(e)
    d.length = 0
}

export function untrack(fn) {
    const prev = activeEffect
    activeEffect = null
    try { return fn() } finally { activeEffect = prev }
}

export function track(target, key) {
    const e = activeEffect
    if (!e) return
    let m = targetMap.get(target)
    if (!m) targetMap.set(target, (m = new Map()))
    let dep = m.get(key)
    if (!dep) m.set(key, (dep = new Set()))
    if (!dep.has(e)) { dep.add(e); e.deps.push(dep) }
}

export function trigger(target, key, type, newLen) {
    const m = targetMap.get(target)
    if (!m) return
    const add = (dep) => { if (dep) dep.forEach((e) => { if (e !== activeEffect) enqueue(e) }) }
    const isArr = Array.isArray(target)
    if (isArr && key === 'length') {
        m.forEach((dep, k) => { if (k === 'length' || (typeof k === 'string' && +k >= newLen)) add(dep) })
        return
    }
    if (key !== undefined) add(m.get(key))
    if (type === 'add' || type === 'delete') add(m.get(isArr ? 'length' : ITERATE))
}

// ---------- планировщик ----------
const queue = new Set()
let pending = false
let flushId = 0
const byId = (a, b) => a.id - b.id

function enqueue(e) {
    if (e.queued) return
    e.queued = true
    queue.add(e)
    if (!pending) { pending = true; Promise.resolve().then(flush) }
}

export function runEffects(list) {
    list.sort(byId)
    for (const e of list) {
        if (!e.active) continue
        try { e.run() } catch (err) { console.error(err) }
    }
}

export function flush() {
    pending = false
    let guard = 0
    while (queue.size && guard++ < 100) {
        const list = Array.from(queue)
        queue.clear()
        list.sort(byId)
        flushId++
        for (const e of list) {
            e.queued = false
            if (!e.active) continue
            const v = e.view
            if (v && !v.__gate(flushId)) { v.skipped.add(e); continue }
            try { e.run() } catch (err) { console.error(err) }
        }
    }
    if (queue.size) { console.error('Wex: бесконечный цикл обновлений'); queue.forEach(e => { e.queued = false }); queue.clear() }
}

// ---------- подписка на поддерево (для $change и storage) ----------
function link(child, parent) {
    let set = parents.get(child)
    if (!set) parents.set(child, (set = new Set()))
    if (!set.has(parent)) set.add(parent)
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

export function subscribe(target, fn) {
    const raw = toRaw(target)
    let set = subs.get(raw)
    if (!set) subs.set(raw, (set = new Set()))
    set.add(fn)
    subCount++
    return () => { if (set.delete(fn)) subCount-- }
}

// ---------- proxy ----------
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
    get(target, key) {
        if (key === RAW) return target
        if (Array.isArray(target) && hasOwn(searchers, key)) return searchers[key]
        // receiver не передаём: объект может быть прототипом локального scope (строка w-for)
        const value = Reflect.get(target, key)
        if (typeof key === 'symbol') return value
        if (activeEffect) track(target, key)
        if (!isPlain(value)) return value
        const d = Object.getOwnPropertyDescriptor(target, key)
        if (d && !d.configurable && !d.writable) return value
        const raw = toRaw(value)
        if (subCount) link(raw, target)
        return reactive(raw)
    },

    has(target, key) {
        if (activeEffect && typeof key !== 'symbol') track(target, key)
        return Reflect.has(target, key)
    },

    ownKeys(target) {
        if (activeEffect) track(target, Array.isArray(target) ? 'length' : ITERATE)
        return Reflect.ownKeys(target)
    },

    // `x = 1` в дочернем scope приходит с receiver = locals: пишем строго в target
    set(target, key, value) {
        const next = toRaw(value)
        const had = hasOwn(target, key)
        const prev = target[key]
        const ok = Reflect.set(target, key, next)
        if (ok && (!had || prev !== next)) {
            if (isPlain(next)) link(next, target)
            const type = had ? 'set' : 'add'
            if (subCount) notify(target, { target, key, type })
            trigger(target, key, type, Array.isArray(target) && key === 'length' ? next : undefined)
        }
        return ok
    },

    deleteProperty(target, key) {
        const had = hasOwn(target, key)
        const ok = Reflect.deleteProperty(target, key)
        if (ok && had) {
            if (subCount) notify(target, { target, key, type: 'delete' })
            trigger(target, key, 'delete')
        }
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

export const shareState = reactive