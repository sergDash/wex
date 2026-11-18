# Wex 3: быстрое ядро, интерфейс Wex 2, без jQuery

## Файлы
- `src/core.js`: ядро (шаблоны, реактивные привязки, w-if / w-for / слоты / компоненты). Горячий путь, его не трогали.
- `src/directives.js`: встроенные `w-class / w-value / w-bind / w-on / w-src / w-html / w-id / w-transition / w-disabled / w-checked / w-selected`
  и совместимость со Wex 2 (старые `directive()` / `component()` с `$el`, `compile`, `affect`).
- `src/dollar.js`: собственный `$` (мини-аналог jQuery, без зависимостей).
- `src/wex.js`: входной файл (экспорты Wex 2, `window.Wex`, `window.$`, `window.jqvm`).
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