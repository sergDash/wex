(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jqvm"), require("WexDoc"));
	else if(typeof define === 'function' && define.amd)
		define(["jqvm", "WexDoc"], factory);
	else if(typeof exports === 'object')
		exports["WexEditor"] = factory(require("jqvm"), require("WexDoc"));
	else
		root["WexEditor"] = factory(root["jqvm"], root["WexDoc"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__) {
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "htmlToDoc", function() { return htmlToDoc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Editor", function() { return Editor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HotKeys", function() { return HotKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEditor", function() { return createEditor; });
/* harmony import */ var _wex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _wex_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wex_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wex_doc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _wex_doc_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// wex.editor.js
// WYSIWYG-редактор для Wex. Без зависимостей.
// Подключать после wex.js и wex-doc.js.
//
//   <div w-editor="post.body"></div>   редактор; документ лежит в state (post.body)
//   <div w-doc="post.body"></div>      вывод (директива из wex.doc.js)
//
//   view.plugin(createEditor({
//     toolbar: ['h1', 'h2', 'p', '|', 'bold', 'italic', '|', 'center', 'link'],
//     modules: [HotKeys],              // горячие клавиши подключаются отдельно
//     placeholder: 'Начните писать…',
//     debounce: 0,                     // мс до записи в state; 0 = в следующем кадре
//   }))
//
// Свой пункт тулбара — объект прямо в массиве toolbar или Editor.register(name, def):
//   { name, title, icon: '<svg…>', hotkey: 'mod+alt+k', isActive(ed) {…}, run(ed) {…} }




// =====================================================================
// Парсер: DOM → JSON
// =====================================================================

var BLOCK = new Set('P DIV H1 H2 H3 H4 H5 H6 LI UL OL BLOCKQUOTE PRE SECTION ARTICLE HEADER FOOTER ASIDE NAV MAIN FIGURE FIGCAPTION TABLE THEAD TBODY TR TD TH DL DT DD HR'.split(' '));
var SKIP = new Set('SCRIPT STYLE IFRAME OBJECT EMBED NOSCRIPT TEMPLATE SVG CANVAS AUDIO VIDEO HEAD META LINK TITLE IMG FORM INPUT BUTTON SELECT TEXTAREA'.split(' '));
var FMT_TAGS = {
  B: 'bold',
  STRONG: 'bold',
  I: 'italic',
  EM: 'italic',
  U: 'underline',
  S: 'strikethrough',
  STRIKE: 'strikethrough',
  DEL: 'strikethrough',
  CODE: 'code',
  SUB: 'subscript',
  SUP: 'superscript'
};
var ALIGNS = ['left', 'center', 'right', 'justify'];
var tag = function tag(n) {
  return n.tagName.toUpperCase();
};
function pushText(out, text, fmt) {
  var format = _wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["FORMATS"].filter(function (f) {
    return fmt.includes(f);
  });
  var last = out[out.length - 1];
  if (last && last.type === 'text' && last.format.join() === format.join()) last.text += text;else out.push({
    type: 'text',
    text: text,
    format: format
  });
}

// форматы из style (вставка из Word/Google Docs приходит со style, в том числе на блоках)
function styleFormats(n, fmt) {
  var f = fmt;
  var add = function add(x) {
    if (!f.includes(x)) f = f.concat(x);
  };
  var st = n.style;
  if (st) {
    if (/^(bold|[6-9]00)$/.test(st.fontWeight)) add('bold');
    if (st.fontStyle === 'italic') add('italic');
    var td = st.textDecoration || st.textDecorationLine || '';
    if (td.includes('underline')) add('underline');
    if (td.includes('line-through')) add('strikethrough');
  }
  return f;
}
function inline(n, fmt, out) {
  if (n.nodeType === 3) {
    var _t = n.nodeValue.replace(/[ \t\r\n\f]+/g, ' '); // nbsp не трогаем
    if (_t) pushText(out, _t, fmt);
    return;
  }
  if (n.nodeType !== 1) return;
  var t = tag(n);
  if (SKIP.has(t)) return;
  if (t === 'BR') {
    out.push({
      type: 'linebreak'
    });
    return;
  }
  if (t === 'A') {
    var url = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["safeUrl"])(n.getAttribute('href'));
    var kids = [];
    var _iterator = _createForOfIteratorHelper(n.childNodes),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var c = _step.value;
        inline(c, fmt, kids);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (url && kids.length) out.push({
      type: 'link',
      url: url,
      children: kids
    });else out.push.apply(out, kids);
    return;
  }
  var f = styleFormats(n, FMT_TAGS[t] ? fmt.concat(FMT_TAGS[t]) : fmt);
  var _iterator2 = _createForOfIteratorHelper(n.childNodes),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _c = _step2.value;
      inline(_c, f, out);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

// пробелы по краям блока и пустые текстовые узлы убираем
function trimEdges(out) {
  var first = out[0];
  var last = out[out.length - 1];
  if (first && first.type === 'text') first.text = first.text.replace(/^ +/, '');
  if (last && last.type === 'text') last.text = last.text.replace(/ +$/, '');
  return out.filter(function (n) {
    return n.type !== 'text' || n.text;
  });
}
function inlineKids(el) {
  var out = [];
  var f = styleFormats(el, []);
  var _iterator3 = _createForOfIteratorHelper(el.childNodes),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var c = _step3.value;
      inline(c, f, out);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var last = out[out.length - 1];
  if (last && last.type === 'linebreak') out.pop(); // «пустой» <br> в конце строки, который ставит браузер
  return trimEdges(out);
}
function alignOf(el) {
  var a = String(el.style && el.style.textAlign || el.getAttribute('align') || '').toLowerCase();
  return ALIGNS.includes(a) ? a : undefined;
}
function mk(type, el, children, keep, extra) {
  var n = Object.assign({
    type: type
  }, extra);
  var a = alignOf(el);
  if (a) n.align = a;
  if (keep) {
    var classes = _toConsumableArray(el.classList).filter(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["classOk"]);
    if (classes.length) n.meta = {
      classes: classes
    };
  }
  n.children = children;
  return n;
}
var hasBlockChild = function hasBlockChild(el) {
  return _toConsumableArray(el.children).some(function (c) {
    return BLOCK.has(tag(c));
  });
};

// keep = true: читаем классы в meta (свой документ); false: чужой HTML, классы выбрасываем
function parseBlocks(parent, out, keep) {
  var run = [];
  var flush = function flush() {
    var kids = trimEdges(run);
    run = [];
    if (kids.length) out.push({
      type: 'paragraph',
      children: kids
    });
  };
  var _iterator4 = _createForOfIteratorHelper(parent.childNodes),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var n = _step4.value;
      var t = n.nodeType === 1 ? tag(n) : '';

      // текст и inline-элементы вне блока копятся в «висячий» абзац
      if (n.nodeType === 3 || n.nodeType === 1 && !BLOCK.has(t) && !SKIP.has(t)) {
        inline(n, [], run);
        continue;
      }
      if (n.nodeType !== 1 || SKIP.has(t)) continue;
      flush();
      if (t === 'HR') continue;
      if (/^H[1-6]$/.test(t)) out.push(mk('heading', n, inlineKids(n), keep, {
        tag: t.toLowerCase()
      }));else if (hasBlockChild(n)) parseBlocks(n, out, keep);else out.push(mk('paragraph', n, inlineKids(n), keep));
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  flush();
}

// чужой HTML → документ (вставка из буфера, миграция старых статей)
function htmlToDoc(html) {
  var body = new DOMParser().parseFromString(String(html), 'text/html').body;
  var out = [];
  parseBlocks(body, out, false);
  if (!out.length) out.push({
    type: 'paragraph',
    children: []
  });
  return {
    root: {
      type: 'root',
      children: out
    }
  };
}

// =====================================================================
// Иконки (свои, без наборов)
// =====================================================================

var svg = function svg(inner) {
  return "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">".concat(inner, "</svg>");
};
var glyph = function glyph(t) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" aria-hidden=\"true\"><text x=\"12\" y=\"17\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"currentColor\" style=\"".concat(style, "\">").concat(t, "</text></svg>");
};

// =====================================================================
// Редактор
// =====================================================================

var DEFAULT_TOOLBAR = ['undo', 'redo', '|', 'h1', 'h2', 'p', '|', 'bold', 'italic', 'underline', 'strike', '|', 'left', 'center', 'right', '|', 'link'];
var DEFAULTS = {
  toolbar: DEFAULT_TOOLBAR,
  placeholder: 'Начните писать…',
  modules: [],
  doc: null,
  onChange: null,
  debounce: 0
};
var el = function el(cls, name) {
  var e = document.createElement(name || 'div');
  e.className = cls;
  return e;
};
var MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
var hotkeyLabel = function hotkeyLabel(hk) {
  return hk.split('+').map(function (p) {
    return p === 'mod' ? MAC ? '⌘' : 'Ctrl' : p === 'alt' ? MAC ? '⌥' : 'Alt' : p === 'shift' ? MAC ? '⇧' : 'Shift' : p.toUpperCase();
  }).join(MAC ? '' : '+');
};
var customCount = 0;
var Editor = /*#__PURE__*/function () {
  function Editor(host) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Editor);
    this.host = host;
    this.options = Object.assign({}, DEFAULTS, options);
    this.events = {};
    this.items = []; // определения пунктов тулбара по порядку
    this.buttons = new Map(); // def → <button>
    this.listeners = [];
    this.modules = [];
    this.key = ''; // stable-строка последнего известного документа
    this._range = null;
    this._build();
    this.setDoc(this.options.doc);
    this.modules = this.options.modules.map(function (M) {
      return new M(_this);
    });
  }

  // ---------- сборка ----------
  return _createClass(Editor, [{
    key: "_build",
    value: function _build() {
      var _this2 = this;
      Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["addStyle"])('wxe-ui', UI_CSS);
      var o = this.options;
      var hints = o.modules.includes(HotKeys);
      this.root = el('wxe');
      this.bar = el('wxe-bar');
      this.bar.setAttribute('role', 'toolbar');
      this.body = el('wxe-body wxe-doc');
      this.body.contentEditable = 'true';
      this.body.setAttribute('role', 'textbox');
      this.body.setAttribute('aria-multiline', 'true');
      this.body.setAttribute('data-placeholder', o.placeholder);
      this.root.append(this.bar, this.body);
      this.host.appendChild(this.root);
      var _iterator5 = _createForOfIteratorHelper(o.toolbar),
        _step5;
      try {
        var _loop = function _loop() {
            var entry = _step5.value;
            if (entry === '|') {
              _this2.bar.appendChild(el('wxe-sep'));
              return 0; // continue
            }
            var def = typeof entry === 'string' ? Editor.items[entry] : Object.assign({
              name: 'custom-' + ++customCount
            }, entry);
            if (!def) {
              console.warn('[WexEditor] неизвестный пункт тулбара: ' + entry);
              return 0; // continue
            }
            var btn = el('wxe-btn', 'button');
            btn.type = 'button';
            btn.title = def.title + (hints && def.hotkey ? " (".concat(hotkeyLabel(def.hotkey), ")") : '');
            btn.setAttribute('aria-label', def.title || def.name);
            btn.innerHTML = def.icon || Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["esc"])(def.label || def.name);
            // mousedown не должен отнимать фокус и выделение у текста
            btn.addEventListener('mousedown', function (e) {
              return e.preventDefault();
            });
            btn.addEventListener('click', function () {
              return _this2.run(def);
            });
            _this2.bar.appendChild(btn);
            _this2.items.push(def);
            _this2.buttons.set(def, btn);
          },
          _ret;
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          _ret = _loop();
          if (_ret === 0) continue;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch (e) {}
      this._on(this.body, 'input', function () {
        _this2._normalize();
        _this2._schedule();
      });
      this._on(this.body, 'blur', function () {
        return _this2.sync();
      });
      this._on(this.body, 'paste', function (e) {
        return _this2._paste(e);
      });
      this._on(document, 'selectionchange', function () {
        return _this2._selection();
      });
    }
  }, {
    key: "_on",
    value: function _on(target, type, fn) {
      target.addEventListener(type, fn);
      this.listeners.push([target, type, fn]);
    }

    // ---------- события ----------
  }, {
    key: "on",
    value: function on(name, fn) {
      (this.events[name] = this.events[name] || []).push(fn);
      return this;
    }
  }, {
    key: "off",
    value: function off(name, fn) {
      this.events[name] = (this.events[name] || []).filter(function (f) {
        return f !== fn;
      });
      return this;
    }
  }, {
    key: "emit",
    value: function emit(name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      (this.events[name] || []).slice().forEach(function (fn) {
        return fn.apply(void 0, args);
      });
    }

    // ---------- документ ----------
  }, {
    key: "getDoc",
    value: function getDoc() {
      var out = [];
      parseBlocks(this.body, out, true);
      if (!out.length) out.push({
        type: 'paragraph',
        children: []
      });
      return {
        root: {
          type: 'root',
          children: out
        }
      };
    }

    // «внешняя» загрузка: событие change не вызывается
  }, {
    key: "setDoc",
    value: function setDoc(doc) {
      this.body.innerHTML = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["renderDoc"])(Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["isDoc"])(doc) ? doc : Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["emptyDoc"])());
      if (!this.body.firstChild) this.body.innerHTML = '<p><br></p>';
      this._empty();
      this.key = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["stable"])(this.getDoc());
      return this;
    }

    // читаем DOM, и если документ изменился, сообщаем наружу (директива кладёт его в state)
  }, {
    key: "sync",
    value: function sync() {
      this._cancel();
      if (this.destroyed) return;
      var doc = this.getDoc();
      var key = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["stable"])(doc);
      if (key === this.key) return;
      this.key = key;
      this.emit('change', doc);
      if (this.options.onChange) this.options.onChange(doc);
    }

    // debounce > 0: ждём паузу в наборе столько мс; 0: синхронизируем в ближайшем кадре
  }, {
    key: "_schedule",
    value: function _schedule() {
      var _this3 = this;
      this._cancel();
      var ms = Number(this.options.debounce) || 0;
      if (ms > 0) this._t = setTimeout(function () {
        return _this3.sync();
      }, ms);else this._raf = requestAnimationFrame(function () {
        return _this3.sync();
      });
    }
  }, {
    key: "_cancel",
    value: function _cancel() {
      clearTimeout(this._t);
      cancelAnimationFrame(this._raf);
    }
  }, {
    key: "_empty",
    value: function _empty() {
      this.body.toggleAttribute('data-empty', !this.body.textContent && this.body.children.length <= 1);
    }
  }, {
    key: "_normalize",
    value: function _normalize() {
      var b = this.body;
      if (!b.firstChild) {
        b.innerHTML = '<p><br></p>';
        this._caret(b.firstChild);
      } else if (b.firstChild.nodeType === 3) {
        document.execCommand('formatBlock', false, '<p>'); // текст без блока → абзац
      }
      this._empty();
    }
  }, {
    key: "_paste",
    value: function _paste(e) {
      var cd = e.clipboardData;
      if (!cd) return;
      e.preventDefault();

      // чужой HTML пропускаем через тот же парсер: остаётся только наша схема
      var html = cd.getData('text/html');
      if (html) {
        var blocks = htmlToDoc(html).root.children;
        var out = blocks.length === 1 ? Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["renderNodes"])(blocks[0].children) : Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["renderNodes"])(blocks);
        if (out) {
          document.execCommand('insertHTML', false, out);
          this.sync();
          return;
        }
      }
      var text = cd.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
        this.sync();
      }
    }

    // ---------- выделение ----------
  }, {
    key: "_sel",
    value: function _sel() {
      var s = window.getSelection();
      return s && s.rangeCount && this.body.contains(s.anchorNode) ? s : null;
    }
  }, {
    key: "_selection",
    value: function _selection() {
      if (!this.root.isConnected) {
        this.destroy();
        return;
      } // элемент убрали без нашего ведома
      if (this._sel()) this.updateToolbar();
    }
  }, {
    key: "_caret",
    value: function _caret(node) {
      var r = document.createRange();
      r.selectNodeContents(node);
      r.collapse(true);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
  }, {
    key: "saveRange",
    value: function saveRange() {
      var s = this._sel();
      this._range = s ? s.getRangeAt(0).cloneRange() : null;
    }
  }, {
    key: "restoreRange",
    value: function restoreRange() {
      if (!this._range) return;
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(this._range);
    }

    // верхнеуровневый блок, в котором стоит курсор (документ плоский)
  }, {
    key: "blockEl",
    value: function blockEl() {
      var s = this._sel();
      var n = s && s.anchorNode;
      while (n && n.parentNode !== this.body) n = n.parentNode;
      return n && n.nodeType === 1 ? n : null;
    }
  }, {
    key: "blockTag",
    value: function blockTag() {
      var b = this.blockEl();
      var t = b ? b.tagName.toLowerCase() : 'p';
      return /^h[1-6]$/.test(t) ? t : 'p';
    }
  }, {
    key: "alignment",
    value: function alignment() {
      var b = this.blockEl();
      if (!b) return 'left';
      var a = getComputedStyle(b).textAlign;
      return a === 'start' ? 'left' : a === 'end' ? 'right' : a === '-webkit-center' ? 'center' : a;
    }
  }, {
    key: "closest",
    value: function closest(name) {
      var s = this._sel();
      var n = s && s.anchorNode;
      while (n && n !== this.body) {
        if (n.nodeType === 1 && n.tagName === name) return n;
        n = n.parentNode;
      }
      return null;
    }

    // ---------- команды ----------
  }, {
    key: "exec",
    value: function exec(cmd, val) {
      this.body.focus();
      document.execCommand(cmd, false, val);
    }
  }, {
    key: "setBlock",
    value: function setBlock(t) {
      this.exec('formatBlock', "<".concat(t, ">"));
    }
  }, {
    key: "run",
    value: function run(def) {
      this.body.focus();
      if (def.run) def.run(this);
      this._empty();
      this.sync();
      this.updateToolbar();
    }
  }, {
    key: "updateToolbar",
    value: function updateToolbar() {
      var _this4 = this;
      this.buttons.forEach(function (btn, def) {
        var on = def.isActive ? !!def.isActive(_this4) : false;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this._cancel();
      this.listeners.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
          t = _ref2[0],
          type = _ref2[1],
          fn = _ref2[2];
        return t.removeEventListener(type, fn);
      });
      this.modules.forEach(function (m) {
        return m.destroy && m.destroy();
      });
      this.root.remove();
      this.emit('destroy');
    }
  }]);
}();

