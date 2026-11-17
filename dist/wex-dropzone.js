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

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/*!
 * Wex Dropzone: загрузчик файлов для Wex (аналог Dropzone + FilePond): перетаскивание, несколько файлов сразу,
 * карточки с превью, прогресс, анимации, перестановка, редактор изображений (wex-image-editor.js).
 *
 *   createDropzone({ tag: 'Gallery', upload: { url: '/api/upload' }, accept: 'image/*', maxFiles: 12 })
 *   <Gallery name="files" :value="form.files" @change="onFiles"></Gallery>
 *
 * Режимы: upload (по умолчанию, файл уходит на сервер сразу, в форму идёт id) и form (файлы остаются в <input type=file>).
 * Props: name, value, disabled, label, hint.  События: @change @add @remove @done @error @reject @uploading @blocked.
 * Зависимости: jQuery, Wex (window.jqvm). Для редактирования и сжатия картинок: wex-image-editor.js.
 */
(function (global) {
  'use strict';

  var $ = global.jQuery;
  var component = global.jqvm.component;
  var doc = global.document;

  // ---------------------------------------------------------------- опции

  var DEFAULTS = {
    tag: '',
    mode: 'upload',
    // upload | form
    multiple: true,
    maxFiles: 0,
    // 0: без лимита
    maxSize: 0,
    // байт на файл; 0: без лимита
    accept: '',
    // 'image/*,.pdf' или массив
    autoUpload: true,
    // false: загрузка по api.upload()
    parallel: 3,
    // одновременных загрузок
    blockSubmit: true,
    // не отправлять форму, пока идёт загрузка
    reorder: true,
    // перестановка перетаскиванием
    cardWidth: 150,
    // минимальная ширина карточки, px
    thumbSize: 360,
    // размер миниатюры, px
    upload: {
      url: '',
      method: 'POST',
      field: 'file',
      headers: {},
      data: {},
      withCredentials: false,
      parse: null,
      // json => ({ id, url, ... })
      revert: null,
      // '/api/upload/{id}' (DELETE) или item => Promise: убрать временный файл
      transport: null // (file, ctx) => Promise<{ id, url }>; ctx: { item, progress(0..100), onAbort(fn) }
    },
    image: {
      maxWidth: 0,
      maxHeight: 0,
      quality: 0.9,
      type: 'auto'
    },
    // сжатие новых картинок перед загрузкой
    editor: {
      enabled: true,
      mode: 'client',
      // client: обрезанный файл уходит вместо оригинала; params: оригинал + параметры рамки
      extensions: ['crop'],
      meta: ['name', 'alt'],
      output: {},
      // { type, quality, maxWidth, maxHeight } для обрезанного файла
      crop: {},
      // опции расширения crop (aspects, aspect, lock)
      texts: {}
    },
    onInit: null,
    // api => void, вызывается для каждого экземпляра
    texts: {
      title: 'Drop files here',
      titleSingle: 'Drop a file here',
      browse: 'browse',
      hint: 'or click to choose',
      hintDrop: 'Release to upload',
      limit: 'Limit reached',
      waiting: 'Waiting…',
      uploading: 'Uploading',
      ready: 'Ready',
      remove: 'Remove',
      cancel: 'Cancel upload',
      edit: 'Edit',
      retry: 'Retry',
      failed: 'Upload failed',
      waitUpload: 'Please wait until uploads finish',
      rejectType: function rejectType(n) {
        return n + ': this file type is not allowed';
      },
      rejectSize: function rejectSize(n, max) {
        return n + ': larger than ' + max;
      },
      rejectMax: function rejectMax(n) {
        return n + ': too many files';
      },
      maxLine: function maxLine(n) {
        return 'up to ' + n + ' files';
      },
      sizeLine: function sizeLine(s) {
        return 'max ' + s + ' each';
      },
      itemOf: function itemOf(n, i, t) {
        return n + ', ' + i + ' of ' + t;
      }
    }
  };
  function mergeOptions(user) {
    var o = Object.assign({}, DEFAULTS, user);
    ['upload', 'image', 'editor', 'texts'].forEach(function (k) {
      o[k] = Object.assign({}, DEFAULTS[k], user[k]);
    });
    o.editor.texts = Object.assign({}, user.editor && user.editor.texts);
    if (o.mode === 'form') o.autoUpload = false;
    return o;
  }

  // ---------------------------------------------------------------- утилиты

  var uid = 0,
    keySeq = 0;
  var EXT_TYPE = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    avif: 'image/avif',
    pdf: 'application/pdf',
    zip: 'application/zip'
  };
  var extOf = function extOf(name) {
    var i = String(name || '').lastIndexOf('.');
    return i > 0 ? name.slice(i + 1).toLowerCase() : '';
  };
  var baseName = function baseName(u) {
    return decodeURIComponent(String(u || '').split('#')[0].split('?')[0].split('/').pop() || 'file');
  };
  function fmtSize(n) {
    if (!n && n !== 0) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB';
    return (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + ' MB';
  }
  function acceptOk(file, accept) {
    if (!accept || Array.isArray(accept) && !accept.length) return true;
    var list = (Array.isArray(accept) ? accept : String(accept).split(',')).map(function (s) {
      return s.trim().toLowerCase();
    }).filter(Boolean);
    var name = file.name.toLowerCase(),
      type = (file.type || '').toLowerCase();
    return list.some(function (a) {
      return a[0] === '.' ? name.endsWith(a) : a.slice(-2) === '/*' ? type.indexOf(a.slice(0, -1)) === 0 : type === a;
    });
  }
  var isImageFile = function isImageFile(type, name) {
    return /^image\//.test(type || '') || /^(jpe?g|png|webp|gif|bmp|avif|svg)$/.test(extOf(name));
  };
  var isRaster = function isRaster(type, name) {
    return isImageFile(type, name) && type !== 'image/svg+xml' && extOf(name) !== 'svg';
  };
  function toBlob(canvas, type, q) {
    return new Promise(function (res, rej) {
      return canvas.toBlob(function (b) {
        return b ? res(b) : rej(new Error('toBlob failed'));
      }, type, q);
    });
  }
  function csrfHeader() {
    var m = doc.querySelector('meta[name="csrf-token"]');
    return m ? {
      'X-CSRF-TOKEN': m.getAttribute('content')
    } : {};
  }

  // ---------------------------------------------------------------- стили (один раз)

  var CSS = "\n.wdz,.wdz-ghost{--wdz-accent:#3b82f6;--wdz-bg:#fff;--wdz-bd:#cbd5e1;--wdz-tx:#334155;--wdz-mu:#64748b;--wdz-sf:#f1f5f9;--wdz-fl:linear-gradient(135deg,#e2e8f0,#cbd5e1)}\n.dark .wdz,.dark .wdz-ghost{--wdz-bg:#0f172a;--wdz-bd:#334155;--wdz-tx:#e2e8f0;--wdz-mu:#94a3b8;--wdz-sf:#1e293b;--wdz-fl:linear-gradient(135deg,#243049,#1b2437)}\n.wdz{position:relative;font:14px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--wdz-tx)}\n.wdz *,.wdz-ghost *{box-sizing:border-box}\n.wdz-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:28px 16px;border:2px dashed var(--wdz-bd);border-radius:16px;background:var(--wdz-sf);cursor:pointer;text-align:center;outline:none;transition:border-color .2s,background .2s,transform .25s cubic-bezier(.2,.9,.3,1.3),padding .2s}\n.wdz-drop:hover{border-color:var(--wdz-accent)}\n.wdz-drop:focus-visible{box-shadow:0 0 0 3px rgba(59,130,246,.38);border-color:var(--wdz-accent)}\n.wdz-drop.is-over{border-color:var(--wdz-accent);background:rgba(59,130,246,.1);transform:scale(1.012)}\n.wdz-drop.has-items{padding:16px}\n.wdz-drop.is-full,.wdz-drop.is-off{opacity:.55;cursor:not-allowed}\n.wdz-ic{display:grid;place-items:center;width:46px;height:46px;margin-bottom:6px;border-radius:50%;background:rgba(59,130,246,.13);color:var(--wdz-accent);transition:transform .3s cubic-bezier(.2,.9,.3,1.5)}\n.wdz-drop.is-over .wdz-ic{transform:translateY(-5px) scale(1.14)}\n.wdz-drop.has-items .wdz-ic{width:34px;height:34px;margin-bottom:2px}\n.wdz-t{font-weight:600}\n.wdz-browse{color:var(--wdz-accent);text-decoration:underline;text-underline-offset:3px}\n.wdz-s{font-size:12.5px;color:var(--wdz-mu)}\n.wdz-notes{display:flex;flex-direction:column;gap:6px}\n.wdz-note{margin-top:8px;padding:8px 12px;border-radius:10px;background:#fef2f2;color:#b91c1c;font-size:13px;animation:wdz-in .25s ease both}\n.dark .wdz-note{background:#3b1317;color:#fca5a5}\n.wdz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--wdz-cw,150px),1fr));gap:12px;margin-top:12px}\n.wdz-card{position:relative;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:var(--wdz-fl);box-shadow:0 1px 3px rgba(15,23,42,.16),0 0 0 1px rgba(15,23,42,.06);cursor:grab;user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;animation:wdz-in .4s cubic-bezier(.2,.9,.3,1.2) both;transition:opacity .2s,box-shadow .2s}\n.wdz-card:hover{box-shadow:0 6px 18px rgba(15,23,42,.2),0 0 0 1px rgba(15,23,42,.06)}\n.wdz-card:focus-visible{box-shadow:0 0 0 3px rgba(59,130,246,.55)}\n.wdz-card.is-leaving{animation:wdz-out .22s ease both;pointer-events:none}\n.wdz-card.is-ghost{opacity:.3}\n.wdz-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;animation:wdz-fade .4s ease both}\n.wdz-file{position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--wdz-mu)}\n.wdz-ext{padding:2px 8px;border-radius:6px;background:var(--wdz-mu);color:#fff;font-size:11px;font-weight:700;letter-spacing:.05em}\n.wdz-bar{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;padding:26px 10px 8px;background:linear-gradient(to top,rgba(2,6,23,.8),rgba(2,6,23,0));color:#fff;pointer-events:none}\n.wdz-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600}\n.wdz-meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;opacity:.82}\n.wdz-card.st-error .wdz-bar{background:linear-gradient(to top,rgba(185,28,28,.95),rgba(185,28,28,0))}\n.wdz-card.st-error{box-shadow:0 0 0 2px #ef4444}\n.wdz-ov{position:absolute;inset:0;display:grid;place-items:center;background:rgba(15,23,42,.45);opacity:0;pointer-events:none;transition:opacity .25s ease}\n.wdz-ov.is-up{opacity:1}\n.wdz-ov.is-done{background:rgba(22,163,74,.6);animation:wdz-ov-out 1.4s ease both}\n.wdz-ring{position:absolute;width:58px;height:58px;transform:rotate(-90deg)}\n.wdz-ring circle{fill:none;stroke-width:4}\n.wdz-ring-bg{stroke:rgba(255,255,255,.28)}\n.wdz-ring-fg{stroke:#fff;stroke-linecap:round;stroke-dasharray:125.66;transition:stroke-dashoffset .3s linear}\n.wdz-pct{position:relative;color:#fff;font-size:12px;font-weight:700}\n.wdz-check{position:absolute;width:52px;height:52px;fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;opacity:0}\n.wdz-ov.is-done .wdz-check{opacity:1;animation:wdz-draw .5s .12s ease forwards}\n.wdz-ov:not(.is-up) .wdz-ring,.wdz-ov:not(.is-up) .wdz-pct{display:none}\n.wdz-btn{position:absolute;top:8px;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:rgba(15,23,42,.66);color:#fff;cursor:pointer;opacity:0;transform:scale(.8);transition:opacity .15s,transform .15s,background .15s;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}\n.wdz-card:hover .wdz-btn,.wdz-card:focus-within .wdz-btn,.wdz-card:focus .wdz-btn{opacity:1;transform:none}\n@media (hover:none){.wdz-btn{opacity:1;transform:none}}\n.wdz-btn:hover{background:rgba(15,23,42,.9)}\n.wdz-rm{left:8px}.wdz-rm:hover{background:#dc2626}\n.wdz-ed,.wdz-retry{right:8px}\n.wdz-btn:focus-visible{outline:2px solid #fff;outline-offset:1px}\n.wdz.is-off .wdz-btn{display:none}\n.wdz-ghost{position:fixed;z-index:100001;margin:0;pointer-events:none;border-radius:14px;overflow:hidden;box-shadow:0 20px 44px rgba(2,6,23,.38);opacity:.96;animation:none!important;transform:rotate(2.5deg) scale(1.05)}\n.wdz-ghost .wdz-btn,.wdz-ghost .wdz-ov{display:none}\n.wdz-ind{position:fixed;z-index:100001;width:4px;border-radius:2px;background:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,.22);pointer-events:none;transition:left .09s,top .09s,height .09s}\n@keyframes wdz-in{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}\n@keyframes wdz-out{to{opacity:0;transform:scale(.8)}}\n@keyframes wdz-fade{from{opacity:0}to{opacity:1}}\n@keyframes wdz-draw{to{stroke-dashoffset:0}}\n@keyframes wdz-ov-out{0%{opacity:0}14%{opacity:1}68%{opacity:1}100%{opacity:0}}\n@media (prefers-reduced-motion:reduce){.wdz *{animation-duration:.01s!important;transition-duration:.01s!important}}\n";
  function injectCss() {
    if (doc.getElementById('wdz-css')) return;
    var s = doc.createElement('style');
    s.id = 'wdz-css';
    s.textContent = CSS;
    doc.head.appendChild(s);
  }
  var I = {
    up: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5"/><path d="m7 9 5-5 5 5"/><path d="M5 19h14"/></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    retry: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',
    file: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'
  };

  // ---------------------------------------------------------------- шаблон

  var TEMPLATE = "<template>\n<div class=\"wdz {{rootCls}}\" data-dz=\"{{uid}}\" style=\"--wdz-cw:{{cardW}}px\">\n  <div class=\"wdz-drop {{dropCls}}\" role=\"button\" tabindex=\"0\" aria-disabled=\"{{ariaOff}}\" aria-label=\"{{titleText}}\" style=\"display:{{dropShow}}\">\n    <span class=\"wdz-ic\">".concat(I.up, "</span>\n    <span class=\"wdz-t\">{{ titleText }} <span class=\"wdz-browse\">{{ browseText }}</span></span>\n    <span class=\"wdz-s\">{{ hintText }}</span>\n  </div>\n  <div class=\"wdz-notes\" role=\"status\" aria-live=\"polite\"><div w-for=\"n in notes traceby n.id\" class=\"wdz-note\">{{ n.text }}</div></div>\n  <div class=\"wdz-grid\" role=\"list\" style=\"display:{{gridShow}}\">\n    <div w-for=\"c in cards traceby c.key\" id=\"{{c.id}}\" class=\"wdz-card {{c.cls}}\" data-key=\"{{c.key}}\" role=\"listitem\" tabindex=\"0\" aria-label=\"{{c.label}}\">\n      <img class=\"wdz-img\" w-src=\"c.thumb\" alt=\"{{c.alt}}\" draggable=\"false\" style=\"display:{{c.showImg}}\">\n      <div class=\"wdz-file\" style=\"display:{{c.showFile}}\">").concat(I.file, "<span class=\"wdz-ext\">{{ c.ext }}</span></div>\n      <div class=\"wdz-bar\"><span class=\"wdz-name\">{{ c.name }}</span><span class=\"wdz-meta\">{{ c.meta }}</span></div>\n      <div class=\"wdz-ov {{c.ovCls}}\">\n        <svg class=\"wdz-ring\" viewBox=\"0 0 48 48\"><circle class=\"wdz-ring-bg\" cx=\"24\" cy=\"24\" r=\"20\"/><circle class=\"wdz-ring-fg\" cx=\"24\" cy=\"24\" r=\"20\" style=\"stroke-dashoffset:{{c.dash}}\"/></svg>\n        <span class=\"wdz-pct\">{{ c.pct }}</span>\n        <svg class=\"wdz-check\" viewBox=\"0 0 48 48\"><path d=\"M13 25l8 8 14-17\"/></svg>\n      </div>\n      <button type=\"button\" class=\"wdz-btn wdz-rm\" data-key=\"{{c.key}}\" aria-label=\"{{c.rmLabel}}\" title=\"{{c.rmLabel}}\">").concat(I.x, "</button>\n      <button type=\"button\" class=\"wdz-btn wdz-ed\" data-key=\"{{c.key}}\" aria-label=\"{{c.edLabel}}\" title=\"{{c.edLabel}}\" style=\"display:{{c.showEdit}}\">").concat(I.edit, "</button>\n      <button type=\"button\" class=\"wdz-btn wdz-retry\" data-key=\"{{c.key}}\" aria-label=\"{{c.rtLabel}}\" title=\"{{c.rtLabel}}\" style=\"display:{{c.showRetry}}\">").concat(I.retry, "</button>\n    </div>\n  </div>\n  <div style=\"display:none\"><input type=\"file\" class=\"wdz-fi\" multiple name=\"{{fileName}}\" tabindex=\"-1\" aria-hidden=\"true\"></div>\n  <div style=\"display:none\"><input w-for=\"h in hidden traceby h.key\" type=\"hidden\" name=\"{{h.name}}\" value=\"{{h.value}}\"></div>\n</div>\n</template>");

  // ---------------------------------------------------------------- фабрика

  function createDropzone(user) {
    var o = mergeOptions(user || {});
    var T = o.texts;
    injectCss();
    var rt = new Map(); // uid -> всё, что не должно быть реактивным (File, xhr, таймеры, слушатели)
    var IE = function IE() {
      return global.ImageEditor || null;
    };
    function bind(state, view) {
      var r = rt.get(state.uid);
      if (!r) {
        r = {
          view: null,
          files: new Map(),
          thumbs: new Map(),
          queue: [],
          active: 0,
          busy: false,
          timers: new Set(),
          off: [],
          flip: null,
          over: 0,
          picker: null,
          fileSig: ''
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
      var r = rt.get(state.uid);
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      if (r && r.view && r.view.emit) (_r$view = r.view).emit.apply(_r$view, [ev].concat(args));
    };
    var qroot = function qroot(state) {
      return doc.querySelector('[data-dz="' + state.uid + '"]');
    };
    var later = function later(state, fn, ms) {
      var r = rtOf(state);
      var id = setTimeout(function () {
        r.timers["delete"](id);
        fn();
      }, ms);
      r.timers.add(id);
      return id;
    };
    var find = function find(state, key) {
      return state.items.find(function (i) {
        return i.key === key;
      });
    };
    var visible = function visible(state) {
      return state.items.filter(function (i) {
        return !i.leaving;
      });
    };
    function release(state) {
      var r = rt.get(state.uid);
      if (!r) return;
      r.timers.forEach(clearTimeout);
      r.files.forEach(function (f) {
        if (f.abort) {
          try {
            f.abort();
          } catch (e) {/* уже завершён */}
        }
      });
      r.thumbs.forEach(function (u) {
        return URL.revokeObjectURL(u);
      });
      r.off.splice(0).forEach(function (f) {
        return f();
      });
      if (r.picker && r.picker.parentNode) r.picker.parentNode.removeChild(r.picker);
      rt["delete"](state.uid);
    }

    // ---- публичный вид элемента
    function flatCrop(c) {
      return c || null;
    }
    function pub(state, it) {
      var f = rtOf(state).files.get(it.key);
      var out = {
        key: it.key,
        id: it.id,
        url: it.url,
        name: it.name,
        alt: it.alt,
        size: it.size,
        type: it.type,
        status: it.status,
        isNew: !!it.isNew,
        crop: flatCrop(it.cropParams)
      };
      if (o.mode === 'form' && f && it.isNew) out.file = f.file;
      return out;
    }
    var isFinal = function isFinal(it) {
      return it.status === 'done' || it.status === 'existing' || it.status === 'ready';
    };
    var emitChange = function emitChange(state) {
      var list = visible(state).filter(isFinal).map(function (i) {
        return pub(state, i);
      });
      emit(state, 'change', o.multiple ? list : list[0] || null);
    };

    // ---- производное состояние (то, что шаблон посчитать не может)
    function hiddenFields(state) {
      var nm = state.name;
      if (!nm) return [];
      var out = [];
      var push = function push(k, name, value) {
        return out.push({
          key: k,
          name: name,
          value: value == null ? '' : String(value)
        });
      };
      var list = visible(state);
      if (o.mode === 'form') {
        var _i = 0,
          fi = 0;
        list.forEach(function (it) {
          if (it.status !== 'ready' && it.status !== 'existing') return;
          var b = nm + '_items[' + _i + ']';
          push(it.key + ':id', b + '[id]', it.isNew ? '' : it.id);
          push(it.key + ':name', b + '[name]', it.name);
          push(it.key + ':alt', b + '[alt]', it.alt);
          if (it.cropParams) push(it.key + ':crop', b + '[crop]', JSON.stringify(it.cropParams));
          push(it.key + ':file', b + '[file]', it.isNew ? fi++ : '');
          _i++;
        });
        return out;
      }
      var i = 0;
      list.forEach(function (it) {
        if (it.status !== 'done' && it.status !== 'existing') return;
        var b = o.multiple ? nm + '[' + i + ']' : nm;
        push(it.key + ':id', b + '[id]', it.id);
        push(it.key + ':name', b + '[name]', it.name);
        push(it.key + ':alt', b + '[alt]', it.alt);
        if (it.cropParams) push(it.key + ':crop', b + '[crop]', JSON.stringify(it.cropParams));
        i++;
      });
      return out;
    }
    function syncFormFiles(state) {
      if (o.mode !== 'form') return;
      var r = rtOf(state);
      var files = [];
      visible(state).forEach(function (it) {
        if (it.status === 'ready' && it.isNew) {
          var f = r.files.get(it.key);
          if (f) files.push(f.file);
        }
      });
      var sig = files.map(function (f) {
        return f.name + ':' + f.size + ':' + f.lastModified;
      }).join('|');
      if (sig === r.fileSig) return;
      r.fileSig = sig;
      var root = qroot(state);
      var fi = root && root.querySelector('.wdz-fi');
      if (!fi) return;
      try {
        var dt = new DataTransfer();
        files.forEach(function (f) {
          return dt.items.add(f);
        });
        fi.files = dt.files;
      } catch (e) {
        console.warn('[wex-dropzone] DataTransfer is not supported, form mode needs a modern browser');
      }
    }
    var canEdit = function canEdit(state, it) {
      if (state.disabled || !o.editor.enabled || !IE()) return false;
      if (!(it.status === 'done' || it.status === 'existing' || it.status === 'ready' || it.status === 'pending')) return false;
      if (isRaster(it.type, it.name)) return true;
      return o.editor.meta.indexOf('name') > -1;
    };
    function card(state, it) {
      var st = it.status;
      var up = st === 'uploading' || st === 'queued';
      var pct = st === 'queued' ? 0 : Math.round(it.progress || 0);
      var meta = fmtSize(it.size);
      if (st === 'queued') meta = T.waiting;else if (st === 'uploading') meta = T.uploading + ' ' + pct + '%';else if (st === 'error') meta = it.error || T.failed;else if (st === 'pending') meta = T.ready + (meta ? ' · ' + meta : '');
      var total = state.items.length;
      return {
        key: it.key,
        id: 'wdz-' + state.uid + '-' + it.key,
        name: it.name,
        alt: it.alt || it.name,
        ext: (extOf(it.name) || 'file').slice(0, 4).toUpperCase(),
        thumb: it.thumb || null,
        showImg: it.thumb ? 'block' : 'none',
        showFile: it.thumb ? 'none' : 'flex',
        cls: 'st-' + st + (it.leaving ? ' is-leaving' : '') + (state.dragKey === it.key ? ' is-ghost' : ''),
        ovCls: up ? 'is-up' : st === 'done' ? 'is-done' : '',
        dash: (125.66 * (1 - pct / 100)).toFixed(2),
        pct: up ? st === 'queued' ? '…' : pct + '%' : '',
        meta: meta,
        showEdit: canEdit(state, it) ? 'grid' : 'none',
        showRetry: st === 'error' ? 'grid' : 'none',
        rmLabel: up ? T.cancel : T.remove,
        edLabel: T.edit,
        rtLabel: T.retry,
        label: T.itemOf(it.name, state.items.indexOf(it) + 1, total)
      };
    }
    function refresh(state) {
      var r = rtOf(state);
      var vis = visible(state);
      var full = !!(o.multiple && o.maxFiles && vis.length >= o.maxFiles);
      state.cards = state.items.map(function (it) {
        return card(state, it);
      });
      state.hidden = hiddenFields(state);
      state.fileName = o.mode === 'form' && state.name ? state.name + (o.multiple ? '[]' : '') : '';
      state.gridShow = state.items.length ? 'grid' : 'none';
      state.dropShow = !o.multiple && vis.length ? 'none' : 'flex';
      state.dropCls = (state.over ? 'is-over' : '') + (full ? ' is-full' : '') + (state.disabled ? ' is-off' : '') + (vis.length ? ' has-items' : '');
      state.rootCls = state.disabled ? 'is-off' : '';
      state.ariaOff = state.disabled || full ? 'true' : 'false';
      state.titleText = state.label || (o.multiple ? T.title : T.titleSingle);
      state.browseText = full ? '' : T.browse;
      var bits = [];
      if (full) bits.push(T.limit);else bits.push(state.over ? T.hintDrop : state.hint || T.hint);
      if (!state.over && !full && !state.hint) {
        if (o.maxFiles && o.multiple) bits.push(T.maxLine(o.maxFiles));
        if (o.maxSize) bits.push(T.sizeLine(fmtSize(o.maxSize)));
      }
      state.hintText = bits.join(' · ');
      state.cardW = o.cardWidth;
      syncFormFiles(state);
      var busy = state.items.some(function (i) {
        return i.status === 'queued' || i.status === 'uploading';
      });
      if (busy !== r.busy) {
        r.busy = busy;
        emit(state, 'uploading', busy);
      }
    }

    // ---- FLIP: плавное смещение соседей при удалении и перестановке
    function snapshot(state) {
      var root = qroot(state);
      if (!root) return;
      var m = new Map();
      root.querySelectorAll('.wdz-card').forEach(function (el) {
        return m.set(el.getAttribute('data-key'), el.getBoundingClientRect());
      });
      var r = rtOf(state);
      r.flip = m;
      later(state, function () {
        if (r.flip === m) r.flip = null;
      }, 600);
    }
    function flip(state) {
      var r = rt.get(state.uid);
      if (!r || !r.flip) return;
      var m = r.flip;
      r.flip = null;
      var root = qroot(state);
      if (!root) return;
      root.querySelectorAll('.wdz-card').forEach(function (el) {
        var old = m.get(el.getAttribute('data-key'));
        if (!old || !el.animate) return;
        var nw = el.getBoundingClientRect();
        var dx = old.left - nw.left,
          dy = old.top - nw.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        el.animate([{
          transform: 'translate(' + dx + 'px,' + dy + 'px)'
        }, {
          transform: 'none'
        }], {
          duration: 300,
          easing: 'cubic-bezier(.2,.8,.2,1)'
        });
      });
    }
    function shake(state, key) {
      var root = qroot(state);
      var el = root && root.querySelector('.wdz-card[data-key="' + key + '"]');
      if (el && el.animate) el.animate([{
        transform: 'translateX(0)'
      }, {
        transform: 'translateX(-6px)'
      }, {
        transform: 'translateX(5px)'
      }, {
        transform: 'translateX(-3px)'
      }, {
        transform: 'none'
      }], {
        duration: 380,
        easing: 'ease-out'
      });
    }
    function note(state, text) {
      var id = ++keySeq;
      state.notes.push({
        id: id,
        text: text
      });
      later(state, function () {
        var i = state.notes.findIndex(function (n) {
          return n.id === id;
        });
        if (i > -1) state.notes.splice(i, 1);
      }, 5500);
    }

    // ---- миниатюры
    function makeThumb(_x, _x2, _x3) {
      return _makeThumb.apply(this, arguments);
    }
    function _makeThumb() {
      _makeThumb = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(source, params, size) {
        var ie, res;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              ie = IE();
              if (ie) {
                _context.n = 1;
                break;
              }
              return _context.a(2, null);
            case 1:
              _context.n = 2;
              return ie.process(source, params || {}, {
                maxWidth: size,
                maxHeight: size,
                type: 'image/jpeg',
                quality: 0.82
              }, {
                maxSide: params ? 8192 : 2048,
                extensions: o.editor.extensions
              });
            case 2:
              res = _context.v;
              return _context.a(2, URL.createObjectURL(res.blob));
          }
        }, _callee);
      }));
      return _makeThumb.apply(this, arguments);
    }
    function setThumb(state, it, url) {
      var r = rtOf(state);
      var old = r.thumbs.get(it.key);
      if (old && old !== url) URL.revokeObjectURL(old);
      if (url && /^blob:/.test(url)) r.thumbs.set(it.key, url);
      it.thumb = url;
      refresh(state);
    }
    function buildThumb(state, it, source, params) {
      if (!isImageFile(it.type, it.name)) return;
      var done = function done(url) {
        if (url && state.items.indexOf(it) > -1 && !rt.get(state.uid)) URL.revokeObjectURL(url);else if (url && find(state, it.key)) setThumb(state, it, url);else if (url) URL.revokeObjectURL(url);
      };
      if (!isRaster(it.type, it.name) || !IE()) {
        var u = source instanceof Blob ? URL.createObjectURL(source) : source;
        done(u);
        return;
      }
      makeThumb(source, params, o.thumbSize).then(done)["catch"](function (err) {
        console.warn('[wex-dropzone] thumbnail failed', err);
        if (source instanceof Blob) done(URL.createObjectURL(source));else if (typeof source === 'string') setThumb(state, it, source);
      });
    }

    // ---- добавление файлов
    function reject(state, file, reason, text) {
      note(state, text);
      emit(state, 'reject', {
        file: file,
        reason: reason,
        message: text
      });
    }
    function addFiles(state, view, list) {
      bind(state, view);
      if (state.disabled) return;
      var files = [].slice.call(list || []);
      if (!files.length) return;
      if (!o.multiple) files = files.slice(0, 1);
      var ok = [];
      files.forEach(function (file) {
        if (!acceptOk(file, o.accept)) return reject(state, file, 'type', T.rejectType(file.name));
        if (o.maxSize && file.size > o.maxSize) return reject(state, file, 'size', T.rejectSize(file.name, fmtSize(o.maxSize)));
        ok.push(file);
      });
      if (!ok.length) return;
      var take = ok;
      if (o.multiple && o.maxFiles) {
        var room = Math.max(0, o.maxFiles - visible(state).length);
        take = ok.slice(0, room);
        ok.slice(room).forEach(function (file) {
          return reject(state, file, 'max', T.rejectMax(file.name));
        });
      }
      if (!take.length) return;
      if (!o.multiple) visible(state).slice().forEach(function (it) {
        return removeItem(state, it.key, true);
      });
      take.forEach(function (file) {
        var type = file.type || EXT_TYPE[extOf(file.name)] || '';
        var it = {
          key: 'k' + ++keySeq,
          id: '',
          name: file.name,
          size: file.size,
          type: type,
          isImage: isImageFile(type, file.name),
          status: 'preparing',
          progress: 0,
          thumb: null,
          url: '',
          alt: '',
          error: '',
          leaving: false,
          isNew: true,
          cropParams: null
        };
        rtOf(state).files.set(it.key, {
          file: file,
          orig: file,
          params: null,
          token: 0,
          abort: null
        });
        state.items.push(it);
        var live = state.items[state.items.length - 1];
        emit(state, 'add', pub(state, live));
        buildThumb(state, live, file, null);
        prepare(state, live);
      });
      refresh(state);
    }

    // сжатие картинки перед загрузкой (если задано)
    function prepare(_x4, _x5) {
      return _prepare.apply(this, arguments);
    } // ---- загрузка
    function _prepare() {
      _prepare = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(state, it) {
        var r, f, cfg, res, type, blob, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              r = rtOf(state);
              f = r.files.get(it.key);
              cfg = o.image;
              _context2.p = 1;
              if (!(IE() && isRaster(it.type, it.name) && extOf(it.name) !== 'gif' && (cfg.maxWidth || cfg.maxHeight))) {
                _context2.n = 4;
                break;
              }
              _context2.n = 2;
              return IE().render(f.file, {}, {
                maxWidth: cfg.maxWidth,
                maxHeight: cfg.maxHeight
              }, {
                extensions: []
              });
            case 2:
              res = _context2.v;
              if (!(res.width !== res.sourceWidth || res.height !== res.sourceHeight)) {
                _context2.n = 4;
                break;
              }
              type = IE().util.pickType(f.file.type, cfg.type);
              _context2.n = 3;
              return toBlob(res.canvas, type, cfg.quality);
            case 3:
              blob = _context2.v;
              f.file = new File([blob], f.file.name, {
                type: blob.type || type
              });
              it.size = f.file.size;
              it.type = f.file.type;
            case 4:
              _context2.n = 6;
              break;
            case 5:
              _context2.p = 5;
              _t = _context2.v;
              console.warn('[wex-dropzone] resize skipped', _t);
            case 6:
              if (!(!find(state, it.key) || it.leaving)) {
                _context2.n = 7;
                break;
              }
              return _context2.a(2);
            case 7:
              if (o.mode === 'form') it.status = 'ready';else if (o.autoUpload) {
                it.status = 'queued';
                r.queue.push(it.key);
              } else it.status = 'pending';
              refresh(state);
              if (o.mode === 'form') emitChange(state);
              pump(state);
            case 8:
              return _context2.a(2);
          }
        }, _callee2, null, [[1, 5]]);
      }));
      return _prepare.apply(this, arguments);
    }
    function pump(state) {
      var r = rt.get(state.uid);
      if (!r) return;
      while (r.active < o.parallel && r.queue.length) {
        var key = r.queue.shift();
        var it = find(state, key);
        if (it && !it.leaving && it.status === 'queued') start(state, it);
      }
    }
    function xhrSend(file, ctx) {
      var u = o.upload;
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(u.method || 'POST', u.url);
        xhr.withCredentials = !!u.withCredentials;
        var headers = Object.assign({
          Accept: 'application/json'
        }, csrfHeader(), u.headers);
        Object.keys(headers).forEach(function (k) {
          return xhr.setRequestHeader(k, headers[k]);
        });
        var fd = new FormData();
        var data = typeof u.data === 'function' ? u.data(file) : u.data;
        Object.keys(data || {}).forEach(function (k) {
          return fd.append(k, data[k]);
        });
        fd.append(u.field || 'file', file, file.name);
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) ctx.progress(e.loaded / e.total * 100);
        };
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            var json = null;
            try {
              json = JSON.parse(xhr.responseText);
            } catch (e) {/* ответ не JSON */}
            resolve(json);
          } else {
            var msg = 'HTTP ' + xhr.status;
            try {
              var j = JSON.parse(xhr.responseText);
              if (j && (j.message || j.error)) msg = String(j.message || j.error);
            } catch (e) {/* не JSON */}
            reject(new Error(msg));
          }
        };
        xhr.onerror = function () {
          return reject(new Error('Network error'));
        };
        xhr.onabort = function () {
          return reject(Object.assign(new Error('aborted'), {
            aborted: true
          }));
        };
        ctx.onAbort(function () {
          return xhr.abort();
        });
        xhr.send(fd);
      });
    }
    function start(state, it) {
      var r = rtOf(state);
      var f = r.files.get(it.key);
      if (!f) return;
      r.active++;
      it.status = 'uploading';
      it.progress = 0;
      it.error = '';
      var token = ++f.token;
      refresh(state);
      var ctx = {
        item: pub(state, it),
        progress: function progress(p) {
          if (f.token === token && find(state, it.key)) {
            it.progress = Math.max(0, Math.min(100, p));
            refresh(state);
          }
        },
        onAbort: function onAbort(fn) {
          f.abort = fn;
        }
      };
      var send = o.upload.transport ? o.upload.transport(f.file, ctx) : xhrSend(f.file, ctx);
      Promise.resolve(send).then(function (json) {
        if (f.token !== token) return;
        r.active--;
        f.abort = null;
        var res = o.upload.parse ? o.upload.parse(json) : json && json.data && _typeof(json.data) === 'object' && !Array.isArray(json.data) ? json.data : json;
        if (!res || res.id == null || res.id === '') throw new Error('The server response has no id');
        it.id = String(res.id);
        if (res.url) it.url = res.url;
        it.progress = 100;
        it.status = 'done';
        refresh(state);
        emit(state, 'done', pub(state, it));
        emitChange(state);
        pump(state);
      })["catch"](function (err) {
        if (f.token !== token || err && err.aborted) return;
        r.active--;
        f.abort = null;
        it.status = 'error';
        it.error = err && err.message ? String(err.message).slice(0, 80) : T.failed;
        refresh(state);
        later(state, function () {
          return shake(state, it.key);
        }, 30);
        emit(state, 'error', pub(state, it), it.error);
        pump(state);
      });
    }
    function _retry(state, key) {
      var it = find(state, key);
      if (!it || it.status !== 'error') return;
      it.status = 'queued';
      rtOf(state).queue.push(key);
      refresh(state);
      pump(state);
    }
    function uploadPending(state) {
      var r = rtOf(state);
      state.items.forEach(function (it) {
        if (it.status === 'pending') {
          it.status = 'queued';
          r.queue.push(it.key);
        }
      });
      refresh(state);
      pump(state);
    }
    function revert(state, it) {
      var rv = o.upload.revert;
      if (!rv || !it.isNew || !it.id) return;
      try {
        if (typeof rv === 'function') {
          Promise.resolve(rv(pub(state, it)))["catch"](function (e) {
            return console.warn('[wex-dropzone] revert failed', e);
          });
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('DELETE', String(rv).replace(/\{id\}/g, encodeURIComponent(it.id)));
          var h = Object.assign({
            Accept: 'application/json'
          }, csrfHeader(), o.upload.headers);
          Object.keys(h).forEach(function (k) {
            return xhr.setRequestHeader(k, h[k]);
          });
          xhr.withCredentials = !!o.upload.withCredentials;
          xhr.send();
        }
      } catch (e) {
        console.warn('[wex-dropzone] revert failed', e);
      }
    }

    // ---- удаление
    function removeItem(state, key, instant) {
      var r = rtOf(state);
      var it = find(state, key);
      if (!it || it.leaving) return;
      var f = r.files.get(key);
      if (it.status === 'uploading' && f) {
        f.token++;
        r.active = Math.max(0, r.active - 1);
        if (f.abort) {
          try {
            f.abort();
          } catch (e) {/* уже завершён */}
        }
      }
      var qi = r.queue.indexOf(key);
      if (qi > -1) r.queue.splice(qi, 1);
      revert(state, it);
      var snap = pub(state, it);
      var finish = function finish() {
        if (!rt.get(state.uid)) return;
        snapshot(state);
        var i = state.items.findIndex(function (x) {
          return x.key === key;
        });
        if (i > -1) state.items.splice(i, 1);
        r.files["delete"](key);
        var u = r.thumbs.get(key);
        if (u) {
          URL.revokeObjectURL(u);
          r.thumbs["delete"](key);
        }
        refresh(state);
        emitChange(state);
        pump(state);
      };
      emit(state, 'remove', snap);
      if (instant) {
        finish();
        return;
      }
      it.leaving = true;
      refresh(state);
      later(state, finish, 230);
    }

    // ---- редактор
    function toParams(flat) {
      if (!flat) return null;
      return {
        crop: {
          rotate: flat.rotate || 0,
          rect: {
            x: flat.x,
            y: flat.y,
            w: flat.width,
            h: flat.height
          },
          aspect: flat.aspect
        }
      };
    }
    function fromResult(res) {
      var c = res.params && res.params.crop;
      if (!c || !res.changed) return null;
      var swap = c.rotate % 180 !== 0;
      var bw = swap ? res.sourceHeight : res.sourceWidth,
        bh = swap ? res.sourceWidth : res.sourceHeight;
      var r = c.rect || {
        x: 0,
        y: 0,
        w: bw,
        h: bh
      };
      return {
        rotate: c.rotate || 0,
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.w),
        height: Math.round(r.h),
        sourceWidth: res.sourceWidth,
        sourceHeight: res.sourceHeight,
        aspect: c.aspect
      };
    }
    function _edit2(_x6, _x7, _x8) {
      return _edit.apply(this, arguments);
    } // ---- перестановка
    function _edit() {
      _edit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(state, view, key) {
        var it, r, f, raster, source, params, root, ed, res, reupload, flat, before, base, blob, file, entry;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              bind(state, view);
              it = find(state, key);
              if (!(!it || it.leaving || !canEdit(state, it))) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2);
            case 1:
              r = rtOf(state);
              f = r.files.get(key);
              raster = isRaster(it.type, it.name);
              source = null, params = null;
              if (raster) {
                if (f) {
                  source = f.orig || f.file;
                  params = f.params;
                } else {
                  source = it.origUrl || it.url;
                  params = toParams(it.cropParams);
                }
                if (!f && it.cropParams && it.origUrl) params = toParams(it.cropParams);
              }
              root = qroot(state);
              ed = o.editor;
              _context3.n = 2;
              return IE().open({
                source: source,
                name: it.name,
                alt: it.alt,
                params: params,
                meta: source ? ed.meta : ed.meta.filter(function (m) {
                  return m === 'name';
                }),
                extensions: ed.extensions,
                output: ed.output,
                crop: ed.crop,
                texts: ed.texts,
                title: it.name
              });
            case 2:
              res = _context3.v;
              if (!(!res || !find(state, key) || rt.get(state.uid) !== r)) {
                _context3.n = 3;
                break;
              }
              return _context3.a(2);
            case 3:
              it.name = res.name;
              it.alt = res.alt;
              reupload = false;
              if (raster && source) {
                if (o.editor.mode === 'params') {
                  flat = fromResult(res);
                  before = JSON.stringify(it.cropParams);
                  it.cropParams = flat;
                  if (JSON.stringify(flat) !== before) {
                    if (f) f.params = res.params;
                    base = f ? f.orig || f.file : it.origUrl || it.url;
                    if (!it.origUrl && !f) it.origUrl = it.url;
                    buildThumb(state, it, base, flat ? toParams(flat) : null);
                  }
                } else if (res.changed || f && f.orig && f.file !== f.orig) {
                  blob = res.changed ? res.blob : f.orig;
                  file = new File([blob], it.name, {
                    type: blob.type || it.type
                  });
                  if (it.isNew && it.id) revert(state, it);
                  entry = f;
                  if (!entry) {
                    entry = {
                      file: file,
                      orig: null,
                      params: null,
                      token: 0,
                      abort: null
                    };
                    r.files.set(key, entry);
                  }
                  entry.file = file;
                  entry.params = res.changed ? res.params : null;
                  it.size = file.size;
                  it.type = file.type;
                  it.isNew = true;
                  it.id = '';
                  it.url = '';
                  it.cropParams = null;
                  buildThumb(state, it, file, null);
                  reupload = true;
                }
              }
              if (reupload) {
                if (o.mode === 'form') it.status = 'ready';else {
                  it.status = 'queued';
                  r.queue.push(key);
                }
              }
              refresh(state);
              emitChange(state);
              pump(state);
            case 4:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      return _edit.apply(this, arguments);
    }
    function moveItem(state, from, to) {
      if (from === to || from < 0 || to < 0 || to >= state.items.length) return;
      snapshot(state);
      var _state$items$splice = state.items.splice(from, 1),
        _state$items$splice2 = _slicedToArray(_state$items$splice, 1),
        x = _state$items$splice2[0];
      state.items.splice(to, 0, x);
      refresh(state);
      emitChange(state);
    }
    function dragGesture(state, e) {
      var cardEl = e.currentTarget;
      var key = cardEl.getAttribute('data-key');
      var sx = e.clientX,
        sy = e.clientY;
      var ghost = null,
        ind = null,
        dragging = false,
        insert = -1,
        offX = 0,
        offY = 0;
      var targetAt = function targetAt(px, py) {
        var root = qroot(state);
        var els = [].slice.call(root.querySelectorAll('.wdz-card')).filter(function (el) {
          return !el.classList.contains('is-leaving');
        });
        var best = null,
          bestD = Infinity;
        els.forEach(function (el) {
          var b = el.getBoundingClientRect();
          var inside = px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
          var d = inside ? 0 : Math.hypot(px - (b.left + b.width / 2), py - (b.top + b.height / 2));
          if (d < bestD) {
            bestD = d;
            best = {
              el: el,
              b: b
            };
          }
        });
        return best;
      };
      var move = function move(ev) {
        if (!dragging) {
          if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
          dragging = true;
          var b = cardEl.getBoundingClientRect();
          offX = sx - b.left;
          offY = sy - b.top;
          ghost = cardEl.cloneNode(true);
          ghost.removeAttribute('id');
          ghost.classList.add('wdz-ghost');
          ghost.classList.remove('is-ghost');
          ghost.style.width = b.width + 'px';
          ghost.style.height = b.height + 'px';
          doc.body.appendChild(ghost);
          ind = doc.createElement('div');
          ind.className = 'wdz-ind';
          ind.style.display = 'none';
          doc.body.appendChild(ind);
          state.dragKey = key;
          refresh(state);
          doc.body.style.cursor = 'grabbing';
        }
        ghost.style.left = ev.clientX - offX + 'px';
        ghost.style.top = ev.clientY - offY + 'px';
        var t = targetAt(ev.clientX, ev.clientY);
        if (!t) return;
        var tk = t.el.getAttribute('data-key');
        var ti = state.items.findIndex(function (i) {
          return i.key === tk;
        });
        var fi = state.items.findIndex(function (i) {
          return i.key === key;
        });
        if (tk === key) {
          insert = -1;
          ind.style.display = 'none';
          return;
        }
        var before = ev.clientX < t.b.left + t.b.width / 2;
        insert = before ? ti : ti + 1;
        if (fi < insert) insert--;
        if (insert === fi) {
          insert = -1;
          ind.style.display = 'none';
          return;
        }
        ind.style.display = 'block';
        ind.style.left = (before ? t.b.left - 8 : t.b.right + 6) + 'px';
        ind.style.top = t.b.top + 'px';
        ind.style.height = t.b.height + 'px';
      };
      var _up = function up() {
        global.removeEventListener('pointermove', move);
        global.removeEventListener('pointerup', _up);
        global.removeEventListener('pointercancel', _up);
        if (!dragging) return;
        doc.body.style.cursor = '';
        if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
        if (ind && ind.parentNode) ind.parentNode.removeChild(ind);
        state.dragKey = null;
        var fi = state.items.findIndex(function (i) {
          return i.key === key;
        });
        if (insert > -1) moveItem(state, fi, insert);else refresh(state);
        var eat = function eat(ev) {
          ev.stopPropagation();
          ev.preventDefault();
        };
        cardEl.addEventListener('click', eat, {
          capture: true,
          once: true
        });
        setTimeout(function () {
          return cardEl.removeEventListener('click', eat, true);
        }, 0);
      };
      global.addEventListener('pointermove', move);
      global.addEventListener('pointerup', _up);
      global.addEventListener('pointercancel', _up);
    }

    // ---- выбор файлов
    function openPicker(state, view) {
      bind(state, view);
      var r = rtOf(state);
      if (state.disabled) return;
      if (o.multiple && o.maxFiles && visible(state).length >= o.maxFiles) return;
      if (r.picker && r.picker.parentNode) r.picker.parentNode.removeChild(r.picker);
      var input = doc.createElement('input');
      input.type = 'file';
      input.multiple = !!o.multiple;
      var acc = Array.isArray(o.accept) ? o.accept.join(',') : o.accept;
      if (acc) input.accept = acc;
      input.style.display = 'none';
      input.addEventListener('change', function () {
        addFiles(state, view, input.files);
        if (input.parentNode) input.parentNode.removeChild(input);
      });
      input.addEventListener('cancel', function () {
        if (input.parentNode) input.parentNode.removeChild(input);
      });
      doc.body.appendChild(input);
      r.picker = input;
      input.click();
    }
    var hasFiles = function hasFiles(e) {
      var dt = e.originalEvent && e.originalEvent.dataTransfer;
      return !!dt && [].slice.call(dt.types || []).indexOf('Files') > -1;
    };

    // ---- API для родителя (onInit)
    function makeApi(state, view) {
      return {
        get state() {
          return state;
        },
        items: function items() {
          return visible(state).map(function (i) {
            return pub(state, i);
          });
        },
        files: function files() {
          return visible(state).map(function (i) {
            var f = rtOf(state).files.get(i.key);
            return f ? f.file : null;
          }).filter(Boolean);
        },
        add: function add(files) {
          return addFiles(state, view, files);
        },
        upload: function upload() {
          return uploadPending(state);
        },
        retry: function retry(key) {
          return _retry(state, key);
        },
        remove: function remove(key) {
          return removeItem(state, key);
        },
        clear: function clear() {
          return visible(state).slice().forEach(function (i) {
            return removeItem(state, i.key, true);
          });
        },
        edit: function edit(key) {
          return _edit2(state, view, key);
        },
        busy: function busy() {
          return state.items.some(function (i) {
            return i.status === 'queued' || i.status === 'uploading';
          });
        },
        browse: function browse() {
          return openPicker(state, view);
        }
      };
    }

    // ---- компонент
    var view = $(TEMPLATE).state(function () {
      return {
        // props
        name: '',
        value: null,
        disabled: false,
        label: '',
        hint: '',
        // данные
        uid: ++uid,
        items: [],
        notes: [],
        over: false,
        dragKey: null,
        // производное
        cards: [],
        hidden: [],
        fileName: '',
        gridShow: 'none',
        dropShow: 'flex',
        dropCls: '',
        rootCls: '',
        ariaOff: 'false',
        titleText: '',
        browseText: '',
        hintText: '',
        cardW: 150
      };
    }).on('$mount', function (state) {
      var v = this;
      var r = bind(state, v);
      var list = state.value == null || state.value === '' ? [] : typeof state.value === 'string' ? function () {
        try {
          return JSON.parse(state.value);
        } catch (e) {
          console.warn('[wex-dropzone] value must be an array of objects or a JSON string');
          return [];
        }
      }() : state.value;
      [].concat(list).forEach(function (x) {
        if (!x || _typeof(x) !== 'object') return;
        var name = x.name || baseName(x.url);
        var type = x.type || EXT_TYPE[extOf(name)] || '';
        var it = {
          key: 'k' + ++keySeq,
          id: x.id == null ? '' : String(x.id),
          name: name,
          size: x.size == null ? null : x.size,
          type: type,
          isImage: isImageFile(type, name),
          status: 'existing',
          progress: 100,
          thumb: null,
          url: x.url || '',
          origUrl: '',
          alt: x.alt || '',
          error: '',
          leaving: false,
          isNew: false,
          cropParams: x.crop || null
        };
        state.items.push(it);
      });
      if (!o.multiple) state.items.splice(1);
      refresh(state);
      // миниатюры существующих файлов: готовый thumb, иначе сам url; для params-режима с рамкой строим вырезку
      state.items.forEach(function (it) {
        var src = [].concat(list).find(function (x) {
          return x && String(x.id) === it.id && (x.url || '') === it.url;
        }) || {};
        if (!it.isImage) return;
        if (src.thumb) {
          setThumb(state, it, src.thumb);
          return;
        }
        if (it.cropParams && it.url && IE() && isRaster(it.type, it.name)) {
          it.origUrl = it.url;
          buildThumb(state, it, it.url, toParams(it.cropParams));
          return;
        }
        if (it.url) setThumb(state, it, it.url);
      });
      // блокировка отправки формы, пока идёт загрузка
      later(state, function () {
        var root = qroot(state);
        var form = root && root.closest('form');
        if (form && o.blockSubmit) {
          var guard = function guard(e) {
            if (state.items.some(function (i) {
              return i.status === 'queued' || i.status === 'uploading';
            })) {
              e.preventDefault();
              e.stopImmediatePropagation();
              note(state, T.waitUpload);
              emit(state, 'blocked');
            }
          };
          form.addEventListener('submit', guard, true);
          r.off.push(function () {
            return form.removeEventListener('submit', guard, true);
          });
        }
        if (o.onInit) o.onInit.call(v, makeApi(state, v));
      }, 0);
    }).on('$render', function (state) {
      flip(state);
    }).on('$unmount', function (state) {
      release(state);
    }).on('$destroy', function (state) {
      release(state);
    })

    // выбор файлов кликом и с клавиатуры
    .on('click', '.wdz-drop', function (state) {
      var v = this;
      return function () {
        openPicker(state, v);
      };
    }).on('keydown', '.wdz-drop', function (state) {
      var v = this;
      return function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPicker(state, v);
        }
      };
    })

    // перетаскивание файлов в зону (на весь компонент)
    .on('dragenter', '.wdz', function (state) {
      var v = this;
      return function (e) {
        if (!hasFiles(e) || state.disabled) return;
        e.preventDefault();
        bind(state, v).over++;
        if (!state.over) {
          state.over = true;
          refresh(state);
        }
      };
    }).on('dragover', '.wdz', function (state) {
      return function (e) {
        if (!hasFiles(e) || state.disabled) return;
        e.preventDefault();
        if (e.originalEvent.dataTransfer) e.originalEvent.dataTransfer.dropEffect = 'copy';
      };
    }).on('dragleave', '.wdz', function (state) {
      return function (e) {
        if (!hasFiles(e)) return;
        var r = rtOf(state);
        r.over = Math.max(0, r.over - 1);
        if (!r.over && state.over) {
          state.over = false;
          refresh(state);
        }
      };
    }).on('drop', '.wdz', function (state) {
      var v = this;
      return function (e) {
        if (!hasFiles(e)) return;
        e.preventDefault();
        var r = bind(state, v);
        r.over = 0;
        state.over = false;
        addFiles(state, v, e.originalEvent.dataTransfer.files);
        refresh(state);
      };
    })

    // кнопки карточки
    .on('click', '.wdz-rm', function (state) {
      return function (e) {
        e.stopPropagation();
        removeItem(state, e.currentTarget.getAttribute('data-key'));
      };
    }).on('click', '.wdz-ed', function (state) {
      var v = this;
      return function (e) {
        e.stopPropagation();
        _edit2(state, v, e.currentTarget.getAttribute('data-key'));
      };
    }).on('click', '.wdz-retry', function (state) {
      return function (e) {
        e.stopPropagation();
        _retry(state, e.currentTarget.getAttribute('data-key'));
      };
    }).on('dblclick', '.wdz-card', function (state) {
      var v = this;
      return function (e) {
        if ($(e.target).closest('.wdz-btn').length) return;
        _edit2(state, v, e.currentTarget.getAttribute('data-key'));
      };
    }).on('keydown', '.wdz-card', function (state) {
      var v = this;
      return function (e) {
        if (e.target !== e.currentTarget || state.disabled) return;
        var key = e.currentTarget.getAttribute('data-key');
        var i = state.items.findIndex(function (x) {
          return x.key === key;
        });
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          removeItem(state, key);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          _edit2(state, v, key);
        } else if (o.reorder && e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
          e.preventDefault();
          moveItem(state, i, i + (e.key === 'ArrowLeft' ? -1 : 1));
          later(state, function () {
            var el = qroot(state).querySelector('.wdz-card[data-key="' + key + '"]');
            if (el) el.focus();
          }, 40);
        }
      };
    })

    // перестановка карточек
    .on('pointerdown', '.wdz-card', function (state) {
      return function (e) {
        if (!o.reorder || state.disabled || e.button !== 0 || state.items.length < 2) return;
        if ($(e.target).closest('.wdz-btn').length) return;
        dragGesture(state, e);
      };
    });
    if (o.tag) component(o.tag, view);
    return view;
  }
  createDropzone.fmtSize = fmtSize;
  global.createDropzone = createDropzone;
})(window);

/***/ })
/******/ ]);