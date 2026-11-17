(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WexDoc"] = factory();
	else
		root["WexDoc"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FORMATS", function() { return FORMATS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "esc", function() { return esc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "safeUrl", function() { return safeUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classOk", function() { return classOk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emptyDoc", function() { return emptyDoc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDoc", function() { return isDoc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return clone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stable", function() { return stable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addStyle", function() { return addStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "protect", function() { return protect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerNode", function() { return registerNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderNode", function() { return renderNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderNodes", function() { return renderNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderChildren", function() { return renderChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderDoc", function() { return renderDoc; });
/* harmony import */ var _wex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// wex.doc.js
// Схема документа (JSON) и рендер JSON → HTML.
// Без зависимостей. Редактор не нужен: файл можно подключать отдельно на публичных страницах.
// Подключать после wex.js.
//
//   <div w-doc="post.body"></div>
//
// Схема (первая итерация):
//   { root: { type: 'root', children: [ блоки ] } }
//   блоки:   heading { tag: 'h1'..'h6' }, paragraph; у обоих: align, meta, children
//   inline:  text { text, format: ['bold','italic','underline','strikethrough','code','subscript','superscript'] },
//            link { url, children }, linebreak
//   meta:    { classes: ['text-sm', ...] }  необязательное, только для рендера в UI


var FORMATS = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript'];
var FORMAT_TAG = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  strikethrough: 's',
  code: 'code',
  subscript: 'sub',
  superscript: 'sup'
};
var ALIGNS = ['left', 'center', 'right', 'justify'];

// ---------- утилиты ----------

var esc = function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c];
  });
};

// пропускаем только http(s), mailto, tel и относительные адреса; javascript: и прочее отбрасываем
function safeUrl(url) {
  var u = String(url == null ? '' : url).trim();
  var probe = u.replace(/[\u0000-\u0020\u007f-\u009f]/g, '');
  if (!probe) return null;
  if (/^[a-z][a-z0-9+.\-]*:/i.test(probe)) {
    return /^(https?|mailto|tel):/i.test(probe) ? probe : null;
  }
  return u.replace(/[\u0000-\u001f\u007f-\u009f]/g, '');
}

// классы из meta.classes: только безопасные токены (Quas/Tailwind-подобные)
var CLASS_RE = /^[\w\-:\/\[\].%#!(),]+$/;
var classOk = function classOk(c) {
  return typeof c === 'string' && CLASS_RE.test(c);
};
var emptyDoc = function emptyDoc() {
  return {
    root: {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: []
      }]
    }
  };
};
var isDoc = function isDoc(d) {
  return !!(d && d.root && Array.isArray(d.root.children));
};
var clone = function clone(v) {
  return JSON.parse(JSON.stringify(v));
};

// JSON с отсортированными ключами: одинаковые документы дают одинаковую строку
var stable = function stable(v) {
  return JSON.stringify(v == null ? null : v, function (k, x) {
    return x && _typeof(x) === 'object' && !Array.isArray(x) ? Object.keys(x).sort().reduce(function (o, key) {
      return o[key] = x[key], o;
    }, {}) : x;
  });
};
function addStyle(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  var s = document.createElement('style');
  s.id = id;
  var nonce = window.Quas && window.Quas.CSSNonce;
  if (nonce) s.nonce = nonce;
  s.textContent = css;
  document.head.appendChild(s);
}

// Wex при каждом рендере сверяет детей элемента с шаблоном и удаляет «лишних».
// Эта заглушка заставляет diff пропустить содержимое элемента (см. diffAndPatchNode в wex.js:
// ветка `current.__jQvmComponent`) и вызывает onDestroy, когда элемент убирают из DOM.
function protect(el, onDestroy) {
  el.__jQvmComponent = {
    __cancelled: false,
    update: function update() {},
    unmount: function unmount() {
      if (onDestroy) onDestroy();
    }
  };
}

// ---------- рендер ----------

var NODES = {};

// registerNode('image', (node, ctx) => '<img ...>') — так подключаются новые типы узлов
function registerNode(type, fn) {
  NODES[type] = fn;
}
function renderNode(node, ctx) {
  var fn = node && NODES[node.type];
  return fn ? fn(node, ctx || {}) : '';
}
var renderNodes = function renderNodes(nodes, ctx) {
  return (Array.isArray(nodes) ? nodes : []).map(function (n) {
    return renderNode(n, ctx);
  }).join('');
};
var renderChildren = function renderChildren(node, ctx) {
  return renderNodes(node.children, ctx);
};
var classAttr = function classAttr(meta) {
  var list = meta && Array.isArray(meta.classes) ? meta.classes.filter(classOk) : [];
  return list.length ? " class=\"".concat(esc(list.join(' ')), "\"") : '';
};
var alignAttr = function alignAttr(a) {
  return ALIGNS.includes(a) ? " style=\"text-align:".concat(a, "\"") : '';
};
registerNode('root', function (n, ctx) {
  return renderChildren(n, ctx);
});
registerNode('paragraph', function (n, ctx) {
  return "<p".concat(classAttr(n.meta)).concat(alignAttr(n.align), ">").concat(renderChildren(n, ctx) || '<br>', "</p>");
});
registerNode('heading', function (n, ctx) {
  var tag = /^h[1-6]$/.test(n.tag) ? n.tag : 'h2';
  return "<".concat(tag).concat(classAttr(n.meta)).concat(alignAttr(n.align), ">").concat(renderChildren(n, ctx) || '<br>', "</").concat(tag, ">");
});
registerNode('text', function (n) {
  var html = esc(n.text == null ? '' : n.text);
  var format = Array.isArray(n.format) ? n.format : [];
  for (var _i = 0, _FORMATS = FORMATS; _i < _FORMATS.length; _i++) {
    var f = _FORMATS[_i];
    if (format.includes(f)) html = "<".concat(FORMAT_TAG[f], ">").concat(html, "</").concat(FORMAT_TAG[f], ">");
  }
  return html;
});
registerNode('linebreak', function () {
  return '<br>';
});
registerNode('link', function (n, ctx) {
  var url = safeUrl(n.url);
  var inner = renderChildren(n, ctx);
  return url ? "<a href=\"".concat(esc(url), "\" rel=\"noopener noreferrer\"").concat(classAttr(n.meta), ">").concat(inner, "</a>") : inner;
});
function renderDoc(doc) {
  return isDoc(doc) ? renderNode(doc.root, {}) : '';
}

// ---------- стили контента (общие для редактора и вывода) ----------
// :where() сбрасывает специфичность, чтобы meta.classes (Quas-утилиты) всегда выигрывали

addStyle('wxe-doc', "\n:where(.wxe-doc){line-height:1.7}\n:where(.wxe-doc) h1{font-size:2rem;line-height:1.2;font-weight:700;margin:1.2em 0 .5em}\n:where(.wxe-doc) h2{font-size:1.5rem;line-height:1.3;font-weight:700;margin:1.1em 0 .5em}\n:where(.wxe-doc) h3{font-size:1.25rem;line-height:1.4;font-weight:600;margin:1em 0 .4em}\n:where(.wxe-doc) h4,:where(.wxe-doc) h5,:where(.wxe-doc) h6{font-weight:600;margin:1em 0 .4em}\n:where(.wxe-doc) p{margin:.75em 0}\n:where(.wxe-doc) a{color:#2563eb;text-decoration:underline}\nhtml.dark :where(.wxe-doc) a{color:#60a5fa}\n:where(.wxe-doc) code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em;padding:.1em .35em;border-radius:4px;background:rgba(127,127,127,.18)}\n:where(.wxe-doc)>:first-child{margin-top:0}\n:where(.wxe-doc)>:last-child{margin-bottom:0}\n");

// ---------- директива ----------
// w-html не подходит: он чистит содержимое как SVG и вырежет ссылки.
// HTML выставляется в фазе affect, уже после интерполяции {{ }}, поэтому текст статьи не вычисляется как выражение.

Object(_wex_js__WEBPACK_IMPORTED_MODULE_0__[/* directive */ "a"])('w-doc', null, function ($el, attrs) {
  var el = $el[0];
  var expr = attrs['w-doc'];
  var doc;
  try {
    doc = this.scope.parse(expr);
  } catch (e) {
    Object(_wex_js__WEBPACK_IMPORTED_MODULE_0__[/* report */ "b"])("w-doc: \u043E\u0448\u0438\u0431\u043A\u0430 \u0432 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0438 \xAB".concat(expr, "\xBB: ").concat(e.message), {
      view: this.view,
      el: el,
      expr: expr,
      level: 'error'
    });
    return;
  }
  el.classList.add('wxe-doc');
  var key = stable(doc);
  if (el.__wdocKey === undefined) protect(el);
  if (el.__wdocKey !== key) {
    el.__wdocKey = key;
    el.innerHTML = renderDoc(doc);
  }
});
if (typeof window !== 'undefined') {
  window.WexDoc = {
    renderDoc: renderDoc,
    registerNode: registerNode,
    renderNode: renderNode,
    renderNodes: renderNodes,
    safeUrl: safeUrl,
    esc: esc
  };
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export View */
/* unused harmony export config */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return report; });
/* unused harmony export component */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return directive; });
/* unused harmony export filter */
/* unused harmony export preloadComponent */
/* unused harmony export useJQuery */
/* harmony import */ var _vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _reactive_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var WEX_VERSION = '1.3.5';






// ScopeX.$new создавал полноценный ScopeX с НОВЫМ кэшем скомпилированных выражений: на каждую итерацию w-for
// каждое выражение заново разбиралось и компилировалось через new Function. Дочерний scope теперь делит
// compile (и кэш) с родителем. Семантика $new та же: locals получает прототип = данные родителя.
if (!_vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__["ScopeX"].prototype.$new.__shared) {
  var isPlainObj = function isPlainObj(v) {
    return v && _typeof(v) === 'object' && v.constructor === Object;
  };
  var sharedNew = function sharedNew(locals) {
    locals = locals || {};
    var data = isPlainObj(locals) ? Object.setPrototypeOf(locals, this.data) : Object.assign({}, locals);
    var child = Object.create(_vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__["ScopeX"].prototype);
    child.options = this.options;
    child.filters = this.filters;
    child.compile = this.compile;
    child.data = data;
    return child;
  };
  sharedNew.__shared = true;
  _vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__["ScopeX"].prototype.$new = sharedNew;
}
var vmId = 0;
var $ = null;
function View() {}
var SYMBOL = {};
var config = {
  // по умолчанию debug включён только на localhost
  debug: typeof window !== 'undefined' && window.WEX_DEBUG !== undefined ? !!window.WEX_DEBUG : typeof location !== 'undefined' && /^(localhost|127\.|\[::1\])/.test(location.hostname),
  maxDepth: 50,
  // максимальная вложенность компонентов
  syncMounts: 50,
  // сколько компонентов монтировать синхронно за тик, остальные по кадрам (Infinity = как раньше)
  mountBudget: 10 // мс на кадр для отложенного монтирования
};
var reported = new Set();

// window.WEX_PROFILE = true до загрузки: время рендеров копится в window.WEX_STATS (мс)
var profile = typeof window !== 'undefined' && window.WEX_PROFILE ? window.WEX_STATS = {
  compile: 0,
  diff: 0,
  affect: 0,
  renders: 0
} : null;
function scopeSnapshot(scp) {
  var out = {};
  try {
    var data = scp.data || {};
    for (var k in data) {
      var v = data[k];
      out[k] = v && _typeof(v) === 'object' ? Array.isArray(v) ? "Array(".concat(v.length, ")") : "{".concat(Object.keys(v).slice(0, 6).join(', '), "}") : v;
    }
  } catch (e) {}
  return out;
}

// level: 'error' пишется всегда, 'warn' только при config.debug
function report(title) {
  var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var level = ctx.level || 'warn';
  if (level !== 'error' && !config.debug) return;
  var path = ctx.view && ctx.view.__path || ['root'];
  var key = [title, path.join('>'), ctx.attr, ctx.expr].join('|');
  if (reported.has(key)) return; // не спамим 1500 одинаковых сообщений
  reported.add(key);
  var color = level === 'error' ? '#e11d48' : '#d97706';
  console.groupCollapsed("%cWex%c ".concat(title), "background:".concat(color, ";color:#fff;padding:1px 5px;border-radius:3px"), '');
  console.log('Цепочка компонентов:', path.join(' › '));
  if (ctx.attr) console.log('Атрибут:', ctx.attr);
  if (ctx.expr) console.log('Выражение:', ctx.expr);
  if (ctx.source) console.log('Место в шаблоне:', ctx.source);
  if (ctx.scope) console.log('Доступные переменные:', scopeSnapshot(ctx.scope));
  if (ctx.el) console.log('Элемент (можно кликнуть):', ctx.el);
  if (ctx.hint) console.log('Подсказка:', ctx.hint);
  console.groupEnd();
}
function safeParse(scp, exp, ctx) {
  try {
    return scp.parse(exp);
  } catch (e) {
    report("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0438 \xAB".concat(exp, "\xBB: ").concat(e.message), _objectSpread(_objectSpread({}, ctx), {}, {
      expr: exp,
      scope: scp,
      level: 'error'
    }));
    return undefined;
  }
}
function checkInterpolation(text, scp, ctx) {
  if (!config.debug || text.indexOf('{{') === -1) return;
  text.replace(/\{\{([\s\S]+?)\}\}/g, function (m, raw) {
    var expr = raw.trim();
    try {
      var v = scp.parse(expr);
      if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(v)) {
        report("\xAB{{ ".concat(expr, " }}\xBB \u0432\u0435\u0440\u043D\u0443\u043B ").concat(v), _objectSpread(_objectSpread({}, ctx), {}, {
          expr: expr,
          scope: scp
        }));
      }
    } catch (e) {
      if (expr.indexOf('|') === -1) {
        // фильтры parse может не понимать
        report("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432 \xAB{{ ".concat(expr, " }}\xBB: ").concat(e.message), _objectSpread(_objectSpread({}, ctx), {}, {
          expr: expr,
          scope: scp,
          level: 'error'
        }));
      }
    }
    return m;
  });
}

// ---------------

var globalComponents = [];
var globalDirectives = [];
var globalFilters = {};

// bigger priority come first
function _push(list, name, compile, affect) {
  var priority = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];
    if (item[0] === name) {
      list[i] = [name, compile, affect, priority];
      return;
    }
    if (item[3] < priority) {
      list.splice(i, 0, [name, compile, affect, priority]);
      return;
    }
  }
  list.push([name, compile, affect, priority]);
}

// ---------- жизненный цикл директив ----------
// directive(name, { compile, mounted, updated, unmounted, priority })
//   compile($el, attrs)                  как раньше, на виртуальном дереве
//   mounted($el, attrs, data)            один раз, когда элемент появился в DOM
//   updated($el, attrs, data)            на каждый следующий рендер
//   unmounted($el, data)                 когда элемент удалён из DOM или view размонтирован
// this = { $root, scope, view, component } (как у affect). data живёт столько же, сколько элемент.
function lifecycleAffect(name, def) {
  return function ($el, attrs) {
    var el = $el[0];
    var bag = el.__wDirs || (el.__wDirs = {});
    var rec = bag[name];
    if (!rec) {
      rec = bag[name] = {
        def: def,
        data: {},
        ctx: this
      };
      if (def.mounted) def.mounted.call(this, $el, attrs, rec.data);
    } else {
      rec.ctx = this;
      if (def.updated) def.updated.call(this, $el, attrs, rec.data);
    }
  };
}
function normalizeDirective(name, compile, affect, priority) {
  if (compile && _typeof(compile) === 'object' && !(compile instanceof View)) {
    var def = compile;
    return [def.compile || null, lifecycleAffect(name, def), def.priority !== undefined ? def.priority : priority];
  }
  return [compile, affect, priority];
}
function teardownDirectives(el) {
  var run = function run(node) {
    var bag = node.__wDirs;
    if (!bag) return;
    delete node.__wDirs;
    Object.keys(bag).forEach(function (name) {
      var rec = bag[name];
      if (!rec.def.unmounted) return;
      try {
        rec.def.unmounted.call(rec.ctx, $(node), rec.data);
      } catch (e) {
        console.error(e);
      }
    });
  };
  run(el);
  if (el.querySelectorAll) el.querySelectorAll('*').forEach(run);
}

