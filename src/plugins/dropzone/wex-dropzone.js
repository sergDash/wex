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
    'use strict'

    const $ = global.jQuery
    const { component } = global.jqvm
    const doc = global.document

    // ---------------------------------------------------------------- опции

    const DEFAULTS = {
        tag: '',
        mode: 'upload',             // upload | form
        multiple: true,
        maxFiles: 0,                // 0: без лимита
        maxSize: 0,                 // байт на файл; 0: без лимита
        accept: '',                 // 'image/*,.pdf' или массив
        autoUpload: true,           // false: загрузка по api.upload()
        parallel: 3,                // одновременных загрузок
        blockSubmit: true,          // не отправлять форму, пока идёт загрузка
        reorder: true,              // перестановка перетаскиванием
        cardWidth: 150,             // минимальная ширина карточки, px
        thumbSize: 360,             // размер миниатюры, px
        upload: {
            url: '', method: 'POST', field: 'file', headers: {}, data: {}, withCredentials: false,
            parse: null,            // json => ({ id, url, ... })
            revert: null,           // '/api/upload/{id}' (DELETE) или item => Promise: убрать временный файл
            transport: null         // (file, ctx) => Promise<{ id, url }>; ctx: { item, progress(0..100), onAbort(fn) }
        },
        image: { maxWidth: 0, maxHeight: 0, quality: 0.9, type: 'auto' },   // сжатие новых картинок перед загрузкой
        editor: {
            enabled: true,
            mode: 'client',         // client: обрезанный файл уходит вместо оригинала; params: оригинал + параметры рамки
            extensions: ['crop'],
            meta: ['name', 'alt'],
            output: {},             // { type, quality, maxWidth, maxHeight } для обрезанного файла
            crop: {},               // опции расширения crop (aspects, aspect, lock)
            texts: {}
        },
        onInit: null,               // api => void, вызывается для каждого экземпляра
        texts: {
            title: 'Drop files here', titleSingle: 'Drop a file here', browse: 'browse',
            hint: 'or click to choose', hintDrop: 'Release to upload',
            limit: 'Limit reached', waiting: 'Waiting…', uploading: 'Uploading', ready: 'Ready',
            remove: 'Remove', cancel: 'Cancel upload', edit: 'Edit', retry: 'Retry',
            failed: 'Upload failed', waitUpload: 'Please wait until uploads finish',
            rejectType: n => n + ': this file type is not allowed',
            rejectSize: (n, max) => n + ': larger than ' + max,
            rejectMax: n => n + ': too many files',
            maxLine: n => 'up to ' + n + ' files', sizeLine: s => 'max ' + s + ' each',
            itemOf: (n, i, t) => n + ', ' + i + ' of ' + t
        }
    }

    function mergeOptions(user) {
        const o = Object.assign({}, DEFAULTS, user)
        ;['upload', 'image', 'editor', 'texts'].forEach(k => { o[k] = Object.assign({}, DEFAULTS[k], user[k]) })
        o.editor.texts = Object.assign({}, user.editor && user.editor.texts)
        if (o.mode === 'form') o.autoUpload = false
        return o
    }

    // ---------------------------------------------------------------- утилиты

    let uid = 0, keySeq = 0

    const EXT_TYPE = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', bmp: 'image/bmp', avif: 'image/avif', pdf: 'application/pdf', zip: 'application/zip' }
    const extOf = name => { const i = String(name || '').lastIndexOf('.'); return i > 0 ? name.slice(i + 1).toLowerCase() : '' }
    const baseName = u => decodeURIComponent(String(u || '').split('#')[0].split('?')[0].split('/').pop() || 'file')

    function fmtSize(n) {
        if (!n && n !== 0) return ''
        if (n < 1024) return n + ' B'
        if (n < 1048576) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB'
        return (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + ' MB'
    }

    function acceptOk(file, accept) {
        if (!accept || (Array.isArray(accept) && !accept.length)) return true
        const list = (Array.isArray(accept) ? accept : String(accept).split(',')).map(s => s.trim().toLowerCase()).filter(Boolean)
        const name = file.name.toLowerCase(), type = (file.type || '').toLowerCase()
        return list.some(a => a[0] === '.' ? name.endsWith(a) : a.slice(-2) === '/*' ? type.indexOf(a.slice(0, -1)) === 0 : type === a)
    }

    const isImageFile = (type, name) => /^image\//.test(type || '') || /^(jpe?g|png|webp|gif|bmp|avif|svg)$/.test(extOf(name))
    const isRaster = (type, name) => isImageFile(type, name) && type !== 'image/svg+xml' && extOf(name) !== 'svg'

    function toBlob(canvas, type, q) {
        return new Promise((res, rej) => canvas.toBlob(b => (b ? res(b) : rej(new Error('toBlob failed'))), type, q))
    }

    function csrfHeader() {
        const m = doc.querySelector('meta[name="csrf-token"]')
        return m ? { 'X-CSRF-TOKEN': m.getAttribute('content') } : {}
    }

    // ---------------------------------------------------------------- стили (один раз)

    const CSS = `
.wdz,.wdz-ghost{--wdz-accent:#3b82f6;--wdz-bg:#fff;--wdz-bd:#cbd5e1;--wdz-tx:#334155;--wdz-mu:#64748b;--wdz-sf:#f1f5f9;--wdz-fl:linear-gradient(135deg,#e2e8f0,#cbd5e1)}
.dark .wdz,.dark .wdz-ghost{--wdz-bg:#0f172a;--wdz-bd:#334155;--wdz-tx:#e2e8f0;--wdz-mu:#94a3b8;--wdz-sf:#1e293b;--wdz-fl:linear-gradient(135deg,#243049,#1b2437)}
.wdz{position:relative;font:14px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--wdz-tx)}
.wdz *,.wdz-ghost *{box-sizing:border-box}
.wdz-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:28px 16px;border:2px dashed var(--wdz-bd);border-radius:16px;background:var(--wdz-sf);cursor:pointer;text-align:center;outline:none;transition:border-color .2s,background .2s,transform .25s cubic-bezier(.2,.9,.3,1.3),padding .2s}
.wdz-drop:hover{border-color:var(--wdz-accent)}
.wdz-drop:focus-visible{box-shadow:0 0 0 3px rgba(59,130,246,.38);border-color:var(--wdz-accent)}
.wdz-drop.is-over{border-color:var(--wdz-accent);background:rgba(59,130,246,.1);transform:scale(1.012)}
.wdz-drop.has-items{padding:16px}
.wdz-drop.is-full,.wdz-drop.is-off{opacity:.55;cursor:not-allowed}
.wdz-ic{display:grid;place-items:center;width:46px;height:46px;margin-bottom:6px;border-radius:50%;background:rgba(59,130,246,.13);color:var(--wdz-accent);transition:transform .3s cubic-bezier(.2,.9,.3,1.5)}
.wdz-drop.is-over .wdz-ic{transform:translateY(-5px) scale(1.14)}
.wdz-drop.has-items .wdz-ic{width:34px;height:34px;margin-bottom:2px}
.wdz-t{font-weight:600}
.wdz-browse{color:var(--wdz-accent);text-decoration:underline;text-underline-offset:3px}
.wdz-s{font-size:12.5px;color:var(--wdz-mu)}
.wdz-notes{display:flex;flex-direction:column;gap:6px}
.wdz-note{margin-top:8px;padding:8px 12px;border-radius:10px;background:#fef2f2;color:#b91c1c;font-size:13px;animation:wdz-in .25s ease both}
.dark .wdz-note{background:#3b1317;color:#fca5a5}
.wdz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--wdz-cw,150px),1fr));gap:12px;margin-top:12px}
.wdz-card{position:relative;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:var(--wdz-fl);box-shadow:0 1px 3px rgba(15,23,42,.16),0 0 0 1px rgba(15,23,42,.06);cursor:grab;user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;animation:wdz-in .4s cubic-bezier(.2,.9,.3,1.2) both;transition:opacity .2s,box-shadow .2s}
.wdz-card:hover{box-shadow:0 6px 18px rgba(15,23,42,.2),0 0 0 1px rgba(15,23,42,.06)}
.wdz-card:focus-visible{box-shadow:0 0 0 3px rgba(59,130,246,.55)}
.wdz-card.is-leaving{animation:wdz-out .22s ease both;pointer-events:none}
.wdz-card.is-ghost{opacity:.3}
.wdz-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;animation:wdz-fade .4s ease both}
.wdz-file{position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--wdz-mu)}
.wdz-ext{padding:2px 8px;border-radius:6px;background:var(--wdz-mu);color:#fff;font-size:11px;font-weight:700;letter-spacing:.05em}
.wdz-bar{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;padding:26px 10px 8px;background:linear-gradient(to top,rgba(2,6,23,.8),rgba(2,6,23,0));color:#fff;pointer-events:none}
.wdz-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600}
.wdz-meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;opacity:.82}
.wdz-card.st-error .wdz-bar{background:linear-gradient(to top,rgba(185,28,28,.95),rgba(185,28,28,0))}
.wdz-card.st-error{box-shadow:0 0 0 2px #ef4444}
.wdz-ov{position:absolute;inset:0;display:grid;place-items:center;background:rgba(15,23,42,.45);opacity:0;pointer-events:none;transition:opacity .25s ease}
.wdz-ov.is-up{opacity:1}
.wdz-ov.is-done{background:rgba(22,163,74,.6);animation:wdz-ov-out 1.4s ease both}
.wdz-ring{position:absolute;width:58px;height:58px;transform:rotate(-90deg)}
.wdz-ring circle{fill:none;stroke-width:4}
.wdz-ring-bg{stroke:rgba(255,255,255,.28)}
.wdz-ring-fg{stroke:#fff;stroke-linecap:round;stroke-dasharray:125.66;transition:stroke-dashoffset .3s linear}
.wdz-pct{position:relative;color:#fff;font-size:12px;font-weight:700}
.wdz-check{position:absolute;width:52px;height:52px;fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;opacity:0}
.wdz-ov.is-done .wdz-check{opacity:1;animation:wdz-draw .5s .12s ease forwards}
.wdz-ov:not(.is-up) .wdz-ring,.wdz-ov:not(.is-up) .wdz-pct{display:none}
.wdz-btn{position:absolute;top:8px;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:rgba(15,23,42,.66);color:#fff;cursor:pointer;opacity:0;transform:scale(.8);transition:opacity .15s,transform .15s,background .15s;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
.wdz-card:hover .wdz-btn,.wdz-card:focus-within .wdz-btn,.wdz-card:focus .wdz-btn{opacity:1;transform:none}
@media (hover:none){.wdz-btn{opacity:1;transform:none}}
.wdz-btn:hover{background:rgba(15,23,42,.9)}
.wdz-rm{left:8px}.wdz-rm:hover{background:#dc2626}
.wdz-ed,.wdz-retry{right:8px}
.wdz-btn:focus-visible{outline:2px solid #fff;outline-offset:1px}
.wdz.is-off .wdz-btn{display:none}
.wdz-ghost{position:fixed;z-index:100001;margin:0;pointer-events:none;border-radius:14px;overflow:hidden;box-shadow:0 20px 44px rgba(2,6,23,.38);opacity:.96;animation:none!important;transform:rotate(2.5deg) scale(1.05)}
.wdz-ghost .wdz-btn,.wdz-ghost .wdz-ov{display:none}
.wdz-ind{position:fixed;z-index:100001;width:4px;border-radius:2px;background:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,.22);pointer-events:none;transition:left .09s,top .09s,height .09s}
@keyframes wdz-in{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}
@keyframes wdz-out{to{opacity:0;transform:scale(.8)}}
@keyframes wdz-fade{from{opacity:0}to{opacity:1}}
@keyframes wdz-draw{to{stroke-dashoffset:0}}
@keyframes wdz-ov-out{0%{opacity:0}14%{opacity:1}68%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.wdz *{animation-duration:.01s!important;transition-duration:.01s!important}}
`

    function injectCss() {
        if (doc.getElementById('wdz-css')) return
        const s = doc.createElement('style')
        s.id = 'wdz-css'
        s.textContent = CSS
        doc.head.appendChild(s)
    }

    const I = {
        up: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5"/><path d="m7 9 5-5 5 5"/><path d="M5 19h14"/></svg>',
        x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
        edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
        retry: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',
        file: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'
    }

    // ---------------------------------------------------------------- шаблон

    const TEMPLATE = `<template>
<div class="wdz {{rootCls}}" data-dz="{{uid}}" style="--wdz-cw:{{cardW}}px">
  <div class="wdz-drop {{dropCls}}" role="button" tabindex="0" aria-disabled="{{ariaOff}}" aria-label="{{titleText}}" style="display:{{dropShow}}">
    <span class="wdz-ic">${I.up}</span>
    <span class="wdz-t">{{ titleText }} <span class="wdz-browse">{{ browseText }}</span></span>
    <span class="wdz-s">{{ hintText }}</span>
  </div>
  <div class="wdz-notes" role="status" aria-live="polite"><div w-for="n in notes traceby n.id" class="wdz-note">{{ n.text }}</div></div>
  <div class="wdz-grid" role="list" style="display:{{gridShow}}">
    <div w-for="c in cards traceby c.key" id="{{c.id}}" class="wdz-card {{c.cls}}" data-key="{{c.key}}" role="listitem" tabindex="0" aria-label="{{c.label}}">
      <img class="wdz-img" w-src="c.thumb" alt="{{c.alt}}" draggable="false" style="display:{{c.showImg}}">
      <div class="wdz-file" style="display:{{c.showFile}}">${I.file}<span class="wdz-ext">{{ c.ext }}</span></div>
      <div class="wdz-bar"><span class="wdz-name">{{ c.name }}</span><span class="wdz-meta">{{ c.meta }}</span></div>
      <div class="wdz-ov {{c.ovCls}}">
        <svg class="wdz-ring" viewBox="0 0 48 48"><circle class="wdz-ring-bg" cx="24" cy="24" r="20"/><circle class="wdz-ring-fg" cx="24" cy="24" r="20" style="stroke-dashoffset:{{c.dash}}"/></svg>
        <span class="wdz-pct">{{ c.pct }}</span>
        <svg class="wdz-check" viewBox="0 0 48 48"><path d="M13 25l8 8 14-17"/></svg>
      </div>
      <button type="button" class="wdz-btn wdz-rm" data-key="{{c.key}}" aria-label="{{c.rmLabel}}" title="{{c.rmLabel}}">${I.x}</button>
      <button type="button" class="wdz-btn wdz-ed" data-key="{{c.key}}" aria-label="{{c.edLabel}}" title="{{c.edLabel}}" style="display:{{c.showEdit}}">${I.edit}</button>
      <button type="button" class="wdz-btn wdz-retry" data-key="{{c.key}}" aria-label="{{c.rtLabel}}" title="{{c.rtLabel}}" style="display:{{c.showRetry}}">${I.retry}</button>
    </div>
  </div>
  <div style="display:none"><input type="file" class="wdz-fi" multiple name="{{fileName}}" tabindex="-1" aria-hidden="true"></div>
  <div style="display:none"><input w-for="h in hidden traceby h.key" type="hidden" name="{{h.name}}" value="{{h.value}}"></div>
</div>
</template>`

    // ---------------------------------------------------------------- фабрика

    function createDropzone(user) {
        const o = mergeOptions(user || {})
        const T = o.texts
        injectCss()
        const rt = new Map()                 // uid -> всё, что не должно быть реактивным (File, xhr, таймеры, слушатели)
        const IE = () => global.ImageEditor || null

        function bind(state, view) {
            let r = rt.get(state.uid)
            if (!r) {
                r = { view: null, files: new Map(), thumbs: new Map(), queue: [], active: 0, busy: false, timers: new Set(), off: [], flip: null, over: 0, picker: null, fileSig: '' }
                rt.set(state.uid, r)
            }
            if (view) r.view = view
            return r
        }
        const rtOf = state => rt.get(state.uid) || bind(state)
        const emit = (state, ev, ...args) => { const r = rt.get(state.uid); if (r && r.view && r.view.emit) r.view.emit(ev, ...args) }
        const qroot = state => doc.querySelector('[data-dz="' + state.uid + '"]')
        const later = (state, fn, ms) => { const r = rtOf(state); const id = setTimeout(() => { r.timers.delete(id); fn() }, ms); r.timers.add(id); return id }
        const find = (state, key) => state.items.find(i => i.key === key)
        const visible = state => state.items.filter(i => !i.leaving)

        function release(state) {
            const r = rt.get(state.uid)
            if (!r) return
            r.timers.forEach(clearTimeout)
            r.files.forEach(f => { if (f.abort) { try { f.abort() } catch (e) { /* уже завершён */ } } })
            r.thumbs.forEach(u => URL.revokeObjectURL(u))
            r.off.splice(0).forEach(f => f())
            if (r.picker && r.picker.parentNode) r.picker.parentNode.removeChild(r.picker)
            rt.delete(state.uid)
        }

        // ---- публичный вид элемента
        function flatCrop(c) { return c || null }
        function pub(state, it) {
            const f = rtOf(state).files.get(it.key)
            const out = { key: it.key, id: it.id, url: it.url, name: it.name, alt: it.alt, size: it.size, type: it.type, status: it.status, isNew: !!it.isNew, crop: flatCrop(it.cropParams) }
            if (o.mode === 'form' && f && it.isNew) out.file = f.file
            return out
        }
        const isFinal = it => it.status === 'done' || it.status === 'existing' || it.status === 'ready'
        const emitChange = state => {
            const list = visible(state).filter(isFinal).map(i => pub(state, i))
            emit(state, 'change', o.multiple ? list : (list[0] || null))
        }

        // ---- производное состояние (то, что шаблон посчитать не может)
        function hiddenFields(state) {
            const nm = state.name
            if (!nm) return []
            const out = []
            const push = (k, name, value) => out.push({ key: k, name, value: value == null ? '' : String(value) })
            const list = visible(state)
            if (o.mode === 'form') {
                let i = 0, fi = 0
                list.forEach(it => {
                    if (it.status !== 'ready' && it.status !== 'existing') return
                    const b = nm + '_items[' + i + ']'
                    push(it.key + ':id', b + '[id]', it.isNew ? '' : it.id)
                    push(it.key + ':name', b + '[name]', it.name)
                    push(it.key + ':alt', b + '[alt]', it.alt)
                    if (it.cropParams) push(it.key + ':crop', b + '[crop]', JSON.stringify(it.cropParams))
                    push(it.key + ':file', b + '[file]', it.isNew ? fi++ : '')
                    i++
                })
                return out
            }
            let i = 0
            list.forEach(it => {
                if (it.status !== 'done' && it.status !== 'existing') return
                const b = o.multiple ? nm + '[' + i + ']' : nm
                push(it.key + ':id', b + '[id]', it.id)
                push(it.key + ':name', b + '[name]', it.name)
                push(it.key + ':alt', b + '[alt]', it.alt)
                if (it.cropParams) push(it.key + ':crop', b + '[crop]', JSON.stringify(it.cropParams))
                i++
            })
            return out
        }

        function syncFormFiles(state) {
            if (o.mode !== 'form') return
            const r = rtOf(state)
            const files = []
            visible(state).forEach(it => { if (it.status === 'ready' && it.isNew) { const f = r.files.get(it.key); if (f) files.push(f.file) } })
            const sig = files.map(f => f.name + ':' + f.size + ':' + f.lastModified).join('|')
            if (sig === r.fileSig) return
            r.fileSig = sig
            const root = qroot(state)
            const fi = root && root.querySelector('.wdz-fi')
            if (!fi) return
            try {
                const dt = new DataTransfer()
                files.forEach(f => dt.items.add(f))
                fi.files = dt.files
            } catch (e) { console.warn('[wex-dropzone] DataTransfer is not supported, form mode needs a modern browser') }
        }

        const canEdit = (state, it) => {
            if (state.disabled || !o.editor.enabled || !IE()) return false
            if (!(it.status === 'done' || it.status === 'existing' || it.status === 'ready' || it.status === 'pending')) return false
            if (isRaster(it.type, it.name)) return true
            return o.editor.meta.indexOf('name') > -1
        }

        function card(state, it) {
            const st = it.status
            const up = st === 'uploading' || st === 'queued'
            const pct = st === 'queued' ? 0 : Math.round(it.progress || 0)
            let meta = fmtSize(it.size)
            if (st === 'queued') meta = T.waiting
            else if (st === 'uploading') meta = T.uploading + ' ' + pct + '%'
            else if (st === 'error') meta = it.error || T.failed
            else if (st === 'pending') meta = T.ready + (meta ? ' · ' + meta : '')
            const total = state.items.length
            return {
                key: it.key, id: 'wdz-' + state.uid + '-' + it.key, name: it.name, alt: it.alt || it.name,
                ext: (extOf(it.name) || 'file').slice(0, 4).toUpperCase(),
                thumb: it.thumb || null, showImg: it.thumb ? 'block' : 'none', showFile: it.thumb ? 'none' : 'flex',
                cls: 'st-' + st + (it.leaving ? ' is-leaving' : '') + (state.dragKey === it.key ? ' is-ghost' : ''),
                ovCls: up ? 'is-up' : (st === 'done' ? 'is-done' : ''),
                dash: (125.66 * (1 - pct / 100)).toFixed(2), pct: up ? (st === 'queued' ? '…' : pct + '%') : '',
                meta, showEdit: canEdit(state, it) ? 'grid' : 'none', showRetry: st === 'error' ? 'grid' : 'none',
                rmLabel: up ? T.cancel : T.remove, edLabel: T.edit, rtLabel: T.retry,
                label: T.itemOf(it.name, state.items.indexOf(it) + 1, total)
            }
        }

        function refresh(state) {
            const r = rtOf(state)
            const vis = visible(state)
            const full = !!(o.multiple && o.maxFiles && vis.length >= o.maxFiles)
            state.cards = state.items.map(it => card(state, it))
            state.hidden = hiddenFields(state)
            state.fileName = o.mode === 'form' && state.name ? state.name + (o.multiple ? '[]' : '') : ''
            state.gridShow = state.items.length ? 'grid' : 'none'
            state.dropShow = !o.multiple && vis.length ? 'none' : 'flex'
            state.dropCls = (state.over ? 'is-over' : '') + (full ? ' is-full' : '') + (state.disabled ? ' is-off' : '') + (vis.length ? ' has-items' : '')
            state.rootCls = (state.disabled ? 'is-off' : '')
            state.ariaOff = state.disabled || full ? 'true' : 'false'
            state.titleText = state.label || (o.multiple ? T.title : T.titleSingle)
            state.browseText = full ? '' : T.browse
            const bits = []
            if (full) bits.push(T.limit)
            else bits.push(state.over ? T.hintDrop : (state.hint || T.hint))
            if (!state.over && !full && !state.hint) {
                if (o.maxFiles && o.multiple) bits.push(T.maxLine(o.maxFiles))
                if (o.maxSize) bits.push(T.sizeLine(fmtSize(o.maxSize)))
            }
            state.hintText = bits.join(' · ')
            state.cardW = o.cardWidth
            syncFormFiles(state)

            const busy = state.items.some(i => i.status === 'queued' || i.status === 'uploading')
            if (busy !== r.busy) { r.busy = busy; emit(state, 'uploading', busy) }
        }

        // ---- FLIP: плавное смещение соседей при удалении и перестановке
        function snapshot(state) {
            const root = qroot(state)
            if (!root) return
            const m = new Map()
            root.querySelectorAll('.wdz-card').forEach(el => m.set(el.getAttribute('data-key'), el.getBoundingClientRect()))
            const r = rtOf(state)
            r.flip = m
            later(state, () => { if (r.flip === m) r.flip = null }, 600)
        }

        function flip(state) {
            const r = rt.get(state.uid)
            if (!r || !r.flip) return
            const m = r.flip
            r.flip = null
            const root = qroot(state)
            if (!root) return
            root.querySelectorAll('.wdz-card').forEach(el => {
                const old = m.get(el.getAttribute('data-key'))
                if (!old || !el.animate) return
                const nw = el.getBoundingClientRect()
                const dx = old.left - nw.left, dy = old.top - nw.top
                if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
                el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' })
            })
        }

        function shake(state, key) {
            const root = qroot(state)
            const el = root && root.querySelector('.wdz-card[data-key="' + key + '"]')
            if (el && el.animate) el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 380, easing: 'ease-out' })
        }

        function note(state, text) {
            const id = ++keySeq
            state.notes.push({ id, text })
            later(state, () => { const i = state.notes.findIndex(n => n.id === id); if (i > -1) state.notes.splice(i, 1) }, 5500)
        }

        // ---- миниатюры
        async function makeThumb(source, params, size) {
            const ie = IE()
            if (!ie) return null
            const res = await ie.process(source, params || {}, { maxWidth: size, maxHeight: size, type: 'image/jpeg', quality: 0.82 }, { maxSide: params ? 8192 : 2048, extensions: o.editor.extensions })
            return URL.createObjectURL(res.blob)
        }

        function setThumb(state, it, url) {
            const r = rtOf(state)
            const old = r.thumbs.get(it.key)
            if (old && old !== url) URL.revokeObjectURL(old)
            if (url && /^blob:/.test(url)) r.thumbs.set(it.key, url)
            it.thumb = url
            refresh(state)
        }

        function buildThumb(state, it, source, params) {
            if (!isImageFile(it.type, it.name)) return
            const done = url => { if (url && state.items.indexOf(it) > -1 && !rt.get(state.uid)) URL.revokeObjectURL(url); else if (url && find(state, it.key)) setThumb(state, it, url); else if (url) URL.revokeObjectURL(url) }
            if (!isRaster(it.type, it.name) || !IE()) {
                const u = source instanceof Blob ? URL.createObjectURL(source) : source
                done(u)
                return
            }
            makeThumb(source, params, o.thumbSize).then(done).catch(err => {
                console.warn('[wex-dropzone] thumbnail failed', err)
                if (source instanceof Blob) done(URL.createObjectURL(source)); else if (typeof source === 'string') setThumb(state, it, source)
            })
        }

        // ---- добавление файлов
        function reject(state, file, reason, text) {
            note(state, text)
            emit(state, 'reject', { file, reason, message: text })
        }

        function addFiles(state, view, list) {
            bind(state, view)
            if (state.disabled) return
            let files = [].slice.call(list || [])
            if (!files.length) return
            if (!o.multiple) files = files.slice(0, 1)

            const ok = []
            files.forEach(file => {
                if (!acceptOk(file, o.accept)) return reject(state, file, 'type', T.rejectType(file.name))
                if (o.maxSize && file.size > o.maxSize) return reject(state, file, 'size', T.rejectSize(file.name, fmtSize(o.maxSize)))
                ok.push(file)
            })
            if (!ok.length) return

            let take = ok
            if (o.multiple && o.maxFiles) {
                const room = Math.max(0, o.maxFiles - visible(state).length)
                take = ok.slice(0, room)
                ok.slice(room).forEach(file => reject(state, file, 'max', T.rejectMax(file.name)))
            }
            if (!take.length) return

            if (!o.multiple) visible(state).slice().forEach(it => removeItem(state, it.key, true))

            take.forEach(file => {
                const type = file.type || EXT_TYPE[extOf(file.name)] || ''
                const it = { key: 'k' + (++keySeq), id: '', name: file.name, size: file.size, type, isImage: isImageFile(type, file.name), status: 'preparing', progress: 0, thumb: null, url: '', alt: '', error: '', leaving: false, isNew: true, cropParams: null }
                rtOf(state).files.set(it.key, { file, orig: file, params: null, token: 0, abort: null })
                state.items.push(it)
                const live = state.items[state.items.length - 1]
                emit(state, 'add', pub(state, live))
                buildThumb(state, live, file, null)
                prepare(state, live)
            })
            refresh(state)
        }

        // сжатие картинки перед загрузкой (если задано)
        async function prepare(state, it) {
            const r = rtOf(state)
            const f = r.files.get(it.key)
            const cfg = o.image
            try {
                if (IE() && isRaster(it.type, it.name) && extOf(it.name) !== 'gif' && (cfg.maxWidth || cfg.maxHeight)) {
                    const res = await IE().render(f.file, {}, { maxWidth: cfg.maxWidth, maxHeight: cfg.maxHeight }, { extensions: [] })
                    if (res.width !== res.sourceWidth || res.height !== res.sourceHeight) {
                        const type = IE().util.pickType(f.file.type, cfg.type)
                        const blob = await toBlob(res.canvas, type, cfg.quality)
                        f.file = new File([blob], f.file.name, { type: blob.type || type })
                        it.size = f.file.size
                        it.type = f.file.type
                    }
                }
            } catch (err) { console.warn('[wex-dropzone] resize skipped', err) }
            if (!find(state, it.key) || it.leaving) return
            if (o.mode === 'form') it.status = 'ready'
            else if (o.autoUpload) { it.status = 'queued'; r.queue.push(it.key) }
            else it.status = 'pending'
            refresh(state)
            if (o.mode === 'form') emitChange(state)
            pump(state)
        }

        // ---- загрузка
        function pump(state) {
            const r = rt.get(state.uid)
            if (!r) return
            while (r.active < o.parallel && r.queue.length) {
                const key = r.queue.shift()
                const it = find(state, key)
                if (it && !it.leaving && it.status === 'queued') start(state, it)
            }
        }

        function xhrSend(file, ctx) {
            const u = o.upload
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open(u.method || 'POST', u.url)
                xhr.withCredentials = !!u.withCredentials
                const headers = Object.assign({ Accept: 'application/json' }, csrfHeader(), u.headers)
                Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]))
                const fd = new FormData()
                const data = typeof u.data === 'function' ? u.data(file) : u.data
                Object.keys(data || {}).forEach(k => fd.append(k, data[k]))
                fd.append(u.field || 'file', file, file.name)
                xhr.upload.onprogress = e => { if (e.lengthComputable) ctx.progress(e.loaded / e.total * 100) }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let json = null
                        try { json = JSON.parse(xhr.responseText) } catch (e) { /* ответ не JSON */ }
                        resolve(json)
                    } else {
                        let msg = 'HTTP ' + xhr.status
                        try { const j = JSON.parse(xhr.responseText); if (j && (j.message || j.error)) msg = String(j.message || j.error) } catch (e) { /* не JSON */ }
                        reject(new Error(msg))
                    }
                }
                xhr.onerror = () => reject(new Error('Network error'))
                xhr.onabort = () => reject(Object.assign(new Error('aborted'), { aborted: true }))
                ctx.onAbort(() => xhr.abort())
                xhr.send(fd)
            })
        }

        function start(state, it) {
            const r = rtOf(state)
            const f = r.files.get(it.key)
            if (!f) return
            r.active++
            it.status = 'uploading'
            it.progress = 0
            it.error = ''
            const token = ++f.token
            refresh(state)
            const ctx = {
                item: pub(state, it),
                progress: p => { if (f.token === token && find(state, it.key)) { it.progress = Math.max(0, Math.min(100, p)); refresh(state) } },
                onAbort: fn => { f.abort = fn }
            }
            const send = o.upload.transport ? o.upload.transport(f.file, ctx) : xhrSend(f.file, ctx)
            Promise.resolve(send).then(json => {
                if (f.token !== token) return
                r.active--
                f.abort = null
                let res = o.upload.parse ? o.upload.parse(json) : (json && json.data && typeof json.data === 'object' && !Array.isArray(json.data) ? json.data : json)
                if (!res || res.id == null || res.id === '') throw new Error('The server response has no id')
                it.id = String(res.id)
                if (res.url) it.url = res.url
                it.progress = 100
                it.status = 'done'
                refresh(state)
                emit(state, 'done', pub(state, it))
                emitChange(state)
                pump(state)
            }).catch(err => {
                if (f.token !== token || (err && err.aborted)) return
                r.active--
                f.abort = null
                it.status = 'error'
                it.error = (err && err.message) ? String(err.message).slice(0, 80) : T.failed
                refresh(state)
                later(state, () => shake(state, it.key), 30)
                emit(state, 'error', pub(state, it), it.error)
                pump(state)
            })
        }

        function retry(state, key) {
            const it = find(state, key)
            if (!it || it.status !== 'error') return
            it.status = 'queued'
            rtOf(state).queue.push(key)
            refresh(state)
            pump(state)
        }

        function uploadPending(state) {
            const r = rtOf(state)
            state.items.forEach(it => { if (it.status === 'pending') { it.status = 'queued'; r.queue.push(it.key) } })
            refresh(state)
            pump(state)
        }

        function revert(state, it) {
            const rv = o.upload.revert
            if (!rv || !it.isNew || !it.id) return
            try {
                if (typeof rv === 'function') {
                    Promise.resolve(rv(pub(state, it))).catch(e => console.warn('[wex-dropzone] revert failed', e))
                } else {
                    const xhr = new XMLHttpRequest()
                    xhr.open('DELETE', String(rv).replace(/\{id\}/g, encodeURIComponent(it.id)))
                    const h = Object.assign({ Accept: 'application/json' }, csrfHeader(), o.upload.headers)
                    Object.keys(h).forEach(k => xhr.setRequestHeader(k, h[k]))
                    xhr.withCredentials = !!o.upload.withCredentials
                    xhr.send()
                }
            } catch (e) { console.warn('[wex-dropzone] revert failed', e) }
        }

        // ---- удаление
        function removeItem(state, key, instant) {
            const r = rtOf(state)
            const it = find(state, key)
            if (!it || it.leaving) return
            const f = r.files.get(key)
            if (it.status === 'uploading' && f) {
                f.token++
                r.active = Math.max(0, r.active - 1)
                if (f.abort) { try { f.abort() } catch (e) { /* уже завершён */ } }
            }
            const qi = r.queue.indexOf(key)
            if (qi > -1) r.queue.splice(qi, 1)
            revert(state, it)
            const snap = pub(state, it)
            const finish = () => {
                if (!rt.get(state.uid)) return
                snapshot(state)
                const i = state.items.findIndex(x => x.key === key)
                if (i > -1) state.items.splice(i, 1)
                r.files.delete(key)
                const u = r.thumbs.get(key)
                if (u) { URL.revokeObjectURL(u); r.thumbs.delete(key) }
                refresh(state)
                emitChange(state)
                pump(state)
            }
            emit(state, 'remove', snap)
            if (instant) { finish(); return }
            it.leaving = true
            refresh(state)
            later(state, finish, 230)
        }

        // ---- редактор
        function toParams(flat) {
            if (!flat) return null
            return { crop: { rotate: flat.rotate || 0, rect: { x: flat.x, y: flat.y, w: flat.width, h: flat.height }, aspect: flat.aspect } }
        }

        function fromResult(res) {
            const c = res.params && res.params.crop
            if (!c || !res.changed) return null
            const swap = (c.rotate % 180) !== 0
            const bw = swap ? res.sourceHeight : res.sourceWidth, bh = swap ? res.sourceWidth : res.sourceHeight
            const r = c.rect || { x: 0, y: 0, w: bw, h: bh }
            return { rotate: c.rotate || 0, x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.w), height: Math.round(r.h), sourceWidth: res.sourceWidth, sourceHeight: res.sourceHeight, aspect: c.aspect }
        }

        async function edit(state, view, key) {
            bind(state, view)
            const it = find(state, key)
            if (!it || it.leaving || !canEdit(state, it)) return
            const r = rtOf(state)
            const f = r.files.get(key)
            const raster = isRaster(it.type, it.name)
            let source = null, params = null
            if (raster) {
                if (f) { source = f.orig || f.file; params = f.params }
                else { source = it.origUrl || it.url; params = toParams(it.cropParams) }
                if (!f && it.cropParams && it.origUrl) params = toParams(it.cropParams)
            }
            const root = qroot(state)
            const ed = o.editor
            const res = await IE().open({
                source, name: it.name, alt: it.alt, params,
                meta: source ? ed.meta : ed.meta.filter(m => m === 'name'),
                extensions: ed.extensions, output: ed.output, crop: ed.crop, texts: ed.texts, title: it.name
            })
            if (!res || !find(state, key) || rt.get(state.uid) !== r) return

            it.name = res.name
            it.alt = res.alt
            let reupload = false

            if (raster && source) {
                if (o.editor.mode === 'params') {
                    const flat = fromResult(res)
                    const before = JSON.stringify(it.cropParams)
                    it.cropParams = flat
                    if (JSON.stringify(flat) !== before) {
                        if (f) f.params = res.params
                        const base = f ? f.orig || f.file : (it.origUrl || it.url)
                        if (!it.origUrl && !f) it.origUrl = it.url
                        buildThumb(state, it, base, flat ? toParams(flat) : null)
                    }
                } else if (res.changed || (f && f.orig && f.file !== f.orig)) {
                    const blob = res.changed ? res.blob : f.orig
                    const file = new File([blob], it.name, { type: blob.type || it.type })
                    if (it.isNew && it.id) revert(state, it)
                    let entry = f
                    if (!entry) { entry = { file, orig: null, params: null, token: 0, abort: null }; r.files.set(key, entry) }
                    entry.file = file
                    entry.params = res.changed ? res.params : null
                    it.size = file.size
                    it.type = file.type
                    it.isNew = true
                    it.id = ''
                    it.url = ''
                    it.cropParams = null
                    buildThumb(state, it, file, null)
                    reupload = true
                }
            }

            if (reupload) {
                if (o.mode === 'form') it.status = 'ready'
                else { it.status = 'queued'; r.queue.push(key) }
            }
            refresh(state)
            emitChange(state)
            pump(state)
        }

        // ---- перестановка
        function moveItem(state, from, to) {
            if (from === to || from < 0 || to < 0 || to >= state.items.length) return
            snapshot(state)
            const [x] = state.items.splice(from, 1)
            state.items.splice(to, 0, x)
            refresh(state)
            emitChange(state)
        }

        function dragGesture(state, e) {
            const cardEl = e.currentTarget
            const key = cardEl.getAttribute('data-key')
            const sx = e.clientX, sy = e.clientY
            let ghost = null, ind = null, dragging = false, insert = -1, offX = 0, offY = 0

            const targetAt = (px, py) => {
                const root = qroot(state)
                const els = [].slice.call(root.querySelectorAll('.wdz-card')).filter(el => !el.classList.contains('is-leaving'))
                let best = null, bestD = Infinity
                els.forEach(el => {
                    const b = el.getBoundingClientRect()
                    const inside = px >= b.left && px <= b.right && py >= b.top && py <= b.bottom
                    const d = inside ? 0 : Math.hypot(px - (b.left + b.width / 2), py - (b.top + b.height / 2))
                    if (d < bestD) { bestD = d; best = { el, b } }
                })
                return best
            }

            const move = ev => {
                if (!dragging) {
                    if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return
                    dragging = true
                    const b = cardEl.getBoundingClientRect()
                    offX = sx - b.left; offY = sy - b.top
                    ghost = cardEl.cloneNode(true)
                    ghost.removeAttribute('id')
                    ghost.classList.add('wdz-ghost')
                    ghost.classList.remove('is-ghost')
                    ghost.style.width = b.width + 'px'; ghost.style.height = b.height + 'px'
                    doc.body.appendChild(ghost)
                    ind = doc.createElement('div')
                    ind.className = 'wdz-ind'
                    ind.style.display = 'none'
                    doc.body.appendChild(ind)
                    state.dragKey = key
                    refresh(state)
                    doc.body.style.cursor = 'grabbing'
                }
                ghost.style.left = (ev.clientX - offX) + 'px'
                ghost.style.top = (ev.clientY - offY) + 'px'
                const t = targetAt(ev.clientX, ev.clientY)
                if (!t) return
                const tk = t.el.getAttribute('data-key')
                const ti = state.items.findIndex(i => i.key === tk)
                const fi = state.items.findIndex(i => i.key === key)
                if (tk === key) { insert = -1; ind.style.display = 'none'; return }
                const before = ev.clientX < t.b.left + t.b.width / 2
                insert = before ? ti : ti + 1
                if (fi < insert) insert--
                if (insert === fi) { insert = -1; ind.style.display = 'none'; return }
                ind.style.display = 'block'
                ind.style.left = ((before ? t.b.left - 8 : t.b.right + 6)) + 'px'
                ind.style.top = t.b.top + 'px'
                ind.style.height = t.b.height + 'px'
            }

            const up = () => {
                global.removeEventListener('pointermove', move)
                global.removeEventListener('pointerup', up)
                global.removeEventListener('pointercancel', up)
                if (!dragging) return
                doc.body.style.cursor = ''
                if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost)
                if (ind && ind.parentNode) ind.parentNode.removeChild(ind)
                state.dragKey = null
                const fi = state.items.findIndex(i => i.key === key)
                if (insert > -1) moveItem(state, fi, insert); else refresh(state)
                const eat = ev => { ev.stopPropagation(); ev.preventDefault() }
                cardEl.addEventListener('click', eat, { capture: true, once: true })
                setTimeout(() => cardEl.removeEventListener('click', eat, true), 0)
            }
            global.addEventListener('pointermove', move)
            global.addEventListener('pointerup', up)
            global.addEventListener('pointercancel', up)
        }

        // ---- выбор файлов
        function openPicker(state, view) {
            bind(state, view)
            const r = rtOf(state)
            if (state.disabled) return
            if (o.multiple && o.maxFiles && visible(state).length >= o.maxFiles) return
            if (r.picker && r.picker.parentNode) r.picker.parentNode.removeChild(r.picker)
            const input = doc.createElement('input')
            input.type = 'file'
            input.multiple = !!o.multiple
            const acc = Array.isArray(o.accept) ? o.accept.join(',') : o.accept
            if (acc) input.accept = acc
            input.style.display = 'none'
            input.addEventListener('change', () => { addFiles(state, view, input.files); if (input.parentNode) input.parentNode.removeChild(input) })
            input.addEventListener('cancel', () => { if (input.parentNode) input.parentNode.removeChild(input) })
            doc.body.appendChild(input)
            r.picker = input
            input.click()
        }

        const hasFiles = e => { const dt = e.originalEvent && e.originalEvent.dataTransfer; return !!dt && [].slice.call(dt.types || []).indexOf('Files') > -1 }

        // ---- API для родителя (onInit)
        function makeApi(state, view) {
            return {
                get state() { return state },
                items: () => visible(state).map(i => pub(state, i)),
                files: () => visible(state).map(i => { const f = rtOf(state).files.get(i.key); return f ? f.file : null }).filter(Boolean),
                add: files => addFiles(state, view, files),
                upload: () => uploadPending(state),
                retry: key => retry(state, key),
                remove: key => removeItem(state, key),
                clear: () => visible(state).slice().forEach(i => removeItem(state, i.key, true)),
                edit: key => edit(state, view, key),
                busy: () => state.items.some(i => i.status === 'queued' || i.status === 'uploading'),
                browse: () => openPicker(state, view)
            }
        }

        // ---- компонент
        const view = $(TEMPLATE)
            .state(() => ({
                // props
                name: '', value: null, disabled: false, label: '', hint: '',
                // данные
                uid: ++uid, items: [], notes: [], over: false, dragKey: null,
                // производное
                cards: [], hidden: [], fileName: '', gridShow: 'none', dropShow: 'flex', dropCls: '', rootCls: '', ariaOff: 'false',
                titleText: '', browseText: '', hintText: '', cardW: 150
            }))

            .on('$mount', function (state) {
                const v = this
                const r = bind(state, v)
                const list = state.value == null || state.value === '' ? [] : (typeof state.value === 'string' ? (() => { try { return JSON.parse(state.value) } catch (e) { console.warn('[wex-dropzone] value must be an array of objects or a JSON string'); return [] } })() : state.value)
                ;[].concat(list).forEach(x => {
                    if (!x || typeof x !== 'object') return
                    const name = x.name || baseName(x.url)
                    const type = x.type || EXT_TYPE[extOf(name)] || ''
                    const it = { key: 'k' + (++keySeq), id: x.id == null ? '' : String(x.id), name, size: x.size == null ? null : x.size, type, isImage: isImageFile(type, name), status: 'existing', progress: 100, thumb: null, url: x.url || '', origUrl: '', alt: x.alt || '', error: '', leaving: false, isNew: false, cropParams: x.crop || null }
                    state.items.push(it)
                })
                if (!o.multiple) state.items.splice(1)
                refresh(state)
                // миниатюры существующих файлов: готовый thumb, иначе сам url; для params-режима с рамкой строим вырезку
                state.items.forEach(it => {
                    const src = [].concat(list).find(x => x && (String(x.id) === it.id) && (x.url || '') === it.url) || {}
                    if (!it.isImage) return
                    if (src.thumb) { setThumb(state, it, src.thumb); return }
                    if (it.cropParams && it.url && IE() && isRaster(it.type, it.name)) { it.origUrl = it.url; buildThumb(state, it, it.url, toParams(it.cropParams)); return }
                    if (it.url) setThumb(state, it, it.url)
                })
                // блокировка отправки формы, пока идёт загрузка
                later(state, () => {
                    const root = qroot(state)
                    const form = root && root.closest('form')
                    if (form && o.blockSubmit) {
                        const guard = e => {
                            if (state.items.some(i => i.status === 'queued' || i.status === 'uploading')) {
                                e.preventDefault(); e.stopImmediatePropagation()
                                note(state, T.waitUpload)
                                emit(state, 'blocked')
                            }
                        }
                        form.addEventListener('submit', guard, true)
                        r.off.push(() => form.removeEventListener('submit', guard, true))
                    }
                    if (o.onInit) o.onInit.call(v, makeApi(state, v))
                }, 0)
            })
            .on('$render', function (state) { flip(state) })
            .on('$unmount', function (state) { release(state) })
            .on('$destroy', function (state) { release(state) })

            // выбор файлов кликом и с клавиатуры
            .on('click', '.wdz-drop', function (state) {
                const v = this
                return function () { openPicker(state, v) }
            })
            .on('keydown', '.wdz-drop', function (state) {
                const v = this
                return function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(state, v) } }
            })

            // перетаскивание файлов в зону (на весь компонент)
            .on('dragenter', '.wdz', function (state) {
                const v = this
                return function (e) {
                    if (!hasFiles(e) || state.disabled) return
                    e.preventDefault()
                    bind(state, v).over++
                    if (!state.over) { state.over = true; refresh(state) }
                }
            })
            .on('dragover', '.wdz', function (state) {
                return function (e) {
                    if (!hasFiles(e) || state.disabled) return
                    e.preventDefault()
                    if (e.originalEvent.dataTransfer) e.originalEvent.dataTransfer.dropEffect = 'copy'
                }
            })
            .on('dragleave', '.wdz', function (state) {
                return function (e) {
                    if (!hasFiles(e)) return
                    const r = rtOf(state)
                    r.over = Math.max(0, r.over - 1)
                    if (!r.over && state.over) { state.over = false; refresh(state) }
                }
            })
            .on('drop', '.wdz', function (state) {
                const v = this
                return function (e) {
                    if (!hasFiles(e)) return
                    e.preventDefault()
                    const r = bind(state, v)
                    r.over = 0
                    state.over = false
                    addFiles(state, v, e.originalEvent.dataTransfer.files)
                    refresh(state)
                }
            })

            // кнопки карточки
            .on('click', '.wdz-rm', function (state) {
                return function (e) { e.stopPropagation(); removeItem(state, e.currentTarget.getAttribute('data-key')) }
            })
            .on('click', '.wdz-ed', function (state) {
                const v = this
                return function (e) { e.stopPropagation(); edit(state, v, e.currentTarget.getAttribute('data-key')) }
            })
            .on('click', '.wdz-retry', function (state) {
                return function (e) { e.stopPropagation(); retry(state, e.currentTarget.getAttribute('data-key')) }
            })
            .on('dblclick', '.wdz-card', function (state) {
                const v = this
                return function (e) { if ($(e.target).closest('.wdz-btn').length) return; edit(state, v, e.currentTarget.getAttribute('data-key')) }
            })
            .on('keydown', '.wdz-card', function (state) {
                const v = this
                return function (e) {
                    if (e.target !== e.currentTarget || state.disabled) return
                    const key = e.currentTarget.getAttribute('data-key')
                    const i = state.items.findIndex(x => x.key === key)
                    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeItem(state, key) }
                    else if (e.key === 'Enter') { e.preventDefault(); edit(state, v, key) }
                    else if (o.reorder && e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                        e.preventDefault()
                        moveItem(state, i, i + (e.key === 'ArrowLeft' ? -1 : 1))
                        later(state, () => { const el = qroot(state).querySelector('.wdz-card[data-key="' + key + '"]'); if (el) el.focus() }, 40)
                    }
                }
            })

            // перестановка карточек
            .on('pointerdown', '.wdz-card', function (state) {
                return function (e) {
                    if (!o.reorder || state.disabled || e.button !== 0 || state.items.length < 2) return
                    if ($(e.target).closest('.wdz-btn').length) return
                    dragGesture(state, e)
                }
            })

        if (o.tag) component(o.tag, view)
        return view
    }

    createDropzone.fmtSize = fmtSize
    global.createDropzone = createDropzone
})(window)