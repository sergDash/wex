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

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*!
 * w-gallery.js 1.0.0: Image / Carousel / Lightbox / Zoom-lens для Wex
 *
 * Подключать ПОСЛЕ wex.js и ДО $('#app').state(...).mount().
 * Настройки: window.WGalleryConfig = {...} до подключения файла
 *            или WGallery.configure({...}) после (до mount).
 *
 * Архитектура (важно, чтобы переживать перерисовки Wex):
 *  - компоненты <Image> и <Carousel> только генерируют статичную разметку с data-wg-* атрибутами;
 *  - всё поведение (лайтбокс, лупа, карусель) живёт в рантайме и вешается делегированием
 *    и MutationObserver-ом, поэтому diff/patch Wex его не ломает: после каждого патча
 *    карусель сама восстанавливает точки, стрелки и классы активности.
 *  - слайды = нативный overflow + scroll-snap (свайп, инерция, вертикаль работают сами).
 *
 * Без Wex тоже работает: достаточно разметки
 *   <div class="wg-carousel" data-wg-autoslide="1"><div class="wg-track"><div class="wg-slide">..</div></div></div>
 * и атрибутов w-zoom-lightbox / w-zoom-lense на любых картинках.
 */
;
(function (global) {
  'use strict';

  if (global.WGallery) return;
  var doc = global.document;

  // ===================================================================
  // НАСТРОЙКИ
  // ===================================================================
  var CONFIG = {
    styles: true,
    // инжектировать встроенный CSS
    respectReducedMotion: true,
    // prefers-reduced-motion выключает автослайд и плавность
    // именованные пороги (min-width, mobile-first) для :per-view / :gap. Свои: breakpoints="{ sm: 724 }" на каруселе
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    image: {
      lightbox: true,
      lazy: true
    },
    carousel: {
      // значения по умолчанию, когда проп не указан
      autoslide: false,
      interval: 4000,
      loop: false,
      hoverPause: true,
      dots: false,
      arrows: false,
      direction: 'horizontal',
      perView: 1,
      gap: 0,
      step: 1,
      start: 0,
      mouseDrag: true
    },
    lightbox: {
      loop: true,
      closeOnBackdrop: true,
      preload: true,
      lockScroll: true
    },
    lens: {
      size: 160,
      zoom: 2.5,
      shape: 'square'
    },
    // shape: 'square' | 'circle'
    // классы, которые навешиваются на сгенерированные элементы (удобно для Quas/Tailwind)
    classes: {
      dot: '',
      dotActive: '',
      arrow: '',
      thumb: '',
      thumbActive: ''
    },
    i18n: {
      prev: 'Previous',
      next: 'Next',
      close: 'Close',
      slide: 'Slide {n}',
      counter: '{i} / {n}',
      error: 'Image failed to load',
      viewer: 'Image viewer',
      carousel: 'Carousel'
    }
  };
  var isObj = function isObj(v) {
    return v !== null && _typeof(v) === 'object' && !Array.isArray(v);
  };
  function merge(t, s) {
    Object.keys(s || {}).forEach(function (k) {
      if (isObj(s[k]) && isObj(t[k])) merge(t[k], s[k]);else t[k] = s[k];
    });
    return t;
  }
  merge(CONFIG, global.WGalleryConfig);

  // ===================================================================
  // УТИЛИТЫ
  // ===================================================================
  var toBool = function toBool(v, d) {
    return v == null ? d : v === '' ? true : typeof v === 'string' ? !/^(false|0|no|off|null|undefined)$/i.test(v.trim()) : !!v;
  };
  var toNum = function toNum(v, d) {
    if (v == null || v === '') return d;
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? n : d;
  };
  function toMs(v, d) {
    if (v == null || v === '') return d;
    if (typeof v === 'number') return v;
    var m = /^\s*([\d.]+)\s*(ms|s)?\s*$/i.exec(v);
    if (!m) return d;
    var n = parseFloat(m[1]);
    return (m[2] || 'ms').toLowerCase() === 's' ? n * 1000 : n;
  }
  var fmt = function fmt(s, o) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return o && k in o ? o[k] : m;
    });
  };
  var tokens = function tokens(s) {
    return s ? String(s).split(/\s+/).filter(Boolean) : [];
  };
  var setClasses = function setClasses(el, str, on) {
    return tokens(str).forEach(function (t) {
      return el.classList.toggle(t, !!on);
    });
  };
  var reduced = function reduced() {
    return !!(CONFIG.respectReducedMotion && global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };
  var cssEsc = function cssEsc(s) {
    return global.CSS && global.CSS.escape ? global.CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&');
  };
  // выражения вида {{ }} внутри уже вычисленных значений Wex интерполировал бы повторно
  var guard = function guard(s) {
    return typeof s === 'string' && s.indexOf('{{') > -1 ? s.replace(/\{\{/g, "{\u200B{") : s;
  };
  var IMG_URL = /\.(png|jpe?g|gif|webp|avif|svg|bmp)([?#].*)?$/i;
  function autoAlt(url) {
    try {
      var f = decodeURIComponent(String(url).split(/[?#]/)[0].split('/').pop() || '');
      return f.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_+]+/g, ' ').trim();
    } catch (e) {
      return '';
    }
  }

  // порог -> значение: { base: 1, sm: 2, md: 4 } или просто число
  function responsive(v, bp, dflt) {
    if (isObj(v)) {
      var map = Object.assign({}, CONFIG.breakpoints, bp || {});
      var w = global.innerWidth || 1024;
      var out = v.base != null ? v.base : v.xs != null ? v.xs : dflt;
      Object.keys(v).filter(function (k) {
        return k !== 'base' && k !== 'xs';
      }).map(function (k) {
        return [k, map[k] != null ? map[k] : isFinite(+k) ? +k : null];
      }).filter(function (p) {
        return p[1] != null;
      }).sort(function (a, b) {
        return a[1] - b[1];
      }).forEach(function (p) {
        if (w >= p[1]) out = v[p[0]];
      });
      return toNum(out, dflt);
    }
    return toNum(v, dflt);
  }

  // элементы создаём в инертном документе: картинки не грузятся, пока Wex не вставит их в страницу
  var idoc = null;
  function mk(tag, cls, attrs) {
    idoc = idoc || doc.implementation.createHTMLDocument('');
    var e = idoc.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) {
      return setAttr(e, k, attrs[k]);
    });
    return e;
  }
  function setAttr(e, k, v) {
    if (v === false || v == null) return;
    try {
      e.setAttribute(k, v === true ? '' : String(v));
    } catch (_) {/* невалидное имя атрибута */}
  }

  // ===================================================================
  // ЧТЕНИЕ ПРОПОВ ИЗ ШАБЛОНА WEX
  // :x="expr" вычисляется в scope родителя; x="text" строка (с {{ }} тоже)
  // ===================================================================
  function P(scope, attrs, names) {
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      if (attrs[':' + n] != null) {
        var v = void 0;
        try {
          v = scope.parse(attrs[':' + n]);
        } catch (e) {
          v = String(attrs[':' + n]).trim();
        } // :interval="3000ms"
        return guard(v);
      }
      if (attrs[n] != null) {
        var _v = attrs[n];
        if (String(_v).indexOf('{{') > -1) {
          try {
            _v = scope.interpolate(_v);
          } catch (e) {/* оставим как есть */}
        }
        return guard(_v);
      }
    }
    return undefined;
  }
  // имя (name, thumbs-of): принимаем и name="x", и :name="x" (если x не переменная, берём как строку)
  function Pname(scope, attrs, names) {
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      if (attrs[':' + n] != null) {
        var expr = String(attrs[':' + n]).trim();
        var v = void 0;
        try {
          v = scope.parse(expr);
        } catch (e) {/* не выражение */}
        return typeof v === 'string' && v ? v : typeof v === 'number' ? String(v) : expr;
      }
      if (attrs[n] != null) return String(attrs[n]);
    }
    return undefined;
  }
  function copyAttrs(el, scope, attrs, skip) {
    Object.keys(attrs).forEach(function (k) {
      if (k[0] === '@') return;
      var dyn = k[0] === ':';
      var bare = dyn ? k.slice(1) : k;
      var v;
      if (dyn) {
        try {
          v = scope.parse(attrs[k]);
        } catch (e) {
          return;
        }
        v = guard(v);
      } else v = attrs[k];
      if (bare === 'class') {
        if (v) el.className = (el.className + ' ' + v).trim();
        return;
      }
      if (skip.indexOf(bare) > -1) return;
      setAttr(el, bare, v);
    });
  }

  // ===================================================================
  // ОПЦИИ КАРУСЕЛИ: одна таблица для компонента (пропы -> data-wg-*) и рантайма (data-wg-* -> опции)
  // ===================================================================
  var OPTS = [
  // ключ,        data-wg-*,        тип,    алиасы пропа
  ['autoslide', 'autoslide', 'bool'], ['interval', 'interval', 'ms'], ['loop', 'loop', 'bool'], ['hoverPause', 'hover-pause', 'bool'], ['dots', 'navigate-dots', 'bool'], ['arrows', 'navigate-arrows', 'bool', ['navigation']], ['direction', 'direction', 'str'], ['perView', 'per-view', 'json'], ['gap', 'gap', 'json'], ['breakpoints', 'breakpoints', 'json'], ['step', 'step', 'num'], ['start', 'start', 'num'], ['mouseDrag', 'mouse-drag', 'bool'], ['name', 'name', 'name'], ['thumbsOf', 'thumbs-of', 'name']];
  var MO_CFG = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'disabled', 'hidden', 'aria-current', 'data-wg-disabled'].concat(OPTS.map(function (o) {
      return 'data-wg-' + o[1];
    }))
  };

  // ===================================================================
  // КАРУСЕЛЬ (рантайм)
  // ===================================================================
  var instances = new Set();
  var byEl = new WeakMap();
  var named = new Map();
  var Carousel = /*#__PURE__*/function () {
    function Carousel(root) {
      var _this = this;
      _classCallCheck(this, Carousel);
      this.root = root;
      this.opt = {};
      this.track = null;
      this.dead = false;
      this.ready = false;
      this.index = 0;
      this.pending = null;
      this.count = 0;
      this.max = 0;
      this.maxIndex = 0;
      this.targets = [];
      this.vertical = false;
      this.name = '';
      this.timer = 0;
      this.idleT = 0;
      this.raf = 0;
      this.queued = false;
      this.swallow = false;
      this.lastIndex = -1;
      this.flags = {
        hover: false,
        focus: false,
        touch: false,
        drag: null,
        inView: true
      };
      this.dotEls = [];
      this.dotsBox = null;
      this.thumbNodes = [];
      this.thumbSig = '';
      this.main = null;
      this.listeners = new Set();
      this.listenSig = '';
      this.offs = [];
      this.trackOffs = [];
      ['onScroll', 'onKey', 'onDown', 'onMove', 'onUp', 'onClickCapture', 'clearPending'].forEach(function (m) {
        _this[m] = _this[m].bind(_this);
      });
      this.mo = new MutationObserver(function () {
        return _this.schedule();
      });
      this.ro = global.ResizeObserver ? new global.ResizeObserver(function () {
        return _this.schedule();
      }) : null;
      this.io = global.IntersectionObserver ? new global.IntersectionObserver(function (es) {
        _this.flags.inView = es[es.length - 1].isIntersecting;
        _this.restart();
      }) : null;
      byEl.set(root, this);
      instances.add(this);
      this.bindRoot();
      if (this.io) this.io.observe(root);
      this.sync();
    }

    // ---------- жизненный цикл ----------
    return _createClass(Carousel, [{
      key: "on",
      value: function on(target, ev, fn, opts, list) {
        target.addEventListener(ev, fn, opts);
        (list || this.offs).push(function () {
          return target.removeEventListener(ev, fn, opts);
        });
      }

      // изменения DOM, которые делаем сами, не должны будить наблюдатель
    }, {
      key: "quiet",
      value: function quiet(fn) {
        var rec = this.mo.takeRecords();
        this.mo.disconnect();
        try {
          fn();
        } finally {
          this.mo.observe(this.root, MO_CFG);
        }
        if (rec.length) this.schedule();
      }
    }, {
      key: "schedule",
      value: function schedule() {
        var _this2 = this;
        if (this.queued || this.dead) return;
        this.queued = true;
        Promise.resolve().then(function () {
          _this2.queued = false;
          _this2.sync();
        });
      }
    }, {
      key: "sync",
      value: function sync() {
        var _this3 = this;
        if (this.dead || !this.root.isConnected) return;
        this.quiet(function () {
          _this3.readOptions();
          _this3.bindTrack();
          _this3.layout();
          _this3.measure();
          _this3.link();
          _this3.syncDots();
          if (_this3.pending == null) _this3.index = Math.min(_this3.fromScroll(), _this3.maxIndex);
          _this3.paint();
        });
        if (!this.ready) {
          this.ready = true;
          this.lastIndex = this.index;
          if (this.opt.start > 0 && this.maxIndex > 0 && !this.opt.thumbsOf) this.goTo(this.opt.start, true);
          this.emit('wready');
        } else if (this.index !== this.lastIndex) {
          this.lastIndex = this.index;
          this.emit('wslide');
        }
        this.notifyListeners();
        this.restart();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this.dead) return;
        this.dead = true;
        clearTimeout(this.timer);
        clearTimeout(this.idleT);
        if (this.raf) global.cancelAnimationFrame(this.raf);
        this.mo.disconnect();
        if (this.ro) this.ro.disconnect();
        if (this.io) this.io.disconnect();
        this.offs.forEach(function (f) {
          return f();
        });
        this.trackOffs.forEach(function (f) {
          return f();
        });
        if (this.main) this.main.listeners["delete"](this);
        if (this.name && named.get(this.name) === this) named["delete"](this.name);
        instances["delete"](this);
        byEl["delete"](this.root);
      }

      // ---------- опции ----------
    }, {
      key: "readOptions",
      value: function readOptions() {
        var _this4 = this;
        var r = this.root;
        var d = CONFIG.carousel;
        var o = {};
        OPTS.forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
            key = _ref2[0],
            attr = _ref2[1],
            type = _ref2[2];
          var raw = r.getAttribute('data-wg-' + attr);
          var v;
          if (raw == null) v = d[key];else if (type === 'bool') v = toBool(raw, d[key]);else if (type === 'ms') v = toMs(raw, d[key]);else if (type === 'num') v = toNum(raw, d[key]);else if (type === 'json') {
            try {
              v = JSON.parse(raw);
            } catch (e) {
              v = toNum(raw, d[key]);
            }
          } else v = raw;
          o[key] = v;
        });
        o.name = o.name || '';
        o.thumbsOf = o.thumbsOf || '';
        o.step = Math.max(1, Math.round(toNum(o.step, 1)) || 1);
        o.start = Math.max(0, Math.round(toNum(o.start, 0)) || 0);
        o.interval = Math.max(500, toNum(o.interval, 4000));
        o.direction = o.direction === 'vertical' ? 'vertical' : 'horizontal';
        if (o.name !== this.name) {
          if (this.name && named.get(this.name) === this) named["delete"](this.name);
          this.name = o.name;
          if (o.name) {
            named.set(o.name, this);
            instances.forEach(function (i) {
              if (i !== _this4 && i.opt && i.opt.thumbsOf === o.name) i.schedule();
            });
          }
        }
        this.opt = o;
        this.vertical = o.direction === 'vertical';
      }
    }, {
      key: "layout",
      value: function layout() {
        var t = this.track;
        if (!t) return;
        var o = this.opt;
        var pv = Math.max(0.1, responsive(o.perView, o.breakpoints, 1));
        var gap = Math.max(0, responsive(o.gap, o.breakpoints, 0));
        var set = function set(k, v) {
          if (t.style.getPropertyValue(k) !== String(v)) t.style.setProperty(k, String(v));
        };
        set('--wg-pv', pv);
        set('--wg-gap', gap + 'px');
      }

      // ---------- привязка к DOM ----------
    }, {
      key: "slides",
      value: function slides() {
        return this.track ? Array.prototype.filter.call(this.track.children, function (c) {
          return c.classList.contains('wg-slide');
        }) : [];
      }
    }, {
      key: "bindTrack",
      value: function bindTrack() {
        var t = this.root.querySelector(':scope > .wg-track');
        if (t === this.track) return;
        this.trackOffs.forEach(function (f) {
          return f();
        });
        this.trackOffs = [];
        this.track = t;
        if (this.ro) this.ro.disconnect();
        if (!t) return;
        if (this.ro) {
          this.ro.observe(this.root);
          this.ro.observe(t);
        }
        var L = this.trackOffs;
        this.on(t, 'scroll', this.onScroll, {
          passive: true
        }, L);
        this.on(t, 'pointerdown', this.onDown, false, L);
        this.on(t, 'click', this.onClickCapture, true, L);
        this.on(t, 'wheel', this.clearPending, {
          passive: true
        }, L);
        this.on(t, 'touchstart', this.clearPending, {
          passive: true
        }, L);
        this.on(t, 'dragstart', function (e) {
          return e.preventDefault();
        }, false, L);
      }
    }, {
      key: "bindRoot",
      value: function bindRoot() {
        var _this5 = this;
        var r = this.root;
        var fv = function fv(el) {
          try {
            return el.matches(':focus-visible');
          } catch (e) {
            return true;
          }
        };
        this.on(r, 'pointerenter', function (e) {
          if (e.pointerType === 'mouse') {
            _this5.flags.hover = true;
            _this5.restart();
          }
        });
        this.on(r, 'pointerleave', function (e) {
          if (e.pointerType === 'mouse') {
            _this5.flags.hover = false;
            _this5.restart();
          }
        });
        this.on(r, 'focusin', function (e) {
          if (fv(e.target)) {
            _this5.flags.focus = true;
            _this5.restart();
          }
        });
        this.on(r, 'focusout', function () {
          _this5.flags.focus = false;
          _this5.restart();
        });
        this.on(r, 'pointerdown', function (e) {
          if (e.pointerType !== 'mouse') {
            _this5.flags.touch = true;
            _this5.restart();
          }
        });
        var end = function end() {
          if (_this5.flags.touch) {
            _this5.flags.touch = false;
            _this5.restart();
          }
        };
        this.on(r, 'pointerup', end);
        this.on(r, 'pointercancel', end);
        this.on(r, 'keydown', this.onKey);
      }

      // ---------- геометрия ----------
    }, {
      key: "measure",
      value: function measure() {
        var t = this.track;
        var sl = this.slides();
        this.count = sl.length;
        if (!t || !sl.length) {
          this.max = 0;
          this.maxIndex = 0;
          this.targets = [];
          return;
        }
        var v = this.vertical;
        var view = v ? t.clientHeight : t.clientWidth;
        var full = v ? t.scrollHeight : t.scrollWidth;
        var max = Math.max(0, full - view);
        var pos = function pos(s) {
          return v ? s.offsetTop : s.offsetLeft;
        };
        var base = pos(sl[0]);
        this.targets = sl.map(function (s) {
          return pos(s) - base;
        });
        var mi = 0;
        if (max > 1) {
          mi = sl.length - 1;
          for (var i = 0; i < sl.length; i++) {
            if (this.targets[i] >= max - 1) {
              mi = i;
              break;
            }
          }
        }
        this.max = max;
        this.maxIndex = mi;
      }
    }, {
      key: "fromScroll",
      value: function fromScroll() {
        var t = this.track;
        if (!t || !this.targets.length) return 0;
        var cur = this.vertical ? t.scrollTop : t.scrollLeft;
        if (this.max > 1 && cur >= this.max - 1) return this.maxIndex;
        var best = 0;
        var bd = Infinity;
        for (var i = 0; i < this.targets.length; i++) {
          var d = Math.abs(this.targets[i] - cur);
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
        return Math.min(best, this.maxIndex);
      }

      // ---------- навигация ----------
    }, {
      key: "cur",
      value: function cur() {
        return this.pending != null ? this.pending : this.index;
      }
    }, {
      key: "goTo",
      value: function goTo(i, instant) {
        if (!this.track) return;
        this.measure();
        i = Math.max(0, Math.min(this.maxIndex, Math.round(i) || 0));
        var to = Math.min(this.targets[i] || 0, this.max);
        this.pending = i;
        this.setIndex(i);
        var t = this.track;
        var o = {
          behavior: instant || reduced() ? 'auto' : 'smooth'
        };
        o[this.vertical ? 'top' : 'left'] = to;
        try {
          t.scrollTo(o);
        } catch (e) {
          if (this.vertical) t.scrollTop = to;else t.scrollLeft = to;
        }
        this.armIdle(700);
        this.restart();
      }
    }, {
      key: "next",
      value: function next() {
        this.measure();
        var c = this.cur();
        if (c >= this.maxIndex) {
          if (this.opt.loop) this.goTo(0);
          return;
        }
        this.goTo(c + this.opt.step);
      }
    }, {
      key: "prev",
      value: function prev() {
        this.measure();
        var c = this.cur();
        if (c <= 0) {
          if (this.opt.loop) this.goTo(this.maxIndex);
          return;
        }
        this.goTo(c - this.opt.step);
      }
    }, {
      key: "setIndex",
      value: function setIndex(i) {
        var _this6 = this;
        if (i === this.index) return;
        this.index = i;
        this.lastIndex = i;
        this.quiet(function () {
          return _this6.paint();
        });
        this.emit('wslide');
        this.listeners.forEach(function (l) {
          return l.onMain();
        });
      }
    }, {
      key: "clearPending",
      value: function clearPending() {
        this.pending = null;
      }
    }, {
      key: "armIdle",
      value: function armIdle(ms) {
        var _this7 = this;
        clearTimeout(this.idleT);
        this.idleT = setTimeout(function () {
          _this7.pending = null;
          _this7.setIndex(Math.min(_this7.fromScroll(), _this7.maxIndex));
          _this7.restart();
        }, ms);
      }
    }, {
      key: "onScroll",
      value: function onScroll() {
        var _this8 = this;
        clearTimeout(this.timer);
        this.timer = 0;
        if (!this.raf) {
          this.raf = global.requestAnimationFrame(function () {
            _this8.raf = 0;
            if (_this8.dead) return;
            var idx = _this8.fromScroll();
            if (_this8.pending != null) {
              if (idx === _this8.pending) _this8.pending = null;
            } else _this8.setIndex(idx);
          });
        }
        this.armIdle(150);
      }

      // ---------- перетаскивание мышью (touch скроллится нативно) ----------
    }, {
      key: "onDown",
      value: function onDown(e) {
        if (!this.opt.mouseDrag || e.pointerType !== 'mouse' || e.button !== 0) return;
        if (e.target.closest && e.target.closest('input,textarea,select')) return;
        var t = this.track;
        this.pending = null;
        this.flags.drag = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          moved: false,
          vel: 0,
          s: this.vertical ? t.scrollTop : t.scrollLeft,
          lastT: e.timeStamp,
          lastP: this.vertical ? e.clientY : e.clientX
        };
        doc.addEventListener('pointermove', this.onMove);
        doc.addEventListener('pointerup', this.onUp);
        doc.addEventListener('pointercancel', this.onUp);
      }
    }, {
      key: "onMove",
      value: function onMove(e) {
        var d = this.flags.drag;
        if (!d || e.pointerId !== d.id) return;
        var v = this.vertical;
        var p = v ? e.clientY : e.clientX;
        var delta = p - (v ? d.y : d.x);
        var t = this.track;
        if (!d.moved) {
          if (Math.abs(delta) < 6) return;
          d.moved = true;
          t.classList.add('wg-dragging');
          try {
            t.setPointerCapture(d.id);
          } catch (_) {/* ok */}
          try {
            global.getSelection().removeAllRanges();
          } catch (_) {/* ok */}
          this.restart();
        }
        var dt = e.timeStamp - d.lastT;
        if (dt > 0) d.vel = (p - d.lastP) / dt;
        d.lastT = e.timeStamp;
        d.lastP = p;
        if (v) t.scrollTop = d.s - delta;else t.scrollLeft = d.s - delta;
      }
    }, {
      key: "onUp",
      value: function onUp() {
        var _this9 = this;
        var d = this.flags.drag;
        doc.removeEventListener('pointermove', this.onMove);
        doc.removeEventListener('pointerup', this.onUp);
        doc.removeEventListener('pointercancel', this.onUp);
        this.flags.drag = null;
        if (!d || !d.moved) return;
        var t = this.track;
        t.classList.remove('wg-dragging');
        this.swallow = true;
        setTimeout(function () {
          _this9.swallow = false;
        }, 0);
        var idx = this.fromScroll();
        if (idx === this.index && Math.abs(d.vel) > 0.35) idx += d.vel < 0 ? 1 : -1;
        this.goTo(idx);
      }
    }, {
      key: "onClickCapture",
      value: function onClickCapture(e) {
        if (this.swallow) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    }, {
      key: "onKey",
      value: function onKey(e) {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        var t = e.target;
        if (!t || !t.closest || t.closest('input,textarea,select,[contenteditable="true"]')) return;
        if (t.closest('.wg-carousel') !== this.root) return;
        var v = this.vertical;
        var k = e.key;
        if (k === (v ? 'ArrowUp' : 'ArrowLeft')) {
          this.prev();
          e.preventDefault();
        } else if (k === (v ? 'ArrowDown' : 'ArrowRight')) {
          this.next();
          e.preventDefault();
        } else if (k === 'Home') {
          this.goTo(0);
          e.preventDefault();
        } else if (k === 'End') {
          this.goTo(this.maxIndex);
          e.preventDefault();
        }
      }

      // ---------- автослайд ----------
    }, {
      key: "canAuto",
      value: function canAuto() {
        var o = this.opt;
        var f = this.flags;
        return !this.dead && !!o.autoslide && !this.main && this.count > 1 && this.maxIndex > 0 && !(o.hoverPause && f.hover) && !f.focus && !f.touch && !f.drag && f.inView && !doc.hidden && !reduced();
      }
    }, {
      key: "restart",
      value: function restart() {
        var _this0 = this;
        clearTimeout(this.timer);
        this.timer = 0;
        if (!this.canAuto()) return;
        this.timer = setTimeout(function () {
          return _this0.tick();
        }, this.opt.interval);
      }
    }, {
      key: "tick",
      value: function tick() {
        this.timer = 0;
        if (!this.root.isConnected) {
          this.destroy();
          return;
        }
        if (!this.canAuto()) return;
        var c = this.cur();
        if (c >= this.maxIndex) {
          if (this.opt.loop) this.goTo(0);
          return;
        } // без loop автослайд останавливается на конце
        this.goTo(c + this.opt.step);
      }

      // ---------- точки ----------
    }, {
      key: "makeDot",
      value: function makeDot() {
        var d = mk('button', 'wg-dot');
        d.type = 'button';
        setClasses(d, CONFIG.classes.dot, true);
        return d;
      }
    }, {
      key: "syncDots",
      value: function syncDots() {
        var _this1 = this;
        var box = this.root.querySelector(':scope > [w-navigate-dots]');
        this.dotsBox = box;
        if (!box) {
          this.dotEls.length = 0;
          return;
        }
        var want = this.maxIndex > 0 ? this.maxIndex + 1 : 0;
        while (this.dotEls.length < want) this.dotEls.push(this.makeDot());
        this.dotEls.length = want;
        var cur = Array.prototype.filter.call(box.children, function (c) {
          return c.classList.contains('wg-dot');
        });
        var same = cur.length === want && cur.every(function (c, i) {
          return c === _this1.dotEls[i];
        });
        if (!same) {
          cur.forEach(function (c) {
            return c.parentNode.removeChild(c);
          });
          this.dotEls.forEach(function (d) {
            return box.appendChild(d);
          });
        }
        this.dotEls.forEach(function (d, i) {
          d.__wi = i;
          d.setAttribute('aria-label', fmt(CONFIG.i18n.slide, {
            n: i + 1
          }));
        });
      }

      // ---------- превью (thumbs-of) ----------
    }, {
      key: "slideInfos",
      value: function slideInfos() {
        return this.slides().map(function (s, i) {
          var t = s.querySelector('[data-wg-thumb]');
          var src = t && t.getAttribute('data-wg-thumb');
          if (!src) {
            var d = s.hasAttribute('data-thumb') ? s : s.querySelector('[data-thumb]');
            src = d && d.getAttribute('data-thumb');
          }
          if (!src) {
            var im = s.querySelector('img');
            src = im && (im.getAttribute('src') || im.currentSrc);
          }
          return {
            src: src || '',
            n: i + 1
          };
        });
      }
    }, {
      key: "link",
      value: function link() {
        var _this10 = this;
        var name = this.opt.thumbsOf;
        if (!name) {
          if (this.main) {
            this.main.listeners["delete"](this);
            this.main = null;
          }
          return;
        }
        var main = named.get(name) || null;
        if (main !== this.main) {
          if (this.main) this.main.listeners["delete"](this);
          this.main = main && main !== this ? main : null;
          if (this.main) this.main.listeners.add(this);
        }
        if (!this.main || !this.track) return;
        var infos = this.main.slideInfos();
        var sig = JSON.stringify(infos);
        var t = this.track;
        if (sig !== this.thumbSig) {
          this.thumbSig = sig;
          this.thumbNodes = infos.map(function (inf) {
            var b = mk('button', 'wg-slide wg-thumb', {
              type: 'button',
              'aria-label': fmt(CONFIG.i18n.slide, {
                n: inf.n
              })
            });
            setClasses(b, CONFIG.classes.thumb, true);
            if (inf.src) {
              var im = mk('img', '', {
                alt: '',
                draggable: 'false',
                loading: 'lazy',
                decoding: 'async'
              });
              im.setAttribute('src', inf.src);
              b.appendChild(im);
            } else b.textContent = String(inf.n);
            return b;
          });
        }
        // Wex при перерисовке родителя вычищает пустой трек: возвращаем те же узлы (картинки не перезагружаются)
        var present = Array.prototype.slice.call(t.children);
        var same = present.length === this.thumbNodes.length && present.every(function (c, i) {
          return c === _this10.thumbNodes[i];
        });
        if (!same) {
          present.forEach(function (c) {
            return t.removeChild(c);
          });
          this.thumbNodes.forEach(function (n) {
            return t.appendChild(n);
          });
        }
        this.thumbNodes.forEach(function (n, i) {
          n.__wi = i;
        });
        this.measure();
      }
    }, {
      key: "paintThumbs",
      value: function paintThumbs() {
        if (!this.main) return;
        var a = this.main.index;
        this.thumbNodes.forEach(function (n, i) {
          var on = i === a;
          n.classList.toggle('wg-active', on);
          setClasses(n, CONFIG.classes.thumbActive, on);
          n.setAttribute('aria-current', on ? 'true' : 'false');
        });
      }
    }, {
      key: "reveal",
      value: function reveal(i) {
        var t = this.track;
        var sl = this.slides();
        if (!t || !sl[i] || this.max <= 1) return;
        this.measure();
        var v = this.vertical;
        var view = v ? t.clientHeight : t.clientWidth;
        var size = v ? sl[i].offsetHeight : sl[i].offsetWidth;
        var cur = v ? t.scrollTop : t.scrollLeft;
        var start = this.targets[i];
        if (start >= cur && start + size <= cur + view) return;
        var to = Math.max(0, Math.min(this.max, start - (view - size) / 2));
        var o = {
          behavior: reduced() ? 'auto' : 'smooth'
        };
        o[v ? 'top' : 'left'] = to;
        try {
          t.scrollTo(o);
        } catch (e) {
          if (v) t.scrollTop = to;else t.scrollLeft = to;
        }
      }
    }, {
      key: "onMain",
      value: function onMain() {
        var _this11 = this;
        // главная карусель переключила слайд
        if (this.dead) return;
        this.quiet(function () {
          _this11.paintThumbs();
          _this11.reveal(_this11.main ? _this11.main.index : 0);
        });
      }
    }, {
      key: "notifyListeners",
      value: function notifyListeners() {
        if (!this.listeners.size) return;
        var sig = this.count + '|' + JSON.stringify(this.slideInfos());
        if (sig === this.listenSig) return;
        this.listenSig = sig;
        this.listeners.forEach(function (l) {
          return l.schedule();
        });
      }

      // ---------- состояние ----------
    }, {
      key: "navs",
      value: function navs(kind) {
        var attr = kind === 'prev' ? 'w-navigate-left' : 'w-navigate-right';
        return Array.prototype.filter.call(this.root.children, function (c) {
          return c.hasAttribute(attr);
        });
      }
    }, {
      key: "paint",
      value: function paint() {
        var _this12 = this;
        var idx = this.index;
        var o = this.opt;
        var can = this.maxIndex > 0;
        this.slides().forEach(function (s, i) {
          if (!s.classList.contains('wg-thumb')) s.classList.toggle('wg-active', i === idx);
        });
        this.dotEls.forEach(function (d, i) {
          var on = i === idx;
          d.classList.toggle('wg-active', on);
          setClasses(d, CONFIG.classes.dotActive, on);
          d.setAttribute('aria-current', on ? 'true' : 'false');
        });
        if (this.dotsBox && this.dotsBox.classList.contains('wg-dots')) this.dotsBox.hidden = !can;
        var off = {
          prev: !o.loop && idx <= 0,
          next: !o.loop && idx >= this.maxIndex
        };
        ['prev', 'next'].forEach(function (k) {
          _this12.navs(k).forEach(function (el) {
            var dis = !can || off[k];
            if (el.classList.contains('wg-arrow')) {
              el.hidden = !can;
              el.disabled = off[k];
            } else if (dis) {
              el.setAttribute('data-wg-disabled', '');
              el.setAttribute('aria-disabled', 'true');
            } else {
              el.removeAttribute('data-wg-disabled');
              el.removeAttribute('aria-disabled');
            }
          });
        });
        this.paintThumbs();
      }

      // ---------- события ----------
    }, {
      key: "emit",
      value: function emit(name) {
        var detail = {
          index: this.index,
          count: this.count,
          name: this.opt.name,
          carousel: this
        };
        var ev;
        try {
          ev = new global.CustomEvent(name, {
            bubbles: true,
            detail: detail
          });
        } catch (e) {
          return;
        }
        this.root.dispatchEvent(ev);
        var h = this.root.__wOn && this.root.__wOn[name.slice(1)]; // @slide / @ready из шаблона Wex
        if (h) {
          try {
            h(ev);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }], [{
      key: "of",
      value: function of(root) {
        if (!root) return null;
        if (!root.classList.contains('wg-carousel')) root = root.querySelector('.wg-carousel');
        return root ? byEl.get(root) || new Carousel(root) : null;
      }
    }]);
  }(); // ===================================================================
  // ЛУПА (делегирование: <img w-zoom-lense> и любой контейнер с картинкой)
  // ===================================================================
  function fullSrc(n) {
    var img = n.matches('img') ? n : n.querySelector('img');
    var src = n.getAttribute('w-full') || n.getAttribute('data-wg-full');
    if (!src) {
      var a = n.closest('a[href]');
      var href = a && a.getAttribute('href');
      if (href && (a === n || IMG_URL.test(href))) src = href;
    }
    if (!src && img) src = img.currentSrc || img.getAttribute('src') || '';
    return {
      src: src || '',
      img: img
    };
  }
  var Lens = {
    el: null,
    target: null,
    img: null,
    zoom: 2.5,
    size: 160,
    start: function start(t) {
      var f = fullSrc(t);
      if (!f.img || !f.src) return;
      var c = CONFIG.lens;
      this.zoom = toNum(t.getAttribute('w-zoom-lense'), 0) || toNum(t.getAttribute('w-lens-zoom'), c.zoom);
      this.size = toNum(t.getAttribute('w-lens-size'), c.size);
      var circle = (t.getAttribute('w-lens-shape') || c.shape) === 'circle';
      if (!this.el) {
        this.el = doc.createElement('div');
        this.el.className = 'wg-lens';
      }
      var s = this.el.style;
      s.width = this.size + 'px';
      s.height = this.size + 'px';
      s.borderRadius = circle ? '50%' : '4px';
      s.backgroundImage = 'url("' + f.src.replace(/"/g, '%22') + '")';
      if (!this.el.parentNode) doc.body.appendChild(this.el);
      this.target = t;
      this.img = f.img;
    },
    update: function update(x, y) {
      var r = this.img.getBoundingClientRect();
      var el = this.el;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) {
        el.classList.remove('wg-on');
        return;
      }
      var z = this.zoom;
      var s = this.size;
      el.classList.add('wg-on');
      el.style.transform = 'translate(' + (x - s / 2) + 'px,' + (y - s / 2) + 'px)';
      el.style.backgroundSize = r.width * z + 'px ' + r.height * z + 'px';
      el.style.backgroundPosition = s / 2 - (x - r.left) * z + 'px ' + (s / 2 - (y - r.top) * z) + 'px';
    },
    stop: function stop() {
      if (this.el) this.el.classList.remove('wg-on');
      this.target = null;
      this.img = null;
    }
  };
  function onPointerMove(e) {
    if (e.pointerType === 'touch') return;
    if (e.buttons) {
      if (Lens.target) Lens.stop();
      return;
    }
    var t = e.target && e.target.closest ? e.target.closest('[w-zoom-lense]') : null;
    if (t !== Lens.target) {
      Lens.stop();
      if (t && (!global.matchMedia || global.matchMedia('(hover: hover)').matches)) Lens.start(t);
    }
    if (Lens.target) Lens.update(e.clientX, e.clientY);
  }

  // ===================================================================
  // ЛАЙТБОКС (один на страницу, живёт в <body>)
  // ===================================================================
  var SVG = {
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  var LB = {
    root: null,
    img: null,
    items: [],
    i: 0,
    trigger: null,
    isOpen: false,
    token: 0,
    saved: null,
    closeT: 0,
    swiped: false
  };
  function lbEnsure() {
    if (LB.root) return;
    var r = doc.createElement('div');
    r.className = 'wg-lb';
    r.setAttribute('role', 'dialog');
    r.setAttribute('aria-modal', 'true');
    r.innerHTML = '<div class="wg-lb-bg"></div>' + '<div class="wg-lb-stage"><img class="wg-lb-img" alt="" draggable="false"><div class="wg-lb-spin"></div><div class="wg-lb-err"></div></div>' + '<button type="button" class="wg-lb-btn wg-lb-close">' + SVG.close + '</button>' + '<button type="button" class="wg-lb-btn wg-lb-prev">' + SVG.prev + '</button>' + '<button type="button" class="wg-lb-btn wg-lb-next">' + SVG.next + '</button>' + '<div class="wg-lb-count"></div><div class="wg-lb-cap"></div>';
    LB.root = r;
    LB.img = r.querySelector('.wg-lb-img');
    r.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('.wg-lb-close')) return lbClose();
      if (t.closest('.wg-lb-prev')) return lbStep(-1);
      if (t.closest('.wg-lb-next')) return lbStep(1);
      if (LB.swiped) {
        LB.swiped = false;
        return;
      }
      if (t.classList.contains('wg-lb-img') || t.closest('.wg-lb-count,.wg-lb-cap')) return;
      if (CONFIG.lightbox.closeOnBackdrop) lbClose();
    });
    var sx = 0;
    var sy = 0;
    var down = false;
    r.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.wg-lb-btn')) return;
      down = true;
      sx = e.clientX;
      sy = e.clientY;
    });
    r.addEventListener('pointercancel', function () {
      down = false;
    });
    r.addEventListener('pointerup', function (e) {
      if (!down) return;
      down = false;
      var dx = e.clientX - sx;
      var dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        LB.swiped = true;
        setTimeout(function () {
          LB.swiped = false;
        }, 0);
        lbStep(dx < 0 ? 1 : -1);
      }
    });
    doc.body.appendChild(r);
  }
  function lbOpen(items, i, trigger) {
    if (!items || !items.length) return;
    lbEnsure();
    clearTimeout(LB.closeT);
    var r = LB.root;
    var L = CONFIG.i18n;
    LB.items = items;
    LB.trigger = trigger || null;
    r.setAttribute('aria-label', L.viewer);
    r.querySelector('.wg-lb-close').setAttribute('aria-label', L.close);
    r.querySelector('.wg-lb-prev').setAttribute('aria-label', L.prev);
    r.querySelector('.wg-lb-next').setAttribute('aria-label', L.next);
    if (!LB.isOpen) {
      LB.isOpen = true;
      if (CONFIG.lightbox.lockScroll) {
        var de = doc.documentElement;
        LB.saved = {
          o: de.style.overflow,
          p: de.style.paddingRight
        };
        var sw = (global.innerWidth || 0) - de.clientWidth;
        de.style.overflow = 'hidden';
        if (sw > 0) de.style.paddingRight = sw + 'px';
      }
      doc.addEventListener('keydown', lbKey, true);
      r.classList.add('wg-show');
      void r.offsetWidth; // reflow: чтобы сработал transition
      r.classList.add('wg-open');
      try {
        r.querySelector('.wg-lb-close').focus({
          preventScroll: true
        });
      } catch (_) {/* ok */}
    }
    lbShow(i);
  }
  function lbShow(i) {
    var it = LB.items[i];
    var r = LB.root;
    var img = LB.img;
    var L = CONFIG.i18n;
    LB.i = i;
    var token = ++LB.token;
    r.classList.add('wg-loading');
    r.classList.remove('wg-error');
    img.classList.remove('wg-loaded');
    if (it.lens) {
      img.setAttribute('w-zoom-lense', it.lens === true ? '' : it.lens);
      img.setAttribute('w-full', it.src);
    } else {
      img.removeAttribute('w-zoom-lense');
      img.removeAttribute('w-full');
      Lens.stop();
    }
    img.onload = function () {
      if (token !== LB.token) return;
      r.classList.remove('wg-loading');
      img.classList.add('wg-loaded');
      if (CONFIG.lightbox.preload) {
        [i + 1, i - 1].forEach(function (k) {
          if (LB.items[k]) {
            var p = new global.Image();
            p.src = LB.items[k].src;
          }
        });
      }
    };
    img.onerror = function () {
      if (token !== LB.token) return;
      r.classList.remove('wg-loading');
      r.classList.add('wg-error');
      r.querySelector('.wg-lb-err').textContent = L.error;
    };
    img.alt = it.alt || '';
    if (it.src) img.src = it.src;else img.onerror();
    var n = LB.items.length;
    r.querySelector('.wg-lb-count').textContent = n > 1 ? fmt(L.counter, {
      i: i + 1,
      n: n
    }) : '';
    r.querySelector('.wg-lb-cap').textContent = it.caption || '';
    r.querySelector('.wg-lb-prev').hidden = n < 2;
    r.querySelector('.wg-lb-next').hidden = n < 2;
  }
  function lbStep(d) {
    var n = LB.items.length;
    if (n < 2) return;
    var k = LB.i + d;
    if (k < 0) k = CONFIG.lightbox.loop ? n - 1 : 0;
    if (k >= n) k = CONFIG.lightbox.loop ? 0 : n - 1;
    if (k !== LB.i) lbShow(k);
  }
  function lbClose() {
    if (!LB.isOpen) return;
    LB.isOpen = false;
    LB.token++;
    var r = LB.root;
    r.classList.remove('wg-open');
    doc.removeEventListener('keydown', lbKey, true);
    if (LB.saved) {
      var de = doc.documentElement;
      de.style.overflow = LB.saved.o;
      de.style.paddingRight = LB.saved.p;
      LB.saved = null;
    }
    Lens.stop();
    var done = function done() {
      if (LB.isOpen) return;
      r.classList.remove('wg-show');
      LB.img.removeAttribute('src');
      LB.img.removeAttribute('w-zoom-lense');
    };
    if (reduced()) done();else LB.closeT = setTimeout(done, 240);
    var tr = LB.trigger;
    if (tr && tr.isConnected && tr.focus) {
      try {
        tr.focus({
          preventScroll: true
        });
      } catch (_) {/* ok */}
    }
    LB.trigger = null;
  }
  function lbKey(e) {
    if (!LB.isOpen) return;
    var k = e.key;
    if (k === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      lbClose();
    } else if (k === 'ArrowLeft') {
      e.preventDefault();
      lbStep(-1);
    } else if (k === 'ArrowRight') {
      e.preventDefault();
      lbStep(1);
    } else if (k === 'Home') {
      e.preventDefault();
      if (LB.i !== 0) lbShow(0);
    } else if (k === 'End') {
      e.preventDefault();
      if (LB.i !== LB.items.length - 1) lbShow(LB.items.length - 1);
    } else if (k === 'Tab') {
      var f = Array.prototype.filter.call(LB.root.querySelectorAll('.wg-lb-btn'), function (b) {
        return !b.hidden;
      });
      if (!f.length) {
        e.preventDefault();
        return;
      }
      var first = f[0];
      var last = f[f.length - 1];
      if (!LB.root.contains(doc.activeElement)) {
        first.focus();
        e.preventDefault();
      } else if (e.shiftKey && doc.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && doc.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
  function itemOf(n) {
    var f = fullSrc(n);
    var lens = n.hasAttribute('w-lightbox-lense') ? n.getAttribute('w-lightbox-lense') || true : false;
    return {
      src: f.src,
      alt: f.img ? f.img.getAttribute('alt') || '' : '',
      caption: n.getAttribute('w-caption') || '',
      lens: lens
    };
  }
  function openFrom(trigger) {
    var g = trigger.getAttribute('w-gallery');
    var nodes;
    if (g) nodes = Array.prototype.slice.call(doc.querySelectorAll('[w-zoom-lightbox][w-gallery="' + cssEsc(g) + '"]'));else {
      var car = trigger.closest('.wg-carousel');
      nodes = car ? Array.prototype.slice.call(car.querySelectorAll('[w-zoom-lightbox]')) : [trigger];
    }
    if (nodes.indexOf(trigger) < 0) nodes = [trigger];
    lbOpen(nodes.map(itemOf), nodes.indexOf(trigger), trigger);
  }

  // ===================================================================
  // ГЛОБАЛЬНОЕ ДЕЛЕГИРОВАНИЕ
  // ===================================================================
  function gotoTarget(el) {
    var of = el.getAttribute('w-goto-of');
    return of ? named.get(of) : byEl.get(el.closest('.wg-carousel'));
  }
  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var el = t.closest('[w-goto]');
    if (el) {
      var c = gotoTarget(el);
      if (c) {
        c.goTo(toNum(el.getAttribute('w-goto'), 0));
        e.preventDefault();
      }
      return;
    }
    el = t.closest('[w-navigate-left],[w-navigate-right]');
    if (el) {
      var _c = byEl.get(el.closest('.wg-carousel'));
      if (_c && el.parentNode === _c.root) {
        if (el.hasAttribute('w-navigate-left')) _c.prev();else _c.next();
        e.preventDefault();
      }
      return;
    }
    el = t.closest('.wg-dot');
    if (el) {
      var _c2 = byEl.get(el.closest('.wg-carousel'));
      if (_c2) _c2.goTo(el.__wi || 0);
      return;
    }
    el = t.closest('.wg-thumb');
    if (el) {
      var strip = byEl.get(el.closest('.wg-carousel'));
      if (strip && strip.main) strip.main.goTo(el.__wi || 0);
      return;
    }
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    el = t.closest('[w-zoom-lightbox]');
    if (el && !el.closest('.wg-lb')) {
      var src = fullSrc(el).src;
      if (!src) return;
      e.preventDefault();
      openFrom(el);
    }
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' || e.defaultPrevented) return;
    var t = e.target;
    if (!t || !t.closest) return;
    var el = t.closest('[w-navigate-left],[w-navigate-right],[w-goto],[w-zoom-lightbox]');
    if (el && el === t && !/^(BUTTON|A|INPUT)$/.test(el.tagName)) {
      e.preventDefault();
      el.click();
    }
  });
  doc.addEventListener('pointermove', onPointerMove, {
    passive: true
  });
  doc.addEventListener('visibilitychange', function () {
    return instances.forEach(function (i) {
      return i.restart();
    });
  });
  var rzT = 0;
  global.addEventListener('resize', function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () {
      return instances.forEach(function (i) {
        return i.schedule();
      });
    }, 120);
  });

  // ===================================================================
  // ЖИЗНЕННЫЙ ЦИКЛ DOM: появление / исчезновение каруселей
  // ===================================================================
  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.classList.contains('wg-carousel')) Carousel.of(node);
    if (node.querySelectorAll) node.querySelectorAll('.wg-carousel').forEach(function (n) {
      return Carousel.of(n);
    });
  }
  var gcT = 0;
  function gcSoon() {
    clearTimeout(gcT);
    gcT = setTimeout(function () {
      return instances.forEach(function (i) {
        if (!i.root.isConnected) i.destroy();
      });
    }, 100);
  }
  var gmo = new MutationObserver(function (recs) {
    var removed = false;
    recs.forEach(function (r) {
      for (var i = 0; i < r.addedNodes.length; i++) scan(r.addedNodes[i]);
      if (r.removedNodes.length) removed = true;
    });
    if (removed) gcSoon();
  });

  // ===================================================================
  // КОМПОНЕНТЫ WEX
  // ===================================================================
  var IMG_SKIP = ['url', 'src', 'full', 'thumb', 'alt', 'lightbox', 'lazy'];

  // <Image :url="" :full="" :thumb="" :alt="" :lightbox="false" :lazy="false" w-zoom-lense w-lightbox-lense></Image>
  function compileImage($el, attrs) {
    var scope = this.scope;
    var urlV = P(scope, attrs, ['url', 'src']);
    var url = urlV == null ? '' : String(urlV);
    var fullV = P(scope, attrs, ['full']);
    var thumbV = P(scope, attrs, ['thumb']);
    var full = fullV ? String(fullV) : url;
    var thumb = thumbV ? String(thumbV) : url;
    var alt = P(scope, attrs, ['alt']);
    if (alt == null) alt = autoAlt(url);
    var lightbox = toBool(P(scope, attrs, ['lightbox']), CONFIG.image.lightbox);
    var lazy = toBool(P(scope, attrs, ['lazy']), CONFIG.image.lazy);
    var wrap = mk('div', 'wg-image');
    copyAttrs(wrap, scope, attrs, IMG_SKIP);
    if (lightbox && !wrap.hasAttribute('w-zoom-lightbox')) wrap.setAttribute('w-zoom-lightbox', '');
    if (wrap.hasAttribute('w-zoom-lightbox') && !wrap.hasAttribute('tabindex')) {
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('aria-haspopup', 'dialog');
    }
    if (full) wrap.setAttribute('data-wg-full', full);
    if (thumb) wrap.setAttribute('data-wg-thumb', thumb);
    var img = mk('img');
    if (lazy) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    } // loading раньше src
    if (url) img.setAttribute('src', url);
    img.setAttribute('alt', String(alt));
    img.setAttribute('draggable', 'false');
    wrap.appendChild(img);
    return wrap;
  }
  var CAROUSEL_SKIP = ['label', 'slide-class'].concat(OPTS.map(function (o) {
    return o[1];
  }), [].concat.apply([], OPTS.map(function (o) {
    return o[3] || [];
  })));
  var SERVICE = ['w-navigate-left', 'w-navigate-right', 'w-navigate-dots', 'w-carousel-adaptive', 'w-goto'];

  // <Carousel :autoslide="true" :interval="3000" ...> ...слайды... </Carousel>
  function compileCarousel($el, attrs, slot) {
    var scope = this.scope;
    var view = this.view;
    var root = mk('div', 'wg-carousel');
    copyAttrs(root, scope, attrs, CAROUSEL_SKIP);
    var o = {};
    OPTS.forEach(function (d) {
      var type = d[2];
      var names = [d[1]].concat(d[3] || []);
      var v = type === 'name' ? Pname(scope, attrs, names) : P(scope, attrs, names);
      if (v == null || v === '' && type !== 'bool') return;
      var s;
      if (type === 'bool') s = toBool(v, true) ? '1' : '0';else if (type === 'ms') s = String(toMs(v, CONFIG.carousel.interval));else if (type === 'num') s = String(toNum(v, 0));else if (type === 'json') s = typeof v === 'string' ? v : JSON.stringify(v);else s = String(v);
      o[d[0]] = v;
      root.setAttribute('data-wg-' + d[1], s);
    });
    var isThumbs = !!o.thumbsOf;
    var auto = toBool(root.getAttribute('data-wg-autoslide'), CONFIG.carousel.autoslide);
    var wantArrows = toBool(root.getAttribute('data-wg-navigate-arrows'), CONFIG.carousel.arrows);
    var wantDots = toBool(root.getAttribute('data-wg-navigate-dots'), CONFIG.carousel.dots);
    var label = P(scope, attrs, ['label']);
    var slideClass = P(scope, attrs, ['slide-class']);

    // @slide="method" / @ready="method" (в духе компонентов Wex)
    var handlers = {};
    Object.keys(attrs).forEach(function (k) {
      if (k[0] !== '@') return;
      var m = /^([\w$]+)(?:\((.*)\))?$/.exec(String(attrs[k]).trim());
      if (!m) return;
      handlers[k.slice(1).toLowerCase()] = function (ev) {
        var fn = view.fn(m[1]);
        if (!fn) return;
        var args = m[2] ? m[2].split(',').map(function (a) {
          return scope.parse(a.trim());
        }) : [];
        var res = fn.apply(view, [scope.data].concat(args));
        if (typeof res === 'function') res.call(root, ev);
      };
    });
    root.__wOn = handlers;

    // разбираем детей: слайды и служебные элементы
    var adaptive = '';
    var prevEl = null;
    var nextEl = null;
    var dotsEl = null;
    var slides = [];
    var extras = [];
    var nodes = isThumbs ? [] : slot();
    Array.prototype.forEach.call(nodes, function (n) {
      if (n.nodeType !== 1) return; // текст и комментарии (w-for / w-if) не нужны
      if (n.hasAttribute('w-carousel-adaptive')) {
        adaptive += ' ' + (n.getAttribute('class') || '');
        return;
      }
      if (n.hasAttribute('w-navigate-left')) {
        prevEl = n;
        return;
      }
      if (n.hasAttribute('w-navigate-right')) {
        nextEl = n;
        return;
      }
      if (n.hasAttribute('w-navigate-dots')) {
        dotsEl = n;
        return;
      }
      if (n.hasAttribute('w-goto')) {
        extras.push(n);
        return;
      }
      slides.push(n);
    });
    [prevEl, nextEl].forEach(function (n) {
      if (!n || n.tagName === 'BUTTON') return;
      if (!n.hasAttribute('role')) n.setAttribute('role', 'button');
      if (!n.hasAttribute('tabindex')) n.setAttribute('tabindex', '0');
    });
    if (prevEl && !prevEl.hasAttribute('aria-label')) prevEl.setAttribute('aria-label', CONFIG.i18n.prev);
    if (nextEl && !nextEl.hasAttribute('aria-label')) nextEl.setAttribute('aria-label', CONFIG.i18n.next);
    if (prevEl || nextEl || dotsEl) root.classList.add('wg-flex');
    if (!isThumbs) {
      root.setAttribute('role', 'region');
      root.setAttribute('aria-roledescription', 'carousel');
      root.setAttribute('aria-label', label ? String(label) : CONFIG.i18n.carousel);
      if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
    }
    var track = mk('div', 'wg-track', {
      'aria-live': auto ? 'off' : 'polite'
    });
    var cls = ('wg-slide' + adaptive + (slideClass ? ' ' + slideClass : '')).replace(/\s+/g, ' ').trim();
    slides.forEach(function (n, i) {
      var s = mk('div', cls, {
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-label': fmt(CONFIG.i18n.counter, {
          i: i + 1,
          n: slides.length
        })
      });
      s.appendChild(n);
      track.appendChild(s);
    });
    var arrow = function arrow(dir) {
      var b = mk('button', 'wg-arrow wg-' + dir, {
        type: 'button',
        'aria-label': dir === 'prev' ? CONFIG.i18n.prev : CONFIG.i18n.next
      });
      setClasses(b, CONFIG.classes.arrow, true);
      b.setAttribute(dir === 'prev' ? 'w-navigate-left' : 'w-navigate-right', '');
      b.innerHTML = SVG[dir];
      return b;
    };
    if (prevEl) root.appendChild(prevEl);
    root.appendChild(track);
    if (nextEl) root.appendChild(nextEl);
    extras.forEach(function (n) {
      return root.appendChild(n);
    });
    if (wantArrows && !prevEl) root.appendChild(arrow('prev'));
    if (wantArrows && !nextEl) root.appendChild(arrow('next'));
    if (dotsEl) root.appendChild(dotsEl);else if (wantDots) root.appendChild(mk('div', 'wg-dots', {
      'w-navigate-dots': ''
    }));
    return root;
  }
  var jq = global.jqvm;
  if (jq && typeof jq.component === 'function') {
    ;
    ['Image', 'w-image'].forEach(function (n) {
      return jq.component(n, compileImage);
    });
    ['Carousel', 'w-carousel'].forEach(function (n) {
      return jq.component(n, compileCarousel);
    });
  } else if (global.console) console.warn('[w-gallery] jqvm не найден: подключите wex.js раньше. Работаю без компонентов (только разметка wg-*).');

  // ===================================================================
  // СТИЛИ
  // ===================================================================
  var CSS = ['.wg-carousel{position:relative;display:block;min-width:0}', '.wg-carousel:focus-visible{outline:2px solid var(--wg-focus,#4c9ffe);outline-offset:2px}', '.wg-carousel.wg-flex{display:flex;flex-wrap:wrap;align-items:center}', '.wg-carousel.wg-flex>.wg-track{flex:1 1 0;min-width:0}', '.wg-carousel.wg-flex>[w-navigate-dots]{flex:0 0 100%}', '.wg-track{position:relative;display:flex;gap:var(--wg-gap,0px);overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch}', '.wg-track::-webkit-scrollbar{display:none}', '.wg-track.wg-dragging{scroll-snap-type:none;cursor:grabbing;user-select:none;-webkit-user-select:none}', '.wg-track.wg-dragging a,.wg-track.wg-dragging img{pointer-events:none}', '.wg-slide{flex:none;box-sizing:border-box;min-width:0;scroll-snap-align:start;scroll-snap-stop:always}', ':where(.wg-slide){width:calc((100% - (var(--wg-pv,1) - 1) * var(--wg-gap,0px)) / var(--wg-pv,1))}', '.wg-carousel[data-wg-direction=vertical]{min-height:12rem}', '.wg-carousel[data-wg-direction=vertical]>.wg-track{position:absolute;top:0;right:0;bottom:0;left:0;flex-direction:column;overflow-x:hidden;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior-y:contain}', ':where(.wg-carousel[data-wg-direction=vertical]>.wg-track>.wg-slide){width:100%;height:calc((100% - (var(--wg-pv,1) - 1) * var(--wg-gap,0px)) / var(--wg-pv,1))}', '.wg-arrow{position:absolute;top:50%;z-index:2;display:grid;place-items:center;width:2.5rem;height:2.5rem;margin-top:-1.25rem;padding:0;border:0;border-radius:50%;background:var(--wg-arrow-bg,rgba(0,0,0,.45));color:var(--wg-arrow-color,#fff);cursor:pointer;transition:opacity .2s}', '.wg-arrow[hidden],.wg-dots[hidden]{display:none}', '.wg-arrow svg{width:1.25rem;height:1.25rem;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}', '.wg-arrow:disabled{opacity:.3;cursor:default}', '.wg-prev{left:.5rem}.wg-next{right:.5rem}', '.wg-carousel[data-wg-direction=vertical]>.wg-arrow{left:50%;margin:0 0 0 -1.25rem}', '.wg-carousel[data-wg-direction=vertical]>.wg-prev{top:.5rem}', '.wg-carousel[data-wg-direction=vertical]>.wg-next{top:auto;bottom:.5rem}', '.wg-carousel[data-wg-direction=vertical]>.wg-arrow svg{transform:rotate(90deg)}', ':where([w-navigate-left],[w-navigate-right],[w-goto]){cursor:pointer;user-select:none;-webkit-user-select:none}', ':where([data-wg-disabled]){opacity:.35;pointer-events:none}', '.wg-dots{position:absolute;left:0;right:0;bottom:.6rem;z-index:2;display:flex;justify-content:center;gap:.4rem;pointer-events:none}', '.wg-carousel[data-wg-direction=vertical]>.wg-dots{top:0;bottom:0;left:auto;right:.6rem;flex-direction:column;align-items:center;justify-content:center}', ':where([w-navigate-dots]){display:flex;justify-content:center;gap:.4rem}', '.wg-dot{pointer-events:auto;width:.6rem;height:.6rem;padding:0;border:0;border-radius:50%;background:var(--wg-dot,rgba(255,255,255,.6));box-shadow:0 0 0 1px rgba(0,0,0,.25);cursor:pointer;transition:transform .2s,background .2s}', '.wg-dot.wg-active{background:var(--wg-dot-active,#fff);transform:scale(1.25)}', '.wg-image{position:relative;display:block;overflow:hidden}', '.wg-image>img{display:block;width:100%;height:100%;object-fit:var(--wg-fit,cover);-webkit-user-drag:none;user-select:none}', ':where([w-zoom-lightbox]){cursor:zoom-in}', '.wg-thumb{display:block;padding:0;border:0;border-radius:.25rem;background:none;opacity:.6;cursor:pointer;overflow:hidden;outline:2px solid transparent;outline-offset:-2px;transition:opacity .2s,outline-color .2s}', '.wg-thumb:hover{opacity:.85}', '.wg-thumb.wg-active{opacity:1;outline-color:var(--wg-thumb-active,currentColor)}', '.wg-thumb img{display:block;width:100%;aspect-ratio:var(--wg-thumb-ratio,1);object-fit:cover}', '.wg-carousel[data-wg-direction=vertical] .wg-thumb img{height:100%;aspect-ratio:auto}', '.wg-lens{position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;background-color:#fff;background-repeat:no-repeat;box-shadow:0 0 0 2px #fff,0 6px 24px rgba(0,0,0,.35);opacity:0;transition:opacity .12s}', '.wg-lens.wg-on{opacity:1}', '.wg-lb{position:fixed;top:0;right:0;bottom:0;left:0;z-index:var(--wg-lb-z,100000);display:none;opacity:0;transition:opacity .22s ease;touch-action:pan-y pinch-zoom;overscroll-behavior:contain;color:#fff;font:14px/1.4 system-ui,-apple-system,sans-serif}', '.wg-lb.wg-show{display:block}', '.wg-lb.wg-open{opacity:1}', '.wg-lb-bg{position:absolute;top:0;right:0;bottom:0;left:0;background:var(--wg-overlay,rgba(0,0,0,.9))}', '.wg-lb-stage{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:3.25rem 4rem}', '.wg-lb-img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;opacity:0;transition:opacity .2s;user-select:none;-webkit-user-drag:none;box-shadow:0 10px 50px rgba(0,0,0,.5)}', '.wg-lb-img.wg-loaded{opacity:1}', '.wg-lb-spin{position:absolute;display:none;width:2.2rem;height:2.2rem;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:wg-spin .8s linear infinite}', '.wg-lb.wg-loading .wg-lb-spin{display:block}', '@keyframes wg-spin{to{transform:rotate(360deg)}}', '.wg-lb-err{position:absolute;display:none;opacity:.85}', '.wg-lb.wg-error .wg-lb-err{display:block}', '.wg-lb-btn{position:absolute;z-index:2;display:grid;place-items:center;width:2.75rem;height:2.75rem;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;transition:background .2s}', '.wg-lb-btn[hidden]{display:none}', '.wg-lb-btn:hover{background:rgba(255,255,255,.25)}', '.wg-lb-btn svg{width:1.4rem;height:1.4rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}', '.wg-lb-close{top:.75rem;right:.75rem}', '.wg-lb-prev{left:.75rem;top:50%;margin-top:-1.375rem}', '.wg-lb-next{right:.75rem;top:50%;margin-top:-1.375rem}', '.wg-lb-count{position:absolute;top:1.1rem;left:1rem;opacity:.8}', '.wg-lb-cap{position:absolute;left:0;right:0;bottom:.9rem;padding:0 4rem;text-align:center}', '@media (max-width:640px){.wg-lb-stage{padding:3rem .5rem}.wg-lb-prev{left:.25rem}.wg-lb-next{right:.25rem}.wg-lb-cap{padding:0 1rem}}', '@media (prefers-reduced-motion:reduce){.wg-lb,.wg-lb-img,.wg-lens,.wg-arrow,.wg-dot{transition:none}.wg-lb-spin{animation-duration:2s}}'].join('\n');
  var styleEl = null;
  function applyStyles() {
    var want = !!CONFIG.styles;
    if (want && !styleEl) {
      styleEl = doc.createElement('style');
      styleEl.id = 'wg-gallery-css';
      styleEl.textContent = CSS;
      var head = doc.head || doc.documentElement;
      head.insertBefore(styleEl, head.firstChild); // самым первым: любые ваши классы перебивают
    } else if (!want && styleEl) {
      styleEl.parentNode.removeChild(styleEl);
      styleEl = null;
    }
  }
  applyStyles();

  // ===================================================================
  // ПУБЛИЧНЫЙ API
  // ===================================================================
  var WGallery = {
    version: '1.0.0',
    config: CONFIG,
    configure: function configure(opts) {
      merge(CONFIG, opts);
      applyStyles();
      instances.forEach(function (i) {
        return i.schedule();
      });
      return WGallery;
    },
    carousel: function carousel(elOrSelector) {
      var el = typeof elOrSelector === 'string' ? doc.querySelector(elOrSelector) : elOrSelector && elOrSelector[0] || elOrSelector;
      return Carousel.of(el);
    },
    lightbox: {
      open: function open(items, index) {
        lbOpen((items || []).map(function (x) {
          return typeof x === 'string' ? {
            src: x,
            alt: ''
          } : x;
        }), index || 0, null);
      },
      close: lbClose
    },
    refresh: function refresh() {
      instances.forEach(function (i) {
        return i.schedule();
      });
    },
    scan: scan
  };
  global.WGallery = WGallery;

  // $('#id').wCarousel('next' | 'prev' | 'goto', n)  (имя не 'carousel': оно занято Bootstrap)
  if (global.jQuery) {
    global.jQuery.fn.wCarousel = function (cmd, arg) {
      var out = this;
      this.each(function () {
        var c = Carousel.of(this);
        if (!c) return;
        if (cmd === 'next') c.next();else if (cmd === 'prev') c.prev();else if (cmd === 'goto') c.goTo(arg);else if (cmd === 'index') {
          out = c.index;
          return false;
        } else if (cmd === 'refresh') c.schedule();
      });
      return out;
    };
  }
  function boot() {
    scan(doc.documentElement);
    gmo.observe(doc.documentElement, {
      childList: true,
      subtree: true
    });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);else boot();
})(typeof window !== 'undefined' ? window : this);

/***/ })
/******/ ]);