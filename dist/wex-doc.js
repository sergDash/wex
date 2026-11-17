(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jqvm"));
	else if(typeof define === 'function' && define.amd)
		define(["jqvm"], factory);
	else if(typeof exports === 'object')
		exports["WexDoc"] = factory(require("jqvm"));
	else
		root["WexDoc"] = factory(root["jqvm"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__) {
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
/* harmony import */ var _wex_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wex_js__WEBPACK_IMPORTED_MODULE_0__);
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

Object(_wex_js__WEBPACK_IMPORTED_MODULE_0__["directive"])('w-doc', null, function ($el, attrs) {
  var el = $el[0];
  var expr = attrs['w-doc'];
  var doc;
  try {
    doc = this.scope.parse(expr);
  } catch (e) {
    Object(_wex_js__WEBPACK_IMPORTED_MODULE_0__["report"])("w-doc: \u043E\u0448\u0438\u0431\u043A\u0430 \u0432 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0438 \xAB".concat(expr, "\xBB: ").concat(e.message), {
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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ })
/******/ ]);
});