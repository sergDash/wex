/*
 * Wex DatePicker: плагин и два компонента (DatePicker, DateTimePicker) в одном файле.
 *
 *   const dp = createDatePicker({ clickableMonth: false })
 *   $('#app').state({ date: '' }).plugin(dp).mount()
 *   <DatePicker :value="date" @change="onDate"></DatePicker>
 *   <DateTimePicker :clickableMonth="true" :clickableYear="true" value="2026-11-12 23:32"></DateTimePicker>
 *
 * Зависимости: jQuery, Wex (window.jqvm), Quas. Значение: 'YYYY-MM-DD' или 'YYYY-MM-DD HH:mm'.
 */
(function (global) {
    'use strict'

    const $ = global.jQuery
    const { component } = global.jqvm

    // ---------------------------------------------------------------- опции

    const DEFAULTS = {
        clickableMonth: false,      // клик по месяцу В ИНПУТЕ открывает выбор месяца (в шапке календаря работает всегда)
        clickableYear: false,       // то же для года
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],   // порядок как у Date.getDay(): с воскресенья
        weekStart: 1,               // первый день недели: 1 = понедельник, 0 = воскресенье
        locale: 'ru-RU',            // только для aria-label дней
        yearsBefore: 60,            // диапазон списка годов: от текущего года минус N
        yearsAfter: 60,             // ... до текущего года плюс N (расширяется, если значение вне диапазона)
        // формат отображения в инпуте. Токены: dd, MM (месяц), yyyy, HH, mm (минуты)
        formats: { date: 'dd/MM/yyyy', datetime: 'dd/MM/yyyy HH:mm' },
        tokenLabels: { dd: 'дд', MM: 'мм', yyyy: 'гггг', HH: 'чч', mm: 'мм' },   // для placeholder
        labels: {
            prevMonth: 'Предыдущий месяц', nextMonth: 'Следующий месяц', toggle: 'Открыть календарь',
            pickDate: 'Выбор даты', pickDateTime: 'Выбор даты и времени',
            hour: 'Час', minute: 'Минута', months: 'Месяцы', years: 'Годы'
        }
    }

    function mergeOptions(user) {
        const o = Object.assign({}, DEFAULTS, user)
        ;['formats', 'tokenLabels', 'labels'].forEach(k => { o[k] = Object.assign({}, DEFAULTS[k], user[k]) })
        return o
    }

    // ---------------------------------------------------------------- чистые утилиты

    const TOKENS = { dd: 2, MM: 2, yyyy: 4, HH: 2, mm: 2 }
    const has = (obj, k) => Object.prototype.hasOwnProperty.call(obj, k)
    const pad = n => String(n).padStart(2, '0')
    const dim = (y, m) => new Date(y, m + 1, 0).getDate()
    const truthy = x => x === true || x === 'true' || x === '' || x === 1 || x === '1'
    const after = fn => setTimeout(fn, 50)

    // 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DDTHH:mm' -> { y, m(0-11), d, h, i } | null
    function parseValue(v) {
        const r = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/.exec(String(v == null ? '' : v).trim())
        if (!r) return null
        const p = { y: +r[1], m: +r[2] - 1, d: +r[3], h: +(r[4] || 0), i: +(r[5] || 0) }
        if (p.y < 1000 || p.m < 0 || p.m > 11 || p.d < 1 || p.d > dim(p.y, p.m) || p.h > 23 || p.i > 59) return null
        return p
    }

    const toIso = (p, withTime) =>
        String(p.y).padStart(4, '0') + '-' + pad(p.m + 1) + '-' + pad(p.d) + (withTime ? ' ' + pad(p.h) + ':' + pad(p.i) : '')

    const FMT = {}
    function compile(fmt) {
        if (FMT[fmt]) return FMT[fmt]
        const parts = fmt.split(/(dd|MM|yyyy|HH|mm)/).filter(Boolean)
            .map(s => (has(TOKENS, s) ? { tok: s, len: TOKENS[s] } : { lit: s }))
        let total = 0, pos = 0
        const segs = []
        parts.forEach(p => {
            if (p.tok) { total += p.len; segs.push({ tok: p.tok, from: pos, to: pos + p.len }); pos += p.len } else pos += p.lit.length
        })
        return (FMT[fmt] = { parts, total, segs })
    }

    // цифры -> маска. Разделитель добавляется только когда за ним есть следующая цифра
    function maskDigits(f, digits) {
        let out = '', i = 0
        for (const p of f.parts) {
            if (p.tok) {
                const chunk = digits.substr(i, p.len)
                if (!chunk) break
                out += chunk
                i += chunk.length
                if (chunk.length < p.len) break
            } else if (i < digits.length) out += p.lit
        }
        return out
    }

    // позиция каретки -> сегмент маски (граница относится к левому сегменту, разделитель к правому)
    function segmentAt(f, pos) {
        for (const s of f.segs) if (pos <= s.to) return s
        return f.segs[f.segs.length - 1]
    }

    const caretFor = (masked, n) => {
        if (!n) return 0
        let c = 0
        for (let i = 0; i < masked.length; i++) if (/\d/.test(masked[i]) && ++c === n) return i + 1
        return masked.length
    }

    // текст -> значения полностью заполненных сегментов
    function parseText(f, text) {
        const digits = String(text || '').replace(/\D/g, '')
        const v = {}
        let i = 0
        f.parts.forEach(p => {
            if (!p.tok) return
            const c = digits.substr(i, p.len)
            i += p.len
            if (c.length === p.len) v[p.tok] = +c
        })
        return v
    }

    function toParts(v, withTime) {
        if (v.dd == null || v.MM == null || v.yyyy == null) return null
        if (withTime && (v.HH == null || v.mm == null)) return null
        const p = { y: v.yyyy, m: v.MM - 1, d: v.dd, h: withTime ? v.HH : 0, i: withTime ? v.mm : 0 }
        if (p.y < 1000 || p.m < 0 || p.m > 11 || p.d < 1 || p.d > dim(p.y, p.m) || p.h > 23 || p.i > 59) return null
        return p
    }

    const formatP = (f, p) => {
        const val = { dd: p.d, MM: p.m + 1, yyyy: p.y, HH: p.h, mm: p.i }
        return f.parts.map(x => (x.tok ? String(val[x.tok]).padStart(x.len, '0') : x.lit)).join('')
    }

    // ---------------------------------------------------------------- стили, глобальные слушатели

    function injectCss() {
        if (document.getElementById('wex-datepicker-css')) return
        const st = document.createElement('style')
        st.id = 'wex-datepicker-css'
        st.textContent = '.dp-hide-sb{scrollbar-width:none;-ms-overflow-style:none}.dp-hide-sb::-webkit-scrollbar{display:none}'
        document.head.appendChild(st)
    }

    const instances = new Set()
    let listening = false
    const rootEl = s => document.querySelector('[data-dp="' + s.id + '"]')
    const inputEl = s => { const r = rootEl(s); return r && r.querySelector('.dp-input') }
    let uid = 0

    function listen() {
        if (listening) return
        listening = true
        // клик вне компонента закрывает попап
        document.addEventListener('pointerdown', e => {
            instances.forEach(s => {
                if (s.open && !(e.target.closest && e.target.closest('[data-dp="' + s.id + '"]'))) { s.open = false; s.panel = 'calendar' }
            })
        })
        document.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return
            instances.forEach(s => {
                if (!s.open) return
                s.open = false
                s.panel = 'calendar'
                const r = rootEl(s), el = inputEl(s)
                if (r && el && r.contains(document.activeElement)) el.focus()
            })
        })
    }

    // ---------------------------------------------------------------- шаблон

    const CARD = 'rounded-lg border border-slate-100 bg-white shadow-[0_2px_7px_rgba(15,23,42,.12)] dark:border-slate-700 dark:bg-slate-900'
    const OPT = 'h-[31px] w-full rounded border text-sm font-semibold text-slate-500 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800'
    const NAV = 'dp-nav rounded-md p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    const HEAD_BTN = 'rounded px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800'

    function timeCol(kind, list) {
        return `<div class="dp-time dp-hide-sb relative h-[220px] w-[78px] shrink-0 snap-y snap-mandatory overflow-y-auto overscroll-contain touch-pan-y ${CARD} p-1.5">
      <button w-for="t in ${list} traceby t.key" type="button" class="dp-${kind} snap-center my-0.5 ${OPT} {{ t.cls }}" data-v="{{ t.v }}" data-sel="{{ t.sel }}" aria-label="{{ t.aria }}" aria-pressed="{{ t.sel }}">{{ t.label }}</button>
    </div>`
    }

    function template(withTime) {
        return `<template>
<div class="dp-root relative w-full max-w-[288px]" data-dp="{{ id }}">
  <div class="relative">
    <input type="text" inputmode="numeric" autocomplete="off" class="dp-input min-h-[40px] w-full rounded-md border border-slate-100 bg-white px-3 pr-9 text-[13px] text-slate-600 shadow-[0_2px_7px_rgba(15,23,42,.08)] outline-none transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" w-value="text" placeholder="{{ ph }}" aria-haspopup="dialog" aria-expanded="{{ open }}" />
    <button type="button" class="dp-toggle absolute right-0 top-0 flex h-full w-9 items-center justify-center text-slate-400" aria-label="{{ L.toggle }}"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>

  <div w-if="open" class="dp-popup absolute left-0 z-30 flex w-max max-w-[calc(100vw-2rem)] flex-wrap items-start gap-2 {{ pos }}" role="dialog" aria-label="{{ dialog }}">

    <div w-if="panel==='calendar'" class="${CARD} w-[288px] p-2.5">
      <div class="flex h-10 items-center justify-between border-b border-slate-100 px-1 dark:border-slate-700">
        <button type="button" class="${NAV}" data-step="-1" aria-label="{{ L.prevMonth }}"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <button type="button" class="dp-month-btn ${HEAD_BTN}">{{ monthLabel }}</button>
          <button type="button" class="dp-year-btn ${HEAD_BTN}">{{ view.y }}</button>
        </div>
        <button type="button" class="${NAV}" data-step="1" aria-label="{{ L.nextMonth }}"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <div class="grid grid-cols-7 text-center">
        <div w-for="wd in wdays traceby wd.key" class="py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{{ wd.label }}</div>
        <button w-for="d in days traceby d.key" type="button" class="dp-day mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition focus-visible:ring-2 focus-visible:ring-slate-400 {{ d.cls }}" data-iso="{{ d.iso }}" aria-label="{{ d.label }}" aria-pressed="{{ d.sel }}">{{ d.n }}</button>
      </div>
    </div>

    <div w-if="panel!=='calendar'" class="dp-opts relative max-h-[196px] w-[288px] overflow-y-auto ${CARD} p-2.5" role="listbox" aria-label="{{ panel==='month' ? L.months : L.years }}">
      <div class="grid gap-1">
        <button w-for="o in options traceby o.key" type="button" class="dp-opt ${OPT} {{ o.cls }}" data-v="{{ o.v }}" data-sel="{{ o.sel }}" role="option" aria-selected="{{ o.sel }}">{{ o.label }}</button>
      </div>
    </div>
    ${withTime ? timeCol('hour', 'hours') + timeCol('minute', 'minutes') : ''}
  </div>
</div>
</template>`
    }

    // ---------------------------------------------------------------- фабрика

    function createDatePicker(userOptions) {
        const o = mergeOptions(userOptions || {})
        injectCss()
        listen()

        const fmtOf = s => compile(s.format || (s.withTime ? o.formats.datetime : o.formats.date))
        const setDom = (s, text) => { const el = inputEl(s); if (el && el.value !== text) el.value = text }
        const selCls = sel => (sel ? 'border-slate-300 dark:border-slate-600' : 'border-transparent')

        // ---- производное состояние для шаблона (нельзя посчитать в выражениях)
        function refresh(s) {
            if (!s.open) return
            const cur = parseValue(s.value), v = s.view
            s.monthLabel = o.months[v.m]
            s.wdays = Array.from({ length: 7 }, (_, i) => ({ key: 'w' + i, label: o.weekdays[(o.weekStart + i) % 7] }))

            if (s.panel === 'calendar') {
                const offset = (new Date(v.y, v.m, 1).getDay() - o.weekStart + 7) % 7
                const days = []
                for (let i = 0; i < 42; i++) {
                    const dt = new Date(v.y, v.m, 1 - offset + i)
                    const y = dt.getFullYear(), m = dt.getMonth(), d = dt.getDate()
                    const sel = !!cur && cur.y === y && cur.m === m && cur.d === d
                    const out = m !== v.m
                    const iso = String(y).padStart(4, '0') + '-' + pad(m + 1) + '-' + pad(d)
                    days.push({
                        key: iso, iso, n: d, sel,
                        label: dt.toLocaleDateString(o.locale, { day: 'numeric', month: 'long', year: 'numeric' }),
                        cls: sel ? 'bg-black text-white dark:bg-white dark:text-slate-950'
                            : out ? 'text-slate-300 hover:bg-slate-100 dark:text-slate-600 dark:hover:bg-slate-800'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    })
                }
                s.days = days
                s.options = []
            } else {
                s.days = []
                if (s.panel === 'month') {
                    s.options = o.months.map((label, i) => ({ key: 'm' + i, v: i, label, sel: i === v.m, cls: selCls(i === v.m) }))
                } else {
                    const cy = new Date().getFullYear()
                    const lo = Math.min(cy - o.yearsBefore, v.y), hi = Math.max(cy + o.yearsAfter, v.y)
                    const list = []
                    for (let y = lo; y <= hi; y++) list.push({ key: 'y' + y, v: y, label: String(y), sel: y === v.y, cls: selCls(y === v.y) })
                    s.options = list
                }
            }

            if (s.withTime) {
                s.hours = Array.from({ length: 24 }, (_, i) => ({ key: 'h' + i, v: i, label: pad(i), sel: i === s.hour, cls: selCls(i === s.hour), aria: o.labels.hour + ' ' + pad(i) }))
                s.minutes = Array.from({ length: 60 }, (_, i) => ({ key: 'i' + i, v: i, label: pad(i), sel: i === s.minute, cls: selCls(i === s.minute), aria: o.labels.minute + ' ' + pad(i) }))
            }
        }

        // попап вниз или вверх, прокрутка списков к выбранному элементу (после рендера Wex)
        function place(s) {
            const r = rootEl(s), pop = r && r.querySelector('.dp-popup')
            if (!pop) return
            const rect = r.getBoundingClientRect()
            const below = window.innerHeight - rect.bottom, above = rect.top
            const up = below < pop.offsetHeight + 12 && above > below
            const pos = up ? 'bottom-full mb-2' : 'top-full mt-2'
            if (s.pos !== pos) s.pos = pos
        }

        function center(s) {
            const r = rootEl(s)
            if (!r) return
            r.querySelectorAll('.dp-opts, .dp-time').forEach(box => {
                const el = box.querySelector('[data-sel="true"]')
                if (el) box.scrollTop = el.offsetTop - (box.clientHeight - el.offsetHeight) / 2
            })
        }

        const settle = s => after(() => { place(s); center(s) })

        function setPanel(s, panel) {
            s.panel = panel
            refresh(s)
            settle(s)
        }

        // месяц и год, введённые в инпут (если сегменты заполнены), становятся отображаемыми
        function syncViewFromText(s) {
            const el = inputEl(s)
            const v = parseText(fmtOf(s), el ? el.value : s.text)
            let { y, m } = s.view
            if (v.MM >= 1 && v.MM <= 12) m = v.MM - 1
            if (v.yyyy >= 1000) y = v.yyyy
            if (y !== s.view.y || m !== s.view.m) s.view = { y, m }
        }

        function openPopup(s, panel) {
            syncViewFromText(s)
            s.open = true
            s.panel = panel
            refresh(s)
            settle(s)
        }

        // ---- значение
        function setValue(s, view, p) {
            const iso = p ? toIso(p, s.withTime) : ''
            const prev = s.value
            const text = p ? formatP(fmtOf(s), p) : ''
            s._v = iso
            s.value = iso
            s.text = text
            setDom(s, text)
            if (p) { s.view = { y: p.y, m: p.m }; s.hour = p.h; s.minute = p.i }
            refresh(s)
            if (iso !== prev && view && view.emit) view.emit('change', iso)
        }

        // значение пришло снаружи (prop при монтировании или изменение родителем)
        function applyValue(s, raw) {
            const p = parseValue(raw)
            s._v = raw
            s.text = p ? formatP(fmtOf(s), p) : ''
            if (p) { s.view = { y: p.y, m: p.m }; s.hour = p.h; s.minute = p.i }
            setDom(s, s.text)
            refresh(s)
        }

        function pickMonthYear(s, view, val) {
            const y = s.panel === 'year' ? val : s.view.y
            const m = s.panel === 'month' ? val : s.view.m
            const cur = parseValue(s.value)
            s.panel = 'calendar'
            if (cur) setValue(s, view, { y, m, d: Math.min(cur.d, dim(y, m)), h: cur.h, i: cur.i })
            else { s.view = { y, m }; refresh(s) }
        }

        // ---- компонент
        function build(withTime) {
            const tpl = $(template(withTime).trim())
                .state(() => {
                    const now = new Date()
                    return {
                        // props
                        value: '', clickableMonth: o.clickableMonth, clickableYear: o.clickableYear, placeholder: '', format: '',
                        // служебное
                        id: ++uid, withTime, _v: undefined, cm: false, cy: false,
                        text: '', ph: '', open: false, panel: 'calendar', pos: 'top-full mt-2',
                        dialog: withTime ? o.labels.pickDateTime : o.labels.pickDate, L: o.labels,
                        view: { y: now.getFullYear(), m: now.getMonth() }, hour: 0, minute: 0,
                        // производное
                        monthLabel: '', wdays: [], days: [], options: [], hours: [], minutes: []
                    }
                })

                .on('$mount', function (s) {
                    instances.add(s)
                    s.cm = truthy(s.clickableMonth)
                    s.cy = truthy(s.clickableYear)
                    s.ph = s.placeholder || fmtOf(s).parts.map(p => (p.tok ? o.tokenLabels[p.tok] : p.lit)).join('')
                    applyValue(s, s.value)
                })
                .on('$unmount', function (s) { instances.delete(s) })
                .on('$destroy', function (s) { instances.delete(s) })

                // родитель поменял value после монтирования
                .on('$change', function (s) {
                    if (s.value !== s._v) applyValue(s, s.value)
                })

                // клик по инпуту: по сегменту месяца/года (если включено) открывается выбор, иначе весь календарь
                .on('click', '.dp-input', function (s) {
                    return function (e) {
                        const el = e.currentTarget
                        const seg = segmentAt(fmtOf(s), el.selectionStart == null ? 0 : el.selectionStart)
                        let panel = 'calendar'
                        if (seg && seg.tok === 'MM' && s.cm) panel = 'month'
                        else if (seg && seg.tok === 'yyyy' && s.cy) panel = 'year'
                        openPopup(s, panel)
                    }
                })
                .on('click', '.dp-toggle', function (s) {
                    return function () {
                        if (s.open) { s.open = false; s.panel = 'calendar' } else openPopup(s, 'calendar')
                    }
                })

                // ввод по маске: значение меняется, когда дата введена полностью и корректна
                .on('input', '.dp-input', function (s) {
                    const v = this
                    return function (e) {
                        const el = e.currentTarget, f = fmtOf(s)
                        const raw = el.value
                        const caret = el.selectionStart == null ? raw.length : el.selectionStart
                        const before = raw.slice(0, caret).replace(/\D/g, '').length
                        const digits = raw.replace(/\D/g, '').slice(0, f.total)
                        const masked = maskDigits(f, digits)
                        if (el.value !== masked) {
                            el.value = masked
                            if (document.activeElement === el && el.setSelectionRange) { const c = caretFor(masked, before); el.setSelectionRange(c, c) }
                        }
                        if (!digits.length) { if (s.value) setValue(s, v, null); return }
                        if (digits.length === f.total) {
                            const p = toParts(parseText(f, masked), s.withTime)
                            if (p) setValue(s, v, p)
                        }
                    }
                })
                // потеря фокуса: неполная или невалидная дата откатывается к последнему валидному значению
                .on('focusout', '.dp-input', function (s) {
                    return function (e) {
                        const cur = parseValue(s.value)
                        const t = cur ? formatP(fmtOf(s), cur) : ''
                        if (e.currentTarget.value !== t) e.currentTarget.value = t
                        if (s.text !== t) s.text = t
                    }
                })

                // шапка календаря: месяц и год кликабельны всегда
                .on('click', '.dp-month-btn', function (s) { return function () { setPanel(s, 'month') } })
                .on('click', '.dp-year-btn', function (s) { return function () { setPanel(s, 'year') } })
                .on('click', '.dp-nav', function (s) {
                    return function (e) {
                        const step = +e.currentTarget.getAttribute('data-step')
                        const d = new Date(s.view.y, s.view.m + step, 1)
                        s.view = { y: d.getFullYear(), m: d.getMonth() }
                        refresh(s)
                    }
                })
                .on('click', '.dp-opt', function (s) {
                    const v = this
                    return function (e) { pickMonthYear(s, v, +e.currentTarget.getAttribute('data-v')) }
                })

                .on('click', '.dp-day', function (s) {
                    const v = this
                    return function (e) {
                        const [y, m, d] = e.currentTarget.getAttribute('data-iso').split('-').map(Number)
                        s.panel = 'calendar'
                        setValue(s, v, { y, m: m - 1, d, h: s.hour, i: s.minute })
                        if (!s.withTime) s.open = false    // DateTimePicker остаётся открытым: нужно выбрать время
                    }
                })

                // время: пока дата не выбрана, выбор только подсвечивается и применится вместе с днём
                .on('click', '.dp-hour', function (s) {
                    const v = this
                    return function (e) {
                        s.hour = +e.currentTarget.getAttribute('data-v')
                        const cur = parseValue(s.value)
                        if (cur) setValue(s, v, { y: cur.y, m: cur.m, d: cur.d, h: s.hour, i: cur.i })
                        else refresh(s)
                    }
                })
                .on('click', '.dp-minute', function (s) {
                    const v = this
                    return function (e) {
                        s.minute = +e.currentTarget.getAttribute('data-v')
                        const cur = parseValue(s.value)
                        if (cur) setValue(s, v, { y: cur.y, m: cur.m, d: cur.d, h: cur.h, i: s.minute })
                        else refresh(s)
                    }
                })

            return tpl
        }

        component('DatePicker', build(false))
        component('DateTimePicker', build(true))

        // плагин: компоненты регистрируются глобально, для .plugin() достаточно пустого хука
        return function () { return {} }
    }

    global.createDatePicker = createDatePicker
    // для тестов и сборки: чистые утилиты
    createDatePicker._utils = { parseValue, toIso, compile, maskDigits, segmentAt, parseText, toParts, formatP, caretFor }
})(window)