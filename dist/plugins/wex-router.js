(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports, require("../../wex.js"), require("../../wire.js")) :
  typeof define === 'function' && define.amd ? define(['exports', "../../wex.js", "../../wire.js"], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.WexRouter = {}), global.jqvm,global.jqvm));
})(this, function(exports, src_wex_js, src_wire_js) {
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
// src/plugins/router/route-pattern.js
	const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const dec$1 = (s) => {
		try {
			return decodeURIComponent(s);
		} catch {
			return s;
		}
	};
	const countGroups = (src) => new RegExp(src + "|").exec("").length - 1;
	const tokenRe = /\{(\w+)(\?|\*)?(?::([^}]+))?\}/g;
	const compiled = /* @__PURE__ */ new Map();
	const compiledRaw = /* @__PURE__ */ new Map();
	function compileRoute(pattern) {
		const cached = compiled.get(pattern);
		if (cached) return cached;
		const keys = [];
		const groups = [];
		let src = "";
		let last = 0;
		let n = 0;
		for (const m of pattern.matchAll(tokenRe)) {
			let literal = pattern.slice(last, m.index);
			const [, name, mod, custom] = m;
			const body = custom || (mod === "*" ? ".*" : "[^/]+");
			keys.push(name);
			groups.push(++n);
			n += countGroups(body);
			if (mod === "?") {
				const slash = literal.endsWith("/");
				if (slash) literal = literal.slice(0, -1);
				src += esc(literal) + (slash ? "(?:/" : "(?:") + "(" + body + "))?";
			} else src += esc(literal) + "(" + body + ")";
			last = m.index + m[0].length;
		}
		let tail = pattern.slice(last);
		if (tail.endsWith("/")) tail = tail.slice(0, -1);
		src += esc(tail);
		const result = {
			regex: new RegExp("^" + src + "/?$"),
			keys,
			groups
		};
		compiled.set(pattern, result);
		return result;
	}
	function compileRaw(pattern) {
		let re = compiledRaw.get(pattern);
		if (re) return re;
		const body = pattern.slice(6).trim();
		const i = body.lastIndexOf("/");
		if (body[0] !== "/" || i < 1) throw new Error(`route: неверная запись regex: «${pattern}», ожидается regex:/.../flags`);
		re = new RegExp(body.slice(1, i), body.slice(i + 1).replace(/[gy]/g, ""));
		compiledRaw.set(pattern, re);
		return re;
	}
	function matchRoute(pattern, pathname) {
		if (pattern.startsWith("regex:")) {
			const m = compileRaw(pattern).exec(pathname);
			if (!m) return null;
			const params = {};
			m.slice(1).forEach((v, k) => {
				params[k] = v;
			});
			if (m.groups) Object.assign(params, m.groups);
			return params;
		}
		const { regex, keys, groups } = compileRoute(pattern);
		const m = regex.exec(pathname);
		if (!m) return null;
		const params = {};
		keys.forEach((k, i) => {
			const v = m[groups[i]];
			if (v !== void 0) params[k] = dec$1(v);
		});
		return params;
	}
	function buildRoute(pattern, params = {}) {
		const used = /* @__PURE__ */ new Set();
		let url = pattern.replace(/(\/?)\{(\w+)(\?|\*)?(?::[^}]+)?\}/g, (all, slash, name, mod) => {
			const v = params[name];
			if (v === void 0 || v === null) {
				if (mod === "?") return "";
				throw new Error(`route: не хватает параметра «${name}» для ${pattern}`);
			}
			used.add(name);
			return slash + (mod === "*" ? String(v).split("/").map(encodeURIComponent).join("/") : encodeURIComponent(v));
		});
		if (url === "") url = "/";
		const rest = [];
		Object.keys(params).forEach((k) => {
			if (used.has(k)) return;
			const v = params[k];
			if (v === void 0 || v === null) return;
			[].concat(v).forEach((x) => rest.push(encodeURIComponent(k) + "=" + encodeURIComponent(x)));
		});
		if (rest.length) url += (url.includes("?") ? "&" : "?") + rest.join("&");
		return url;
	}

