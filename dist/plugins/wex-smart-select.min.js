// src/plugins/smart-select/wex-smart-select.js
/*!
* Wex Select: аналог select2 для Wex. Два режима:
*   select — хранит значение (одно или несколько), чипы, скрытые inputs для форм;
*   search — выбор строки запускает действие (переход / твой onPick), значение не хранится.
*
*   const Product = $(`<template><div class="flex gap-3"><img w-src="row.image" class="h-9 w-9 rounded"><div>{{ row.label }}</div></div></template>`)
*       .state(() => ({ row: null, query: '', selected: false }))     // row обязателен, query/selected по желанию
*
*   createSelect({ tag: 'ProductSearch', mode: 'search', source: '/api/products?q={q}', item: Product,
*                  href: row => row.url, onPick(row, api) { if (!row.inStock) { api.close(); return false } } })
*
*   <ProductSearch placeholder="Find a product" @select="onSelect"></ProductSearch>
*   <Category name="category_id" :value="form.category" @change="onCategory"></Category>
*
* Props экземпляра: name, placeholder, value, disabled. События: @select(row) @change(value) @open @close.
* Зависимости: jQuery, Wex (window.jqvm, window.$wire), утилиты Quas (как в wex-datatable).
*/
(function(global) {
	"use strict";
	const $ = global.jQuery;
	const { component } = global.jqvm;
	const doc = global.document;
	const DEFAULTS = {
		tag: "",
		mode: "select",
		multiple: false,
		key: "id",
		label: "label",
		source: [],
		filter: null,
		minChars: null,
		debounce: null,
		pageSize: 0,
		queryParam: "q",
		pageParam: "page",
		results: null,
		transport: null,
		item: null,
		href: null,
		onPick: null,
		placement: "auto",
		position: "absolute",
		maxHeight: 280,
		minPanelWidth: 0,
		max: 0,
		closeOnSelect: null,
		clearOnPick: null,
		clearable: true,
		autoActive: true,
		activeClass: "bg-blue-50 dark:bg-slate-700",
		selectedClass: "text-blue-700 dark:text-blue-300",
		texts: {
			placeholderSelect: "Select…",
			placeholderSearch: "Search…",
			empty: "No results",
			loading: "Loading…",
			error: "Failed to load",
			typeMore: (n) => "Type at least " + n + " characters",
			max: (n) => "Maximum " + n + " selected",
			clear: "Clear",
			remove: "Remove"
		}
	};
	const LOCAL_KEYS = [
		"minChars",
		"debounce",
		"pageSize",
		"results",
		"queryParam",
		"pageParam",
		"transport",
		"filter"
	];
	function mergeOptions(user) {
		const o = Object.assign({}, DEFAULTS, user);
		o.texts = Object.assign({}, DEFAULTS.texts, user.texts);
		const src = o.source;
		o.src = Array.isArray(src) ? { items: src } : typeof src === "function" ? { fetch: src } : typeof src === "string" ? { url: src } : Object.assign({}, src);
		LOCAL_KEYS.forEach((k) => {
			if (o.src[k] !== void 0) o[k] = o.src[k];
		});
		if (o.mode === "search") o.multiple = false;
		if (o.minChars == null) o.minChars = o.mode === "search" ? 1 : 0;
		if (o.debounce == null) o.debounce = o.src.items ? 0 : 250;
		if (o.closeOnSelect == null) o.closeOnSelect = !o.multiple;
		if (o.clearOnPick == null) o.clearOnPick = o.multiple;
		return o;
	}
	const get = (obj, path) => String(path).split(".").reduce((v, k) => v == null ? v : v[k], obj);
	const copy = (row) => Object.assign({}, row);
	let uid = 0;
	let tagSeq = 0;
	function toPromise(x) {
		if (x && typeof x.then === "function") return Promise.resolve(x);
		if (x && typeof x.done === "function" && typeof x.fail === "function") return new Promise((res, rej) => {
			x.done(res).fail((jq, st) => rej(jq || st));
		});
		return Promise.resolve(x);
	}
	function containingBlock(el) {
		for (let p = el.parentElement; p && p !== doc.documentElement; p = p.parentElement) {
			const cs = global.getComputedStyle(p);
			if (cs.transform && cs.transform !== "none" || cs.perspective && cs.perspective !== "none" || cs.filter && cs.filter !== "none" || cs.backdropFilter && cs.backdropFilter !== "none" || /transform|perspective|filter/.test(cs.willChange || "") || /paint|layout|strict|content/.test(cs.contain || "")) return p;
		}
		return null;
	}
	function buildTemplate(o, itemTag) {
		return `<template>
<div class="wsel relative text-[13px] text-slate-700 dark:text-slate-200" data-sel="{{uid}}">
  <div class="wsel-control flex min-h-[36px] w-full cursor-text flex-wrap items-center gap-1 rounded border bg-white px-2 py-1 dark:bg-slate-800 {{ctrlCls}}">
    <div style="display:contents">
      <span w-for="c in chips traceby c.key" class="inline-flex max-w-full items-center gap-1 rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[12px] dark:border-slate-600 dark:bg-slate-700">
        <span class="truncate">{{ c.label }}</span>
        <button type="button" class="wsel-remove text-slate-500 hover:text-slate-900 dark:hover:text-white" data-key="{{c.key}}" aria-label="{{removeText}}">×</button>
      </span>
    </div>
    <input type="text" class="wsel-input min-w-[80px] flex-1 bg-transparent py-0.5 text-[13px] outline-none" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="{{ariaOpen}}" aria-controls="wsel-list-{{uid}}" aria-activedescendant="{{activeId}}" placeholder="{{ph}}" w-disabled="!!disabled" />
    <button w-if="!!canClear" type="button" class="wsel-clear px-1 text-base leading-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label="{{clearText}}">×</button>
    <svg w-if="!!showCaret" class="wsel-caret h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m5 8 5 5 5-5"/></svg>
  </div>
  <div style="display:none"><input w-for="h in hidden traceby h.key" type="hidden" name="{{h.name}}" value="{{h.value}}" /></div>
  <div w-if="!!open" id="wsel-list-{{uid}}" class="wsel-panel z-30 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 {{pCls}}" style="{{pStyle}}" role="listbox" aria-multiselectable="{{multi}}">
    <div class="wsel-list overflow-y-auto {{dim}}" style="max-height:{{maxH}}px">
      <div w-for="r in rows traceby r.key" id="{{r.id}}" class="wsel-row cursor-pointer px-2 py-1.5 {{r.cls}}" role="option" aria-selected="{{r.sel}}" data-idx="{{r.idx}}">${itemTag ? `<${itemTag} :row="r.row" :query="r.q" :selected="r.sel"></${itemTag}>` : `<div class="flex items-center justify-between gap-2"><span class="truncate">{{ r.label }}</span><span w-if="!!r.sel" class="shrink-0 text-blue-600">✓</span></div>`}</div>
    </div>
    <div w-if="!!status" class="wsel-status px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{{ status }}</div>
    <div w-if="!!note" class="wsel-note border-t border-slate-100 px-3 py-1.5 text-[11px] text-slate-400 dark:border-slate-800">{{ note }}</div>
  </div>
</div>
</template>`;
	}
	function createSelect(user) {
		const o = mergeOptions(user || {});
		const rt = /* @__PURE__ */ new Map();
		let itemTag = "";
		if (o.item) {
			itemTag = "WselItem" + ++tagSeq;
			component(itemTag, o.item);
		}
		const getKey = (row) => String(get(row, o.key));
		const getLabel = (row) => {
			const v = typeof o.label === "function" ? o.label(row) : get(row, o.label);
			return v == null ? "" : String(v);
		};
		const wrapRow = (x) => {
			if (x && typeof x === "object") return x;
			const r = {};
			if (typeof o.key === "string" && o.key.indexOf(".") < 0) r[o.key] = x;
			if (typeof o.label === "string" && o.label.indexOf(".") < 0) r[o.label] = x;
			return r;
		};
		function normalizeValue(value) {
			if (typeof value === "string") {
				const s = value.trim();
				if (!s) return [];
				try {
					value = JSON.parse(s);
				} catch (e) {
					console.warn("[wex-select] value must be a row object, an array of rows, or a JSON string of them");
					return [];
				}
			}
			if (value == null) return [];
			const out = [];
			(Array.isArray(value) ? value : [value]).forEach((x) => {
				if (x && typeof x === "object") out.push(copy(x));
				else console.warn("[wex-select] value must contain rows with a key and a label, got:", x);
			});
			return o.multiple ? out : out.slice(0, 1);
		}
		function bind(state, view) {
			let r = rt.get(state.uid);
			if (!r) {
				r = {
					view: null,
					token: 0,
					timer: 0,
					off: []
				};
				rt.set(state.uid, r);
			}
			if (view) r.view = view;
			return r;
		}
		const rtOf = (state) => rt.get(state.uid) || bind(state);
		const emit = (state, ev, ...args) => {
			const r = rtOf(state);
			if (r.view && r.view.emit) r.view.emit(ev, ...args);
		};
		const qroot = (state) => doc.querySelector("[data-sel=\"" + state.uid + "\"]");
		function release(state) {
			const r = rt.get(state.uid);
			if (!r) return;
			clearTimeout(r.timer);
			r.token++;
			r.off.splice(0).forEach((f) => f());
			rt.delete(state.uid);
		}
		function refresh(state) {
			const selKeys = {};
			state.selected.forEach((r) => {
				selKeys[getKey(r)] = true;
			});
			const first = state.selected[0];
			const selectMode = o.mode === "select";
			const single = selectMode && !o.multiple;
			state.chips = o.multiple ? state.selected.map((r) => ({
				key: getKey(r),
				label: getLabel(r)
			})) : [];
			const nm = state.name;
			state.hidden = !nm || !selectMode ? [] : o.multiple ? state.selected.map((r) => ({
				key: getKey(r),
				name: /\]$/.test(nm) ? nm : nm + "[]",
				value: getKey(r)
			})) : [{
				key: "v",
				name: nm,
				value: first ? getKey(first) : ""
			}];
			state.rows = state.results.map((row, i) => {
				const sel = !!selKeys[getKey(row)];
				return {
					key: state.ver + ":" + i + ":" + (sel ? 1 : 0),
					idx: i,
					row,
					sel,
					q: state.rq,
					label: getLabel(row),
					id: "wsel-" + state.uid + "-" + state.ver + "-" + i + "-" + (sel ? 1 : 0),
					cls: (i === state.active ? o.activeClass : "") + " " + (sel ? o.selectedClass : "")
				};
			});
			state.inputText = single && !state.open && first ? getLabel(first) : state.query;
			const inp = inputOf(state);
			if (inp && inp.value !== state.inputText) inp.value = state.inputText;
			state.ph = o.multiple && state.chips.length ? "" : single && state.open && first ? getLabel(first) : state.placeholder;
			state.canClear = o.clearable && !state.disabled && (selectMode ? state.selected.length > 0 : state.query.length > 0);
			state.showCaret = selectMode && !state.canClear;
			state.ctrlCls = state.open ? "border-blue-400" : "border-slate-300 dark:border-slate-600";
			state.ariaOpen = state.open ? "true" : "false";
			state.multi = o.multiple ? "true" : "false";
			state.activeId = state.open && state.rows[state.active] ? state.rows[state.active].id : "";
			state.dim = state.loading && state.results.length ? "opacity-60" : "";
			state.removeText = o.texts.remove;
			state.clearText = o.texts.clear;
			const q = state.query.trim();
			state.status = state.error ? state.error : q.length < o.minChars ? o.texts.typeMore(o.minChars) : state.loading && !state.results.length ? o.texts.loading : !state.loading && !state.results.length ? o.texts.empty : "";
			state.note = o.max && o.multiple && state.selected.length >= o.max ? o.texts.max(o.max) : "";
			if (o.position === "fixed" && state.pos) {
				const p = state.pos;
				state.pCls = "fixed";
				state.pStyle = "left:" + p.left + "px;width:" + p.width + "px;" + (state.side === "bottom" ? "top:" + p.top + "px" : "bottom:" + p.bottom + "px");
			} else {
				state.pCls = "absolute left-0 w-full " + (state.side === "bottom" ? "top-full mt-1" : "bottom-full mb-1");
				state.pStyle = o.minPanelWidth ? "min-width:" + o.minPanelWidth + "px" : "";
			}
		}
		function place(state) {
			const root = qroot(state);
			if (!root) return;
			const r = (root.querySelector(".wsel-control") || root).getBoundingClientRect();
			const vh = global.innerHeight || doc.documentElement.clientHeight;
			const vw = global.innerWidth || doc.documentElement.clientWidth;
			const gap = 4, pad = 8;
			const below = vh - r.bottom - gap - pad;
			const above = r.top - gap - pad;
			let side = o.placement;
			if (side === "auto") side = below >= Math.min(o.maxHeight, 220) || below >= above ? "bottom" : "top";
			state.side = side;
			state.maxH = Math.max(100, Math.min(o.maxHeight, side === "bottom" ? below : above));
			if (o.position === "fixed") {
				const cb = containingBlock(root);
				const cr = cb ? cb.getBoundingClientRect() : null;
				const ox = cb ? cr.left + cb.clientLeft : 0;
				const oy = cb ? cr.top + cb.clientTop : 0;
				const baseH = cb ? cb.clientHeight : vh;
				const width = Math.max(r.width, o.minPanelWidth);
				const left = Math.max(pad, Math.min(r.left, vw - width - pad));
				state.pos = {
					left: Math.round(left - ox),
					width: Math.round(width),
					top: Math.round(r.bottom + gap - oy),
					bottom: Math.round(oy + baseH - (r.top - gap))
				};
			} else state.pos = null;
		}
		function buildUrl(q, page) {
			let u = o.src.url;
			const hasQ = /\{q\}/.test(u);
			const hasPage = /\{page\}/.test(u);
			u = u.replace(/\{q\}/g, encodeURIComponent(q)).replace(/\{page\}/g, page);
			const add = [];
			if (!hasQ) add.push(encodeURIComponent(o.queryParam) + "=" + encodeURIComponent(q));
			if (o.pageSize && !hasPage) add.push(encodeURIComponent(o.pageParam) + "=" + page);
			return add.length ? u + (u.indexOf("?") < 0 ? "?" : "&") + add.join("&") : u;
		}
		function normalizeResponse(res) {
			let items = res;
			let more;
			if (!Array.isArray(res) && res && typeof res === "object") {
				items = o.results ? get(res, o.results) : Array.isArray(res.items) ? res.items : res.data;
				if (res.more !== void 0) more = !!res.more;
			}
			items = (Array.isArray(items) ? items : []).map(wrapRow);
			if (more === void 0) more = o.pageSize > 0 && items.length >= o.pageSize;
			return {
				items,
				more
			};
		}
		function fetchRows(q, page) {
			if (o.src.items) {
				const needle = q.toLowerCase();
				const f = o.filter || ((row, text) => !text || getLabel(row).toLowerCase().indexOf(text) > -1);
				return Promise.resolve({
					items: o.src.items.map(wrapRow).filter((row) => f(row, needle)),
					more: false
				});
			}
			let req;
			if (o.src.fetch) req = o.src.fetch(q, {
				page,
				pageSize: o.pageSize
			});
			else {
				const url = buildUrl(q, page);
				req = o.transport ? o.transport(url) : new Promise((res, rej) => {
					global.$wire.get(url).done(res).fail((jq, st) => rej(jq || st));
				});
			}
			return toPromise(req).then(normalizeResponse);
		}
		function load(state, page, append) {
			const r = rtOf(state);
			if (!state.open) return;
			const token = ++r.token;
			state.loading = true;
			if (!append) state.error = "";
			refresh(state);
			fetchRows(state.query.trim(), page).then((res) => {
				if (token !== r.token || !state.open) return;
				if (append) state.results = state.results.concat(res.items);
				else {
					state.results = res.items;
					state.ver++;
					state.active = -1;
					if (o.autoActive && res.items.length) {
						state.active = 0;
						if (!o.multiple) {
							const have = {};
							state.selected.forEach((s) => {
								have[getKey(s)] = true;
							});
							const i = res.items.findIndex((x) => have[getKey(x)]);
							if (i > -1) state.active = i;
						}
					}
				}
				state.page = page;
				state.more = res.more;
				state.rq = state.query.trim();
				state.loading = false;
				refresh(state);
				if (!append) setTimeout(() => reveal(state), 40);
			}, (err) => {
				if (token !== r.token) return;
				console.error("[wex-select]", err);
				state.loading = false;
				state.error = o.texts.error;
				refresh(state);
			});
		}
		function loadMore(state) {
			if (state.more && !state.loading && state.open) load(state, state.page + 1, true);
		}
		function scheduleSearch(state, immediate) {
			const r = rtOf(state);
			clearTimeout(r.timer);
			r.token++;
			if (state.query.trim().length < o.minChars) {
				Object.assign(state, {
					results: [],
					more: false,
					loading: false,
					error: "",
					active: -1,
					page: 1,
					rq: state.query.trim()
				});
				state.ver++;
				refresh(state);
				return;
			}
			state.loading = true;
			state.error = "";
			refresh(state);
			r.timer = setTimeout(() => load(state, 1, false), immediate ? 0 : o.debounce);
		}
		function open(state, view) {
			bind(state, view);
			if (state.open || state.disabled) return;
			const r = rtOf(state);
			state.open = true;
			place(state);
			const down = (e) => {
				const root = qroot(state);
				if (root && !root.contains(e.target)) close(state);
			};
			const move = (e) => {
				const t = e.target;
				const root = qroot(state);
				if (t && t.classList && t.classList.contains("wsel-list") && root && root.contains(t)) {
					if (t.scrollTop + t.clientHeight >= t.scrollHeight - 48) loadMore(state);
					return;
				}
				if (state.open) {
					place(state);
					refresh(state);
				}
			};
			doc.addEventListener("mousedown", down, true);
			global.addEventListener("scroll", move, true);
			global.addEventListener("resize", move);
			r.off.push(() => {
				doc.removeEventListener("mousedown", down, true);
				global.removeEventListener("scroll", move, true);
				global.removeEventListener("resize", move);
			});
			scheduleSearch(state, true);
			emit(state, "open");
		}
		function close(state) {
			if (!state.open) return;
			const r = rtOf(state);
			clearTimeout(r.timer);
			r.token++;
			r.off.splice(0).forEach((f) => f());
			state.open = false;
			state.loading = false;
			state.active = -1;
			if (o.mode === "select") state.query = "";
			refresh(state);
			emit(state, "close");
		}
		function reveal(state) {
			if (!state.open || state.active < 0) return;
			const root = qroot(state);
			const list = root && root.querySelector(".wsel-list");
			const el = list && list.querySelector("[data-idx=\"" + state.active + "\"]");
			if (!el) return;
			const lr = list.getBoundingClientRect(), er = el.getBoundingClientRect();
			if (er.top < lr.top) list.scrollTop -= lr.top - er.top;
			else if (er.bottom > lr.bottom) list.scrollTop += er.bottom - lr.bottom;
		}
		function moveActive(state, d) {
			const n = state.results.length;
			if (!n) return;
			let i = state.active < 0 ? d > 0 ? 0 : n - 1 : state.active + d;
			i = Math.abs(d) === 1 ? (i + n) % n : Math.max(0, Math.min(n - 1, i));
			state.active = i;
			refresh(state);
			reveal(state);
			if (o.pageSize && i >= n - 3) loadMore(state);
		}
		const emitChange = (state) => emit(state, "change", o.multiple ? state.selected.map(copy) : state.selected[0] ? copy(state.selected[0]) : null);
		function addRow(state, row) {
			const k = getKey(row);
			if (state.selected.some((r) => getKey(r) === k)) return false;
			if (o.multiple) {
				if (o.max && state.selected.length >= o.max) return false;
				state.selected.push(copy(row));
			} else state.selected = [copy(row)];
			return true;
		}
		function removeRow(state, k) {
			const i = state.selected.findIndex((r) => getKey(r) === String(k));
			if (i < 0) return false;
			state.selected.splice(i, 1);
			return true;
		}
		function clear(state) {
			const had = state.selected.length > 0;
			if (o.mode === "select") state.selected = [];
			state.query = "";
			if (state.open) scheduleSearch(state, true);
			refresh(state);
			if (had && o.mode === "select") emitChange(state);
		}
		function makeApi(state) {
			return {
				get query() {
					return state.query;
				},
				view: rtOf(state).view,
				selected: () => state.selected.map(copy),
				open: () => open(state),
				close: () => close(state),
				clear: () => clear(state),
				reload: () => scheduleSearch(state, true),
				setQuery: (q) => {
					state.query = String(q);
					if (state.open) scheduleSearch(state, true);
					refresh(state);
				},
				select: (row) => {
					if (addRow(state, wrapRow(row))) {
						refresh(state);
						emitChange(state);
						return true;
					}
					return false;
				},
				deselect: (row) => {
					if (removeRow(state, getKey(wrapRow(row)))) {
						refresh(state);
						emitChange(state);
						return true;
					}
					return false;
				}
			};
		}
		function go(url, e) {
			if (e && (e.ctrlKey || e.metaKey)) global.open(url, "_blank");
			else global.location.assign(url);
		}
		function pick(state, view, idx, e) {
			bind(state, view);
			const src = state.results[idx];
			if (!src) return;
			const row = copy(src);
			const cancelled = o.onPick ? o.onPick.call(view, row, makeApi(state), e) === false : false;
			emit(state, "select", row);
			if (cancelled) return;
			if (o.mode === "search") {
				if (o.closeOnSelect) close(state);
				const url = o.href ? o.href(row) : null;
				if (url) go(url, e);
				return;
			}
			let changed;
			if (o.multiple) changed = removeRow(state, getKey(row)) || addRow(state, row);
			else changed = addRow(state, row);
			if (o.clearOnPick && state.query) {
				state.query = "";
				scheduleSearch(state, true);
			}
			refresh(state);
			if (changed) emitChange(state);
			if (o.closeOnSelect) close(state);
		}
		const inputOf = (state) => {
			const root = qroot(state);
			return root && root.querySelector(".wsel-input");
		};
		const view = $(buildTemplate(o, itemTag).trim()).state(() => ({
			name: "",
			placeholder: "",
			value: null,
			disabled: false,
			uid: ++uid,
			query: "",
			rq: "",
			open: false,
			loading: false,
			error: "",
			results: [],
			selected: [],
			active: -1,
			more: false,
			page: 1,
			ver: 0,
			side: "bottom",
			maxH: o.maxHeight,
			pos: null,
			rows: [],
			chips: [],
			hidden: [],
			inputText: "",
			ph: "",
			canClear: false,
			showCaret: false,
			ctrlCls: "border-slate-300 dark:border-slate-600",
			ariaOpen: "false",
			multi: "false",
			activeId: "",
			dim: "",
			status: "",
			note: "",
			pCls: "",
			pStyle: "",
			removeText: "",
			clearText: ""
		})).on("$mount", function(state) {
			bind(state, this);
			state.selected = normalizeValue(state.value);
			if (!state.placeholder) state.placeholder = o.mode === "search" ? o.texts.placeholderSearch : o.texts.placeholderSelect;
			refresh(state);
		}).on("$unmount", function(state) {
			release(state);
		}).on("$destroy", function(state) {
			release(state);
		}).on("input", ".wsel-input", function(state) {
			const v = this;
			return function(e) {
				if (state.disabled) return;
				bind(state, v);
				state.query = e.currentTarget.value;
				if (!state.open) open(state, v);
				else scheduleSearch(state, false);
				refresh(state);
			};
		}).on("keydown", ".wsel-input", function(state) {
			const v = this;
			return function(e) {
				if (state.disabled) return;
				bind(state, v);
				switch (e.key) {
					case "ArrowDown":
					case "ArrowUp":
						e.preventDefault();
						if (!state.open) open(state, v);
						else moveActive(state, e.key === "ArrowDown" ? 1 : -1);
						break;
					case "PageDown":
					case "PageUp":
						if (state.open) {
							e.preventDefault();
							moveActive(state, e.key === "PageDown" ? 5 : -5);
						}
						break;
					case "Enter":
						if (state.open) {
							e.preventDefault();
							if (state.active >= 0) pick(state, v, state.active, e);
						}
						break;
					case "Escape":
						if (state.open) {
							e.preventDefault();
							e.stopPropagation();
							close(state);
						}
						break;
					case "Tab":
						close(state);
						break;
					case "Backspace": if (o.multiple && !state.query && state.selected.length) {
						state.selected.pop();
						refresh(state);
						emitChange(state);
					}
				}
			};
		}).on("focusout", ".wsel-input", function(state) {
			return function(e) {
				const root = qroot(state);
				const next = e.relatedTarget;
				if (state.open && root && !(next && root.contains(next))) close(state);
			};
		}).on("mousedown", ".wsel-control", function() {
			return function(e) {
				if (e.target.tagName !== "INPUT") e.preventDefault();
			};
		}).on("mousedown", ".wsel-panel", function() {
			return function(e) {
				e.preventDefault();
			};
		}).on("click", ".wsel-control", function(state) {
			const v = this;
			return function(e) {
				if (state.disabled || $(e.target).closest(".wsel-remove, .wsel-clear").length) return;
				const input = inputOf(state);
				if (input) input.focus();
				if (state.open && e.target.tagName !== "INPUT") close(state);
				else open(state, v);
			};
		}).on("click", ".wsel-remove", function(state) {
			const v = this;
			return function(e) {
				bind(state, v);
				if (state.disabled) return;
				if (removeRow(state, e.currentTarget.getAttribute("data-key"))) {
					refresh(state);
					emitChange(state);
				}
				const input = inputOf(state);
				if (input) input.focus();
			};
		}).on("click", ".wsel-clear", function(state) {
			const v = this;
			return function() {
				bind(state, v);
				clear(state);
				const input = inputOf(state);
				if (input) input.focus();
			};
		}).on("mousemove", ".wsel-row", function(state) {
			return function(e) {
				const i = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
				if (i !== state.active) {
					state.active = i;
					refresh(state);
				}
			};
		}).on("click", ".wsel-row", function(state) {
			const v = this;
			return function(e) {
				pick(state, v, parseInt(e.currentTarget.getAttribute("data-idx"), 10), e);
			};
		});
		if (o.tag) component(o.tag, view);
		return view;
	}
	global.createSelect = createSelect;
})(window);