// =====================================================================
// Реестр пунктов тулбара
// =====================================================================

Editor.items = {};
Editor.register = function (name, def) {
  Editor.items[name] = Object.assign({
    name: name
  }, def);
};
var cmdItem = function cmdItem(name, cmd, title, icon, hotkey) {
  return Editor.register(name, {
    title: title,
    icon: icon,
    hotkey: hotkey,
    isActive: function isActive() {
      return document.queryCommandState(cmd);
    },
    run: function run(ed) {
      return ed.exec(cmd);
    }
  });
};
var blockItem = function blockItem(name, t, title, icon, hotkey) {
  return Editor.register(name, {
    title: title,
    icon: icon,
    hotkey: hotkey,
    isActive: function isActive(ed) {
      return ed.blockTag() === t;
    },
    // повторный клик по заголовку возвращает обычный абзац
    run: function run(ed) {
      return ed.setBlock(t !== 'p' && ed.blockTag() === t ? 'p' : t);
    }
  });
};
var ALIGN_ITEMS = {
  left: ['justifyLeft', 'По левому краю', 'M4 6h16M4 10h10M4 14h16M4 18h10', 'mod+shift+l'],
  center: ['justifyCenter', 'По центру', 'M4 6h16M7 10h10M4 14h16M7 18h10', 'mod+shift+e'],
  right: ['justifyRight', 'По правому краю', 'M4 6h16M10 10h10M4 14h16M10 18h10', 'mod+shift+r'],
  justify: ['justifyFull', 'По ширине', 'M4 6h16M4 10h16M4 14h16M4 18h16', 'mod+shift+j']
};
Editor.register('undo', {
  title: 'Отменить',
  hotkey: 'mod+z',
  run: function run(ed) {
    return ed.exec('undo');
  },
  icon: svg('<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>')
});
Editor.register('redo', {
  title: 'Повторить',
  hotkey: 'mod+shift+z',
  run: function run(ed) {
    return ed.exec('redo');
  },
  icon: svg('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>')
});
blockItem('h1', 'h1', 'Заголовок 1', glyph('H1', 'font-size:18px'), 'mod+alt+1');
blockItem('h2', 'h2', 'Заголовок 2', glyph('H2', 'font-size:18px'), 'mod+alt+2');
blockItem('p', 'p', 'Абзац', glyph('¶'), 'mod+alt+0');
cmdItem('bold', 'bold', 'Жирный', glyph('B'), 'mod+b');
cmdItem('italic', 'italic', 'Курсив', glyph('I', 'font-style:italic;font-family:serif;font-weight:400'), 'mod+i');
cmdItem('underline', 'underline', 'Подчёркнутый', glyph('U', 'text-decoration:underline;font-weight:400'), 'mod+u');
cmdItem('strike', 'strikeThrough', 'Зачёркнутый', glyph('S', 'text-decoration:line-through;font-weight:400'), 'mod+shift+x');
Object.keys(ALIGN_ITEMS).forEach(function (name) {
  var _ALIGN_ITEMS$name = _slicedToArray(ALIGN_ITEMS[name], 4),
    cmd = _ALIGN_ITEMS$name[0],
    title = _ALIGN_ITEMS$name[1],
    path = _ALIGN_ITEMS$name[2],
    hotkey = _ALIGN_ITEMS$name[3];
  Editor.register(name, {
    title: title,
    hotkey: hotkey,
    icon: svg("<path d=\"".concat(path, "\"/>")),
    isActive: function isActive(ed) {
      return ed.alignment() === name;
    },
    run: function run(ed) {
      return ed.exec(cmd);
    }
  });
});
Editor.register('link', {
  title: 'Ссылка',
  hotkey: 'mod+k',
  icon: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  isActive: function isActive(ed) {
    return !!ed.closest('A');
  },
  run: function run(ed) {
    if (ed.closest('A')) {
      ed.exec('unlink');
      return;
    }
    ed.saveRange();
    var url = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["safeUrl"])(window.prompt('Адрес ссылки', 'https://'));
    if (!url || url === 'https://') return;
    ed.restoreRange();
    var s = window.getSelection();
    if (s && s.isCollapsed) ed.exec('insertHTML', "<a href=\"".concat(Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["esc"])(url), "\">").concat(Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["esc"])(url), "</a>"));else ed.exec('createLink', url);
  }
});

