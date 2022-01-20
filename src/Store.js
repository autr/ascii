import { writable } from 'svelte/store'
import { MODE_TEXT, MODE_RECT } from './Defs.js'

export const _keys = writable({})
export const _keyboardIdx = writable(0)
export const _showKeyboard = writable(false)
export const _activeElement = writable(null)
export const _mode = writable(MODE_RECT)