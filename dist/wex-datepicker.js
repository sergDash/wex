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
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
  'use strict';

  var $ = global.jQuery;
  var component = global.jqvm.component;

  // ---------------------------------------------------------------- опции

  var DEFAULTS = {
    clickableMonth: false,
    // клик по месяцу В ИНПУТЕ открывает выбор месяца (в шапке календаря работает всегда)
    clickableYear: false,
    // то же для года
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    // порядок как у Date.getDay(): с воскресенья
    weekStart: 1,
    // первый день недели: 1 = понедельник, 0 = воскресенье
    locale: 'ru-RU',
    // только для aria-label дней
    yearsBefore: 60,
    // диапазон списка годов: от текущего года минус N
    yearsAfter: 60,
    // ... до текущего года плюс N (расширяется, если значение вне диапазона)
    // формат отображения в инпуте. Токены: dd, MM (месяц), yyyy, HH, mm (минуты)
    formats: {
      date: 'dd/MM/yyyy',
      datetime: 'dd/MM/yyyy HH:mm'
    },
    tokenLabels: {
      dd: 'дд',
      MM: 'мм',
      yyyy: 'гггг',
      HH: 'чч',
      mm: 'мм'
    },
    // для placeholder
    labels: {
      prevMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      toggle: 'Открыть календарь',
      pickDate: 'Выбор даты',
      pickDateTime: 'Выбор даты и времени',
      hour: 'Час',
      minute: 'Минута',
      months: 'Месяцы',
      years: 'Годы'
    }
  };
  function mergeOptions(user) {
    var o = Object.assign({}, DEFAULTS, user);
    ['formats', 'tokenLabels', 'labels'].forEach(function (k) {
      o[k] = Object.assign({}, DEFAULTS[k], user[k]);
    });
    return o;
  }

  // ---------------------------------------------------------------- чистые утилиты

  var TOKENS = {
    dd: 2,
    MM: 2,
    yyyy: 4,
    HH: 2,
    mm: 2
  };
  var has = function has(obj, k) {
    return Object.prototype.hasOwnProperty.call(obj, k);
  };
  var pad = function pad(n) {
    return String(n).padStart(2, '0');
  };
  var dim = function dim(y, m) {
    return new Date(y, m + 1, 0).getDate();
  };
  var truthy = function truthy(x) {
    return x === true || x === 'true' || x === '' || x === 1 || x === '1';
  };
  var after = function after(fn) {
    return setTimeout(fn, 50);
  };

  // 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DDTHH:mm' -> { y, m(0-11), d, h, i } | null
  function parseValue(v) {
    var r = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/.exec(String(v == null ? '' : v).trim());
    if (!r) return null;
    var p = {
      y: +r[1],
      m: +r[2] - 1,
      d: +r[3],
      h: +(r[4] || 0),
      i: +(r[5] || 0)
    };
    if (p.y < 1000 || p.m < 0 || p.m > 11 || p.d < 1 || p.d > dim(p.y, p.m) || p.h > 23 || p.i > 59) return null;
    return p;
  }
  var toIso = function toIso(p, withTime) {
    return String(p.y).padStart(4, '0') + '-' + pad(p.m + 1) + '-' + pad(p.d) + (withTime ? ' ' + pad(p.h) + ':' + pad(p.i) : '');
  };
  var FMT = {};
  function compile(fmt) {
    if (FMT[fmt]) return FMT[fmt];
    var parts = fmt.split(/(dd|MM|yyyy|HH|mm)/).filter(Boolean).map(function (s) {
      return has(TOKENS, s) ? {
        tok: s,
        len: TOKENS[s]
      } : {
        lit: s
      };
    });
    var total = 0,
      pos = 0;
    var segs = [];
    parts.forEach(function (p) {
      if (p.tok) {
        total += p.len;
        segs.push({
          tok: p.tok,
          from: pos,
          to: pos + p.len
        });
        pos += p.len;
      } else pos += p.lit.length;
    });
    return FMT[fmt] = {
      parts: parts,
      total: total,
      segs: segs
    };
  }

  // цифры -> маска. Разделитель добавляется только когда за ним есть следующая цифра
  function maskDigits(f, digits) {
    var out = '',
      i = 0;
    var _iterator = _createForOfIteratorHelper(f.parts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;
        if (p.tok) {
          var chunk = digits.substr(i, p.len);
          if (!chunk) break;
          out += chunk;
          i += chunk.length;
          if (chunk.length < p.len) break;
        } else if (i < digits.length) out += p.lit;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return out;
  }

  // позиция каретки -> сегмент маски (граница относится к левому сегменту, разделитель к правому)
  function segmentAt(f, pos) {
    var _iterator2 = _createForOfIteratorHelper(f.segs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var s = _step2.value;
        if (pos <= s.to) return s;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return f.segs[f.segs.length - 1];
  }
  var caretFor = function caretFor(masked, n) {
    if (!n) return 0;
    var c = 0;
    for (var i = 0; i < masked.length; i++) if (/\d/.test(masked[i]) && ++c === n) return i + 1;
    return masked.length;
  };

  // текст -> значения полностью заполненных сегментов
  function parseText(f, text) {
    var digits = String(text || '').replace(/\D/g, '');
    var v = {};
    var i = 0;
    f.parts.forEach(function (p) {
      if (!p.tok) return;
      var c = digits.substr(i, p.len);
      i += p.len;
      if (c.length === p.len) v[p.tok] = +c;
    });
    return v;
  }
  function toParts(v, withTime) {
    if (v.dd == null || v.MM == null || v.yyyy == null) return null;
    if (withTime && (v.HH == null || v.mm == null)) return null;
    var p = {
      y: v.yyyy,
      m: v.MM - 1,
      d: v.dd,
      h: withTime ? v.HH : 0,
      i: withTime ? v.mm : 0
    };
    if (p.y < 1000 || p.m < 0 || p.m > 11 || p.d < 1 || p.d > dim(p.y, p.m) || p.h > 23 || p.i > 59) return null;
    return p;
  }
  var formatP = function formatP(f, p) {
    var val = {
      dd: p.d,
      MM: p.m + 1,
      yyyy: p.y,
      HH: p.h,
      mm: p.i
    };
    return f.parts.map(function (x) {
      return x.tok ? String(val[x.tok]).padStart(x.len, '0') : x.lit;
    }).join('');
  };

  // ---------------------------------------------------------------- стили, глобальные слушатели

  function injectCss() {
    if (document.getElementById('wex-datepicker-css')) return;
    var st = document.createElement('style');
    st.id = 'wex-datepicker-css';
    st.textContent = "\n.dp-hide-sb{scrollbar-width:none;-ms-overflow-style:none}\n.dp-hide-sb::-webkit-scrollbar{display:none}\n.dp-popup{animation:dp-pop .14s ease-out}\n@keyframes dp-pop{from{opacity:0;transform:translateY(-4px)}}";
    document.head.appendChild(st);
  }
  var instances = new Set();
  var listening = false;
  var rootEl = function rootEl(s) {
    return document.querySelector('[data-dp="' + s.id + '"]');
  };
  var inputEl = function inputEl(s) {
    var r = rootEl(s);
    return r && r.querySelector('.dp-input');
  };
  var uid = 0;
  function listen() {
    if (listening) return;
    listening = true;
    document.addEventListener('scroll', function (e) {
      var b = e.target;
      if (!b || !b.classList || !b.classList.contains('dp-time')) return;
      if (b._busy && Date.now() < b._busy) return; // не ломаем плавную прокрутку
      var it = b.querySelectorAll('button');
      if (it.length < 3) return;
      var p = it[it.length / 3].offsetTop - it[0].offsetTop;
      if (b.scrollTop < p) b.scrollTop += p;else if (b.scrollTop >= 2 * p) b.scrollTop -= p;
    }, true);

    // клик вне компонента закрывает попап
    document.addEventListener('pointerdown', function (e) {
      instances.forEach(function (s) {
        if (s.open && !(e.target.closest && e.target.closest('[data-dp="' + s.id + '"]'))) {
          s.open = false;
          s.panel = 'calendar';
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      instances.forEach(function (s) {
        if (!s.open) return;
        s.open = false;
        s.panel = 'calendar';
        var r = rootEl(s),
          el = inputEl(s);
        if (r && el && r.contains(document.activeElement)) el.focus();
      });
    });
  }

  // ---------------------------------------------------------------- шаблон

  var CARD = 'rounded-lg border border-slate-100 bg-white shadow-[0_2px_7px_rgba(15,23,42,.12)] dark:border-slate-700 dark:bg-slate-900';
  var OPT = 'h-[31px] w-full rounded border text-sm font-semibold text-slate-500 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800';
  var NAV = 'dp-nav rounded-md p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
  var HEAD_BTN = 'rounded px-1.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800';
  function timeCol(kind, list) {
    return "<div class=\"dp-time dp-hide-sb relative h-[220px] w-[78px] shrink-0 snap-y snap-mandatory overflow-y-auto overscroll-contain touch-pan-y ".concat(CARD, " p-1.5\">\n      <button w-for=\"t in ").concat(list, " traceby t.key\" type=\"button\" class=\"dp-").concat(kind, " snap-center my-0.5 ").concat(OPT, " {{ t.cls }}\" data-v=\"{{ t.v }}\" data-sel=\"{{ t.sel }}\" aria-label=\"{{ t.aria }}\" aria-pressed=\"{{ t.sel }}\">{{ t.label }}</button>\n    </div>");
  }
  function template(withTime) {
    return "<template>\n<div class=\"dp-root relative w-full max-w-[288px]\" data-dp=\"{{ id }}\">\n  <div class=\"relative\">\n    <input type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" class=\"dp-input min-h-[40px] w-full rounded-md border border-slate-100 bg-white px-3 pr-9 text-[13px] text-slate-600 shadow-[0_2px_7px_rgba(15,23,42,.08)] outline-none transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300\" w-value=\"text\" placeholder=\"{{ ph }}\" aria-haspopup=\"dialog\" aria-expanded=\"{{ open }}\" />\n    <button type=\"button\" class=\"dp-toggle absolute right-0 top-0 flex h-full w-9 items-center justify-center text-slate-400\" aria-label=\"{{ L.toggle }}\"><svg class=\"h-4 w-4\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"m7 10 5 5 5-5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></button>\n  </div>\n\n  <div w-if=\"open\" class=\"dp-popup absolute left-0 z-30 flex w-max max-w-[calc(100vw-2rem)] flex-wrap items-start gap-2 {{ pos }}\" role=\"dialog\" aria-label=\"{{ dialog }}\">\n\n    <div w-if=\"panel==='calendar'\" class=\"dp-panel ".concat(CARD, " w-[288px] p-2.5\">\n      <div class=\"flex h-10 items-center justify-between border-b border-slate-100 px-1 dark:border-slate-700\">\n        <button type=\"button\" class=\"").concat(NAV, "\" data-step=\"-1\" aria-label=\"{{ L.prevMonth }}\"><svg class=\"h-3.5 w-3.5\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"m15 18-6-6 6-6\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></button>\n        <div class=\"flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400\">\n          <button type=\"button\" class=\"dp-month-btn ").concat(HEAD_BTN, "\">{{ monthLabel }}</button>\n          <button type=\"button\" class=\"dp-year-btn ").concat(HEAD_BTN, "\">{{ view.y }}</button>\n        </div>\n        <button type=\"button\" class=\"").concat(NAV, "\" data-step=\"1\" aria-label=\"{{ L.nextMonth }}\"><svg class=\"h-3.5 w-3.5\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"m9 18 6-6-6-6\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></button>\n      </div>\n      <div class=\"grid grid-cols-7 text-center\">\n        <div w-for=\"wd in wdays traceby wd.key\" class=\"py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400\">{{ wd.label }}</div>\n        <button w-for=\"d in days traceby d.key\" type=\"button\" class=\"dp-day mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition focus-visible:ring-2 focus-visible:ring-slate-400 {{ d.cls }}\" data-iso=\"{{ d.iso }}\" aria-label=\"{{ d.label }}\" aria-pressed=\"{{ d.sel }}\">{{ d.n }}</button>\n      </div>\n    </div>\n\n    <div w-if=\"panel!=='calendar'\" class=\"dp-panel dp-opts relative h-[311px] w-[288px] overflow-y-auto ").concat(CARD, " p-2.5\" role=\"listbox\" aria-label=\"{{ panel==='month' ? L.months : L.years }}\">\n      <div class=\"grid gap-1\">\n        <button w-for=\"o in options traceby o.key\" type=\"button\" class=\"dp-opt ").concat(OPT, " {{ o.cls }}\" data-v=\"{{ o.v }}\" data-sel=\"{{ o.sel }}\" role=\"option\" aria-selected=\"{{ o.sel }}\">{{ o.label }}</button>\n      </div>\n    </div>\n    ").concat(withTime ? timeCol('hour', 'hours') + timeCol('minute', 'minutes') : '', "\n  </div>\n</div>\n</template>");
  }

  // ---------------------------------------------------------------- фабрика

  function createDatePicker(userOptions) {
    var o = mergeOptions(userOptions || {});
    injectCss();
    listen();
    var fmtOf = function fmtOf(s) {
      return compile(s.format || (s.withTime ? o.formats.datetime : o.formats.date));
    };
    var setDom = function setDom(s, text) {
      var el = inputEl(s);
      if (el && el.value !== text) el.value = text;
    };
    var selCls = function selCls(sel) {
      return sel ? 'border-slate-300 dark:border-slate-600' : 'border-transparent';
    };

    // ---- производное состояние для шаблона (нельзя посчитать в выражениях)
    function refresh(s) {
      if (!s.open) return;
      var cur = parseValue(s.value),
        v = s.view;
      s.monthLabel = o.months[v.m];
      s.wdays = Array.from({
        length: 7
      }, function (_, i) {
        return {
          key: 'w' + i,
          label: o.weekdays[(o.weekStart + i) % 7]
        };
      });
      if (s.panel === 'calendar') {
        var offset = (new Date(v.y, v.m, 1).getDay() - o.weekStart + 7) % 7;
        var days = [];
        for (var i = 0; i < 42; i++) {
          var dt = new Date(v.y, v.m, 1 - offset + i);
          var y = dt.getFullYear(),
            m = dt.getMonth(),
            d = dt.getDate();
          var sel = !!cur && cur.y === y && cur.m === m && cur.d === d;
          var out = m !== v.m;
          var iso = String(y).padStart(4, '0') + '-' + pad(m + 1) + '-' + pad(d);
          days.push({
            key: iso,
            iso: iso,
            n: d,
            sel: sel,
            label: dt.toLocaleDateString(o.locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            cls: sel ? 'bg-black text-white dark:bg-white dark:text-slate-950' : out ? 'text-slate-300 hover:bg-slate-100 dark:text-slate-600 dark:hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          });
        }
        s.days = days;
        s.options = [];
      } else {
        s.days = [];
        if (s.panel === 'month') {
          s.options = o.months.map(function (label, i) {
            return {
              key: 'm' + i,
              v: i,
              label: label,
              sel: i === v.m,
              cls: selCls(i === v.m)
            };
          });
        } else {
          var cy = new Date().getFullYear();
          var lo = Math.min(cy - o.yearsBefore, v.y),
            hi = Math.max(cy + o.yearsAfter, v.y);
          var list = [];
          for (var _y = lo; _y <= hi; _y++) list.push({
            key: 'y' + _y,
            v: _y,
            label: String(_y),
            sel: _y === v.y,
            cls: selCls(_y === v.y)
          });
          s.options = list;
        }
      }
      if (s.withTime) {
        var rep = function rep(n, kind, cur, label) {
          var a = [];
          for (var c = 0; c < 3; c++) for (var _i = 0; _i < n; _i++) a.push({
            key: kind + c + '_' + _i,
            v: _i,
            label: pad(_i),
            sel: _i === cur,
            cls: selCls(_i === cur),
            aria: label + ' ' + pad(_i)
          });
          return a;
        };
        s.hours = rep(24, 'h', s.hour, o.labels.hour);
        s.minutes = rep(60, 'i', s.minute, o.labels.minute);
      }
    }

    // попап вниз или вверх, прокрутка списков к выбранному элементу (после рендера Wex)
    var POPUP_H = 320; // высота календаря
    function place(s) {
      var r = rootEl(s);
      if (!r) return;
      var rect = r.getBoundingClientRect();
      var below = window.innerHeight - rect.bottom,
        above = rect.top;
      var pos = below < POPUP_H + 12 && above > below ? 'bottom-full mb-2' : 'top-full mt-2';
      if (s.pos !== pos) s.pos = pos;
    }
    function center(s, smooth) {
      var r = rootEl(s);
      if (!r) return;
      r.querySelectorAll('.dp-opts, .dp-time').forEach(function (box) {
        var list = box.querySelectorAll('[data-sel="true"]');
        if (!list.length) return;
        var isTime = box.classList.contains('dp-time');
        var el = list[0];
        if (isTime) {
          var mid = box.scrollTop + box.clientHeight / 2;
          var dist = function dist(n) {
            return Math.abs(n.offsetTop + n.offsetHeight / 2 - mid);
          };
          el = smooth ? _toConsumableArray(list).reduce(function (a, b) {
            return dist(a) <= dist(b) ? a : b;
          }) : list[1] || list[0];
        }
        var top = el.offsetTop - (box.clientHeight - el.offsetHeight) / 2;
        if (smooth) box._busy = Date.now() + 500;
        box.scrollTo({
          top: top,
          behavior: smooth ? 'smooth' : 'instant'
        });
      });
    }
    var nextFrame = function nextFrame(fn) {
      return requestAnimationFrame(function () {
        return requestAnimationFrame(fn);
      });
    };

    // dx = 0: кроссфейд; dx = ±1: слайд в сторону
    function transition(s, mutate, dx) {
      var r = rootEl(s);
      var old = r && r.querySelector('.dp-panel');
      if (!old || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        mutate();
        nextFrame(function () {
          return center(s);
        });
        return;
      }
      var rect = old.getBoundingClientRect();
      var ghost = old.cloneNode(true);
      Object.assign(ghost.style, {
        position: 'fixed',
        left: rect.left + 'px',
        top: rect.top + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        margin: '0',
        zIndex: '9999',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      });
      document.body.appendChild(ghost);
      var kill = function kill() {
        return ghost.remove();
      };
      setTimeout(kill, 700);
      mutate();
      nextFrame(function () {
        center(s); // список уже прокручен к выбранному, пока его закрывает призрак
        var cur = (rootEl(s) || document).querySelector('.dp-panel');
        var opt = {
          duration: 200,
          easing: 'cubic-bezier(.2,.7,.2,1)'
        };
        var shift = dx * 18;
        ghost.animate([{
          opacity: 1,
          transform: 'none'
        }, {
          opacity: 0,
          transform: dx ? "translateX(".concat(-shift, "px)") : 'scale(1.02)'
        }], _objectSpread(_objectSpread({}, opt), {}, {
          fill: 'forwards'
        })).onfinish = kill;
        if (cur) cur.animate([{
          transform: dx ? "translateX(".concat(shift, "px)") : 'scale(.98)'
        }, {
          transform: 'none'
        }], opt);
      });
    }
    var settle = function settle(s) {
      return after(function () {
        place(s);
        center(s);
      });
    };
    function setPanel(s, panel) {
      transition(s, function () {
        s.panel = panel;
        refresh(s);
      }, 0);
    }

    // месяц и год, введённые в инпут (если сегменты заполнены), становятся отображаемыми
    function syncViewFromText(s) {
      var el = inputEl(s);
      var v = parseText(fmtOf(s), el ? el.value : s.text);
      var _s$view = s.view,
        y = _s$view.y,
        m = _s$view.m;
      if (v.MM >= 1 && v.MM <= 12) m = v.MM - 1;
      if (v.yyyy >= 1000) y = v.yyyy;
      if (y !== s.view.y || m !== s.view.m) s.view = {
        y: y,
        m: m
      };
    }
    function openPopup(s, panel) {
      syncViewFromText(s);
      s.open = true;
      s.panel = panel;
      refresh(s);
      settle(s);
    }

    // ---- значение
    function setValue(s, view, p) {
      var iso = p ? toIso(p, s.withTime) : '';
      var prev = s.value;
      var text = p ? formatP(fmtOf(s), p) : '';
      s._v = iso;
      s.value = iso;
      s.text = text;
      setDom(s, text);
      if (p) {
        s.view = {
          y: p.y,
          m: p.m
        };
        s.hour = p.h;
        s.minute = p.i;
      }
      refresh(s);
      if (iso !== prev && view && view.emit) view.emit('change', iso);
    }

    // значение пришло снаружи (prop при монтировании или изменение родителем)
    function applyValue(s, raw) {
      var p = parseValue(raw);
      s._v = raw;
      s.text = p ? formatP(fmtOf(s), p) : '';
      if (p) {
        s.view = {
          y: p.y,
          m: p.m
        };
        s.hour = p.h;
        s.minute = p.i;
      }
      setDom(s, s.text);
      refresh(s);
    }
    function pickMonthYear(s, view, val) {
      var y = s.panel === 'year' ? val : s.view.y;
      var m = s.panel === 'month' ? val : s.view.m;
      var cur = parseValue(s.value);
      transition(s, function () {
        s.panel = 'calendar';
        if (cur) setValue(s, view, {
          y: y,
          m: m,
          d: Math.min(cur.d, dim(y, m)),
          h: cur.h,
          i: cur.i
        });else {
          s.view = {
            y: y,
            m: m
          };
          refresh(s);
        }
      }, 0);
    }

    // ---- компонент
    function build(withTime) {
      var tpl = $(template(withTime).trim()).state(function () {
        var now = new Date();
        return {
          // props
          value: '',
          clickableMonth: o.clickableMonth,
          clickableYear: o.clickableYear,
          placeholder: '',
          format: '',
          // служебное
          id: ++uid,
          withTime: withTime,
          _v: undefined,
          cm: false,
          cy: false,
          text: '',
          ph: '',
          open: false,
          panel: 'calendar',
          pos: 'top-full mt-2',
          dialog: withTime ? o.labels.pickDateTime : o.labels.pickDate,
          L: o.labels,
          view: {
            y: now.getFullYear(),
            m: now.getMonth()
          },
          hour: 0,
          minute: 0,
          // производное
          monthLabel: '',
          wdays: [],
          days: [],
          options: [],
          hours: [],
          minutes: []
        };
      }).on('$mount', function (s) {
        instances.add(s);
        s.cm = truthy(s.clickableMonth);
        s.cy = truthy(s.clickableYear);
        s.ph = s.placeholder || fmtOf(s).parts.map(function (p) {
          return p.tok ? o.tokenLabels[p.tok] : p.lit;
        }).join('');
        applyValue(s, s.value);
      }).on('$unmount', function (s) {
        instances["delete"](s);
      }).on('$destroy', function (s) {
        instances["delete"](s);
      })

      // родитель поменял value после монтирования
      .on('$change', function (s) {
        if (s.value !== s._v) applyValue(s, s.value);
      })

      // клик по инпуту: по сегменту месяца/года (если включено) открывается выбор, иначе весь календарь
      .on('click', '.dp-input', function (s) {
        return function (e) {
          var el = e.currentTarget;
          var seg = segmentAt(fmtOf(s), el.selectionStart == null ? 0 : el.selectionStart);
          var panel = 'calendar';
          if (seg && seg.tok === 'MM' && s.cm) panel = 'month';else if (seg && seg.tok === 'yyyy' && s.cy) panel = 'year';
          openPopup(s, panel);
        };
      }).on('click', '.dp-toggle', function (s) {
        return function () {
          if (s.open) {
            s.open = false;
            s.panel = 'calendar';
          } else openPopup(s, 'calendar');
        };
      })

      // ввод по маске: значение меняется, когда дата введена полностью и корректна
      .on('input', '.dp-input', function (s) {
        var v = this;
        return function (e) {
          var el = e.currentTarget,
            f = fmtOf(s);
          var raw = el.value;
          var caret = el.selectionStart == null ? raw.length : el.selectionStart;
          var before = raw.slice(0, caret).replace(/\D/g, '').length;
          var digits = raw.replace(/\D/g, '').slice(0, f.total);
          var masked = maskDigits(f, digits);
          if (el.value !== masked) {
            el.value = masked;
            if (document.activeElement === el && el.setSelectionRange) {
              var c = caretFor(masked, before);
              el.setSelectionRange(c, c);
            }
          }
          if (!digits.length) {
            if (s.value) setValue(s, v, null);
            return;
          }
          if (digits.length === f.total) {
            var p = toParts(parseText(f, masked), s.withTime);
            if (p) setValue(s, v, p);
          }
        };
      })
      // потеря фокуса: неполная или невалидная дата откатывается к последнему валидному значению
      .on('focusout', '.dp-input', function (s) {
        return function (e) {
          var cur = parseValue(s.value);
          var t = cur ? formatP(fmtOf(s), cur) : '';
          if (e.currentTarget.value !== t) e.currentTarget.value = t;
          if (s.text !== t) s.text = t;
        };
      })

      // шапка календаря: месяц и год кликабельны всегда
      .on('click', '.dp-month-btn', function (s) {
        return function () {
          setPanel(s, 'month');
        };
      }).on('click', '.dp-year-btn', function (s) {
        return function () {
          setPanel(s, 'year');
        };
      }).on('click', '.dp-nav', function (s) {
        return function (e) {
          var step = +e.currentTarget.getAttribute('data-step');
          transition(s, function () {
            var d = new Date(s.view.y, s.view.m + step, 1);
            s.view = {
              y: d.getFullYear(),
              m: d.getMonth()
            };
            refresh(s);
          }, step);
        };
      }).on('click', '.dp-opt', function (s) {
        var v = this;
        return function (e) {
          pickMonthYear(s, v, +e.currentTarget.getAttribute('data-v'));
        };
      }).on('click', '.dp-day', function (s) {
        var v = this;
        return function (e) {
          var _e$currentTarget$getA = e.currentTarget.getAttribute('data-iso').split('-').map(Number),
            _e$currentTarget$getA2 = _slicedToArray(_e$currentTarget$getA, 3),
            y = _e$currentTarget$getA2[0],
            m = _e$currentTarget$getA2[1],
            d = _e$currentTarget$getA2[2];
          s.panel = 'calendar';
          setValue(s, v, {
            y: y,
            m: m - 1,
            d: d,
            h: s.hour,
            i: s.minute
          });
          if (!s.withTime) s.open = false; // DateTimePicker остаётся открытым: нужно выбрать время
        };
      })

      // время: пока дата не выбрана, выбор только подсвечивается и применится вместе с днём
      .on('click', '.dp-hour', function (s) {
        var v = this;
        return function (e) {
          s.hour = +e.currentTarget.getAttribute('data-v');
          var cur = parseValue(s.value);
          if (cur) {
            setValue(s, v, {
              y: cur.y,
              m: cur.m,
              d: cur.d,
              h: s.hour,
              i: cur.i
            });
            nextFrame(function () {
              return center(s, true);
            });
          } else refresh(s);
        };
      }).on('click', '.dp-minute', function (s) {
        var v = this;
        return function (e) {
          s.minute = +e.currentTarget.getAttribute('data-v');
          var cur = parseValue(s.value);
          if (cur) {
            setValue(s, v, {
              y: cur.y,
              m: cur.m,
              d: cur.d,
              h: cur.h,
              i: s.minute
            });
            nextFrame(function () {
              return center(s, true);
            });
          } else refresh(s);
        };
      });
      return tpl;
    }
    component('DatePicker', build(false));
    component('DateTimePicker', build(true));

    // плагин: компоненты регистрируются глобально, для .plugin() достаточно пустого хука
    return function () {
      return {};
    };
  }
  global.createDatePicker = createDatePicker;
  // для тестов и сборки: чистые утилиты
  createDatePicker._utils = {
    parseValue: parseValue,
    toIso: toIso,
    compile: compile,
    maskDigits: maskDigits,
    segmentAt: segmentAt,
    parseText: parseText,
    toParts: toParts,
    formatP: formatP,
    caretFor: caretFor
  };
})(window);

/***/ })
/******/ ]);