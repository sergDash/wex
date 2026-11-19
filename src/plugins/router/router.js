// ВАЖНО: ядро (wex.js) и wire.js здесь внешние: в сборке плагина они берутся из глобала jqvm.
// Пути в import должны совпадать с ключами externals в rolldown.config.js.
import { directive, component, preloadComponent } from '../../wex.js'
import { $wire } from '../../wire.js'
import { matchRoute, buildRoute } from './route-pattern.js'

// Имя тега для комментария-заглушки (вместо импорта из utils.js: плагину не нужна копия утилит ядра)
const getNodeName = el => (el && el.nodeName ? el.nodeName.toLowerCase() : 'node')

// Патчим history один раз: при повторной загрузке модуля события не задвоятся
if (!window.history.__wexPatched) {
  const rewriteHistory = (type) => {
    const origin = window.history[type]
    return function () {
      const rv = origin.apply(this, arguments)
      const e = new Event(type)
      e.arguments = arguments
      window.dispatchEvent(e)
      return rv
    }
  }
  window.history.pushState = rewriteHistory('pushState')
  window.history.replaceState = rewriteHistory('replaceState')
  Object.defineProperty(window.history, '__wexPatched', { value: true })
}

class Base {
  constructor(options) {
    this.events = []
    const off = this.init(options)
    if (off) {
      this.on('$destroy', off)
    }
  }

  init() {}

  on(e, fn) {
    this.events.push({ e, fn })
    return this
  }

  off(e, fn) {
    // новый массив: обработчик может снять себя прямо во время emit
    this.events = this.events.filter(item => !(item.e === e && item.fn === fn))
    return this
  }

  emit(e, ...args) {
    // копия: on/off внутри обработчиков не должны сбивать обход
    this.events.slice().forEach((item) => {
      if (item.e === e) {
        item.fn(...args)
      }
    })
  }

  destroy() {
    this.emit('$destroy')
  }
}

