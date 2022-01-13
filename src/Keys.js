import { MODE_CHAR, INPUT_KEYS, SPACE } from './Defs.js'

let keyboard
navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
	keyboard = keyboardLayoutMap
})

const w = window

const META = 'MetaLeft'
const ARROWKEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']

export async function onKeyup(e) {
	w.KEYCODES[e.code] = false
}
export async function onKeydown(e) {
	const visualKey = keyboard.get(e.code)

	w.KEYCODES[e.code] = true

	console.log(`[App] universal code "${e.code}" = ${visualKey} // ${e.key}`)

	let { keyCode } = e
	keyCode -= 49
	const tools = Object.keys(w.TOOLS)

	const _EXC = ['textarea','number','text']
	const isInputForm = _EXC.indexOf(e.target.type) != -1

	if (e.code == 'Escape') {
		w.ACTIVE = null
	} else if ( e.code == 'KeyC' && w.KEYCODES[META] && w.ACTIVE ) {

		const { start, end } = w.ACTIVE

		console.log(`[App] copying from`, start, end )

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
		console.log(`[App] text copied\n`, _CLIP)

	} else if ( ARROWKEYS.indexOf(e.code) != -1 && w.ACTIVE && !isInputForm ) {
		console.log(`[App] move ${e.code}`,)

		const _UNIT = w.KEYCODES['ShiftLeft'] ? 4 : 1

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
		console.log(`[App] fill chars with ${e.code}`, w.ACTIVE)

		const { start, end } = w.ACTIVE
		for (let y = start.y; y <= end.y; y++) {
			for (let x = start.x; x <= end.x; x++) {
				if (!w.ACTIVE.inputs[y]) w.ACTIVE.inputs[y] = {}
				w.ACTIVE.inputs[y][x] = e.key
			}
		}


	} else if ( e.key == 'Backspace' && w.ACTIVE ) {


		if (!isInputForm) {

			console.log('[App] deleting layer')
			let cp = w.DATA
			let idx = w.DATA.indexOf( w.DATA.find( l => l.ref == w.ACTIVE.ref ) )
			if (idx == -1) {
				return console.log(`[App] error finding index of selected`)
			}
			cp.splice( idx, 1 )
			w.DATA = cp
			w.ACTIVE = null
		}

	}
}