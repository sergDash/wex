// Честное сравнение Wex 3 / petite-vue / Preact на одном и том же списке.
// Строка: <li class="r">{{label}} <b>even</b>(если id чётный) <i>a</i><i>b</i></li>  -> одинаковый DOM у всех.
(function () {
    const N = 2000
    const makeRows = (offset = 0) => Array.from({ length: N }, (_, i) => ({ id: i, label: 'row ' + (i + offset), tags: ['a', 'b'] }))
    const median = a => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] }
    const frame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)))

    // ---------- адаптеры ----------
    const adapters = []

    adapters.push({
        name: 'Wex 3',
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

    async function run({ iterations = 15, warmup = 3, host, onProgress }) {
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

    window.WexBench = { run, SCEN, median }
})()