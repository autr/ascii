import { MODE_CHAR, INPUT_KEYS, SPACE, BOARDS, KEYS } from './Defs.js'
import { get, set } from 'svelte/store'
import { _KEYBOARD_INDEX } from './Store.js'

navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
	w.keyboardLayoutMap = keyboardLayoutMap

	const input = document.getElementById('capture')
	console.log(input)
	input.addEventListener('keydown', e => {
		console.log('KEYDOWN', e.key, e)
	})
	input.dispatchEvent(new Event('focus'));
	input.dispatchEvent(new KeyboardEvent('keydown',{'code':'KeyQ'}));
	console.log(`[Keys] keyboardLayoutMap`, Object.keys(keyboardLayoutMap), Object.values(keyboardLayoutMap))
})

const w = window

const META = 'MetaLeft'
const ARROWKEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']

export async function onKeyup( e, keycodes ) {

}
export async function onKeydown( e, keycodes ) {

	const visualKey = keyboardLayoutMap.get(e.code)

	console.log(`[Keys] universal code "${e.code}" = ${visualKey} // ${e.key}`)

	let { keyCode } = e
	keyCode -= 49
	const tools = Object.keys(w.TOOLS)

	const board = BOARDS[get(_KEYBOARD_INDEX)]
	const char = board[KEYS.indexOf(e.code)]

	if (e.code == 'Escape') {
		w.ACTIVE = null
	} else if ( e.code == 'KeyC' && keycodes[META] && w.ACTIVE ) {

		const { start, end } = w.ACTIVE

		console.log(`[Keys] copying from`, start, end )

		let _CLIP = ''
		for (let y = start.y; y <= end.y; y++) {
			for (let x = start.x; x <= end.x; x++) {
				_CLIP += w.OUT?.[y]?.[x] || SPACE
			}
			if (y != end.y) _CLIP += '\n'
		}
		_CLIP = _CLIP.replaceAll(SPACE,' ')

		if (!navigator.clipboard) return alert('no clipboard api!')
	    await navigator.clipboard.writeText(_CLIP)
		console.log(`[Keys] text copied\n`, _CLIP)

	} else if ( ARROWKEYS.indexOf(e.code) != -1 && w.ACTIVE ) {
		console.log(`[Keys] move ${e.code}`,)

		const _UNIT = keycodes['ShiftLeft'] ? 4 : 1

		if (e.code == 'ArrowLeft') {
			w.ACTIVE.start.x -= _UNIT
			w.ACTIVE.end.x -= _UNIT
		} else if (e.code == 'ArrowRight') {
			w.ACTIVE.start.x += _UNIT
			w.ACTIVE.end.x += _UNIT
		} else if (e.code == 'ArrowUp') {
			w.ACTIVE.start.y -= _UNIT
			w.ACTIVE.end.y -= _UNIT
		} else if (e.code == 'ArrowDown') {
			w.ACTIVE.start.y += _UNIT
			w.ACTIVE.end.y += _UNIT
		}

	} else if (keyCode >= 0 && keyCode < tools.length) {
		w.MODE= tools[keyCode]
	} else if (INPUT_KEYS.indexOf(e.code) != -1 && w.MODE == MODE_CHAR && w.ACTIVE?.type == MODE_CHAR) {
		console.log(`[Keys] fill chars with ${e.code}`, w.ACTIVE)

		const { start, end } = w.ACTIVE
		for (let y = start.y; y <= end.y; y++) {
			for (let x = start.x; x <= end.x; x++) {
				if (!w.ACTIVE.inputs[y]) w.ACTIVE.inputs[y] = {}
				w.ACTIVE.inputs[y][x] = char
			}
		}


	} else if ( e.key == 'Backspace' && w.ACTIVE ) {



		console.log('[Keys] deleting layer')
		let cp = w.DATA
		let idx = w.DATA.indexOf( w.DATA.find( l => l.ref == w.ACTIVE.ref ) )
		if (idx == -1) {
			return console.log(`[Keys] error finding index of selected`)
		}
		cp.splice( idx, 1 )
		w.DATA = cp
		w.ACTIVE = null

	}
}