// удаляемый узел: размонтировать компоненты и директивы внутри
function disposeNode(node) {
  if (node.nodeType !== 1) return;
  var els = [node].concat(_toConsumableArray(node.querySelectorAll('*')));
  els.forEach(function (el) {
    var comp = el.__jQvmComponent;
    if (comp) {
      comp.__cancelled = true;
      comp.unmount();
      delete el.__jQvmComponent;
    }
  });
  teardownDirectives(node);
}
function component(name, compile, affect) {
  _push(globalComponents, name, compile, affect);
}
function directive(name, compile, affect, priority) {
  var _normalizeDirective = normalizeDirective(name, compile, affect, priority),
    _normalizeDirective2 = _slicedToArray(_normalizeDirective, 3),
    c = _normalizeDirective2[0],
    a = _normalizeDirective2[1],
    p = _normalizeDirective2[2];
  _push(globalDirectives, name, c, a, p);
}
function filter(name, fn) {
  globalFilters[name] = fn;
}
var nativeImport = new Function('u', 'return import(u)'); // в обход бандлера
var remoteCache = {};
function startLoad(entry, url) {
  if (entry.started) return entry;
  entry.started = true;
  var fetchText = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var tries,
        _loop,
        _ret,
        i,
        _args2 = arguments;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            tries = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 3;
            _loop = /*#__PURE__*/_regenerator().m(function _loop(i) {
              var r, _t, _t2;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.p = _context.n) {
                  case 0:
                    _context.p = 0;
                    _context.n = 1;
                    return fetch(url);
                  case 1:
                    r = _context.v;
                    if (r.ok) {
                      _context.n = 2;
                      break;
                    }
                    throw new Error("Wex: cannot load component ".concat(url, " (").concat(r.status, ")"));
                  case 2:
                    _context.n = 3;
                    return r.text();
                  case 3:
                    _t = _context.v;
                    return _context.a(2, {
                      v: _t
                    });
                  case 4:
                    _context.p = 4;
                    _t2 = _context.v;
                    if (!(i >= tries - 1)) {
                      _context.n = 5;
                      break;
                    }
                    throw _t2;
                  case 5:
                    _context.n = 6;
                    return new Promise(function (res) {
                      return setTimeout(res, 300 * Math.pow(2, i));
                    });
                  case 6:
                    return _context.a(2);
                }
              }, _loop, null, [[0, 4]]);
            });
            i = 0;
          case 1:
            return _context2.d(_regeneratorValues(_loop(i)), 2);
          case 2:
            _ret = _context2.v;
            if (!_ret) {
              _context2.n = 3;
              break;
            }
            return _context2.a(2, _ret.v);
          case 3:
            i++;
            _context2.n = 1;
            break;
          case 4:
            return _context2.a(2);
        }
      }, _callee);
    }));
    return function fetchText() {
      return _ref.apply(this, arguments);
    };
  }();
  fetchText().then(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(html) {
      var _doc$querySelector;
      var doc, tpl, $tpl, code, view, blobUrl, waiters;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            doc = new DOMParser().parseFromString(html, 'text/html');
            tpl = doc.querySelector('template');
            if (tpl) {
              _context3.n = 1;
              break;
            }
            throw new Error("Wex: no <template> in ".concat(url));
          case 1:
            $tpl = $("<template>".concat(tpl.innerHTML, "</template>"));
            code = (_doc$querySelector = doc.querySelector('script[type="module"]')) === null || _doc$querySelector === void 0 ? void 0 : _doc$querySelector.textContent;
            view = null;
            if (!code) {
              _context3.n = 6;
              break;
            }
            blobUrl = URL.createObjectURL(new Blob([code], {
              type: 'text/javascript'
            }));
            _context3.p = 2;
            _context3.n = 3;
            return nativeImport(blobUrl);
          case 3:
            view = _context3.v["default"]($tpl);
          case 4:
            _context3.p = 4;
            URL.revokeObjectURL(blobUrl);
            return _context3.f(4);
          case 5:
            _context3.n = 7;
            break;
          case 6:
            view = $tpl.vm();
          case 7:
            if (view instanceof View) {
              _context3.n = 8;
              break;
            }
            throw new Error("Wex: ".concat(url, " must export default a function returning a view"));
          case 8:
            entry.view = view;
            waiters = _toConsumableArray(entry.waiters);
            entry.waiters.clear();
            waiters.forEach(function (v) {
              try {
                v.update(true);
              } catch (e) {
                console.error("Wex: \u043E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 ".concat(url), e);
              }
            });
          case 9:
            return _context3.a(2);
        }
      }, _callee2, null, [[2,, 4, 5]]);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }())["catch"](function (e) {
    entry.started = false; // следующая попытка (наведение, рендер) загрузит заново
    console.error(e);
  });
  return entry;
}
function loadRemote(url) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref3$lazy = _ref3.lazy,
    lazy = _ref3$lazy === void 0 ? false : _ref3$lazy;
  var entry = remoteCache[url];
  if (!entry) {
    entry = remoteCache[url] = {
      view: null,
      waiters: new Set(),
      started: false,
      load: function load() {
        return startLoad(entry, url);
      }
    };
  }
  if (!lazy) entry.load();
  return entry;
}

// для роутера: прогреть компонент заранее
function preloadComponent(url) {
  return loadRemote(url);
}

// ----------- compiler ---------------

// clear and revoke effects
function prepare($root) {
  var root = $root[0];
  var records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
  if (!records.length) {
    return;
  }
  records.forEach(function (record) {
    // reset effects
    if (record.revoke) {
      record.revoke();
    }
  });

  // clear
  records.length = 0;
}
function compile($root, components, directives, state, view, _ref4) {
  var _ref5 = _slicedToArray(_ref4, 3),
    template = _ref5[0],
    scope = _ref5[1],
    isolate = _ref5[2];
  if (config.debug && /<(img|iframe|source|video|audio|script|link)\b[^>]*\s(src|href|srcset)\s*=\s*["'][^"']*\{\{/i.test(template)) {
    report('«{{ }}» внутри src/href: браузер запросит сырую строку и получит 404', {
      view: view,
      level: 'error',
      source: template.slice(0, 160),
      hint: 'Используйте w-src="выражение" вместо src="{{ }}"'
    });
  }
  var root = $root[0];
  var records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
  var entry = protoOf(template);
  var box = entry.box.cloneNode(true);
  var dynamic = false; // после compile-функции, вернувшей новую разметку, кэш наличия директив неточен

  // пропускаем всё, где нет «{{»: раньше каждый атрибут и текст гонялся через regexp и перезаписывался
  var _interpolateNode = function interpolateNode(el, scp) {
    if (el.attributes.length) {
      var list = _toConsumableArray(el.attributes);
      for (var i = 0; i < list.length; i++) {
        var _list$i = list[i],
          name = _list$i.name,
          value = _list$i.value;
        if (name.charCodeAt(0) === 64 || value.indexOf('{{') === -1) continue; // '@'

        checkInterpolation(value, scp, {
          view: view,
          el: el,
          attr: name
        });
        var text = interpolateText(scp, value);

        // атрибут целиком из одного {{ }} и результат пустой: не пишем "undefined" в DOM
        if ((text === 'undefined' || text === 'null') && /^\{\{[^}]+\}\}$/.test(value.trim())) {
          el.removeAttribute(name);
          continue;
        }
        setAttrSafe(el, name, text);
      }
    }
    for (var child = el.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === 3) {
        var _text = child.textContent;
        if (_text.indexOf('{{') !== -1) {
          checkInterpolation(_text, scp, {
            view: view,
            el: el
          });
          child.textContent = interpolateText(scp, _text);
        }
      } else if (child.nodeType === 1) {
        _interpolateNode(child, scp);
      }
    }
  };

  // для ctx.interpolate в пользовательских директивах (принимает jQuery, как раньше)
  var interpolate = function interpolate($el) {
    var scp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scope;
    $el.each(function () {
      _interpolateNode(this, scp);
    });
  };
  var createIterator = function createIterator(onCompile, onAffect, markDynamic) {
    return function () {
      var el = this;
      // уже обработан вложенным compile (w-for) — повторно не трогаем
      if (el.__jQvmIterated) return;
      var attrs = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeAttrs */ "c"])(el);
      var name = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeName */ "d"])(el);
      var els = [el];
      var inner = el.innerHTML;
      var slot = function slot(locals) {
        var $root = $('<div />');
        var subScope = locals ? locals instanceof _vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__["ScopeX"] ? scope.$new(locals.data) : scope.$new(locals) : scope;
        var nodes = compile($root, components, directives, state, view, [inner, subScope]);
        affect($root, scope, view);
        return nodes;
      };
      slot.template = inner;
      slot.nodes = _toConsumableArray(el.childNodes);
      var record = {
        affect: onAffect,
        attrs: attrs,
        els: els,
        slot: slot,
        scope: scope,
        source: config.debug ? el.outerHTML.slice(0, 160) : ''
      };
      var useComponent = function useComponent(proto) {
        // экземпляр создаётся в affect() и привязывается к конкретному DOM-элементу
        record.view = proto;
        record.name = name;
        record.state = state;
        if (proto.tag !== 'template') {
          var tag = proto.tag,
            attributes = proto.attributes;
          var doc = el.ownerDocument;
          var tagEl = doc.createElement(tag);
          var attrsText = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* createAttrsText */ "b"])(attrs);
          var begin = doc.createComment(" ".concat(name, " ").concat(attrsText, " begin "));
          var end = doc.createComment(" ".concat(name, " ").concat(attrsText, " end "));
          Object.assign(attrs, attributes, _defineProperty({}, 'data-hoist', name));
          Object.keys(attrs).forEach(function (k) {
            return setAttrSafe(tagEl, k, attrs[k]);
          });
          el.replaceWith(begin, tagEl, end);
          els.length = 0;
          els.push(begin, tagEl, end);
        } else {
          el.textContent = '';
        }
      };

      // register a view as component
      if (onCompile instanceof View) {
        useComponent(onCompile);
      } else if (typeof onCompile === 'function') {
        // функции-компоненты получают jQuery-обёртку, как раньше
        var $el = $(el);
        // developers can recompile inside fn
        var boundCompile = compile.bind(null, $root, components, directives, state, view);
        var ctx = {
          scope: scope,
          view: view,
          compile: function compile(temp) {
            var scp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scope;
            return boundCompile([temp, scp]);
          },
          interpolate: interpolate
        };
        var output = onCompile.call(ctx, $el, attrs, slot);
        if (output && output instanceof View) {
          useComponent(output);
        } else if (!Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(output) && $el !== output) {
          if (markDynamic) markDynamic();
          var newEls = $('<div />').html(output)[0].childNodes;
          $el.replaceWith(newEls);
          els.length = 0;
          els.push.apply(els, _toConsumableArray(newEls));
        }
      }
      records.push(record);
      el.__jQvmIterated = true;
      els.forEach(function (item) {
        item.__jQvmCompiledRecord = record;
        item.__jQvmIterated = true;
      });
    };
  };

  // directives have higher priority than components

  directives.forEach(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 3),
      name = _ref7[0],
      onCompile = _ref7[1],
      onAffect = _ref7[2];
    var selector = selectorOf(name);
    if (!dynamic && !protoHas(entry, selector)) return;
    var found = box.querySelectorAll(selector);
    var _loop2 = function _loop2() {
      var el = found[i];
      var attrs = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeAttrs */ "c"])(el);
      var els = [el];
      if (typeof onCompile === 'function') {
        // developers can recompile inside fn
        var boundCompile = compile.bind(null, $root, components, directives, state, view);
        var ctx = {
          scope: scope,
          view: view,
          compile: function compile(temp) {
            var scp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scope;
            var isl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isolate;
            return boundCompile([temp, scp, isl]);
          },
          interpolate: interpolate
        };
        if (onCompile["native"]) {
          // встроенные директивы получают сам элемент и работают без jQuery
          var output = onCompile.call(ctx, el, attrs);
          if (!Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(output) && output !== el) {
            var nodes = toNodes(output);
            if (!(nodes.length === 1 && nodes[0].nodeType === 8)) dynamic = true; // комментарий новой разметки не добавляет
            el.replaceWith.apply(el, _toConsumableArray(nodes));
            els = nodes;
          }
        } else {
          var $el = $(el);
          var _output = onCompile.call(ctx, $el, attrs);
          if (!Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(_output) && $el !== _output) {
            dynamic = true;
            var $newEls = $(_output);
            $el.replaceWith($newEls);
            els = _toConsumableArray($newEls);
          }
        }
      }
      if (isolate) {
        el.removeAttribute(name);
      }
      var record = {
        affect: onAffect,
        attrs: attrs,
        els: els,
        scope: scope
      };
      records.push(record);
      els.forEach(function (item) {
        return item.__jQvmCompiledRecord = record;
      });
    };
    for (var i = 0; i < found.length; i++) {
      _loop2();
    }
  });
  components.forEach(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 3),
      name = _ref9[0],
      compile = _ref9[1],
      affect = _ref9[2];
    if (name === 'slot') {
      return;
    }
    if (!dynamic && !protoHas(entry, name)) return;
    var iterate = createIterator(compile, affect, function () {
      dynamic = true;
    });
    var found = box.querySelectorAll(name);
    for (var i = 0; i < found.length; i++) iterate.call(found[i]);
  });
  _interpolateNode(box, scope);

  // slot will only render with the host scope
  var slotComponent = components.find(function (item) {
    return item[0] === 'slot';
  });
  if (slotComponent && (dynamic || protoHas(entry, 'slot'))) {
    var _slotComponent = _slicedToArray(slotComponent, 3),
      name = _slotComponent[0],
      _compile = _slotComponent[1],
      _affect = _slotComponent[2];
    var iterate = createIterator(_compile, _affect);
    var found = box.querySelectorAll(name);
    for (var i = 0; i < found.length; i++) iterate.call(found[i]);
  }
  return _toConsumableArray(box.childNodes);
}

// ---------- интерполяция: строка с {{ }} разбирается один раз ----------
// Раньше на каждый атрибут и текст каждого рендера: match + replace + trim + slice по regexp.
// Порядок и результат те же, что у ScopeX.interpolate (undefined превращается в "undefined").
var mustacheCache = new Map();
function parseMustache(str) {
  var parts = mustacheCache.get(str);
  if (!parts) {
    parts = [];
    var re = /\{\{(.*?)\}\}(?!\})/g;
    var last = 0,
      m;
    while (m = re.exec(str)) {
      if (m.index > last) parts.push(str.slice(last, m.index));
      parts.push({
        expr: m[1].trim()
      });
      last = re.lastIndex;
    }
    if (parts.length && last < str.length) parts.push(str.slice(last));
    if (mustacheCache.size > 5000) mustacheCache.clear();
    mustacheCache.set(str, parts);
  }
  return parts;
}
function interpolateText(scp, str) {
  var parts = parseMustache(str);
  if (!parts.length) return str;
  var out = '';
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    out += typeof part === 'string' ? part : String(scp.parse(part.expr));
  }
  return out;
}

// ---------- разбор шаблона один раз ----------
// Дальше каждый рендер (и каждая итерация w-for) клонирует готовое дерево: cloneNode заметно быстрее innerHTML.
var inertDoc = null;
var protoCache = new Map();
function protoOf(html) {
  var entry = protoCache.get(html);
  if (!entry) {
    inertDoc = inertDoc || document.implementation.createHTMLDocument('');
    var box = inertDoc.createElement('div');
    box.innerHTML = html;
    if (protoCache.size > 2000) protoCache.clear();
    entry = {
      box: box,
      has: new Map()
    };
    protoCache.set(html, entry);
  }
  return entry;
}
var selCache = new Map();
var selectorOf = function selectorOf(name) {
  var sel = selCache.get(name);
  if (!sel) selCache.set(name, sel = '[' + name + ']');
  return sel;
};

// есть ли в шаблоне элементы по селектору; результат кэшируется на строку шаблона
function protoHas(entry, selector) {
  var v = entry.has.get(selector);
  if (v === undefined) {
    v = entry.box.querySelector(selector) !== null;
    entry.has.set(selector, v);
  }
  return v;
}

// ---------- keyed diff ----------
// Ключ узла:
//   'g|…'  глобальный в пределах view: w-for ... traceby (ставит __wKey) и id. Узел и компонент
//          переезжают между контейнерами, а не пересоздаются.
//   'l|…'  локальный (ручной data-id): ищется только среди детей того же родителя.
function keyOf(node) {
  if (node.nodeType !== 1) return undefined;
  if (node.__wKey !== undefined) return node.__wKey;
  var id = node.getAttribute('id');
  if (id) return 'g|id|' + id;
  var d = node.getAttribute('data-id');
  if (d !== null) return 'l|' + node.nodeName + '|' + d;
  return undefined;
}
var IGNORE_ATTRS = ['style', 'class', 'w-name'];
var attrNames = function attrNames(el) {
  return _toConsumableArray(el.attributes).map(function (a) {
    return a.name;
  }).filter(function (n) {
    return IGNORE_ATTRS.indexOf(n) === -1;
  });
};

// результат нативной директивы -> список узлов
function toNodes(output) {
  if (typeof output === 'string') {
    var tpl = document.createElement('template');
    tpl.innerHTML = output;
    return _toConsumableArray(tpl.content.childNodes);
  }
  if (output.nodeType) return [output];
  return _toConsumableArray(output);
}
function setAttrSafe(el, name, value) {
  try {
    el.setAttribute(name, value);
  } catch (e) {
    $(el).attr(name, value);
  }
}
function diffAndPatch($root, nodes) {
  var claimed = new Set(); // старые узлы, уже занятые новым деревом
  var pending = []; // кандидаты на удаление: решение после обхода всего дерева
  var localCache = new Map();
  var globalIdx = null;
  var addTo = function addTo(map, key, el) {
    var list = map.get(key);
    if (list) list.push(el);else map.set(key, [el]);
  };
  var localIndex = function localIndex(parent) {
    var map = localCache.get(parent);
    if (!map) {
      map = new Map();
      for (var c = parent.firstElementChild; c; c = c.nextElementSibling) {
        var k = keyOf(c);
        if (k !== undefined) addTo(map, k, c);
      }
      localCache.set(parent, map);
    }
    return map;
  };

  // одноразовый обход (лениво, только если ключ не найден среди детей); в чужие view не заходим
  var globalIndex = function globalIndex() {
    if (!globalIdx) {
      globalIdx = new Map();
      var _walk = function walk(el) {
        for (var c = el.firstElementChild; c; c = c.nextElementSibling) {
          var k = keyOf(c);
          if (k !== undefined && k[0] === 'g') addTo(globalIdx, k, c);
          if (!c.__jQvmComponent) _walk(c);
        }
      };
      _walk($root[0]);
    }
    return globalIdx;
  };
  var pick = function pick(list) {
    if (!list) return null;
    for (var i = 0; i < list.length; i++) {
      if (!claimed.has(list[i])) return list[i];
    }
    return null;
  };
  var take = function take(key, parent) {
    var el = pick(localIndex(parent).get(key));
    if (!el && key[0] === 'g') el = pick(globalIndex().get(key));
    if (el) claimed.add(el);
    return el;
  };

  // we will not use next to replace current node, so we should transform record info to old node
  var transferRecord = function transferRecord(current, next) {
    var record = next.__jQvmCompiledRecord;
    if (!record) {
      return;
    }
    var els = record.els;
    els.forEach(function (el, i) {
      if (el === next) {
        els[i] = current;
      }
    });
    current.__jQvmCompiledRecord = record;
  };
  var patchAttrs = function patchAttrs(current, next) {
    // update/add attrs
    var na = next.attributes;
    for (var i = 0; i < na.length; i++) {
      var _na$i = na[i],
        name = _na$i.name,
        value = _na$i.value;
      if (current.getAttribute(name) !== value) setAttrSafe(current, name, value);
    }
    // remove no use attrs (style, class и w-name не трогаем)
    var ca = current.attributes;
    for (var _i = ca.length - 1; _i >= 0; _i--) {
      var _name = ca[_i].name;
      if (_name === 'style' || _name === 'class' || _name === 'w-name') continue;
      if (!next.hasAttribute(_name)) current.removeAttribute(_name);
    }
  };
  var patchNode = function patchNode(current, next) {
    // для компонента сравниваем со снимком атрибутов ДО патча
    var isComp = !!current.__jQvmComponent;
    var pre = null;
    if (isComp) {
      pre = {
        wName: current.getAttribute('w-name'),
        id: current.getAttribute('id'),
        dataId: current.getAttribute('data-id'),
        names: attrNames(current)
      };
    }
    patchAttrs(current, next);
    if (next.__wKey !== undefined) current.__wKey = next.__wKey;
    transferRecord(current, next);

    // dont diff component inner content
    if (isComp && current.nodeName === next.nodeName) {
      if (pre.wName === next.getAttribute('w-name')) return;
      var nid = next.getAttribute('id');
      if ((pre.id || nid) && pre.id === nid) return;
      var nd = next.getAttribute('data-id');
      if ((pre.dataId || nd) && pre.dataId === nd) return;
      if (current.getAttribute('data-hoist') === next.getAttribute('data-hoist') && Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isEqual */ "b"])(pre.names, attrNames(next))) {
        return;
      }
    }
    diffAndPatchChildren(current, _toConsumableArray(next.childNodes));
  };
  var diffAndPatchChildren = function diffAndPatchChildren(parentNode, nextChildren) {
    // пустой родитель без ключей: просто добавляем всё разом
    if (!parentNode.childNodes.length && !nextChildren.some(function (n) {
      return keyOf(n) !== undefined;
    })) {
      nextChildren.forEach(function (child) {
        parentNode.appendChild(child);
      });
      return;
    }

    // инвариант: после шага i parentNode.childNodes[i] соответствует nextChildren[i]
    nextChildren.forEach(function (next, i) {
      var current = parentNode.childNodes[i] || null;
      var key = keyOf(next);
      if (key !== undefined) {
        var found = take(key, parentNode);
        if (found) {
          if (found !== current) parentNode.insertBefore(found, current);
          patchNode(found, next);
        } else {
          parentNode.insertBefore(next, current);
        }
      } else if (!current) {
        parentNode.appendChild(next);
      }
      // чужой ключевой узел не патчим под безключевой: вставляем рядом
      else if (next.nodeName !== current.nodeName || keyOf(current) !== undefined) {
        parentNode.insertBefore(next, current);
      }
      // diff and patch element
      else if (next.nodeName.indexOf('#') !== 0) {
        patchNode(current, next);
      }
      // diff and patch text
      else if (next.textContent !== current.textContent) {
        current.textContent = next.textContent;
      }
    });

    // хвост: не удаляем сразу, узел мог переехать в другой контейнер
    for (var i = parentNode.childNodes.length - 1, start = nextChildren.length; i >= start; i--) {
      pending.push(parentNode.childNodes[i]);
    }
  };
  diffAndPatchChildren($root[0], nodes);
  pending.forEach(function (node) {
    var parent = node.parentNode;
    if (claimed.has(node) || !parent) return;
    disposeNode(node);
    parent.removeChild(node);
  });
}

