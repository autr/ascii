import { MODE_CHAR, INPUT_KEYS, SPACE, BOARDS, KEYS, INPUT_ELEMENTS, MODES } from './Defs.js'
import { get, set } from 'svelte/store'
import { _keyboardIdx, _keys, _activeElement, _mode } from './Store.js'

navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
	w.keyboardLayoutMap = keyboardLayoutMap

	const input = document.getElementById('capture')
	console.log(input)
	input.addEventListener('keydown', e => {
		// console.log('Layout keydown', e.key, e)
	})
	input.dispatchEvent(new Event('focus'));
	input.dispatchEvent(new KeyboardEvent('keydown',{'code':'KeyQ'}));
	console.log(`[Keys] keyboardLayoutMap`, Object.keys(keyboardLayoutMap), Object.values(keyboardLayoutMap))
})

const w = window

const META = 'MetaLeft'
const ARROWKEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']

const getStores = e => {

	const keyboardIdx = get(_keyboardIdx)
	const board = BOARDS[keyboardIdx]
	const char = board[KEYS.indexOf(e.code)]

	return {
		keys: get(_keys),
		keyboardIdx,
		board,
		char,
		mode: get(_mode),
		modes: Object.keys(MODES),
		activeElement: get(_activeElement),
		number: e.keyCode - 49
	}
}

let keyboardWasTabbed = false

const SAY = m => console.log(`[Keys] ${m}`)

export async function onKeyup( e ) {

	let { 
		mode, 
		modes, 
		keys, 
		keyboardIdx, 
		activeElement, 
		number, 
		board, 
		char } = getStores(e)

	if (INPUT_ELEMENTS.indexOf(activeElement?.type) != -1) {

		if (e.code == 'Tab' && !keyboardWasTabbed) {
			keyboardIdx += 1
			if (keyboardIdx >= BOARDS.length) keyboardIdx = 0
			SAY(`⌨️ tab to keyboard ${keyboardIdx}`)
			_keyboardIdx.set(keyboardIdx)
			e.preventDefault()
		}
	}
}

export async function onKeydown( e ) {

	const layoutKey = keyboardLayoutMap.get(e.code)

	// SAY(`👆 ${e.code}/${layoutKey}/${e.key}`)

	const tools = Object.keys(w.TOOLS)

	let { 
		mode, 
		modes, 
		keys, 
		keyboardIdx, 
		activeElement, 
		number, 
		board, 
		char } = getStores(e)

	if (e.code == 'Tab') e.preventDefault()


	if (INPUT_ELEMENTS.indexOf(activeElement.type) != -1) {

		// Input or Textarea is selected

		SAY(`🔡 using ${INPUT_ELEMENTS.join(', ')}`)

		if (e.code == 'Escape') {

			SAY(`🚪 blurring ${activeElement.type}`)
			activeElement.blur()
		}

		if (keys['Tab']) {
			if (number >= 0 && number < BOARDS.length) {
				SAY(`⌨️ tabbed keyboard to index ${number}`)
				keyboardIdx = number
				_keyboardIdx.set(keyboardIdx)
				keyboardWasTabbed = true
			} else {
				keyboardWasTabbed = false
			}
			e.preventDefault()
		}

	} else if (number >= 0 && number < modes.length) {

		// Tab = change tool

		SAY(`🛠 tabbed mode to index ${number}`)
		mode = modes[number]
		_mode.set(mode)


	} else if (e.code == 'Escape') {

		// Escape = deactivate things

		w.ACTIVE = null

	} else if ( e.code == 'KeyC' && keys[META] && w.ACTIVE ) {

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

		const _UNIT = keys['ShiftLeft'] ? 4 : 1

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