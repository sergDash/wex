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
/***/ (function(module, exports, __webpack_require__) {

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/*!
 * Wex Image Editor: расширяемое ядро редактора изображений (без зависимостей, не требует Wex).
 * Базово в нём одно расширение, `crop` (рамка, пропорции, зум, поворот на 90°), плюс поля «имя файла» и «alt».
 *
 *   const res = await ImageEditor.open({ source: file | blob | '/img/a.jpg', name: 'a.jpg', alt: '' })
 *   if (res) { res.blob /* null, если пиксели не менялись *\/; res.name; res.alt; res.params }
 *
 *   ImageEditor.extension({ name, label, icon, order, defaults, isDefault, apply, mount })   // своё расширение
 *   ImageEditor.process(source, params, output)   // без интерфейса: применить сохранённые params, получить Blob
 *
 * Подробности: book/21. ImageEditor.md
 */
(function (root) {
  'use strict';

  var doc = function doc() {
    return root.document;
  };

  // ------------------------------------------------------------------ геометрия (чистые функции)

  var clamp = function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  };
  var G = {};

  // максимальная рамка с заданной пропорцией (0 = вся картинка), по центру
  G.fitRect = function (W, H, aspect) {
    if (!aspect) return {
      x: 0,
      y: 0,
      w: W,
      h: H
    };
    var w = W,
      h = W / aspect;
    if (h > H) {
      h = H;
      w = H * aspect;
    }
    return {
      x: (W - w) / 2,
      y: (H - h) / 2,
      w: w,
      h: h
    };
  };
  G.moveRect = function (r, dx, dy, W, H) {
    return {
      x: clamp(r.x + dx, 0, W - r.w),
      y: clamp(r.y + dy, 0, H - r.h),
      w: r.w,
      h: r.h
    };
  };

  // dir > 0: по часовой, < 0: против; W,H: размеры картинки ДО поворота
  G.rotateRect = function (r, W, H, dir) {
    return dir > 0 ? {
      x: H - (r.y + r.h),
      y: r.x,
      w: r.h,
      h: r.w
    } : {
      x: r.y,
      y: W - (r.x + r.w),
      w: r.h,
      h: r.w
    };
  };

  // масштабирование рамки относительно её центра; пропорция сохраняется
  G.zoomRect = function (r, f, W, H, min) {
    min = min || 16;
    var w = r.w * f,
      h = r.h * f;
    var s = Math.min(1, W / w, H / h);
    w *= s;
    h *= s;
    var k = Math.max(1, min / w, min / h);
    w *= k;
    h *= k;
    var cx = r.x + r.w / 2,
      cy = r.y + r.h / 2;
    return {
      x: clamp(cx - w / 2, 0, Math.max(0, W - w)),
      y: clamp(cy - h / 2, 0, Math.max(0, H - h)),
      w: w,
      h: h
    };
  };

  // s: рамка в начале жеста; h: n e s w ne nw se sw; dx, dy: сдвиг указателя в пикселях картинки
  G.resizeRect = function (s, h, dx, dy, o) {
    var W = o.W,
      H = o.H,
      aspect = o.aspect || 0,
      min = o.min || 16;
    var L = h.indexOf('w') > -1,
      R = h.indexOf('e') > -1,
      T = h.indexOf('n') > -1,
      B = h.indexOf('s') > -1;
    var x1 = s.x,
      y1 = s.y,
      x2 = s.x + s.w,
      y2 = s.y + s.h;
    if (!aspect) {
      if (L) x1 = clamp(x1 + dx, 0, x2 - min);
      if (R) x2 = clamp(x2 + dx, x1 + min, W);
      if (T) y1 = clamp(y1 + dy, 0, y2 - min);
      if (B) y2 = clamp(y2 + dy, y1 + min, H);
      return {
        x: x1,
        y: y1,
        w: x2 - x1,
        h: y2 - y1
      };
    }
    if ((L || R) && (T || B)) {
      // угол: противоположный угол неподвижен
      var ax = L ? x2 : x1,
        ay = T ? y2 : y1;
      var tx = L ? x1 + dx : x2 + dx,
        ty = T ? y1 + dy : y2 + dy;
      var dirX = L ? -1 : 1,
        dirY = T ? -1 : 1;
      var w = Math.max(min, (tx - ax) * dirX),
        _hh = Math.max(min, (ty - ay) * dirY);
      if (w / aspect >= _hh) _hh = w / aspect;else w = _hh * aspect;
      if (w < min) {
        w = min;
        _hh = w / aspect;
      }
      if (_hh < min) {
        _hh = min;
        w = _hh * aspect;
      }
      var k = Math.min(1, (dirX > 0 ? W - ax : ax) / w, (dirY > 0 ? H - ay : ay) / _hh);
      w *= k;
      _hh *= k;
      return {
        x: dirX > 0 ? ax : ax - w,
        y: dirY > 0 ? ay : ay - _hh,
        w: w,
        h: _hh
      };
    }
    if (L || R) {
      // боковая грань: высота следует за шириной, центр по Y
      var cy = s.y + s.h / 2;
      var maxW = Math.min(L ? x2 : W - x1, 2 * Math.min(cy, H - cy) * aspect);
      var _w = clamp(L ? x2 - (x1 + dx) : x2 + dx - x1, Math.min(Math.max(min, min * aspect), maxW), maxW);
      return {
        x: L ? x2 - _w : x1,
        y: cy - _w / aspect / 2,
        w: _w,
        h: _w / aspect
      };
    }
    var cx = s.x + s.w / 2; // верх / низ
    var maxH = Math.min(T ? y2 : H - y1, 2 * Math.min(cx, W - cx) / aspect);
    var hh = clamp(T ? y2 - (y1 + dy) : y2 + dy - y1, Math.min(Math.max(min, min / aspect), maxH), maxH);
    return {
      x: cx - hh * aspect / 2,
      y: T ? y2 - hh : y1,
      w: hh * aspect,
      h: hh
    };
  };

  // ------------------------------------------------------------------ утилиты

  var mk = function mk(w, h) {
    var c = doc().createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  };
  var clone = function clone(v) {
    return v === undefined ? v : JSON.parse(JSON.stringify(v));
  };
  function splitName(name) {
    name = String(name || '');
    var i = name.lastIndexOf('.');
    return i > 0 && i < name.length - 1 ? {
      base: name.slice(0, i),
      ext: name.slice(i + 1)
    } : {
      base: name,
      ext: ''
    };
  }
  var TYPE_EXT = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };
  var EXT_TYPE = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    avif: 'image/avif'
  };
  function pickType(sourceType, want) {
    if (want && want !== 'auto') return want;
    return TYPE_EXT[sourceType] ? sourceType : 'image/png';
  }
  function toBlob(canvas, type, quality) {
    return new Promise(function (res, rej) {
      return canvas.toBlob(function (b) {
        return b ? res(b) : rej(new Error('toBlob failed'));
      }, type, quality);
    });
  }
  function bitmapFrom(blob) {
    var viaImg = function viaImg() {
      return new Promise(function (res, rej) {
        var url = URL.createObjectURL(blob);
        var img = new root.Image();
        img.onload = function () {
          URL.revokeObjectURL(url);
          res(img);
        };
        img.onerror = function () {
          URL.revokeObjectURL(url);
          rej(new Error('image decode failed'));
        };
        img.src = url;
      });
    };
    if (typeof root.createImageBitmap === 'function' && blob.type !== 'image/svg+xml') {
      return root.createImageBitmap(blob)["catch"](viaImg);
    }
    return viaImg();
  }

  // источник -> { canvas, type }; поддерживает File, Blob и url
  function loadSource(_x, _x2) {
    return _loadSource.apply(this, arguments);
  }
  function _loadSource() {
    _loadSource = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(src, maxSide) {
      var blob, r, bmp, w, h, k, c, x;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            blob = src;
            if (!(typeof src === 'string')) {
              _context4.n = 4;
              break;
            }
            _context4.n = 1;
            return root.fetch(src, {
              credentials: 'same-origin'
            });
          case 1:
            r = _context4.v;
            if (r.ok) {
              _context4.n = 2;
              break;
            }
            throw new Error('HTTP ' + r.status);
          case 2:
            _context4.n = 3;
            return r.blob();
          case 3:
            blob = _context4.v;
            if (!blob.type) blob = blob.slice(0, blob.size, EXT_TYPE[splitName(src.split('?')[0]).ext.toLowerCase()] || '');
          case 4:
            _context4.n = 5;
            return bitmapFrom(blob);
          case 5:
            bmp = _context4.v;
            w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
            k = Math.min(1, (maxSide || 8192) / Math.max(w, h));
            c = mk(w * k, h * k);
            x = c.getContext('2d');
            x.imageSmoothingQuality = 'high';
            x.drawImage(bmp, 0, 0, c.width, c.height);
            if (bmp.close) bmp.close();
            return _context4.a(2, {
              canvas: c,
              type: blob.type || ''
            });
        }
      }, _callee4);
    }));
    return _loadSource.apply(this, arguments);
  }
  function scaleDown(canvas, maxW, maxH) {
    var k = Math.min(1, maxW ? maxW / canvas.width : 1, maxH ? maxH / canvas.height : 1);
    if (k >= 1) return canvas;
    var c = mk(canvas.width * k, canvas.height * k);
    var x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(canvas, 0, 0, c.width, c.height);
    return c;
  }

  // ------------------------------------------------------------------ расширения

  var registry = {};
  function extension(def) {
    if (!def || !def.name) throw new Error('[ImageEditor] extension needs a name');
    registry[def.name] = Object.assign({
      order: 50,
      options: {},
      stage: 'own'
    }, def);
    return def;
  }
  var resolveExts = function resolveExts(list) {
    return (list || ['crop']).map(function (e) {
      var d = typeof e === 'string' ? registry[e] : Object.assign({
        order: 50,
        options: {},
        stage: 'own'
      }, e);
      if (!d) throw new Error('[ImageEditor] unknown extension: ' + e);
      return d;
    }).sort(function (a, b) {
      return a.order - b.order;
    });
  };
  var extOptions = function extOptions(e, o) {
    return Object.assign({}, e.options, o[e.name]);
  };
  function runPipeline(canvas, exts, params, o, upto) {
    var c = canvas;
    var _iterator = _createForOfIteratorHelper(exts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var e = _step.value;
        if (upto != null && e.order >= upto) break;
        var p = params[e.name];
        var info = {
          width: c.width,
          height: c.height,
          options: extOptions(e, o)
        };
        if (e.isDefault && e.isDefault(p, info)) continue;
        c = e.apply(c, p, info) || c;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return c;
  }

  // ------------------------------------------------------------------ расширение crop

  var rotateCanvas = function rotateCanvas(c, deg) {
    deg = (deg % 360 + 360) % 360;
    if (!deg) return c;
    var swap = deg === 90 || deg === 270;
    var o = mk(swap ? c.height : c.width, swap ? c.width : c.height);
    var x = o.getContext('2d');
    x.translate(o.width / 2, o.height / 2);
    x.rotate(deg * Math.PI / 180);
    x.drawImage(c, -c.width / 2, -c.height / 2);
    return o;
  };
  var cropCanvas = function cropCanvas(c, r) {
    var x = clamp(Math.round(r.x), 0, c.width - 1),
      y = clamp(Math.round(r.y), 0, c.height - 1);
    var w = clamp(Math.round(r.w), 1, c.width - x),
      h = clamp(Math.round(r.h), 1, c.height - y);
    var o = mk(w, h);
    o.getContext('2d').drawImage(c, x, y, w, h, 0, 0, w, h);
    return o;
  };
  var ICON = {
    crop: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    file: '<svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'
  };
  extension({
    name: 'crop',
    label: 'Crop',
    icon: ICON.crop,
    order: 10,
    options: {
      aspects: [{
        label: 'Free',
        value: 0
      }, {
        label: 'Original',
        value: 'original'
      }, {
        label: '1:1',
        value: 1
      }, {
        label: '4:3',
        value: 4 / 3
      }, {
        label: '3:2',
        value: 3 / 2
      }, {
        label: '16:9',
        value: 16 / 9
      }, {
        label: '3:4',
        value: 3 / 4
      }, {
        label: '9:16',
        value: 9 / 16
      }],
      aspect: 0,
      // начальная пропорция: число, 0 (свободно) или 'original'
      lock: false,
      // true: пропорцию менять нельзя
      min: 16 // минимальная сторона рамки, px изображения
    },
    defaults: function defaults() {
      return {
        rotate: 0,
        rect: null,
        aspect: undefined
      };
    },
    isDefault: function isDefault(p, info) {
      if (!p) return true;
      if ((p.rotate || 0) % 360 !== 0) return false;
      var r = p.rect;
      return !r || r.x <= 0.5 && r.y <= 0.5 && Math.abs(r.w - info.width) <= 1 && Math.abs(r.h - info.height) <= 1;
    },
    apply: function apply(c, p) {
      var out = rotateCanvas(c, p.rotate || 0);
      if (p.rect) {
        var r = p.rect;
        if (!(r.x <= 0.5 && r.y <= 0.5 && Math.abs(r.w - out.width) <= 1 && Math.abs(r.h - out.height) <= 1)) out = cropCanvas(out, r);
      }
      return out;
    },
    mount: function mount(ctx) {
      var t = ctx.t,
        opt = ctx.options,
        stage = ctx.stage;
      var input = ctx.input();
      var rot,
        W,
        H,
        scale = 1,
        rect;
      var normV = function normV(v) {
        if (typeof v === 'string') {
          var k = v.trim().toLowerCase();
          if (k === 'free' || k === '') return 0;
          if (k === 'original') return 'original';
          var m = k.match(/^(\d+(?:\.\d+)?)\s*[:\/x]\s*(\d+(?:\.\d+)?)$/);
          return m ? m[1] / m[2] : parseFloat(k) || 0;
        }
        return v || 0;
      };
      var aspects = (opt.aspects || []).map(function (a) {
        return a && _typeof(a) === 'object' ? {
          label: a.label,
          value: normV(a.value)
        } : {
          label: typeof a === 'string' ? /^free$/i.test(a) ? 'Free' : /^original$/i.test(a) ? 'Original' : a : String(a),
          value: normV(a)
        };
      });
      opt.aspect = normV(opt.aspect);
      var aspectNow = function aspectNow() {
        var a = ctx.params.aspect === undefined ? opt.aspect : ctx.params.aspect;
        return a === 'original' ? W / H : a || 0;
      };
      var rebuild = function rebuild() {
        rot = rotateCanvas(input, ctx.params.rotate || 0);
        W = rot.width;
        H = rot.height;
      };
      rebuild();
      rect = ctx.params.rect ? G.moveRect({
        x: ctx.params.rect.x,
        y: ctx.params.rect.y,
        w: Math.min(ctx.params.rect.w, W),
        h: Math.min(ctx.params.rect.h, H)
      }, 0, 0, W, H) : G.fitRect(W, H, aspectNow());
      var view = ctx.h('div', {
        "class": 'wie-view'
      });
      var cv = ctx.h('canvas', {
        "class": 'wie-cv'
      });
      var box = ctx.h('div', {
        "class": 'wie-crop',
        tabindex: '0',
        role: 'group',
        'aria-label': t.crop
      }, ctx.h('i', {
        "class": 'wie-g wie-g1'
      }), ctx.h('i', {
        "class": 'wie-g wie-g2'
      }), ctx.h('i', {
        "class": 'wie-g wie-g3'
      }), ctx.h('i', {
        "class": 'wie-g wie-g4'
      }));
      ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(function (hd) {
        return box.append(ctx.h('b', {
          "class": 'wie-h wie-h-' + hd,
          'data-h': hd
        }));
      });
      var dims = ctx.h('div', {
        "class": 'wie-dims'
      });
      box.append(dims);
      view.append(cv, box);
      stage.append(view);

      // --- панель
      var chips = aspects.map(function (a) {
        return ctx.h('button', {
          type: 'button',
          "class": 'wie-chip',
          'data-v': String(a.value),
          onclick: function onclick() {
            return setAspect(a.value);
          }
        }, a.label === 'Free' ? t.free : a.label === 'Original' ? t.original : a.label);
      });
      var zoom = ctx.h('input', {
        type: 'range',
        "class": 'wie-range',
        min: '1',
        max: '8',
        step: '0.01',
        value: '1',
        'aria-label': t.zoom
      });
      var mkBtn = function mkBtn(cls, icon, label, fn) {
        return ctx.h('button', {
          type: 'button',
          "class": cls,
          title: label,
          'aria-label': label,
          onclick: fn,
          html: icon + '<span>' + label + '</span>'
        });
      };
      ctx.panel.append(opt.lock ? null : ctx.h('div', {
        "class": 'wie-field'
      }, ctx.h('label', {
        "class": 'wie-lab'
      }, t.aspect), ctx.h('div', {
        "class": 'wie-chips'
      }, chips)), ctx.h('div', {
        "class": 'wie-field'
      }, ctx.h('label', {
        "class": 'wie-lab'
      }, t.zoom), zoom), ctx.h('div', {
        "class": 'wie-row'
      }, mkBtn('wie-btn wie-btn-sm', ICON.left, t.rotateLeft, function () {
        return rotate(-1);
      }), mkBtn('wie-btn wie-btn-sm', ICON.right, t.rotateRight, function () {
        return rotate(1);
      }), ctx.h('button', {
        type: 'button',
        "class": 'wie-btn wie-btn-sm wie-btn-ghost',
        onclick: function onclick() {
          return reset();
        }
      }, t.reset)));
      var save = function save() {
        return ctx.set({
          rect: {
            x: rect.x,
            y: rect.y,
            w: rect.w,
            h: rect.h
          }
        });
      };
      var layout = function layout() {
        var sw = stage.clientWidth,
          sh = stage.clientHeight;
        if (!sw || !sh) return;
        scale = Math.min((sw - 40) / W, (sh - 40) / H);
        var vw = Math.max(40, Math.floor(W * scale)),
          vh = Math.max(40, Math.floor(H * scale));
        scale = vw / W;
        view.style.width = vw + 'px';
        view.style.height = vh + 'px';
        var dpr = Math.min(root.devicePixelRatio || 1, 2);
        cv.width = Math.round(vw * dpr);
        cv.height = Math.round(vh * dpr);
        cv.style.width = vw + 'px';
        cv.style.height = vh + 'px';
        var x = cv.getContext('2d');
        x.imageSmoothingQuality = 'high';
        x.drawImage(rot, 0, 0, cv.width, cv.height);
        paint();
      };
      var paint = function paint() {
        box.style.left = rect.x * scale + 'px';
        box.style.top = rect.y * scale + 'px';
        box.style.width = rect.w * scale + 'px';
        box.style.height = rect.h * scale + 'px';
        dims.textContent = Math.round(rect.w) + ' × ' + Math.round(rect.h);
        var fit = G.fitRect(W, H, rect.w / rect.h);
        zoom.value = String(clamp(fit.w / rect.w, 1, 8));
        var a = ctx.params.aspect === undefined ? opt.aspect : ctx.params.aspect;
        chips.forEach(function (c) {
          return c.classList.toggle('is-on', c.getAttribute('data-v') === String(a));
        });
        save();
      };
      function setAspect(v) {
        ctx.set({
          aspect: v
        });
        var a = aspectNow();
        if (a) {
          var fr = G.fitRect(W, H, a);
          var cx = rect.x + rect.w / 2,
            cy = rect.y + rect.h / 2;
          rect = {
            x: clamp(cx - fr.w / 2, 0, W - fr.w),
            y: clamp(cy - fr.h / 2, 0, H - fr.h),
            w: fr.w,
            h: fr.h
          };
        }
        paint();
      }
      function rotate(dir) {
        var oldW = W,
          oldH = H;
        rect = G.rotateRect(rect, oldW, oldH, dir);
        ctx.set({
          rotate: (((ctx.params.rotate || 0) + 90 * dir) % 360 + 360) % 360
        });
        rebuild();
        if (ctx.params.aspect === 'original') {
          var fr = G.fitRect(W, H, W / H);
          rect = fr;
        }
        layout();
      }
      function reset() {
        ctx.set({
          rotate: 0,
          rect: null,
          aspect: undefined
        });
        rebuild();
        rect = G.fitRect(W, H, aspectNow());
        layout();
      }

      // --- жесты
      var gesture = function gesture(e, handle) {
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        var sx = e.clientX,
          sy = e.clientY,
          start = {
            x: rect.x,
            y: rect.y,
            w: rect.w,
            h: rect.h
          };
        box.classList.add('is-drag');
        var move = function move(ev) {
          var dx = (ev.clientX - sx) / scale,
            dy = (ev.clientY - sy) / scale;
          rect = handle === 'move' ? G.moveRect(start, dx, dy, W, H) : G.resizeRect(start, handle, dx, dy, {
            W: W,
            H: H,
            aspect: aspectNow(),
            min: opt.min
          });
          paint();
        };
        var _up = function up() {
          root.removeEventListener('pointermove', move);
          root.removeEventListener('pointerup', _up);
          root.removeEventListener('pointercancel', _up);
          box.classList.remove('is-drag');
        };
        root.addEventListener('pointermove', move);
        root.addEventListener('pointerup', _up);
        root.addEventListener('pointercancel', _up);
      };
      var onDown = function onDown(e) {
        var hd = e.target.getAttribute && e.target.getAttribute('data-h');
        gesture(e, hd || 'move');
      };
      box.addEventListener('pointerdown', onDown);
      var onKey = function onKey(e) {
        var k = {
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          ArrowUp: [0, -1],
          ArrowDown: [0, 1]
        }[e.key];
        if (!k) return;
        e.preventDefault();
        var step = (e.shiftKey ? 10 : 1) / scale;
        rect = G.moveRect(rect, k[0] * step, k[1] * step, W, H);
        paint();
      };
      box.addEventListener('keydown', onKey);
      var onWheel = function onWheel(e) {
        e.preventDefault();
        rect = G.zoomRect(rect, e.deltaY > 0 ? 1.08 : 1 / 1.08, W, H, opt.min);
        paint();
      };
      stage.addEventListener('wheel', onWheel, {
        passive: false
      });
      zoom.addEventListener('input', function () {
        var fit = G.fitRect(W, H, rect.w / rect.h);
        var target = fit.w / parseFloat(zoom.value);
        rect = G.zoomRect(rect, target / rect.w, W, H, opt.min);
        paint();
      });
      var ro = typeof root.ResizeObserver === 'function' ? new root.ResizeObserver(layout) : null;
      if (ro) ro.observe(stage);else root.addEventListener('resize', layout);
      layout();
      return function () {
        if (ro) ro.disconnect();else root.removeEventListener('resize', layout);
        stage.removeEventListener('wheel', onWheel);
      };
    }
  });

  // ------------------------------------------------------------------ тексты и стили

  var TEXTS = {
    title: 'Edit image',
    close: 'Close',
    cancel: 'Cancel',
    done: 'Done',
    saving: 'Saving…',
    loading: 'Loading…',
    loadError: 'Could not open this image',
    details: 'Details',
    name: 'File name',
    alt: 'Alt text',
    altHint: 'Describe the image for screen readers and search engines',
    crop: 'Crop',
    free: 'Free',
    original: 'Original',
    aspect: 'Aspect ratio',
    zoom: 'Zoom',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    reset: 'Reset'
  };
  var CSS = "\n.wie,.wie *{box-sizing:border-box}\n.wie{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(6,10,18,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font:14px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif;color:#e6eaf2;animation:wie-fade .18s ease both}\n.wie.is-out{animation:wie-fade-out .16s ease both}\n.wie-dialog{width:min(1120px,96vw);height:min(760px,94vh);display:grid;grid-template-columns:minmax(0,1fr) 300px;grid-template-rows:auto minmax(0,1fr) auto;background:#0f1520;border:1px solid #232d40;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden;animation:wie-pop .22s cubic-bezier(.2,.9,.3,1.15) both;outline:none}\n.wie.is-out .wie-dialog{animation:wie-pop-out .16s ease both}\n.wie-head{grid-column:1/-1;display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #1d2638}\n.wie-title{font-weight:600;font-size:15px}\n.wie-file{color:#8b97ad;font-size:12px;margin-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:46vw}\n.wie-x{margin-left:auto}\n.wie-stage{position:relative;min-width:0;min-height:0;overflow:hidden;background:#0a0f19 repeating-conic-gradient(#0d1420 0 25%,#0a0f19 0 50%) 0 0/20px 20px;display:flex;align-items:center;justify-content:center}\n.wie-stagebox{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}\n.wie-view{position:relative;box-shadow:0 8px 40px rgba(0,0,0,.5)}\n.wie-cv{display:block;user-select:none;-webkit-user-select:none}\n.wie-crop{position:absolute;box-shadow:0 0 0 9999px rgba(5,8,14,.62);outline:1.5px solid #fff;cursor:move;touch-action:none}\n.wie-crop:focus-visible{outline:2px solid #6aa2ff}\n.wie-g{position:absolute;background:rgba(255,255,255,.35);pointer-events:none;opacity:0;transition:opacity .15s}\n.wie-crop.is-drag .wie-g{opacity:1}\n.wie-g1{left:33.33%;top:0;bottom:0;width:1px}.wie-g2{left:66.66%;top:0;bottom:0;width:1px}\n.wie-g3{top:33.33%;left:0;right:0;height:1px}.wie-g4{top:66.66%;left:0;right:0;height:1px}\n.wie-h{position:absolute;width:14px;height:14px;background:#fff;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,.5);touch-action:none}\n.wie-h::after{content:'';position:absolute;inset:-9px}\n.wie-h-nw{left:-7px;top:-7px;cursor:nwse-resize}.wie-h-ne{right:-7px;top:-7px;cursor:nesw-resize}\n.wie-h-se{right:-7px;bottom:-7px;cursor:nwse-resize}.wie-h-sw{left:-7px;bottom:-7px;cursor:nesw-resize}\n.wie-h-n{left:calc(50% - 7px);top:-7px;cursor:ns-resize}.wie-h-s{left:calc(50% - 7px);bottom:-7px;cursor:ns-resize}\n.wie-h-e{top:calc(50% - 7px);right:-7px;cursor:ew-resize}.wie-h-w{top:calc(50% - 7px);left:-7px;cursor:ew-resize}\n.wie-dims{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);padding:2px 8px;border-radius:999px;background:rgba(15,21,32,.9);color:#c9d3e6;font-size:11px;white-space:nowrap;pointer-events:none}\n.wie-side{display:flex;flex-direction:column;gap:18px;padding:16px;border-left:1px solid #1d2638;background:#121a28;overflow:auto;min-height:0}\n.wie-tabs{display:flex;gap:6px;flex-wrap:wrap}\n.wie-tab{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;border:1px solid #263043;background:transparent;color:#aeb9cf;cursor:pointer;font:inherit;transition:all .15s}\n.wie-tab:hover{color:#fff;border-color:#34425b}.wie-tab.is-on{background:#1d2c4a;border-color:#3b6bd6;color:#fff}\n.wie-panel{display:flex;flex-direction:column;gap:14px}\n.wie-field{display:flex;flex-direction:column;gap:6px}\n.wie-lab{font-size:12px;color:#8b97ad;letter-spacing:.02em}\n.wie-chips{display:flex;flex-wrap:wrap;gap:6px}\n.wie-chip{padding:4px 10px;border-radius:999px;border:1px solid #263043;background:transparent;color:#aeb9cf;cursor:pointer;font:inherit;font-size:12px;transition:all .15s}\n.wie-chip:hover{color:#fff;border-color:#34425b}.wie-chip.is-on{background:#3b82f6;border-color:#3b82f6;color:#fff}\n.wie-range{width:100%;accent-color:#3b82f6}\n.wie-row{display:flex;gap:8px;flex-wrap:wrap}\n.wie-meta{display:flex;flex-direction:column;gap:12px;padding-top:16px;border-top:1px solid #1d2638}\n.wie-meta h4{margin:0;font-size:12px;font-weight:600;color:#8b97ad;text-transform:uppercase;letter-spacing:.06em}\n.wie-input{width:100%;padding:8px 10px;border-radius:8px;border:1px solid #263043;background:#0d1320;color:#e6eaf2;font:inherit;outline:none;transition:border-color .15s,box-shadow .15s;resize:vertical}\n.wie-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.25)}\n.wie-namebox{display:flex;align-items:stretch}\n.wie-namebox .wie-input{border-top-right-radius:0;border-bottom-right-radius:0}\n.wie-ext{display:flex;align-items:center;padding:0 10px;border:1px solid #263043;border-left:0;border-radius:0 8px 8px 0;background:#0a0f19;color:#8b97ad;font-size:13px}\n.wie-hint{font-size:11.5px;color:#7d889e}\n.wie-foot{grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;padding:12px 16px;border-top:1px solid #1d2638}\n.wie-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:9px;border:1px solid #34425b;background:#1a2438;color:#e6eaf2;cursor:pointer;font:inherit;font-weight:500;transition:transform .1s,background .15s,border-color .15s,opacity .15s}\n.wie-btn:hover{background:#222f49}.wie-btn:active{transform:scale(.97)}\n.wie-btn:disabled{opacity:.5;cursor:default}\n.wie-btn-primary{background:#3b82f6;border-color:#3b82f6;color:#fff}.wie-btn-primary:hover{background:#2f72e6}\n.wie-btn-sm{padding:6px 10px;font-size:13px}.wie-btn-ghost{background:transparent}\n.wie-btn-icon{padding:6px;border-radius:8px}\n.wie-btn:focus-visible,.wie-tab:focus-visible,.wie-chip:focus-visible{outline:2px solid #6aa2ff;outline-offset:2px}\n.wie-msg{display:flex;flex-direction:column;align-items:center;gap:12px;color:#8b97ad}\n.wie-msg svg{opacity:.55}\n.wie-spin{width:30px;height:30px;border-radius:50%;border:3px solid #263043;border-top-color:#3b82f6;animation:wie-rot .8s linear infinite}\n@keyframes wie-fade{from{opacity:0}to{opacity:1}}\n@keyframes wie-fade-out{to{opacity:0}}\n@keyframes wie-pop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}\n@keyframes wie-pop-out{to{opacity:0;transform:translateY(6px) scale(.98)}}\n@keyframes wie-rot{to{transform:rotate(360deg)}}\n@media (max-width:820px){.wie-dialog{width:100vw;height:100dvh;border-radius:0;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr) minmax(0,46%) auto}.wie-side{border-left:0;border-top:1px solid #1d2638}.wie-file{max-width:40vw}}\n@media (prefers-reduced-motion:reduce){.wie,.wie-dialog{animation:none!important}}\n";
  function injectCss() {
    if (doc().getElementById('wie-css')) return;
    var s = doc().createElement('style');
    s.id = 'wie-css';
    s.textContent = CSS;
    doc().head.appendChild(s);
  }
  function h(tag, props) {
    var e = doc().createElement(tag);
    if (props) for (var k in props) {
      var v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;else if (k === 'html') e.innerHTML = v;else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);else e.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var kids = [].concat(arguments[i]);
      kids.forEach(function (c) {
        if (c != null && c !== false) e.append(c.nodeType ? c : doc().createTextNode(String(c)));
      });
    }
    return e;
  }

  // ------------------------------------------------------------------ редактор
  var Editor = /*#__PURE__*/function () {
    function Editor(o, resolve) {
      var _this = this;
      _classCallCheck(this, Editor);
      this.o = o;
      this.resolve = resolve;
      this.t = Object.assign({}, TEXTS, o.texts);
      this.exts = o.source ? resolveExts(o.extensions) : [];
      this.params = {};
      this.exts.forEach(function (e) {
        var given = o.params && o.params[e.name];
        _this.params[e.name] = Object.assign(e.defaults ? e.defaults(extOptions(e, o)) : {}, clone(given) || {});
      });
      var sp = splitName(o.name);
      this.base = sp.base;
      this.ext = sp.ext;
      this.alt = o.alt || '';
      this.cleanup = null;
      this.active = null;
      this.closed = false;
    }
    return _createClass(Editor, [{
      key: "start",
      value: function start() {
        var _this2 = this;
        injectCss();
        var t = this.t,
          o = this.o;
        this.prevFocus = doc().activeElement;
        this.prevOverflow = doc().body.style.overflow;
        doc().body.style.overflow = 'hidden';
        var meta = o.meta === false ? [] : o.meta || ['name', 'alt'];
        var fields = [];
        if (meta.indexOf('name') > -1) {
          this.nameInput = h('input', {
            "class": 'wie-input',
            type: 'text',
            id: 'wie-name',
            autocomplete: 'off',
            spellcheck: 'false',
            value: this.base
          });
          fields.push(h('div', {
            "class": 'wie-field'
          }, h('label', {
            "class": 'wie-lab',
            "for": 'wie-name'
          }, t.name), h('div', {
            "class": 'wie-namebox'
          }, this.nameInput, this.ext ? h('span', {
            "class": 'wie-ext'
          }, '.' + this.ext) : null)));
        }
        if (meta.indexOf('alt') > -1 && o.source) {
          this.altInput = h('textarea', {
            "class": 'wie-input',
            id: 'wie-alt',
            rows: '3',
            placeholder: t.altHint
          });
          this.altInput.value = this.alt;
          fields.push(h('div', {
            "class": 'wie-field'
          }, h('label', {
            "class": 'wie-lab',
            "for": 'wie-alt'
          }, t.alt), this.altInput));
        }
        this.stage = h('div', {
          "class": 'wie-stage'
        });
        this.stageBox = h('div', {
          "class": 'wie-stagebox'
        });
        this.stage.append(this.stageBox);
        this.tabs = h('nav', {
          "class": 'wie-tabs',
          role: 'tablist'
        });
        this.panel = h('div', {
          "class": 'wie-panel'
        });
        this.side = h('aside', {
          "class": 'wie-side'
        }, this.tabs, this.panel, fields.length ? h('section', {
          "class": 'wie-meta'
        }, h('h4', null, t.details), fields) : null);
        this.doneBtn = h('button', {
          type: 'button',
          "class": 'wie-btn wie-btn-primary',
          onclick: function onclick() {
            return _this2.finish();
          }
        }, t.done);
        this.cancelBtn = h('button', {
          type: 'button',
          "class": 'wie-btn',
          onclick: function onclick() {
            return _this2.close(null);
          }
        }, t.cancel);
        this.dialog = h('div', {
          "class": 'wie-dialog',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': o.title || t.title,
          tabindex: '-1'
        }, h('header', {
          "class": 'wie-head'
        }, h('span', {
          "class": 'wie-title'
        }, o.title || t.title), h('span', {
          "class": 'wie-file'
        }, o.name || ''), h('button', {
          type: 'button',
          "class": 'wie-btn wie-btn-icon wie-btn-ghost wie-x',
          'aria-label': t.close,
          onclick: function onclick() {
            return _this2.close(null);
          },
          html: ICON.x
        })), this.stage, this.side, h('footer', {
          "class": 'wie-foot'
        }, this.cancelBtn, this.doneBtn));
        this.el = h('div', {
          "class": 'wie'
        }, this.dialog);
        doc().body.appendChild(this.el);
        this.onKey = function (e) {
          if (_this2.closed) return;
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopImmediatePropagation();
            _this2.close(null);
          } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            _this2.finish();
          } else if (e.key === 'Tab') _this2.trap(e);
        };
        doc().addEventListener('keydown', this.onKey, true);
        this.el.addEventListener('mousedown', function (e) {
          if (e.target === _this2.el) _this2._backdrop = true;else _this2._backdrop = false;
        });
        this.dialog.focus();
        if (!o.source) {
          this.metaOnly();
          return;
        }
        this.setStage('loading');
        loadSource(o.source, o.maxSide).then(function (src) {
          if (_this2.closed) return;
          _this2.source = src.canvas;
          _this2.sourceType = src.type;
          if (!_this2.ext) _this2.ext = TYPE_EXT[src.type] || '';
          _this2.setStage(null);
          _this2.buildTabs();
          _this2.activate(_this2.exts[0]);
        })["catch"](function (err) {
          if (_this2.closed) return;
          console.error('[ImageEditor]', err);
          _this2.setStage('error');
          _this2.doneBtn.disabled = true;
        });
      }
    }, {
      key: "setStage",
      value: function setStage(kind) {
        this.stageBox.innerHTML = '';
        if (kind === 'loading') this.stageBox.append(h('div', {
          "class": 'wie-msg'
        }, h('div', {
          "class": 'wie-spin'
        }), this.t.loading));
        if (kind === 'error') this.stageBox.append(h('div', {
          "class": 'wie-msg',
          role: 'alert'
        }, this.t.loadError));
      }
    }, {
      key: "metaOnly",
      value: function metaOnly() {
        this.stageBox.append(h('div', {
          "class": 'wie-msg'
        }, h('span', {
          html: ICON.file
        }), h('span', null, this.base + (this.ext ? '.' + this.ext : ''))));
        this.tabs.style.display = 'none';
        if (this.nameInput) this.nameInput.focus();
      }
    }, {
      key: "buildTabs",
      value: function buildTabs() {
        var _this3 = this;
        this.tabs.innerHTML = '';
        if (this.exts.length < 2) {
          this.tabs.style.display = 'none';
          return;
        }
        this.exts.forEach(function (e) {
          e._tab = h('button', {
            type: 'button',
            role: 'tab',
            "class": 'wie-tab',
            onclick: function onclick() {
              return _this3.activate(e);
            },
            html: (e.icon || '') + '<span></span>'
          });
          e._tab.lastChild.textContent = _this3.o.texts && _this3.o.texts[e.name] || e.label || e.name;
          _this3.tabs.append(e._tab);
        });
      }
    }, {
      key: "ctxFor",
      value: function ctxFor(e) {
        var self = this;
        return {
          editor: self,
          t: self.t,
          h: h,
          stage: self.stageBox,
          panel: self.panel,
          options: extOptions(e, self.o),
          get params() {
            return self.params[e.name];
          },
          set: function set(patch) {
            Object.assign(self.params[e.name], patch);
            if (e.stage === 'preview') self.renderPreview();
          },
          input: function input() {
            return runPipeline(self.source, self.exts, self.params, self.o, e.order);
          },
          width: self.source.width,
          height: self.source.height
        };
      }
    }, {
      key: "activate",
      value: function activate(e) {
        if (!e || this.closed) return;
        if (this.cleanup) {
          this.cleanup();
          this.cleanup = null;
        }
        this.stageBox.innerHTML = '';
        this.panel.innerHTML = '';
        this.active = e;
        this.exts.forEach(function (x) {
          if (x._tab) {
            x._tab.classList.toggle('is-on', x === e);
            x._tab.setAttribute('aria-selected', x === e ? 'true' : 'false');
          }
        });
        var ctx = this.ctxFor(e);
        if (e.stage === 'preview') this.renderPreview();
        this.cleanup = e.mount && e.mount(ctx) || null;
      }
    }, {
      key: "renderPreview",
      value: function renderPreview() {
        var out = runPipeline(this.source, this.exts, this.params, this.o);
        var cv = this.stageBox.querySelector('canvas.wie-prev');
        if (!cv) {
          cv = h('canvas', {
            "class": 'wie-prev wie-cv'
          });
          this.stageBox.prepend(cv);
        }
        var sw = this.stage.clientWidth - 40,
          sh = this.stage.clientHeight - 40;
        var k = Math.min(1, sw / out.width, sh / out.height);
        cv.width = Math.max(1, Math.round(out.width * k));
        cv.height = Math.max(1, Math.round(out.height * k));
        var x = cv.getContext('2d');
        x.imageSmoothingQuality = 'high';
        x.drawImage(out, 0, 0, cv.width, cv.height);
      }
    }, {
      key: "changed",
      value: function changed() {
        if (!this.source) return false;
        var c = this.source;
        var _iterator2 = _createForOfIteratorHelper(this.exts),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var e = _step2.value;
            var info = {
              width: c.width,
              height: c.height,
              options: extOptions(e, this.o)
            };
            if (e.isDefault && e.isDefault(this.params[e.name], info)) continue;
            return true;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return false;
      }
    }, {
      key: "finish",
      value: function () {
        var _finish = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
          var out, cfg, c, type, base, _t;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.p = _context.n) {
              case 0:
                if (!(this.closed || this.busy)) {
                  _context.n = 1;
                  break;
                }
                return _context.a(2);
              case 1:
                this.busy = true;
                this.doneBtn.disabled = true;
                this.doneBtn.textContent = this.t.saving;
                _context.p = 2;
                out = {
                  changed: false,
                  blob: null,
                  params: clone(this.params),
                  width: 0,
                  height: 0,
                  type: this.sourceType || ''
                };
                if (!this.source) {
                  _context.n = 4;
                  break;
                }
                out.width = this.source.width;
                out.height = this.source.height;
                out.sourceWidth = this.source.width;
                out.sourceHeight = this.source.height;
                if (!this.changed()) {
                  _context.n = 4;
                  break;
                }
                cfg = this.o.output || {};
                c = runPipeline(this.source, this.exts, this.params, this.o);
                c = scaleDown(c, cfg.maxWidth, cfg.maxHeight);
                type = pickType(this.sourceType, cfg.type);
                _context.n = 3;
                return toBlob(c, type, cfg.quality == null ? 0.92 : cfg.quality);
              case 3:
                out.blob = _context.v;
                out.changed = true;
                out.type = out.blob.type || type;
                out.width = c.width;
                out.height = c.height;
                if (out.type !== this.sourceType && TYPE_EXT[out.type]) this.ext = TYPE_EXT[out.type];
              case 4:
                base = this.nameInput ? this.nameInput.value.trim() : this.base;
                out.name = (base || this.base || 'file') + (this.ext ? '.' + this.ext : '');
                out.alt = this.altInput ? this.altInput.value.trim() : this.alt;
                this.close(out);
                _context.n = 6;
                break;
              case 5:
                _context.p = 5;
                _t = _context.v;
                console.error('[ImageEditor]', _t);
                this.busy = false;
                this.doneBtn.disabled = false;
                this.doneBtn.textContent = this.t.done;
              case 6:
                return _context.a(2);
            }
          }, _callee, this, [[2, 5]]);
        }));
        function finish() {
          return _finish.apply(this, arguments);
        }
        return finish;
      }()
    }, {
      key: "trap",
      value: function trap(e) {
        var list = [].slice.call(this.dialog.querySelectorAll('button,input,textarea,select,[tabindex]:not([tabindex="-1"])')).filter(function (x) {
          return !x.disabled && x.offsetParent !== null;
        });
        if (!list.length) return;
        var first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && (doc().activeElement === first || doc().activeElement === this.dialog)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && doc().activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }, {
      key: "close",
      value: function close(result) {
        var _this4 = this;
        if (this.closed) return;
        this.closed = true;
        if (this.cleanup) {
          this.cleanup();
          this.cleanup = null;
        }
        doc().removeEventListener('keydown', this.onKey, true);
        doc().body.style.overflow = this.prevOverflow || '';
        var done = function done() {
          if (_this4.el.parentNode) _this4.el.parentNode.removeChild(_this4.el);
          if (_this4.prevFocus && _this4.prevFocus.focus) {
            try {
              _this4.prevFocus.focus();
            } catch (e) {/* элемента уже нет */}
          }
        };
        this.el.classList.add('is-out');
        setTimeout(done, this.o.animate === false ? 0 : 170);
        this.resolve(result);
      }
    }]);
  }(); // ------------------------------------------------------------------ публичное API
  var ImageEditor = {
    version: '1.0.0',
    geometry: G,
    util: {
      splitName: splitName,
      pickType: pickType,
      TYPE_EXT: TYPE_EXT,
      EXT_TYPE: EXT_TYPE
    },
    extension: extension,
    extensions: function extensions() {
      return Object.keys(registry);
    },
    // открыть редактор; Promise<{ changed, blob, name, alt, params, width, height, type } | null>
    open: function open(options) {
      return new Promise(function (resolve) {
        return new Editor(options || {}, resolve).start();
      });
    },
    // без интерфейса: применить сохранённые params к источнику (для пересборки миниатюр и сжатия перед загрузкой)
    render: function render(source, params, output, options) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var o, src, exts, c, cfg;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              o = Object.assign({}, options);
              _context2.n = 1;
              return loadSource(source, o.maxSide);
            case 1:
              src = _context2.v;
              exts = resolveExts(o.extensions);
              c = runPipeline(src.canvas, exts, params || {}, o);
              cfg = output || {};
              c = scaleDown(c, cfg.maxWidth, cfg.maxHeight);
              return _context2.a(2, {
                canvas: c,
                type: src.type,
                width: c.width,
                height: c.height,
                sourceWidth: src.canvas.width,
                sourceHeight: src.canvas.height
              });
          }
        }, _callee2);
      }))();
    },
    process: function process(source, params, output, options) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var r, cfg, type, blob;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return ImageEditor.render(source, params, output, options);
            case 1:
              r = _context3.v;
              cfg = output || {};
              type = pickType(r.type, cfg.type);
              _context3.n = 2;
              return toBlob(r.canvas, type, cfg.quality == null ? 0.92 : cfg.quality);
            case 2:
              blob = _context3.v;
              return _context3.a(2, {
                blob: blob,
                type: blob.type || type,
                width: r.width,
                height: r.height,
                sourceType: r.type
              });
          }
        }, _callee3);
      }))();
    }
  };
  root.ImageEditor = ImageEditor;
  if ( true && module.exports) module.exports = ImageEditor;
})(typeof window !== 'undefined' ? window : globalThis);

/***/ })
/******/ ]);