// ---------- очередь отложенного монтирования ----------
var mountQueue = [];
var mountScheduled = false;
var flushing = false;
var collecting = null;
var syncCount = 0;
var nextFrame = function nextFrame(fn) {
  return document.hidden ? setTimeout(fn, 0) : requestAnimationFrame(fn);
};
function shouldDefer() {
  return flushing || syncCount >= config.syncMounts;
}
function noteSyncMount() {
  if (syncCount === 0) Promise.resolve().then(function () {
    syncCount = 0;
  });
  syncCount++;
}
function scheduleMount(job) {
  // задачи, созданные внутри текущей задачи (дети), встают в начало очереди:
  // получается обход в глубину, то есть порядок как в документе
  if (collecting) collecting.push(job);else mountQueue.push(job);
  if (!mountScheduled) {
    mountScheduled = true;
    nextFrame(flushMounts);
  }
}
function flushMounts() {
  mountScheduled = false;
  flushing = true;
  var start = performance.now();
  while (mountQueue.length && performance.now() - start < config.mountBudget) {
    var job = mountQueue.shift();
    collecting = [];
    try {
      job();
    } catch (e) {
      console.error(e);
    }
    if (collecting.length) mountQueue.unshift.apply(mountQueue, _toConsumableArray(collecting));
    collecting = null;
  }
  flushing = false;
  if (mountQueue.length) {
    mountScheduled = true;
    nextFrame(flushMounts);
  }
}
function affect($root, scope, view) {
  var root = $root[0];
  var records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
  records.forEach(function (record) {
    var affect = record.affect,
      attrs = record.attrs,
      els = record.els,
      proto = record.view,
      localScope = record.scope,
      name = record.name,
      source = record.source;
    var finalScope = localScope && localScope !== scope ? localScope : scope;
    if (proto) {
      var state = record.state,
        slot = record.slot;
      var slotInner = slot.template.trim();
      els.forEach(function (el) {
        if (el.nodeName.indexOf('#') === 0) return;
        var $el = $(el);
        var component = el.__jQvmComponent;
        var isNew = !component;
        if (isNew) {
          // --- защита от бесконечной рекурсии ---
          var parentPath = view.__path || ['root'];
          if (parentPath.length > config.maxDepth) {
            report("\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D\u0430 \u0433\u043B\u0443\u0431\u0438\u043D\u0430 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432 (".concat(config.maxDepth, "), \xAB").concat(name, "\xBB \u043D\u0435 \u0441\u043E\u0437\u0434\u0430\u043D"), {
              level: 'error',
              view: view,
              el: el,
              source: source,
              hint: 'Рекурсивный компонент без условия выхода или циклические данные. Остановите рекурсию через w-if.'
            });
            $el.empty().attr('data-wex-error', 'max-depth');
            return;
          }
          component = proto.clone();
          component.__path = parentPath.concat(name);
        }
        record.component = component;

        // --- props ---
        var outside = {};
        Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(attrs, function (exp, attr) {
          if (attr.indexOf(':') === 0) {
            var ctx = {
              view: view,
              el: el,
              attr: attr,
              expr: exp,
              source: source
            };
            var value = safeParse(finalScope, exp, ctx);
            if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(value)) {
              report("\u041F\u0440\u043E\u043F \xAB".concat(attr.substring(1), "\xBB \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \xAB").concat(name, "\xBB \u043F\u043E\u043B\u0443\u0447\u0438\u043B ").concat(value), _objectSpread(_objectSpread({}, ctx), {}, {
                scope: finalScope
              }));
            }
            outside[Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* camelCase */ "a"])(attr.substring(1))] = value;
          } else if (attr.indexOf('@') === 0) {
            var event = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* camelCase */ "a"])(attr.substring(1));
            var _parseKey = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* parseKey */ "e"])(exp),
              _parseKey2 = _slicedToArray(_parseKey, 2),
              fname = _parseKey2[0],
              params = _parseKey2[1];
            var fn = view.fn(fname);
            outside['@' + event] = function () {
              var res = null;
              if (params) {
                var values = params.map(function (arg) {
                  return finalScope.parse(arg);
                });
                res = fn.call.apply(fn, [view, state].concat(_toConsumableArray(values)));
              } else {
                res = fn.call(view, state);
              }
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "c"])(res)) return res.apply(this, args);
            };
          } else if (attr.indexOf('_') !== 0) {
            outside[Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* camelCase */ "a"])(attr)] = exp;
          }
        });
        component.update(outside, SYMBOL);
        component.component('slot', function () {
          var scope = this.scope;
          return slotInner ? slot(scope) : '';
        });

        // --- монтирование ---
        if (isNew) {
          el.__jQvmComponent = component;
          if (shouldDefer()) {
            component.__pending = true;
            scheduleMount(function () {
              component.__pending = false;
              if (el.__jQvmComponent !== component || component.__cancelled) return;
              component.mount($el);
            });
          } else {
            noteSyncMount();
            component.mount($el);
          }
        } else if (component.__pending) {
          // ждёт своей очереди; свежие props уже переданы выше
        } else if (!$el.attr('w-name')) {
          component.mount($el);
        } else if (slotInner) {
          component.update(true);
        }
      });
      els.forEach(function (el) {
        delete el.__jQvmCompiledRecord;
      });
    }
    if (typeof affect !== 'function') return;
    els.forEach(function (el) {
      var $el = $(el);
      var ctx = {
        $root: $root,
        scope: finalScope,
        view: view,
        component: record.component
      };
      var revoke = affect.call(ctx, $el, attrs);
      if (typeof revoke === 'function') record.revoke = revoke;
    });
  });
}

// ---------------- main ---------------

// начальное состояние клона: свои копии plain-данных (state по ссылке живёт только через props и shareState)
function cloneState(value) {
  if (Array.isArray(value)) return value.map(cloneState);
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    var out = {};
    Object.keys(value).forEach(function (k) {
      out[k] = cloneState(value[k]);
    });
    return out;
  }
  return value;
}
function vm() {
  var initState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var template = this;
  var $template = $(template);
  var hash = $template.attr('id') || $template.attr('w-id') || (vmId++, vmId);
  var root = "[w-name=".concat(hash, "]");
  var state = null;
  var scope = null;
  var outside = null;
  var mountTo = null;
  var isMounted = false;
  var isUnmounted = false;
  var rootEl = null;
  var templateHtml = null;
  var getTemplateHtml = function getTemplateHtml() {
    return templateHtml === null ? templateHtml = $template.html() : templateHtml;
  };
  var getMountNode = function getMountNode() {
    return mountTo ? $(mountTo) : $template.next(root);
  };
  var actions = [];
  var view = new View();

  // -----------

  var components = [].concat(globalComponents);
  var directives = [].concat(globalDirectives);
  var filters = _objectSpread({}, globalFilters);
  var fns = {};
  function component(name, compile, affect) {
    // component('my-button', './components/button.html')
    if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "f"])(compile)) {
      var entry = loadRemote(compile, affect); // affect здесь = { lazy: true }
      var placeholder = function placeholder() {
        entry.load();
        return entry.view || '';
      };
      placeholder.remote = entry;
      compile = placeholder;
      affect = undefined;
    }
    if (compile && compile.remote) {
      var _compile2 = compile,
        remote = _compile2.remote;
      if (remote.view) {
        view.update(true);
      } else {
        remote.waiters.add(view);
      }
    }
    _push(components, name, compile, affect);
    if (compile && compile instanceof View) {
      view.on('$beforeDestroy', function () {
        return compile.destroy();
      });
    }
    return view;
  }
  function directive(name, compile, affect, priority) {
    var _normalizeDirective3 = normalizeDirective(name, compile, affect, priority),
      _normalizeDirective4 = _slicedToArray(_normalizeDirective3, 3),
      c = _normalizeDirective4[0],
      a = _normalizeDirective4[1],
      p = _normalizeDirective4[2];
    _push(directives, name, c, a, p);
    return view;
  }
  function filter(name, fn) {
    filters[name] = fn;
    return view;
  }

  // ------------ планировщик рендера ------------
  // Любая мутация state (или вложенного объекта) помечает view грязным; рендер батчится в микротаске.
  // hold()/release(): на время drag и подобных операций рендер откладывается, release() выполняет его синхронно.

  var dirty = false;
  var queued = false;
  var held = 0;
  var skipped = false; // рендер был отменён через $update + prevent
  var lastInfo = null;
  var unsubscribe = null;
  var schedule = function schedule(info) {
    lastInfo = info;
    dirty = true;
    if (queued || held || !isMounted) return;
    queued = true;
    Promise.resolve().then(flush);
  };
  function flush() {
    queued = false;
    if (!dirty || held || !state || !isMounted) return;
    dirty = false;
    if (change(lastInfo)) render(true);
  }

  // -------------

  // props приходят по ссылке: реактивные данные родителя остаются теми же объектами
  var assignOutsideState = function assignOutsideState(state, outsideState) {
    if (!state) return false;
    var keys = {};
    Object.keys(state).forEach(function (k) {
      keys[k.toLowerCase()] = k;
    });
    var changed = false;
    Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(outsideState, function (value, key) {
      if (key[0] === '@') return;
      var realKey = key in state ? key : keys[key.toLowerCase()];
      if (!realKey) return;
      var prev = Object(_reactive_js__WEBPACK_IMPORTED_MODULE_4__[/* toRaw */ "d"])(state[realKey]);
      var next = Object(_reactive_js__WEBPACK_IMPORTED_MODULE_4__[/* toRaw */ "d"])(value);
      if (prev === next) return;
      // литерал из выражения (`:x="{a:1}"`) создаётся заново на каждый рендер родителя: сравниваем по содержимому
      if (!Object(_reactive_js__WEBPACK_IMPORTED_MODULE_4__[/* isReactive */ "a"])(value) && Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isEqual */ "b"])(prev, next)) return;
      state[realKey] = next;
      changed = true;
    });
    return changed;
  };
  function init(initState) {
    var next = Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "c"])(initState) ? initState.call(view) : initState;
    if (!next || _typeof(next) !== 'object') {
      throw new Error('initState should must be an object');
    }
    state = Object(_reactive_js__WEBPACK_IMPORTED_MODULE_4__[/* reactive */ "b"])(next); // shareState отдаёт один и тот же прокси всем view
    if (outside) {
      assignOutsideState(state, outside);
    }
    unsubscribe = Object(_reactive_js__WEBPACK_IMPORTED_MODULE_4__[/* subscribe */ "c"])(state, schedule);
    scope = new _vendor_ScopeX__WEBPACK_IMPORTED_MODULE_0__["ScopeX"](state, {
      filters: filters
    });

    // setupSpecialEvents should be invoked here
    // because these events should be registered before $init triggered
    setupSpecialEvents();
    view.emit('$init');
  }
  function render(isUpdating) {
    if (isUpdating && !isMounted) {
      return;
    }
    if (!shouldUpdate()) {
      skipped = true;
      return;
    }
    skipped = false;
    var $root = getMountNode();
    var t0 = profile ? performance.now() : 0;
    prepare($root);
    var nodes = compile($root, components, directives, state, view, [getTemplateHtml(), scope]);
    var t1 = profile ? performance.now() : 0;
    if (isUpdating) {
      diffAndPatch($root, nodes);
    } else {
      $root.html(nodes);
    }
    var t2 = profile ? performance.now() : 0;
    affect($root, scope, view);
    if (profile) {
      profile.compile += t1 - t0;
      profile.diff += t2 - t1;
      profile.affect += performance.now() - t2;
      profile.renders++;
    }
    var attrs = $template.attr('attrs');
    if (attrs) {
      var props = scope.parse(attrs);
      Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(props, function (value, key) {
        if (key === 'class') {
          var items = value.split(' ');
          items.forEach(function (item) {
            return $root.addClass(item);
          });
        } else if (key === 'style') {
          if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "e"])(value)) {
            $root.css(value);
          } else if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "f"])(value)) {
            var style = $root.attr('style') || '';
            var rules = style.split(';').concat(value.split(';')).filter(function (item) {
              return !!item;
            });
            var stylesheet = Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* uniqueArray */ "g"])(rules).join(';');
            $root.attr('style', stylesheet);
          }
        } else {
          $root.attr(key, value);
        }
      });
    }
    $template.trigger('$render');
  }
  function change(info) {
    var flag = true;
    var prevent = function prevent() {
      return flag = false;
    };
    $template.trigger('$change', [state, info, prevent]);
    if (flag) {
      _store_js__WEBPACK_IMPORTED_MODULE_3__[/* VMLocalStorage */ "a"].reloadJqvmLocalStorage(state, '$change');
    }
    return flag;
  }
  function shouldUpdate() {
    var flag = true;
    var prevent = function prevent() {
      return flag = false;
    };
    $template.trigger('$update', [state, prevent]);
    return flag;
  }
  function mount(el) {
    if (isMounted) {
      if (el) {
        if (el === mountTo) {
          return view;
        }

        // when change a new root to mount, unmount the original one
        view.unmount();
      } else {
        return view;
      }
    }
    if ($template.next(root).length) {
      return view;
    }
    if (!isUnmounted) {
      init(initState);
    }
    var $root = null;
    mountTo = el || null; // cache mount node

    if (el) {
      $root = $(el);
      $root.attr('w-name', hash);
    }
    // like $('<template>aaa</template>').vm(...)
    else if (!$(document).find($template).length) {
      throw new Error('el should must be passed by view.mount');
    } else {
      $root = $('<div />', {
        'w-name': hash
      });
      $template.after($root);
    }
    rootEl = $root[0];
    render();
    dirty = false;
    _store_js__WEBPACK_IMPORTED_MODULE_3__[/* VMLocalStorage */ "a"].reloadJqvmLocalStorage(state, '$mount');
    $template.trigger('$mount', [state]);
    isMounted = true;
    isUnmounted = false;
    return view;
  }
  function unmount() {
    if (!isMounted) {
      return view;
    }
    var $root = getMountNode();
    if (!$root.length) {
      return;
    }
    $template.trigger('$unmount');
    teardownDirectives($root[0]);
    if (mountTo) {
      $root.html('');
      $root.removeAttr('w-name');
    } else {
      $root.remove();
    }
    mountTo = null;
    rootEl = null;
    isMounted = false;
    isUnmounted = true;
    return view;
  }
  function destroy() {
    $template.trigger('$beforeDestroy');
    var $root = getMountNode();
    unmount();
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
    state = null;
    scope = null;
    actions.length = 0;
    var root = $root[0];
    if (root) {
      delete root.__jQvmComponentInstances;
      delete root.__jQvmCompiledRecords;
    }
    $template.trigger('$destroy');
  }
  function update(nextState, type) {
    // props от родителя: рендер запустит подписка на state
    if (type === SYMBOL) {
      outside = nextState;
      if (state) assignOutsideState(state, nextState);
      return view;
    }

    // force update
    if (nextState === true) {
      if (isMounted) {
        dirty = false;
        render(true);
      }
      return view;
    }

    // when nextState passed, assign to state will trigger rerender
    if (state && nextState) {
      if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "c"])(nextState)) {
        var res = nextState(state);
        if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "e"])(res)) {
          Object.assign(state, res);
        } else {
          schedule(null); // мутации не-plain объектов (Chart.js) не видны прокси: помечаем вручную
        }
      } else if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "e"])(nextState)) {
        Object.assign(state, nextState);
      }
    }
    return view;
  }

  // отложить рендер до release(); вызовы вкладываются
  function hold() {
    held++;
    return view;
  }

  // release() рендерит синхронно, если за время hold что-то изменилось (или рендер был отменён через $update + prevent)
  function release() {
    if (held > 0 && --held === 0) {
      if (dirty) flush();else if (skipped) render(true);
    }
    return view;
  }
  function bind(args, once) {
    var info = _toConsumableArray(args);
    var fn = info.pop();
    var _info = _slicedToArray(info, 2),
      event = _info[0],
      selector = _info[1];
    var handle = function handle(e) {
      var event = e.handleObj.origType;
      // stop broadcast the event
      if (event[0] === '$') {
        e.stopPropagation();
        if (e.target !== e.currentTarget) {
          return;
        }
      }
      var res = null;
      for (var _len2 = arguments.length, eventArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        eventArgs[_key2 - 1] = arguments[_key2];
      }
      if (event[0] === '$') {
        fn.call.apply(fn, [view, state].concat(eventArgs));
      } else {
        var callback = fn.call(view, state);
        if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "c"])(callback)) {
          res = callback.call.apply(callback, [this, e].concat(eventArgs));
        }
      }
      if (once) {
        unbind(args);
      }
      return res;
    };
    var item = {
      once: once,
      event: event,
      selector: selector,
      fn: fn,
      handle: handle
    };
    actions.push(item);

    // events will be bound when $mount by `setup`
    // developers may invoke this.on(...) after view mounted, at this time, the event callback should be bound immediately
    if (isMounted) {
      var $root = getMountNode();
      var type = once ? 'one' : 'on';
      if (event[0] === '$') {
        $template[type](event, handle);
      } else {
        var _info2 = [event, selector].filter(Boolean);
        $root[type].apply($root, _toConsumableArray(_info2).concat([handle]));
      }
    }
  }
  function unbind(args) {
    var info = _toConsumableArray(args);
    var fn = info.pop();
    var _info3 = _slicedToArray(info, 2),
      event = _info3[0],
      selector = _info3[1];
    var $root = getMountNode();
    actions.forEach(function (item, i) {
      if (event === item.event && selector === item.selector && fn === item.fn) {
        var _event = item.event,
          _selector = item.selector,
          handle = item.handle;
        var _args4 = [_event, _selector, handle].filter(Boolean);
        if (_event[0] === '$') {
          $template.off.apply($template, _toConsumableArray(_args4));
        } else {
          $root.off.apply($root, _toConsumableArray(_args4));
        }
        actions.splice(i, 1);
      }
    });
  }
  function emit(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    // trigger those passed to components, only works for components
    if (outside) {
      var lower = ('@' + event).toLowerCase();
      var key = '@' + event in outside ? '@' + event : Object.keys(outside).find(function (k) {
        return k.toLowerCase() === lower;
      });
      if (key && Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "c"])(outside[key])) {
        var _outside;
        (_outside = outside)[key].apply(_outside, args);
      }
    }

    // only works for events begin with $
    if (event[0] !== '$') {
      return;
    }
    // trigger those bind to view root: один trigger на событие (каждый обработчик вызывается один раз)
    if (actions.some(function (item) {
      return item.event === event;
    })) {
      $template.trigger(event, args);
    }
  }
  function setupSpecialEvents() {
    actions.forEach(function (item) {
      var event = item.event,
        handle = item.handle;
      if (['$init', '$destroy', '$beforeDestroy', '$mount'].indexOf(event) === -1) {
        return;
      }
      $template.one(event, handle);
    });
  }
  function setup() {
    $template.on('$mount', function () {
      var $root = getMountNode();
      actions.forEach(function (item) {
        var once = item.once,
          event = item.event,
          selector = item.selector,
          handle = item.handle;
        if (['$init', '$destroy', '$beforeDestroy', '$mount', '$clone'].indexOf(event) > -1) {
          return;
        }
        var type = once ? 'one' : 'on';
        if (event[0] === '$') {
          $template[type](event, handle);
        } else {
          var info = [event, selector].filter(Boolean);
          $root[type].apply($root, _toConsumableArray(info).concat([handle]));
        }
      });
    });
    $template.on('$unmount', function () {
      var $root = getMountNode();
      actions.forEach(function (item) {
        var event = item.event,
          selector = item.selector,
          handle = item.handle;
        if (event[0] === '$') return;
        var info = [event, selector].filter(Boolean);
        $root.off.apply($root, _toConsumableArray(info).concat([handle]));
      });
    });
  }
  function find(selector) {
    var $root = getMountNode();
    return $root.find(selector);
  }
  function method(name, action) {
    return fn(name, action);
  }
  function fn(name, action) {
    if (!action) {
      return fns[name];
    } else {
      fns[name] = action;
    }
    return view;
  }
  function clone() {
    // свой <template> и своя копия начального состояния на каждый экземпляр
    var newView = vm.call($template.clone(), Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "c"])(initState) ? initState : cloneState(initState));
    Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(fns, function (action, name) {
      newView.fn(name, action);
    });
    Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(actions, function (item) {
      var type = item.type,
        event = item.event,
        selector = item.selector,
        fn = item.fn;
      var info = [event, selector].filter(Boolean);
      var m = type === 'one' ? 'once' : 'on';
      newView[m].apply(newView, _toConsumableArray(info).concat([fn]));
    });
    Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(components, function (item) {
      if (globalComponents.includes(item)) {
        return;
      }
      newView.component.apply(newView, _toConsumableArray(item));
    });
    Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(directives, function (item) {
      if (globalDirectives.includes(item)) {
        return;
      }
      newView.directive.apply(newView, _toConsumableArray(item));
    });
    Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(filters, function (fn, name) {
      newView.filter(name, fn);
    });

    // clone action
    actions.forEach(function (item) {
      var event = item.event,
        fn = item.fn;
      if (event !== '$clone') {
        return;
      }
      fn.call(view, state, newView);
    });
    return newView;
  }
  function plugin(fn) {
    var lifecycle = fn.call({
      view: view,
      scope: scope
    });
    if (lifecycle) {
      var events = Object.keys(lifecycle);
      events.forEach(function (event) {
        view.on(event, lifecycle[event]);
      });
    }
    return view;
  }
  Object.assign(view, {
    once: function once() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      bind(args, true);
      return view;
    },
    on: function on() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      bind(args);
      return view;
    },
    off: function off() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      unbind(args);
      return view;
    },
    emit: emit,
    mount: mount,
    unmount: unmount,
    destroy: destroy,
    update: update,
    hold: hold,
    release: release,
    find: find,
    component: component,
    directive: directive,
    filter: filter,
    plugin: plugin,
    fn: fn,
    method: fn,
    clone: clone
  });
  var tempEl = $template[0];
  var tag = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeName */ "d"])(tempEl);
  var attributes = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeAttrs */ "c"])(tempEl);
  Object.defineProperties(view, {
    tag: {
      value: tag
    },
    attributes: {
      value: attributes
    },
    __state: {
      get: function get() {
        return state;
      }
    },
    // для делегированных обработчиков w-on
    __root: {
      get: function get() {
        return rootEl;
      }
    }
  });
  setup();
  return view;
}

