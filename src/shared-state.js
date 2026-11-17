import { reactive, subscribe } from './reactive.js'

export function shareState(initState, options = {}) {
  const state = reactive(initState)
  if (options.onChange) subscribe(state, ({ key, target }) => options.onChange(key, target[key]))
  return function () {
    if (options.drive) options.drive(arg => this.update(arg))
    return state
  }
}