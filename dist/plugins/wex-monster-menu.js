// src/plugins/monster-menu/wex-monster-menu.js
/*!
* wex-menu — Monster Menu: плагин меню для Wex (+ Quas). v0.1 (скелет)
*
* Порядок подключения: jQuery -> Wex -> Quas -> wex-menu.js
* Экспорт: jqvm.createMenu, jqvm.$menu, window.$menu
*
* Данные (JSON с сервера) — голый массив пунктов. Плагин ничего не грузит:
*   $wire.get('/api/menu').to(state.menuItems)      // menuItems: [] в initState
*
* Пункт:   { id*, title, href, target, icon, svg, badge:{text}, class, hidden, match, panel }
* panel:   { type: 'dropdown', align:'left|right', children:[пункты] }
*          { type: 'monster',  grid:{ cols, gap, width }, blocks:[блоки] }
* Блок:    { id*, type, span, start, row, rowSpan, class, mobile:false, ... }
*          встроенные типы: links | promo | html | divider; остальные — через опцию blocks.
* id обязателен на всех уровнях (нужен Wex для traceby). Для Laravel это просто PK.
*
* Компонент:  <Menu :items="menuItems" :current="$route.path" :ui="{...}"></Menu>
*
* Кастомный блок: глобальный компонент с state { block: {}, ui: {} },
*   createMenu({ blocks: { quote: 'MenuQuote' } })   // тип "quote" -> <MenuQuote>
*/
(function(global, $) {
	"use strict";
	const jqvm = global.jqvm;
	if (!$ || !jqvm) throw new Error("[wex-menu] подключите jQuery и Wex раньше wex-menu.js");
	const BREAKPOINTS = {
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280,
		"2xl": 1536
	};
	const DEFAULTS = {
		trigger: "hover",
		hoverDelay: 80,
		closeDelay: 200,
		breakpoint: "lg",
		drawer: {
			side: "left",
			width: "50vw",
			min: "18rem",
			max: "24rem",
			closeOnNavigate: true
		},
		offsetVar: "--menu-height",
		ui: {},
		blocks: {}
	};
	function resolveConfig(opts) {
		opts = opts || {};
		const cfg = Object.assign({}, DEFAULTS, opts);
		cfg.drawer = Object.assign({}, DEFAULTS.drawer, opts.drawer);
		cfg.ui = Object.assign({}, opts.ui);
		cfg.blocks = Object.assign({}, opts.blocks);
		Object.keys(cfg.blocks).forEach(function(t) {
			if (!/^[A-Za-z][\w-]*$/.test(t)) throw new Error("[wex-menu] недопустимый тип блока: " + t);
			if (!/^[A-Z][A-Za-z0-9]*$/.test(cfg.blocks[t])) throw new Error("[wex-menu] имя компонента блока должно начинаться с заглавной буквы: " + cfg.blocks[t]);
		});
		return cfg;
	}
	const breakpointPx = (cfg) => typeof cfg.breakpoint === "number" ? cfg.breakpoint : BREAKPOINTS[cfg.breakpoint] || 1024;
	const mediaQuery = (cfg) => "(min-width: " + breakpointPx(cfg) + "px)";
	function buildUi(cfg) {
		const d = cfg.drawer;
		const left = d.side !== "right";
		const focus = "outline-none focus-visible:ring-3 focus-visible:ring-primary/50";
		const hov = "hover:bg-accent hover:text-accent-content";
		return {
			host: "contents",
			root: "relative flex w-full items-center",
			list: "flex flex-1 list-none items-center gap-1",
			item: "data-[type=dropdown]:relative",
			row: "inline-flex items-center",
			link: "group inline-flex h-9 w-max items-center justify-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-base-content transition-colors " + hov + " " + focus + " data-[active=true]:bg-accent/50 data-[open=true]:bg-accent/50",
			linkSplit: "rounded-r-none pr-2",
			chevronBtn: "inline-flex h-9 w-7 items-center justify-center rounded-md rounded-l-none text-base-content/70 transition-colors " + hov + " " + focus,
			chevron: "size-3.5 shrink-0 fill-none stroke-current stroke-2 transition-transform duration-200 data-[open=true]:rotate-180",
			chevronRight: "size-3.5 shrink-0 fill-none stroke-current stroke-2",
			icon: "size-4 shrink-0 fill-none stroke-current stroke-2 [&_svg]:size-4",
			label: "truncate",
			badge: "ml-1 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-content",
			panel: "absolute left-0 top-full z-50 mt-1.5 min-w-[12rem] overflow-hidden rounded-md border border-base-300 bg-base-100 p-1 text-base-content shadow-md data-[align=right]:left-auto data-[align=right]:right-0",
			panelList: "grid list-none gap-0.5",
			sub: "absolute left-full top-0 z-50 ml-1 min-w-[12rem] overflow-hidden rounded-md border border-base-300 bg-base-100 p-1 text-base-content shadow-md",
			subItem: "relative",
			subRow: "flex w-full items-center",
			subLink: "flex w-full min-w-0 flex-1 items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-base-content transition-colors " + hov + " " + focus + " data-[active=true]:bg-accent/50 data-[open=true]:bg-accent",
			subChevronBtn: "inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-base-content/70 transition-colors " + hov + " " + focus,
			monster: "absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-md border border-base-300 bg-base-100 p-6 text-base-content shadow-md",
			monsterGrid: "grid",
			blockTitle: "mb-2 text-sm font-medium leading-none text-base-content",
			blockList: "grid list-none gap-1",
			blockLink: "flex select-none items-start gap-3 rounded-md p-3 leading-none no-underline transition-colors " + hov + " " + focus + " data-[active=true]:bg-accent/50",
			blockLinkBody: "grid gap-1",
			blockLinkTitle: "text-sm font-medium leading-none",
			blockLinkDesc: "line-clamp-2 text-sm leading-snug text-base-content/60",
			promo: "flex h-full flex-col gap-3 rounded-md border border-base-300 bg-base-200 p-4 no-underline transition-colors " + hov + " " + focus,
			promoImage: "aspect-video w-full rounded-md object-cover",
			promoTitle: "text-sm font-medium",
			promoDesc: "text-sm leading-snug text-base-content/60",
			divider: "my-2 h-px bg-base-300",
			overlay: "fixed inset-0 z-40 bg-black/50 animate-[menu-fade-in_0.2s_ease-out]",
			drawer: "fixed inset-y-0 " + (left ? "left-0 border-r" : "right-0 border-l") + " z-50 flex h-full w-[" + d.width + "] min-w-[" + d.min + "] max-w-[" + d.max + "] flex-col gap-4 overflow-y-auto border-base-300 bg-base-100 p-4 text-base-content shadow-lg animate-[" + (left ? "menu-slide-left" : "menu-slide-right") + "_0.25s_ease-out]",
			drawerHeader: "flex items-center justify-end",
			drawerClose: "inline-flex size-9 items-center justify-center rounded-md " + hov + " " + focus,
			drawerList: "grid list-none gap-1",
			drawerSubList: "ml-3.5 grid list-none gap-1 border-l border-base-300 pl-2",
			drawerItem: "",
			drawerRow: "flex items-center",
			drawerLink: "flex min-w-0 flex-1 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors " + hov + " " + focus + " data-[active=true]:bg-accent/50",
			drawerChevronBtn: "inline-flex size-9 shrink-0 items-center justify-center rounded-md " + hov + " " + focus,
			drawerPanel: "mt-1 grid gap-3 pl-2"
		};
	}
	const safe = (v) => String(v == null ? "" : v).replace(/[;{}<>"'`\\]/g, "");
	const gapValue = (v) => typeof v === "number" ? v * .25 + "rem" : safe(v);
	function menuGrid(g) {
		g = g || {};
		const c = g.cols == null ? 12 : g.cols;
		return "grid-template-columns:" + (typeof c === "number" ? "repeat(" + c + ",minmax(0,1fr))" : safe(c).replace(/_/g, " ")) + ";gap:" + gapValue(g.gap == null ? 6 : g.gap);
	}
	function menuBlockStyle(b) {
		b = b || {};
		const s = [];
		if (b.span || b.start) s.push("grid-column:" + (+b.start || "auto") + " / span " + (+b.span || 1));
		if (b.row || b.rowSpan) s.push("grid-row:" + (+b.row || "auto") + " / span " + (+b.rowSpan || 1));
		return s.join(";");
	}
	function menuPanelStyle(panel) {
		if (!panel || panel.type !== "monster") return "";
		const w = panel.grid && panel.grid.width;
		if (w == null || w === "container") return "";
		return "right:auto;width:" + (typeof w === "number" ? w + "px" : safe(w));
	}
	function norm(p) {
		p = String(p || "").trim();
		if (/^[a-z][a-z0-9+.-]*:\/\//i.test(p)) try {
			const u = new URL(p);
			if (u.origin !== global.location.origin) return "\0ext";
			p = u.pathname;
		} catch (e) {
			return "\0ext";
		}
		p = p.replace(/^#(?=\/)/, "").replace(/[?#].*$/, "");
		if (p.length > 1) p = p.replace(/\/+$/, "");
		return p || "/";
	}
	function selfActive(item, cur) {
		if (!item || !item.href) return false;
		const h = norm(item.href), c = norm(cur);
		const m = item.match || (h === "/" ? "exact" : "prefix");
		if (m === "exact") return h === c;
		if (m === "prefix") return c === h || c.indexOf(h + "/") === 0;
		try {
			return new RegExp(m).test(c);
		} catch (e) {
			return false;
		}
	}
	function deepActive(item, cur) {
		if (selfActive(item, cur)) return true;
		const p = item && item.panel;
		if (!p) return false;
		if (p.children && p.children.some((ch) => deepActive(ch, cur))) return true;
		if (p.blocks) for (let i = 0; i < p.blocks.length; i++) {
			const b = p.blocks[i];
			if (b.items && b.items.some((l) => selfActive(l, cur))) return true;
		}
		return false;
	}
	const curPath = (cur) => cur || (global.location.hash.indexOf("#/") === 0 ? global.location.hash : global.location.pathname);
	const menuActive = (item, cur) => deepActive(item, curPath(cur)) ? "true" : "false";
	const menuCurrent = (item, cur) => deepActive(item, curPath(cur)) ? "page" : "false";
	jqvm.filter("menuGrid", menuGrid);
	jqvm.filter("menuBlockStyle", menuBlockStyle);
	jqvm.filter("menuPanelStyle", menuPanelStyle);
	jqvm.filter("menuActive", menuActive);
	jqvm.filter("menuCurrent", menuCurrent);
	const $menu = {
		_open: false,
		_subs: /* @__PURE__ */ new Set(),
		isOpen() {
			return this._open;
		},
		open() {
			return this._set(true);
		},
		close() {
			return this._set(false);
		},
		toggle() {
			return this._set(!this._open);
		},
		closePanels() {
			this._emit("panels");
			return this;
		},
		subscribe(fn) {
			this._subs.add(fn);
			return () => {
				this._subs.delete(fn);
			};
		},
		_set(v) {
			v = !!v;
			if (this._open === v) return this;
			this._open = v;
			this._emit("drawer", v);
			return this;
		},
		_emit(type, v) {
			this._subs.forEach((fn) => fn(type, v));
		}
	};
	const subs = /* @__PURE__ */ new WeakMap();
	const listen = (state, fn) => {
		subs.set(state, $menu.subscribe(fn));
	};
	const unlisten = (state) => {
		const u = subs.get(state);
		if (u) {
			u();
			subs.delete(state);
		}
	};
	const lockScroll = (on) => {
		global.document.documentElement.style.overflow = on ? "hidden" : "";
	};
	const wIf = (cond) => cond ? "w-if=\"" + cond + "\" " : "";
	const chevDown = (cond) => "<svg " + wIf(cond) + "viewBox=\"0 0 24 24\" aria-hidden=\"true\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"{{ ui.chevron }}\" data-open=\"{{ openId === item.id ? 'true' : 'false' }}\"><path d=\"m6 9 6 6 6-6\" /></svg>";
	const chevRight = (cond) => "<svg " + wIf(cond) + "viewBox=\"0 0 24 24\" aria-hidden=\"true\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"{{ ui.chevronRight }}\"><path d=\"m9 18 6-6-6-6\" /></svg>";
	const iconTpl = (v) => "<span w-if=\"!!" + v + ".svg\" class=\"{{ ui.icon }}\" w-html=\"" + v + ".svg\"></span><i w-if=\"!!" + v + ".icon\" class=\"{{ ui.icon }} {{ " + v + ".icon }}\"></i>";
	const LABEL = iconTpl("item") + "<span class=\"{{ ui.label }}\">{{ item.title }}</span><span w-if=\"!!item.badge\" class=\"{{ ui.badge }}\">{{ item.badge.text }}</span>";
	const aAttrs = (v) => "href=\"{{ " + v + ".href }}\" target=\"{{ " + v + ".target || '' }}\" rel=\"{{ " + v + ".target === '_blank' ? 'noopener' : '' }}\" data-active=\"{{ " + v + " | menuActive:current }}\" aria-current=\"{{ " + v + " | menuCurrent:current }}\" w-on=\"click:linkClick\"";
	const BUILTIN_BLOCKS = {
		links: "<div w-if=\"b.type === 'links'\"><div w-if=\"!!b.title\" class=\"{{ ui.blockTitle }}\">{{ b.title }}</div><ul class=\"{{ ui.blockList }}\"><li w-for=\"l in b.items||[] traceby l.id\"><a " + aAttrs("l") + " class=\"{{ ui.blockLink }}\">" + iconTpl("l") + "<span class=\"{{ ui.blockLinkBody }}\"><span class=\"{{ ui.blockLinkTitle }}\">{{ l.title }}</span><span w-if=\"!!l.desc\" class=\"{{ ui.blockLinkDesc }}\">{{ l.desc }}</span></span></a></li></ul></div>",
		promo: "<a w-if=\"b.type === 'promo'\" " + aAttrs("b") + " class=\"{{ ui.promo }}\"><img w-if=\"!!b.image\" w-src=\"b.image\" alt=\"{{ b.title || '' }}\" class=\"{{ ui.promoImage }}\"><span class=\"{{ ui.promoTitle }}\">{{ b.title }}</span><span w-if=\"!!b.desc\" class=\"{{ ui.promoDesc }}\">{{ b.desc }}</span></a>",
		html: "<div w-if=\"b.type === 'html'\" w-html=\"b.html\"></div>",
		divider: "<div w-if=\"b.type === 'divider'\" class=\"{{ ui.divider }}\"></div>"
	};
	function blocksTpl(cfg) {
		let out = "";
		Object.keys(BUILTIN_BLOCKS).forEach((t) => {
			if (!cfg.blocks[t]) out += BUILTIN_BLOCKS[t];
		});
		Object.keys(cfg.blocks).forEach((t) => {
			const c = cfg.blocks[t];
			out += "<" + c + " w-if=\"b.type === '" + t + "'\" :block=\"b\" :ui=\"ui\"></" + c + ">";
		});
		return out;
	}
	function listTpl(cfg) {
		const blocks = blocksTpl(cfg);
		return "<template><ul class=\"{{ depth > 0 ? ui.panelList : ui.list }}\" w-on=\"mouseleave:leave\"><li w-for=\"item in items traceby item.id\" class=\"{{ depth > 0 ? ui.subItem : ui.item }}\" w-class=\"{ 'hidden': !!item.hidden }\" data-type=\"{{ item.panel && item.panel.type || 'link' }}\" w-on=\"mouseenter:enter(item.id, item.panel)\"><a w-if=\"!!item.href && !item.panel\" " + aAttrs("item") + " class=\"{{ depth > 0 ? ui.subLink : ui.link }}\">" + LABEL + "</a><div w-if=\"!!item.href && !!item.panel\" class=\"{{ depth > 0 ? ui.subRow : ui.row }}\"><a " + aAttrs("item") + " class=\"{{ depth > 0 ? ui.subLink : ui.link }} {{ depth > 0 ? '' : ui.linkSplit }}\" data-open=\"{{ openId === item.id ? 'true' : 'false' }}\">" + LABEL + "</a><button type=\"button\" class=\"{{ depth > 0 ? ui.subChevronBtn : ui.chevronBtn }}\" aria-label=\"{{ item.title }}\" aria-haspopup=\"true\" aria-expanded=\"{{ openId === item.id ? 'true' : 'false' }}\" w-on=\"click:toggle(item.id)\">" + chevDown("depth === 0") + chevRight("depth > 0") + "</button></div><button w-if=\"!item.href && !!item.panel\" type=\"button\" data-open=\"{{ openId === item.id ? 'true' : 'false' }}\" data-active=\"{{ item | menuActive:current }}\" aria-haspopup=\"true\" aria-expanded=\"{{ openId === item.id ? 'true' : 'false' }}\" class=\"{{ depth > 0 ? ui.subLink : ui.link }}\" w-on=\"click:toggle(item.id)\">" + LABEL + chevDown("depth === 0") + chevRight("depth > 0") + "</button><span w-if=\"!item.href && !item.panel\" class=\"{{ depth > 0 ? ui.subLink : ui.link }}\">" + LABEL + "</span><div w-if=\"openId === item.id && !!item.panel && item.panel.type === 'dropdown'\" class=\"{{ depth > 0 ? ui.sub : ui.panel }}\" data-align=\"{{ item.panel.align || 'left' }}\" data-depth=\"{{ depth }}\" w-transition w-on=\"mouseenter:hold\"><MenuList :items=\"item.panel.children||[]\" :depth=\"depth + 1\" :ui=\"ui\" :current=\"current\"></MenuList></div><div w-if=\"openId === item.id && !!item.panel && item.panel.type === 'monster'\" class=\"{{ ui.monster }}\" style=\"{{ item.panel | menuPanelStyle }}\" data-depth=\"{{ depth }}\" w-transition w-on=\"mouseenter:hold\"><div class=\"{{ ui.monsterGrid }}\" style=\"{{ item.panel.grid | menuGrid }}\"><div w-for=\"b in item.panel.blocks||[] traceby b.id\" style=\"{{ b | menuBlockStyle }}\" class=\"{{ b.class || '' }}\">" + blocks + "</div></div></div></li></ul></template>";
	}
	function drawerListTpl(cfg) {
		const blocks = blocksTpl(cfg);
		return "<template><ul class=\"{{ depth > 0 ? ui.drawerSubList : ui.drawerList }}\"><li w-for=\"item in items traceby item.id\" class=\"{{ ui.drawerItem }}\" w-class=\"{ 'hidden': !!item.hidden }\"><div class=\"{{ ui.drawerRow }}\"><a w-if=\"!!item.href\" " + aAttrs("item") + " class=\"{{ ui.drawerLink }}\">" + LABEL + "</a><button w-if=\"!item.href && !!item.panel\" type=\"button\" data-open=\"{{ openId === item.id ? 'true' : 'false' }}\" data-active=\"{{ item | menuActive:current }}\" aria-expanded=\"{{ openId === item.id ? 'true' : 'false' }}\" class=\"{{ ui.drawerLink }}\" w-on=\"click:toggle(item.id)\">" + LABEL + "</button><span w-if=\"!item.href && !item.panel\" class=\"{{ ui.drawerLink }}\">" + LABEL + "</span><button w-if=\"!!item.href && !!item.panel\" type=\"button\" data-open=\"{{ openId === item.id ? 'true' : 'false' }}\" data-active=\"{{ item | menuActive:current }}\" aria-expanded=\"{{ openId === item.id ? 'true' : 'false' }}\" class=\"{{ ui.drawerChevronBtn }}\" aria-label=\"{{ item.title }}\" w-on=\"click:toggle(item.id)\">" + chevDown() + "</button></div><div w-if=\"openId === item.id && !!item.panel && item.panel.type === 'dropdown'\" class=\"{{ ui.drawerPanel }}\"><MenuDrawerList :items=\"item.panel.children||[]\" :depth=\"depth + 1\" :ui=\"ui\" :current=\"current\"></MenuDrawerList></div><div w-if=\"openId === item.id && !!item.panel && item.panel.type === 'monster'\" class=\"{{ ui.drawerPanel }}\"><div w-for=\"b in item.panel.blocks||[] traceby b.id\" w-class=\"{ 'hidden': b.mobile === false }\" class=\"{{ b.class || '' }}\">" + blocks + "</div></div></li></ul></template>";
	}
	const menuTpl = "<template><div class=\"{{ ui.host }}\"><nav w-if=\"!isMobile && !!items.length\" data-menu-root aria-label=\"Main\" class=\"{{ ui.root }}\"><MenuList :items=\"items\" :depth=\"0\" :ui=\"ui\" :current=\"current\"></MenuList></nav><div w-if=\"isMobile && drawerOpen\" class=\"{{ ui.overlay }}\" w-on=\"click:closeDrawer\"></div><aside w-if=\"isMobile && drawerOpen\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Menu\" class=\"{{ ui.drawer }}\"><div class=\"{{ ui.drawerHeader }}\"><button type=\"button\" class=\"{{ ui.drawerClose }}\" aria-label=\"Close\" w-on=\"click:closeDrawer\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"{{ ui.chevronRight }}\"><path d=\"M18 6 6 18M6 6l12 12\" /></svg></button></div><MenuDrawerList :items=\"items\" :depth=\"0\" :ui=\"ui\" :current=\"current\"></MenuDrawerList></aside></div></template>";
	function syncOffset(cfg) {
		if (!cfg.offsetVar) return;
		const el = global.document.querySelector("[data-menu-root]");
		global.document.documentElement.style.setProperty(cfg.offsetVar, (el ? el.offsetHeight : 0) + "px");
	}
	const CSS = "@keyframes menu-fade-in{from{opacity:0}to{opacity:1}}@keyframes menu-slide-left{from{transform:translateX(-100%)}to{transform:none}}@keyframes menu-slide-right{from{transform:translateX(100%)}to{transform:none}}@media (prefers-reduced-motion:reduce){[class*=\"animate-[menu-\"]{animation:none!important}}";
	let installed = false;
	function install(cfg) {
		if (installed) return;
		installed = true;
		const doc = global.document;
		if (!doc.getElementById("wex-menu-css")) {
			const st = doc.createElement("style");
			st.id = "wex-menu-css";
			st.textContent = CSS;
			doc.head.appendChild(st);
		}
		doc.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				$menu.closePanels();
				$menu.close();
			}
		});
		doc.addEventListener("pointerdown", (e) => {
			if (!e.target.closest || !e.target.closest("[data-menu-root]")) $menu.closePanels();
		});
		let raf = 0;
		global.addEventListener("resize", () => {
			global.cancelAnimationFrame(raf);
			raf = global.requestAnimationFrame(() => syncOffset(cfg));
		});
	}
	function createMenu(opts) {
		const cfg = resolveConfig(opts);
		const baseUi = Object.assign(buildUi(cfg), cfg.ui);
		const hover = () => cfg.trigger === "hover";
		const onLink = () => {
			$menu.closePanels();
			if (cfg.drawer.closeOnNavigate) $menu.close();
		};
		const list = $(listTpl(cfg)).state(() => ({
			items: [],
			depth: 0,
			ui: {},
			current: "",
			openId: null,
			t: 0
		})).method("enter", (state, id, panel) => {
			if (!hover()) return;
			clearTimeout(state.t);
			if (panel) {
				if (state.openId === id) return;
				const wait = state.openId ? 0 : cfg.hoverDelay;
				state.t = setTimeout(() => {
					state.openId = id;
				}, wait);
			} else if (state.openId) state.t = setTimeout(() => {
				state.openId = null;
			}, cfg.closeDelay);
		}).method("hold", (state) => {
			clearTimeout(state.t);
		}).method("leave", (state) => {
			if (!hover()) return;
			clearTimeout(state.t);
			if (state.openId) state.t = setTimeout(() => {
				state.openId = null;
			}, cfg.closeDelay);
		}).method("toggle", (state, id) => {
			clearTimeout(state.t);
			if (hover()) state.openId = id;
			else state.openId = state.openId === id ? null : id;
		}).method("linkClick", onLink).on("$mount", (state) => {
			listen(state, (type) => {
				if (type === "panels") state.openId = null;
			});
		}).on("$unmount", (state) => {
			unlisten(state);
		});
		const drawerList = $(drawerListTpl(cfg)).state(() => ({
			items: [],
			depth: 0,
			ui: {},
			current: "",
			openId: null
		})).method("toggle", (state, id) => {
			state.openId = state.openId === id ? null : id;
		}).method("linkClick", onLink);
		const mqs = /* @__PURE__ */ new WeakMap();
		const menu = $(menuTpl).state(() => ({
			items: [],
			current: "",
			ui: Object.assign({}, baseUi),
			isMobile: global.matchMedia ? !global.matchMedia(mediaQuery(cfg)).matches : false,
			drawerOpen: false
		})).on("$init", (state) => {
			state.ui = Object.assign({}, baseUi, state.ui);
		}).method("closeDrawer", () => {
			$menu.close();
		}).on("$mount", (state) => {
			const mql = global.matchMedia(mediaQuery(cfg));
			const onChange = () => {
				state.isMobile = !mql.matches;
				if (!state.isMobile) {
					state.drawerOpen = false;
					lockScroll(false);
					$menu._set(false);
				}
				global.requestAnimationFrame(() => syncOffset(cfg));
			};
			mql.addEventListener("change", onChange);
			mqs.set(state, {
				mql,
				onChange
			});
			listen(state, (type, v) => {
				if (type !== "drawer") return;
				state.drawerOpen = !!v && state.isMobile;
				lockScroll(state.drawerOpen);
			});
			state.isMobile = !mql.matches;
			global.requestAnimationFrame(() => syncOffset(cfg));
		}).on("$render", () => {
			global.requestAnimationFrame(() => syncOffset(cfg));
		}).on("$unmount", (state) => {
			const m = mqs.get(state);
			if (m) {
				m.mql.removeEventListener("change", m.onChange);
				mqs.delete(state);
			}
			unlisten(state);
			lockScroll(false);
			syncOffset(cfg);
		});
		jqvm.component("MenuList", list);
		jqvm.component("MenuDrawerList", drawerList);
		jqvm.component("Menu", menu);
		return function plugin(view) {
			install(cfg);
			if (view) view.menu = $menu;
			return view;
		};
	}
	createMenu.defaults = {
		settings: DEFAULTS,
		ui: buildUi(DEFAULTS)
	};
	createMenu.helpers = {
		menuGrid,
		menuBlockStyle,
		menuPanelStyle,
		menuActive,
		menuCurrent,
		norm,
		deepActive,
		buildUi
	};
	jqvm.createMenu = createMenu;
	jqvm.$menu = $menu;
	global.$menu = $menu;
})(window, window.jQuery);
