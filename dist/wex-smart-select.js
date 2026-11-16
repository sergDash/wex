/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
(function (global) {
  'use strict';

  var $ = global.jQuery;
  var component = global.jqvm.component;
  var doc = global.document;

  // ---------------------------------------------------------------- опции

  var DEFAULTS = {
    tag: '',
    // если задан — компонент регистрируется глобально: <Tag></Tag>
    mode: 'select',
    // select | search
    multiple: false,
    // только для select
    key: 'id',
    // поле-идентификатор строки (путь через точку допустим)
    label: 'label',
    // поле с текстом ИЛИ функция row => string (чипы, инпут, дефолтная строка)

    // источник: массив строк | row-функция (q, { page, pageSize }) => массив | { items, more } | Promise
    //           | 'url?q={q}' | { url | items | fetch, + любые из ключей ниже }
    source: [],
    filter: null,
    // (row, q) => bool, для массива; по умолчанию label содержит q
    minChars: null,
    // null: select 0, search 1
    debounce: null,
    // мс; null: массив 0, остальное 250
    pageSize: 0,
    // >0: подгрузка при прокрутке; в url {page} или ?page=, в fetch ctx.page
    queryParam: 'q',
    // имя параметра, если в url нет {q}
    pageParam: 'page',
    results: null,
    // путь к массиву в ответе; null: сам ответ, иначе .items, иначе .data
    transport: null,
    // url => thenable | jqXHR | $wire-цепочка. По умолчанию $wire.get

    item: null,
    // Wex-view рендерера строки (state: row, query, selected). null: label текстом
    href: null,
    // search: row => url
    onPick: null,
    // function (row, api, event); return false = отменить действие по умолчанию

    placement: 'auto',
    // auto | top | bottom
    position: 'absolute',
    // absolute | fixed (для блоков с overflow: hidden, модалок)
    maxHeight: 280,
    minPanelWidth: 0,
    max: 0,
    // лимит выбора (multiple)
    closeOnSelect: null,
    // null: !multiple
    clearOnPick: null,
    // сбросить поисковый текст после выбора; null: multiple
    clearable: true,
    autoActive: true,
    // подсвечивать первую (или выбранную) строку после загрузки
    activeClass: 'bg-blue-50 dark:bg-slate-700',
    selectedClass: 'text-blue-700 dark:text-blue-300',
    texts: {
      placeholderSelect: 'Select…',
      placeholderSearch: 'Search…',
      empty: 'No results',
      loading: 'Loading…',
      error: 'Failed to load',
      typeMore: function typeMore(n) {
        return 'Type at least ' + n + ' characters';
      },
      max: function max(n) {
        return 'Maximum ' + n + ' selected';
      },
      clear: 'Clear',
      remove: 'Remove'
    }
  };
  var LOCAL_KEYS = ['minChars', 'debounce', 'pageSize', 'results', 'queryParam', 'pageParam', 'transport', 'filter'];
  function mergeOptions(user) {
    var o = Object.assign({}, DEFAULTS, user);
    o.texts = Object.assign({}, DEFAULTS.texts, user.texts);
    var src = o.source;
    o.src = Array.isArray(src) ? {
      items: src
    } : typeof src === 'function' ? {
      fetch: src
    } : typeof src === 'string' ? {
      url: src
    } : Object.assign({}, src);
    LOCAL_KEYS.forEach(function (k) {
      if (o.src[k] !== undefined) o[k] = o.src[k];
    });
    if (o.mode === 'search') o.multiple = false;
    if (o.minChars == null) o.minChars = o.mode === 'search' ? 1 : 0;
    if (o.debounce == null) o.debounce = o.src.items ? 0 : 250;
    if (o.closeOnSelect == null) o.closeOnSelect = !o.multiple;
    if (o.clearOnPick == null) o.clearOnPick = o.multiple;
    return o;
  }

  // ---------------------------------------------------------------- утилиты

  var get = function get(obj, path) {
    return String(path).split('.').reduce(function (v, k) {
      return v == null ? v : v[k];
    }, obj);
  };
  var copy = function copy(row) {
    return Object.assign({}, row);
  };
  var uid = 0;
  var tagSeq = 0;
  function toPromise(x) {
    if (x && typeof x.then === 'function') return Promise.resolve(x);
    // $wire-цепочка: у неё есть done/fail, но нет then
    if (x && typeof x.done === 'function' && typeof x.fail === 'function') {
      return new Promise(function (res, rej) {
        x.done(res).fail(function (jq, st) {
          return rej(jq || st);
        });
      });
    }
    return Promise.resolve(x);
  }

  // fixed внутри предка с transform/filter позиционируется относительно него, а не окна
  function containingBlock(el) {
    for (var p = el.parentElement; p && p !== doc.documentElement; p = p.parentElement) {
      var cs = global.getComputedStyle(p);
      if (cs.transform && cs.transform !== 'none' || cs.perspective && cs.perspective !== 'none' || cs.filter && cs.filter !== 'none' || cs.backdropFilter && cs.backdropFilter !== 'none' || /transform|perspective|filter/.test(cs.willChange || '') || /paint|layout|strict|content/.test(cs.contain || '')) return p;
    }
    return null;
  }

  // ---------------------------------------------------------------- шаблон

  function buildTemplate(o, itemTag) {
    var item = itemTag ? "<".concat(itemTag, " :row=\"r.row\" :query=\"r.q\" :selected=\"r.sel\"></").concat(itemTag, ">") : "<div class=\"flex items-center justify-between gap-2\"><span class=\"truncate\">{{ r.label }}</span><span w-if=\"!!r.sel\" class=\"shrink-0 text-blue-600\">\u2713</span></div>";
    return "<template>\n<div class=\"wsel relative text-[13px] text-slate-700 dark:text-slate-200\" data-sel=\"{{uid}}\">\n  <div class=\"wsel-control flex min-h-[36px] w-full cursor-text flex-wrap items-center gap-1 rounded border bg-white px-2 py-1 dark:bg-slate-800 {{ctrlCls}}\">\n    <div style=\"display:contents\">\n      <span w-for=\"c in chips traceby c.key\" class=\"inline-flex max-w-full items-center gap-1 rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[12px] dark:border-slate-600 dark:bg-slate-700\">\n        <span class=\"truncate\">{{ c.label }}</span>\n        <button type=\"button\" class=\"wsel-remove text-slate-500 hover:text-slate-900 dark:hover:text-white\" data-key=\"{{c.key}}\" aria-label=\"{{removeText}}\">\xD7</button>\n      </span>\n    </div>\n    <input type=\"text\" class=\"wsel-input min-w-[80px] flex-1 bg-transparent py-0.5 text-[13px] outline-none\" autocomplete=\"off\" spellcheck=\"false\" role=\"combobox\" aria-autocomplete=\"list\" aria-haspopup=\"listbox\" aria-expanded=\"{{ariaOpen}}\" aria-controls=\"wsel-list-{{uid}}\" aria-activedescendant=\"{{activeId}}\" placeholder=\"{{ph}}\" w-disabled=\"!!disabled\" />\n    <button w-if=\"!!canClear\" type=\"button\" class=\"wsel-clear px-1 text-base leading-none text-slate-400 hover:text-slate-700 dark:hover:text-slate-200\" aria-label=\"{{clearText}}\">\xD7</button>\n    <svg w-if=\"!!showCaret\" class=\"wsel-caret h-4 w-4 shrink-0 text-slate-400\" viewBox=\"0 0 20 20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><path d=\"m5 8 5 5 5-5\"/></svg>\n  </div>\n  <div style=\"display:none\"><input w-for=\"h in hidden traceby h.key\" type=\"hidden\" name=\"{{h.name}}\" value=\"{{h.value}}\" /></div>\n  <div w-if=\"!!open\" id=\"wsel-list-{{uid}}\" class=\"wsel-panel z-30 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 {{pCls}}\" style=\"{{pStyle}}\" role=\"listbox\" aria-multiselectable=\"{{multi}}\">\n    <div class=\"wsel-list overflow-y-auto {{dim}}\" style=\"max-height:{{maxH}}px\">\n      <div w-for=\"r in rows traceby r.key\" id=\"{{r.id}}\" class=\"wsel-row cursor-pointer px-2 py-1.5 {{r.cls}}\" role=\"option\" aria-selected=\"{{r.sel}}\" data-idx=\"{{r.idx}}\">".concat(item, "</div>\n    </div>\n    <div w-if=\"!!status\" class=\"wsel-status px-3 py-2 text-xs text-slate-500 dark:text-slate-400\">{{ status }}</div>\n    <div w-if=\"!!note\" class=\"wsel-note border-t border-slate-100 px-3 py-1.5 text-[11px] text-slate-400 dark:border-slate-800\">{{ note }}</div>\n  </div>\n</div>\n</template>");
  }

  // ---------------------------------------------------------------- фабрика

  function createSelect(user) {
    var o = mergeOptions(user || {});
    var rt = new Map(); // uid -> { view, token, timer, off[] }: то, что не должно быть реактивным

    var itemTag = '';
    if (o.item) {
      itemTag = 'WselItem' + ++tagSeq;
      component(itemTag, o.item);
    }

    // ---- строки и значение
    var getKey = function getKey(row) {
      return String(get(row, o.key));
    };
    var getLabel = function getLabel(row) {
      var v = typeof o.label === 'function' ? o.label(row) : get(row, o.label);
      return v == null ? '' : String(v);
    };
    var wrapRow = function wrapRow(x) {
      if (x && _typeof(x) === 'object') return x;
      var r = {};
      if (typeof o.key === 'string' && o.key.indexOf('.') < 0) r[o.key] = x;
      if (typeof o.label === 'string' && o.label.indexOf('.') < 0) r[o.label] = x;
      return r;
    };
    function normalizeValue(value) {
      if (typeof value === 'string') {
        var s = value.trim();
        if (!s) return [];
        try {
          value = JSON.parse(s);
        } catch (e) {
          console.warn('[wex-select] value must be a row object, an array of rows, or a JSON string of them');
          return [];
        }
      }
      if (value == null) return [];
      var out = [];
      (Array.isArray(value) ? value : [value]).forEach(function (x) {
        if (x && _typeof(x) === 'object') out.push(copy(x));else console.warn('[wex-select] value must contain rows with a key and a label, got:', x);
      });
      return o.multiple ? out : out.slice(0, 1);
    }

    // ---- рантайм экземпляра
    function bind(state, view) {
      var r = rt.get(state.uid);
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
    var rtOf = function rtOf(state) {
      return rt.get(state.uid) || bind(state);
    };
    var emit = function emit(state, ev) {
      var _r$view;
      var r = rtOf(state);
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      if (r.view && r.view.emit) (_r$view = r.view).emit.apply(_r$view, [ev].concat(args));
    };
    var qroot = function qroot(state) {
      return doc.querySelector('[data-sel="' + state.uid + '"]');
    };
    function release(state) {
      var r = rt.get(state.uid);
      if (!r) return;
      clearTimeout(r.timer);
      r.token++;
      r.off.splice(0).forEach(function (f) {
        return f();
      });
      rt["delete"](state.uid);
    }

    // ---- производное состояние (то, что нельзя посчитать в выражениях шаблона)
    function refresh(state) {
      var selKeys = {};
      state.selected.forEach(function (r) {
        selKeys[getKey(r)] = true;
      });
      var first = state.selected[0];
      var selectMode = o.mode === 'select';
      var single = selectMode && !o.multiple;
      state.chips = o.multiple ? state.selected.map(function (r) {
        return {
          key: getKey(r),
          label: getLabel(r)
        };
      }) : [];
      var nm = state.name;
      state.hidden = !nm || !selectMode ? [] : o.multiple ? state.selected.map(function (r) {
        return {
          key: getKey(r),
          name: /\]$/.test(nm) ? nm : nm + '[]',
          value: getKey(r)
        };
      }) : [{
        key: 'v',
        name: nm,
        value: first ? getKey(first) : ''
      }];

      // ключ строки включает версию выдачи и флаг выбора: пересоздание = свежие props у рендерера
      state.rows = state.results.map(function (row, i) {
        var sel = !!selKeys[getKey(row)];
        return {
          key: state.ver + ':' + i + ':' + (sel ? 1 : 0),
          idx: i,
          row: row,
          sel: sel,
          q: state.rq,
          label: getLabel(row),
          id: 'wsel-' + state.uid + '-' + state.ver + '-' + i + '-' + (sel ? 1 : 0),
          cls: (i === state.active ? o.activeClass : '') + ' ' + (sel ? o.selectedClass : '')
        };
      });
      state.inputText = single && !state.open && first ? getLabel(first) : state.query;
      var inp = inputOf(state);
      if (inp && inp.value !== state.inputText) inp.value = state.inputText;
      state.ph = o.multiple && state.chips.length ? '' : single && state.open && first ? getLabel(first) : state.placeholder;
      state.canClear = o.clearable && !state.disabled && (selectMode ? state.selected.length > 0 : state.query.length > 0);
      state.showCaret = selectMode && !state.canClear;
      state.ctrlCls = state.open ? 'border-blue-400' : 'border-slate-300 dark:border-slate-600';
      state.ariaOpen = state.open ? 'true' : 'false';
      state.multi = o.multiple ? 'true' : 'false';
      state.activeId = state.open && state.rows[state.active] ? state.rows[state.active].id : '';
      state.dim = state.loading && state.results.length ? 'opacity-60' : '';
      state.removeText = o.texts.remove;
      state.clearText = o.texts.clear;
      var q = state.query.trim();
      state.status = state.error ? state.error : q.length < o.minChars ? o.texts.typeMore(o.minChars) : state.loading && !state.results.length ? o.texts.loading : !state.loading && !state.results.length ? o.texts.empty : '';
      state.note = o.max && o.multiple && state.selected.length >= o.max ? o.texts.max(o.max) : '';
      if (o.position === 'fixed' && state.pos) {
        var p = state.pos;
        state.pCls = 'fixed';
        state.pStyle = 'left:' + p.left + 'px;width:' + p.width + 'px;' + (state.side === 'bottom' ? 'top:' + p.top + 'px' : 'bottom:' + p.bottom + 'px');
      } else {
        state.pCls = 'absolute left-0 w-full ' + (state.side === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1');
        state.pStyle = o.minPanelWidth ? 'min-width:' + o.minPanelWidth + 'px' : '';
      }
    }

    // ---- позиция панели
    function place(state) {
      var root = qroot(state);
      if (!root) return;
      var ctrl = root.querySelector('.wsel-control') || root;
      var r = ctrl.getBoundingClientRect();
      var vh = global.innerHeight || doc.documentElement.clientHeight;
      var vw = global.innerWidth || doc.documentElement.clientWidth;
      var gap = 4,
        pad = 8;
      var below = vh - r.bottom - gap - pad;
      var above = r.top - gap - pad;
      var side = o.placement;
      if (side === 'auto') side = below >= Math.min(o.maxHeight, 220) || below >= above ? 'bottom' : 'top';
      state.side = side;
      state.maxH = Math.max(100, Math.min(o.maxHeight, side === 'bottom' ? below : above));
      if (o.position === 'fixed') {
        var cb = containingBlock(root);
        var cr = cb ? cb.getBoundingClientRect() : null;
        var ox = cb ? cr.left + cb.clientLeft : 0;
        var oy = cb ? cr.top + cb.clientTop : 0;
        var baseH = cb ? cb.clientHeight : vh;
        var width = Math.max(r.width, o.minPanelWidth);
        var left = Math.max(pad, Math.min(r.left, vw - width - pad));
        state.pos = {
          left: Math.round(left - ox),
          width: Math.round(width),
          top: Math.round(r.bottom + gap - oy),
          bottom: Math.round(oy + baseH - (r.top - gap))
        };
      } else {
        state.pos = null;
      }
    }

    // ---- запрос / ответ
    function buildUrl(q, page) {
      var u = o.src.url;
      var hasQ = /\{q\}/.test(u);
      var hasPage = /\{page\}/.test(u);
      u = u.replace(/\{q\}/g, encodeURIComponent(q)).replace(/\{page\}/g, page);
      var add = [];
      if (!hasQ) add.push(encodeURIComponent(o.queryParam) + '=' + encodeURIComponent(q));
      if (o.pageSize && !hasPage) add.push(encodeURIComponent(o.pageParam) + '=' + page);
      return add.length ? u + (u.indexOf('?') < 0 ? '?' : '&') + add.join('&') : u;
    }
    function normalizeResponse(res) {
      var items = res;
      var more;
      if (!Array.isArray(res) && res && _typeof(res) === 'object') {
        items = o.results ? get(res, o.results) : Array.isArray(res.items) ? res.items : res.data;
        if (res.more !== undefined) more = !!res.more;
      }
      items = (Array.isArray(items) ? items : []).map(wrapRow);
      if (more === undefined) more = o.pageSize > 0 && items.length >= o.pageSize;
      return {
        items: items,
        more: more
      };
    }
    function fetchRows(q, page) {
      if (o.src.items) {
        var needle = q.toLowerCase();
        var f = o.filter || function (row, text) {
          return !text || getLabel(row).toLowerCase().indexOf(text) > -1;
        };
        return Promise.resolve({
          items: o.src.items.map(wrapRow).filter(function (row) {
            return f(row, needle);
          }),
          more: false
        });
      }
      var req;
      if (o.src.fetch) {
        req = o.src.fetch(q, {
          page: page,
          pageSize: o.pageSize
        });
      } else {
        var url = buildUrl(q, page);
        req = o.transport ? o.transport(url) : new Promise(function (res, rej) {
          global.$wire.get(url).done(res).fail(function (jq, st) {
            return rej(jq || st);
          });
        });
      }
      return toPromise(req).then(normalizeResponse);
    }
    function load(state, page, append) {
      var r = rtOf(state);
      if (!state.open) return;
      var token = ++r.token;
      state.loading = true;
      if (!append) state.error = '';
      refresh(state);
      fetchRows(state.query.trim(), page).then(function (res) {
        if (token !== r.token || !state.open) return;
        if (append) {
          state.results = state.results.concat(res.items);
        } else {
          state.results = res.items;
          state.ver++;
          state.active = -1;
          if (o.autoActive && res.items.length) {
            state.active = 0;
            if (!o.multiple) {
              var have = {};
              state.selected.forEach(function (s) {
                have[getKey(s)] = true;
              });
              var i = res.items.findIndex(function (x) {
                return have[getKey(x)];
              });
              if (i > -1) state.active = i;
            }
          }
        }
        state.page = page;
        state.more = res.more;
        state.rq = state.query.trim();
        state.loading = false;
        refresh(state);
        if (!append) setTimeout(function () {
          return reveal(state);
        }, 40);
      }, function (err) {
        if (token !== r.token) return;
        console.error('[wex-select]', err);
        state.loading = false;
        state.error = o.texts.error;
        refresh(state);
      });
    }
    function loadMore(state) {
      if (state.more && !state.loading && state.open) load(state, state.page + 1, true);
    }
    function scheduleSearch(state, immediate) {
      var r = rtOf(state);
      clearTimeout(r.timer);
      r.token++;
      if (state.query.trim().length < o.minChars) {
        Object.assign(state, {
          results: [],
          more: false,
          loading: false,
          error: '',
          active: -1,
          page: 1,
          rq: state.query.trim()
        });
        state.ver++;
        refresh(state);
        return;
      }
      state.loading = true;
      state.error = '';
      refresh(state);
      r.timer = setTimeout(function () {
        return load(state, 1, false);
      }, immediate ? 0 : o.debounce);
    }

    // ---- открыть / закрыть
    function _open(state, view) {
      bind(state, view);
      if (state.open || state.disabled) return;
      var r = rtOf(state);
      state.open = true;
      place(state);
      var down = function down(e) {
        var root = qroot(state);
        if (root && !root.contains(e.target)) _close(state);
      };
      var move = function move(e) {
        var t = e.target;
        var root = qroot(state);
        if (t && t.classList && t.classList.contains('wsel-list') && root && root.contains(t)) {
          if (t.scrollTop + t.clientHeight >= t.scrollHeight - 48) loadMore(state);
          return;
        }
        if (state.open) {
          place(state);
          refresh(state);
        }
      };
      doc.addEventListener('mousedown', down, true);
      global.addEventListener('scroll', move, true);
      global.addEventListener('resize', move);
      r.off.push(function () {
        doc.removeEventListener('mousedown', down, true);
        global.removeEventListener('scroll', move, true);
        global.removeEventListener('resize', move);
      });
      scheduleSearch(state, true);
      emit(state, 'open');
    }
    function _close(state) {
      if (!state.open) return;
      var r = rtOf(state);
      clearTimeout(r.timer);
      r.token++;
      r.off.splice(0).forEach(function (f) {
        return f();
      });
      state.open = false;
      state.loading = false;
      state.active = -1;
      if (o.mode === 'select') state.query = '';
      refresh(state);
      emit(state, 'close');
    }

    // прокрутить активную строку в видимую область (строка уже в DOM: активность — только класс)
    function reveal(state) {
      if (!state.open || state.active < 0) return;
      var root = qroot(state);
      var list = root && root.querySelector('.wsel-list');
      var el = list && list.querySelector('[data-idx="' + state.active + '"]');
      if (!el) return;
      var lr = list.getBoundingClientRect(),
        er = el.getBoundingClientRect();
      if (er.top < lr.top) list.scrollTop -= lr.top - er.top;else if (er.bottom > lr.bottom) list.scrollTop += er.bottom - lr.bottom;
    }
    function moveActive(state, d) {
      var n = state.results.length;
      if (!n) return;
      var i = state.active < 0 ? d > 0 ? 0 : n - 1 : state.active + d;
      i = Math.abs(d) === 1 ? (i + n) % n : Math.max(0, Math.min(n - 1, i));
      state.active = i;
      refresh(state);
      reveal(state);
      if (o.pageSize && i >= n - 3) loadMore(state);
    }

    // ---- значение
    var emitChange = function emitChange(state) {
      return emit(state, 'change', o.multiple ? state.selected.map(copy) : state.selected[0] ? copy(state.selected[0]) : null);
    };
    function addRow(state, row) {
      var k = getKey(row);
      if (state.selected.some(function (r) {
        return getKey(r) === k;
      })) return false;
      if (o.multiple) {
        if (o.max && state.selected.length >= o.max) return false;
        state.selected.push(copy(row));
      } else {
        state.selected = [copy(row)];
      }
      return true;
    }
    function removeRow(state, k) {
      var i = state.selected.findIndex(function (r) {
        return getKey(r) === String(k);
      });
      if (i < 0) return false;
      state.selected.splice(i, 1);
      return true;
    }
    function _clear(state) {
      var had = state.selected.length > 0;
      if (o.mode === 'select') state.selected = [];
      state.query = '';
      if (state.open) scheduleSearch(state, true);
      refresh(state);
      if (had && o.mode === 'select') emitChange(state);
    }
    function makeApi(state) {
      return {
        get query() {
          return state.query;
        },
        view: rtOf(state).view,
        selected: function selected() {
          return state.selected.map(copy);
        },
        open: function open() {
          return _open(state);
        },
        close: function close() {
          return _close(state);
        },
        clear: function clear() {
          return _clear(state);
        },
        reload: function reload() {
          return scheduleSearch(state, true);
        },
        setQuery: function setQuery(q) {
          state.query = String(q);
          if (state.open) scheduleSearch(state, true);
          refresh(state);
        },
        select: function select(row) {
          if (addRow(state, wrapRow(row))) {
            refresh(state);
            emitChange(state);
            return true;
          }
          return false;
        },
        deselect: function deselect(row) {
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
      if (e && (e.ctrlKey || e.metaKey)) global.open(url, '_blank');else global.location.assign(url);
    }
    function pick(state, view, idx, e) {
      bind(state, view);
      var src = state.results[idx];
      if (!src) return;
      var row = copy(src);
      var cancelled = o.onPick ? o.onPick.call(view, row, makeApi(state), e) === false : false;
      emit(state, 'select', row);
      if (cancelled) return;
      if (o.mode === 'search') {
        if (o.closeOnSelect) _close(state);
        var url = o.href ? o.href(row) : null;
        if (url) go(url, e);
        return;
      }
      var changed;
      if (o.multiple) changed = removeRow(state, getKey(row)) || addRow(state, row);else changed = addRow(state, row);
      if (o.clearOnPick && state.query) {
        state.query = '';
        scheduleSearch(state, true);
      }
      refresh(state);
      if (changed) emitChange(state);
      if (o.closeOnSelect) _close(state);
    }
    var inputOf = function inputOf(state) {
      var root = qroot(state);
      return root && root.querySelector('.wsel-input');
    };

    // ---- компонент
    var view = $(buildTemplate(o, itemTag).trim()).state(function () {
      return {
        // props
        name: '',
        placeholder: '',
        value: null,
        disabled: false,
        // данные
        uid: ++uid,
        query: '',
        rq: '',
        open: false,
        loading: false,
        error: '',
        results: [],
        selected: [],
        active: -1,
        more: false,
        page: 1,
        ver: 0,
        side: 'bottom',
        maxH: o.maxHeight,
        pos: null,
        // производное
        rows: [],
        chips: [],
        hidden: [],
        inputText: '',
        ph: '',
        canClear: false,
        showCaret: false,
        ctrlCls: 'border-slate-300 dark:border-slate-600',
        ariaOpen: 'false',
        multi: 'false',
        activeId: '',
        dim: '',
        status: '',
        note: '',
        pCls: '',
        pStyle: '',
        removeText: '',
        clearText: ''
      };
    }).on('$mount', function (state) {
      bind(state, this);
      state.selected = normalizeValue(state.value);
      if (!state.placeholder) state.placeholder = o.mode === 'search' ? o.texts.placeholderSearch : o.texts.placeholderSelect;
      refresh(state);
    }).on('$unmount', function (state) {
      release(state);
    }).on('$destroy', function (state) {
      release(state);
    })

    // ввод текста
    .on('input', '.wsel-input', function (state) {
      var v = this;
      return function (e) {
        if (state.disabled) return;
        bind(state, v);
        state.query = e.currentTarget.value;
        if (!state.open) _open(state, v);else scheduleSearch(state, false);
        refresh(state);
      };
    })

    // клавиатура
    .on('keydown', '.wsel-input', function (state) {
      var v = this;
      return function (e) {
        if (state.disabled) return;
        bind(state, v);
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            e.preventDefault();
            if (!state.open) _open(state, v);else moveActive(state, e.key === 'ArrowDown' ? 1 : -1);
            break;
          case 'PageDown':
          case 'PageUp':
            if (state.open) {
              e.preventDefault();
              moveActive(state, e.key === 'PageDown' ? 5 : -5);
            }
            break;
          case 'Enter':
            if (state.open) {
              e.preventDefault();
              if (state.active >= 0) pick(state, v, state.active, e);
            }
            break;
          case 'Escape':
            if (state.open) {
              e.preventDefault();
              e.stopPropagation();
              _close(state);
            }
            break;
          case 'Tab':
            _close(state);
            break;
          case 'Backspace':
            if (o.multiple && !state.query && state.selected.length) {
              state.selected.pop();
              refresh(state);
              emitChange(state);
            }
            break;
        }
      };
    })

    // фокус ушёл вне компонента (Tab, программный focus())
    .on('focusout', '.wsel-input', function (state) {
      return function (e) {
        var root = qroot(state);
        var next = e.relatedTarget;
        if (state.open && root && !(next && root.contains(next))) _close(state);
      };
    })

    // клик по контролу: открыть/закрыть, фокус в инпут
    .on('mousedown', '.wsel-control', function () {
      return function (e) {
        if (e.target.tagName !== 'INPUT') e.preventDefault();
      };
    }).on('mousedown', '.wsel-panel', function () {
      return function (e) {
        e.preventDefault();
      }; // не уводим фокус из инпута
    }).on('click', '.wsel-control', function (state) {
      var v = this;
      return function (e) {
        if (state.disabled || $(e.target).closest('.wsel-remove, .wsel-clear').length) return;
        var input = inputOf(state);
        if (input) input.focus();
        if (state.open && e.target.tagName !== 'INPUT') _close(state);else _open(state, v);
      };
    }).on('click', '.wsel-remove', function (state) {
      var v = this;
      return function (e) {
        bind(state, v);
        if (state.disabled) return;
        if (removeRow(state, e.currentTarget.getAttribute('data-key'))) {
          refresh(state);
          emitChange(state);
        }
        var input = inputOf(state);
        if (input) input.focus();
      };
    }).on('click', '.wsel-clear', function (state) {
      var v = this;
      return function () {
        bind(state, v);
        _clear(state);
        var input = inputOf(state);
        if (input) input.focus();
      };
    })

    // строки результата
    .on('mousemove', '.wsel-row', function (state) {
      return function (e) {
        var i = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        if (i !== state.active) {
          state.active = i;
          refresh(state);
        }
      };
    }).on('click', '.wsel-row', function (state) {
      var v = this;
      return function (e) {
        pick(state, v, parseInt(e.currentTarget.getAttribute('data-idx'), 10), e);
      };
    });
    if (o.tag) component(o.tag, view);
    return view;
  }
  global.createSelect = createSelect;
})(window);

/***/ })
/******/ ]);