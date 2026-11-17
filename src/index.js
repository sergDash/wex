import { component, directive, filter, View } from './wex.js'
import { shareState } from './shared-state.js'
import { createAsyncComponent } from './async.js'
import { createWire, $wire } from './wire'
import { createLazy } from './lazy.js'
import './prefetch.js'

export {
  component,
  directive,
  filter,
  View,
  shareState,
  createAsyncComponent,
  createLazy,
  createWire,
  $wire,
}

if (typeof window !== 'undefined') {
  window.$wire = $wire
}