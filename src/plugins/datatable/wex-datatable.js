/*!
 * Wex DataTable: плагин и компонент одновременно (серверный режим).
 *
 *   const dt = createDataTable({ renderers: { StatusBadge: BadgeView } })
 *   $('#app').state({ columns }).plugin(router).plugin(dt).mount()
 *   <DataTable url="/api/products" title="Products" :columns="columns" @select="onSelect"></DataTable>
 *
 * Зависимости: jQuery, Wex (window.jqvm, window.$wire), Quas. Роутер необязателен.
 */
(function (global) {
    'use strict'

    const $ = global.jQuery
    const { component } = global.jqvm

    // ---------------------------------------------------------------- опции

    const DEFAULTS = {
        name: 'DataTable',          // имя тега: <DataTable></DataTable>
        perPage: 15,
        perPageOptions: [5, 10, 15, 25, 50],
        rowKey: 'id',               // поле-идентификатор строки (выбор строк, traceby)
        routeParam: 'page',         // ключ в query роутера (если роутер подключён)
        caseSensitive: false,       // для текстовых операторов; переопределяется на колонке: caseSensitive
        match: 'all',               // all | any: как комбинировать условия фильтра
        multiSort: true,            // shift+клик по заголовку = сортировка по нескольким полям
        renderers: {},              // { ИмяТега: WexView } — компоненты ячеек, регистрируются глобально
        transport: null,            // (url, body) => jqXHR | Promise. По умолчанию $wire.post(url, body)

        // доступные операторы по типу колонки (лишние просто удалите). На колонке: operators: [...]
        operators: {
            text: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with',
                'in', 'not_in', 'is_null', 'is_not_null', 'is_empty', 'is_not_empty'],
            number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal',
                'between', 'not_between', 'in', 'not_in', 'is_null', 'is_not_null'],
            date: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal',
                'between', 'not_between', 'is_null', 'is_not_null'],
            boolean: ['equals', 'not_equals', 'is_null', 'is_not_null']
        },
        operatorLabels: {},         // { contains: 'содержит', ... } — иначе имя оператора без "_"

        // имена ключей запроса
        request: { page: 'page', perPage: 'per_page', sort: 'sort', filters: 'filters', search: 'search', columns: 'columns' },

        // где в ответе лежат данные. По умолчанию — Laravel paginate() (EloquentCollection).
        // Допустимы пути через точку: total: 'meta.total'
        response: { data: 'data', total: 'total', page: 'current_page', perPage: 'per_page', lastPage: 'last_page', from: 'from', to: 'to' }
    }

    const NO_VALUE = ['is_null', 'is_not_null', 'is_empty', 'is_not_empty']
    const TWO_VALUES = ['between', 'not_between']
    const LIST_VALUES = ['in', 'not_in']

    function mergeOptions(user) {
        const o = Object.assign({}, DEFAULTS, user)
        ;['request', 'response', 'operators', 'operatorLabels'].forEach(k => {
            o[k] = Object.assign({}, DEFAULTS[k], user[k])
        })
        return o
    }

    // ---------------------------------------------------------------- утилиты

    const get = (obj, path) => String(path).split('.').reduce((v, k) => (v == null ? v : v[k]), obj)
    const num = (v, d) => (v == null || v === '' || isNaN(+v) ? d : +v)
    const plain = x => JSON.parse(JSON.stringify(x))
    const closedPanel = () => ({ type: null, field: '', left: 0, top: 0 })
    let uid = 0

    function buildPages(page, last) {
        const set = new Set([1, last, page - 1, page, page + 1])
        const nums = [...set].filter(n => n >= 1 && n <= last).sort((a, b) => a - b)
        const out = []
        nums.forEach((n, i) => {
            if (i && n - nums[i - 1] > 1) out.push({ key: 'g' + n, n: 0, label: '…', current: false })
            out.push({ key: 'p' + n, n, label: String(n), current: n === page })
        })
        return out
    }

    // ---------------------------------------------------------------- шаблон

    const INPUT = 'w-full rounded border border-slate-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
    const LABEL = 'mb-1 block text-[11px] text-slate-500 dark:text-slate-400'
    const BTN = 'rounded border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
    const BTN_PRIMARY = 'rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700'
    const PANEL = 'dt-panel absolute z-20 w-[290px] rounded-md border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900'
    const PANEL_CLOSE = 'dt-close text-lg leading-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
    const TOOL_BTN = 'dt-open rounded p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
    const PAGE_BTN = 'dt-page border-y border-r border-slate-300 px-3 py-1.5 dark:border-slate-600'

    function buildTemplate(o) {
        const cellRenderers = Object.keys(o.renderers)
            .map(n => `<${n} w-if="cell.renderer==='${n}'" :value="cell.value" :row="cell.row"></${n}>`)
            .join('')

        return `<template>
<div class="dt-card relative rounded-md border border-slate-300 bg-white text-[13px] text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">

  <div w-if="!!search.value || !!activeFilters.length" class="flex min-h-[32px] flex-wrap items-center gap-1.5 rounded-t-md border-b border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
    <span class="mr-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">Active filters:</span>
    <span w-if="!!search.value" class="inline-flex items-center gap-1 rounded border border-slate-300 bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
      Search: “{{ search.value }}” <button class="dt-clear-search text-slate-500 hover:text-slate-900 dark:hover:text-white" aria-label="Remove search">×</button>
    </span>
    <span w-for="f in activeFilters traceby f.id" class="inline-flex items-center gap-1 rounded border border-slate-300 bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
      {{ f.label }} <button class="dt-remove text-slate-500 hover:text-slate-900 dark:hover:text-white" data-id="{{f.id}}" aria-label="Remove filter">×</button>
    </span>
  </div>

  <div class="relative flex min-h-[44px] items-center justify-between border-b border-slate-200 bg-slate-50 px-2 dark:border-slate-700 dark:bg-slate-800 {{ topRound }}">
    <span class="text-xs text-slate-500 dark:text-slate-400">{{ title }}</span>
    <div class="flex items-center gap-1">
      <button class="${TOOL_BTN}" data-panel="filter" aria-label="Filter"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5h16l-6.5 7.2v5.3l-3 1.5v-6.8L4 5Z"/><path d="m3 3 18 18"/></svg></button>
      <button class="${TOOL_BTN}" data-panel="search" aria-label="Search"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button>
    </div>
  </div>

  <section w-if="panel.type==='search'" w-transition="opacity 0.16s ease" class="${PANEL}" style="left:{{panel.left}}px;top:{{panel.top}}px" aria-label="Search panel">
    <div class="mb-2 flex items-center justify-between"><h2 class="text-xs font-semibold text-slate-800 dark:text-slate-100">Search</h2><button class="${PANEL_CLOSE}" aria-label="Close">×</button></div>
    <label class="${LABEL}">Column</label>
    <select class="${INPUT} mb-2" w-bind="searchForm.field"><option value="">All columns</option><option w-for="c in fields traceby c.field" value="{{c.field}}">{{c.label}}</option></select>
    <label class="${LABEL}">Value</label>
    <input class="${INPUT}" w-bind="searchForm.value" placeholder="Search..." />
    <div class="mt-3 flex justify-end gap-2"><button class="dt-close ${BTN}">Cancel</button><button class="dt-apply-search ${BTN_PRIMARY}">Search</button></div>
  </section>

  <section w-if="panel.type==='filter'" w-transition="opacity 0.16s ease" class="${PANEL}" style="left:{{panel.left}}px;top:{{panel.top}}px" aria-label="Filter panel">
    <div class="mb-2 flex items-center justify-between"><h2 class="text-xs font-semibold text-slate-800 dark:text-slate-100">Add filter</h2><button class="${PANEL_CLOSE}" aria-label="Close">×</button></div>
    <label class="${LABEL}">Column</label>
    <select class="dt-f-field ${INPUT} mb-2"><option w-for="c in filterable traceby c.field" value="{{c.field}}" w-selected="c.field===form.field">{{c.label}}</option></select>
    <label class="${LABEL}">Operator</label>
    <select class="dt-f-op ${INPUT} mb-2"><option w-for="op in operatorList traceby op.value" value="{{op.value}}" w-selected="op.value===form.operator">{{op.label}}</option></select>
    <div w-if="form.kind!=='none'">
      <label class="${LABEL}">Value</label>
      <select w-if="!!form.isBool" class="${INPUT}" w-bind="form.value"><option value="true">true</option><option value="false">false</option></select>
      <input w-if="!form.isBool" type="{{form.inputType}}" class="${INPUT}" w-bind="form.value" placeholder="{{form.placeholder}}" />
      <input w-if="form.kind==='two'" type="{{form.inputType}}" class="${INPUT} mt-2" w-bind="form.value2" placeholder="To" />
    </div>
    <div class="mt-3 flex justify-end gap-2"><button class="dt-close ${BTN}">Cancel</button><button class="dt-apply-filter ${BTN_PRIMARY}">Apply</button></div>
  </section>

  <div class="overflow-x-auto">
    <div class="table w-full min-w-[650px] border-collapse text-left" role="table">
      <div class="table-header-group bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" role="rowgroup"><div class="table-row" role="row">
        <div class="table-cell w-10 px-2 py-2.5 align-middle" role="columnheader"><input type="checkbox" class="dt-select-all h-4 w-4 rounded border-slate-300 accent-blue-500" w-checked="!!allSelected" aria-label="Select all" /></div>
        <div w-for="col in cols traceby col.field" class="table-cell whitespace-nowrap px-2 py-2.5 align-middle font-medium {{ thCls[col.field] }}" role="columnheader">
          <span class="inline-flex items-center gap-1.5">
            <button w-if="!!col.sortable" class="dt-sort inline-flex items-center gap-1.5 hover:text-blue-700 dark:hover:text-blue-400" data-field="{{col.field}}"><span>{{col.label}}</span><span class="text-slate-500 dark:text-slate-400"><svg width="16" height="15" viewBox="0 0 16 15" fill="currentColor"><path opacity="{{ sortDown[col.field] }}" d="M7.42701 9.97137C7.45026 9.99228 7.4687 10.0171 7.48128 10.0444C7.49386 10.0718 7.50034 10.1011 7.50034 10.1306C7.50034 10.1602 7.49386 10.1895 7.48128 10.2169C7.4687 10.2442 7.45026 10.269 7.42701 10.2899L5.42701 12.0909C5.4038 12.1118 5.37622 12.1284 5.34587 12.1398C5.31552 12.1511 5.28299 12.1569 5.25014 12.1569C5.21729 12.1569 5.18475 12.1511 5.1544 12.1398C5.12405 12.1284 5.09648 12.1118 5.07326 12.0909L3.07326 10.2899C3.02635 10.2477 3 10.1904 3 10.1306C3 10.0709 3.02635 10.0136 3.07326 9.97137C3.12017 9.92913 3.1838 9.9054 3.25014 9.9054C3.31648 9.9054 3.3801 9.92913 3.42701 9.97137L5.00014 11.388V2.92672C5.00014 2.86701 5.02648 2.80975 5.07336 2.76753C5.12025 2.72531 5.18383 2.70159 5.25014 2.70159C5.31644 2.70159 5.38003 2.72531 5.42692 2.76753C5.4738 2.80975 5.50014 2.86701 5.50014 2.92672V11.388L7.07326 9.97137C7.09648 9.95044 7.12405 9.93384 7.1544 9.92251C7.18475 9.91118 7.21729 9.90535 7.25014 9.90535C7.28299 9.90535 7.31552 9.91118 7.34587 9.92251C7.37622 9.93384 7.4038 9.95044 7.42701 9.97137Z"/><path opacity="{{ sortUp[col.field] }}" d="M13.427 4.56842L11.427 2.76744C11.4038 2.74651 11.3762 2.72991 11.3459 2.71858C11.3155 2.70725 11.283 2.70142 11.2501 2.70142C11.2173 2.70142 11.1848 2.70725 11.1544 2.71858C11.1241 2.72991 11.0965 2.74651 11.0733 2.76744L9.07326 4.56842C9.02635 4.61067 9 4.66796 9 4.7277C9 4.78744 9.02635 4.84473 9.07326 4.88697C9.12017 4.92922 9.1838 4.95295 9.25014 4.95295C9.31648 4.95295 9.3801 4.92922 9.42701 4.88697L11.0001 3.47039V11.9316C11.0001 11.9913 11.0265 12.0486 11.0734 12.0908C11.1202 12.133 11.1838 12.1568 11.2501 12.1568C11.3164 12.1568 11.38 12.133 11.4269 12.0908C11.4738 12.0486 11.5001 11.9913 11.5001 11.9316V3.47039L13.0733 4.88697C13.0965 4.90789 13.1241 4.92448 13.1544 4.9358C13.1848 4.94712 13.2173 4.95295 13.2501 4.95295C13.283 4.95295 13.3155 4.94712 13.3459 4.9358C13.3762 4.92448 13.4038 4.90789 13.427 4.88697C13.4502 4.86606 13.4687 4.84123 13.4812 4.8139C13.4938 4.78657 13.5003 4.75728 13.5003 4.7277C13.5003 4.69812 13.4938 4.66883 13.4812 4.6415C13.4687 4.61417 13.4502 4.58934 13.427 4.56842Z"/></svg></span></button>
            <span w-if="!col.sortable">{{col.label}}</span>
            <button w-if="!!col.filterable" class="dt-open {{ fCls[col.field] }}" data-panel="filter" data-field="{{col.field}}" aria-label="Filter column"><svg width="16" height="15" viewBox="0 0 16 15" fill="currentColor"><path d="M9.35833 12.5691C9.23655 12.569 9.11711 12.5389 9.01299 12.482L6.79033 11.2814C6.54024 11.1456 6.33324 10.954 6.18926 10.7252C6.04528 10.4964 5.96919 10.238 5.96833 9.97506V7.25858C5.96875 7.06686 5.90255 6.87982 5.77899 6.72369L2.67566 2.79634C2.60319 2.70568 2.55995 2.59875 2.5507 2.48736C2.54145 2.37596 2.56656 2.26443 2.62324 2.16507C2.67993 2.06571 2.766 1.98239 2.87195 1.92429C2.9779 1.86619 3.09961 1.83557 3.22366 1.83582H12.777C12.9011 1.83535 13.023 1.86584 13.1291 1.92389C13.2352 1.98194 13.3214 2.06531 13.3781 2.16474C13.4349 2.26418 13.4599 2.37582 13.4505 2.4873C13.4412 2.59877 13.3977 2.70574 13.325 2.79634L10.2217 6.72369C10.0979 6.87975 10.0314 7.06679 10.0317 7.25858V11.9615C10.0315 12.1224 9.96053 12.2767 9.83433 12.3905C9.70813 12.5044 9.53697 12.5686 9.35833 12.5691ZM3.22366 2.43915L6.32166 6.3755C6.52698 6.63271 6.63665 6.94182 6.63499 7.25858V9.97446C6.63524 10.1338 6.68122 10.2904 6.76847 10.429C6.85573 10.5677 6.9813 10.6836 7.13299 10.7657L9.35566 11.9663L9.36499 7.25798C9.36352 6.94115 9.47344 6.63203 9.67899 6.3749L12.7817 2.44755L3.22366 2.43915Z"/></svg></button>
          </span>
        </div>
      </div></div>
      <div class="table-row-group {{ dim }}" role="rowgroup">
        <div w-for="row in rows traceby row._key" class="table-row h-[42px] border-t border-slate-100 even:bg-slate-50 hover:bg-blue-50/50 dark:border-slate-800 dark:even:bg-slate-800/50 dark:hover:bg-slate-800" role="row">
          <div class="table-cell px-2 align-middle" role="cell"><input type="checkbox" class="dt-select h-4 w-4 rounded border-slate-300 accent-blue-500" data-key="{{row._key}}" w-checked="!!selected[row._key]" aria-label="Select row" /></div>
          <div w-for="cell in row._cells traceby cell.key" class="table-cell px-2 align-middle" role="cell">
            <span w-if="!cell.renderer">{{ cell.value }}</span>
            ${cellRenderers}
          </div>
        </div>
      </div>
    </div>
    <div w-if="!rows.length" class="px-3 py-8 text-center text-slate-500 dark:text-slate-400">{{ emptyText }}</div>
  </div>

  <footer class="mt-16 flex flex-wrap items-center justify-between gap-3 rounded-b-md border-t border-slate-300 bg-slate-50 px-4 py-3 text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
    <span>Showing {{ meta.from }} to {{ meta.to }} from {{ meta.total }} results.</span>
    <div class="flex items-center gap-2"><span class="hidden sm:inline">Rows per page</span>
      <select class="dt-per-page rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900"><option w-for="n in perPageOptions" value="{{n}}" w-selected="n===perPage">{{n}}</option></select>
    </div>
    <nav class="flex items-center" aria-label="Pagination">
      <button class="dt-page rounded-l border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-700" data-page="prev" w-disabled="meta.page<=1">Previous</button>
      <button w-for="p in pages traceby p.key" class="${PAGE_BTN} {{ p.cls }}" data-page="{{p.n}}">{{p.label}}</button>
      <button class="dt-page rounded-r border-y border-r border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-700" data-page="next" w-disabled="meta.page>=meta.lastPage">Next</button>
    </nav>
  </footer>
</div>
</template>`
    }

    // ---------------------------------------------------------------- фабрика

    function createDataTable(userOptions) {
        const o = mergeOptions(userOptions || {})

        // renderers — глобальные компоненты (локальные не наследуются дочерними)
        Object.keys(o.renderers).forEach(n => component(n, o.renderers[n]))

        const instances = new Set()
        let rootView = null

        // ---- роутер (необязателен): если его нет, URL не трогаем вообще
        const getRouter = () => (rootView && rootView.$router) || null
        const routeKey = state => state.routeKey || o.routeParam

        function readRoutePage(state) {
            const r = getRouter()
            if (!r) return null
            const p = parseInt(r.getLocation().query[routeKey(state)], 10)
            return p > 0 ? p : null
        }

        function writeRoutePage(state) {
            const r = getRouter()
            if (!r) return
            if (readRoutePage(state) !== state.page) r.setParams({ [routeKey(state)]: state.page })
        }

        function onRoute(state) {
            if (!state.cols.length) return
            const p = readRoutePage(state) || 1
            if (p !== state.page) { state.page = p; load(state) }
        }

        // ---- колонки и операторы
        function normalize(columns) {
            return (columns || []).map(c => {
                const virtual = !!c.virtual
                return Object.assign({}, c, {
                    type: c.type || 'text',
                    label: c.label != null ? c.label : c.field,
                    renderer: c.renderer || '',
                    virtual,
                    sortable: virtual ? false : c.sortable !== false,
                    filterable: virtual ? false : c.filterable !== false
                })
            })
        }

        const kindOf = op => (NO_VALUE.includes(op) ? 'none' : TWO_VALUES.includes(op) ? 'two' : LIST_VALUES.includes(op) ? 'list' : 'one')
        const opLabel = op => o.operatorLabels[op] || op.replace(/_/g, ' ')

        function opsFor(col) {
            const list = col.operators || o.operators[col.type] || o.operators.text
            return list.map(v => ({ value: v, label: opLabel(v) }))
        }

        function coerce(col, v) {
            if (col.type === 'number') return Number(v)
            if (col.type === 'boolean') return v === true || v === 'true'
            return String(v)
        }

        function syncForm(state) {
            const col = state.cols.find(c => c.field === state.form.field) || {}
            const list = opsFor(col)
            state.operatorList = list
            if (!list.some(x => x.value === state.form.operator)) state.form.operator = list.length ? list[0].value : ''
            const kind = kindOf(state.form.operator)
            state.form.kind = kind
            state.form.isBool = col.type === 'boolean'
            state.form.inputType = col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'
            state.form.placeholder = kind === 'two' ? 'From' : kind === 'list' ? 'a, b, c' : 'Enter a value'
            if (state.form.isBool && !['true', 'false'].includes(String(state.form.value))) state.form.value = 'true'
        }

        // ---- производное состояние (то, что нельзя посчитать в выражениях шаблона)
        function refresh(state) {
            const sortMap = {}, sortUp = {}, sortDown = {}, filteredMap = {}
            state.sort.forEach(s => { sortMap[s.field] = s.dir })
            state.cols.forEach(c => {
                sortUp[c.field] = sortMap[c.field] === 'desc' ? 0.3 : 1     // верхняя стрелка гаснет при desc
                sortDown[c.field] = sortMap[c.field] === 'asc' ? 0.3 : 1    // нижняя гаснет при asc
            })
            state.activeFilters.forEach(f => { filteredMap[f.field] = true })
            state.sortMap = sortMap
            state.sortUp = sortUp
            state.sortDown = sortDown
            state.filteredMap = filteredMap
            const thCls = {}, fCls = {}
            state.cols.forEach(c => {
                thCls[c.field] = sortMap[c.field] ? 'bg-slate-200 dark:bg-slate-700' : ''
                fCls[c.field] = filteredMap[c.field] ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
            })
            state.thCls = thCls
            state.fCls = fCls
            state.dim = state.loading ? 'opacity-60' : ''
            state.topRound = (state.search.value || state.activeFilters.length) ? '' : 'rounded-t-md'
            state.pages = buildPages(state.meta.page, state.meta.lastPage).map(p => Object.assign(p, {
                cls: p.current ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700'
            }))
            state.allSelected = state.rows.length > 0 && state.rows.every(r => !!state.selected[r._key])
            state.emptyText = state.loading ? 'Loading…' : (state.error || 'No results')
        }

        // ---- запрос / ответ
        function buildPayload(state) {
            const k = o.request
            const body = {}
            body[k.page] = state.page
            body[k.perPage] = state.perPage
            body[k.sort] = state.sort.map(s => ({ field: s.field, dir: s.dir }))
            body[k.search] = state.search.value ? { field: state.search.field || null, value: state.search.value } : null
            body[k.filters] = {
                match: o.match,
                items: state.activeFilters.map(f => {
                    const col = state.cols.find(c => c.field === f.field) || {}
                    const item = { field: f.field, operator: f.operator }
                    if (f.value !== undefined) item.value = f.value
                    if (col.type === 'text') item.case_sensitive = col.caseSensitive != null ? !!col.caseSensitive : o.caseSensitive
                    return item
                })
            }
            body[k.columns] = state.cols.filter(c => !c.virtual).map(c => c.field)
            return plain(body)
        }

        function apply(state, res) {
            const m = o.response
            const rows = get(res, m.data) || []
            rows.forEach((r, i) => {
                r._key = r[o.rowKey] != null ? r[o.rowKey] : 'i' + i
                // ячейки собираем заранее: во вложенном w-for переменная внешнего цикла (row) может быть не видна.
                // row в ячейке — копия без _cells, чтобы не было циклической ссылки
                const copy = Object.assign({}, r)
                r._cells = state.cols.map(c => ({
                    key: c.field,
                    renderer: c.renderer,
                    value: r[c.field] === undefined ? '' : r[c.field],
                    row: copy
                }))
            })
            const page = num(get(res, m.page), state.page)
            state.rows = rows
            state.meta = {
                total: num(get(res, m.total), rows.length),
                page,
                perPage: num(get(res, m.perPage), state.perPage),
                lastPage: Math.max(1, num(get(res, m.lastPage), 1)),
                from: num(get(res, m.from), 0),
                to: num(get(res, m.to), 0)
            }
            state.page = page
        }

        function load(state) {
            const token = state._token = (state._token || 0) + 1
            const send = o.transport || ((url, body) => global.$wire.post(url, body))
            state.loading = true
            state.error = ''
            refresh(state)
            $.when(send(state.url, buildPayload(state)))
                .done(res => { if (token === state._token) apply(state, res) })
                .fail(() => { if (token === state._token) { state.rows = []; state.error = 'Failed to load data' } })
                .always(() => { if (token === state._token) { state.loading = false; refresh(state) } })
        }

        // изменение сортировки/фильтров/размера страницы: на первую страницу + перезагрузка
        function reload(state, resetPage) {
            if (resetPage) { state.page = 1; writeRoutePage(state) }
            load(state)
        }

        function goPage(state, p) {
            p = Math.max(1, Math.min(p, state.meta.lastPage))
            if (p === state.page) return
            state.page = p
            writeRoutePage(state)
            load(state)
        }

        // ---- компонент
        const view = $(buildTemplate(o).trim())
            .state(() => ({
                // props
                url: '', title: '', columns: [], perPage: o.perPage, routeKey: '',
                // данные
                cols: [], filterable: [], fields: [], rows: [],
                meta: { total: 0, page: 1, lastPage: 1, from: 0, to: 0 },
                page: 1, sort: [], search: { field: '', value: '' }, activeFilters: [],
                selected: {}, perPageOptions: o.perPageOptions,
                // UI
                loading: false, error: '', panel: closedPanel(),
                form: { field: '', operator: 'equals', value: '', value2: '', kind: 'one', isBool: false, inputType: 'text', placeholder: 'Enter a value' },
                searchForm: { field: '', value: '' }, operatorList: [],
                // производное
                sortMap: {}, sortUp: {}, sortDown: {}, filteredMap: {}, pages: [], allSelected: false, emptyText: 'No results', thCls: {}, fCls: {}, dim: '', topRound: 'rounded-t-md'
            }))

            .on('$mount', function (state) {
                instances.add(state)
                state.cols = normalize(state.columns)
                state.fields = state.cols.filter(c => !c.virtual)
                state.filterable = state.cols.filter(c => c.filterable)
                state.perPage = parseInt(state.perPage, 10) || o.perPage
                state.form.field = state.filterable.length ? state.filterable[0].field : ''
                syncForm(state)
                state.page = readRoutePage(state) || 1
                refresh(state)
                load(state)
            })
            .on('$unmount', function (state) { instances.delete(state) })
            .on('$destroy', function (state) { instances.delete(state) })

            // закрытие панели кликом вне её
            .on('click', function (state) {
                return function (e) {
                    if (state.panel.type && !$(e.target).closest('.dt-panel, .dt-open').length) state.panel = closedPanel()
                }
            })

            // открыть панель рядом с кликнутой кнопкой / колонкой
            .on('click', '.dt-open', function (state) {
                return function (e) {
                    const btn = e.currentTarget
                    const type = btn.getAttribute('data-panel')
                    const field = btn.getAttribute('data-field') || ''
                    if (state.panel.type === type && state.panel.field === field) { state.panel = closedPanel(); return }

                    const W = 290
                    const card = btn.closest('.dt-card').getBoundingClientRect()
                    const th = btn.closest('th')
                    let left, top
                    if (th) {
                        const r = th.getBoundingClientRect()
                        left = r.left - card.left
                        top = r.bottom - card.top + 6
                    } else {
                        const r = btn.getBoundingClientRect()
                        left = r.right - card.left - W
                        top = r.bottom - card.top + 6
                    }
                    left = Math.max(8, Math.min(left, card.width - W - 8))

                    if (type === 'filter') {
                        if (field) {
                            state.form.field = field
                            state.form.operator = 'equals'
                            state.form.value = ''
                            state.form.value2 = ''
                        }
                        syncForm(state)
                    } else {
                        state.searchForm = { field: state.search.field || '', value: state.search.value }
                    }
                    state.panel = { type, field, left, top }
                }
            })
            .on('click', '.dt-close', function (state) { return function () { state.panel = closedPanel() } })

            .on('change', '.dt-f-field', function (state) {
                return function (e) {
                    state.form.field = e.currentTarget.value
                    state.form.operator = 'equals'
                    state.form.value = ''
                    state.form.value2 = ''
                    syncForm(state)
                }
            })
            .on('change', '.dt-f-op', function (state) {
                return function (e) { state.form.operator = e.currentTarget.value; syncForm(state) }
            })

            .on('click', '.dt-apply-filter', function (state) {
                return function () {
                    const f = state.form
                    const col = state.cols.find(c => c.field === f.field)
                    if (!col) return
                    const filled = v => v != null && String(v).trim() !== ''
                    let value, text
                    if (f.kind === 'one') {
                        if (!filled(f.value)) return
                        value = coerce(col, f.value); text = '“' + f.value + '”'
                    } else if (f.kind === 'two') {
                        if (!filled(f.value) || !filled(f.value2)) return
                        value = [coerce(col, f.value), coerce(col, f.value2)]; text = f.value + ' – ' + f.value2
                    } else if (f.kind === 'list') {
                        const parts = String(f.value || '').split(',').map(s => s.trim()).filter(Boolean)
                        if (!parts.length) return
                        value = parts.map(s => coerce(col, s)); text = parts.join(', ')
                    }
                    if (Array.isArray(value) ? value.some(Number.isNaN) : Number.isNaN(value)) return
                    state.activeFilters.push({
                        id: ++uid, field: col.field, operator: f.operator, value,
                        label: col.label + ': ' + opLabel(f.operator) + (text ? ' ' + text : '')
                    })
                    state.panel = closedPanel()
                    state.form.value = ''
                    state.form.value2 = ''
                    refresh(state)
                    reload(state, true)
                }
            })
            .on('click', '.dt-remove', function (state) {
                return function (e) {
                    const id = e.currentTarget.getAttribute('data-id')
                    const i = state.activeFilters.findIndex(f => String(f.id) === id)
                    if (i < 0) return
                    state.activeFilters.splice(i, 1)
                    refresh(state)
                    reload(state, true)
                }
            })

            .on('click', '.dt-apply-search', function (state) {
                return function () {
                    state.search = { field: state.searchForm.field || '', value: String(state.searchForm.value || '').trim() }
                    state.panel = closedPanel()
                    reload(state, true)
                }
            })
            .on('click', '.dt-clear-search', function (state) {
                return function () { state.search = { field: '', value: '' }; reload(state, true) }
            })

            // сортировка: клик = asc -> desc -> снять; shift+клик = добавить к текущей
            .on('click', '.dt-sort', function (state) {
                return function (e) {
                    const field = e.currentTarget.getAttribute('data-field')
                    const cur = state.sort.find(s => s.field === field)
                    const next = !cur ? 'asc' : cur.dir === 'asc' ? 'desc' : null
                    let list = []
                    if (o.multiSort && e.shiftKey) {
                        list = state.sort.map(s => ({ field: s.field, dir: s.dir }))
                        const i = list.findIndex(s => s.field === field)
                        if (!next) list.splice(i, 1)
                        else if (i >= 0) list[i].dir = next
                        else list.push({ field, dir: next })
                    } else if (next) {
                        list = [{ field, dir: next }]
                    }
                    state.sort = list
                    refresh(state)
                    reload(state, true)
                }
            })

            // пагинация
            .on('click', '.dt-page', function (state) {
                return function (e) {
                    const v = e.currentTarget.getAttribute('data-page')
                    const p = v === 'prev' ? state.page - 1 : v === 'next' ? state.page + 1 : parseInt(v, 10)
                    if (p) goPage(state, p)
                }
            })
            .on('change', '.dt-per-page', function (state) {
                return function (e) {
                    state.perPage = parseInt(e.currentTarget.value, 10) || o.perPage
                    reload(state, true)
                }
            })

            // выбор строк (ключи сохраняются между страницами); событие @select отдаёт массив ключей
            .on('change', '.dt-select', function (state) {
                const v = this
                return function (e) {
                    state.selected[e.currentTarget.getAttribute('data-key')] = e.currentTarget.checked
                    refresh(state)
                    v.emit('select', Object.keys(state.selected).filter(k => state.selected[k]))
                }
            })
            .on('change', '.dt-select-all', function (state) {
                const v = this
                return function (e) {
                    state.rows.forEach(r => { state.selected[r._key] = e.currentTarget.checked })
                    refresh(state)
                    v.emit('select', Object.keys(state.selected).filter(k => state.selected[k]))
                }
            })

        component(o.name, view)

        // ---- плагин: нужен, чтобы достать роутер корневого view и слушать $route
        return function () {
            rootView = this.view
            rootView.on('$route', function () { instances.forEach(onRoute) })
            return {}
        }
    }

    global.createDataTable = createDataTable
})(window)