// =====================================================================
// Горячие клавиши (отдельный модуль: modules: [HotKeys])
// Берёт `hotkey` у пунктов тулбара, поэтому работает и для своих пунктов.
// =====================================================================

var normHotkey = function normHotkey(s) {
  var p = String(s).toLowerCase().split('+');
  var key = p.pop();
  return ['mod', 'alt', 'shift'].filter(function (m) {
    return p.includes(m);
  }).concat(key).join('+');
};
var comboOf = function comboOf(e) {
  // по e.code, потому что на Mac Alt+1 даёт «¡» вместо «1»
  var key = /^(Key|Digit)/.test(e.code) ? e.code.slice(-1).toLowerCase() : String(e.key).toLowerCase();
  return [(e.ctrlKey || e.metaKey) && 'mod', e.altKey && 'alt', e.shiftKey && 'shift', key].filter(Boolean).join('+');
};
var HotKeys = /*#__PURE__*/function () {
  function HotKeys(editor) {
    var _this5 = this;
    _classCallCheck(this, HotKeys);
    this.editor = editor;
    this.map = new Map();
    editor.items.forEach(function (def) {
      if (def.hotkey) _this5.map.set(normHotkey(def.hotkey), def);
    });
    this.handler = function (e) {
      var def = _this5.map.get(comboOf(e));
      if (!def) return;
      e.preventDefault();
      editor.run(def);
    };
    editor.body.addEventListener('keydown', this.handler);
  }
  return _createClass(HotKeys, [{
    key: "destroy",
    value: function destroy() {
      this.editor.body.removeEventListener('keydown', this.handler);
    }
  }]);
}();

