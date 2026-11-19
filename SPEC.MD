# Wex 3 — спецификация движка

> Версия `3.1.1`. Шаблонный реактивный движок без шага сборки: DOM-шаблоны, Proxy-реактивность с точечными эффектами (как Vue 3 / Solid), совместимость с API Wex 2 (`jqvm`, `$('#tpl').state(...)`, старые директивы и компоненты).

Документ написан по исходникам `index`, `wex.js`, `reactive.js`, `directives.js`, `dollar.js`, `createAsyncComponent`, `shareState`. Что не попало в выборку, перечислено в разделе 13.

---

## Оглавление

1. [Архитектура в одном экране](#1-архитектура-в-одном-экране)
2. [Быстрый старт](#2-быстрый-старт)
3. [Глобальный API](#3-глобальный-api)
4. [Язык шаблонов](#4-язык-шаблонов)
5. [View: состояние, методы, жизненный цикл](#5-view-состояние-методы-жизненный-цикл)
6. [Реактивность под капотом](#6-реактивность-под-капотом)
7. [Компоненты](#7-компоненты)
8. [Плагины, фильтры, директивы](#8-плагины-фильтры-директивы)
9. [Общее состояние: shareState](#9-общее-состояние-sharestate)
10. [Wex.$ — встроенный мини-jQuery](#10-wex--встроенный-мини-jquery)
11. [Рецепты](#11-рецепты)
12. [Диагностика, конфиг, профилирование](#12-диагностика-конфиг-профилирование)
13. [Особенности, ограничения, что не описано](#13-особенности-ограничения-что-не-описано)

---

## 1. Архитектура в одном экране

```
 HTML-шаблон ──getPlan()──▶ План (ops: text / attr / if / for / slot / comp / w-* / dir)
      │                       разбирается ОДИН раз, кэшируется по (реестр компонентов+директив, html)
      ▼
 instantiate(plan) ─ cloneNode ─ resolver(path→узлы) ─ applyOp(op, node)
      │                                   │
      │                          каждая привязка = Effect внутри Block
      ▼
 DOM  ◀──────────── effect.run() ◀──── flush (microtask) ◀──── trigger(target,key)
                         │                                          ▲
                   читает state через Proxy                  state.x = … (set-trap)
                   get-trap: track(target,key)
```

Три кита:

| Слой | Файл | Роль |
|---|---|---|
| Реактивность | `reactive.js` | `reactive()` (Proxy), `Effect`, `track/trigger`, планировщик `flush`, подписка на поддерево `subscribe` |
| Ядро | `wex.js` | планы шаблонов, `Block` (владелец эффектов), `w-if/w-for/slot/comp/text/attr`, `createView`, реестры компонентов/директив/фильтров |
| Расширения | `directives.js` | `w-class/w-bind/w-on/...`, старые `directive()`/`component()` (Wex 2) через таблицу `OPS` |

Принцип: **ядро знает только `text / attr / if / for / slot / comp`**. Всё остальное подключается через `OPS[имя] = (op, node, view, data, block)` — это и есть точка расширения для встроенных `w-*`.

Жизненная единица — **Block**: дерево владельцев. Каждая привязка (эффект) принадлежит блоку; удаляется строка `w-for` / ветка `w-if` / компонент — `block.dispose()` останавливает все эффекты поддерева и запускает очистки. Утечек эффектов нет по построению.

---

## 2. Быстрый старт

```html
<template id="todo">
  <h1>{{ title }}</h1>

  <input w-bind="draft" placeholder="Новая задача">
  <button w-on="click:add">Добавить</button>

  <ul>
    <li w-for="t in todos traceby t.id" w-class="{ done: t.done }">
      <input type="checkbox" w-bind="t.done">
      {{ t.text }}
      <button w-on="click:remove(t.id)">×</button>
    </li>
  </ul>
  <p w-if="todos.length === 0">Пока пусто</p>
</template>

<script type="module">
  import Wex from './wex/index.js'
  const $ = Wex.$

  const app = $('#todo').state(() => ({ title: 'Дела', draft: '', todos: [] }))

  app.fn('add', (state) => {
    if (!state.draft.trim()) return
    state.todos.push({ id: Date.now(), text: state.draft, done: false })
    state.draft = ''
  })
  app.fn('remove', (state, id) => {
    state.todos = state.todos.filter(t => t.id !== id)
  })

  app.mount()          // без аргумента: корневой <div> создаётся сразу после <template>
</script>
```

Без `$`:

```js
import { view } from './wex/index.js'
const v = view('<p>{{ n }}</p>', () => ({ n: 1 }))
v.mount('#root')
v.state.n++            // DOM обновится в микрозадаче
```

---

## 3. Глобальный API

Экспорты `index`: `View, config, report, component, directive, filter, preloadComponent, view, reactive, toRaw, isReactive, untrack, WEX_VERSION, createWire, $wire, noopAjax, useJQuery, $`, плюс `default` — объект `Wex` (он же `window.Wex` и `window.jqvm`).

| API | Назначение |
|---|---|
| `view(source, initState, opts?)` | Создать View. `source`: HTML-строка (есть `<` или `{{`), CSS-селектор `<template>`, или DOM-элемент. `opts.attrs` — выражение-объект для корня (см. 5.2) |
| `$('#tpl').state(init)` / `.vm(init)` | То же, что `view('#tpl', init)`; ставится на `$.fn` при `install` |
| `component(name, src, extra?)` | Глобальный компонент: `View` / `'url'` / `compile($el, attrs, slot)` (старый стиль) |
| `directive(name, compile, affect?, priority?)` или `directive(name, { compile?, mounted, updated, unmounted })` | Глобальная директива-атрибут. `priority` принимается, но **не используется** |
| `filter(name, fn)` | Глобальный фильтр выражений |
| `preloadComponent(url)` | Начать загрузку удалённого компонента заранее |
| `reactive(obj)` / `toRaw(p)` / `isReactive(p)` | Proxy-обёртка / исходный объект / проверка |
| `untrack(fn)` | Выполнить `fn`, не подписываясь на прочитанное |
| `config` | `{ autoForce, debug, maxDepth }` — см. 12 |
| `report(title, ctx)` | Диагностика в консоль (для своих плагинов) |
| `useJQuery(jQuery)` | Подключить настоящий jQuery вместо `Wex.$` |
| `Wex.__flush()` | Синхронно прогнать очередь эффектов (тесты, отладка) |
| `Wex.$` | Мини-jQuery (раздел 10) или настоящий jQuery, если он был на странице |
| `$wire`, `createWire`, `noopAjax` | Модуль `./wire` — в этой выборке не описан |

Автонастройка при загрузке в браузере:
- на `window` кладутся `Wex`, `jqvm`, `$wire`;
- если уже есть **настоящий** jQuery (`jQuery.fn.jquery !== 'wex-$'`) — подхватывается им (`Wex.$ = jQuery`);
- иначе ставится мини-`$` и, если `window.$` свободен, становится глобальным `$`.

---

## 4. Язык шаблонов

Шаблон — обычный HTML внутри `<template>` (или строка). Разбор идёт через `<template>.innerHTML`, поэтому действуют правила HTML-парсера: имена атрибутов приходят в нижнем регистре, `<tr>`/`<option>` внутри `<template>` допустимы.

### 4.1 Интерполяция `{{ expr }}`

| Место | Поведение |
|---|---|
| Текстовый узел | Значения склеиваются через `String(v)`. `null`/`undefined` → строки `"null"`/`"undefined"` (в debug — предупреждение) |
| Атрибут, значение целиком `{{ expr }}` | `null`/`undefined` → **атрибут удаляется**; иначе `setAttribute(String(v))` |
| Атрибут, смешанный `class="a {{ b }}"` | Склейка, каждое значение через `String()` |
| Атрибуты, начинающиеся с `:` и `@` | Не интерполируются (это пропы/события компонентов) |
| `src`/`href`/`srcset` с `{{ }}` | В debug — ошибка: браузер успеет запросить сырую строку. Используйте `w-src` |

Выражения компилирует **ScopeX** (`vendor/ScopeX`): `compile(expr)(scope)`, у результата может быть `.assign(scope, value)`; фильтры живут в `scope.filters`. Простые пути (`a`, `a.b.c`) читаются напрямую, мимо компилятора. Синтаксис фильтров и операторов — по документации ScopeX.

Ошибка в выражении не роняет рендер: выводится ошибка в консоль (один раз на выражение), значение — `undefined`.

### 4.2 Встроенные директивы

| Атрибут | Значение | Эффект |
|---|---|---|
| `w-if="expr"` | выражение | Ветка создаётся/уничтожается целиком. На месте — комментарий `<!-- w-if -->` |
| `w-for="..."` | см. 4.3 | Список с keyed-диффом |
| `w-key="expr"` | выражение | Ключ строки (альтернатива `traceby`) |
| `w-class="{ cls: cond }"` | выражение → объект | Добавляет/снимает классы; ключ может содержать несколько классов через пробел. Статический `class` не трогает |
| `w-value="expr"` | выражение | Односторонне: `el.value` |
| `w-bind="path"` | **присваиваемый путь** | Двусторонне (см. ниже) |
| `w-disabled`, `w-checked`, `w-selected` | выражение | Булево свойство элемента |
| `w-id="expr"` | выражение | `null` → убрать `id`; `undefined` → не трогать; иначе выставить |
| `w-src="expr"` | выражение | `setAttribute('src')`; `null/undefined` → не выставляется + предупреждение |
| `w-html="expr"` или `w-html="{{ expr }}"` | выражение | `innerHTML = sanitizeSvg(String(v))` (см. 13: проверьте, что делает `sanitizeSvg`) |
| `w-on="event:method(args)"` | см. 4.5 | Делегированное событие |
| `w-transition="css-transition"` | строка, по умолчанию `opacity 0.25s ease` | Плавное появление; при удалении элемента — плавное исчезновение (перехватывает `el.remove`) |
| `<slot>` | — | Слот компонента (4.6) |
| `<w-static>` | — | Содержимое рендерится один раз, без подписок |

**`w-bind`**: чтение — `checkbox → checked = !!v`, `radio → checked = (v === el.value)`, остальное → `value`. Запись — на `change` для `checkbox/radio/color/date/datetime-local/week/file/select`, на `input` для остального; `checkbox` пишет `boolean`, `radio`/текст — `value`. Нужен присваиваемый путь (`draft`, `user.name`, `t.done`); иначе запись молча не произойдёт.

### 4.3 `w-for`

```
w-for="item in list"
w-for="item, index in list"
w-for="item in list traceby item.id"      <!-- ключ -->
w-for="item in list" w-key="item.id"      <!-- то же атрибутом -->
```

- **Источник**: массив **или объект** (для объекта `index` — имя ключа, `item` — значение).
- **Ключ**: без `traceby` ключ = индекс. С ключом строка переиспользуется при перестановках; дубли ключей получают суффикс `#1`, `#2`…; на корневой элемент строки пишется `data-id="<ключ>"`. Ключ вычисляется **внутри эффекта**: смена ключа перестраивает список.
- **Scope строки**: `{ __proto__: данныеРодителя, [item]: элемент }`. Чтение имён родителя работает через прототип, **запись** в имя, которого у строки нет, уходит в state родителя; запись в `item` меняет только строку. `index` реактивен (при перестановках обновляется).
- **Дифф**: тот же ключ + новый объект → строка остаётся, перепривязывается; тот же ключ + изменившийся примитив → строка пересоздаётся; перестановки — через LIS (минимум `insertBefore`).
- Первый рендер: список > 16 строк вставляется одним `DocumentFragment`.
- `w-for` + `w-if` на одном элементе: `w-for` обрабатывается первым, `w-if` вычисляется **на каждую строку**.

### 4.4 Порядок обработки элемента

1. `w-for` → 2. `w-if` → 3. `<slot>` → 4. `<w-static>` / компонент → 5. иначе: атрибуты (`w-*`, директивы, `{{ }}`) и потомки.

Следствие: `w-if` на теге компонента/слота оборачивает его; `w-for` на теге компонента даёт компонент на строку.

### 4.5 События: `w-on`

```html
<button w-on="click:save">          <!-- fn(state) -->
<button w-on="click:remove(t.id)">  <!-- fn(state, <значение t.id>) -->
```

Метод регистрируется на view: `view.fn('save', function (state, ...params) { ... })`, `this` = view.

Возвращаемое значение:
- функция → будет вызвана как `fn.call(element, event)` (карринг: `(state) => (e) => { ... }`);
- `false` из этой функции → `preventDefault + stopPropagation`.

Механика: **один слушатель на событие на корне view**; обработчик ищется поднятием от `e.target` по expando `el.__wOn[event]`. У элемента — один обработчик на событие. Для `focus/blur/mouseenter/mouseleave/pointerenter/pointerleave/scroll/load/error/toggle` слушатель в capture-фазе и срабатывает только на самом целевом элементе. Обработчики вложенных компонентов принадлежат их view и не вызываются от родителя.

Событие: с `Wex.$` — `WEvent` (jQuery-подобный: `which`, `isDefaultPrevented()`, `originalEvent`…), с jQuery — `jQuery.Event`, иначе нативное.

### 4.6 Слоты

```html
<!-- внутри шаблона компонента -->
<div class="card">
  <slot :user="current">Запасное содержимое</slot>
</div>

<!-- у потребителя -->
<user-card>Привет, {{ user.name }}!</user-card>
```

- Содержимое слота выполняется **в scope родителя** (его state, его блок), поэтому живёт, пока жив родитель-хозяин.
- `:prop="expr"` на `<slot>` пробрасывает значения в scope слота (scoped slot), вычисляются в scope компонента, читаются «вживую».
- Слот один (default). Именованных слотов нет.
- Нет содержимого → рендерится fallback из тела `<slot>`.

---

## 5. View: состояние, методы, жизненный цикл

### 5.1 Создание и mount

```js
const v = view(source, initState)
v.mount()               // div после <template>
v.mount('#el')          // селектор | элемент | jQuery/Wex.$
```

- `initState` — объект или функция (`this` = view); обязан вернуть объект. Для компонентов-прототипов: функция вызывается на каждый экземпляр, **объект глубоко клонируется** на каждый экземпляр (`cloneState`).
- Корню view ставится `w-name="<id>"`, где `id` = `tpl.id` | `w-id` | `v<N>`.
- Повторный `mount()` без аргумента, если рядом уже стоит корень этого view, — no-op. `mount(другойЭл)` сначала делает `unmount()`.
- `unmount()` + `mount()`: **state сохраняется** (`init()` повторно не вызывается), DOM строится заново. `destroy()` обнуляет state.

### 5.2 `attrs` на корне

`<template id="x" attrs="{ class: cls, style: { color: c } }">` или `view(src, init, { attrs })` — выражение, вычисляемое реактивно и применяемое к корневому элементу: `class` (добавляет), `style` (объект → `Object.assign(style)`, строка → атрибут), остальное — `setAttribute`.

### 5.3 Методы View

| Метод | Описание |
|---|---|
| `mount(el?)`, `unmount()`, `destroy()` | Жизненный цикл |
| `state` (getter) | Реактивный Proxy-state (до `mount` — `null`) |
| `root` (getter) | Корневой DOM-элемент |
| `fn(name, action)` / `method(...)` | Зарегистрировать метод для `w-on` и `@event`; `fn(name)` — получить |
| `on(event, [selector], fn)` / `once` / `off` | Подписки (см. ниже) |
| `emit(event, ...args)` | `$`-события — локальным подписчикам; обычные — родителю (7.3) |
| `update(arg)` | `true` — перерисовать всё view; `fn(state)` — вызвать (объект из `fn` → `Object.assign(state, …)`); объект → `Object.assign(state, obj)` |
| `hold()` / `release()` | Приостановить/возобновить обновление DOM (счётчик, вложенность допустима) |
| `clone()` | Копия: fns, подписки, компоненты, директивы, фильтры; state — копия |
| `find(sel)` | Поиск внутри корня (`$`-коллекция или массив) |
| `component(name, src, extra?)` | Локальный компонент (виден этому view и потомкам) |
| `directive(name, compile, affect?)` | Локальная директива |
| `filter(name, fn)` | Локальный фильтр |
| `plugin(fn)` | Плагин (8.1) |

**`on`/`once`/`off`**:

```js
view.on('$mount', function (state) { ... })              // lifecycle/локальное событие (имя начинается с $)
view.on('click', '.btn', (state) => (e) => { ... })      // DOM-событие на корне, с делегированием по селектору
view.on('click', (state) => { ... })                     // без селектора — на сам корень
view.off('click', '.btn', handler)                       // нужна та же ссылка на fn
```

Для DOM-событий `fn` вызывается на каждое событие как `fn.call(view, state)`; если вернул функцию — она получает событие (`this` = сработавший элемент); `false` отменяет действие по умолчанию и всплытие.

### 5.4 События жизненного цикла

| Событие | Аргументы обработчика | Когда |
|---|---|---|
| `$init` | `(state)` | State создан, пропы родителя уже применены, DOM ещё нет |
| `$render` | `(state)` | DOM построен и вставлен в корень, `isMounted` ещё false |
| `$mount` | `(state)` | После mount |
| `$unmount` | `(state)` | Перед снятием |
| `$beforeDestroy`, `$destroy` | `(state)` | Уничтожение |
| `$change` | `(state, info, prevent)` | Мутации state; **склеивается в одну на микрозадачу**; `info = { target, key, type: 'set'|'add'|'delete' }` последней мутации. `prevent()` отменяет и перерисовку, и reload локального хранилища |
| `$update` | `(state, prevent)` | Перед перерисовкой view; `prevent()` отменяет этот прогон (эффекты уходят в `skipped` до `release()`/`update(true)`) |
| `$clone` | `(state, newView)` | На прототипе при `clone()` |

Те же события можно слушать через `$('#tpl').on('$mount', (e, state) => …)` — подписка на элемент `<template>` (работает через реестр `$._data(el,'events')`).

---

## 6. Реактивность под капотом

### 6.1 Модель

1. `state = reactive(obj)`: **Proxy поверх исходного объекта**, один Proxy на объект (`WeakMap raw → proxy`). В самом объекте всегда лежат «сырые» значения: при записи значение разворачивается через `toRaw`.
2. Эффект (`Effect`) — функция, исполняемая с выставленным `activeEffect`. Каждое чтение через Proxy вызывает `track(target, key)` и записывает пару `(Map ключ→подписчики, key)` в `effect.deps`.
3. Запись через Proxy вызывает `trigger(target, key, type)`: подписчики ключа ставятся в очередь.
4. Очередь сбрасывается **в микрозадаче** (`Promise.resolve().then(flush)`): эффекты сортируются по `id` (порядок создания = родители раньше детей) и перезапускаются.
5. Перед каждым запуском `effect.run()` вызывается `cleanup` — зависимости собираются заново. Ветвление в выражении (`a ? b : c`) автоматически меняет подписки.

Вся DOM-работа — внутри эффектов. Прочитал `{{ user.name }}` → подписан на пару `(user, 'name')` и больше ни на что.

### 6.2 Что реактивно

| Реактивно | Нет |
|---|---|
| Plain-объекты и массивы (`{}`/`[]`/`Object.create(null)`), **вложенные — лениво, глубоко** | Экземпляры классов, `Date`, `Map`, `Set`, DOM-узлы, функции, `Chart.js`-объекты — отдаются как есть |
| Новые ключи (`add`) и `delete` | `Object.freeze`-нутые объекты (возвращаются сырыми) |
| Индексы и `length` массивов, `push/splice/sort/reverse…` | Свойства `configurable:false, writable:false` |
| `in`, `Object.keys` (`has`/`ownKeys` отслеживаются) | **Геттеры внутри state**: `Reflect.get` вызывается без `receiver`, `this` в геттере — сырой объект, чтения внутри него не отслеживаются |

Если нужно производное значение — считайте его в выражении шаблона или кладите в поле и обновляйте в обработчике.

Изменения «мимо Proxy» (мутация экземпляра класса, внешняя библиотека) движок не видит. Выходы: `view.update(true)` (перерисовать всё) или `config.autoForce = true` (тогда `view.update(fn)`, в котором не было ни одной мутации через Proxy, сам вызовет перерисовку).

### 6.3 Тонкости записи

- Запись **того же значения** не триггерит (`prev !== next` проверяется по сырым значениям).
- Эффект, который сам пишет в то, что читает, **не будит сам себя** (`trigger` пропускает `activeEffect`).
- Массивы: любая мутация будит и «слушателей длины», и слушателей `ITERATE` (специальный ключ «массив целиком»). Присвоение `length` будит индексы `>= newLen`.
- Каскады: эффект может записать в state → новые эффекты попадают в следующий проход цикла `flush` (лимит 100 проходов, затем `Wex: бесконечный цикл обновлений`).
- Обновление асинхронно: после `state.x = 1` DOM изменится в микрозадаче. `await Promise.resolve()` или `Wex.__flush()`.

### 6.4 Планировщик и «ворота» view

```
flush():
  while (queue):
     list = sorted(queue by id); flushId++
     for e in list:
        if (!e.active) continue
        if (e.view && !e.view.__gate(flushId)) { e.view.skipped.add(e); continue }
        e.run()
  afterFlush()      // runPost: affect/mounted старых директив
```

`__gate(flushId)` считается **один раз на view за проход**:
1. `held > 0` (между `hold()` и `release()`) → закрыто;
2. иначе `flushChange()` → эмитится `$change`; `prevent()` → закрыто;
3. иначе `$update` (если есть подписчики); `prevent()` → закрыто.

Закрытые эффекты складываются в `view.skipped` и выполняются при `release()`, `update(true)` или следующем успешном `forceUpdate`.

Применение: пакетные обновления без промежуточных перерисовок.

```js
view.hold()
state.a = 1; state.b = 2; state.list.push(x)
view.release()          // flush + запуск отложенных эффектов
```

### 6.5 Block: владелец эффектов

```
Block { view, parent, effects[], cleanups[], children:Set<Block>, disposed, static }
```

- `instantiate()` создаёт Block на каждый экземпляр плана; w-for-строка, w-if-ветка, компонент, слот — свои блоки.
- `block.link()` регистрирует блок у родителя **лениво**, только когда в нём появился эффект/очистка (статические строки без реактивности не стоят ничего).
- `block.dispose()`: стоп эффектов → рекурсивно дети → `cleanups` → отцепление от родителя.
- `block.onDispose(fn)` — публичный способ повесить очистку (используют компоненты и `w-transition`).
- `static: true` (наследуется вниз; используется `<w-static>`): `effect()` выполняет функцию один раз под `untrack`, подписок нет.

### 6.6 Оптимизации (знать, чтобы не удивляться)

- **Листовые привязки** (`{{ }}` в тексте/атрибуте) сначала идут под общим пробным эффектом; если ничего реактивного не прочитано — `Effect` не создаётся вовсе. Остальные эффекты, у которых после первого запуска пустые `deps`, деактивируются: «константа».
  Следствие: выражение, читающее только не-реактивные данные (`window.x`, поле экземпляра класса), **никогда не обновится**.
- `deps` — плоский массив `[Map, key, Map, key, …]`; подписчик в `Map` хранится самим эффектом, пока он единственный, и превращается в `Set` при втором.
- Для `w-for` массив читается одним отслеживанием (`readList` → `ITERATE`) вместо `length` + всех индексов.
- План шаблона разбирается один раз; на экземпляр — `cloneNode` + сгенерированная функция-резолвер (`new Function`), которая ходит по `firstChild/nextSibling`. Шаблон из единственного корневого элемента без структурной директивы клонируется без фрагмента.
- Ключ кэша планов — **сигнатура реестра** (имена компонентов + директив) + html. Регистрация нового компонента/директивы меняет сигнатуру → новые планы.

### 6.7 Подписка на поддерево (`$change`, `storage`, `shareState.onChange`)

`subscribe(root, fn)` вешает слушателя на объект; изменения любого потомка «всплывают» вверх по связям `child → parents` (`WeakMap<raw, Set<raw>>`).

- Связи строятся **лениво**, при обращении через `get`/`set`/`readList`, и **только пока есть хотя бы одна подписка** (`subCount > 0`). Это глобальный переключатель: появилась первая подписка — все чтения Proxy начинают дополнительно линковать детей.
- Подписка из `shareState({ onChange })` не снимается (`unsubscribe` не возвращается) — после неё режим линковки остаётся включённым навсегда.

---

## 7. Компоненты

### 7.1 Регистрация

```js
// 1. Готовый View (inline)
const card = view('<div class="card"><h3>{{ title }}</h3><slot></slot></div>', () => ({ title: '' }))
Wex.component('user-card', card)              // глобально
parent.component('user-card', card)           // локально: parent и его потомки

// 2. Файл (remote), см. 7.5
Wex.component('x-chart', '/c/x-chart.html', { lazy: true })

// 3. Старый стиль: compile($el, attrs, slot) [, affect]  (7.6)
```

Имена приводятся к нижнему регистру. **Порядок поиска**: собственные → родительская цепочка (изнутри наружу) → глобальные. Поиск ленивый, поэтому компонент может использовать **сам себя** (рекурсивные деревья; нужен `w-if` для выхода, глубина ограничена `config.maxDepth = 50`, иначе элемент получит `data-wex-error="max-depth"`).

Использование в шаблоне: любой тег с зарегистрированным именем.

```html
<user-card :title="u.name" @close="removeUser(u.id)" kind="primary">Содержимое слота</user-card>
```

### 7.2 Проп-механика

| Синтаксис | Что значит |
|---|---|
| `:user-name="expr"` | Реактивный проп. Имя → camelCase (`userName`). Значение вычисляется в scope родителя, эффект привязан к блоку родителя |
| `kind="primary"` | Статический проп: в компонент уходит **строка** `"primary"` (не выражение, не реактивно) |
| `@event="handler(args)"` | Подписка на событие (7.3) |
| `_что-то="…"` | Игнорируется как проп |

**Важное правило:** пропы записываются **только в ключи, уже существующие в `state` компонента** (сопоставление без учёта регистра). Нет ключа в `initState` — проп молча отбрасывается. Исключение — удалённый компонент без `<script>`: у него «открытый» state, и пропы сами создают ключи.

Объекты передаются **по ссылке на сырой объект**, Proxy в обоих view — общий. Мутация объекта-пропа в дочернем компоненте видна родителю и наоборот. Если нужна изоляция — копируйте при передаче.

Запись пропа пропускается, если значение не изменилось (по `===` или, для не-реактивных, по глубокому `isEqual`).

### 7.3 События компонента → родителю

Дочерний:
```js
child.fn('close', function (state) { this.emit('close', state.title, 42) })
```

Родительский шаблон: `@close="onClose(item.id)"`.

Родительский обработчик — **карринг**: первые аргументы (`state`, параметры из шаблона), результат — функция, которая получит аргументы `emit`:

```js
parent.fn('onClose', (state, id) => (title, n) => {
  state.list = state.list.filter(x => x.id !== id)
})
```

Если обработчик вернул не функцию, аргументы `emit` теряются. Имя события сопоставляется без учёта регистра; `@my-event` ↔ `emit('myEvent')`. События с префиксом `$` — локальные (`view.on('$x')`), родителю не уходят.

### 7.4 Корень компонента

- Прототип создан из строки или `<template>` (тег `template`): хост-элемент (`<user-card>`) **остаётся**, шаблон рендерится внутрь него.
- Прототип создан из не-`template` элемента (например `view(document.querySelector('section#x'), init)`): хост заменяется элементом с тем же тегом; атрибуты = атрибуты хоста + атрибуты шаблона + `data-hoist="<имя>"`; вокруг ставятся комментарии `<!-- name begin -->` / `<!-- name end -->`.

Каждый экземпляр — `proto.clone()`: собственный state, но те же `fn`, обработчики, локальные компоненты/директивы/фильтры. Экземпляр уничтожается вместе с блоком, в котором он создан (`block.onDispose(() => comp.destroy())`).

### 7.5 Удалённые компоненты

```html
<!-- /c/click-counter.html -->
<template>
  <button w-on="click:inc">{{ label }}: {{ count }}</button>
</template>

<script type="module">
  export default (T) => {
    const v = T.state(() => ({ label: '', count: 0 }))   // T.state(init) → View
    v.fn('inc', (s) => { s.count++ })
    return v
  }
</script>
```

```js
Wex.component('click-counter', '/c/click-counter.html')               // грузится сразу
Wex.component('x-chart', '/c/x-chart.html', { lazy: true })           // при первом использовании
Wex.preloadComponent('/c/x-chart.html')                               // прогрев
```
```html
<click-counter label="Клики"></click-counter>
```

Правила загрузки:
- `fetch(url)` с тремя попытками и экспоненциальной паузой (300 · 2ⁱ мс);
- берётся первый `<template>` и, если есть, `<script type="module">`; его `export default` — функция `(T) => View`, `T = { state(init), vm() }`;
- без `<script>`: `T.vm()` — view с пустым открытым state (пропы создают ключи);
- модуль исполняется через **blob-URL динамический `import`** — у blob нет базового адреса, поэтому `import` внутри скрипта должен быть абсолютным (URL или import-map), относительные пути не разрешатся;
- кэш по URL глобальный; пока компонент грузится, хост остаётся пустым, после загрузки монтируется (подписчики снимаются при dispose блока).

### 7.6 Старый стиль (совместимость с Wex 2)

```js
Wex.component('my-old', function ($el, attrs, slot) {
  // this = { scope, view, compile(tpl, scope?), interpolate($el, scope?) }
  // вернуть: View → смонтируется как компонент; строку/узлы/jQuery → заменят хост; ничего → хост остаётся
  return '<div>{{ attrs.title }}</div>'
}, function ($el, attrs) {
  // affect: после вставки в DOM и при КАЖДОМ изменении state view; может вернуть revoke()
})
```

`slot` — функция `slot(locals)` → массив узлов; `slot.template` (HTML-строка), `slot.nodes` (узлы).

### 7.7 `createAsyncComponent(defer, callback?)`

Обёртка для ленивой загрузки компонента через `import()`.

```js
const lazy = createAsyncComponent(() => import('./heavy.js'), (comp, ...args) => comp)
// вызывается в контексте с this.view (compile/affect старых директив и компонентов)
const comp = lazy.call(ctx)      // null, пока модуль не загружен; потом — default-экспорт
```

Первый вызов запускает `defer()`; результат нормализуется (ES-модуль → `default`, `__esModule` → `default`, иначе как есть); после загрузки вызывается `view.update(true)`.

---

## 8. Плагины, фильтры, директивы

### 8.1 Плагины view

`view.plugin(fn)`: `fn` вызывается как `fn.call({ view, get state() })`; вернуть можно объект `{ '$событие': обработчик }` — он подпишется через `view.on`.

```js
const persist = (key) => function () {
  return {
    $init(state)   { const s = localStorage.getItem(key); if (s) Object.assign(state, JSON.parse(s)) },
    $change(state) { localStorage.setItem(key, JSON.stringify(state)) },
  }
}

const app = view('#app', () => ({ n: 0 }))
app.plugin(persist('app'))
```

В теле плагина `state` ещё может быть `null` (view не смонтирован) — работайте через события.

Плагин может также навесить методы: `this.view.fn('name', …)`, подключить фильтры, директивы, компоненты — это обычный код, получающий `view`.

### 8.2 Фильтры

```js
Wex.filter('money', (v) => Number(v).toFixed(2) + ' ₽')     // глобально
v.filter('upper', (s) => String(s).toUpperCase())            // локально для view
```

Использование в выражениях — по синтаксису ScopeX. Нюанс: `view.filter()` создаёт для view собственный `ScopeX` с копией глобальных фильтров на этот момент; глобальные, зарегистрированные позже, такой view не увидит.

### 8.3 Директивы

Директива — **атрибут**, найденный по точному имени. Сам атрибут остаётся в DOM (по нему удобно искать плагинам). Значение мустачами не обрабатывается.

Современная форма (с жизненным циклом):

```js
Wex.directive('w-tooltip', {
  mounted($el, attrs, bag)  { bag.text = this.scope.parse(attrs['w-tooltip']); $el.attr('title', bag.text) },
  updated($el, attrs, bag)  { $el.attr('title', this.scope.parse(attrs['w-tooltip'])) },
  unmounted($el, bag)       { /* очистка */ },
})
```
```html
<button w-tooltip="hint">?</button>
```

Классическая форма (Wex 2):

```js
Wex.directive('w-focus',
  function compile($el, attrs) { /* вызывается при создании; this = { scope, view, compile, interpolate }; может вернуть новую разметку */ },
  function affect($el, attrs)  { /* после вставки и при каждом изменении; this = { $root, scope, view, component }; может вернуть revoke() */ }
)
```

Объекты контекста:
- `attrs` — слепок **всех** атрибутов элемента (`{имя: значение}`);
- `this.scope` (`LScope`): `parse(exp)`, `assign(key, value)`, `$new(locals)`, `interpolate(str)`, `filters`;
- `bag` — пустой объект на каждый узел, живёт между `mounted/updated/unmounted`.

`affect/mounted/updated` исполняются внутри эффекта и дополнительно подписаны на «тик» view (`view.__tick`): запускаются при **любом** изменении state этого view, плюс на всё, что прочитали. Это грубее, чем точечные `w-*`; для горячих путей предпочитайте `OPS`-расширение или компоненты.

**Важно:** директивы копируются в view **в момент его создания** (`new Map(globalDirectives)`). Регистрируйте глобальные директивы **до** создания view. Компоненты ищутся лениво и такого ограничения не имеют.

### 8.4 Расширение ядра: таблица `OPS`

Для собственных быстрых директив уровня `w-*` (если вы разработчик движка):

```js
import { OPS, effect, ev } from './wex.js'
OPS['w-title'] = (op, el, view, data, block) => {
  effect(block, () => { el.title = String(ev(view, op, data, op) ?? '') })
}
```
Чтобы атрибут был распознан планом, его имя нужно добавить в `BUILTIN` (в `wex.js`). `op = { t: 'w-title', path, expr }`. Эффект, созданный через `effect(block, …)`, автоматически снимется при `dispose` блока.

---

## 9. Общее состояние: `shareState`

```js
import { shareState } from './share-state.js'

const cart = shareState({ items: [], total: 0 }, {
  onChange: (key, value) => localStorage.setItem('cart.' + key, JSON.stringify(value)),
  drive:    (update)     => { drivers.push(update) },     // получает update(arg) конкретного view
})

const header = $('#header').state(cart)
const panel  = $('#panel').state(cart)
header.mount(); panel.mount()
```

- `shareState(init, options)` возвращает **функцию-инициализатор** (`initState`): она вызывается с `this = view` и возвращает один и тот же реактивный объект. Все view, получившие её, читают/пишут общий state; эффекты у каждого свои, обновляются независимо.
- `options.onChange(key, value)` — на любую мутацию поддерева; `key` — ключ последнего изменённого объекта, `value` — его новое значение.
- `options.drive(update)` — вызывается при `init()` каждого view и получает `arg => view.update(arg)`: канал, через который внешний код может принудительно обновлять конкретный view (`update(true)`, `update(obj)`).
- Подписка `onChange` не снимается (см. 6.7).

---

## 10. `Wex.$` — встроенный мини-jQuery

Подмножество jQuery без зависимостей. Нужен для `$('#tpl').state(...)`, `$el` в старых директивах, jQuery-подобных событий, `view.find()`. Если на странице есть настоящий jQuery — используется он.

**Селектор**: строка (CSS | HTML `<…>`), узел, `window`, коллекция, `$(fn)` — DOM ready.

**Обход**: `get, toArray, eq, first, last, slice, each, map, filter, not, is, find, closest, parent, children, next, prev, siblings, index`.

**Атрибуты/стили**: `attr, removeAttr, prop, val, data, hasClass, addClass, removeClass, toggleClass, css (числа → px для размерных свойств), show, hide, toggle, width, height, offset, focus, blur, click`.

**Содержимое**: `html, text, empty, remove, detach, clone, append, prepend, after, before, replaceWith, appendTo, prependTo`. Вставка нескольким целям: всем, кроме последней, достаются клоны.

**События**: `on, one, off, trigger, triggerHandler`; делегирование по селектору, пространства имён `click.ns`, `off('.ns')`, несколько событий через пробел; `return false` → `preventDefault + stopPropagation`; доп. аргументы `trigger(type, extra)` приходят после события. Обработчики регистрируются в `el.__wexEv` (доступно как `$._data(el, 'events')`).

**Статические**: `$.ajax, $.get, $.getJSON, $.post, $.extend (в т.ч. deep), $.each, $.isFunction, $.isArray, $.isPlainObject, $.trim, $.contains, $.parseHTML, $.noop, $.event.fix, $._data`; расширение: `$.fn.name = function () {…}`.

**`$.ajax`** (на `XMLHttpRequest`, интерфейс как у `jqXHR`):
- опции: `url, method|type, data, headers, cache, timeout, contentType, dataType, context, xhrFields, withCredentials, username, password, success, error, complete`;
- `GET`: `data` → query-строка (вложенные объекты `a[b]=…`, массивы `a[]=…`); `POST/PUT/…`: строка/`FormData`/`Blob` как есть, при `contentType` с `json` — `JSON.stringify`, иначе urlencoded;
- заголовок `X-Requested-With: XMLHttpRequest` — только для не-абсолютных URL;
- ответ JSON парсится по `dataType` или по `Content-Type`; ошибка парсинга при успешном статусе → `parsererror`; `204` → `nocontent`;
- возвращаемый объект: `done/fail/always/then/catch/promise/abort/state/getResponseHeader/getAllResponseHeaders/setRequestHeader`, поля `status, statusText, responseText, responseJSON`.

Не реализовано: анимации (`animate`, `fadeIn`…), `serialize`, `on` для `window`-специфики, большинство вспомогательных функций jQuery 3.

---

## 11. Рецепты

### 11.1 Родитель + дочерний компонент с событием и слотом

```html
<template id="users">
  <user-card w-for="u in users traceby u.id" :name="u.name" @remove="drop(u.id)">
    Роль: {{ u.role }}
  </user-card>
</template>
```
```js
const card = view(
  '<div class="card"><b>{{ name }}</b><slot></slot><button w-on="click:rm">×</button></div>',
  () => ({ name: '' })
)
card.fn('rm', function (state) { this.emit('remove', state.name) })
Wex.component('user-card', card)

const users = $('#users').state(() => ({ users: [{ id: 1, name: 'Анна', role: 'admin' }] }))
users.fn('drop', (state, id) => () => { state.users = state.users.filter(u => u.id !== id) })
users.mount()
```

### 11.2 Рекурсивное дерево

```js
const node = view('<li>{{ node.title }}<ul w-if="node.children && node.children.length">'
  + '<tree-node w-for="c in node.children traceby c.id" :node="c"></tree-node></ul></li>',
  () => ({ node: {} }))
Wex.component('tree-node', node)
```

### 11.3 Интеграция внешнего объекта (Chart.js и т.п.)

```js
v.on('$mount', function (state) { state._chart = null })      // _-ключ не обязателен, но удобен как соглашение
v.fn('refresh', function (state) {
  const chart = new Chart(ctx, cfg)      // экземпляр класса Proxy-ем не оборачивается
  v.update(true)                         // сообщить движку, что что-то изменилось «мимо»
})
```
Либо `config.autoForce = true` и `v.update(s => { chart.data.datasets[0].data = s.series; chart.update() })`.

### 11.4 Пакетное обновление

```js
v.hold()
try { state.a = 1; state.b = 2; state.rows = fetched } finally { v.release() }
```

### 11.5 Контролируемое обновление (дебаунс перерисовки)

```js
v.on('$update', function (state, prevent) { if (state.busy) prevent() })     // пока busy — DOM не трогаем
// когда готовы:
state.busy = false; v.update(true)
```

### 11.6 Подписка на изменения снаружи

```js
$('#app').on('$mount $change', (e, state, info) => console.log(e.type, info))   // на элемент <template>
```

### 11.7 Свой компонент-«хоуст» вместо хост-тега

Если нужен корень с определённым тегом (например `<section class="panel">`), создайте View из такого элемента, а не из `<template>`: `view(document.querySelector('section.panel-tpl'), init)` — хост заменится на `<section>` (7.4).

---

## 12. Диагностика, конфиг, профилирование

```js
Wex.config.debug      // true на localhost / 127.* / [::1] или если window.WEX_DEBUG = true (задать ДО загрузки)
Wex.config.autoForce  // false по умолчанию (см. 6.2)
Wex.config.maxDepth   // 50
```

- **Ошибки** (`level: 'error'`: ошибка в выражении, превышена глубина, `{{ }}` в `src`) выводятся **всегда**; **предупреждения** (`null/undefined` в `{{ }}`, пустой массив в `w-for`, проп получил `null`) — только в debug. Каждый пункт группируется в `console.groupCollapsed('Wex …')` с цепочкой компонентов (`root › user-card › …`), атрибутом, выражением и подсказкой, и **печатается один раз** на уникальную комбинацию.
- `window.WEX_PROFILE = true` (до загрузки) → `window.WEX_STATS = { instantiate, list, rows }` (мс на построение списков, число созданных строк).
- Свои плагины могут писать в тот же канал: `Wex.report('Заголовок', { view, attr, expr, hint, level })`.

---

## 13. Особенности, ограничения, что не описано

### Практические нюансы (стоит знать)

1. **Пропы только в существующие ключи state** (кроме открытых удалённых компонентов). Нет ключа — нет проп.
2. **Обработчик `@event` — карринг** `(state, ...params) => (...emitArgs) => …`; без возврата функции аргументы `emit` теряются.
3. **Геттеры в state не отслеживаются** (6.2); производные значения — в выражении шаблона.
4. **Глобальные директивы копируются в view при создании** — регистрируйте их раньше, чем создаёте view (8.3).
5. `directive(…, priority)` — параметр есть, действия нет.
6. Обновление DOM асинхронно (микрозадача): в тестах — `await Promise.resolve()` или `Wex.__flush()`.
7. Выражения без реактивных чтений навсегда «замирают» (6.6).
8. Строки `w-for`: запись в `item` локальна для строки, запись в неизвестное имя уходит в state (4.3).
9. Движок использует `new Function` (резолверы планов, фабрики строк, динамический `import`) — при строгой CSP нужен `unsafe-eval`.
10. Клон компонента копирует `$change`-обработчики прототипа через внутренний `__addHandler`, который сам подписку на изменения state не включает; если на клонах `$change` должен срабатывать, убедитесь, что подписка запрошена (например, `view.on('$change', …)` на самом экземпляре или `state.storage`).
11. `w-html` пропускает значение через `sanitizeSvg` — проверьте в `utils`, что именно он чистит; для произвольного пользовательского HTML этого может быть недостаточно.
12. Несколько `w-on` с одним событием на одном элементе — выживает последний.
13. Именованных слотов нет; слот один.

### Файлы, не вошедшие в выборку

| Модуль | Что нужно описать отдельно |
|---|---|
| `vendor/ScopeX` | Синтаксис выражений, фильтры, `.assign`, `$locals` |
| `utils.js` | `parseMustache`, `parseKey` (формат `имя(арг, арг)`), `getNodeAttrs`, `camelCase`, `isEqual`, `sanitizeSvg` |
| `store.js` | `VMLocalStorage.reloadJqvmLocalStorage` и ключ `state.storage` (персистентность) |
| `wire` | `createWire`, `$wire`, `noopAjax` — серверный транспорт |

---

*Конец спецификации Wex 3.0.0.*