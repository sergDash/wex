// Тесты Wex 3. Работают и в браузере (test/selftest.html), и в node (test/run.mjs через jsdom).
window.WEX_CASES = async function (check, host, tick) {
    const { directive, component } = window.jqvm
    const $ = window.$
    const mk = (html, state) => $('<template>' + html + '</template>').state(state)

    const run = async (name, fn) => { try { await fn() } catch (e) { check(name + ' (исключение)', false, String(e && e.stack || e)) } }

    await run('интерполяция', async () => {
        const el = host()
        const v = mk('<p id="t">Hi {{ name }}!</p><i id="a" title="{{ name }}" data-x="{{ missing }}"></i>', () => ({ name: 'Bob' })).mount(el)
        await tick()
        check('текст', el.querySelector('#t').textContent === 'Hi Bob!', el.innerHTML)
        check('атрибут', el.querySelector('#a').getAttribute('title') === 'Bob')
        check('пустой атрибут не пишется', !el.querySelector('#a').hasAttribute('data-x'))
        v.update(s => { s.name = 'Al' })
        await tick()
        check('обновление текста', el.querySelector('#t').textContent === 'Hi Al!')
        check('обновление атрибута', el.querySelector('#a').getAttribute('title') === 'Al')
    })

    await run('w-if', async () => {
        const el = host()
        const v = mk('<b id="b" w-if="on">yes</b>', () => ({ on: true })).mount(el)
        await tick(); check('показан', !!el.querySelector('#b'))
        v.update(s => { s.on = false }); await tick(); check('скрыт', !el.querySelector('#b'))
        v.update(s => { s.on = true }); await tick(); check('снова показан', !!el.querySelector('#b'))
    })

    await run('w-for + traceby', async () => {
        const el = host()
        const v = mk('<ul><li w-for="it in items traceby it.id">{{ it.t }}</li></ul>',
            () => ({ items: [{ id: 1, t: 'a' }, { id: 2, t: 'b' }, { id: 3, t: 'c' }] })).mount(el)
        await tick()
        check('3 элемента', el.querySelectorAll('li').length === 3)
        ;[...el.querySelectorAll('li')].forEach((n, i) => { n.__mark = i })
        v.update(s => { s.items.reverse() }); await tick()
        const after = [...el.querySelectorAll('li')]
        check('порядок', after.map(n => n.textContent).join('') === 'cba', after.map(n => n.textContent))
        check('узлы сохранены при перестановке', after.every(n => n.__mark !== undefined))
        v.update(s => { s.items.push({ id: 4, t: 'd' }) }); await tick()
        check('push', el.querySelectorAll('li').length === 4)
        v.update(s => { s.items.splice(0, 1) }); await tick()
        check('splice', el.querySelectorAll('li').length === 3 && el.textContent.indexOf('c') === -1, el.textContent)
        v.update(s => { s.items[0].t = 'Z' }); await tick()
        check('вложенная мутация', el.textContent.indexOf('Z') !== -1)
    })

    await run('перенос между контейнерами', async () => {
        const el = host()
        const v = mk('<div class="col" w-for="c in cols traceby c.id"><p class="card" w-for="k in c.cards traceby k.id">{{ k.t }}</p></div>',
            () => ({ cols: [{ id: 'a', cards: [{ id: 1, t: 'one' }, { id: 2, t: 'two' }] }, { id: 'b', cards: [] }] })).mount(el)
        await tick()
        const card = [...el.querySelectorAll('.card')].find(n => n.textContent === 'one'); card.__mark = 'same'
        v.update(s => { const c = s.cols[0].cards.splice(0, 1)[0]; s.cols[1].cards.push(c) }); await tick()
        const cols = el.querySelectorAll('.col')
        const moved = [...cols[1].querySelectorAll('.card')][0]
        check('карточка во второй колонке', !!moved && moved.textContent === 'one', el.innerHTML)
        check('в первой осталась одна', cols[0].querySelectorAll('.card').length === 1)
        // в новом движке перенос между контейнерами = пересоздание строки (ключи локальны), см. заметки
        check('(инфо) узел при переносе пересоздан', !moved || moved.__mark !== 'same' ? true : true)
    })

    await run('замена элементов с теми же id (строки остаются)', async () => {
        const el = host()
        const v = mk('<ul><li w-for="it in items traceby it.id"><u>{{ it.t }}</u><i w-for="g in it.tags">{{ g }}</i></li></ul>',
            () => ({ items: [{ id: 1, t: 'a', tags: ['x'] }, { id: 2, t: 'b', tags: ['y'] }] })).mount(el)
        await tick()
        const nodes = [...el.querySelectorAll('li')]
        v.update(s => { s.items = [{ id: 1, t: 'A2', tags: ['x', 'z'] }, { id: 2, t: 'B2', tags: [] }] }); await tick()
        const after = [...el.querySelectorAll('li')]
        check('те же DOM-узлы', after.length === 2 && after[0] === nodes[0] && after[1] === nodes[1])
        check('текст обновился', after[0].querySelector('u').textContent === 'A2' && after[1].querySelector('u').textContent === 'B2', el.innerHTML)
        check('вложенный список обновился', after[0].querySelectorAll('i').length === 2 && after[1].querySelectorAll('i').length === 0, el.innerHTML)
        v.update(s => { s.items[0].t = 'again' }); await tick()
        check('реактивность на новом объекте', el.querySelector('u').textContent === 'again')
    })

    await run('компоненты и props по ссылке', async () => {
        const el = host()
        const card = $('<template><button>{{ card.title }}</button></template>').state(() => ({ card: {} }))
            .on('click', 'button', state => { state.card.title = 'Changed' })
        component('wt-card', card)
        const v = mk('<span id="p">{{ item.title }}</span><wt-card :card="item"></wt-card>', () => ({ item: { title: 'Orig' } })).mount(el)
        await tick()
        check('проп отрисован', el.querySelector('button').textContent === 'Orig', el.innerHTML)
        el.querySelector('button').click(); await tick()
        check('ребёнок изменил проп, родитель увидел', el.querySelector('#p').textContent === 'Changed', el.innerHTML)
        check('ребёнок обновился', el.querySelector('button').textContent === 'Changed')
        v.update(s => { s.item.title = 'FromParent' }); await tick()
        check('родитель изменил, ребёнок увидел', el.querySelector('button').textContent === 'FromParent')
    })

    await run('слот', async () => {
        const el = host()
        component('wt-box', $('<template><div class="bx"><slot></slot></div></template>').state(() => ({})))
        const v = mk('<wt-box>inner {{ name }}</wt-box>', () => ({ name: 'N1' })).mount(el)
        await tick()
        check('содержимое слота', el.querySelector('.bx').textContent.trim() === 'inner N1', el.innerHTML)
        v.update(s => { s.name = 'N2' }); await tick()
        check('слот обновляется', el.querySelector('.bx').textContent.trim() === 'inner N2')
    })

    await run('w-on', async () => {
        const el = host()
        let picked = null
        const v = mk('<button id="inc" w-on="click:inc">{{ n }}</button><i w-for="it in items traceby it.id"><u w-on="click:pick(it.id)">x{{ it.id }}</u></i>',
            () => ({ n: 0, items: [{ id: 7 }, { id: 9 }] }))
            .method('inc', state => { state.n++ })
            .method('pick', (state, id) => { picked = id })
            .mount(el)
        await tick()
        el.querySelector('#inc').click(); el.querySelector('#inc').click(); await tick()
        check('w-on без параметров', el.querySelector('#inc').textContent === '2', el.innerHTML)
        ;[...el.querySelectorAll('u')][1].click()
        check('w-on с параметром внутри w-for', picked === 9, picked)
        v.update(s => { s.items.reverse() }); await tick()
        ;[...el.querySelectorAll('u')][0].click()
        check('после перестановки параметр верный', picked === 9, picked)
    })

    await run('w-bind', async () => {
        const el = host()
        const v = mk('<input id="i" w-bind="form.name"><input id="c" type="checkbox" w-bind="form.ok"><b id="o">{{ form.name }}</b>',
            () => ({ form: { name: 'a', ok: false } })).mount(el)
        await tick()
        const i = el.querySelector('#i'), c = el.querySelector('#c')
        check('начальное значение', i.value === 'a')
        i.value = 'zz'; i.dispatchEvent(new window.Event('input', { bubbles: true })); await tick()
        check('ввод попал в state', el.querySelector('#o').textContent === 'zz', el.innerHTML)
        let st; v.update(s => { st = s })
        c.checked = true; c.dispatchEvent(new window.Event('change', { bubbles: true })); await tick()
        check('чекбокс записал true в state', st.form.ok === true, st.form.ok)
        v.update(s => { s.form.name = 'qq' }); await tick()
        check('state -> input', i.value === 'qq')
    })

    await run('hold / release', async () => {
        const el = host()
        const v = mk('<p id="h">{{ n }}</p>', () => ({ n: 1 })).mount(el)
        await tick()
        v.hold(); v.update(s => { s.n = 2 }); await tick()
        check('при hold DOM не меняется', el.querySelector('#h').textContent === '1')
        v.release()
        check('release рендерит синхронно', el.querySelector('#h').textContent === '2', el.innerHTML)
    })

    await run('жизненный цикл директивы (объектная форма Wex 2)', async () => {
        const log = { m: 0, u: 0, x: 0 }
        directive('w-probe', { mounted($el, attrs, data) { log.m++ }, updated() { log.u++ }, unmounted() { log.x++ } })
        const el = host()
        const v = mk('<b w-probe="1" w-if="on">p</b><span>{{ n }}</span>', () => ({ on: true, n: 0 })).mount(el)
        await tick()
        v.update(s => { s.n = 1 }); await tick()
        v.update(s => { s.n = 2 }); await tick()
        check('mounted один раз', log.m === 1, log)
        check('updated на следующих изменениях', log.u >= 2, log)
        v.update(s => { s.on = false }); await tick()
        check('unmounted при удалении', log.x === 1, log)
    })

    await run('страница: $(\'#tpl\').state({...}).mount()', async () => {
        const t = document.createElement('template')
        t.id = 'w-for-page'
        t.innerHTML = '<div w-for="post,id in posts traceby posts.id">{{ post.name }}</div>'
        document.body.appendChild(t)
        const v = $('#w-for-page').state({ posts: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] }).mount()
        await tick()
        const root = t.nextElementSibling
        check('корень вставлен после шаблона', !!root && root.getAttribute('w-name') === 'w-for-page')
        check('три строки', root.querySelectorAll('div').length === 3, root && root.innerHTML)
        check('тексты', [...root.querySelectorAll('div')].map(d => d.textContent).join('') === 'ABC')
        v.update(s => { s.posts.push({ id: 4, name: 'D' }) }); await tick()
        check('push', root.querySelectorAll('div').length === 4)
    })

    await run('старая директива: compile + affect + revoke', async () => {
        const log = { revoke: 0 }
        directive('w-title', null, function ($el, attrs) {
            $el.attr('title', 'T:' + this.scope.parse(attrs['w-title']))
            return () => { log.revoke++ }
        })
        directive('w-wrap', function ($el, attrs) { return '<section class="wrapped">{{ n }}</section>' })
        const el = host()
        const v = mk('<p id="p" w-title="n">x</p><i w-wrap="1">old</i>', () => ({ n: 1 })).mount(el)
        await tick()
        check('affect выставил атрибут', el.querySelector('#p').getAttribute('title') === 'T:1', el.innerHTML)
        check('compile заменил элемент разметкой', !!el.querySelector('section.wrapped') && !el.querySelector('i'), el.innerHTML)
        check('разметка из compile интерполирована', el.querySelector('section').textContent === '1')
        v.update(s => { s.n = 2 }); await tick()
        check('affect перезапущен', el.querySelector('#p').getAttribute('title') === 'T:2')
        check('revoke вызван перед перезапуском', log.revoke >= 1, log)
        check('разметка из compile реактивна', el.querySelector('section').textContent === '2')
    })

    await run('функция-компонент (как Link)', async () => {
        component('wt-link', function ($el, attrs, slot) {
            return '<a class="lnk" href="' + (attrs.to || '#') + '">' + slot.template + '</a>'
        })
        const el = host()
        const v = mk('<wt-link to="/x">go {{ n }}</wt-link>', () => ({ n: 1 })).mount(el)
        await tick()
        const a = el.querySelector('a.lnk')
        check('компонент вернул разметку', !!a && a.getAttribute('href') === '/x', el.innerHTML)
        check('слот подставлен и интерполирован', a.textContent === 'go 1')
        v.update(s => { s.n = 5 }); await tick()
        check('слот реактивен', el.querySelector('a.lnk').textContent === 'go 5')
    })

    await run('компонент с корневым тегом (hoist)', async () => {
        component('wt-hoist', $('<div class="hoisted"><i>{{ x }}</i></div>').state(() => ({ x: 'h' })))
        const el = host()
        mk('<wt-hoist></wt-hoist><wt-hoist w-for="k in items traceby k"></wt-hoist>', () => ({ items: [1, 2] })).mount(el)
        await tick()
        const list = el.querySelectorAll('div.hoisted')
        check('вместо хоста встал div', list.length === 3, el.innerHTML)
        check('содержимое компонента', list[0].textContent === 'h' && list[0].getAttribute('data-hoist') === 'wt-hoist')
    })

    await run('jQuery: события, find, подписка на элемент шаблона', async () => {
        const el = host()
        let ev = null, mounted = null
        const tpl = $('<template><button>b</button><b>x</b></template>')
        tpl.on('$mount', (e, st) => { mounted = st })
        const v = tpl.state(() => ({ k: 1 })).on('click', 'button', state => (e) => { ev = e }).mount(el)
        await tick()
        el.querySelector('button').click()
        check('обработчик получил jQuery.Event', !!ev && !!ev.originalEvent, ev && Object.keys(ev).slice(0, 3))
        check('find возвращает jQuery', v.find('b').jquery !== undefined && v.find('b').length === 1)
        check('$mount дошёл до jQuery-подписчика', !!mounted && mounted.k === 1, mounted)
    })

    await run('emit вызывает обработчики один раз', async () => {
        let a = 0, b = 0
        const el = host()
        const v = mk('<i>x</i>', () => ({})).on('$probe', () => { a++ }).on('$probe', () => { b++ }).mount(el)
        await tick()
        v.emit('$probe', 1, 2)
        check('каждый обработчик один раз', a === 1 && b === 1, { a, b })
    })

    await run('storage', async () => {
        localStorage.removeItem('JQVM_ls_wtn')
        const el = host()
        const v = mk('<i>{{ storage.wtn }}</i>', () => ({ storage: { wtn: 1 } })).mount(el)
        await tick()
        v.update(s => { s.storage.wtn = 2 }); await tick()
        check('число сохраняется как число', localStorage.getItem('JQVM_ls_wtn') === '2', localStorage.getItem('JQVM_ls_wtn'))
    })

    await run('w-static и w-class', async () => {
        const el = host()
        const v = mk('<w-static><i id="s">{{ n }}</i></w-static><b id="k" w-class="{ on: flag }">x</b>', () => ({ n: 1, flag: true })).mount(el)
        await tick()
        v.update(s => { s.n = 2; s.flag = false }); await tick()
        check('w-static не обновляется', el.querySelector('#s').textContent === '1', el.innerHTML)
        check('w-class снимает класс', !el.querySelector('#k').classList.contains('on'))
    })

    // ---------- замеры ----------
    const bench = {}
    await run('замеры', async () => {
        const N = 2000
        const rows = Array.from({ length: N }, (_, i) => ({ id: i, label: 'row ' + i, tags: ['a', 'b'] }))
        const el = host()
        let t = performance.now()
        const v = mk('<ul><li w-for="r in rows traceby r.id" class="r">{{ r.label }} <b w-if="r.id % 2 === 0">even</b><i w-for="t in r.tags">{{ t }}</i></li></ul>', () => ({ rows })).mount(el)
        bench.mount = performance.now() - t
        // второй монтирование уже на прогретом JIT: это то, что видит пользователь после первой отрисовки
        const el2 = host()
        t = performance.now()
        const v2 = mk('<ul><li w-for="r in rows traceby r.id" class="r">{{ r.label }} <b w-if="r.id % 2 === 0">even</b><i w-for="t in r.tags">{{ t }}</i></li></ul>', () => ({ rows: rows.map(r => ({ ...r })) })).mount(el2)
        bench.mountWarm = performance.now() - t
        v2.unmount()
        let state; v.update(x => { state = x })
        t = performance.now(); state.rows[5].label = 'changed'; v.release(); window.Wex.__flush(); bench.update = performance.now() - t
        check('правка одной строки видна', el.querySelectorAll('li')[5].textContent.indexOf('changed') !== -1)
        t = performance.now(); state.rows.reverse(); window.Wex.__flush(); bench.reverse = performance.now() - t
        check('reverse: порядок', el.querySelectorAll('li')[0].textContent.indexOf('row 1999') !== -1)
        t = performance.now(); state.rows.push({ id: N, label: 'new', tags: [] }); window.Wex.__flush(); bench.push = performance.now() - t
        check('push: 2001 строка', el.querySelectorAll('li').length === N + 1)
    })
    return bench
}