// =====================================================================
// Интеграция с Wex
// =====================================================================

var settings = {};

// как createRouter: view.plugin(createEditor({ ... }))
function createEditor() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function () {
    settings = options;
  };
}

// Документ живёт в state. Редактор держит рабочую копию в DOM (иначе каждый символ
// сбрасывал бы каретку): изменения уходят в state через assign, а значение из state
// подтягивается обратно, только если оно изменилось снаружи.
Object(_wex_js__WEBPACK_IMPORTED_MODULE_0__["directive"])('w-editor', null, function ($el, attrs) {
  var host = $el[0];
  var path = attrs['w-editor'];
  var raw = this.scope.parse(path);
  var doc = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["isDoc"])(raw) ? Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["clone"])(raw) : Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["emptyDoc"])();
  var key = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["stable"])(doc);
  var inst = host.__wexEditor;
  if (!inst) {
    var editor = new Editor(host, Object.assign({}, settings, {
      doc: doc
    }));
    inst = host.__wexEditor = {
      editor: editor,
      scope: this.scope,
      path: path,
      key: key
    };
    editor.on('change', function (next) {
      inst.key = Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["stable"])(next);
      inst.scope.assign(inst.path, next);
    });
    Object(_wex_doc_js__WEBPACK_IMPORTED_MODULE_1__["protect"])(host, function () {
      editor.destroy();
      delete host.__wexEditor;
    });
    return;
  }
  inst.scope = this.scope; // scope может смениться между рендерами
  if (key !== inst.key) {
    inst.key = key;
    if (key !== inst.editor.key) inst.editor.setDoc(doc); // изменили снаружи (загрузка с сервера и т.п.)
  }
});

