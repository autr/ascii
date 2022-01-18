import { writable } from 'svelte/store'

export const _KEYCODES = writable({})
export const _KEYBOARD_INDEX = writable(0)
export const _KEYBOARD_ACTIVE = writable(false)