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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n4 = 0, F = function F() {}; return { s: F, n: function n() { return _n4 >= r.length ? { done: !0 } : { done: !1, value: r[_n4++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/*
 * Wex Drag v2: перетаскивание (ядро на чистом JS) + привязка к Wex (директивы и <Kanban>).
 *
 * Подключать ПОСЛЕ jQuery и Wex и ДО первого .state():
 *   <script src="jquery.min.js"></script>
 *   <script src="wex.min.js"></script>
 *   <script src="wex-drag.js"></script>
 *
 * ---- Разметка (директивы) ------------------------------------------------------------------------
 *   Канбан (list):
 *     <div w-drag="{ mode: 'list', handle: '.grip', canDrop: 'canDrop' }">
 *       <div w-for="col in columns traceby col.id">
 *         <div w-drag-list="col.cards" w-drag-key="col.id">
 *           <div w-for="card in col.cards traceby card.id" tabindex="0">...</div>
 *
 *   Галерея (flow, swap):   <div w-drag="{ mode: 'flow', swap: true }" w-drag-list="photos">
 *                             <div w-for="p in photos traceby p.id">...</div>
 *   Стикеры (cells):        <div w-drag="{ mode: 'cells', extraRows: 1 }" w-drag-list="stickers">
 *                             <div w-for="s in stickers traceby s.id" data-x="{{ s.x }}" data-y="{{ s.y }}"
 *                                  data-w="{{ s.w }}" data-h="{{ s.h }}" style="grid-column: ...; grid-row: ...">
 *
 *   Элемент списка опознаётся по data-id (его ставит traceby). Поле идентификатора в объекте: itemKey (по умолчанию 'id').
 *   Массив меняется по ссылке (splice по соседям before/after, swap, или запись x/y), затем view.release() рендерит один раз.
 *
 * ---- События view ----------------------------------------------------------------------------------
 *   .on('$beforeDrop', (state, e, prevent) => {})   до изменения state; prevent() отменяет автоматическую мутацию
 *   .on('$drop',       (state, e) => {})            после мутации (синхронизация с сервером)
 *   .on('$dragStart' | '$dragCancel', (state, e) => {})
 *
 * ---- Стили -----------------------------------------------------------------------------------------
 *   data-dd-source (исходный элемент, скрыт), data-dd-ghost, data-dd-placeholder, data-dd-invalid, data-dd-over, data-dd-dragging.
 *   Пример для Quas: class="border-2 border-sky-400 data-[dd-invalid]:border-red-400"
 */
(function (global) {
  'use strict';

  // ================================================================ геометрия (чистые функции)
  // Прямоугольники: { left, top, right, bottom }. Ничего не знают о DOM, проверяются тестами в Node.
  var hit = function hit(r, x, y) {
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  var midX = function midX(r) {
    return (r.left + r.right) / 2;
  };
  var midY = function midY(r) {
    return (r.top + r.bottom) / 2;
  };

  // list: перед каким элементом вставить (индекс в списке без перетаскиваемого; length = в конец)
  function listIndex(rects, x, y, horizontal) {
    for (var i = 0; i < rects.length; i++) {
      if (horizontal ? x < midX(rects[i]) : y < midY(rects[i])) return i;
    }
    return rects.length;
  }

  // flow: перестановка в сетке, которая переносит строки.
  // rects: элементы без перетаскиваемого и без плейсхолдера; ph: прямоугольник плейсхолдера;
  // phIndex: сколько элементов списка стоит до плейсхолдера (-1, если он в другом контейнере).
  function flowIndex(rects, ph, phIndex, x, y) {
    var n = rects.length;
    if (!n) return 0;
    var keep = phIndex >= 0 ? phIndex : n;

    // 1) курсор над плейсхолдером: ничего не меняем
    if (phIndex >= 0 && ph && hit(ph, x, y)) return keep;

    // 2) курсор над карточкой: решаем по её середине
    for (var i = 0; i < n; i++) {
      if (hit(rects[i], x, y)) return x < midX(rects[i]) ? i : i + 1;
    }

    // 3) зазор между колонками или пустая ячейка ряда: карточки этого ряда, ближайшая по X
    var best = -1,
      bd = Infinity;
    for (var _i = 0; _i < n; _i++) {
      var _r = rects[_i];
      if (y >= _r.top && y <= _r.bottom) {
        var d = Math.max(_r.left - x, 0, x - _r.right);
        if (d < bd) {
          bd = d;
          best = _i;
        }
      }
    }
    if (best >= 0) return x < midX(rects[best]) ? best : best + 1;

    // 4) вертикальный зазор между рядами: остаёмся на месте
    if (phIndex >= 0) return keep;

    // 5) чужой контейнер, курсор мимо карточек: ближайшая карточка
    best = 0;
    bd = Infinity;
    for (var _i2 = 0; _i2 < n; _i2++) {
      var _r2 = rects[_i2];
      var _d = Math.hypot(Math.max(_r2.left - x, 0, x - _r2.right), Math.max(_r2.top - y, 0, y - _r2.bottom));
      if (_d < bd) {
        bd = _d;
        best = _i2;
      }
    }
    var r = rects[best];
    return y < r.top || y <= r.bottom && x < midX(r) ? best : best + 1;
  }

  // cells: размещение в ячейку CSS-сетки
  var starts = function starts(sizes, gap) {
    var s = 0;
    return sizes.map(function (n) {
      var v = s;
      s += n + gap;
      return v;
    });
  };
  var nearest = function nearest(arr, v) {
    return arr.reduce(function (b, s, i) {
      return Math.abs(s - v) < Math.abs(arr[b] - v) ? i : b;
    }, 0);
  };
  var overlap = function overlap(a, b) {
    return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  };

  // m: { cols: [px], rows: [px], gapX, gapY }; gx, gy: левый верхний угол перетаскиваемого внутри контейнера
  function cellTarget(m, extraRows, gx, gy, w, h) {
    var colStarts = starts(m.cols, m.gapX);
    var lastRow = m.rows[m.rows.length - 1] || 0;
    var rowSizes = m.rows.concat(Array.from({
      length: extraRows || 0
    }, function () {
      return lastRow;
    }));
    var rowStarts = starts(rowSizes, m.gapY);
    var x = Math.max(0, Math.min(nearest(colStarts, gx), m.cols.length - w));
    var y = Math.max(0, Math.min(nearest(rowStarts, gy), rowSizes.length - h));
    return {
      x: x,
      y: y,
      w: w,
      h: h
    };
  }
  var geometry = {
    hit: hit,
    listIndex: listIndex,
    flowIndex: flowIndex,
    starts: starts,
    nearest: nearest,
    overlap: overlap,
    cellTarget: cellTarget
  };

  // ================================================================ общее
  var DEFAULTS = {
    mode: 'list',
    // list | flow | cells
    root: null,
    // Element | () => Element
    items: '[data-id]',
    // перетаскиваемые элементы (прямые дети контейнера)
    containers: null,
    // селектор | (el) => boolean; null: контейнер = root
    containerAttr: 'data-container',
    containerValue: null,
    // (el) => значение контейнера; по умолчанию из containerAttr
    idAttr: 'data-id',
    handle: null,
    // селектор «ручки» внутри элемента; null: весь элемент
    ignore: 'input,textarea,select,button,a,label,[contenteditable="true"],[data-dd-ignore]',
    threshold: 5,
    // px до начала перетаскивания (иначе это обычный клик)
    touchDelay: 180,
    // мс удержания для тача без ручки (иначе это прокрутка)
    direction: 'vertical',
    // list: vertical | horizontal
    scroll: {
      edge: 48,
      speed: 900
    },
    // автопрокрутка у краёв, px/сек; scroll: false отключает
    canDrop: null,
    // (ctx) => boolean
    metrics: null,
    // cells: (container) => { cols, rows, gapX, gapY }
    extraRows: 0,
    // cells: дополнительные ряды ниже существующих
    place: null,
    // cells: (el, x, y, w, h) => void
    ghostParent: 'auto',
    // 'auto' | 'body' | Element | (root) => Element
    ghostClass: '',
    placeholderClass: '',
    animate: 150,
    // мс: сдвиг соседей и посадка призрака; false отключает
    keyboard: true,
    // Пробел/Enter берёт, стрелки двигают, Пробел кладёт, Esc отменяет
    swap: false,
    // flow: менять местами, а не вставлять
    messages: {
      pick: 'Элемент взят. Стрелки перемещают, пробел кладёт, Escape отменяет',
      move: 'Позиция {n} из {total}',
      drop: 'Элемент перемещён',
      cancel: 'Перемещение отменено'
    },
    on: null // { start, move, drop, cancel }
  };
  var globalDefaults = {};
  var reducedMotion = function reducedMotion() {
    return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };
  function ensureStyle() {
    if (document.getElementById('wex-dd-style')) return;
    var st = document.createElement('style');
    st.id = 'wex-dd-style';
    var nonce = global.Quas && global.Quas.CSSNonce;
    if (nonce) st.nonce = nonce;
    // самый низкий приоритет: стили из разметки (в том числе утилиты Quas) перекрывают их
    st.textContent = '[data-dd-source]{display:none!important}' + '[data-dd-placeholder]{border:2px dashed #cbd5e1;border-radius:4px;background:rgba(148,163,184,.12)}' + '[data-dd-placeholder][data-dd-invalid]{border-color:#f87171}' + '[data-dd-ghost]{opacity:.95;box-shadow:0 8px 24px rgba(15,23,42,.25)}';
    document.head.insertBefore(st, document.head.firstChild);
  }
  var handleStyles = new Set();
  function ensureHandleStyle(handle) {
    if (!handle || handleStyles.has(handle)) return;
    handleStyles.add(handle);
    var st = document.createElement('style');
    var nonce = global.Quas && global.Quas.CSSNonce;
    if (nonce) st.nonce = nonce;
    st.textContent = handle + '{touch-action:none}'; // на таче перетаскивание начинается сразу, без удержания
    document.head.appendChild(st);
  }
  var live = null;
  function announce(text) {
    if (!live) {
      live = document.createElement('div');
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('role', 'status');
      live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
      document.body.appendChild(live);
    }
    live.textContent = text;
  }

  // ---------------------------------------------------------------- один глобальный слушатель на все экземпляры
  var instances = new Set();
  var globalAttached = false;
  function globalDown(e) {
    var best = null;
    instances.forEach(function (inst) {
      var r = inst._root();
      if (!r || !e.target || !r.contains(e.target)) return;
      if (!best || best._root().contains(r)) best = inst; // самый вложенный корень
    });
    if (best) best.press(e);
  }
  function globalKey(e) {
    var handled = false;
    instances.forEach(function (inst) {
      if (!handled && inst._kbActive() && inst._key(e)) handled = true;
    });
    if (handled) return;
    instances.forEach(function (inst) {
      if (handled) return;
      var r = inst._root();
      if (r && e.target && r.contains(e.target) && inst._keyPick(e)) handled = true;
    });
  }
  function attachGlobal() {
    if (globalAttached) return;
    globalAttached = true;
    document.addEventListener('pointerdown', globalDown);
    document.addEventListener('keydown', globalKey);
  }
  function detachGlobal() {
    if (!globalAttached || instances.size) return;
    globalAttached = false;
    document.removeEventListener('pointerdown', globalDown);
    document.removeEventListener('keydown', globalKey);
  }

  // ================================================================ ядро
  function createDraggable(userOptions) {
    var user = userOptions || {};
    var o = Object.assign({}, DEFAULTS, globalDefaults, user);
    o.scroll = o.scroll === false || user.scroll === false ? false : Object.assign({}, DEFAULTS.scroll, globalDefaults.scroll, user.scroll);
    o.messages = Object.assign({}, DEFAULTS.messages, globalDefaults.messages, user.messages);
    var listeners = {};
    var phase = 'idle'; // idle | pending | dragging | dropping
    var pending = null; // нажатие, которое ещё может стать перетаскиванием
    var drag = null; // идущее перетаскивание
    var raf = 0,
      scrollRaf = 0,
      lastT = 0;
    var destroyed = false;
    var attached = false;
    var rootEl = function rootEl() {
      return typeof o.root === 'function' ? o.root() : o.root;
    };
    var idOf = function idOf(el) {
      return el.getAttribute(o.idAttr);
    };
    var valueOf = function valueOf(c) {
      if (!c) return '';
      var v = o.containerValue ? o.containerValue(c) : c.getAttribute(o.containerAttr);
      return v === undefined || v === null ? '' : String(v);
    };
    var isItem = function isItem(el) {
      return el.nodeType === 1 && el.matches(o.items);
    };
    var isContainer = function isContainer(n) {
      if (typeof o.containers === 'function') return !!o.containers(n);
      if (typeof o.containers === 'string') return n.matches(o.containers);
      return n === rootEl();
    };
    var safe = function safe(fn, payload) {
      try {
        fn(payload);
      } catch (err) {
        console.error(err);
      }
    };
    var emit = function emit(name, payload) {
      ;
      (listeners[name] || []).slice().forEach(function (fn) {
        return safe(fn, payload);
      });
      if (o.on && typeof o.on[name] === 'function') safe(o.on[name].bind(o.on), payload);
    };

    // ---------------------------------------------------------------- поиск мест
    var itemsIn = function itemsIn(c) {
      return _toConsumableArray(c.children).filter(function (el) {
        return isItem(el) && el !== drag.item && el !== drag.ph;
      });
    };
    function nextItemEl(el) {
      var n = el.nextElementSibling;
      while (n && (!isItem(n) || n === drag.item || n === drag.ph)) n = n.nextElementSibling;
      return n;
    }
    function containerAt(x, y) {
      var root = rootEl();
      if (!root) return null;
      var stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
      var _iterator = _createForOfIteratorHelper(stack),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          if (!el || !root.contains(el)) continue;
          for (var n = el; n; n = n.parentElement) {
            if (isContainer(n)) return n;
            if (n === root) break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return null;
    }
    function rootContainers() {
      var root = rootEl();
      if (!o.containers) return [root];
      var all = _toConsumableArray(root.querySelectorAll('*'));
      return [root].concat(_toConsumableArray(all)).filter(function (n) {
        return isContainer(n);
      });
    }

    // сколько элементов списка стоит до узла pos
    function countBefore(pos, container) {
      var i = 0;
      for (var n = container.firstElementChild; n && n !== pos; n = n.nextElementSibling) {
        if (isItem(n) && n !== drag.item && n !== drag.ph) i++;
      }
      return i;
    }
    function neighbours(pos) {
      var skip = function skip(n) {
        return !isItem(n) || n === drag.item || n === pos;
      };
      var prev = pos.previousElementSibling;
      while (prev && skip(prev)) prev = prev.previousElementSibling;
      var next = pos.nextElementSibling;
      while (next && skip(next)) next = next.nextElementSibling;
      var index = 0;
      for (var n = pos.previousElementSibling; n; n = n.previousElementSibling) if (!skip(n)) index++;
      return {
        before: next ? idOf(next) : null,
        after: prev ? idOf(prev) : null,
        index: index
      };
    }

    // ---------------------------------------------------------------- cells
    function measure(container) {
      if (typeof o.metrics === 'function') return o.metrics(container);
      var cs = getComputedStyle(container);
      var sizes = function sizes(v) {
        return String(v).split(' ').map(parseFloat).filter(function (n) {
          return !isNaN(n);
        });
      };
      return {
        cols: sizes(cs.gridTemplateColumns),
        rows: sizes(cs.gridTemplateRows),
        gapX: parseFloat(cs.columnGap) || 0,
        gapY: parseFloat(cs.rowGap) || 0
      };
    }
    var cellOf = function cellOf(el) {
      return {
        x: parseInt(el.getAttribute('data-x'), 10) || 0,
        y: parseInt(el.getAttribute('data-y'), 10) || 0,
        w: parseInt(el.getAttribute('data-w'), 10) || 1,
        h: parseInt(el.getAttribute('data-h'), 10) || 1
      };
    };
    var placeCells = function placeCells(el, x, y, w, h) {
      if (typeof o.place === 'function') return o.place(el, x, y, w, h);
      el.style.gridColumn = x + 1 + ' / span ' + w;
      el.style.gridRow = y + 1 + ' / span ' + h;
    };
    function cellFree(container, target) {
      var _iterator2 = _createForOfIteratorHelper(container.children),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var el = _step2.value;
          if (el === drag.item || el === drag.ph || !isItem(el)) continue;
          if (overlap(target, cellOf(el))) return false;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return true;
    }

    // ---------------------------------------------------------------- анимация соседей (FLIP)
    var duration = function duration() {
      return o.animate && !reducedMotion() ? o.animate : 0;
    };
    function snapshot(containers) {
      var map = new Map();
      containers.forEach(function (c) {
        if (!c) return;
        itemsIn(c).forEach(function (el) {
          return map.set(el, el.getBoundingClientRect());
        });
      });
      return map;
    }
    function flip(before) {
      before.forEach(function (r0, el) {
        var r1 = el.getBoundingClientRect();
        var dx = r0.left - r1.left,
          dy = r0.top - r1.top;
        if (!dx && !dy) return;
        if (el.__ddAnim) {
          try {
            el.__ddAnim.cancel();
          } catch (err) {}
        }
        el.__ddAnim = el.animate([{
          transform: 'translate(' + dx + 'px,' + dy + 'px)'
        }, {
          transform: 'none'
        }], {
          duration: duration(),
          easing: 'cubic-bezier(.2,0,0,1)'
        });
      });
    }
    function placeAt(container, ref) {
      var ms = duration();
      var before = null;
      if (ms) {
        before = snapshot([container, drag.ph.parentNode]);
        before.forEach(function (r, el) {
          if (el.__ddAnim) {
            try {
              el.__ddAnim.cancel();
            } catch (err) {}
          }
        }); // r уже включает текущий сдвиг
      }
      container.insertBefore(drag.ph, ref);
      if (before) flip(before);
    }

    // ---------------------------------------------------------------- перетаскивание
    function makePlaceholder(item, rect) {
      var ph = document.createElement('div');
      ph.setAttribute('data-dd-placeholder', '');
      var cs = getComputedStyle(item);
      ph.style.boxSizing = 'border-box';
      ph.style.flex = '0 0 auto';
      if (o.mode !== 'cells') {
        ph.style.height = rect.height + 'px';
        if (o.mode === 'flow' || o.direction === 'horizontal') ph.style.width = rect.width + 'px';
        ph.style.margin = cs.margin;
      }
      if (o.placeholderClass) ph.className = o.placeholderClass;
      return ph;
    }

    // внутрь корня, если нет предка с transform/filter/contain (иначе position:fixed считался бы от него)
    function resolveGhostParent(root) {
      var gp = o.ghostParent;
      if (gp && _typeof(gp) === 'object' && gp.nodeType) return gp;
      if (typeof gp === 'function') return gp(root) || document.body;
      if (gp === 'body' || !root) return document.body;
      for (var n = root; n && n.nodeType === 1 && n !== document.documentElement; n = n.parentElement) {
        var cs = getComputedStyle(n);
        if (cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' || cs.backdropFilter && cs.backdropFilter !== 'none' || /transform|filter|perspective/.test(cs.willChange) || /paint|layout|strict|content/.test(cs.contain)) return document.body;
      }
      return root;
    }
    function makeGhost(item, rect, root) {
      var g = item.cloneNode(true);
      g.removeAttribute(o.idAttr);
      g.removeAttribute('id');
      g.removeAttribute('data-dd-source');
      g.setAttribute('data-dd-ghost', '');
      g.style.cssText += ';position:fixed;left:0;top:0;margin:0;box-sizing:border-box;pointer-events:none;z-index:2147483000;will-change:transform;width:' + rect.width + 'px;height:' + rect.height + 'px';
      if (o.ghostClass) g.className += ' ' + o.ghostClass;
      resolveGhostParent(root).appendChild(g);
      return g;
    }
    function begin(p, e) {
      var item = p.item;
      var rect = item.getBoundingClientRect();
      var container = item.parentElement;
      var root = rootEl();
      ensureStyle();
      phase = 'dragging';
      lastT = 0;
      drag = {
        item: item,
        id: idOf(item),
        rect: rect,
        from: valueOf(container),
        fromContainer: container,
        grabX: p.sx - rect.left,
        grabY: p.sy - rect.top,
        x: e.clientX,
        y: e.clientY,
        valid: true,
        touch: p.type === 'touch',
        event: e,
        kb: false
      };
      drag.ph = makePlaceholder(item, rect);
      drag.ghost = makeGhost(item, rect, root);
      var fromIndex = 0;
      for (var n = item.previousElementSibling; n; n = n.previousElementSibling) if (isItem(n)) fromIndex++;
      drag.fromIndex = fromIndex;
      drag.fromCell = o.mode === 'cells' ? cellOf(item) : null;
      if (o.mode === 'cells') {
        var c = drag.fromCell;
        placeCells(drag.ph, c.x, c.y, c.w, c.h);
        container.appendChild(drag.ph);
      } else {
        container.insertBefore(drag.ph, item);
      }
      item.setAttribute('data-dd-source', '');
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      if (root) root.setAttribute('data-dd-dragging', '');
      moveGhost();
      emit('start', {
        id: drag.id,
        el: item,
        from: drag.from,
        index: fromIndex,
        event: e
      });
      if (o.scroll) scrollLoop();
    }
    function moveGhost() {
      drag.ghost.style.transform = 'translate3d(' + (drag.x - drag.grabX) + 'px,' + (drag.y - drag.grabY) + 'px,0)';
    }
    function setValid(valid) {
      drag.valid = valid;
      drag.ph.toggleAttribute('data-dd-invalid', !valid);
      if (drag.ghost) drag.ghost.toggleAttribute('data-dd-invalid', !valid);
    }
    function markOver(container) {
      if (drag.over === container) return;
      if (drag.over) drag.over.removeAttribute('data-dd-over');
      drag.over = container;
      if (container) container.setAttribute('data-dd-over', '');
    }
    function update() {
      if (!drag || drag.kb) return;
      var _drag = drag,
        x = _drag.x,
        y = _drag.y;
      var container = containerAt(x, y);
      if (!container) {
        markOver(null);
        return;
      }
      markOver(container);
      if (o.mode === 'cells') return updateCells(container, x, y);
      if (o.mode === 'flow' && o.swap) return updateSwap(container, x, y);
      updateList(container, x, y);
    }
    function updateList(container, x, y) {
      var list = itemsIn(container);
      var rects = list.map(function (el) {
        return el.getBoundingClientRect();
      });
      var index;
      if (o.mode === 'flow') {
        var inHere = drag.ph.parentNode === container;
        index = flowIndex(rects, inHere ? drag.ph.getBoundingClientRect() : null, inHere ? countBefore(drag.ph, container) : -1, x, y);
      } else {
        index = listIndex(rects, x, y, o.direction === 'horizontal');
      }
      var ref = list[index] || null;
      var ctx = {
        id: drag.id,
        el: drag.item,
        from: drag.from,
        to: valueOf(container),
        container: container,
        mode: o.mode,
        index: index
      };
      var ok = !o.canDrop || o.canDrop(ctx) !== false;
      if (ok && (drag.ph.parentNode !== container || nextItemEl(drag.ph) !== ref)) placeAt(container, ref);
      setValid(ok);
      drag.container = ok ? container : drag.container;
      emit('move', Object.assign({
        valid: ok,
        event: drag.event
      }, ctx));
    }
    function updateCells(container, x, y) {
      var m = measure(container);
      var cr = container.getBoundingClientRect();
      var me = cellOf(drag.item);
      var gx = x - drag.grabX - cr.left + container.scrollLeft;
      var gy = y - drag.grabY - cr.top + container.scrollTop;
      var target = cellTarget(m, o.extraRows, gx, gy, me.w, me.h);
      var free = cellFree(container, target);
      placeCells(drag.ph, target.x, target.y, me.w, me.h);
      if (drag.ph.parentNode !== container) container.appendChild(drag.ph);
      var ctx = {
        id: drag.id,
        el: drag.item,
        from: drag.from,
        to: valueOf(container),
        container: container,
        mode: o.mode,
        x: target.x,
        y: target.y,
        w: me.w,
        h: me.h
      };
      var ok = free && (!o.canDrop || o.canDrop(ctx) !== false);
      setValid(ok);
      drag.target = target;
      drag.container = container;
      emit('move', Object.assign({
        valid: ok,
        event: drag.event
      }, ctx));
    }
    function swapNodes(a, b) {
      var m = document.createComment('');
      a.parentNode.insertBefore(m, a);
      b.parentNode.insertBefore(a, b);
      m.parentNode.insertBefore(b, m);
      m.remove();
    }
    function updateSwap(container, x, y) {
      var inside = function inside(el) {
        return hit(el.getBoundingClientRect(), x, y);
      };
      if (!inside(drag.ph)) {
        // над плейсхолдером ничего не меняем
        var found = itemsIn(container).find(inside);
        if (found) {
          var was = drag.swapWith;
          if (was) {
            swapNodes(drag.ph, was);
            drag.swapWith = null;
          } // откат предыдущего обмена
          if (found !== was) {
            swapNodes(drag.ph, found);
            drag.swapWith = found;
          }
        }
      }
      var ctx = {
        id: drag.id,
        el: drag.item,
        from: drag.from,
        to: valueOf(container),
        container: container,
        mode: o.mode,
        swap: true,
        "with": drag.swapWith ? idOf(drag.swapWith) : null
      };
      var ok = !o.canDrop || o.canDrop(ctx) !== false;
      setValid(ok);
      drag.container = container;
      emit('move', Object.assign({
        valid: ok,
        event: drag.event
      }, ctx));
    }

    // ---------------------------------------------------------------- завершение
    function buildPayload(d, e) {
      if (o.mode === 'flow' && o.swap && !d.kb) {
        var withIndex = -1;
        if (d.swapWith) {
          withIndex = 0;
          for (var n = d.swapWith.previousElementSibling; n; n = n.previousElementSibling) if (isItem(n)) withIndex++;
        }
        return {
          id: d.id,
          el: d.item,
          swap: true,
          "with": d.swapWith ? idOf(d.swapWith) : null,
          withIndex: withIndex,
          fromIndex: d.fromIndex,
          from: d.from,
          to: d.from,
          fromEl: d.fromContainer,
          toEl: d.fromContainer,
          moved: !!d.swapWith,
          event: e
        };
      }
      if (o.mode === 'cells') {
        var t = d.kb ? d.kbCell : d.target;
        if (!t) return null;
        var container = d.kb ? d.fromContainer : d.container;
        return {
          id: d.id,
          el: d.item,
          from: d.fromCell,
          to: {
            x: t.x,
            y: t.y
          },
          w: t.w,
          h: t.h,
          fromContainer: d.from,
          toContainer: valueOf(container),
          fromEl: d.fromContainer,
          toEl: container,
          moved: t.x !== d.fromCell.x || t.y !== d.fromCell.y,
          event: e
        };
      }
      var pos = d.kb ? d.item : d.ph;
      var parent = pos.parentNode;
      if (!parent) return null;
      var nb = neighbours(pos);
      var to = valueOf(parent);
      return {
        id: d.id,
        el: d.item,
        from: d.from,
        to: to,
        index: nb.index,
        before: nb.before,
        after: nb.after,
        fromIndex: d.fromIndex,
        fromEl: d.fromContainer,
        toEl: parent,
        moved: to !== d.from || nb.index !== d.fromIndex,
        event: e
      };
    }
    function teardown(d, keepGhost) {
      if (d.ph && d.ph.parentNode) d.ph.parentNode.removeChild(d.ph);
      if (!keepGhost && d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
      d.item.removeAttribute('data-dd-source');
      if (d.over) d.over.removeAttribute('data-dd-over');
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      var root = rootEl();
      if (root) root.removeAttribute('data-dd-dragging');
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      raf = scrollRaf = 0;
    }
    function findById(id) {
      var root = rootEl();
      if (!root) return null;
      var esc = global.CSS && global.CSS.escape ? global.CSS.escape(String(id)) : String(id);
      var found = root.querySelectorAll('[' + o.idAttr + '="' + esc + '"]');
      var _iterator3 = _createForOfIteratorHelper(found),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var el = _step3.value;
          if (isItem(el) && el.parentElement && isContainer(el.parentElement)) return el;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return null;
    }

    // призрак «приземляется» в новое место, затем исчезает
    function fly(d, id) {
      var target = findById(id);
      var ms = duration();
      if (!target || !ms || !d.ghost || !d.ghost.parentNode) return finalize(d);
      var r = target.getBoundingClientRect();
      target.setAttribute('data-dd-source', ''); // скрыт до приземления
      if (d.ghost.parentNode !== document.body) document.body.appendChild(d.ghost); // корень может перерисоваться
      var tx = d.x - d.grabX,
        ty = d.y - d.grabY;
      var done = false;
      var end = function end() {
        if (done) return;
        done = true;
        target.removeAttribute('data-dd-source');
        finalize(d);
      };
      var anim = d.ghost.animate([{
        transform: 'translate3d(' + tx + 'px,' + ty + 'px,0)',
        width: d.rect.width + 'px',
        height: d.rect.height + 'px'
      }, {
        transform: 'translate3d(' + r.left + 'px,' + r.top + 'px,0)',
        width: r.width + 'px',
        height: r.height + 'px'
      }], {
        duration: ms,
        easing: 'cubic-bezier(.2,0,0,1)'
      });
      anim.onfinish = end;
      anim.oncancel = end;
      setTimeout(end, ms + 120);
    }
    function finalize(d) {
      if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
      if (phase === 'dropping') phase = 'idle';
    }
    function finish(commit, e) {
      var d = drag;
      if (!d) return;
      phase = 'dropping';
      drag = null;

      // после перетаскивания браузер шлёт click: гасим его
      if (!d.kb) {
        var swallow = function swallow(ev) {
          ev.stopPropagation();
          ev.preventDefault();
        };
        window.addEventListener('click', swallow, true);
        setTimeout(function () {
          return window.removeEventListener('click', swallow, true);
        }, 0);
      }
      var swapWith = d.swapWith;
      var payload = null;
      if (commit && d.valid && (d.kb || d.container)) payload = buildPayload(d, e);
      if (swapWith && !d.kb) {
        swapNodes(d.ph, swapWith);
      } // вернуть DOM, как был

      var id = d.id,
        el = d.item;
      var flies = !!(payload && payload.moved !== false && !d.kb && duration());
      if (d.kb) kbRestoreFocus(d, payload);
      teardown(d, flies);
      if (payload) emit('drop', payload);else emit('cancel', {
        id: id,
        el: el
      });
      if (flies) fly(d, id);else finalize(d);
    }

    // ---------------------------------------------------------------- автопрокрутка
    function scrollables(el) {
      var out = [];
      for (var n = el; n && n !== document.body; n = n.parentElement) {
        var cs = getComputedStyle(n);
        if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (n.scrollHeight > n.clientHeight || n.scrollWidth > n.clientWidth)) out.push(n);
      }
      return out;
    }
    function scrollLoop() {
      scrollRaf = requestAnimationFrame(function (t) {
        if (!drag) return;
        var dt = lastT ? Math.min(t - lastT, 50) / 1000 : 1 / 60; // скорость от времени кадра, не от частоты экрана
        lastT = t;
        var _o$scroll = o.scroll,
          edge = _o$scroll.edge,
          speed = _o$scroll.speed;
        var _drag2 = drag,
          x = _drag2.x,
          y = _drag2.y;
        var scrolled = false;
        var push = function push(r, set) {
          var dtp = y - r.top,
            db = r.bottom - y,
            dl = x - r.left,
            dr = r.right - x;
          if (dtp < edge && dtp > -edge) {
            set(0, -speed * dt * (1 - dtp / edge));
            scrolled = true;
          } else if (db < edge && db > -edge) {
            set(0, speed * dt * (1 - db / edge));
            scrolled = true;
          }
          if (dl < edge && dl > -edge) {
            set(-speed * dt * (1 - dl / edge), 0);
            scrolled = true;
          } else if (dr < edge && dr > -edge) {
            set(speed * dt * (1 - dr / edge), 0);
            scrolled = true;
          }
        };
        var base = drag.over || rootEl();
        if (base) scrollables(base).forEach(function (n) {
          return push(n.getBoundingClientRect(), function (dx, dy) {
            n.scrollLeft += dx;
            n.scrollTop += dy;
          });
        });
        push({
          top: 0,
          left: 0,
          bottom: window.innerHeight,
          right: window.innerWidth
        }, function (dx, dy) {
          return window.scrollBy(dx, dy);
        });
        if (scrolled) update();
        scrollLoop();
      });
    }

    // ---------------------------------------------------------------- события указателя
    function press(e) {
      if (destroyed || phase !== 'idle') return false;
      if (e.pointerType === 'mouse' && e.button !== 0) return false;
      var root = rootEl();
      if (!root || !e.target || !e.target.closest) return false;

      // ближайший подходящий элемент: прямой ребёнок контейнера (колонки с data-id от traceby не подходят)
      var item = e.target.closest(o.items);
      while (item && !(root.contains(item) && item !== root && item.parentElement && isContainer(item.parentElement))) {
        item = item.parentElement ? item.parentElement.closest(o.items) : null;
      }
      if (!item) return false;
      if (o.handle) {
        var h = e.target.closest(o.handle);
        if (!h || !item.contains(h)) return false;
      } else if (o.ignore) {
        var ig = e.target.closest(o.ignore);
        if (ig && item.contains(ig)) return false;
      }
      pending = {
        item: item,
        sx: e.clientX,
        sy: e.clientY,
        type: e.pointerType === 'touch' ? 'touch' : 'mouse',
        last: e
      };
      phase = 'pending';
      if (pending.type === 'touch' && !o.handle) {
        pending.timer = setTimeout(function () {
          if (pending) {
            var p = pending;
            pending = null;
            begin(p, p.last);
          }
        }, o.touchDelay);
      }
      attach();
      return true;
    }
    function onMove(e) {
      if (pending) {
        pending.last = e;
        var dist = Math.hypot(e.clientX - pending.sx, e.clientY - pending.sy);
        if (pending.type === 'touch' && !o.handle) {
          if (dist > o.threshold) {
            clearTimeout(pending.timer);
            pending = null;
            phase = 'idle';
            detach();
          } // это прокрутка
          return;
        }
        if (dist > o.threshold) {
          var p = pending;
          pending = null;
          begin(p, e);
        }
        return;
      }
      if (!drag || drag.kb) return;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.event = e;
      moveGhost();
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        update();
      });
    }
    function onUp(e) {
      if (pending) {
        clearTimeout(pending.timer);
        pending = null;
        phase = 'idle';
        detach();
        return;
      }
      if (drag && !drag.kb) {
        var root = rootEl();
        var r = root && root.getBoundingClientRect();
        // отпустили далеко за пределами доски: отмена
        var far = r && (e.clientX < r.left - 80 || e.clientX > r.right + 80 || e.clientY < r.top - 80 || e.clientY > r.bottom + 80);
        drag.x = e.clientX;
        drag.y = e.clientY;
        update();
        finish(!far, e);
      }
      detach();
    }
    function onCancel() {
      if (pending) {
        clearTimeout(pending.timer);
        pending = null;
        phase = 'idle';
      }
      if (drag && !drag.kb) finish(false);
      detach();
    }
    var onKey = function onKey(e) {
      if (e.key === 'Escape' && drag && !drag.kb) {
        finish(false);
        detach();
      }
    };
    var onTouchMove = function onTouchMove(e) {
      if (drag && drag.touch && e.cancelable) e.preventDefault();
    };
    var onContext = function onContext(e) {
      if (pending || drag && drag.touch) e.preventDefault();
    };
    var onVisibility = function onVisibility() {
      if (document.hidden) onCancel();
    };
    var onNativeDrag = function onNativeDrag(e) {
      var root = rootEl();
      if (root && root.contains(e.target) && e.target.closest && e.target.closest(o.items)) e.preventDefault();
    };
    function attach() {
      if (attached) return;
      attached = true;
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onCancel);
      document.addEventListener('keydown', onKey);
      document.addEventListener('touchmove', onTouchMove, {
        passive: false
      });
      document.addEventListener('contextmenu', onContext);
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('blur', onCancel);
    }
    function detach() {
      if (!attached) return;
      attached = false;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onCancel);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onCancel);
    }

    // ---------------------------------------------------------------- клавиатура
    // Двигается сам элемент (без призрака): состояние чисто DOM, после Пробела уходит то же событие drop.
    function kbStart(item) {
      var root = rootEl();
      var container = item.parentElement;
      ensureStyle();
      var fromIndex = 0;
      for (var n = item.previousElementSibling; n; n = n.previousElementSibling) if (isItem(n)) fromIndex++;
      phase = 'dragging';
      drag = {
        kb: true,
        item: item,
        id: idOf(item),
        from: valueOf(container),
        fromContainer: container,
        fromIndex: fromIndex,
        valid: true,
        origParent: container,
        origNext: item.nextElementSibling,
        origStyle: item.getAttribute('style'),
        fromCell: o.mode === 'cells' ? cellOf(item) : null,
        kbCell: null
      };
      if (root) root.setAttribute('data-dd-dragging', '');
      announce(o.messages.pick);
      emit('start', {
        id: drag.id,
        el: item,
        from: drag.from,
        index: fromIndex,
        keyboard: true
      });
    }
    function kbFocus() {
      try {
        drag.item.focus({
          preventScroll: true
        });
      } catch (err) {}
    }
    function kbRestoreFocus(d) {
      var root = rootEl();
      if (root) root.removeAttribute('data-dd-dragging');
      d.hadFocus = true;
      setTimeout(function () {
        var el = findById(d.id) || d.item;
        try {
          el.focus({
            preventScroll: true
          });
        } catch (err) {}
      }, 0);
    }
    function kbMove(key) {
      var d = drag;
      var item = d.item;
      var horizontalList = o.direction === 'horizontal';
      var dir = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
      }[key];
      if (!dir) return false;
      if (o.mode === 'cells') {
        var _container = d.fromContainer;
        var m = measure(_container);
        var me = cellOf(item);
        var cur = d.kbCell || {
          x: me.x,
          y: me.y
        };
        var nx = Math.max(0, Math.min(cur.x + dir[0], m.cols.length - me.w));
        var ny = Math.max(0, Math.min(cur.y + dir[1], m.rows.length + (o.extraRows || 0) - me.h));
        var _target = {
          x: nx,
          y: ny,
          w: me.w,
          h: me.h
        };
        if (!cellFree(_container, _target)) return true;
        d.kbCell = _target;
        placeCells(item, nx, ny, me.w, me.h);
        announce(o.messages.move.replace('{n}', ny * m.cols.length + nx + 1).replace('{total}', m.cols.length * (m.rows.length + (o.extraRows || 0))));
        return true;
      }
      var container = item.parentElement;
      // вдоль списка: предыдущий/следующий; поперёк: соседний контейнер на то же место
      var along = horizontalList ? dir[0] : dir[1];
      var across = horizontalList ? dir[1] : dir[0];
      var ref = undefined,
        target = container;
      if (along) {
        if (along < 0) {
          var p = item.previousElementSibling;
          while (p && !isItem(p)) p = p.previousElementSibling;
          if (!p) return true;
          ref = p;
        } else {
          var n = item.nextElementSibling;
          while (n && !isItem(n)) n = n.nextElementSibling;
          if (!n) return true;
          ref = n.nextElementSibling;
        }
      } else if (across && o.mode !== 'flow') {
        var list = rootContainers();
        var i = list.indexOf(container);
        var next = list[i + (across < 0 ? -1 : 1)];
        if (!next) return true;
        var _index = 0;
        for (var _n = item.previousElementSibling; _n; _n = _n.previousElementSibling) if (isItem(_n)) _index++;
        var siblings = _toConsumableArray(next.children).filter(function (el) {
          return isItem(el) && el !== item;
        });
        ref = siblings[Math.min(_index, siblings.length)] || null;
        target = next;
      } else if (across) {
        // flow: вправо/влево тоже вдоль порядка
        var forward = across > 0;
        var _n2 = forward ? item.nextElementSibling : item.previousElementSibling;
        while (_n2 && !isItem(_n2)) _n2 = forward ? _n2.nextElementSibling : _n2.previousElementSibling;
        if (!_n2) return true;
        ref = forward ? _n2.nextElementSibling : _n2;
      } else {
        return true;
      }
      var index = function () {
        var i = 0;
        for (var _n3 = ref ? ref.previousElementSibling : target.lastElementChild; _n3; _n3 = _n3.previousElementSibling) if (isItem(_n3) && _n3 !== item) i++;
        return i;
      }();
      var ctx = {
        id: d.id,
        el: item,
        from: d.from,
        to: valueOf(target),
        container: target,
        mode: o.mode,
        index: index
      };
      if (o.canDrop && o.canDrop(ctx) === false) return true;
      var before = snapshot([container, target]);
      target.insertBefore(item, ref || null);
      flip(before);
      kbFocus();
      var total = _toConsumableArray(target.children).filter(isItem).length;
      announce(o.messages.move.replace('{n}', index + 1).replace('{total}', total));
      emit('move', Object.assign({
        valid: true,
        keyboard: true
      }, ctx));
      return true;
    }
    function kbCancel() {
      var d = drag;
      if (o.mode === 'cells') {
        if (d.origStyle === null) d.item.removeAttribute('style');else d.item.setAttribute('style', d.origStyle);
      } else {
        d.origParent.insertBefore(d.item, d.origNext);
      }
      announce(o.messages.cancel);
      finish(false);
    }

    // true, если клавиша обработана
    function key(e) {
      if (!drag || !drag.kb) return false;
      if (e.key === 'Escape') {
        e.preventDefault();
        kbCancel();
        return true;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        announce(o.messages.drop);
        finish(true, e);
        return true;
      }
      if (e.key.indexOf('Arrow') === 0) {
        e.preventDefault();
        return kbMove(e.key);
      }
      return false;
    }
    function keyPick(e) {
      if (!o.keyboard || destroyed || phase !== 'idle') return false;
      if (e.key !== ' ' && e.key !== 'Enter') return false;
      var t = e.target;
      if (!t || !t.closest) return false;
      var item = t.closest(o.items);
      if (!item || !item.parentElement || !isContainer(item.parentElement)) return false;
      // клавиатура только на самом элементе или на его ручке: поля ввода внутри карточки не трогаем
      if (!(t === item || o.handle && t.matches(o.handle))) return false;
      e.preventDefault();
      kbStart(item);
      return true;
    }

    // ---------------------------------------------------------------- API
    var api = {
      on: function on(name, fn) {
        (listeners[name] = listeners[name] || []).push(fn);
        return api;
      },
      off: function off(name, fn) {
        listeners[name] = (listeners[name] || []).filter(function (f) {
          return f !== fn;
        });
        return api;
      },
      set: function set(patch) {
        if (patch && _typeof(patch) === 'object') {
          Object.keys(patch).forEach(function (k) {
            if (k === 'scroll') o.scroll = patch.scroll === false ? false : Object.assign({}, DEFAULTS.scroll, patch.scroll);else if (k === 'messages') o.messages = Object.assign({}, o.messages, patch.messages);else o[k] = patch[k];
          });
          if (o.handle) ensureHandleStyle(o.handle);
        }
        return api;
      },
      press: press,
      cancel: function cancel() {
        if (drag) {
          drag.kb ? kbCancel() : finish(false);
        }
        detach();
      },
      destroy: function destroy() {
        if (destroyed) return;
        destroyed = true;
        if (drag) {
          drag.kb ? kbCancel() : finish(false);
        }
        if (pending) clearTimeout(pending.timer);
        pending = null;
        detach();
        instances["delete"](api);
        document.removeEventListener('dragstart', onNativeDrag);
        detachGlobal();
      },
      get dragging() {
        return !!drag;
      },
      _root: rootEl,
      _kbActive: function _kbActive() {
        return !!(drag && drag.kb);
      },
      _key: key,
      _keyPick: keyPick,
      _update: update
    };
    if (o.handle) ensureHandleStyle(o.handle);
    instances.add(api);
    attachGlobal();
    document.addEventListener('dragstart', onNativeDrag);
    return api;
  }
  createDraggable.geometry = geometry;
  createDraggable.defaults = DEFAULTS;
  global.createDraggable = createDraggable;

  // ================================================================ привязка к Wex
  // Директивы работают через жизненный цикл (mounted / updated / unmounted): экземпляр ядра живёт, пока жив элемент.
  var jq = global.jqvm;
  if (jq && typeof jq.directive === 'function') {
    // применить результат перетаскивания к массивам state (по ссылке)
    var applyDrop = function applyDrop(e, opts) {
      var key = opts.itemKey || 'id';
      var same = function same(it, id) {
        return it !== undefined && it !== null && String(it[key]) === String(id);
      };
      if (opts.mode === 'cells') {
        var list = listOf(e.toEl);
        var _item = list && list.find(function (it) {
          return same(it, e.id);
        });
        if (!_item) return;
        _item[opts.xKey || 'x'] = e.to.x;
        _item[opts.yKey || 'y'] = e.to.y;
        return;
      }
      var fromList = listOf(e.fromEl);
      var toList = listOf(e.toEl);
      if (!fromList || !toList) return;
      if (e.swap) {
        var a = fromList.findIndex(function (it) {
          return same(it, e.id);
        });
        var b = fromList.findIndex(function (it) {
          return same(it, e["with"]);
        });
        if (a < 0 || b < 0) return;
        var A = fromList[a],
          B = fromList[b];
        fromList.splice(a, 1, B);
        fromList.splice(b, 1, A);
        return;
      }
      var fi = fromList.findIndex(function (it) {
        return same(it, e.id);
      });
      if (fi < 0) return;
      var item = fromList.splice(fi, 1)[0];
      // позиция по соседу, а не по индексу: индекс из DOM врёт, если список отфильтрован
      var ti = e.before !== null && e.before !== undefined ? toList.findIndex(function (it) {
        return same(it, e.before);
      }) : -1;
      if (ti < 0) ti = toList.length;
      toList.splice(ti, 0, item);
    };
    // createDrag({ ghostClass, animate, ... }) — глобальные настройки по умолчанию; можно и через .plugin(...)
    var createDrag = function createDrag(options) {
      globalDefaults = Object.assign({}, globalDefaults, options || {});
      return function () {};
    };
    jq.createDrag = createDrag;
    global.createDrag = createDrag;
    var listOf = function listOf(el) {
      var rec = el && el.__wDragList;
      return rec ? rec.ctx.scope.parse(rec.attrs['w-drag-list']) : null;
    };
    var keyOfList = function keyOfList(el) {
      var rec = el && el.__wDragList;
      if (!rec || !rec.attrs['w-drag-key']) return '';
      var v = rec.ctx.scope.parse(rec.attrs['w-drag-key']);
      return v === undefined || v === null ? '' : String(v);
    };

    // контейнер: на элементе с w-drag-list; значение (колонка) из w-drag-key
    jq.directive('w-drag-list', {
      mounted: function mounted($el, attrs) {
        $el[0].__wDragList = {
          ctx: this,
          attrs: attrs
        };
      },
      updated: function updated($el, attrs) {
        $el[0].__wDragList = {
          ctx: this,
          attrs: attrs
        };
      },
      unmounted: function unmounted($el) {
        delete $el[0].__wDragList;
      }
    });
    var readOpts = function readOpts(ctx, attrs) {
      var opts = {};
      var src = (attrs['w-drag'] || '').trim();
      if (src) {
        try {
          opts = Object.assign({}, ctx.scope.parse(src));
        } catch (err) {
          console.error('w-drag: ошибка в выражении «' + src + '»', err);
        }
      }
      return opts;
    };
    jq.directive('w-drag', {
      mounted: function mounted($el, attrs, data) {
        var el = $el[0];
        data.ctx = this;
        data.opts = readOpts(this, attrs);
        var view = function view() {
          return data.ctx.view;
        };
        var wrapCanDrop = function wrapCanDrop(opts) {
          if (typeof opts.canDrop === 'string') {
            var name = opts.canDrop;
            opts.canDrop = function (c) {
              var f = view().fn(name);
              return f ? f.call(view(), view().__state, c) : true;
            };
          }
          return opts;
        };
        var release = function release() {
          if (data.held) {
            data.held = false;
            view().release();
          }
        };
        data.dd = createDraggable(Object.assign({}, wrapCanDrop(Object.assign({}, data.opts)), {
          root: el,
          containers: function containers(n) {
            return !!n.__wDragList;
          },
          containerValue: keyOfList,
          on: {
            start: function start(e) {
              view().hold(); // на время перетаскивания рендер откладывается
              data.held = true;
              view().emit('$dragStart', e);
            },
            drop: function drop(e) {
              var prevented = false;
              view().emit('$beforeDrop', e, function () {
                prevented = true;
              });
              if (!prevented && e.moved !== false) {
                try {
                  applyDrop(e, data.opts);
                } catch (err) {
                  console.error(err);
                }
              }
              view().emit('$drop', e);
              release(); // один синхронный рендер: без кадра со старой позицией
            },
            cancel: function cancel(e) {
              view().emit('$dragCancel', e);
              release();
            }
          }
        }));
      },
      updated: function updated($el, attrs, data) {
        data.ctx = this;
        data.opts = readOpts(this, attrs);
        var patch = Object.assign({}, data.opts);
        if (typeof patch.canDrop === 'string') {
          var name = patch.canDrop;
          patch.canDrop = function (c) {
            var f = data.ctx.view.fn(name);
            return f ? f.call(data.ctx.view, data.ctx.view.__state, c) : true;
          };
        }
        delete patch.mode; // режим не меняется на лету
        data.dd.set(patch);
      },
      unmounted: function unmounted($el, data) {
        if (data.dd) data.dd.destroy();
        if (data.held) {
          data.held = false;
          try {
            data.ctx.view.release();
          } catch (err) {}
        }
      }
    });

    // ------------------------------------------------------------ <Kanban :columns="board" @move="onMove">
    // columns: [{ id, title, cards: [{ id, title }] }]. Пропсы по ссылке: компонент сам переставляет карточки
    // в массиве родителя; @move и @drop нужны только для побочных эффектов (запрос на сервер).
    // Содержимое карточки: слот (внутри виден card); при слоте передайте :slotted="true".
    var $ = global.jQuery;
    if ($ && typeof jq.component === 'function') {
      var view = $('<template>' + '<div class="flex items-start gap-3 overflow-x-auto pb-2" w-drag="{ mode: \'list\', handle: handle, canDrop: canDrop }">' + '<div w-for="col in columns traceby col.id" class="flex w-72 shrink-0 flex-col rounded-md bg-slate-200 p-2 dark:bg-slate-800">' + '<div class="px-1 pb-2 text-sm font-semibold">{{ col.title }} <span class="font-normal text-slate-500">{{ col.cards.length }}</span></div>' + '<div class="flex min-h-[44px] flex-1 flex-col gap-2" w-drag-list="col.cards" w-drag-key="col.id">' + '<div w-for="card in col.cards traceby card.id" tabindex="0" class="cursor-grab select-none rounded border border-slate-200 bg-white p-3 text-xs shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-slate-700 dark:bg-slate-900">' + '<span w-if="!slotted">{{ card.title }}</span><slot></slot>' + '</div>' + '</div>' + '</div>' + '</div>' + '</template>').state(function () {
        return {
          columns: [],
          handle: '',
          canDrop: '',
          slotted: false
        };
      }).on('$dragStart', function (state, e) {
        this.emit('start', e);
      }).on('$beforeDrop', function (state, e, prevent) {
        this.emit('beforeDrop', e, prevent);
      }).on('$drop', function (state, e) {
        this.emit('move', e);
        this.emit('drop', e);
      }).on('$dragCancel', function (state, e) {
        this.emit('cancel', e);
      });
      jq.component('Kanban', view);
    }
  } else if (typeof document !== 'undefined') {
    // ядро работает и без Wex; директивы и <Kanban> регистрируются только если Wex загружен раньше
    if (typeof console !== 'undefined') console.info('[wex-drag] Wex не найден: подключены только createDraggable');
  }
  if ( true && module.exports) module.exports = createDraggable;
})(typeof window !== 'undefined' ? window : globalThis);

/***/ })
/******/ ]);