// register inside directives

var WFOR_RE = /^[a-z][a-zA-Z0-9_$]*(,[a-z][a-zA-Z0-9_$]*){0,1} in [a-z][a-zA-Z0-9_$]*( traceby [a-z][a-zA-Z0-9_$.]*)?/;
function wFor(el, attrs) {
  var attr = attrs['w-for'];
  if (!WFOR_RE.test(attr)) {
    throw new Error('w-for should match formatter `value,key in data traceby id`!');
  }
  var doc = el.ownerDocument;
  var nodeName = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeName */ "d"])(el);
  var _attr$split = attr.split(' '),
    _attr$split2 = _slicedToArray(_attr$split, 5),
    kv = _attr$split2[0],
    dataKey = _attr$split2[2],
    traceBy = _attr$split2[4];
  var _kv$split = kv.split(','),
    _kv$split2 = _slicedToArray(_kv$split, 2),
    valueName = _kv$split2[0],
    keyName = _kv$split2[1];
  var parentScope = this.scope,
    compile = this.compile;
  var data = parentScope.parse(dataKey);
  if (config.debug && Array.isArray(data) && data.length === 0) {
    report("w-for \xAB".concat(attr, "\xBB: \u043C\u0430\u0441\u0441\u0438\u0432 \u043F\u0443\u0441\u0442\u043E\u0439, \u043E\u0442\u0440\u0438\u0441\u043E\u0432\u044B\u0432\u0430\u0442\u044C \u043D\u0435\u0447\u0435\u0433\u043E"), {
      view: this.view,
      el: el,
      expr: dataKey,
      scope: parentScope,
      hint: 'Если данные грузятся асинхронно, проверьте, что они дошли до этого компонента (см. пропсы)'
    });
  }

  // make it not be able to compile again
  el.removeAttribute('w-for');
  if (traceBy) {
    el.setAttribute('data-id', "{{".concat(traceBy, "}}")); // modify the template, this will be compiled
  }

  // глобальный ключ: один и тот же список в разных контейнерах (колонки канбана) даёт совместимые ключи,
  // поэтому keyed diff переносит узел и компонент между контейнерами
  var keyScope = nodeName + '|' + dataKey + '|' + traceBy;
  var frag = doc.createDocumentFragment();
  frag.appendChild(doc.createComment(" ".concat(nodeName, " w-for=\"").concat(attr, "\" begin ")));
  var temp = el.outerHTML;
  Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(data) ? [] : data, function (value, key) {
    var newScope = _defineProperty({}, valueName, value);
    if (keyName) {
      newScope[keyName] = key;
    }
    var scope = parentScope.$new(newScope);
    var nodes = compile(temp, scope, true);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (traceBy && n.nodeType === 1) {
        var id = n.getAttribute('data-id');
        if (id !== null) n.__wKey = 'g|' + keyScope + '|' + id;
      }
      frag.appendChild(n);
    }
  });
  frag.appendChild(doc.createComment(" ".concat(nodeName, " w-for=\"").concat(attr, "\" end ")));
  el.replaceWith(frag);
}
wFor["native"] = true;
directive('w-for', wFor);
function sanitizeSvg(str) {
  var tpl = document.createElement('template');
  tpl.innerHTML = str;
  tpl.content.querySelectorAll('script,foreignObject,iframe,object,embed,style,animate,set').forEach(function (n) {
    return n.remove();
  });
  tpl.content.querySelectorAll('*').forEach(function (el) {
    ;
    _toConsumableArray(el.attributes).forEach(function (_ref0) {
      var name = _ref0.name,
        value = _ref0.value;
      var n = name.toLowerCase();
      var v = value.trim().toLowerCase();
      var badHref = (n === 'href' || n === 'xlink:href') && !v.startsWith('#');
      if (n.startsWith('on') || badHref) {
        el.removeAttribute(name);
      }
    });
  });
  return tpl.innerHTML;
}
function wHtml(el, attrs) {
  // принимаем и w-html="item.icon", и w-html="{{ item.icon }}"
  var exp = attrs['w-html'].replace(/^\{\{\s*|\s*\}\}$/g, '');
  var ctx = {
    view: this.view,
    el: el,
    attr: 'w-html',
    expr: exp
  };
  var html = safeParse(this.scope, exp, ctx);
  if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(html)) report("w-html \u043F\u043E\u043B\u0443\u0447\u0438\u043B ".concat(html), _objectSpread(_objectSpread({}, ctx), {}, {
    scope: this.scope
  }));
  el.removeAttribute('w-html');
  el.innerHTML = sanitizeSvg(Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(html) ? '' : String(html));
}
wHtml["native"] = true;
directive('w-html', wHtml);
function wIf(el, attrs) {
  var attr = attrs['w-if'];
  var value = this.scope.parse(attr);
  return value ? el : el.ownerDocument.createComment(" ".concat(Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* getNodeName */ "d"])(el), " w-if=\"").concat(attr, "\" (hidden) "));
}
wIf["native"] = true;
directive('w-if', wIf);
function wId(el, attrs) {
  var value = this.scope.parse(attrs['w-id']);
  if (value === null) el.removeAttribute('id');else if (value !== undefined) el.setAttribute('id', value); // как jQuery.attr: undefined ничего не меняет
}
wId["native"] = true;
directive('w-id', wId);
function wClass(el, attrs) {
  var obj = this.scope.parse(attrs['w-class']);
  Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* each */ "a"])(obj, function (value, key) {
    if (value) {
      var _el$classList;
      var names = key.split(/\s+/).filter(Boolean);
      if (names.length) (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(names));
    }
  });
}
wClass["native"] = true;
directive('w-class', wClass);
directive('w-value', null, function ($el, attrs) {
  var attr = attrs['w-value'];
  var value = this.scope.parse(attr);
  $el.val(value);
});
directive('w-disabled', null, function ($el, attrs) {
  var attr = attrs['w-disabled'];
  var value = this.scope.parse(attr);
  $el.prop('disabled', !!value);
});
directive('w-checked', null, function ($el, attrs) {
  var attr = attrs['w-checked'];
  var value = this.scope.parse(attr);
  $el.prop('checked', !!value);
});
directive('w-selected', null, function ($el, attrs) {
  var attr = attrs['w-selected'];
  var value = this.scope.parse(attr);
  $el.prop('selected', !!value);
});
var BIND_CHANGE = '[type=checkbox],[type=radio],[type=color],[type=date],[type=datetime-local],[type=week],[type=file],select';
function bindSync($el, ctx, attrs, data) {
  var attr = attrs['w-bind'];
  var value = ctx.scope.parse(attr);
  data.scope = ctx.scope;
  data.attr = attr;
  if ($el.is('[type=checkbox]')) {
    $el.prop('checked', !!value);
  } else if ($el.is('[type=radio]')) {
    $el.prop('checked', value === $el.val());
  } else {
    $el.val(value);
  }
}
directive('w-bind', {
  mounted: function mounted($el, attrs, data) {
    var el = $el[0];
    var checkbox = el.matches('[type=checkbox]');
    bindSync($el, this, attrs, data);
    // scope и путь обновляются на каждом рендере (w-for пересоздаёт локальный scope), слушатель один
    data.listener = function (e) {
      data.scope.assign(data.attr, checkbox ? el.checked : e.target.value);
    };
    el.addEventListener(el.matches(BIND_CHANGE) ? 'change' : 'input', data.listener);
  },
  updated: function updated($el, attrs, data) {
    bindSync($el, this, attrs, data);
  }
});
directive('w-src', null, function ($el, attrs) {
  var attr = attrs['w-src'];
  var ctx = {
    view: this.view,
    el: $el[0],
    attr: 'w-src',
    expr: attr
  };
  var value = safeParse(this.scope, attr, ctx);
  if (Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "d"])(value)) {
    report("w-src \u043F\u043E\u043B\u0443\u0447\u0438\u043B ".concat(value, ": src \u043D\u0435 \u0432\u044B\u0441\u0442\u0430\u0432\u043B\u0435\u043D, \u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D"), _objectSpread(_objectSpread({}, ctx), {}, {
      scope: this.scope
    }));
    return;
  }
  $el.attr('src', value);
});

// Делегирование: один слушатель на событие на корень view, обработчик ищется по expando элемента (el.__wOn).
// Раньше на каждый рендер для каждого w-on строился путь nth-of-type и заново вешался jQuery-обработчик.
var NON_BUBBLING = ['focus', 'blur', 'mouseenter', 'mouseleave', 'pointerenter', 'pointerleave', 'scroll', 'load', 'error', 'toggle'];
function delegateOn(root, event) {
  var set = root.__wDelegates || (root.__wDelegates = new Set());
  if (set.has(event)) return;
  set.add(event);
  var direct = NON_BUBBLING.indexOf(event) !== -1;
  root.addEventListener(event, function (e) {
    var je = null;
    var _loop3 = function _loop3() {
        if (direct && el !== e.target) return 0; // break
        var h = el.__wOn && el.__wOn[event];
        // обработчик чужого view (компонент внутри нашего DOM) обслуживает его собственный корень
        if (!h || h.root !== root) return 1; // continue
        if (!je) {
          je = $.event && $.event.fix ? $.event.fix(e) : e; // jQuery.Event: originalEvent, which и т.д., как раньше
          if (je !== e) je.delegateTarget = root;
        }
        if (je !== e) je.currentTarget = el;
        var state = h.view.__state;
        var res;
        if (h.params) {
          var _h$fn;
          var args = h.params.map(function (arg) {
            return h.scope.parse(arg);
          });
          res = (_h$fn = h.fn).call.apply(_h$fn, [h.view, state].concat(_toConsumableArray(args)));
        } else {
          res = h.fn.call(h.view, state);
        }
        if (typeof res === 'function') res = res.call(el, je);
        if (res === false) {
          je.preventDefault();
          je.stopPropagation();
        }
        if (je.isPropagationStopped ? je.isPropagationStopped() : e.cancelBubble) return 0; // break
      },
      _ret2;
    for (var el = e.target; el && el !== root; el = el.parentNode) {
      _ret2 = _loop3();
      if (_ret2 === 0) break;
      if (_ret2 === 1) continue;
    }
  }, direct);
}
directive('w-on', null, function ($el, attrs) {
  var el = $el[0];
  var attr = attrs['w-on'];
  var _attr$split3 = attr.split(':'),
    _attr$split4 = _slicedToArray(_attr$split3, 2),
    event = _attr$split4[0],
    method = _attr$split4[1];
  var _parseKey3 = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[/* parseKey */ "e"])(method),
    _parseKey4 = _slicedToArray(_parseKey3, 2),
    name = _parseKey4[0],
    params = _parseKey4[1];
  var view = this.view,
    scope = this.scope;
  var fn = view.fn(name);
  var root = view.__root;
  if (!fn || !root) {
    return;
  }
  var handlers = el.__wOn || (el.__wOn = {});
  handlers[event] = {
    root: root,
    fn: fn,
    params: params,
    scope: scope,
    view: view
  };
  delegateOn(root, event);

  // prepare() вызывает перед следующим рендером: не остаётся обработчиков от пропавших атрибутов
  return function () {
    delete handlers[event];
  };
});
directive('w-transition', null, function ($el, attrs) {
  var el = $el[0];
  // повторный рендер не должен заново гасить уже показанный элемент
  if (el.__wTransitionDone) return;
  el.__wTransitionDone = true;
  var raw = attrs['w-transition'];
  var transition = raw || 'opacity 0.25s ease';
  var hasProp = /(opacity|all|transform)/.test(transition);
  var finalTransition = hasProp ? transition : "opacity ".concat(transition);
  $el.css({
    transition: finalTransition,
    opacity: 0
  });
  var show = function show() {
    return $el.css('opacity', 1);
  };
  if (document.hidden) {
    setTimeout(show, 0);
  } else {
    requestAnimationFrame(function () {
      return requestAnimationFrame(show);
    });
  }
  setTimeout(show, 500); // страховка, если кадры так и не придут

  var originalRemove = el.remove;
  el.remove = function () {
    $el.css('opacity', 0);
    var duration = getComputedStyle(el).transitionDuration;
    var ms = duration.includes('ms') ? parseFloat(duration) : parseFloat(duration) * 1000;
    setTimeout(function () {
      return originalRemove.call(el);
    }, ms || 250);
  };
  return function () {
    el.remove = originalRemove;
  };
});
component('w-static', function () {
  return $('<template><slot></slot></template>').vm().on('$update', function (state, e, prevent) {
    prevent();
  });
});