class Navigation extends Base {
  init() {
    this.actionType = ''
    // Позиция в истории хранится числом в state.idx: структурное клонирование
    // ломает сравнение объектов по ссылке, а цепочка prev росла с каждым push.
    const initial = window.history.state?.idx
    this.idx = typeof initial === 'number' ? initial : 0

    const onUrlChanged = (e) => {
      let type = e.type
      const idx = window.history.state?.idx

      if (typeof idx === 'number') {
        if (type === 'popstate') {
          if (idx < this.idx) type = 'back'
          else if (idx > this.idx) type = 'forward'
        }
        this.idx = idx
      }

      this.actionType = type
      this.emit(type, window.location.href)
      this.emit('change', window.location.href)
    }

    const onBeforeUnload = (e) => {
      if (this.events.some(item => item.e === 'protect')) {
        let prevented = false
        const resolve = () => void 0
        const reject = () => prevented = true

        this.emit('protect', resolve, reject)

        if (prevented) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('popstate', onUrlChanged)
    window.addEventListener('replaceState', onUrlChanged)
    window.addEventListener('pushState', onUrlChanged)
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('popstate', onUrlChanged)
      window.removeEventListener('replaceState', onUrlChanged)
      window.removeEventListener('pushState', onUrlChanged)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }

  back() {
    window.history.back()
  }

  forward() {
    window.history.forward()
  }

  // url может быть относительным, а location.href всегда абсолютный
  same(url) {
    return new URL(url, window.location.href).href === window.location.href
  }

  push(url) {
    if (this.same(url)) return
    window.history.pushState({ idx: this.idx + 1, url }, '', url)
  }

  replace(url) {
    if (this.same(url)) return
    window.history.replaceState({ idx: this.idx, url }, '', url)
  }

  open(url) {
    window.open(url)
  }
}

const navigation = new Navigation()

let activeRouter = null

const fill = (tpl, params) =>
    tpl.replace(/\{(\w+)\}/g, (_, k) => encodeURIComponent(params[k] ?? ''))

const dec = (s) => {
  try { return decodeURIComponent(s.replace(/\+/g, ' ')) }
  catch { return s }
}

class Router extends Base {
  init(options) {
    this.options = options
    this.routes = Object.create(null)   // чтобы ref вроде 'constructor' не находил прототип
    const table = options.routes || {}
    Object.keys(table).forEach((name) => {
      const r = table[name]
      this.routes[name] = typeof r === 'string' ? { path: r } : r
    })
    this.extra = new Set()   // паттерны, которые встретились только в шаблонах
    this.url = this.getUrl()

    const onChange = () => {
      const { baseUri = '' } = options
      const url = this.getUrl()
      const prev = this.url
      this.url = url
      if (prev === url) return
      if (baseUri && url.indexOf(baseUri) !== 0) return
      this.emit('change', url)
    }
    navigation.on('change', onChange)
    return () => navigation.off('change', onChange)
  }

  navigate(type, to) {
    if (this.options.mode === 'history') {
      navigation[type](to)
    }
    else {
      const { pathname, search = '' } = window.location
      navigation[type](pathname + search + '#' + to)
    }
  }

  getUrl() {
    const { hash, href, origin } = window.location
    if (this.options.mode === 'history') return href.replace(origin, '')
    return hash.replace('#', '') || '/'
  }

  getLocation() {
    let raw = this.getUrl()
    // в history-режиме в адресе может быть якорь (/post/5#comments), он не часть пути
    if (this.options.mode === 'history') raw = raw.split('#')[0]

    const q = raw.indexOf('?')
    const pathname = q < 0 ? raw : raw.slice(0, q)
    const search = q < 0 ? '' : raw.slice(q + 1)

    const query = {}
    search.split('&').filter(Boolean).forEach((item) => {
      const i = item.indexOf('=')
      const k = i < 0 ? item : item.slice(0, i)
      const v = i < 0 ? '' : item.slice(i + 1)
      query[dec(k)] = dec(v)
    })
    return { pathname, search, query }
  }

  // undefined / null удаляют ключ из query
  setParams(params) {
    const { pathname, query } = this.getLocation()
    const next = { ...query, ...params }
    const search = Object.keys(next)
        .filter(k => next[k] !== undefined && next[k] !== null)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(next[k]))
        .join('&')
    this.navigate('push', pathname + (search ? '?' + search : ''))
  }

  // --- таблица роутов ---

  pattern(ref) {
    return this.routes[ref] ? this.routes[ref].path : ref
  }

  register(pattern) {
    // имя роута ('post.show') паттерном не является
    if (this.routes[pattern]) return
    const known = Object.values(this.routes).some(r => r.path === pattern)
    if (!known) this.extra.add(pattern)
  }

  matchPath(pathname) {
    for (const name of Object.keys(this.routes)) {
      const params = matchRoute(this.routes[name].path, pathname)
      if (params) return { name, route: this.routes[name], params }
    }
    for (const pattern of this.extra) {
      const params = matchRoute(pattern, pathname)
      if (params) return { name: null, route: { path: pattern }, params }
    }
    return { name: null, route: null, params: {} }
  }

  match() {
    return this.matchPath(this.getLocation().pathname)
  }

  isMatch(ref) {
    return matchRoute(this.pattern(ref), this.getLocation().pathname) !== null
  }

  // route('post.show', {id: 5}) -> '/post/5'; лишние ключи уходят в ?query
  path(ref, params) {
    return buildRoute(this.pattern(ref), params)
  }

  // то, что кладём в href: в hash-режиме с '#'
  href(path) {
    return this.options.mode === 'history' ? path : '#' + path
  }

  url2(ref, params) {
    return this.href(this.path(ref, params))
  }

  go(ref, params, type = 'push') {
    this.navigate(type, this.path(ref, params))
  }

  // --- префетч: компонент + данные ---

  prefetchPath(path) {
    const hit = this.matchPath(path.split('?')[0])
    if (!hit.route) return
    const { component: url, data } = hit.route
    if (url) preloadComponent(url)
    const list = typeof data === 'function' ? data(hit.params) : data
    ;[].concat(list || []).forEach(u => $wire.prefetch(fill(u, hit.params)))
  }
}

export function route(ref, params) {
  if (!activeRouter) throw new Error('Wex: подключите createRouter() через .plugin(...)')
  return activeRouter.url2(ref, params)
}

// ------------ директивы и компоненты (глобальные, работают во всех компонентах) ------------

// w-route="/post/{id}" | w-route="post.show" | w-route="regex:/^\/a/i" | старое w-route="'/'"
directive('w-route', function ($el, attrs) {
  const router = activeRouter
  if (!router) throw new Error('Wex: подключите createRouter() через .plugin(...)')

  let pattern = attrs['w-route'].trim()
  if (/^(['"]).*\1$/.test(pattern)) pattern = pattern.slice(1, -1)

  router.register(pattern)
  if (!router.isMatch(pattern)) {
    return `<!-- ${getNodeName($el[0])} w-route="${pattern.replace(/--/g, '- -')}" (hidden) -->`
  }
}, null, 100)

// <Link to="post.show" :params="{ id: post.id }" class="...">текст</Link>
// <Link to="/about"> или <Link :to="expr">
component('Link', function ($el, attrs, slot) {
  const router = activeRouter
  const ref = attrs[':to'] ? this.scope.parse(attrs[':to']) : attrs.to
  const params = attrs[':params'] ? this.scope.parse(attrs[':params']) : {}
  const path = router.path(ref, params)

  const a = document.createElement('a')
  Object.keys(attrs).forEach((k) => {
    if (k === 'to' || k[0] === ':' || k[0] === '@') return
    a.setAttribute(k, attrs[k])
  })
  a.setAttribute('href', router.href(path))
  a.setAttribute('data-wex-link', path)
  slot().forEach(n => a.appendChild(n))
  return a
}, function ($el) {
  const a = $el[0]
  const path = a && a.getAttribute && a.getAttribute('data-wex-link')
  if (!path) return

  const router = activeRouter
  let timer = null
  const warm = () => router.prefetchPath(path)
  const enter = () => { clearTimeout(timer); timer = setTimeout(warm, 65) }
  const leave = () => clearTimeout(timer)
  const click = (e) => {
    if (router.options.mode !== 'history') return   // в hash-режиме обычный <a href="#/..."> достаточно
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return
    e.preventDefault()
    router.navigate('push', path)
  }

  a.addEventListener('mouseenter', enter)
  a.addEventListener('mouseleave', leave)
  a.addEventListener('touchstart', warm, { passive: true })
  a.addEventListener('focus', warm)
  a.addEventListener('click', click)
  return () => {
    clearTimeout(timer)
    a.removeEventListener('mouseenter', enter)
    a.removeEventListener('mouseleave', leave)
    a.removeEventListener('touchstart', warm)
    a.removeEventListener('focus', warm)
    a.removeEventListener('click', click)
  }
})

export function createRouter(options = {}) {
  const router = new Router(options)

  return function () {
    const { view } = this
    activeRouter = router

    const $route = {}
    const def = (key, get) => Object.defineProperty($route, key, { get, enumerable: true })
    def('name',   () => router.match().name)
    def('params', () => router.match().params)
    def('query',  () => router.getLocation().query)
    def('path',   () => router.getLocation().pathname)
    Object.defineProperty($route, 'url', { value: (ref, p) => router.url2(ref, p), enumerable: false })

    // view.directive('w-navigate', ...) — как было, без изменений

    const routerChange = () => {
      view.emit('$route', router.getUrl())
      view.update(true)
    }

    return {
      $init: (state) => {
        view.$router = router
        state.$route = $route
        router.on('change', routerChange)
      },
      $destroy: () => {
        router.off('change', routerChange)
        router.destroy()
        if (activeRouter === router) activeRouter = null
      },
      $clone: (state, clonedView) => { clonedView.$router = router },
    }
  }
}