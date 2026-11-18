// Честное сравнение Wex 3 / petite-vue / Preact / Solid / Alpine / Vue 3 / Knockout на одном и том же списке.
// Строка: <li class="r">{{label}} <b>even</b>(если id чётный) <i>a</i><i>b</i></li>  -> одинаковый textContent у всех.
(function () {
    const N = 2000
    const makeRows = (offset = 0) => Array.from({ length: N }, (_, i) => ({ id: i, label: 'row ' + (i + offset), tags: ['a', 'b'] }))
    const median = a => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] }
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)))
    const microtasks = () => new Promise(r => queueMicrotask(() => queueMicrotask(r)))

    // ---------- адаптеры ----------
    // available() — загружена ли библиотека; load() (необязательно) — асинхронная подгрузка ES-модулей; hint — подсказка при отсутствии.
    const adapters = []

    adapters.push({
        name: 'Wex 3',
        hint: 'соберите dist/wex.js',
        available: () => !!window.Wex,
        setup(el) {
            const rows = makeRows()
            const v = window.Wex.view('<ul><li w-for="r in rows traceby r.id" class="r">{{ r.label }} <b w-if="r.id % 2 === 0">even</b><i w-for="t in r.tags">{{ t }}</i></li></ul>', () => ({ rows }))
            v.mount(el)
            let s; v.update(x => { s = x })
            return {
                flush: () => window.Wex.__flush(),
                update: (i, l) => { s.rows[i].label = l },
                updateMany: (step, l) => { for (let i = 0; i < N; i += step) s.rows[i].label = l + i },
                swap: (a, b) => { const t = s.rows[a]; s.rows[a] = s.rows[b]; s.rows[b] = t },
                reverse: () => { s.rows.reverse() },
                push: row => { s.rows.push(row) },
                remove: i => { s.rows.splice(i, 1) },
                replace: r => { s.rows = r },
                destroy: () => v.destroy(),
            }
        },
    })

    adapters.push({
        name: 'petite-vue',
        hint: 'нет доступа к unpkg?',
        available: () => !!window.PetiteVue,
        setup(el) {
            const P = window.PetiteVue
            el.innerHTML = '<ul><li v-for="r in rows" :key="r.id" class="r">{{ r.label }} <b v-if="r.id % 2 === 0">even</b><i v-for="t in r.tags">{{ t }}</i></li></ul>'
            const s = P.reactive({ rows: makeRows() })
            const app = P.createApp(s)
            app.mount(el)
            return {
                flush: () => P.nextTick(),
                update: (i, l) => { s.rows[i].label = l },
                updateMany: (step, l) => { for (let i = 0; i < N; i += step) s.rows[i].label = l + i },
                swap: (a, b) => { const t = s.rows[a]; s.rows[a] = s.rows[b]; s.rows[b] = t },
                reverse: () => { s.rows.reverse() },
                push: row => { s.rows.push(row) },
                remove: i => { s.rows.splice(i, 1) },
                replace: r => { s.rows = r },
                destroy: () => { if (app.unmount) app.unmount(); el.innerHTML = '' },
            }
        },
    })

    adapters.push({
        name: 'Preact',
        hint: 'нет доступа к unpkg?',
        available: () => !!window.preact,
        setup(el) {
            const { h, render } = window.preact
            let rows = makeRows()
            const Row = r => h('li', { key: r.id, class: 'r' }, r.label, ' ', r.id % 2 === 0 ? h('b', null, 'even') : null, r.tags.map(t => h('i', { key: t }, t)))
            const draw = () => render(h('ul', null, rows.map(Row)), el)
            draw()
            // иммутабельные обновления, как принято в Preact; каждое действие перерисовывает дерево целиком (без memo)
            return {
                flush: () => {},
                update: (i, l) => { rows = rows.slice(); rows[i] = { ...rows[i], label: l }; draw() },
                updateMany: (step, l) => { rows = rows.slice(); for (let i = 0; i < N; i += step) rows[i] = { ...rows[i], label: l + i }; draw() },
                swap: (a, b) => { rows = rows.slice(); const t = rows[a]; rows[a] = rows[b]; rows[b] = t; draw() },
                reverse: () => { rows = rows.slice().reverse(); draw() },
                push: row => { rows = rows.concat([row]); draw() },
                remove: i => { rows = rows.slice(0, i).concat(rows.slice(i + 1)); draw() },
                replace: r => { rows = r; draw() },
                destroy: () => { render(null, el) },
            }
        },
    })

    // Solid: у него нет глобальной сборки без компилятора JSX, поэтому берём ES-модули с esm.sh
    // и шаблоны через solid-js/html (runtime-шаблоны, без шага сборки).
    // Состояние — createStore (глубокая реактивность), «Замена всех данных» — идиоматичный reconcile по id.
    let solid = null
    adapters.push({
        name: 'Solid',
        hint: 'нет доступа к esm.sh?',
        available: () => !!solid,
        async load() {
            if (solid) return
            const base = 'https://esm.sh/solid-js@1.9.3'
            const [core, store, web, html] = await Promise.all([
                import(base), import(base + '/store'), import(base + '/web'), import(base + '/html'),
            ])
            solid = { For: core.For, batch: core.batch, createStore: store.createStore, reconcile: store.reconcile, render: web.render, html: html.default }
        },
        setup(el) {
            const { For, batch, createStore, reconcile, render, html } = solid
            const [s, set] = createStore({ rows: makeRows() })
            const dispose = render(() => html`<ul><${For} each=${() => s.rows}>${r => html`<li class="r">${() => r.label + ' '}${() => r.id % 2 === 0 ? html`<b>even</b>` : null}<${For} each=${() => r.tags}>${t => html`<i>${t}</i>`}<//></li>`}<//></ul>`, el)
            return {
                flush: () => {},   // Solid обновляет DOM синхронно
                update: (i, l) => { set('rows', i, 'label', l) },
                updateMany: (step, l) => { batch(() => { for (let i = 0; i < N; i += step) set('rows', i, 'label', l + i) }) },
                swap: (a, b) => { set('rows', rows => { const c = rows.slice(); const t = c[a]; c[a] = c[b]; c[b] = t; return c }) },
                reverse: () => { set('rows', rows => rows.slice().reverse()) },
                push: row => { set('rows', s.rows.length, row) },
                remove: i => { set('rows', rows => rows.filter((_, k) => k !== i)) },
                replace: r => { set('rows', reconcile(r, { key: 'id', merge: true })) },
                destroy: () => dispose(),
            }
        },
    })

    // Alpine: берём ESM-сборку и инициализируем поддерево вручную (Alpine.initTree), без Alpine.start().
    // Иначе Alpine вешает MutationObserver на весь документ и разбирает DOM, который создают другие библиотеки,
    // искажая их замеры. В Alpine нет интерполяции {{ }}, поэтому текст строки — в <span x-text>
    // (textContent при этом тот же, что у остальных).
    let Alpine = null, alpineId = 0
    adapters.push({
        name: 'Alpine',
        hint: 'нет доступа к jsdelivr?',
        available: () => !!Alpine,
        async load() {
            if (!Alpine) Alpine = (await import('https://cdn.jsdelivr.net/npm/alpinejs@3.14.3/dist/module.esm.js')).default
        },
        setup(el) {
            const name = 'bench' + (++alpineId)
            Alpine.store(name, { rows: makeRows() })
            const s = Alpine.store(name)   // реактивный прокси
            el.innerHTML = `<div x-data><ul><template x-for="r in $store.${name}.rows" :key="r.id"><li class="r"><span x-text="r.label + ' '"></span><template x-if="r.id % 2 === 0"><b>even</b></template><template x-for="t in r.tags"><i x-text="t"></i></template></li></template></ul></div>`
            const root = el.firstElementChild
            Alpine.initTree(root)
            return {
                flush: microtasks,   // планировщик Alpine — микротаски
                update: (i, l) => { s.rows[i].label = l },
                updateMany: (step, l) => { for (let i = 0; i < N; i += step) s.rows[i].label = l + i },
                swap: (a, b) => { const t = s.rows[a]; s.rows[a] = s.rows[b]; s.rows[b] = t },
                reverse: () => { s.rows.reverse() },
                push: row => { s.rows.push(row) },
                remove: i => { s.rows.splice(i, 1) },
                replace: r => { s.rows = r },
                destroy: () => { Alpine.destroyTree(root); el.innerHTML = '' },
            }
        },
    })

    adapters.push({
        name: 'Vue 3',
        hint: 'нет доступа к unpkg?',
        available: () => !!window.Vue,
        setup(el) {
            const V = window.Vue
            el.innerHTML = '<ul><li v-for="r in rows" :key="r.id" class="r">{{ r.label }} <b v-if="r.id % 2 === 0">even</b><i v-for="t in r.tags">{{ t }}</i></li></ul>'
            const s = V.reactive({ rows: makeRows() })
            const app = V.createApp({ setup: () => V.toRefs(s) })
            app.mount(el)
            return {
                flush: () => V.nextTick(),
                update: (i, l) => { s.rows[i].label = l },
                updateMany: (step, l) => { for (let i = 0; i < N; i += step) s.rows[i].label = l + i },
                swap: (a, b) => { const t = s.rows[a]; s.rows[a] = s.rows[b]; s.rows[b] = t },
                reverse: () => { s.rows.reverse() },
                push: row => { s.rows.push(row) },
                remove: i => { s.rows.splice(i, 1) },
                replace: r => { s.rows = r },
                destroy: () => { app.unmount(); el.innerHTML = '' },
            }
        },
    })

    // Knockout: observable / observableArray, обновления синхронные, ключей в foreach нет (сравнение массивов по ссылкам).
    // Текст — через виртуальные элементы <!-- ko text: ... -->, чтобы DOM остался без лишних обёрток.
    adapters.push({
        name: 'Knockout',
        hint: 'нет доступа к unpkg?',
        available: () => !!window.ko,
        setup(el) {
            const ko = window.ko
            const toKo = r => ({ id: r.id, label: ko.observable(r.label), tags: r.tags })
            const rows = ko.observableArray(makeRows().map(toKo))
            el.innerHTML = '<ul data-bind="foreach: rows"><li class="r"><!-- ko text: label --><!-- /ko --> <!-- ko if: id % 2 === 0 --><b>even</b><!-- /ko --><!-- ko foreach: tags --><i data-bind="text: $data"></i><!-- /ko --></li></ul>'
            ko.applyBindings({ rows }, el)
            return {
                flush: () => {},
                update: (i, l) => { rows()[i].label(l) },
                updateMany: (step, l) => { const a = rows(); for (let i = 0; i < N; i += step) a[i].label(l + i) },
                swap: (a, b) => { const c = rows().slice(); const t = c[a]; c[a] = c[b]; c[b] = t; rows(c) },
                reverse: () => { rows.reverse() },
                push: row => { rows.push(toKo(row)) },
                remove: i => { rows.splice(i, 1) },
                replace: r => { rows(r.map(toKo)) },
                destroy: () => { ko.cleanNode(el); el.innerHTML = '' },
            }
        },
    })

    // ---------- сценарии ----------
    const SCEN = [
        { id: 'mount', title: 'Монтирование 2000 строк', mount: true },
        { id: 'update1', title: 'Правка 1 строки', op: (c, i) => c.update(1000, 'upd ' + i) },
        { id: 'update10', title: 'Правка каждой 10-й (200 строк)', op: (c, i) => c.updateMany(10, 'u' + i + '-') },
        { id: 'swap', title: 'Обмен двух строк', op: c => c.swap(1, 998) },
        { id: 'reverse', title: 'Reverse 2000 строк', op: c => c.reverse() },
        { id: 'push', title: 'Добавление 1 строки', op: () => 0, opNew: (c, i) => c.push({ id: 1e6 + i, label: 'new', tags: ['a', 'b'] }) },
        { id: 'remove', title: 'Удаление 1 строки', op: c => c.remove(500) },
        { id: 'replace', title: 'Замена всех данных (новые объекты, те же id)', op: (c, i) => c.replace(makeRows(i + 1)) },
    ]

    const snap = el => {
        const li = el.querySelectorAll('li')
        return li.length + '|' + (li[0] ? li[0].textContent : '') + '|' + (li.length ? li[li.length - 1].textContent : '')
    }

    async function timed(fn) {
        const t0 = performance.now()
        await fn()
        const script = performance.now() - t0
        await frame()
        return { script, paint: performance.now() - t0 }
    }

    // Подгружает ES-модульные библиотеки и возвращает список недоступных (для предупреждения в интерфейсе).
    let prepared = null
    function prepare() {
        if (!prepared) prepared = Promise.all(adapters.map(a => a.load ? a.load().catch(e => { a.loadError = String(e && e.message || e) }) : null))
        return prepared.then(() => adapters.filter(a => !a.available()).map(a => `${a.name} (${a.loadError || a.hint})`))
    }

    async function run({ iterations = 15, warmup = 3, host, onProgress }) {
        await prepare()
        const libs = adapters.filter(a => a.available())
        const boxes = libs.map((a) => {
            const d = document.createElement('div')
            d.className = 'box'
            d.dataset.lib = a.name
            host.appendChild(d)
            return d
        })
        const results = {}   // scen -> lib -> { script:[], paint:[] }
        const warnings = []

        for (const sc of SCEN) {
            results[sc.id] = {}
            libs.forEach(a => { results[sc.id][a.name] = { script: [], paint: [] } })
            const ctrls = new Array(libs.length).fill(null)
            const total = warmup + iterations

            for (let it = 0; it < total; it++) {
                if (onProgress) onProgress(sc, it, total)
                // порядок библиотек вращается, чтобы ни одна не мерялась всегда первой/последней
                for (let k = 0; k < libs.length; k++) {
                    const li = (k + it) % libs.length
                    const lib = libs[li], box = boxes[li]
                    let r
                    if (sc.mount) {
                        if (ctrls[li]) { ctrls[li].destroy(); box.innerHTML = '' }
                        r = await timed(() => { ctrls[li] = lib.setup(box); return ctrls[li].flush() })
                    }
                    else {
                        if (!ctrls[li]) { ctrls[li] = lib.setup(box); await ctrls[li].flush(); await frame() }
                        const c = ctrls[li]
                        r = await timed(async () => { (sc.opNew || sc.op)(c, it); await c.flush() })
                    }
                    if (it >= warmup) {
                        results[sc.id][lib.name].script.push(r.script)
                        results[sc.id][lib.name].paint.push(r.paint)
                    }
                }
            }
            // все библиотеки обязаны были прийти к одинаковому DOM
            const snaps = libs.map((a, i) => snap(boxes[i]))
            if (new Set(snaps).size > 1) warnings.push(`${sc.title}: DOM расходится: ` + libs.map((a, i) => `${a.name} = ${snaps[i].slice(0, 60)}`).join(' / '))
            ctrls.forEach((c, i) => { if (c) { c.destroy(); boxes[i].innerHTML = '' } })
        }
        boxes.forEach(b => b.remove())
        return { scenarios: SCEN, libs: libs.map(a => a.name), results, warnings, stat: { median, iterations } }
    }

    window.WexBench = { run, prepare, SCEN, median }
})()