// --------------------------------

function useJQuery(jQuery) {
  $ = jQuery;
  $.fn.vm = vm;
  $.fn.state = function () {
    return this.vm.apply(this, arguments);
  };
  return $;
}
console.log('[Wex]: загружена версия: ' + WEX_VERSION);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
;
(function (fn) {
  var ScopeX = fn();
  // commonjs
  if (true) {
    exports["default"] = ScopeX;
    exports.ScopeX = ScopeX;
    exports.createScope = ScopeX.createScope;
    exports.__esModule = true;
  }
  // in browser
  else {}
})(function () {
  // fork from https://github.com/peerigon/angular-expressions/blob/master/lib/parse.js

  /* remove eslint errors to see if there is something really wrong */
  /*eslint quotes: [0]*/
  /*eslint indent: [0]*/
  /*eslint vars-on-top: [0]*/
  /*eslint yoda: 0*/
  /*eslint curly: 0*/
  /*eslint no-implicit-coercion: 0*/
  /*eslint newline-after-var: 0*/
  /*eslint space-before-function-paren: 0*/
  /*eslint block-spacing: 0*/
  /*eslint brace-style: 0*/
  /*eslint complexity: 0*/
  /*eslint one-var: 0*/
  /*eslint eqeqeq: 0*/
  /*eslint object-curly-spacing: 0*/
  /*eslint quote-props: 0*/
  /*eslint key-spacing: 0*/
  /*eslint valid-jsdoc: 0*/
  /*eslint func-style: 0*/
  /*eslint no-nested-ternary: 0*/
  /*eslint operator-linebreak: 0*/
  /*eslint no-multi-spaces: 0*/
  /*eslint no-constant-condition: 0*/
  /*eslint comma-spacing: 0*/
  /*eslint no-else-return: 0*/
  /*eslint no-warning-comments: 0*/
  /*eslint default-case: 0*/
  /*eslint consistent-return: 0*/
  /*eslint no-undefined: 0*/
  /*eslint no-new-func: 0*/
  /*eslint max-nested-callbacks: 0*/
  /*eslint padded-blocks: 0*/
  /*eslint no-self-compare: 0*/
  /*eslint no-multiple-empty-lines: 0*/
  /*eslint no-new: 0*/
  /*eslint no-unused-vars: 0*/

  "use strict";

  var window = {
    document: {}
  };

  ////////////////////////////////////

  /**
   * @ngdoc module
   * @name ng
   * @module ng
   * @installation
   * @description
   *
   * # ng (core module)
   * The ng module is loaded by default when an AngularJS application is started. The module itself
   * contains the essential components for an AngularJS application to function. The table below
   * lists a high level breakdown of each of the services/factories, filters, directives and testing
   * components available within this core module.
   *
   * <div doc-module-components="ng"></div>
   */

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var lowercase = function lowercase(string) {
    return isString(string) ? string.toLowerCase() : string;
  };

  /**
   * @ngdoc function
   * @name angular.isArray
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */
  var isArray = Array.isArray;
  var ngAttrPrefixes = ["ng-", "data-ng-", "ng:", "x-ng-"];
  var manualLowercase = function manualLowercase(s) {
    /* eslint-disable no-bitwise */
    return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32);
    }) : s;
    /* eslint-enable */
  };
  var manualUppercase = function manualUppercase(s) {
    /* eslint-disable no-bitwise */
    return isString(s) ? s.replace(/[a-z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) & ~32);
    }) : s;
    /* eslint-enable */
  };

  // String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
  // locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
  // with correct but slower alternatives. See https://github.com/angular/angular.js/issues/11387
  if ("i" !== "I".toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }
  var jqLite,
    // delay binding since jQuery could be loaded after us.
    jQuery,
    // delay binding
    toString = Object.prototype.toString,
    getPrototypeOf = Object.getPrototypeOf,
    ngMinErr = minErr("ng"),
    /** @name angular */
    angular = window.angular || (window.angular = {}),
    uid = 0;

  /**
   * @private
   * @param {*} obj
   * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
   *                   String ...)
   */
  function isArrayLike(obj) {
    // `null`, `undefined` and `window` are not array-like
    if (obj == null || isWindow(obj)) return false;

    // arrays, strings and jQuery/jqLite objects are array like
    // * jqLite is either the jQuery or jqLite constructor function
    // * we have to check the existence of jqLite first as this method is called
    //   via the forEach method when constructing the jqLite object in the first place
    if (isArray(obj) || isString(obj) || jqLite && obj instanceof jqLite) return true;

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    var length = "length" in Object(obj) && obj.length;

    // NodeList objects (with `item` method) and
    // other objects with suitable length characteristics are array-like
    return isNumber(length) && (length >= 0 && (length - 1 in obj || obj instanceof Array) || typeof obj.item === "function");
  }

  /**
   * @ngdoc function
   * @name angular.forEach
   * @module ng
   * @kind function
   *
   * @description
   * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
   * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
   * is the value of an object property or an array element, `key` is the object property key or
   * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
   *
   * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
   * using the `hasOwnProperty` method.
   *
   * Unlike ES262's
   * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
   * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
   * return the value provided.
   *
   ```js
   var values = {name: 'misko', gender: 'male'};
   var log = [];
   angular.forEach(values, function(value, key) {
   this.push(key + ': ' + value);
   }, log);
   expect(log).toEqual(['name: misko', 'gender: male']);
   ```
   *
   * @param {Object|Array} obj Object to iterate over.
   * @param {Function} iterator Iterator function.
   * @param {Object=} context Object to become context (`this`) for the iterator function.
   * @returns {Object|Array} Reference to `obj`.
   */
  function forEach(obj, iterator, context) {
    var key, length;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== "prototype" && key !== "length" && key !== "name" && obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = _typeof(obj) !== "object";
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
        // eslint-disable-next-line guard-for-in
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === "function") {
        // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        // Slow path for objects which do not have a method `hasOwnProperty`
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }

  /**
   * Set or clear the hashkey for an object.
   * @param obj object
   * @param h the hashkey (!truthy to delete the hashkey)
   */
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  /**
   * @ngdoc function
   * @name angular.noop
   * @module ng
   * @kind function
   *
   * @description
   * A function that performs no operations. This function can be useful when writing code in the
   * functional style.
   ```js
   function foo(callback) {
   var result = calculateResult();
   (callback || angular.noop)(result);
   }
   ```
   */
  function noop() {}
  noop.$inject = [];

  /**
   * @ngdoc function
   * @name angular.isUndefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */
  function isUndefined(value) {
    return typeof value === "undefined";
  }

  /**
   * @ngdoc function
   * @name angular.isDefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */
  function isDefined(value) {
    return typeof value !== "undefined";
  }

  /**
   * @ngdoc function
   * @name angular.isObject
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects. Note that JavaScript arrays are objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */
  function isObject(value) {
    // http://jsperf.com/isobject4
    return value !== null && _typeof(value) === "object";
  }

  /**
   * Determine if a value is an object with a null prototype
   *
   * @returns {boolean} True if `value` is an `Object` with a null prototype
   */
  function isBlankObject(value) {
    return value !== null && _typeof(value) === "object" && !getPrototypeOf(value);
  }

  /**
   * @ngdoc function
   * @name angular.isString
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */
  function isString(value) {
    return typeof value === "string";
  }

  /**
   * @ngdoc function
   * @name angular.isNumber
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Number`.
   *
   * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
   *
   * If you wish to exclude these then you can use the native
   * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
   * method.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Number`.
   */
  function isNumber(value) {
    return typeof value === "number";
  }

  /**
   * @ngdoc function
   * @name angular.isFunction
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  function isFunction(value) {
    return typeof value === "function";
  }

  /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */
  function isWindow(obj) {
    return obj && obj.window === obj;
  }
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;
  function isTypedArray(value) {
    return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
  }
  function isArrayBuffer(obj) {
    return toString.call(obj) === "[object ArrayBuffer]";
  }

  /**
   * @ngdoc function
   * @name angular.copy
   * @module ng
   * @kind function
   *
   * @description
   * Creates a deep copy of `source`, which should be an object or an array.
   *
   * * If no destination is supplied, a copy of the object or array is created.
   * * If a destination is provided, all of its elements (for arrays) or properties (for objects)
   *   are deleted and then all elements/properties from the source are copied to it.
   * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
   * * If `source` is identical to `destination` an exception will be thrown.
   *
   * <br />
   * <div class="alert alert-warning">
   *   Only enumerable properties are taken into account. Non-enumerable properties (both on `source`
   *   and on `destination`) will be ignored.
   * </div>
   *
   * @param {*} source The source that will be used to make a copy.
   *                   Can be any type, including primitives, `null`, and `undefined`.
   * @param {(Object|Array)=} destination Destination into which the source is copied. If
   *     provided, must be of the same type as `source`.
   * @returns {*} The copy or updated `destination`, if `destination` was specified.
   *
   * @example
   <example module="copyExample" name="angular-copy">
   <file name="index.html">
   <div ng-controller="ExampleController">
   <form novalidate class="simple-form">
   <label>Name: <input type="text" ng-model="user.name" /></label><br />
   <label>Age:  <input type="number" ng-model="user.age" /></label><br />
   Gender: <label><input type="radio" ng-model="user.gender" value="male" />male</label>
   <label><input type="radio" ng-model="user.gender" value="female" />female</label><br />
   <button ng-click="reset()">RESET</button>
   <button ng-click="update(user)">SAVE</button>
   </form>
   <pre>form = {{user | json}}</pre>
   <pre>master = {{master | json}}</pre>
   </div>
   </file>
   <file name="script.js">
   // Module: copyExample
   angular.
   module('copyExample', []).
   controller('ExampleController', ['$scope', function($scope) {
   $scope.master = {};
     $scope.reset = function() {
   // Example with 1 argument
   $scope.user = angular.copy($scope.master);
   };
     $scope.update = function(user) {
   // Example with 2 arguments
   angular.copy(user, $scope.master);
   };
     $scope.reset();
   }]);
   </file>
   </example>
   */
  function copy(source, destination) {
    var stackSource = [];
    var stackDest = [];
    if (destination) {
      if (isTypedArray(destination) || isArrayBuffer(destination)) {
        throw ngMinErr("cpta", "Can't copy! TypedArray destination cannot be mutated.");
      }
      if (source === destination) {
        throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
      }

      // Empty the destination object
      if (isArray(destination)) {
        destination.length = 0;
      } else {
        forEach(destination, function (value, key) {
          if (key !== "$$hashKey") {
            delete destination[key];
          }
        });
      }
      stackSource.push(source);
      stackDest.push(destination);
      return copyRecurse(source, destination);
    }
    return copyElement(source);
    function copyRecurse(source, destination) {
      var h = destination.$$hashKey;
      var key;
      if (isArray(source)) {
        for (var i = 0, ii = source.length; i < ii; i++) {
          destination.push(copyElement(source[i]));
        }
      } else if (isBlankObject(source)) {
        // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
        // eslint-disable-next-line guard-for-in
        for (key in source) {
          destination[key] = copyElement(source[key]);
        }
      } else if (source && typeof source.hasOwnProperty === "function") {
        // Slow path, which must rely on hasOwnProperty
        for (key in source) {
          if (source.hasOwnProperty(key)) {
            destination[key] = copyElement(source[key]);
          }
        }
      } else {
        // Slowest path --- hasOwnProperty can't be called as a method
        for (key in source) {
          if (hasOwnProperty.call(source, key)) {
            destination[key] = copyElement(source[key]);
          }
        }
      }
      setHashKey(destination, h);
      return destination;
    }
    function copyElement(source) {
      // Simple values
      if (!isObject(source)) {
        return source;
      }

      // Already copied values
      var index = stackSource.indexOf(source);
      if (index !== -1) {
        return stackDest[index];
      }
      if (isWindow(source) || isScope(source)) {
        throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
      }
      var needsRecurse = false;
      var destination = copyType(source);
      if (destination === undefined) {
        destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
        needsRecurse = true;
      }
      stackSource.push(source);
      stackDest.push(destination);
      return needsRecurse ? copyRecurse(source, destination) : destination;
    }
    function copyType(source) {
      switch (toString.call(source)) {
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]":
          return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);
        case "[object ArrayBuffer]":
          // Support: IE10
          if (!source.slice) {
            // If we're in this case we know the environment supports ArrayBuffer
            /* eslint-disable no-undef */
            var copied = new ArrayBuffer(source.byteLength);
            new Uint8Array(copied).set(new Uint8Array(source));
            /* eslint-enable */
            return copied;
          }
          return source.slice(0);
        case "[object Boolean]":
        case "[object Number]":
        case "[object String]":
        case "[object Date]":
          return new source.constructor(source.valueOf());
        case "[object RegExp]":
          var re = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
          re.lastIndex = source.lastIndex;
          return re;
        case "[object Blob]":
          return new source.constructor([source], {
            type: source.type
          });
      }
      if (isFunction(source.cloneNode)) {
        return source.cloneNode(true);
      }
    }
  }

  /**
   * @ngdoc directive
   * @module ng
   * @name ngJq
   *
   * @element ANY
   * @param {string=} ngJq the name of the library available under `window`
   * to be used for angular.element
   * @description
   * Use this directive to force the angular.element library.  This should be
   * used to force either jqLite by leaving ng-jq blank or setting the name of
   * the jquery variable under window (eg. jQuery).
   *
   * Since angular looks for this directive when it is loaded (doesn't wait for the
   * DOMContentLoaded event), it must be placed on an element that comes before the script
   * which loads angular. Also, only the first instance of `ng-jq` will be used and all
   * others ignored.
   *
   * @example
   * This example shows how to force jqLite using the `ngJq` directive to the `html` tag.
   ```html
   <!doctype html>
   <html ng-app ng-jq>
   ...
   ...
   </html>
   ```
   * @example
   * This example shows how to use a jQuery based library of a different name.
   * The library name must be available at the top most 'window'.
   ```html
   <!doctype html>
   <html ng-app ng-jq="jQueryLib">
   ...
   ...
   </html>
   ```
   */
  var _jq = function jq() {
    if (isDefined(_jq.name_)) return _jq.name_;
    var el;
    var i,
      ii = ngAttrPrefixes.length,
      prefix,
      name;
    for (i = 0; i < ii; ++i) {
      prefix = ngAttrPrefixes[i];
      el = window.document.querySelector("[" + prefix.replace(":", "\\:") + "jq]");
      if (el) {
        name = el.getAttribute(prefix + "jq");
        break;
      }
    }
    return _jq.name_ = name;
  };
  function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === "string" && key.charAt(0) === "$" && key.charAt(1) === "$") {
      val = undefined;
    } else if (isWindow(value)) {
      val = "$WINDOW";
    } else if (value && window.document === value) {
      val = "$DOCUMENT";
    } else if (isScope(value)) {
      val = "$SCOPE";
    }
    return val;
  }

  /////////////////////////////////////////////////

  /**
   * Creates a new object without a prototype. This object is useful for lookup without having to
   * guard against prototypically inherited properties via hasOwnProperty.
   *
   * Related micro-benchmarks:
   * - http://jsperf.com/object-create2
   * - http://jsperf.com/proto-map-lookup/2
   * - http://jsperf.com/for-in-vs-object-keys2
   *
   * @returns {Object}
   */
  function createMap() {
    return Object.create(null);
  }

  /* global toDebugString: true */

  function serializeObject(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, val) {
      val = toJsonReplacer(key, val);
      if (isObject(val)) {
        if (seen.indexOf(val) >= 0) return "...";
        seen.push(val);
      }
      return val;
    });
  }
  function toDebugString(obj) {
    if (typeof obj === "function") {
      return obj.toString().replace(/ \{[\s\S]*$/, "");
    } else if (isUndefined(obj)) {
      return "undefined";
    } else if (typeof obj !== "string") {
      return serializeObject(obj);
    }
    return obj;
  }

  /**
   * @description
   *
   * This object provides a utility for producing rich Error messages within
   * Angular. It can be called as follows:
   *
   * var exampleMinErr = minErr('example');
   * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
   *
   * The above creates an instance of minErr in the example namespace. The
   * resulting error will have a namespaced error code of example.one.  The
   * resulting error will replace {0} with the value of foo, and {1} with the
   * value of bar. The object is not restricted in the number of arguments it can
   * take.
   *
   * If fewer arguments are specified than necessary for interpolation, the extra
   * interpolation markers will be preserved in the final string.
   *
   * Since data will be parsed statically during a build step, some restrictions
   * are applied with respect to how minErr instances are created and called.
   * Instances should have names of the form namespaceMinErr for a minErr created
   * using minErr('namespace') . Error codes, namespaces and template strings
   * should all be static strings, not variables or general expressions.
   *
   * @param {string} module The namespace to use for the new minErr instance.
   * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
   *   error from returned function, for cases when a particular type of error is useful.
   * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
   */

  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function () {
      var SKIP_INDEXES = 2;
      var templateArgs = arguments,
        code = templateArgs[0],
        message = "[" + (module ? module + ":" : "") + code + "] ",
        template = templateArgs[1],
        paramPrefix,
        i;
      message += template.replace(/\{\d+\}/g, function (match) {
        var index = +match.slice(1, -1),
          shiftedIndex = index + SKIP_INDEXES;
        if (shiftedIndex < templateArgs.length) {
          return toDebugString(templateArgs[shiftedIndex]);
        }
        return match;
      });
      message += '\nhttp://errors.angularjs.org/1.6.9/' + (module ? module + "/" : "") + code;
      for (i = SKIP_INDEXES, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") {
        message += paramPrefix + "p" + (i - SKIP_INDEXES) + "=" + encodeURIComponent(toDebugString(templateArgs[i]));
      }
      return new ErrorConstructor(message);
    };
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *     Any commits to this file should be reviewed with security in mind.  *
   *   Changes to this file can potentially create security vulnerabilities. *
   *          An approval from 2 Core members with history of modifying      *
   *                         this file is required.                          *
   *                                                                         *
   *  Does the change somehow allow for arbitrary javascript to be executed? *
   *    Or allows for someone to change the prototype of built-in objects?   *
   *     Or gives undesired access to variables likes document or window?    *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  var $parseMinErr = minErr("$parse");

  // Sandboxing Angular Expressions
  // ------------------------------
  // Angular expressions are no longer sandboxed. So it is now even easier to access arbitrary JS code by
  // various means such as obtaining a reference to native JS functions like the Function constructor.
  //
  // As an example, consider the following Angular expression:
  //
  //   {}.toString.constructor('alert("evil JS code")')
  //
  // It is important to realize that if you create an expression from a string that contains user provided
  // content then it is possible that your application contains a security vulnerability to an XSS style attack.
  //
  // See https://docs.angularjs.org/guide/security

  function getStringValue(name) {
    // Property names must be strings. This means that non-string objects cannot be used
    // as keys in an object. Any non-string object, including a number, is typecasted
    // into a string via the toString method.
    // -- MDN, https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Property_accessors#Property_names
    //
    // So, to ensure that we are checking the same `name` that JavaScript would use, we cast it
    // to a string. It's not always possible. If `name` is an object and its `toString` method is
    // 'broken' (doesn't return a string, isn't a function, etc.), an error will be thrown:
    //
    // TypeError: Cannot convert object to primitive value
    //
    // For performance reasons, we don't catch this error here and allow it to propagate up the call
    // stack. Note that you'll get the same error in JavaScript if you try to access a property using
    // such a 'broken' object as a key.
    return name + "";
  }
  var OPERATORS = createMap();
  forEach("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function (operator) {
    OPERATORS[operator] = true;
  });
  var ESCAPE = {
    n: "\n",
    f: "\f",
    r: "\r",
    t: "\t",
    v: "\v",
    "'": "'",
    '"': '"'
  };

  /////////////////////////////////////////

  /**
   * @constructor
   */
  function Lexer(options) {
    this.options = options;
  }
  ;
  Lexer.prototype = {
    constructor: Lexer,
    lex: function lex(text) {
      this.text = text;
      this.index = 0;
      this.tokens = [];
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        if (ch === '"' || ch === "'") {
          this.readString(ch);
        } else if (this.isNumber(ch) || ch === "." && this.isNumber(this.peek())) {
          this.readNumber();
        } else if (this.isIdentifierStart(this.peekMultichar())) {
          this.readIdent();
        } else if (this.is(ch, "(){}[].,;:?")) {
          this.tokens.push({
            index: this.index,
            text: ch
          });
          this.index++;
        } else if (this.isWhitespace(ch)) {
          this.index++;
        } else {
          var ch2 = ch + this.peek();
          var ch3 = ch2 + this.peek(2);
          var op1 = OPERATORS[ch];
          var op2 = OPERATORS[ch2];
          var op3 = OPERATORS[ch3];
          if (op1 || op2 || op3) {
            var token = op3 ? ch3 : op2 ? ch2 : ch;
            this.tokens.push({
              index: this.index,
              text: token,
              operator: true
            });
            this.index += token.length;
          } else {
            this.throwError("Unexpected next character ", this.index, this.index + 1);
          }
        }
      }
      return this.tokens;
    },
    is: function is(ch, chars) {
      return chars.indexOf(ch) !== -1;
    },
    peek: function peek(i) {
      var num = i || 1;
      return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function isNumber(ch) {
      return "0" <= ch && ch <= "9" && typeof ch === "string";
    },
    isWhitespace: function isWhitespace(ch) {
      // IE treats non-breaking space as \u00A0
      return ch === " " || ch === "\r" || ch === "\t" || ch === "\n" || ch === "\v" || ch === "\xA0";
    },
    isIdentifierStart: function isIdentifierStart(ch) {
      return this.options.isIdentifierStart ? this.options.isIdentifierStart(ch, this.codePointAt(ch)) : this.isValidIdentifierStart(ch);
    },
    isValidIdentifierStart: function isValidIdentifierStart(ch) {
      return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || ch === "$";
    },
    isIdentifierContinue: function isIdentifierContinue(ch) {
      return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(ch, this.codePointAt(ch)) : this.isValidIdentifierContinue(ch);
    },
    isValidIdentifierContinue: function isValidIdentifierContinue(ch, cp) {
      return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
    },
    codePointAt: function codePointAt(ch) {
      if (ch.length === 1) return ch.charCodeAt(0);
      // eslint-disable-next-line no-bitwise
      return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 0x35fdc00;
    },
    peekMultichar: function peekMultichar() {
      var ch = this.text.charAt(this.index);
      var peek = this.peek();
      if (!peek) {
        return ch;
      }
      var cp1 = ch.charCodeAt(0);
      var cp2 = peek.charCodeAt(0);
      if (cp1 >= 0xd800 && cp1 <= 0xdbff && cp2 >= 0xdc00 && cp2 <= 0xdfff) {
        return ch + peek;
      }
      return ch;
    },
    isExpOperator: function isExpOperator(ch) {
      return ch === "-" || ch === "+" || this.isNumber(ch);
    },
    throwError: function throwError(error, start, end) {
      end = end || this.index;
      var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
      throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
    },
    readNumber: function readNumber() {
      var number = "";
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = lowercase(this.text.charAt(this.index));
        if (ch === "." || this.isNumber(ch)) {
          number += ch;
        } else {
          var peekCh = this.peek();
          if (ch === "e" && this.isExpOperator(peekCh)) {
            number += ch;
          } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) === "e") {
            number += ch;
          } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) === "e") {
            this.throwError("Invalid exponent");
          } else {
            break;
          }
        }
        this.index++;
      }
      this.tokens.push({
        index: start,
        text: number,
        constant: true,
        value: Number(number)
      });
    },
    readIdent: function readIdent() {
      var start = this.index;
      this.index += this.peekMultichar().length;
      while (this.index < this.text.length) {
        var ch = this.peekMultichar();
        if (!this.isIdentifierContinue(ch)) {
          break;
        }
        this.index += ch.length;
      }
      this.tokens.push({
        index: start,
        text: this.text.slice(start, this.index),
        identifier: true
      });
    },
    readString: function readString(quote) {
      var start = this.index;
      this.index++;
      var string = "";
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        rawString += ch;
        if (escape) {
          if (ch === "u") {
            var hex = this.text.substring(this.index + 1, this.index + 5);
            if (!hex.match(/[\da-f]{4}/i)) {
              this.throwError("Invalid unicode escape [\\u" + hex + "]");
            }
            this.index += 4;
            string += String.fromCharCode(parseInt(hex, 16));
          } else {
            var rep = ESCAPE[ch];
            string = string + (rep || ch);
          }
          escape = false;
        } else if (ch === "\\") {
          escape = true;
        } else if (ch === quote) {
          this.index++;
          this.tokens.push({
            index: start,
            text: rawString,
            constant: true,
            value: string
          });
          return;
        } else {
          string += ch;
        }
        this.index++;
      }
      this.throwError("Unterminated quote", start);
    }
  };
  function AST(lexer, options) {
    this.lexer = lexer;
    this.options = options;
  }
  ;
  AST.Program = "Program";
  AST.ExpressionStatement = "ExpressionStatement";
  AST.AssignmentExpression = "AssignmentExpression";
  AST.ConditionalExpression = "ConditionalExpression";
  AST.LogicalExpression = "LogicalExpression";
  AST.BinaryExpression = "BinaryExpression";
  AST.UnaryExpression = "UnaryExpression";
  AST.CallExpression = "CallExpression";
  AST.MemberExpression = "MemberExpression";
  AST.Identifier = "Identifier";
  AST.Literal = "Literal";
  AST.ArrayExpression = "ArrayExpression";
  AST.Property = "Property";
  AST.ObjectExpression = "ObjectExpression";
  AST.ThisExpression = "ThisExpression";
  AST.LocalsExpression = "LocalsExpression";

  // Internal use only
  AST.NGValueParameter = "NGValueParameter";
  AST.prototype = {
    ast: function ast(text) {
      this.text = text;
      this.tokens = this.lexer.lex(text);
      var value = this.program();
      if (this.tokens.length !== 0) {
        this.throwError("is an unexpected token", this.tokens[0]);
      }
      return value;
    },
    program: function program() {
      var body = [];
      while (true) {
        if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]")) body.push(this.expressionStatement());
        if (!this.expect(";")) {
          return {
            type: AST.Program,
            body: body
          };
        }
      }
    },
    expressionStatement: function expressionStatement() {
      return {
        type: AST.ExpressionStatement,
        expression: this.filterChain()
      };
    },
    filterChain: function filterChain() {
      var left = this.expression();
      while (this.expect("|")) {
        left = this.filter(left);
      }
      return left;
    },
    expression: function expression() {
      return this.assignment();
    },
    assignment: function assignment() {
      var result = this.ternary();
      if (this.expect("=")) {
        if (!isAssignable(result)) {
          throw $parseMinErr("lval", "Trying to assign a value to a non l-value");
        }
        result = {
          type: AST.AssignmentExpression,
          left: result,
          right: this.assignment(),
          operator: "="
        };
      }
      return result;
    },
    ternary: function ternary() {
      var test = this.logicalOR();
      var alternate;
      var consequent;
      if (this.expect("?")) {
        alternate = this.expression();
        if (this.consume(":")) {
          consequent = this.expression();
          return {
            type: AST.ConditionalExpression,
            test: test,
            alternate: alternate,
            consequent: consequent
          };
        }
      }
      return test;
    },
    logicalOR: function logicalOR() {
      var left = this.logicalAND();
      while (this.expect("||")) {
        left = {
          type: AST.LogicalExpression,
          operator: "||",
          left: left,
          right: this.logicalAND()
        };
      }
      return left;
    },
    logicalAND: function logicalAND() {
      var left = this.equality();
      while (this.expect("&&")) {
        left = {
          type: AST.LogicalExpression,
          operator: "&&",
          left: left,
          right: this.equality()
        };
      }
      return left;
    },
    equality: function equality() {
      var left = this.relational();
      var token;
      while (token = this.expect("==", "!=", "===", "!==")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.relational()
        };
      }
      return left;
    },
    relational: function relational() {
      var left = this.additive();
      var token;
      while (token = this.expect("<", ">", "<=", ">=")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.additive()
        };
      }
      return left;
    },
    additive: function additive() {
      var left = this.multiplicative();
      var token;
      while (token = this.expect("+", "-")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.multiplicative()
        };
      }
      return left;
    },
    multiplicative: function multiplicative() {
      var left = this.unary();
      var token;
      while (token = this.expect("*", "/", "%")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.unary()
        };
      }
      return left;
    },
    unary: function unary() {
      var token;
      if (token = this.expect("+", "-", "!")) {
        return {
          type: AST.UnaryExpression,
          operator: token.text,
          prefix: true,
          argument: this.unary()
        };
      } else {
        return this.primary();
      }
    },
    primary: function primary() {
      var primary;
      if (this.expect("(")) {
        primary = this.filterChain();
        this.consume(")");
      } else if (this.expect("[")) {
        primary = this.arrayDeclaration();
      } else if (this.expect("{")) {
        primary = this.object();
      } else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
        primary = copy(this.selfReferential[this.consume().text]);
      } else if (this.options.literals.hasOwnProperty(this.peek().text)) {
        primary = {
          type: AST.Literal,
          value: this.options.literals[this.consume().text]
        };
      } else if (this.peek().identifier) {
        primary = this.identifier();
      } else if (this.peek().constant) {
        primary = this.constant();
      } else {
        this.throwError("not a primary expression", this.peek());
      }
      var next;
      while (next = this.expect("(", "[", ".")) {
        if (next.text === "(") {
          primary = {
            type: AST.CallExpression,
            callee: primary,
            arguments: this.parseArguments()
          };
          this.consume(")");
        } else if (next.text === "[") {
          primary = {
            type: AST.MemberExpression,
            object: primary,
            property: this.expression(),
            computed: true
          };
          this.consume("]");
        } else if (next.text === ".") {
          primary = {
            type: AST.MemberExpression,
            object: primary,
            property: this.identifier(),
            computed: false
          };
        } else {
          this.throwError("IMPOSSIBLE");
        }
      }
      return primary;
    },
    filter: function filter(baseExpression) {
      var args = [baseExpression];
      var result = {
        type: AST.CallExpression,
        callee: this.identifier(),
        arguments: args,
        filter: true
      };
      while (this.expect(":")) {
        args.push(this.expression());
      }
      return result;
    },
    parseArguments: function parseArguments() {
      var args = [];
      if (this.peekToken().text !== ")") {
        do {
          args.push(this.filterChain());
        } while (this.expect(","));
      }
      return args;
    },
    identifier: function identifier() {
      var token = this.consume();
      if (!token.identifier) {
        this.throwError("is not a valid identifier", token);
      }
      return {
        type: AST.Identifier,
        name: token.text
      };
    },
    constant: function constant() {
      // TODO check that it is a constant
      return {
        type: AST.Literal,
        value: this.consume().value
      };
    },
    arrayDeclaration: function arrayDeclaration() {
      var elements = [];
      if (this.peekToken().text !== "]") {
        do {
          if (this.peek("]")) {
            // Support trailing commas per ES5.1.
            break;
          }
          elements.push(this.expression());
        } while (this.expect(","));
      }
      this.consume("]");
      return {
        type: AST.ArrayExpression,
        elements: elements
      };
    },
    object: function object() {
      var properties = [],
        property;
      if (this.peekToken().text !== "}") {
        do {
          if (this.peek("}")) {
            // Support trailing commas per ES5.1.
            break;
          }
          property = {
            type: AST.Property,
            kind: "init"
          };
          if (this.peek().constant) {
            property.key = this.constant();
            property.computed = false;
            this.consume(":");
            property.value = this.expression();
          } else if (this.peek().identifier) {
            property.key = this.identifier();
            property.computed = false;
            if (this.peek(":")) {
              this.consume(":");
              property.value = this.expression();
            } else {
              property.value = property.key;
            }
          } else if (this.peek("[")) {
            this.consume("[");
            property.key = this.expression();
            this.consume("]");
            property.computed = true;
            this.consume(":");
            property.value = this.expression();
          } else {
            this.throwError("invalid key", this.peek());
          }
          properties.push(property);
        } while (this.expect(","));
      }
      this.consume("}");
      return {
        type: AST.ObjectExpression,
        properties: properties
      };
    },
    throwError: function throwError(msg, token) {
      throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    consume: function consume(e1) {
      if (this.tokens.length === 0) {
        throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
      }
      var token = this.expect(e1);
      if (!token) {
        this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
      }
      return token;
    },
    peekToken: function peekToken() {
      if (this.tokens.length === 0) {
        throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
      }
      return this.tokens[0];
    },
    peek: function peek(e1, e2, e3, e4) {
      return this.peekAhead(0, e1, e2, e3, e4);
    },
    peekAhead: function peekAhead(i, e1, e2, e3, e4) {
      if (this.tokens.length > i) {
        var token = this.tokens[i];
        var t = token.text;
        if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
          return token;
        }
      }
      return false;
    },
    expect: function expect(e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
        this.tokens.shift();
        return token;
      }
      return false;
    },
    selfReferential: {
      "this": {
        type: AST.ThisExpression
      },
      $locals: {
        type: AST.LocalsExpression
      }
    }
  };
  function ifDefined(v, d) {
    return typeof v !== "undefined" ? v : d;
  }
  function plusFn(l, r) {
    if (typeof l === "undefined") return r;
    if (typeof r === "undefined") return l;
    return l + r;
  }
  function isStateless($filter, filterName) {
    var fn = $filter(filterName);
    return !fn.$stateful;
  }
  function findConstantAndWatchExpressions(ast, $filter) {
    var allConstants;
    var argsToWatch;
    var isStatelessFilter;
    switch (ast.type) {
      case AST.Program:
        allConstants = true;
        forEach(ast.body, function (expr) {
          findConstantAndWatchExpressions(expr.expression, $filter);
          allConstants = allConstants && expr.expression.constant;
        });
        ast.constant = allConstants;
        break;
      case AST.Literal:
        ast.constant = true;
        ast.toWatch = [];
        break;
      case AST.UnaryExpression:
        findConstantAndWatchExpressions(ast.argument, $filter);
        ast.constant = ast.argument.constant;
        ast.toWatch = ast.argument.toWatch;
        break;
      case AST.BinaryExpression:
        findConstantAndWatchExpressions(ast.left, $filter);
        findConstantAndWatchExpressions(ast.right, $filter);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
        break;
      case AST.LogicalExpression:
        findConstantAndWatchExpressions(ast.left, $filter);
        findConstantAndWatchExpressions(ast.right, $filter);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.ConditionalExpression:
        findConstantAndWatchExpressions(ast.test, $filter);
        findConstantAndWatchExpressions(ast.alternate, $filter);
        findConstantAndWatchExpressions(ast.consequent, $filter);
        ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.Identifier:
        ast.constant = false;
        ast.toWatch = [ast];
        break;
      case AST.MemberExpression:
        findConstantAndWatchExpressions(ast.object, $filter);
        if (ast.computed) {
          findConstantAndWatchExpressions(ast.property, $filter);
        }
        ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
        ast.toWatch = [ast];
        break;
      case AST.CallExpression:
        isStatelessFilter = ast.filter ? isStateless($filter, ast.callee.name) : false;
        allConstants = isStatelessFilter;
        argsToWatch = [];
        forEach(ast.arguments, function (expr) {
          findConstantAndWatchExpressions(expr, $filter);
          allConstants = allConstants && expr.constant;
          if (!expr.constant) {
            argsToWatch.push.apply(argsToWatch, expr.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
        break;
      case AST.AssignmentExpression:
        findConstantAndWatchExpressions(ast.left, $filter);
        findConstantAndWatchExpressions(ast.right, $filter);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = [ast];
        break;
      case AST.ArrayExpression:
        allConstants = true;
        argsToWatch = [];
        forEach(ast.elements, function (expr) {
          findConstantAndWatchExpressions(expr, $filter);
          allConstants = allConstants && expr.constant;
          if (!expr.constant) {
            argsToWatch.push.apply(argsToWatch, expr.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = argsToWatch;
        break;
      case AST.ObjectExpression:
        allConstants = true;
        argsToWatch = [];
        forEach(ast.properties, function (property) {
          findConstantAndWatchExpressions(property.value, $filter);
          allConstants = allConstants && property.value.constant && !property.computed;
          if (!property.value.constant) {
            argsToWatch.push.apply(argsToWatch, property.value.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = argsToWatch;
        break;
      case AST.ThisExpression:
        ast.constant = false;
        ast.toWatch = [];
        break;
      case AST.LocalsExpression:
        ast.constant = false;
        ast.toWatch = [];
        break;
    }
  }
  function getInputs(body) {
    if (body.length !== 1) return;
    var lastExpression = body[0].expression;
    var candidate = lastExpression.toWatch;
    if (candidate.length !== 1) return candidate;
    return candidate[0] !== lastExpression ? candidate : undefined;
  }
  function isAssignable(ast) {
    return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
  }
  function assignableAST(ast) {
    if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
      return {
        type: AST.AssignmentExpression,
        left: ast.body[0].expression,
        right: {
          type: AST.NGValueParameter
        },
        operator: "="
      };
    }
  }
  function isLiteral(ast) {
    return ast.body.length === 0 || ast.body.length === 1 && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression);
  }
  function isConstant(ast) {
    return ast.constant;
  }
  function ASTCompiler(astBuilder, $filter) {
    this.astBuilder = astBuilder;
    this.$filter = $filter;
  }
  ASTCompiler.prototype = {
    compile: function compile(expression) {
      var self = this;
      var ast = this.astBuilder.ast(expression);
      this.state = {
        nextId: 0,
        filters: {},
        fn: {
          vars: [],
          body: [],
          own: {}
        },
        assign: {
          vars: [],
          body: [],
          own: {}
        },
        inputs: []
      };
      findConstantAndWatchExpressions(ast, self.$filter);
      var extra = "";
      var assignable;
      this.stage = "assign";
      if (assignable = assignableAST(ast)) {
        this.state.computing = "assign";
        var result = this.nextId();
        this.recurse(assignable, result);
        this.return_(result);
        extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
      }
      var toWatch = getInputs(ast.body);
      self.stage = "inputs";
      forEach(toWatch, function (watch, key) {
        var fnKey = "fn" + key;
        self.state[fnKey] = {
          vars: [],
          body: [],
          own: {}
        };
        self.state.computing = fnKey;
        var intoId = self.nextId();
        self.recurse(watch, intoId);
        self.return_(intoId);
        self.state.inputs.push(fnKey);
        watch.watchId = key;
      });
      this.state.computing = "fn";
      this.stage = "main";
      this.recurse(ast);
      var fnString =
      // The build and minification steps remove the string "use strict" from the code, but this is done using a regex.
      // This is a workaround for this until we do a better job at only removing the prefix only when we should.
      '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + extra + this.watchFns() + "return fn;";
      // eslint-disable-next-line no-new-func
      var fn = new Function("$filter", "getStringValue", "ifDefined", "plus", fnString)(this.$filter, getStringValue, ifDefined, plusFn);
      this.state = this.stage = undefined;
      fn.ast = ast;
      fn.literal = isLiteral(ast);
      fn.constant = isConstant(ast);
      return fn;
    },
    USE: "use",
    STRICT: "strict",
    watchFns: function watchFns() {
      var result = [];
      var fns = this.state.inputs;
      var self = this;
      forEach(fns, function (name) {
        result.push("var " + name + "=" + self.generateFunction(name, "s"));
      });
      if (fns.length) {
        result.push("fn.inputs=[" + fns.join(",") + "];");
      }
      return result.join("");
    },
    generateFunction: function generateFunction(name, params) {
      return "function(" + params + "){" + this.varsPrefix(name) + this.body(name) + "};";
    },
    filterPrefix: function filterPrefix() {
      var parts = [];
      var self = this;
      forEach(this.state.filters, function (id, filter) {
        parts.push(id + "=$filter(" + self.escape(filter) + ")");
      });
      if (parts.length) return "var " + parts.join(",") + ";";
      return "";
    },
    varsPrefix: function varsPrefix(section) {
      return this.state[section].vars.length ? "var " + this.state[section].vars.join(",") + ";" : "";
    },
    body: function body(section) {
      return this.state[section].body.join("");
    },
    recurse: function recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var left,
        right,
        self = this,
        args,
        expression,
        computed;
      recursionFn = recursionFn || noop;
      if (!skipWatchIdCheck && isDefined(ast.watchId)) {
        intoId = intoId || this.nextId();
        this.if_("i", this.lazyAssign(intoId, this.unsafeComputedMember("i", ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true));
        return;
      }
      switch (ast.type) {
        case AST.Program:
          forEach(ast.body, function (expression, pos) {
            self.recurse(expression.expression, undefined, undefined, function (expr) {
              right = expr;
            });
            if (pos !== ast.body.length - 1) {
              self.current().body.push(right, ";");
            } else {
              self.return_(right);
            }
          });
          break;
        case AST.Literal:
          expression = this.escape(ast.value);
          this.assign(intoId, expression);
          recursionFn(intoId || expression);
          break;
        case AST.UnaryExpression:
          this.recurse(ast.argument, undefined, undefined, function (expr) {
            right = expr;
          });
          expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
          this.assign(intoId, expression);
          recursionFn(expression);
          break;
        case AST.BinaryExpression:
          this.recurse(ast.left, undefined, undefined, function (expr) {
            left = expr;
          });
          this.recurse(ast.right, undefined, undefined, function (expr) {
            right = expr;
          });
          if (ast.operator === "+") {
            expression = this.plus(left, right);
          } else if (ast.operator === "-") {
            expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
          } else {
            expression = "(" + left + ")" + ast.operator + "(" + right + ")";
          }
          this.assign(intoId, expression);
          recursionFn(expression);
          break;
        case AST.LogicalExpression:
          intoId = intoId || this.nextId();
          self.recurse(ast.left, intoId);
          self.if_(ast.operator === "&&" ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
          recursionFn(intoId);
          break;
        case AST.ConditionalExpression:
          intoId = intoId || this.nextId();
          self.recurse(ast.test, intoId);
          self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
          recursionFn(intoId);
          break;
        case AST.Identifier:
          intoId = intoId || this.nextId();
          if (nameId) {
            nameId.context = self.stage === "inputs" ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", ast.name) + "?l:s");
            nameId.computed = false;
            nameId.name = ast.name;
          }
          self.if_(self.stage === "inputs" || self.not(self.getHasOwnProperty("l", ast.name)), function () {
            self.if_(self.stage === "inputs" || self.and_("s", self.or_(self.isNull(self.nonComputedMember("s", ast.name)), self.has_("s", ast.name))), function () {
              if (create && create !== 1) {
                self.if_(self.isNull(self.nonComputedMember("s", ast.name)), self.lazyAssign(self.nonComputedMember("s", ast.name), "{}"));
              }
              self.assign(intoId, self.nonComputedMember("s", ast.name));
            });
          }, intoId && self.lazyAssign(intoId, self.nonComputedMember("l", ast.name)));
          recursionFn(intoId);
          break;
        case AST.MemberExpression:
          left = nameId && (nameId.context = this.nextId()) || this.nextId();
          intoId = intoId || this.nextId();
          self.recurse(ast.object, left, undefined, function () {
            var member = null;
            var inAssignment = self.current().inAssignment;
            if (ast.computed) {
              right = self.nextId();
              if (inAssignment || self.state.computing === "assign") {
                member = self.unsafeComputedMember(left, right);
              } else {
                member = self.computedMember(left, right);
              }
            } else {
              if (inAssignment || self.state.computing === "assign") {
                member = self.unsafeNonComputedMember(left, ast.property.name);
              } else {
                member = self.nonComputedMember(left, ast.property.name);
              }
              right = ast.property.name;
            }
            if (ast.computed) {
              if (ast.property.type === AST.Literal) {
                self.recurse(ast.property, right);
              }
            }
            self.if_(self.and_(self.notNull(left), self.or_(self.isNull(member), self.has_(left, right, ast.computed))), function () {
              if (ast.computed) {
                if (ast.property.type !== AST.Literal) {
                  self.recurse(ast.property, right);
                }
                if (create && create !== 1) {
                  self.if_(self.not(member), self.lazyAssign(member, "{}"));
                }
                self.assign(intoId, member);
                if (nameId) {
                  nameId.computed = true;
                  nameId.name = right;
                }
              } else {
                if (create && create !== 1) {
                  self.if_(self.isNull(member), self.lazyAssign(member, "{}"));
                }
                self.assign(intoId, member);
                if (nameId) {
                  nameId.computed = false;
                  nameId.name = ast.property.name;
                }
              }
            }, function () {
              self.assign(intoId, "undefined");
            });
            recursionFn(intoId);
          }, !!create);
          break;
        case AST.CallExpression:
          intoId = intoId || this.nextId();
          if (ast.filter) {
            right = self.filter(ast.callee.name);
            args = [];
            forEach(ast.arguments, function (expr) {
              var argument = self.nextId();
              self.recurse(expr, argument);
              args.push(argument);
            });
            expression = right + ".call(" + right + "," + args.join(",") + ")";
            self.assign(intoId, expression);
            recursionFn(intoId);
          } else {
            right = self.nextId();
            left = {};
            args = [];
            self.recurse(ast.callee, right, left, function () {
              self.if_(self.notNull(right), function () {
                forEach(ast.arguments, function (expr) {
                  self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function (argument) {
                    args.push(argument);
                  });
                });
                if (left.name) {
                  var x = self.member(left.context, left.name, left.computed);
                  expression = "(" + x + " === null ? null : " + self.unsafeMember(left.context, left.name, left.computed) + ".call(" + [left.context].concat(args).join(",") + "))";
                } else {
                  expression = right + "(" + args.join(",") + ")";
                }
                self.assign(intoId, expression);
              }, function () {
                self.assign(intoId, "undefined");
              });
              recursionFn(intoId);
            });
          }
          break;
        case AST.AssignmentExpression:
          right = this.nextId();
          left = {};
          self.current().inAssignment = true;
          this.recurse(ast.left, undefined, left, function () {
            self.if_(self.and_(self.notNull(left.context), self.or_(self.has_(left.context, left.name), self.isNull(self.member(left.context, left.name, left.computed)))), function () {
              self.recurse(ast.right, right);
              expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
              self.assign(intoId, expression);
              recursionFn(intoId || expression);
            });
            self.current().inAssignment = false;
            self.recurse(ast.right, right);
            self.current().inAssignment = true;
          }, 1);
          self.current().inAssignment = false;
          break;
        case AST.ArrayExpression:
          args = [];
          forEach(ast.elements, function (expr) {
            self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function (argument) {
              args.push(argument);
            });
          });
          expression = "[" + args.join(",") + "]";
          this.assign(intoId, expression);
          recursionFn(intoId || expression);
          break;
        case AST.ObjectExpression:
          args = [];
          computed = false;
          forEach(ast.properties, function (property) {
            if (property.computed) {
              computed = true;
            }
          });
          if (computed) {
            intoId = intoId || this.nextId();
            this.assign(intoId, "{}");
            forEach(ast.properties, function (property) {
              if (property.computed) {
                left = self.nextId();
                self.recurse(property.key, left);
              } else {
                left = property.key.type === AST.Identifier ? property.key.name : "" + property.key.value;
              }
              right = self.nextId();
              self.recurse(property.value, right);
              self.assign(self.unsafeMember(intoId, left, property.computed), right);
            });
          } else {
            forEach(ast.properties, function (property) {
              self.recurse(property.value, ast.constant ? undefined : self.nextId(), undefined, function (expr) {
                args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : "" + property.key.value) + ":" + expr);
              });
            });
            expression = "{" + args.join(",") + "}";
            this.assign(intoId, expression);
          }
          recursionFn(intoId || expression);
          break;
        case AST.ThisExpression:
          this.assign(intoId, "s");
          recursionFn(intoId || "s");
          break;
        case AST.LocalsExpression:
          this.assign(intoId, "l");
          recursionFn(intoId || "l");
          break;
        case AST.NGValueParameter:
          this.assign(intoId, "v");
          recursionFn(intoId || "v");
          break;
      }
    },
    getHasOwnProperty: function getHasOwnProperty(element, property) {
      var key = element + "." + property;
      var own = this.current().own;
      if (!own.hasOwnProperty(key)) {
        own[key] = this.nextId(false, element + "&&(" + this.escape(property) + " in " + element + ")");
      }
      return own[key];
    },
    assign: function assign(id, value) {
      if (!id) return;
      this.current().body.push(id, "=", value, ";");
      return id;
    },
    filter: function filter(filterName) {
      if (!this.state.filters.hasOwnProperty(filterName)) {
        this.state.filters[filterName] = this.nextId(true);
      }
      return this.state.filters[filterName];
    },
    ifDefined: function ifDefined(id, defaultValue) {
      return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
    },
    plus: function plus(left, right) {
      return "plus(" + left + "," + right + ")";
    },
    return_: function return_(id) {
      this.current().body.push("return ", id, ";");
    },
    if_: function if_(test, alternate, consequent) {
      if (test === true) {
        alternate();
      } else {
        var body = this.current().body;
        body.push("if(", test, "){");
        alternate();
        body.push("}");
        if (consequent) {
          body.push("else{");
          consequent();
          body.push("}");
        }
      }
    },
    or_: function or_(expr1, expr2) {
      return "(" + expr1 + ") || (" + expr2 + ")";
    },
    // hasOwnProperty_: function (obj, prop, computed) {
    //   if (computed) {
    //     return "(Object.prototype.hasOwnProperty.call(" + obj + "," + prop + "))";
    //   } else {
    //     return (
    //       "(Object.prototype.hasOwnProperty.call(" + obj + ",'" + prop + "'))"
    //     );
    //   }
    // },
    hasProperty_: function hasProperty_(obj, prop, computed) {
      if (computed) {
        return "(" + prop + " in " + obj + ")";
      } else {
        return "('" + prop + "' in " + obj + ")";
      }
    },
    has_: function has_(obj, prop, computed) {
      // return this.hasOwnProperty_(obj, prop, computed)

      // here is what I changed in fork
      // in original library, the pareser can only parse properties which is own properties, this make it impossible to read from prototype
      // so I changed it
      return this.hasProperty_(obj, prop, computed);
    },
    and_: function and_(expr1, expr2) {
      return "(" + expr1 + ") && (" + expr2 + ")";
    },
    not: function not(expression) {
      return "!(" + expression + ")";
    },
    isNull: function isNull(expression) {
      return expression + "==null";
    },
    notNull: function notNull(expression) {
      return expression + "!=null";
    },
    nonComputedMember: function nonComputedMember(left, right) {
      var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
      var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
      var expr = "";
      if (SAFE_IDENTIFIER.test(right)) {
        expr = left + "." + right;
      } else {
        right = right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn);
        expr = left + '["' + right + '"]';
      }
      return expr;
    },
    unsafeComputedMember: function unsafeComputedMember(left, right) {
      return left + "[" + right + "]";
    },
    unsafeNonComputedMember: function unsafeNonComputedMember(left, right) {
      return this.nonComputedMember(left, right);
    },
    computedMember: function computedMember(left, right) {
      if (this.state.computing === "assign") {
        return this.unsafeComputedMember(left, right);
      }
      // return left + "[" + right + "]";
      return "(" + left + ".hasOwnProperty(" + right + ") ? " + left + "[" + right + "] : null)";
    },
    unsafeMember: function unsafeMember(left, right, computed) {
      if (computed) return this.unsafeComputedMember(left, right);
      return this.unsafeNonComputedMember(left, right);
    },
    member: function member(left, right, computed) {
      if (computed) return this.computedMember(left, right);
      return this.nonComputedMember(left, right);
    },
    getStringValue: function getStringValue(item) {
      this.assign(item, "getStringValue(" + item + ")");
    },
    lazyRecurse: function lazyRecurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var self = this;
      return function () {
        self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
      };
    },
    lazyAssign: function lazyAssign(id, value) {
      var self = this;
      return function () {
        self.assign(id, value);
      };
    },
    stringEscapeRegex: /[^ a-zA-Z0-9]/g,
    stringEscapeFn: function stringEscapeFn(c) {
      return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    },
    escape: function escape(value) {
      if (isString(value)) return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
      if (isNumber(value)) return value.toString();
      if (value === true) return "true";
      if (value === false) return "false";
      if (value === null) return "null";
      if (typeof value === "undefined") return "undefined";
      throw $parseMinErr("esc", "IMPOSSIBLE");
    },
    nextId: function nextId(skip, init) {
      var id = "v" + this.state.nextId++;
      if (!skip) {
        this.current().vars.push(id + (init ? "=" + init : ""));
      }
      return id;
    },
    current: function current() {
      return this.state[this.state.computing];
    }
  };

  /**
   * @constructor
   */
  function Parser(lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
    this.ast = new AST(lexer, options);
    this.astCompiler = new ASTCompiler(this.ast, $filter);
  }
  ;
  Parser.prototype = {
    constructor: Parser,
    parse: function parse(text) {
      return this.astCompiler.compile(text);
    }
  };

  ///////////////////////////////////

  /**
   * @ngdoc service
   * @name $parse
   * @kind function
   *
   * @description
   *
   * Converts Angular {@link guide/expression expression} into a function.
   *
   * ```js
   *   var getter = $parse('user.name');
   *   var setter = getter.assign;
   *   var context = {user:{name:'angular'}};
   *   var locals = {user:{name:'local'}};
   *
   *   expect(getter(context)).toEqual('angular');
   *   setter(context, 'newValue');
   *   expect(context.user.name).toEqual('newValue');
   *   expect(getter(context, locals)).toEqual('local');
   * ```
   *
   *
   * @param {string} expression String expression to compile.
   * @returns {function(context, locals)} a function which represents the compiled expression:
   *
   *    * `context` – `{object}` – an object against which any expressions embedded in the strings
   *      are evaluated against (typically a scope object).
   *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
   *      `context`.
   *
   *    The returned function also has the following properties:
   *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
   *        literal.
   *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
   *        constant literals.
   *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
   *        set to a function to change its value on the given context.
   *
   */

  /**
   *
   * @param {object} data
   * @param {object} options
   */
  function ScopeX(data, options) {
    var parserOptions = {
      expensiveChecks: true,
      literals: {
        "true": true,
        "false": false,
        "null": null,
        /*eslint no-undefined: 0*/
        undefined: undefined
        /* eslint: no-undefined: 1  */
      }
    };
    var filters = options && options.filters ? assign({}, options.filters) : {};
    var lexer = new Lexer({});
    var parser = new Parser(lexer, function getFilter(name) {
      return filters[name];
    }, parserOptions);
    var caches = {};

    /**
     * Compiles src and returns a function that executes src on a target object.
     * The compiled function is cached under caches[src] to speed up further calls.
     *
     * @param {string} src
     * @returns {function}
     */
    function compile(src) {
      var cached;
      if (typeof src !== 'string') {
        throw new TypeError('ScopeX need a string, but saw ' + _typeof(src));
      }
      cached = caches[src];
      if (!cached) {
        cached = caches[src] = parser.parse(src);
      }
      return cached;
    }
    this.options = options;
    this.filters = filters;
    this.compile = compile;
    this.data = data ? data : {};
  }
  ScopeX.prototype.filter = function (name, fn) {
    this.filters[name] = fn;
  };
  ScopeX.prototype.parse = function (str) {
    return this.compile(str)(this.data);
  };
  ScopeX.prototype.assign = function (key, value) {
    var ev = this.compile(key);
    ev.assign(this.data, value);
  };
  ScopeX.prototype.interpolate = function (str) {
    var reg = new RegExp('\{\{(.*?)\}\}(?!\})', 'g');
    var matches = str.match(reg);

    // if there is no mustache, return the original string
    if (!matches) {
      return str;
    }
    var $this = this;
    // create a convert function
    function convert(content) {
      var exp = content.trim().slice(2, -2);
      var res = $this.parse(exp);
      return res;
    }
    str = str.replace(reg, convert);
    return str;
  };
  ScopeX.prototype.$new = function (locals) {
    locals = locals || {};
    var data = isAbsObject(locals) ? setPrototypeOf(locals, this.data) : assign({}, locals);
    var scopex = new ScopeX(data, this.options);
    assign(scopex.filters, this.filters);
    return scopex;
  };
  function isAbsObject(value) {
    return value && _typeof(value) === 'object' && value.constructor === Object;
  }
  function hasOwnKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function assign(a, b) {
    for (var i in b) {
      if (hasOwnKey(b, i)) {
        a[i] = b[i];
      }
    }
    return a;
  }
  function setPrototypeOf(obj, proto) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(obj, proto);
    } else {
      obj.__proto__ = proto;
    }
    return obj;
  }
  function uniqueArray(items) {
    return items.reduce(function (res, key) {
      if (res.indexOf(key) > -1) {
        return res;
      }
      res.push(key);
      return res;
    }, []);
  }
  ScopeX.createScope = createScope;

  /**
   * @param {object} scopeVars
   * @param {object[]|string[]} chain
   * @returns new ScopeX()
   */
  function createScope(scopeVars, options) {
    options = options || {};
    var chain = options.chain;
    var opts = assign({}, options);
    delete opts.chain;
    function ensureValue(value, target) {
      if (value && typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    }
    var data = null;
    var deps = [];
    var collecting = false;
    function inheritFrom(child, parent) {
      return new Proxy({}, {
        get: function get(_, key) {
          var keyInChild = key in child;
          var keyInParent = key in parent;
          if (collecting && (keyInChild || keyInParent)) {
            deps.push(key);
          }
          if (keyInChild) {
            return ensureValue(child[key], child);
          }
          if (keyInParent) {
            return ensureValue(parent[key], parent);
          }
        },
        set: function set(_, key, value) {
          if (key in child) {
            child[key] = value;
          } else if (key in parent) {
            parent[key] = value;
          } else {
            child[key] = value;
          }
          return true;
        },
        deleteProperty: function deleteProperty() {
          return false;
        },
        has: function has(_, key) {
          if (key in child) {
            return true;
          }
          if (key in parent) {
            return true;
          }
          return false;
        },
        ownKeys: function ownKeys() {
          var keys = [];
          for (var key in child) {
            keys.push(key);
          }
          for (key in parent) {
            if (keys.indexOf(key) > -1) {
              continue;
            }
            keys.push(key);
          }
          return keys;
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true
          };
        }
      });
    }
    if (chain) {
      data = new Proxy({}, {
        get: function get(_, key) {
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            if (key in vars) {
              if (collecting) {
                deps.push(key);
              }
              var value = ensureValue(vars[key], vars);
              return value;
            }
          }
        },
        set: function set(_, key, value) {
          var bottom;
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            if (!bottom) {
              bottom = vars;
            }
            if (key in vars) {
              if (isObj && item.setter) {
                item.setter(key, value, vars, env);
              } else {
                vars[key] = value;
              }
              return true;
            }
          }
          if (bottom) {
            bottom[key] = value;
          }
          return true;
        },
        deleteProperty: function deleteProperty() {
          return false;
        },
        has: function has(_, key) {
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            if (key in vars) {
              return true;
            }
          }
          return false;
        },
        ownKeys: function ownKeys() {
          var keys = [];
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            for (var key in vars) {
              keys.push(key);
            }
          }
          var fkeys = uniqueArray(keys);
          return fkeys;
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true
          };
        }
      });
    } else {
      data = inheritFrom({}, scopeVars);
    }
    var scope = new ScopeX(data, opts);
    if (chain) {
      scope.vars = scopeVars;
      Object.defineProperty(scope, '$new', {
        value: function value(locals) {
          var sub = setPrototypeOf(locals, scopeVars);
          return createScope(sub, options);
        }
      });
    } else {
      Object.defineProperty(scope, '$new', {
        value: function value(locals) {
          var sub = inheritFrom(locals, data);
          return createScope(sub, options);
        }
      });
    }
    var parse = scope.parse.bind(scope);
    Object.defineProperty(scope, 'parse', {
      value: function value(exp, fn) {
        if (fn) {
          collecting = true;
        }
        var res = parse(exp);
        if (fn) {
          fn(uniqueArray(deps));
          deps.length = 0;
          collecting = false;
        }
        return res;
      }
    });
    return scope;
  }
  return ScopeX;
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isNone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isObject; });
/* unused harmony export diffArray */
/* unused harmony export unionArray */
/* unused harmony export inArray */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isFunction; });
/* unused harmony export isConstructor */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return uniqueArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isEqual; });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function isNone(value) {
  return value == null || typeof value === 'number' && Number.isNaN(value);
}
function isString(value) {
  return typeof value === 'string';
}
function isObject(value) {
  return value && _typeof(value) === 'object' && value.constructor === Object;
}
function diffArray(a, b) {
  return a.filter(function (v) {
    return !b.includes(v);
  });
}
function unionArray(a, b) {
  return a.concat(b.filter(function (v) {
    return !inArray(v, a);
  }));
}
function inArray(item, arr) {
  return Array.isArray(arr) && arr.includes(item);
}
function isFunction(value, isStrict) {
  if (typeof value !== 'function') {
    return false;
  }
  return isStrict ? !isConstructor(value, 2) : true;
}
function isConstructor(value) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (typeof value !== 'function') {
    return false;
  }
  try {
    Reflect.construct(String, [], value);
  } catch (_unused) {
    return false;
  }
  if (strict === 0) {
    return true;
  }
  var source = Function.prototype.toString.call(value);
  var prototype = value.prototype;
  var isNative = /\{\s*\[native code\]\s*\}/.test(source);
  var isNativeClass = /^class\s/.test(source);
  var level4 = isNative || isNativeClass;
  if (strict >= 4) {
    return level4;
  }
  if (strict === 3) {
    return level4;
  }
  var keys = prototype ? Reflect.ownKeys(prototype).filter(function (key) {
    return key !== 'constructor';
  }) : [];
  var level2 = level4 || keys.length > 0;
  if (strict === 2) {
    return level2;
  }
  if (strict === 1) {
    return level2 || /\bthis\s*[.[]/.test(source);
  }
  return true;
}
function uniqueArray(arr, prop) {
  var exists = [];
  return arr.filter(function (item) {
    var value = prop ? item[prop] : item;
    if (exists.includes(value)) {
      return false;
    }
    exists.push(value);
    return true;
  });
}
function each(obj, fn) {
  var withDescriptors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (withDescriptors) {
    var descriptors = Object.getOwnPropertyDescriptors(obj);
    Reflect.ownKeys(descriptors).forEach(function (key) {
      var descriptor = descriptors[key];
      var get = descriptor.get,
        set = descriptor.set,
        enumerable = descriptor.enumerable,
        configurable = descriptor.configurable,
        writable = descriptor.writable;
      if (enumerable || get || set || configurable && writable) {
        fn(descriptor, key, obj);
      }
    });
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach(function (value, key) {
      return fn(value, key, obj);
    });
    return;
  }
  Object.keys(obj).forEach(function (key) {
    fn(obj[key], key, obj);
  });
}
function isEqual(val1, val2) {
  var equal = function equal(obj1, obj2) {
    var keys1 = Object.getOwnPropertyNames(obj1);
    var keys2 = Object.getOwnPropertyNames(obj2);
    var keys = unionArray(keys1, keys2);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      if (!inArray(key, keys1)) {
        return false;
      }
      if (!inArray(key, keys2)) {
        return false;
      }
      var value1 = obj1[key];
      var value2 = obj2[key];
      if (!isEqual(value1, value2)) {
        return false;
      }
    }
    return true;
  };
  if (isObject(val1) && isObject(val2)) {
    return equal(val1, val2);
  } else if (Array.isArray(val1) && Array.isArray(val2)) {
    return equal(val1, val2);
  } else {
    return val1 === val2;
  }
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getOuterHTML */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getNodeAttrs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createAttrsText; });
/* unused harmony export tryParseJSON */
/* unused harmony export getPath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return camelCase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return parseKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getNodeName; });
/* harmony import */ var _vendor_ts_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