// src/plugins/router/router.js
	const getNodeName = (el) => el && el.nodeName ? el.nodeName.toLowerCase() : "node";
	if (!window.history.__wexPatched) {
		const rewriteHistory = (type) => {
			const origin = window.history[type];
			return function() {
				const rv = origin.apply(this, arguments);
				const e = new Event(type);
				e.arguments = arguments;
				window.dispatchEvent(e);
				return rv;
			};
		};
		window.history.pushState = rewriteHistory("pushState");
		window.history.replaceState = rewriteHistory("replaceState");
		Object.defineProperty(window.history, "__wexPatched", { value: true });
	}
	var Base = class {
		constructor(options) {
			this.events = [];
			const off = this.init(options);
			if (off) this.on("$destroy", off);
		}
		init() {}
		on(e, fn) {
			this.events.push({
				e,
				fn
			});
			return this;
		}
		off(e, fn) {
			this.events = this.events.filter((item) => !(item.e === e && item.fn === fn));
			return this;
		}
		emit(e, ...args) {
			this.events.slice().forEach((item) => {
				if (item.e === e) item.fn(...args);
			});
		}
		destroy() {
			this.emit("$destroy");
		}
	};
	var Navigation = class extends Base {
		init() {
			this.actionType = "";
			const initial = window.history.state?.idx;
			this.idx = typeof initial === "number" ? initial : 0;
			const onUrlChanged = (e) => {
				let type = e.type;
				const idx = window.history.state?.idx;
				if (typeof idx === "number") {
					if (type === "popstate") {
						if (idx < this.idx) type = "back";
						else if (idx > this.idx) type = "forward";
					}
					this.idx = idx;
				}
				this.actionType = type;
				this.emit(type, window.location.href);
				this.emit("change", window.location.href);
			};
			const onBeforeUnload = (e) => {
				if (this.events.some((item) => item.e === "protect")) {
					let prevented = false;
					const resolve = () => void 0;
					const reject = () => prevented = true;
					this.emit("protect", resolve, reject);
					if (prevented) e.preventDefault();
				}
			};
			window.addEventListener("popstate", onUrlChanged);
			window.addEventListener("replaceState", onUrlChanged);
			window.addEventListener("pushState", onUrlChanged);
			window.addEventListener("beforeunload", onBeforeUnload);
			return () => {
				window.removeEventListener("popstate", onUrlChanged);
				window.removeEventListener("replaceState", onUrlChanged);
				window.removeEventListener("pushState", onUrlChanged);
				window.removeEventListener("beforeunload", onBeforeUnload);
			};
		}
		back() {
			window.history.back();
		}
		forward() {
			window.history.forward();
		}
		same(url) {
			return new URL(url, window.location.href).href === window.location.href;
		}
		push(url) {
			if (this.same(url)) return;
			window.history.pushState({
				idx: this.idx + 1,
				url
			}, "", url);
		}
		replace(url) {
			if (this.same(url)) return;
			window.history.replaceState({
				idx: this.idx,
				url
			}, "", url);
		}
		open(url) {
			window.open(url);
		}
	};
	const navigation = new Navigation();
	let activeRouter = null;
	const fill = (tpl, params) => tpl.replace(/\{(\w+)\}/g, (_, k) => encodeURIComponent(params[k] ?? ""));
	const dec = (s) => {
		try {
			return decodeURIComponent(s.replace(/\+/g, " "));
		} catch {
			return s;
		}
	};
	var Router = class extends Base {
		init(options) {
			this.options = options;
			this.routes = Object.create(null);
			const table = options.routes || {};
			Object.keys(table).forEach((name) => {
				const r = table[name];
				this.routes[name] = typeof r === "string" ? { path: r } : r;
			});
			this.extra = /* @__PURE__ */ new Set();
			this.url = this.getUrl();
			const onChange = () => {
				const { baseUri = "" } = options;
				const url = this.getUrl();
				const prev = this.url;
				this.url = url;
				if (prev === url) return;
				if (baseUri && url.indexOf(baseUri) !== 0) return;
				this.emit("change", url);
			};
			navigation.on("change", onChange);
			return () => navigation.off("change", onChange);
		}
		navigate(type, to) {
			if (this.options.mode === "history") navigation[type](to);
			else {
				const { pathname, search = "" } = window.location;
				navigation[type](pathname + search + "#" + to);
			}
		}
		getUrl() {
			const { hash, href, origin } = window.location;
			if (this.options.mode === "history") return href.replace(origin, "");
			return hash.replace("#", "") || "/";
		}
		getLocation() {
			let raw = this.getUrl();
			if (this.options.mode === "history") raw = raw.split("#")[0];
			const q = raw.indexOf("?");
			const pathname = q < 0 ? raw : raw.slice(0, q);
			const search = q < 0 ? "" : raw.slice(q + 1);
			const query = {};
			search.split("&").filter(Boolean).forEach((item) => {
				const i = item.indexOf("=");
				const k = i < 0 ? item : item.slice(0, i);
				const v = i < 0 ? "" : item.slice(i + 1);
				query[dec(k)] = dec(v);
			});
			return {
				pathname,
				search,
				query
			};
		}
		setParams(params) {
			const { pathname, query } = this.getLocation();
			const next = {
				...query,
				...params
			};
			const search = Object.keys(next).filter((k) => next[k] !== void 0 && next[k] !== null).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(next[k])).join("&");
			this.navigate("push", pathname + (search ? "?" + search : ""));
		}
		pattern(ref) {
			return this.routes[ref] ? this.routes[ref].path : ref;
		}
		register(pattern) {
			if (this.routes[pattern]) return;
			if (!Object.values(this.routes).some((r) => r.path === pattern)) this.extra.add(pattern);
		}
		matchPath(pathname) {
			for (const name of Object.keys(this.routes)) {
				const params = matchRoute(this.routes[name].path, pathname);
				if (params) return {
					name,
					route: this.routes[name],
					params
				};
			}
			for (const pattern of this.extra) {
				const params = matchRoute(pattern, pathname);
				if (params) return {
					name: null,
					route: { path: pattern },
					params
				};
			}
			return {
				name: null,
				route: null,
				params: {}
			};
		}
		match() {
			return this.matchPath(this.getLocation().pathname);
		}
		isMatch(ref) {
			return matchRoute(this.pattern(ref), this.getLocation().pathname) !== null;
		}
		path(ref, params) {
			return buildRoute(this.pattern(ref), params);
		}
		href(path) {
			return this.options.mode === "history" ? path : "#" + path;
		}
		url2(ref, params) {
			return this.href(this.path(ref, params));
		}
		go(ref, params, type = "push") {
			this.navigate(type, this.path(ref, params));
		}
		prefetchPath(path) {
			const hit = this.matchPath(path.split("?")[0]);
			if (!hit.route) return;
			const { component: url, data } = hit.route;
			if (url) (0, src_wex_js.preloadComponent)(url);
			const list = typeof data === "function" ? data(hit.params) : data;
			[].concat(list || []).forEach((u) => src_wire_js.$wire.prefetch(fill(u, hit.params)));
		}
	};
	function route(ref, params) {
		if (!activeRouter) throw new Error("Wex: подключите createRouter() через .plugin(...)");
		return activeRouter.url2(ref, params);
	}
	(0, src_wex_js.directive)("w-route", function($el, attrs) {
		const router = activeRouter;
		if (!router) throw new Error("Wex: подключите createRouter() через .plugin(...)");
		let pattern = attrs["w-route"].trim();
		if (/^(['"]).*\1$/.test(pattern)) pattern = pattern.slice(1, -1);
		router.register(pattern);
		if (!router.isMatch(pattern)) return `<!-- ${getNodeName($el[0])} w-route="${pattern.replace(/--/g, "- -")}" (hidden) -->`;
	}, null, 100);
	(0, src_wex_js.component)("Link", function($el, attrs, slot) {
		const router = activeRouter;
		const ref = attrs[":to"] ? this.scope.parse(attrs[":to"]) : attrs.to;
		const params = attrs[":params"] ? this.scope.parse(attrs[":params"]) : {};
		const path = router.path(ref, params);
		const a = document.createElement("a");
		Object.keys(attrs).forEach((k) => {
			if (k === "to" || k[0] === ":" || k[0] === "@") return;
			a.setAttribute(k, attrs[k]);
		});
		a.setAttribute("href", router.href(path));
		a.setAttribute("data-wex-link", path);
		slot().forEach((n) => a.appendChild(n));
		return a;
	}, function($el) {
		const a = $el[0];
		const path = a && a.getAttribute && a.getAttribute("data-wex-link");
		if (!path) return;
		const router = activeRouter;
		let timer = null;
		const warm = () => router.prefetchPath(path);
		const enter = () => {
			clearTimeout(timer);
			timer = setTimeout(warm, 65);
		};
		const leave = () => clearTimeout(timer);
		const click = (e) => {
			if (router.options.mode !== "history") return;
			if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
			e.preventDefault();
			router.navigate("push", path);
		};
		a.addEventListener("mouseenter", enter);
		a.addEventListener("mouseleave", leave);
		a.addEventListener("touchstart", warm, { passive: true });
		a.addEventListener("focus", warm);
		a.addEventListener("click", click);
		return () => {
			clearTimeout(timer);
			a.removeEventListener("mouseenter", enter);
			a.removeEventListener("mouseleave", leave);
			a.removeEventListener("touchstart", warm);
			a.removeEventListener("focus", warm);
			a.removeEventListener("click", click);
		};
	});
	function createRouter(options = {}) {
		const router = new Router(options);
		return function() {
			const { view } = this;
			activeRouter = router;
			const $route = {};
			const def = (key, get) => Object.defineProperty($route, key, {
				get,
				enumerable: true
			});
			def("name", () => router.match().name);
			def("params", () => router.match().params);
			def("query", () => router.getLocation().query);
			def("path", () => router.getLocation().pathname);
			Object.defineProperty($route, "url", {
				value: (ref, p) => router.url2(ref, p),
				enumerable: false
			});
			const routerChange = () => {
				view.emit("$route", router.getUrl());
				view.update(true);
			};
			return {
				$init: (state) => {
					view.$router = router;
					state.$route = $route;
					router.on("change", routerChange);
				},
				$destroy: () => {
					router.off("change", routerChange);
					router.destroy();
					if (activeRouter === router) activeRouter = null;
				},
				$clone: (state, clonedView) => {
					clonedView.$router = router;
				}
			};
		};
	}

exports.createRouter = createRouter;
exports.route = route;
});