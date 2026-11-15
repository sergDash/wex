// ---------- renderers: state обязан содержать value и row (иначе props игнорируются)
const StatusBadge = $(`<template><span class="rounded px-2 py-1 text-xs font-medium" w-class="{
  'bg-blue-100 text-blue-900': value==='Pending',
  'bg-green-100 text-green-900': value==='Delivered',
  'bg-orange-100 text-orange-900': value==='Cancelled',
  'bg-yellow-100 text-yellow-900': value==='Placed' }">{{ value }}</span></template>`)
    .state(() => ({ value: '', row: null }))

const Thumb = $(`<template><div class="h-7 w-7 overflow-hidden rounded-sm bg-slate-200"><img w-src="value" alt="" class="h-full w-full object-cover" style="object-position:36% 51%" /></div></template>`)
    .state(() => ({ value: '', row: null }))

const RowActions = $(`<template><div class="flex items-center gap-3 text-slate-500 dark:text-slate-400">
  <button aria-label="View" class="hover:text-blue-600"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5Z"/><circle cx="10" cy="10" r="2.2"/></svg></button>
  <button aria-label="Edit" class="hover:text-blue-600"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m3 14.8-.7 3 3-.7L16.8 5.6a1.6 1.6 0 0 0-2.3-2.3L3 14.8Z"/><path d="m13.5 4.3 2.2 2.2"/></svg></button>
  <button aria-label="Delete" class="hover:text-red-600"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 6h12M8 6V4h4v2m3 0-.7 11H5.7L5 6m3 3v5m4-5v5"/></svg></button>
</div></template>`).state(() => ({ value: '', row: null }))