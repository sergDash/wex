(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.WexImageEditor = {}));
})(this, function(exports) {
	// \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
	// src/plugins/image-editor/wex-image-editor.js
	var require_wex_image_editor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
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
		(function(root) {
			"use strict";
			const doc = () => root.document;
			const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
			const G = {};
			G.fitRect = (W, H, aspect) => {
				if (!aspect) return {
					x: 0,
					y: 0,
					w: W,
					h: H
				};
				let w = W, h = W / aspect;
				if (h > H) {
					h = H;
					w = H * aspect;
				}
				return {
					x: (W - w) / 2,
					y: (H - h) / 2,
					w,
					h
				};
			};
			G.moveRect = (r, dx, dy, W, H) => ({
				x: clamp(r.x + dx, 0, W - r.w),
				y: clamp(r.y + dy, 0, H - r.h),
				w: r.w,
				h: r.h
			});
			G.rotateRect = (r, W, H, dir) => dir > 0 ? {
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
			G.zoomRect = (r, f, W, H, min) => {
				min = min || 16;
				let w = r.w * f, h = r.h * f;
				const s = Math.min(1, W / w, H / h);
				w *= s;
				h *= s;
				const k = Math.max(1, min / w, min / h);
				w *= k;
				h *= k;
				const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
				return {
					x: clamp(cx - w / 2, 0, Math.max(0, W - w)),
					y: clamp(cy - h / 2, 0, Math.max(0, H - h)),
					w,
					h
				};
			};
			G.resizeRect = (s, h, dx, dy, o) => {
				const W = o.W, H = o.H, aspect = o.aspect || 0, min = o.min || 16;
				const L = h.indexOf("w") > -1, R = h.indexOf("e") > -1, T = h.indexOf("n") > -1, B = h.indexOf("s") > -1;
				let x1 = s.x, y1 = s.y, x2 = s.x + s.w, y2 = s.y + s.h;
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
					const ax = L ? x2 : x1, ay = T ? y2 : y1;
					const tx = L ? x1 + dx : x2 + dx, ty = T ? y1 + dy : y2 + dy;
					const dirX = L ? -1 : 1, dirY = T ? -1 : 1;
					let w = Math.max(min, (tx - ax) * dirX), hh = Math.max(min, (ty - ay) * dirY);
					if (w / aspect >= hh) hh = w / aspect;
					else w = hh * aspect;
					if (w < min) {
						w = min;
						hh = w / aspect;
					}
					if (hh < min) {
						hh = min;
						w = hh * aspect;
					}
					const k = Math.min(1, (dirX > 0 ? W - ax : ax) / w, (dirY > 0 ? H - ay : ay) / hh);
					w *= k;
					hh *= k;
					return {
						x: dirX > 0 ? ax : ax - w,
						y: dirY > 0 ? ay : ay - hh,
						w,
						h: hh
					};
				}
				if (L || R) {
					const cy = s.y + s.h / 2;
					const maxW = Math.min(L ? x2 : W - x1, 2 * Math.min(cy, H - cy) * aspect);
					const w = clamp(L ? x2 - (x1 + dx) : x2 + dx - x1, Math.min(Math.max(min, min * aspect), maxW), maxW);
					return {
						x: L ? x2 - w : x1,
						y: cy - w / aspect / 2,
						w,
						h: w / aspect
					};
				}
				const cx = s.x + s.w / 2;
				const maxH = Math.min(T ? y2 : H - y1, 2 * Math.min(cx, W - cx) / aspect);
				const hh = clamp(T ? y2 - (y1 + dy) : y2 + dy - y1, Math.min(Math.max(min, min / aspect), maxH), maxH);
				return {
					x: cx - hh * aspect / 2,
					y: T ? y2 - hh : y1,
					w: hh * aspect,
					h: hh
				};
			};
			const mk = (w, h) => {
				const c = doc().createElement("canvas");
				c.width = Math.max(1, Math.round(w));
				c.height = Math.max(1, Math.round(h));
				return c;
			};
			const clone = (v) => v === void 0 ? v : JSON.parse(JSON.stringify(v));
			function splitName(name) {
				name = String(name || "");
				const i = name.lastIndexOf(".");
				return i > 0 && i < name.length - 1 ? {
					base: name.slice(0, i),
					ext: name.slice(i + 1)
				} : {
					base: name,
					ext: ""
				};
			}
			const TYPE_EXT = {
				"image/jpeg": "jpg",
				"image/png": "png",
				"image/webp": "webp"
			};
			const EXT_TYPE = {
				jpg: "image/jpeg",
				jpeg: "image/jpeg",
				png: "image/png",
				webp: "image/webp",
				gif: "image/gif",
				svg: "image/svg+xml",
				bmp: "image/bmp",
				avif: "image/avif"
			};
			function pickType(sourceType, want) {
				if (want && want !== "auto") return want;
				return TYPE_EXT[sourceType] ? sourceType : "image/png";
			}
			function toBlob(canvas, type, quality) {
				return new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(/* @__PURE__ */ new Error("toBlob failed")), type, quality));
			}
			function bitmapFrom(blob) {
				const viaImg = () => new Promise((res, rej) => {
					const url = URL.createObjectURL(blob);
					const img = new root.Image();
					img.onload = () => {
						URL.revokeObjectURL(url);
						res(img);
					};
					img.onerror = () => {
						URL.revokeObjectURL(url);
						rej(/* @__PURE__ */ new Error("image decode failed"));
					};
					img.src = url;
				});
				if (typeof root.createImageBitmap === "function" && blob.type !== "image/svg+xml") return root.createImageBitmap(blob).catch(viaImg);
				return viaImg();
			}
			async function loadSource(src, maxSide) {
				let blob = src;
				if (typeof src === "string") {
					const r = await root.fetch(src, { credentials: "same-origin" });
					if (!r.ok) throw new Error("HTTP " + r.status);
					blob = await r.blob();
					if (!blob.type) blob = blob.slice(0, blob.size, EXT_TYPE[splitName(src.split("?")[0]).ext.toLowerCase()] || "");
				}
				const bmp = await bitmapFrom(blob);
				const w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
				const k = Math.min(1, (maxSide || 8192) / Math.max(w, h));
				const c = mk(w * k, h * k);
				const x = c.getContext("2d");
				x.imageSmoothingQuality = "high";
				x.drawImage(bmp, 0, 0, c.width, c.height);
				if (bmp.close) bmp.close();
				return {
					canvas: c,
					type: blob.type || ""
				};
			}
			function scaleDown(canvas, maxW, maxH) {
				const k = Math.min(1, maxW ? maxW / canvas.width : 1, maxH ? maxH / canvas.height : 1);
				if (k >= 1) return canvas;
				const c = mk(canvas.width * k, canvas.height * k);
				const x = c.getContext("2d");
				x.imageSmoothingQuality = "high";
				x.drawImage(canvas, 0, 0, c.width, c.height);
				return c;
			}
			const registry = {};
			function extension(def) {
				if (!def || !def.name) throw new Error("[ImageEditor] extension needs a name");
				registry[def.name] = Object.assign({
					order: 50,
					options: {},
					stage: "own"
				}, def);
				return def;
			}
			const resolveExts = (list) => (list || ["crop"]).map((e) => {
				const d = typeof e === "string" ? registry[e] : Object.assign({
					order: 50,
					options: {},
					stage: "own"
				}, e);
				if (!d) throw new Error("[ImageEditor] unknown extension: " + e);
				return d;
			}).sort((a, b) => a.order - b.order);
			const extOptions = (e, o) => Object.assign({}, e.options, o[e.name]);
			function runPipeline(canvas, exts, params, o, upto) {
				let c = canvas;
				for (const e of exts) {
					if (upto != null && e.order >= upto) break;
					const p = params[e.name];
					const info = {
						width: c.width,
						height: c.height,
						options: extOptions(e, o)
					};
					if (e.isDefault && e.isDefault(p, info)) continue;
					c = e.apply(c, p, info) || c;
				}
				return c;
			}
			const rotateCanvas = (c, deg) => {
				deg = (deg % 360 + 360) % 360;
				if (!deg) return c;
				const swap = deg === 90 || deg === 270;
				const o = mk(swap ? c.height : c.width, swap ? c.width : c.height);
				const x = o.getContext("2d");
				x.translate(o.width / 2, o.height / 2);
				x.rotate(deg * Math.PI / 180);
				x.drawImage(c, -c.width / 2, -c.height / 2);
				return o;
			};
			const cropCanvas = (c, r) => {
				const x = clamp(Math.round(r.x), 0, c.width - 1), y = clamp(Math.round(r.y), 0, c.height - 1);
				const w = clamp(Math.round(r.w), 1, c.width - x), h = clamp(Math.round(r.h), 1, c.height - y);
				const o = mk(w, h);
				o.getContext("2d").drawImage(c, x, y, w, h, 0, 0, w, h);
				return o;
			};
			const ICON = {
				crop: "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 2v14a2 2 0 0 0 2 2h14\"/><path d=\"M18 22V8a2 2 0 0 0-2-2H2\"/></svg>",
				left: "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12a9 9 0 1 0 3-6.7\"/><path d=\"M3 4v5h5\"/></svg>",
				right: "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12a9 9 0 1 1-3-6.7\"/><path d=\"M21 4v5h-5\"/></svg>",
				x: "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg>",
				file: "<svg viewBox=\"0 0 24 24\" width=\"64\" height=\"64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5\"/></svg>"
			};
			extension({
				name: "crop",
				label: "Crop",
				icon: ICON.crop,
				order: 10,
				options: {
					aspects: [
						{
							label: "Free",
							value: 0
						},
						{
							label: "Original",
							value: "original"
						},
						{
							label: "1:1",
							value: 1
						},
						{
							label: "4:3",
							value: 4 / 3
						},
						{
							label: "3:2",
							value: 3 / 2
						},
						{
							label: "16:9",
							value: 16 / 9
						},
						{
							label: "3:4",
							value: 3 / 4
						},
						{
							label: "9:16",
							value: 9 / 16
						}
					],
					aspect: 0,
					lock: false,
					min: 16
				},
				defaults: () => ({
					rotate: 0,
					rect: null,
					aspect: void 0
				}),
				isDefault(p, info) {
					if (!p) return true;
					if ((p.rotate || 0) % 360 !== 0) return false;
					const r = p.rect;
					return !r || r.x <= .5 && r.y <= .5 && Math.abs(r.w - info.width) <= 1 && Math.abs(r.h - info.height) <= 1;
				},
				apply(c, p) {
					let out = rotateCanvas(c, p.rotate || 0);
					if (p.rect) {
						const r = p.rect;
						if (!(r.x <= .5 && r.y <= .5 && Math.abs(r.w - out.width) <= 1 && Math.abs(r.h - out.height) <= 1)) out = cropCanvas(out, r);
					}
					return out;
				},
				mount(ctx) {
					const t = ctx.t, opt = ctx.options, stage = ctx.stage;
					const input = ctx.input();
					let rot, W, H, scale = 1, rect;
					const normV = (v) => {
						if (typeof v === "string") {
							const k = v.trim().toLowerCase();
							if (k === "free" || k === "") return 0;
							if (k === "original") return "original";
							const m = k.match(/^(\d+(?:\.\d+)?)\s*[:\/x]\s*(\d+(?:\.\d+)?)$/);
							return m ? m[1] / m[2] : parseFloat(k) || 0;
						}
						return v || 0;
					};
					const aspects = (opt.aspects || []).map((a) => a && typeof a === "object" ? {
						label: a.label,
						value: normV(a.value)
					} : {
						label: typeof a === "string" ? /^free$/i.test(a) ? "Free" : /^original$/i.test(a) ? "Original" : a : String(a),
						value: normV(a)
					});
					opt.aspect = normV(opt.aspect);
					const aspectNow = () => {
						const a = ctx.params.aspect === void 0 ? opt.aspect : ctx.params.aspect;
						return a === "original" ? W / H : a || 0;
					};
					const rebuild = () => {
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
					const view = ctx.h("div", { class: "wie-view" });
					const cv = ctx.h("canvas", { class: "wie-cv" });
					const box = ctx.h("div", {
						class: "wie-crop",
						tabindex: "0",
						role: "group",
						"aria-label": t.crop
					}, ctx.h("i", { class: "wie-g wie-g1" }), ctx.h("i", { class: "wie-g wie-g2" }), ctx.h("i", { class: "wie-g wie-g3" }), ctx.h("i", { class: "wie-g wie-g4" }));
					[
						"nw",
						"n",
						"ne",
						"e",
						"se",
						"s",
						"sw",
						"w"
					].forEach((hd) => box.append(ctx.h("b", {
						class: "wie-h wie-h-" + hd,
						"data-h": hd
					})));
					const dims = ctx.h("div", { class: "wie-dims" });
					box.append(dims);
					view.append(cv, box);
					stage.append(view);
					const chips = aspects.map((a) => ctx.h("button", {
						type: "button",
						class: "wie-chip",
						"data-v": String(a.value),
						onclick: () => setAspect(a.value)
					}, a.label === "Free" ? t.free : a.label === "Original" ? t.original : a.label));
					const zoom = ctx.h("input", {
						type: "range",
						class: "wie-range",
						min: "1",
						max: "8",
						step: "0.01",
						value: "1",
						"aria-label": t.zoom
					});
					const mkBtn = (cls, icon, label, fn) => ctx.h("button", {
						type: "button",
						class: cls,
						title: label,
						"aria-label": label,
						onclick: fn,
						html: icon + "<span>" + label + "</span>"
					});
					ctx.panel.append(opt.lock ? null : ctx.h("div", { class: "wie-field" }, ctx.h("label", { class: "wie-lab" }, t.aspect), ctx.h("div", { class: "wie-chips" }, chips)), ctx.h("div", { class: "wie-field" }, ctx.h("label", { class: "wie-lab" }, t.zoom), zoom), ctx.h("div", { class: "wie-row" }, mkBtn("wie-btn wie-btn-sm", ICON.left, t.rotateLeft, () => rotate(-1)), mkBtn("wie-btn wie-btn-sm", ICON.right, t.rotateRight, () => rotate(1)), ctx.h("button", {
						type: "button",
						class: "wie-btn wie-btn-sm wie-btn-ghost",
						onclick: () => reset()
					}, t.reset)));
					const save = () => ctx.set({ rect: {
						x: rect.x,
						y: rect.y,
						w: rect.w,
						h: rect.h
					} });
					const layout = () => {
						const sw = stage.clientWidth, sh = stage.clientHeight;
						if (!sw || !sh) return;
						scale = Math.min((sw - 40) / W, (sh - 40) / H);
						const vw = Math.max(40, Math.floor(W * scale)), vh = Math.max(40, Math.floor(H * scale));
						scale = vw / W;
						view.style.width = vw + "px";
						view.style.height = vh + "px";
						const dpr = Math.min(root.devicePixelRatio || 1, 2);
						cv.width = Math.round(vw * dpr);
						cv.height = Math.round(vh * dpr);
						cv.style.width = vw + "px";
						cv.style.height = vh + "px";
						const x = cv.getContext("2d");
						x.imageSmoothingQuality = "high";
						x.drawImage(rot, 0, 0, cv.width, cv.height);
						paint();
					};
					const paint = () => {
						box.style.left = rect.x * scale + "px";
						box.style.top = rect.y * scale + "px";
						box.style.width = rect.w * scale + "px";
						box.style.height = rect.h * scale + "px";
						dims.textContent = Math.round(rect.w) + " × " + Math.round(rect.h);
						const fit = G.fitRect(W, H, rect.w / rect.h);
						zoom.value = String(clamp(fit.w / rect.w, 1, 8));
						const a = ctx.params.aspect === void 0 ? opt.aspect : ctx.params.aspect;
						chips.forEach((c) => c.classList.toggle("is-on", c.getAttribute("data-v") === String(a)));
						save();
					};
					function setAspect(v) {
						ctx.set({ aspect: v });
						const a = aspectNow();
						if (a) {
							const fr = G.fitRect(W, H, a);
							const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
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
						const oldW = W, oldH = H;
						rect = G.rotateRect(rect, oldW, oldH, dir);
						ctx.set({ rotate: (((ctx.params.rotate || 0) + 90 * dir) % 360 + 360) % 360 });
						rebuild();
						if (ctx.params.aspect === "original") rect = G.fitRect(W, H, W / H);
						layout();
					}
					function reset() {
						ctx.set({
							rotate: 0,
							rect: null,
							aspect: void 0
						});
						rebuild();
						rect = G.fitRect(W, H, aspectNow());
						layout();
					}
					const gesture = (e, handle) => {
						if (e.button !== void 0 && e.button !== 0) return;
						e.preventDefault();
						e.stopPropagation();
						const sx = e.clientX, sy = e.clientY, start = {
							x: rect.x,
							y: rect.y,
							w: rect.w,
							h: rect.h
						};
						box.classList.add("is-drag");
						const move = (ev) => {
							const dx = (ev.clientX - sx) / scale, dy = (ev.clientY - sy) / scale;
							rect = handle === "move" ? G.moveRect(start, dx, dy, W, H) : G.resizeRect(start, handle, dx, dy, {
								W,
								H,
								aspect: aspectNow(),
								min: opt.min
							});
							paint();
						};
						const up = () => {
							root.removeEventListener("pointermove", move);
							root.removeEventListener("pointerup", up);
							root.removeEventListener("pointercancel", up);
							box.classList.remove("is-drag");
						};
						root.addEventListener("pointermove", move);
						root.addEventListener("pointerup", up);
						root.addEventListener("pointercancel", up);
					};
					const onDown = (e) => {
						const hd = e.target.getAttribute && e.target.getAttribute("data-h");
						gesture(e, hd || "move");
					};
					box.addEventListener("pointerdown", onDown);
					const onKey = (e) => {
						const k = {
							ArrowLeft: [-1, 0],
							ArrowRight: [1, 0],
							ArrowUp: [0, -1],
							ArrowDown: [0, 1]
						}[e.key];
						if (!k) return;
						e.preventDefault();
						const step = (e.shiftKey ? 10 : 1) / scale;
						rect = G.moveRect(rect, k[0] * step, k[1] * step, W, H);
						paint();
					};
					box.addEventListener("keydown", onKey);
					const onWheel = (e) => {
						e.preventDefault();
						rect = G.zoomRect(rect, e.deltaY > 0 ? 1.08 : 1 / 1.08, W, H, opt.min);
						paint();
					};
					stage.addEventListener("wheel", onWheel, { passive: false });
					zoom.addEventListener("input", () => {
						const target = G.fitRect(W, H, rect.w / rect.h).w / parseFloat(zoom.value);
						rect = G.zoomRect(rect, target / rect.w, W, H, opt.min);
						paint();
					});
					const ro = typeof root.ResizeObserver === "function" ? new root.ResizeObserver(layout) : null;
					if (ro) ro.observe(stage);
					else root.addEventListener("resize", layout);
					layout();
					return () => {
						if (ro) ro.disconnect();
						else root.removeEventListener("resize", layout);
						stage.removeEventListener("wheel", onWheel);
					};
				}
			});
			const TEXTS = {
				title: "Edit image",
				close: "Close",
				cancel: "Cancel",
				done: "Done",
				saving: "Saving…",
				loading: "Loading…",
				loadError: "Could not open this image",
				details: "Details",
				name: "File name",
				alt: "Alt text",
				altHint: "Describe the image for screen readers and search engines",
				crop: "Crop",
				free: "Free",
				original: "Original",
				aspect: "Aspect ratio",
				zoom: "Zoom",
				rotateLeft: "Rotate left",
				rotateRight: "Rotate right",
				reset: "Reset"
			};
			const CSS = `
.wie,.wie *{box-sizing:border-box}
.wie{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(6,10,18,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font:14px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif;color:#e6eaf2;animation:wie-fade .18s ease both}
.wie.is-out{animation:wie-fade-out .16s ease both}
.wie-dialog{width:min(1120px,96vw);height:min(760px,94vh);display:grid;grid-template-columns:minmax(0,1fr) 300px;grid-template-rows:auto minmax(0,1fr) auto;background:#0f1520;border:1px solid #232d40;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden;animation:wie-pop .22s cubic-bezier(.2,.9,.3,1.15) both;outline:none}
.wie.is-out .wie-dialog{animation:wie-pop-out .16s ease both}
.wie-head{grid-column:1/-1;display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #1d2638}
.wie-title{font-weight:600;font-size:15px}
.wie-file{color:#8b97ad;font-size:12px;margin-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:46vw}
.wie-x{margin-left:auto}
.wie-stage{position:relative;min-width:0;min-height:0;overflow:hidden;background:#0a0f19 repeating-conic-gradient(#0d1420 0 25%,#0a0f19 0 50%) 0 0/20px 20px;display:flex;align-items:center;justify-content:center}
.wie-stagebox{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.wie-view{position:relative;box-shadow:0 8px 40px rgba(0,0,0,.5)}
.wie-cv{display:block;user-select:none;-webkit-user-select:none}
.wie-crop{position:absolute;box-shadow:0 0 0 9999px rgba(5,8,14,.62);outline:1.5px solid #fff;cursor:move;touch-action:none}
.wie-crop:focus-visible{outline:2px solid #6aa2ff}
.wie-g{position:absolute;background:rgba(255,255,255,.35);pointer-events:none;opacity:0;transition:opacity .15s}
.wie-crop.is-drag .wie-g{opacity:1}
.wie-g1{left:33.33%;top:0;bottom:0;width:1px}.wie-g2{left:66.66%;top:0;bottom:0;width:1px}
.wie-g3{top:33.33%;left:0;right:0;height:1px}.wie-g4{top:66.66%;left:0;right:0;height:1px}
.wie-h{position:absolute;width:14px;height:14px;background:#fff;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,.5);touch-action:none}
.wie-h::after{content:'';position:absolute;inset:-9px}
.wie-h-nw{left:-7px;top:-7px;cursor:nwse-resize}.wie-h-ne{right:-7px;top:-7px;cursor:nesw-resize}
.wie-h-se{right:-7px;bottom:-7px;cursor:nwse-resize}.wie-h-sw{left:-7px;bottom:-7px;cursor:nesw-resize}
.wie-h-n{left:calc(50% - 7px);top:-7px;cursor:ns-resize}.wie-h-s{left:calc(50% - 7px);bottom:-7px;cursor:ns-resize}
.wie-h-e{top:calc(50% - 7px);right:-7px;cursor:ew-resize}.wie-h-w{top:calc(50% - 7px);left:-7px;cursor:ew-resize}
.wie-dims{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);padding:2px 8px;border-radius:999px;background:rgba(15,21,32,.9);color:#c9d3e6;font-size:11px;white-space:nowrap;pointer-events:none}
.wie-side{display:flex;flex-direction:column;gap:18px;padding:16px;border-left:1px solid #1d2638;background:#121a28;overflow:auto;min-height:0}
.wie-tabs{display:flex;gap:6px;flex-wrap:wrap}
.wie-tab{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;border:1px solid #263043;background:transparent;color:#aeb9cf;cursor:pointer;font:inherit;transition:all .15s}
.wie-tab:hover{color:#fff;border-color:#34425b}.wie-tab.is-on{background:#1d2c4a;border-color:#3b6bd6;color:#fff}
.wie-panel{display:flex;flex-direction:column;gap:14px}
.wie-field{display:flex;flex-direction:column;gap:6px}
.wie-lab{font-size:12px;color:#8b97ad;letter-spacing:.02em}
.wie-chips{display:flex;flex-wrap:wrap;gap:6px}
.wie-chip{padding:4px 10px;border-radius:999px;border:1px solid #263043;background:transparent;color:#aeb9cf;cursor:pointer;font:inherit;font-size:12px;transition:all .15s}
.wie-chip:hover{color:#fff;border-color:#34425b}.wie-chip.is-on{background:#3b82f6;border-color:#3b82f6;color:#fff}
.wie-range{width:100%;accent-color:#3b82f6}
.wie-row{display:flex;gap:8px;flex-wrap:wrap}
.wie-meta{display:flex;flex-direction:column;gap:12px;padding-top:16px;border-top:1px solid #1d2638}
.wie-meta h4{margin:0;font-size:12px;font-weight:600;color:#8b97ad;text-transform:uppercase;letter-spacing:.06em}
.wie-input{width:100%;padding:8px 10px;border-radius:8px;border:1px solid #263043;background:#0d1320;color:#e6eaf2;font:inherit;outline:none;transition:border-color .15s,box-shadow .15s;resize:vertical}
.wie-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.25)}
.wie-namebox{display:flex;align-items:stretch}
.wie-namebox .wie-input{border-top-right-radius:0;border-bottom-right-radius:0}
.wie-ext{display:flex;align-items:center;padding:0 10px;border:1px solid #263043;border-left:0;border-radius:0 8px 8px 0;background:#0a0f19;color:#8b97ad;font-size:13px}
.wie-hint{font-size:11.5px;color:#7d889e}
.wie-foot{grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;padding:12px 16px;border-top:1px solid #1d2638}
.wie-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:9px;border:1px solid #34425b;background:#1a2438;color:#e6eaf2;cursor:pointer;font:inherit;font-weight:500;transition:transform .1s,background .15s,border-color .15s,opacity .15s}
.wie-btn:hover{background:#222f49}.wie-btn:active{transform:scale(.97)}
.wie-btn:disabled{opacity:.5;cursor:default}
.wie-btn-primary{background:#3b82f6;border-color:#3b82f6;color:#fff}.wie-btn-primary:hover{background:#2f72e6}
.wie-btn-sm{padding:6px 10px;font-size:13px}.wie-btn-ghost{background:transparent}
.wie-btn-icon{padding:6px;border-radius:8px}
.wie-btn:focus-visible,.wie-tab:focus-visible,.wie-chip:focus-visible{outline:2px solid #6aa2ff;outline-offset:2px}
.wie-msg{display:flex;flex-direction:column;align-items:center;gap:12px;color:#8b97ad}
.wie-msg svg{opacity:.55}
.wie-spin{width:30px;height:30px;border-radius:50%;border:3px solid #263043;border-top-color:#3b82f6;animation:wie-rot .8s linear infinite}
@keyframes wie-fade{from{opacity:0}to{opacity:1}}
@keyframes wie-fade-out{to{opacity:0}}
@keyframes wie-pop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
@keyframes wie-pop-out{to{opacity:0;transform:translateY(6px) scale(.98)}}
@keyframes wie-rot{to{transform:rotate(360deg)}}
@media (max-width:820px){.wie-dialog{width:100vw;height:100dvh;border-radius:0;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr) minmax(0,46%) auto}.wie-side{border-left:0;border-top:1px solid #1d2638}.wie-file{max-width:40vw}}
@media (prefers-reduced-motion:reduce){.wie,.wie-dialog{animation:none!important}}
`;
			function injectCss() {
				if (doc().getElementById("wie-css")) return;
				const s = doc().createElement("style");
				s.id = "wie-css";
				s.textContent = CSS;
				doc().head.appendChild(s);
			}
			function h(tag, props) {
				const e = doc().createElement(tag);
				if (props) for (const k in props) {
					const v = props[k];
					if (v == null || v === false) continue;
					if (k === "class") e.className = v;
					else if (k === "html") e.innerHTML = v;
					else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
					else e.setAttribute(k, v === true ? "" : v);
				}
				for (let i = 2; i < arguments.length; i++) [].concat(arguments[i]).forEach((c) => {
					if (c != null && c !== false) e.append(c.nodeType ? c : doc().createTextNode(String(c)));
				});
				return e;
			}
			class Editor {
				constructor(o, resolve) {
					this.o = o;
					this.resolve = resolve;
					this.t = Object.assign({}, TEXTS, o.texts);
					this.exts = o.source ? resolveExts(o.extensions) : [];
					this.params = {};
					this.exts.forEach((e) => {
						const given = o.params && o.params[e.name];
						this.params[e.name] = Object.assign(e.defaults ? e.defaults(extOptions(e, o)) : {}, clone(given) || {});
					});
					const sp = splitName(o.name);
					this.base = sp.base;
					this.ext = sp.ext;
					this.alt = o.alt || "";
					this.cleanup = null;
					this.active = null;
					this.closed = false;
				}
				start() {
					injectCss();
					const t = this.t, o = this.o;
					this.prevFocus = doc().activeElement;
					this.prevOverflow = doc().body.style.overflow;
					doc().body.style.overflow = "hidden";
					const meta = o.meta === false ? [] : o.meta || ["name", "alt"];
					const fields = [];
					if (meta.indexOf("name") > -1) {
						this.nameInput = h("input", {
							class: "wie-input",
							type: "text",
							id: "wie-name",
							autocomplete: "off",
							spellcheck: "false",
							value: this.base
						});
						fields.push(h("div", { class: "wie-field" }, h("label", {
							class: "wie-lab",
							for: "wie-name"
						}, t.name), h("div", { class: "wie-namebox" }, this.nameInput, this.ext ? h("span", { class: "wie-ext" }, "." + this.ext) : null)));
					}
					if (meta.indexOf("alt") > -1 && o.source) {
						this.altInput = h("textarea", {
							class: "wie-input",
							id: "wie-alt",
							rows: "3",
							placeholder: t.altHint
						});
						this.altInput.value = this.alt;
						fields.push(h("div", { class: "wie-field" }, h("label", {
							class: "wie-lab",
							for: "wie-alt"
						}, t.alt), this.altInput));
					}
					this.stage = h("div", { class: "wie-stage" });
					this.stageBox = h("div", { class: "wie-stagebox" });
					this.stage.append(this.stageBox);
					this.tabs = h("nav", {
						class: "wie-tabs",
						role: "tablist"
					});
					this.panel = h("div", { class: "wie-panel" });
					this.side = h("aside", { class: "wie-side" }, this.tabs, this.panel, fields.length ? h("section", { class: "wie-meta" }, h("h4", null, t.details), fields) : null);
					this.doneBtn = h("button", {
						type: "button",
						class: "wie-btn wie-btn-primary",
						onclick: () => this.finish()
					}, t.done);
					this.cancelBtn = h("button", {
						type: "button",
						class: "wie-btn",
						onclick: () => this.close(null)
					}, t.cancel);
					this.dialog = h("div", {
						class: "wie-dialog",
						role: "dialog",
						"aria-modal": "true",
						"aria-label": o.title || t.title,
						tabindex: "-1"
					}, h("header", { class: "wie-head" }, h("span", { class: "wie-title" }, o.title || t.title), h("span", { class: "wie-file" }, o.name || ""), h("button", {
						type: "button",
						class: "wie-btn wie-btn-icon wie-btn-ghost wie-x",
						"aria-label": t.close,
						onclick: () => this.close(null),
						html: ICON.x
					})), this.stage, this.side, h("footer", { class: "wie-foot" }, this.cancelBtn, this.doneBtn));
					this.el = h("div", { class: "wie" }, this.dialog);
					doc().body.appendChild(this.el);
					this.onKey = (e) => {
						if (this.closed) return;
						if (e.key === "Escape") {
							e.preventDefault();
							e.stopImmediatePropagation();
							this.close(null);
						} else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
							e.preventDefault();
							this.finish();
						} else if (e.key === "Tab") this.trap(e);
					};
					doc().addEventListener("keydown", this.onKey, true);
					this.el.addEventListener("mousedown", (e) => {
						if (e.target === this.el) this._backdrop = true;
						else this._backdrop = false;
					});
					this.dialog.focus();
					if (!o.source) {
						this.metaOnly();
						return;
					}
					this.setStage("loading");
					loadSource(o.source, o.maxSide).then((src) => {
						if (this.closed) return;
						this.source = src.canvas;
						this.sourceType = src.type;
						if (!this.ext) this.ext = TYPE_EXT[src.type] || "";
						this.setStage(null);
						this.buildTabs();
						this.activate(this.exts[0]);
					}).catch((err) => {
						if (this.closed) return;
						console.error("[ImageEditor]", err);
						this.setStage("error");
						this.doneBtn.disabled = true;
					});
				}
				setStage(kind) {
					this.stageBox.innerHTML = "";
					if (kind === "loading") this.stageBox.append(h("div", { class: "wie-msg" }, h("div", { class: "wie-spin" }), this.t.loading));
					if (kind === "error") this.stageBox.append(h("div", {
						class: "wie-msg",
						role: "alert"
					}, this.t.loadError));
				}
				metaOnly() {
					this.stageBox.append(h("div", { class: "wie-msg" }, h("span", { html: ICON.file }), h("span", null, this.base + (this.ext ? "." + this.ext : ""))));
					this.tabs.style.display = "none";
					if (this.nameInput) this.nameInput.focus();
				}
				buildTabs() {
					this.tabs.innerHTML = "";
					if (this.exts.length < 2) {
						this.tabs.style.display = "none";
						return;
					}
					this.exts.forEach((e) => {
						e._tab = h("button", {
							type: "button",
							role: "tab",
							class: "wie-tab",
							onclick: () => this.activate(e),
							html: (e.icon || "") + "<span></span>"
						});
						e._tab.lastChild.textContent = this.o.texts && this.o.texts[e.name] || e.label || e.name;
						this.tabs.append(e._tab);
					});
				}
				ctxFor(e) {
					const self = this;
					return {
						editor: self,
						t: self.t,
						h,
						stage: self.stageBox,
						panel: self.panel,
						options: extOptions(e, self.o),
						get params() {
							return self.params[e.name];
						},
						set(patch) {
							Object.assign(self.params[e.name], patch);
							if (e.stage === "preview") self.renderPreview();
						},
						input: () => runPipeline(self.source, self.exts, self.params, self.o, e.order),
						width: self.source.width,
						height: self.source.height
					};
				}
				activate(e) {
					if (!e || this.closed) return;
					if (this.cleanup) {
						this.cleanup();
						this.cleanup = null;
					}
					this.stageBox.innerHTML = "";
					this.panel.innerHTML = "";
					this.active = e;
					this.exts.forEach((x) => {
						if (x._tab) {
							x._tab.classList.toggle("is-on", x === e);
							x._tab.setAttribute("aria-selected", x === e ? "true" : "false");
						}
					});
					const ctx = this.ctxFor(e);
					if (e.stage === "preview") this.renderPreview();
					this.cleanup = e.mount && e.mount(ctx) || null;
				}
				renderPreview() {
					const out = runPipeline(this.source, this.exts, this.params, this.o);
					let cv = this.stageBox.querySelector("canvas.wie-prev");
					if (!cv) {
						cv = h("canvas", { class: "wie-prev wie-cv" });
						this.stageBox.prepend(cv);
					}
					const sw = this.stage.clientWidth - 40, sh = this.stage.clientHeight - 40;
					const k = Math.min(1, sw / out.width, sh / out.height);
					cv.width = Math.max(1, Math.round(out.width * k));
					cv.height = Math.max(1, Math.round(out.height * k));
					const x = cv.getContext("2d");
					x.imageSmoothingQuality = "high";
					x.drawImage(out, 0, 0, cv.width, cv.height);
				}
				changed() {
					if (!this.source) return false;
					let c = this.source;
					for (const e of this.exts) {
						const info = {
							width: c.width,
							height: c.height,
							options: extOptions(e, this.o)
						};
						if (e.isDefault && e.isDefault(this.params[e.name], info)) continue;
						return true;
					}
					return false;
				}
				async finish() {
					if (this.closed || this.busy) return;
					this.busy = true;
					this.doneBtn.disabled = true;
					this.doneBtn.textContent = this.t.saving;
					try {
						const out = {
							changed: false,
							blob: null,
							params: clone(this.params),
							width: 0,
							height: 0,
							type: this.sourceType || ""
						};
						if (this.source) {
							out.width = this.source.width;
							out.height = this.source.height;
							out.sourceWidth = this.source.width;
							out.sourceHeight = this.source.height;
							if (this.changed()) {
								const cfg = this.o.output || {};
								let c = runPipeline(this.source, this.exts, this.params, this.o);
								c = scaleDown(c, cfg.maxWidth, cfg.maxHeight);
								const type = pickType(this.sourceType, cfg.type);
								out.blob = await toBlob(c, type, cfg.quality == null ? .92 : cfg.quality);
								out.changed = true;
								out.type = out.blob.type || type;
								out.width = c.width;
								out.height = c.height;
								if (out.type !== this.sourceType && TYPE_EXT[out.type]) this.ext = TYPE_EXT[out.type];
							}
						}
						out.name = ((this.nameInput ? this.nameInput.value.trim() : this.base) || this.base || "file") + (this.ext ? "." + this.ext : "");
						out.alt = this.altInput ? this.altInput.value.trim() : this.alt;
						this.close(out);
					} catch (err) {
						console.error("[ImageEditor]", err);
						this.busy = false;
						this.doneBtn.disabled = false;
						this.doneBtn.textContent = this.t.done;
					}
				}
				trap(e) {
					const list = [].slice.call(this.dialog.querySelectorAll("button,input,textarea,select,[tabindex]:not([tabindex=\"-1\"])")).filter((x) => !x.disabled && x.offsetParent !== null);
					if (!list.length) return;
					const first = list[0], last = list[list.length - 1];
					if (e.shiftKey && (doc().activeElement === first || doc().activeElement === this.dialog)) {
						e.preventDefault();
						last.focus();
					} else if (!e.shiftKey && doc().activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
				close(result) {
					if (this.closed) return;
					this.closed = true;
					if (this.cleanup) {
						this.cleanup();
						this.cleanup = null;
					}
					doc().removeEventListener("keydown", this.onKey, true);
					doc().body.style.overflow = this.prevOverflow || "";
					const done = () => {
						if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
						if (this.prevFocus && this.prevFocus.focus) try {
							this.prevFocus.focus();
						} catch (e) {}
					};
					this.el.classList.add("is-out");
					setTimeout(done, this.o.animate === false ? 0 : 170);
					this.resolve(result);
				}
			}
			const ImageEditor = {
				version: "1.0.0",
				geometry: G,
				util: {
					splitName,
					pickType,
					TYPE_EXT,
					EXT_TYPE
				},
				extension,
				extensions: () => Object.keys(registry),
				open(options) {
					return new Promise((resolve) => new Editor(options || {}, resolve).start());
				},
				async render(source, params, output, options) {
					const o = Object.assign({}, options);
					const src = await loadSource(source, o.maxSide);
					const exts = resolveExts(o.extensions);
					let c = runPipeline(src.canvas, exts, params || {}, o);
					const cfg = output || {};
					c = scaleDown(c, cfg.maxWidth, cfg.maxHeight);
					return {
						canvas: c,
						type: src.type,
						width: c.width,
						height: c.height,
						sourceWidth: src.canvas.width,
						sourceHeight: src.canvas.height
					};
				},
				async process(source, params, output, options) {
					const r = await ImageEditor.render(source, params, output, options);
					const cfg = output || {};
					const type = pickType(r.type, cfg.type);
					const blob = await toBlob(r.canvas, type, cfg.quality == null ? .92 : cfg.quality);
					return {
						blob,
						type: blob.type || type,
						width: r.width,
						height: r.height,
						sourceType: r.type
					};
				}
			};
			root.ImageEditor = ImageEditor;
			if (typeof module !== "undefined" && module.exports) module.exports = ImageEditor;
		})(typeof window !== "undefined" ? window : globalThis);
	}));
	Object.defineProperty(exports, "default", {
		enumerable: true,
		get: function() {
			return require_wex_image_editor();
		}
	});
});