// =====================================================================
// Стили интерфейса. Без Quas, чтобы редактор не зависел от порядка подключения.
// Тёмная тема: html.dark (как в Quas).
// =====================================================================

var UI_CSS = "\n.wxe {\n  --wxe-bg: #ffffff;\n  --wxe-fg: #09090b;\n  --wxe-muted-fg: #71717a;\n  --wxe-placeholder: #a1a1aa;\n  --wxe-border: #e4e4e7;\n  --wxe-border-focus: #a1a1aa;\n  --wxe-ring: rgba(24, 24, 27, 0.08);\n  --wxe-bar: #fafafa;\n  --wxe-hover: #f4f4f5;\n  --wxe-active: #e4e4e7;\n  --wxe-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--wxe-border);\n  border-radius: 0.5rem;\n  background: var(--wxe-bg);\n  color: var(--wxe-fg);\n  box-shadow: var(--wxe-shadow);\n  overflow: hidden;\n  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n}\n\nhtml.dark .wxe {\n  --wxe-bg: #09090b;\n  --wxe-fg: #fafafa;\n  --wxe-muted-fg: #a1a1aa;\n  --wxe-placeholder: #52525b;\n  --wxe-border: #27272a;\n  --wxe-border-focus: #52525b;\n  --wxe-ring: rgba(250, 250, 250, 0.08);\n  --wxe-bar: #121215;\n  --wxe-hover: #27272a;\n  --wxe-active: #3f3f46;\n  --wxe-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.4);\n}\n\n/* \u041C\u044F\u0433\u043A\u0438\u0439 \u043F\u043E\u043B\u0443\u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0439 focus-ring \u0431\u0435\u0437 \u0440\u0435\u0437\u043A\u043E\u0439 \u0447\u0435\u0440\u043D\u043E\u0442\u044B */\n.wxe:focus-within {\n  border-color: var(--wxe-border-focus);\n  box-shadow: 0 0 0 3px var(--wxe-ring), var(--wxe-shadow);\n}\n\n/* \u0422\u0443\u043B\u0431\u0430\u0440 */\n.wxe-bar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 3px;\n  padding: 6px;\n  border-bottom: 1px solid var(--wxe-border);\n  background: var(--wxe-bar);\n}\n\n/* \u041A\u043D\u043E\u043F\u043A\u0438 32x32 \u0441 \u0445\u043E\u0440\u043E\u0448\u043E \u0447\u0438\u0442\u0430\u0435\u043C\u044B\u043C\u0438 \u0438\u043A\u043E\u043D\u043A\u0430\u043C\u0438 18px */\n.wxe-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border: none;\n  border-radius: 0.375rem;\n  color: var(--wxe-muted-fg);\n  background: transparent;\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;\n}\n\n.wxe-btn svg {\n  width: 18px;\n  height: 18px;\n  stroke-width: 2;\n  flex-shrink: 0;\n}\n\n.wxe-btn:hover {\n  background: var(--wxe-hover);\n  color: var(--wxe-fg);\n}\n\n.wxe-btn:active {\n  transform: scale(0.96);\n}\n\n.wxe-btn.is-active {\n  background: var(--wxe-active);\n  color: var(--wxe-fg);\n}\n\n.wxe-btn:focus-visible {\n  outline: none;\n  box-shadow: 0 0 0 2px var(--wxe-bg), 0 0 0 4px var(--wxe-border-focus);\n}\n\n.wxe-btn:disabled {\n  opacity: 0.45;\n  pointer-events: none;\n}\n\n/* \u0420\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u044C */\n.wxe-sep {\n  width: 1px;\n  height: 18px;\n  margin: 0 4px;\n  background: var(--wxe-border);\n  flex-shrink: 0;\n}\n\n/* \u0420\u0430\u0431\u043E\u0447\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0430 */\n.wxe-body {\n  position: relative;\n  min-height: 12rem;\n  padding: 14px 16px;\n  font-size: 0.9375rem; /* 15px \u2014 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u0435\u0435 \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F */\n  line-height: 1.6;\n  outline: none;\n  word-break: break-word;\n}\n\n.wxe-body[data-empty]::before {\n  content: attr(data-placeholder);\n  position: absolute;\n  top: 14px;\n  left: 16px;\n  color: var(--wxe-placeholder);\n  pointer-events: none;\n}\n\n/* \u0422\u0438\u043F\u043E\u0433\u0440\u0430\u0444\u0438\u043A\u0430 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430 \u0432\u043D\u0443\u0442\u0440\u0438 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0430 */\n.wxe-body > *:first-child { margin-top: 0; }\n.wxe-body > *:last-child { margin-bottom: 0; }\n.wxe-body p { margin: 0.5rem 0; }\n.wxe-body h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; margin: 1rem 0 0.5rem; }\n.wxe-body h2 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.025em; margin: 0.875rem 0 0.5rem; }\n.wxe-body h3 { font-size: 1.125rem; font-weight: 600; letter-spacing: -0.02em; margin: 0.75rem 0 0.375rem; }\n.wxe-body ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }\n.wxe-body ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }\n.wxe-body blockquote {\n  border-left: 2px solid var(--wxe-border);\n  padding-left: 0.875rem;\n  color: var(--wxe-muted-fg);\n  font-style: italic;\n  margin: 0.75rem 0;\n}\n.wxe-body code {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n  font-size: 0.85em;\n  background: var(--wxe-hover);\n  padding: 0.15rem 0.35rem;\n  border-radius: 0.25rem;\n}\n.wxe-body a {\n  color: var(--wxe-fg);\n  text-decoration: underline;\n  text-underline-offset: 4px;\n}\n";
if (typeof window !== 'undefined') {
  window.WexEditor = {
    Editor: Editor,
    HotKeys: HotKeys,
    createEditor: createEditor,
    htmlToDoc: htmlToDoc
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ })
/******/ ]);
});