function getOuterHTML(el) {
  var nodeName = el.nodeName.toLowerCase();
  var attrs = _toConsumableArray(el.attributes).map(function (a) {
    if (a.value === '') {
      return a.name;
    } else if (a.value.indexOf('"') > -1) {
      return "".concat(a.name, "='").concat(a.value, "'");
    } else {
      return "".concat(a.name, "=\"").concat(a.value, "\"");
    }
  }).join(' ');
  var str = "<".concat(nodeName, " ").concat(attrs, "></").concat(nodeName, ">");
  return str;
}
function getNodeAttrs(el) {
  var attributes = el.attributes || [];
  var oAttrs = _toConsumableArray(attributes);
  var attrs = {};
  oAttrs.forEach(function (node) {
    var name = node.name,
      value = node.value;
    attrs[name] = value;
  });
  return attrs;
}
function createAttrsText(attrs) {
  var attrsTexts = [];
  Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_0__[/* each */ "a"])(attrs, function (value, key) {
    attrsTexts.push("".concat(key, "=\"").concat(value, "\""));
  });
  var attrsText = attrsTexts.join(' ');
  return attrsText;
}
function tryParseJSON(v, callback) {
  try {
    var value = JSON.parse(v);
    return value;
  } catch (e) {
    return callback(v);
  }
}
function getPath($element, $root) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var $parent = $element.parent();
  if (!$parent.length) {
    return null;
  }
  var findIndex = function findIndex($parent, $child) {
    var children = $parent[0].childNodes;
    var child = $child[0];
    var index = 0;
    for (var i = 0, len = children.length; i < len; i++) {
      var item = children[i];
      if (item.nodeName === child.nodeName) {
        index++;
      }
      if (item === child) {
        return index;
      }
    }
  };
  var index = findIndex($parent, $element);
  var name = $element[0].nodeName.toLowerCase();
  var path = ["".concat(name, ":nth-of-type(").concat(index, ")")];
  var level = 0;
  while ($parent[0] !== $root[0]) {
    var _$element = $parent;
    $parent = $parent.parent();
    if (!$parent.length) {
      return null;
    }
    var _index = findIndex($parent, _$element);
    var _name = _$element[0].nodeName.toLowerCase();
    path.unshift("".concat(_name, ":nth-of-type(").concat(_index, ")"));
    level++;
    if (level > 20) {
      throw new Error('Cant get $element path in given $root.');
    }
  }
  var items = [].concat(prefix).concat(path);
  return '>' + items.join('>');
}
function camelCase(str) {
  var items = str.split(/\W|_/).filter(function (item) {
    return !!item;
  });
  var texts = items.map(function (item, i) {
    if (i === 0) {
      return item;
    }
    return item.replace(item[0], item[0].toUpperCase());
  });
  return texts.join('');
}
function parseKey(str) {
  var matched = str.match(/([a-zA-Z0-9_$]+)(\((.*?)\))?/);
  var _matched = _slicedToArray(matched, 4),
    name = _matched[1],
    _params = _matched[3];
  var params = Object(_vendor_ts_fns__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "f"])(_params) ? _params.split(',').map(function (item) {
    return item.trim();
  }).filter(function (item) {
    return !!item;
  }) : void 0;
  return [name, params];
}
function getNodeName(node) {
  return node.nodeName.toLowerCase();
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VMLocalStorage; });
var _VMLocalStorage;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Персистентность ключей state.storage в localStorage.
 * Формат значения: JSON.stringify(value)
 * Старые записи читаются: строка приводится к типу значения по умолчанию.
 */
