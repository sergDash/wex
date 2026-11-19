# Wex 3: быстрое ядро, интерфейс Wex 2, без jQuery

## Основные изменения:
- Вырезан jQuery 
- Компилятор Wex стал oxc-compiler вместо Babel
- Nodejs стал 26 вместо 18 
- Вырезаны все внутренние зависимости Wex, он теперь node_modules-agnostic
- Уменьшин вес основной сборки
- Увеличен performance

## Файлы
- `src/wex.js`: ядро (шаблоны, реактивные привязки, w-if / w-for / слоты / компоненты). Горячий путь, его не трогали.
- `src/directives.js`: встроенные `w-class / w-value / w-bind / w-on / w-src / w-html / w-id / w-transition / w-disabled / w-checked / w-selected`
  и совместимость со Wex 2 (старые `directive()` / `component()` с `$el`, `compile`, `affect`).
- `src/dollar.js`: собственный `$` (мини-аналог jQuery, без зависимостей).
- `src/index.js`: входной файл (экспорты Wex 2, `window.Wex`, `window.$`, `window.jqvm`).
- `src/reactive.js`, `src/utils.js`, `src/store.js`; `src/vendor/ScopeX` ваш.

## `$` без jQuery
`$('#tpl').state({...}).mount()`, `$('<template>…</template>').vm(init)`: работает из коробки, `window.$` создаётся, если он свободен.
Мини-`$` покрывает: выборку и обход (find, closest, parent, children, next, eq, each, map, filter, is…), attr/prop/val/data/css/классы/show/hide,
html/text/append/prepend/after/before/replaceWith/remove/empty/clone, события (on/off/one/trigger/triggerHandler, делегирование, namespaces),
`$.extend`, `$.each`, `$.event.fix` и т.д. Обработчик получает обёртку события (`originalEvent`, `which`, `delegateTarget`, `isPropagationStopped`…).
Если на странице есть настоящий jQuery, Wex подхватит его сам (или `Wex.useJQuery($)`), и тогда `$el` в старых директивах будет полным jQuery.

## Интерфейс Wex 2
- `directive(name, compile($el, attrs), affect($el, attrs), priority)` и объектная форма `{ compile, mounted, updated, unmounted }`.
- `component(name, View | 'url' | function compile($el, attrs, slot), affect)`, компонент с корневым тегом (hoist), удалённые компоненты.
- `view.on/once/off/emit/update/hold/release/find/plugin/fn/method/clone`, события `$init $mount $render $change $update $unmount $destroy`.

## Отличия от Wex 2
1. `view.update(fn)` перерисовывает то, что затронуто через прокси. Для изменений мимо прокси: `view.update(true)` или `Wex.config.autoForce = true`.
2. Слот видит scope родителя; данные ребёнка: `<slot :row="row">` или `slot(locals)`.
3. `affect` и `updated` старых директив перезапускаются при любом изменении state своего view.
4. Встроенные `w-*` атрибуты вырезаются из DOM после разбора (атрибуты ваших директив остаются).
5. Ключи `traceby` локальны списку; тот же ключ с новым объектом: строка остаётся и перечитывает привязки.
6. Мини-`$` не умеет ajax, анимации, `.animate`, селекторы jQuery-расширений (`:visible`, `:eq()`). Если плагинам это нужно, подключите jQuery.
7. `Wex.view(html | <template> | '#selector', initState)` вместо `$('<template>').state(...)`; `.mount(el)`, `.method`, `.on`, `.update`, `.hold/.release` как раньше.
8. `component(name, view | url, {lazy})`; `directive(name, fn | {mounted, updated, unmounted})`: без jQuery, `fn(el, b)` идёт в эффекте, `b.get()` читает выражение.
9. Файл удалённого компонента: `export default ($tpl) => $tpl.state(() => ({...}))` без изменений.
10. Эффект на каждый `{{ }}`, атрибут, `w-if`, `w-for`: правка одной строки пересчитывает только её.
11. `w-for` с traceby: ключевой diff с LIS (минимум перестановок). Ключи теперь локальны списку: перенос карточки между колонками пересоздаёт строку (раньше DOM-узел переезжал).
12. Слот видит scope родителя (раньше ещё и state ребёнка); данные ребёнка в слот отдаются через `<slot :row="row">`.
13. Функции-компоненты (`Link` и т.п.), compile-хуки директив и `$` / `compile($el, attrs)` удалены. Hoist по `view.tag` (компонент вместо тега) не поддержан: компонент всегда рендерится внутрь своего элемента.
14. `view.update(fn)` больше не форсирует рендер; для нереактивных данных (Chart.js) используйте `view.update(true)`.
15. w-атрибуты вырезаются из DOM после разбора; `w-class` теперь снимает класс, когда условие стало ложным.
16. События `w-on`: обработчик получает нативный Event (не jQuery.Event).

## Новое в этой версии
- `w-for="todo, index in todos" w-key="todo.id"`: ключ можно задать атрибутом `w-key`; `traceby` остаётся (если указаны оба, берётся `traceby`).
  Пробел после запятой и произвольное выражение списка теперь допустимы.
- Рекурсивные компоненты: компонент находит себя и компоненты родителей (глобальные ищутся при обращении, не копируются при создании).
  Работает для `component('x', view)`, `view.component('x', view)` у родителя и для `component('comment', '/comment.html')`: `comment.html` может содержать `<comment>`.
  Удалённый компонент без `<script>` принимает пропы как ключи state. Бесконечная рекурсия останавливается на `config.maxDepth` (50): элемент получает `data-wex-error="max-depth"`.
- `$wire` встроен (`src/wire.js`, ваш исходник; изменена только `defaultAjax`): доступен как `window.$wire`, `Wex.$wire`, `import { $wire, createWire } from './wex.js'`.
  Для запросов используется встроенный `$.ajax` (XMLHttpRequest, интерфейс jqXHR: `done / fail / always / then / abort`), jQuery не нужен.
  Если вы подключаете свой `wire.js` отдельно, он создаст второй экземпляр со своим `pending`: оставьте один.
- Файлы `*.mjs` в `test/` и `tools/`: скрипты проверки под Node, в сборку (oxc) не входят. В браузере то же самое проверяет `test/selftest.html`.