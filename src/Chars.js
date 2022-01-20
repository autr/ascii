const w = window

import { SQUARE_CORNERS, LINES, ARROWS, BLOCKS, KEYS, LOREM } from './Defs.js'
import { MODE_RECT, MODE_TEXT, MODE_POINTER, MODE_SELECT, MODE_CHAR, SPACE } from './Defs.js'
import { ALIGN_CENTER, ALIGN_END, ALIGN_START, ALIGN_JUSTIFY } from './Defs.js'


const SAY = m => console.log(`[Chars] ${m}`)

export function setRectChars() {

	if (!w.ACTIVE || w?.ACTIVE?.type != MODE_RECT) return

	let { start, end } = w.ACTIVE
	SAY(`🟦 set`)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {

			if (!w.ACTIVE.chars[y]) w.ACTIVE.chars[y] = []

			const topBottom = (y == start.y || y == end.y)
			const leftRight = (x == start.x || x == end.x)

			const withinX = (x >= start.x && x <= end.x)
			const withinY = (y >= start.y && y <= end.y)

			const tl = (y == start.y && x == start.x )
			const tr = (y == start.y && x == end.x )
			const br = (y == end.y && x == end.x )
			const bl = (y == end.y && x == start.x )

			let sel = true
			const _BLOCK = BLOCKS[w.ACTIVE.fill]

			if (tl) {
				w.ACTIVE.chars[y][x] = SQUARE_CORNERS.tl[w.ACTIVE.corner] || _BLOCK
			} else if (tr) {
				w.ACTIVE.chars[y][x] = SQUARE_CORNERS.tr[w.ACTIVE.corner] || _BLOCK
			} else if (br) {
				w.ACTIVE.chars[y][x] = SQUARE_CORNERS.br[w.ACTIVE.corner] || _BLOCK
			} else if (bl) {
				w.ACTIVE.chars[y][x] = SQUARE_CORNERS.bl[w.ACTIVE.corner] || _BLOCK
			} else if ( topBottom && withinX ) {
				w.ACTIVE.chars[y][x] = LINES.h[w.ACTIVE.sides] || _BLOCK
			} else if ( leftRight && withinY ) {
				w.ACTIVE.chars[y][x] = LINES.v[w.ACTIVE.sides] || _BLOCK 
			} else if ( withinX && withinY && typeof w.ACTIVE.fill == 'number' ) {
				w.ACTIVE.chars[y][x] = _BLOCK
			} else {
				w.ACTIVE.chars[y][x] = null
				sel = false
			}

			if (sel) {
				if (!w.HIGH[y]) w.HIGH[y] = []
				w.HIGH[y][x] = true
			}
		}
	}
}


export function setTextChars() {

	if (!w.ACTIVE) return
	if (w?.ACTIVE?.type != MODE_RECT) return
	SAY(`🔠 set`)

	let { start, end } = w.ACTIVE
	const alignX = w.ACTIVE?.alignX || ALIGN_CENTER
	const alignY = w.ACTIVE?.alignY || ALIGN_CENTER

	console.log(`[App] setting textbox with x "${alignX}" and y "${alignY}"` )

	const blockWidth = end.x - start.x
	const blockHeight = end.y - start.y


	// create lines

	w.ACTIVE.text = w.ACTIVE.text || ''
	w.ACTIVE.lines = []
	let currentLine = ''
	let idx = 0

	for (const paragraph of w.ACTIVE.text.split('\n')) {

		for (const word of paragraph.split(' ')) {

			if (currentLine.length + word.length + 1 < blockWidth) {
				const space = currentLine != '' ? ' ' : ''
				currentLine += space + word
			} else {
				w.ACTIVE.lines.push( currentLine )
				currentLine = word
			}
		}

		w.ACTIVE.lines.push(currentLine)
		currentLine = ''

	}

	// w.ACTIVE.chars.length = 0

	// return 
	const { lines } = w.ACTIVE
	const yDiff = blockHeight - w.ACTIVE.lines.length
	const aYCenter = alignY == ALIGN_CENTER && blockHeight > lines.length
	const aXCenter = alignX == ALIGN_CENTER
	const aYEnd = alignY == ALIGN_END && blockHeight > lines.length
	const aXEnd = alignX == ALIGN_END


	for (let y = start.y; y <= end.y; y++) {
		for (let x = start.x; x <= end.x; x++) {

			if (!w.ACTIVE.chars[y]) w.ACTIVE.chars[y] = []

			let yy = y - start.y
			let xx = x - start.x

			// [Y]

			if ( aYCenter ) yy -= (yDiff / 2) + 0.5
			if ( aYEnd ) yy -= yDiff + 1

			yy = Math.round(yy)

			const line = lines?.[yy]

			// [X]

			const xDiff = blockWidth - line?.length
			if ( aXCenter && line ) xx -= Math.round(xDiff / 2)
			if ( aXEnd && line ) xx -= Math.round(xDiff) + 1

			xx = Math.round(xx)

			const char = line?.[xx]
			// w.ACTIVE.chars[y][x] = (!char || char == ' ') ? SPACE : char

			if (char) w.ACTIVE.chars[y][x] = char
			if (!w.HIGH[y]) w.HIGH[y] = []
			w.HIGH[y][x] = true
		}
	}
}


export function setCharChars() {

	if (!w.ACTIVE || w?.ACTIVE?.type != MODE_CHAR) return
	SAY(`🅰️ set`)

	let { start, end, inputs } = w.ACTIVE

	const blockWidth = end.x - start.x
	const blockHeight = end.y - start.y

	const { x, y } = w.ACTIVE.origin

	console.log(`[App] setting chars from origin ${x}/${y}` )

	// create lines

	for (let y = 0; y <= w.height; y++) {
		for (let x = 0; x <= w.width; x++) {
			if (!w.ACTIVE.chars[y]) w.ACTIVE.chars[y] = []
			w.ACTIVE.chars[y][x] = inputs?.[y]?.[x] || null
		}
	}
}