var VMLocalStorage = /*#__PURE__*/_createClass(function VMLocalStorage() {
  _classCallCheck(this, VMLocalStorage);
});
_VMLocalStorage = VMLocalStorage;
_defineProperty(VMLocalStorage, "getKey", function (key) {
  return 'JQVM_ls_' + key;
});
_defineProperty(VMLocalStorage, "getVal", function (key) {
  try {
    var raw = localStorage.getItem(_VMLocalStorage.getKey(key));
    return raw === null ? null : JSON.parse(raw);
  } catch (e) {
    return null;
  }
});
_defineProperty(VMLocalStorage, "setVal", function (key, val) {
  try {
    var next = JSON.stringify(val === undefined ? null : val);
    var k = _VMLocalStorage.getKey(key);
    if (localStorage.getItem(k) !== next) localStorage.setItem(k, next); // не пишем без изменений
  } catch (e) {/* квота или приватный режим */}
});
_defineProperty(VMLocalStorage, "revive", function (stored, def) {
  if (typeof stored === 'string' && typeof def !== 'string' && def !== undefined && def !== null) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return def;
    } // старый формат
  }
  return stored;
});
_defineProperty(VMLocalStorage, "reloadJqvmLocalStorage", function (state, status) {
  var st = state && state.storage;
  if (!st || _typeof(st) !== 'object') return;
  Object.keys(st).forEach(function (name) {
    if (status === '$mount') {
      var stored = _VMLocalStorage.getVal(name);
      if (stored === null) _VMLocalStorage.setVal(name, st[name]);else st[name] = _VMLocalStorage.revive(stored, st[name]);
    } else if (status === '$change') {
      _VMLocalStorage.setVal(name, st[name]);
    }
  });
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return toRaw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return reactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return subscribe; });
/* unused harmony export shareState */
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*
 * Wex reactive layer ES-модуль, подключается из wex.js.
 *
 *  reactive(v)            -> прокси (один raw = один прокси); не plain-объекты возвращаются как есть
 *  toRaw(v) / isReactive(v)
 *  subscribe(target, fn)  -> unsubscribe; fn({ target, key, type }) синхронно при мутации target
 *                            или любого вложенного объекта (связи «ребёнок -> родитель» строятся при чтении/записи)
 */
var RAW = Symbol('wex.raw');
var proxies = new WeakMap(); // raw -> proxy
var subs = new WeakMap(); // raw -> Set<fn>
var parents = new WeakMap(); // raw child -> Set<raw parent>

var hasOwn = function hasOwn(o, k) {
  return Object.prototype.hasOwnProperty.call(o, k);
};
var isPlain = function isPlain(v) {
  if (v === null || _typeof(v) !== 'object') return false;
  if (Array.isArray(v)) return true;
  var p = Object.getPrototypeOf(v);
  return p === Object.prototype || p === null;
};
var toRaw = function toRaw(v) {
  return v && _typeof(v) === 'object' && v[RAW] || v;
};
var isReactive = function isReactive(v) {
  return !!(v && _typeof(v) === 'object' && v[RAW]);
};
function link(child, parent) {
  var set = parents.get(child);
  if (!set) parents.set(child, set = new Set());
  set.add(parent);
}
function notify(raw, info) {
  var seen = new Set();
  var fns = new Set();
  var stack = [raw];
  while (stack.length) {
    var cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    var s = subs.get(cur);
    if (s) s.forEach(function (fn) {
      return fns.add(fn);
    });
    var p = parents.get(cur);
    if (p) p.forEach(function (x) {
      return stack.push(x);
    });
  }
  fns.forEach(function (fn) {
    try {
      fn(info);
    } catch (e) {
      console.error(e);
    }
  });
}
var searchers = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(function (name) {
  searchers[name] = function () {
    var raw = toRaw(this);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var res = raw[name].apply(raw, args);
    if (res === false || res === -1) res = raw[name].apply(raw, _toConsumableArray(args.map(toRaw)));
    return res;
  };
});
var handler = {
  get: function get(target, key, receiver) {
    if (key === RAW) return target;
    if (Array.isArray(target) && hasOwn(searchers, key)) return searchers[key];

    // receiver не передаём: объект может быть прототипом чужого объекта (локальный scope ScopeX)
    var value = Reflect.get(target, key);
    if (_typeof(key) === 'symbol' || !isPlain(value)) return value;
    var d = Object.getOwnPropertyDescriptor(target, key);
    if (d && !d.configurable && !d.writable) return value; // инвариант Proxy

    var raw = toRaw(value);
    link(raw, target);
    return reactive(raw);
  },
  // ScopeX.$new делает Object.setPrototypeOf(locals, state): присваивание `x = 1` в дочернем scope
  // приходит сюда с receiver = locals. Пишем строго в target, иначе значение осядет на locals и state не изменится.
  set: function set(target, key, value) {
    var next = toRaw(value);
    var had = hasOwn(target, key);
    var prev = target[key];
    var ok = Reflect.set(target, key, next);
    if (ok && (!had || prev !== next)) {
      if (isPlain(next)) link(next, target);
      notify(target, {
        target: target,
        key: key,
        type: had ? 'set' : 'add'
      });
    }
    return ok;
  },
  deleteProperty: function deleteProperty(target, key) {
    var had = hasOwn(target, key);
    var ok = Reflect.deleteProperty(target, key);
    if (ok && had) notify(target, {
      target: target,
      key: key,
      type: 'delete'
    });
    return ok;
  }
};
function reactive(value) {
  if (!isPlain(value)) return value;
  var raw = toRaw(value);
  var p = proxies.get(raw);
  if (!p) {
    if (Object.isFrozen(raw)) return raw;
    p = new Proxy(raw, handler);
    proxies.set(raw, p);
  }
  return p;
}
function subscribe(target, fn) {
  var raw = toRaw(target);
  var set = subs.get(raw);
  if (!set) subs.set(raw, set = new Set());
  set.add(fn);
  return function () {
    set["delete"](fn);
  };
}
var shareState = reactive;

/***/ })
/******/ ]);
});