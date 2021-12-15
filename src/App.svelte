<script>

	import { SQUARE_CORNERS, LINES, ARROWS, BLOCKS, KEYS, LOREM } from './Defs.js'


	export let width = 80
	export let height = 40
	export let data = []

	console.log(KEYS.length, ARROWS.length, LINES.v.length, BLOCKS.length)

	let highlight = []

	const MODE_RECT = 'rectangle'
	const MODE_TEXT = 'text'
	const MODE_POINTER = 'pointer'
	const SPACE = '&nbsp;'

	let STATES = {}
	let MODE = MODE_TEXT

	let cursor = { start: {}, end: {} }
	let CURSOR = null

	let lastWidth, lastHeight


	$: ((width,height) => {
		if (width == lastWidth && height == lastHeight) return
		lastWidth = width
		lastHeight = height
	})(width,height)

	let hovered = null

	function onMouseover(y,x) {
		hovered = { y, x }

	}

	let SELECTED = null

	function createReference() {
		return { date: new Date() }
	}

	function setHighlight( layer ) {

		const { start, end } = layer
		highlight = []
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const withinX = (x >= start.x && x <= end.x)
				const withinY = (y >= start.y && y <= end.y)
				if (!highlight[y]) highlight[y] = []
				highlight[y][x] = (withinX && withinY)
			}
		}
	}

	function setSelected(layer) {
		console.log(`[App] set selected`, layer)
		if (layer) {

			SELECTED = layer

			SELECTED.origin = { ...cursor.start }
			SELECTED.startOrigin = { ...layer.start }
			SELECTED.endOrigin = { ...layer.end }

			setHighlight( SELECTED )

		} else {
			highlight = []
			draw()
		}
	}

	let IS_MOVING = false
	let IS_RESIZING = false

	function onMousedown(y,x) {

		STATES.pressed = true
		SELECTED = false

		cursor.start = { y, x }
		cursor.end = { y, x }

		if ( MODE == MODE_RECT ) {
			STATES[MODE_RECT] = true
			SELECTED = {
				type: MODE_RECT,
				ref: createReference(),
				chars: [],
				...cursor,
				fill: BLOCKS[17]
			}
			data = [ { ...SELECTED }, ...data ]
		} else if ( MODE == MODE_TEXT ) {
			STATES[MODE_TEXT] = true
			SELECTED = {
				type: MODE_TEXT,
				ref: createReference(),
				chars: [],
				...cursor,
				text: LOREM
			}
			data = [ { ...SELECTED }, ...data ]
		} else if (MODE == MODE_POINTER) {
			let { layer } = getChar(y,x)
			if (!layer) {
				highlight = []
				draw()
				return console.log('[App] no item clicked')
			}
			console.log('CORNER???', {y,x}, layer.end)

			if (y == layer.end.y && x == layer.end.x) {
				IS_RESIZING = true
			} else {
				IS_MOVING = true
			}
			SELECTED = {
				...layer,
				origin: { ...cursor.start },
				startOrigin: { ...layer.start },
				endOrigin: { ...layer.end }
			}

			if (layer.type == MODE_RECT) setRectangle( layer )
			if (layer.type == MODE_TEXT) setTextbox( layer )
			draw()
		}
	}


	let lastMouseMove = {}

	function setRectangle( layer ) {

		console.log(`[App] setting rectangle`)
		let { start, end } = layer

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {

				if (!layer.chars[y]) layer.chars[y] = []

				const topBottom = (y == start.y || y == end.y)
				const leftRight = (x == start.x || x == end.x)

				const withinX = (x >= start.x && x <= end.x)
				const withinY = (y >= start.y && y <= end.y)

				const tl = (y == start.y && x == start.x )
				const tr = (y == start.y && x == end.x )
				const br = (y == end.y && x == end.x )
				const bl = (y == end.y && x == start.x )

				let sel = true

				if (tl) {
					layer.chars[y][x] = SQUARE_CORNERS.tl[0]
				} else if (tr) {
					layer.chars[y][x] = SQUARE_CORNERS.tr[0]
				} else if (br) {
					layer.chars[y][x] = SQUARE_CORNERS.br[0]
				} else if (bl) {
					layer.chars[y][x] = SQUARE_CORNERS.bl[0]
				} else if ( topBottom && withinX ) {
					layer.chars[y][x] = LINES.h[1]
				} else if ( leftRight && withinY ) {
					layer.chars[y][x] = LINES.v[2] 
				} else if ( withinX && withinY && layer.fill ) {
					layer.chars[y][x] = layer.fill
				} else {
					layer.chars[y][x] = null
					sel = false
				}

				if (sel) {
					if (!highlight[y]) highlight[y] = []
					highlight[y][x] = true
				}
			}
		}
	}

	const ALIGN_START = 'start'
	const ALIGN_CENTER = 'center'
	const ALIGN_END = 'end'

	function setTextbox( layer ) {


		let { start, end } = layer

		console.log(`[App] setting textbox` )

		// if (end.x < start.x) {
		// 	const cp = end.x
		// 	end.x = start.x
		// 	start.x = cp
		// }

		const blockWidth = end.x - start.x
		const blockHeight = end.y - start.y

		const alignX = layer?.alignX || ALIGN_CENTER
		const alignY = layer?.alignY || ALIGN_CENTER


		// create lines

		if ( (layer?.text || '').length > 0 ) {

			layer.lines = []
			let currentLine = ''

			for (const word of layer.text.split(' ')) {
				if (currentLine.length + word.length + 1 < blockWidth) {
					const space = currentLine != '' ? ' ' : ''
					currentLine += space + word
				} else {
					layer.lines.push( currentLine )
					currentLine = word
				}
			}
			if (layer.lines[layer.lines.length-1] != currentLine) layer.lines.push(currentLine)

		}

		layer.chars.length = 0

		const { lines } = layer

		for (let y = start.y; y <= end.y; y++) {
			for (let x = start.x; x <= end.x; x++) {

				if (!layer.chars[y]) layer.chars[y] = []


				let yy = y - start.y
				let xx = x - start.x

				const yDiff = blockHeight - layer.lines.length
				const alignCenter = alignY == ALIGN_CENTER && blockHeight > lines.length
				const alignEnd = alignY == ALIGN_END && blockHeight > lines.length

				if ( alignCenter ) yy -= yDiff / 2
				if ( alignEnd ) yy += yDiff

				yy = Math.round(yy)
				xx = Math.round(xx)

				const line = lines?.[yy]
				const char = line?.[xx]
				layer.chars[y][x] = (!char || char == ' ') ? SPACE : char
				// layer.chars[y][x] = ((Math.random() * 100) + '')[0]
				if (!highlight[y]) highlight[y] = []
				highlight[y][x] = true
			}
		}
	}


	function onMousemove(y,x) {
		if (!STATES.pressed) return // create dragging only
		if (lastMouseMove.x == x && lastMouseMove.y == y) return

		// set highlight area

		lastMouseMove = cursor.end = { y, x }

		let start = {...cursor.start}
		let end = {...cursor.end}

		// flip start and end (drag backwards)

		if (cursor.start.x > cursor.end.x) {
			start.x = cursor.end.x
			end.x = cursor.start.x
		}

		if (cursor.start.y > cursor.end.y) {
			start.y = cursor.end.y
			end.y = cursor.start.y
		}

		if ( IS_MOVING && SELECTED ) {
			console.log(`[App] moving...`)
			const { origin, startOrigin, endOrigin, type } = SELECTED

			SELECTED.start.x = startOrigin.x + ( x - origin.x )
			SELECTED.end.x = endOrigin.x + ( x - origin.x )
			SELECTED.start.y = startOrigin.y + ( y - origin.y )
			SELECTED.end.y = endOrigin.y + ( y - origin.y )

			highlight = []

			if (type == MODE_RECT) setRectangle( SELECTED )
			if (type == MODE_TEXT) setTextbox( SELECTED )
			draw()
		}

		// resize

		else if ( IS_RESIZING && SELECTED ) {
			console.log(`[App] resizing...`)
			const { origin, startOrigin, endOrigin, type } = SELECTED

			SELECTED.end.x = endOrigin.x + ( x - origin.x )
			SELECTED.end.y = endOrigin.y + ( y - origin.y )


			highlight = []

			if (type == MODE_RECT) setRectangle( SELECTED )
			if (type == MODE_TEXT) setTextbox( SELECTED )
			draw()
		}
		// rectangle

		else if (STATES[MODE_RECT]) {
			console.log(`[App] creating rectangle...`)
			highlight = []
			data[0].start = start
			data[0].end = end
			setRectangle( data[0] )
			draw()
		}
		// textbox

		else if (STATES[MODE_TEXT]) {
			console.log(`[App] creating textbox...`)
			highlight = []
			data[0].start = start
			data[0].end = end
			setTextbox( data[0] )
			draw()
		}

	}  

	function onMouseup(y,x) {
		STATES.pressed = false
		if (STATES[MODE_RECT]) STATES[MODE_RECT] = false
		if (STATES[MODE_TEXT]) STATES[MODE_TEXT] = false

		IS_RESIZING = false
		IS_MOVING = false

		let layer = data?.[0]
		if ( layer?.type == MODE_RECT || layer?.type == MODE_TEXT) {
			// console.log('?')
			if (layer.start.x == layer.end.x || layer.start.y == layer.end.y) {
				console.log('[App] deleting tiny rectangle')
				let cp = data
				cp.shift()
				data = cp
				highlight = []
				draw()
			}
		}

		window.data = data

	}

	function draw() {

		window.requestAnimationFrame( e => {
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					if (!DATA[y]) DATA[y] = []
					DATA[y][x] = getChar(y,x).char
				}
			}
		})
	}

	let DATA = []

	function getChar( y, x ) {

		for (let layer of data) {
			if ( layer?.chars?.[y]?.[x] ) {
				return {
					char: layer.chars[y][x],
					layer
				}
			}
		}
		return {
			char: SPACE,
			layer: null
		}
	}

	const TOOLS = {
		[MODE_POINTER]: {},
		[MODE_RECT]: {},
		[MODE_TEXT]: {}
	}

	let keyboard
	navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
		keyboard = keyboardLayoutMap
	})
	window.keys = [] 
	function onKeydown(e) {
		const key = keyboard.get(e.code)
		window.keys.push(e.code)
		console.log(`[App] universal code "${e.code}" = ${key}`)
		let { keyCode } = e
		keyCode -= 49
		const tools = Object.keys(TOOLS)
		if (keyCode >= 0 && keyCode < tools.length) {
			MODE = tools[keyCode]
		} else if ( e.key == 'Backspace' && SELECTED ) {
			console.log('[App] deleting layer')
			let cp = data
			let idx = data.indexOf( data.find( l => l.ref == SELECTED.ref ) )
			if (idx == -1) {
				return console.log(`[App] error finding index of selected`)
			}
			cp.splice( idx, 1 )
			data = cp
			highlight = []
			
			// idx -= 1
			// if (idx < 0) idx = 0
			// setSelected( data[idx] )
			draw()
		}
	}

</script>
<svelte:window 
	on:keydown={ onKeydown }
	on:mouseup={ e => STATES.pressed = false } />
<aside class="fixed r0 b0 p1 filled z-index99 flex column cmb0-2">
	<div>1
		mode: {MODE}
	</div>
	<div>
		selected: {STATES?.selected?.type || 'none'}
	</div>
	<div>
		pressed: {STATES?.pressed || 'none'}
	</div>
	<div class="flex column">
		<span>layers:</span>
		{#each data as layer, idx}
			<span>{idx+1} {layer.type}</span>
		{/each}
	</div>
</aside>
<main class="bg fill flex flex column monospace">
	<nav class="bb1-solid p1">
		HEADER
	</nav>
	<div 
		class="grow mode-{MODE}  flex row-flex-start-flex-start">
		<nav id="toolbar" class="column flex bb1-solid br1-solid h100pc">
			{#each Object.keys(TOOLS) as tool, idx}
				<button 
					on:mousedown={ e => (MODE = tool)}
					class:filled={MODE == tool}
					class="b0-solid ">
					{tool}
				</button>
			{/each}
		</nav>
		<div id="canvas" class="flex column monospace pre user-select-none">
			{#each (new Array(height)) as n, y}
				<div class="flex row  pre no-grow pop">
					{#each (new Array(width)) as n, x}
						<span
							class="char flex pre rel"
							class:filled={ highlight?.[y]?.[x] }
							on:mousemove={e => onMousemove(y,x)}
							on:mouseup={e => onMouseup(y,x)}
							on:mousedown={e => onMousedown(y,x)}
							on:mouseover={e => onMouseover(y,x)}>
							{@html DATA?.[y]?.[x] || SPACE}
						</span>
					{/each}
				</div>
			{/each}
		</div>
		<section id="panel" class="column flex bb1-solid bl1-solid h100pc grow">
			{#each data as layer, idx}
				<div 
					on:click={e => setSelected(layer)}
					class="bb1-solid w100pc flex column">
					<header 
						class:filled={ layer?.ref == SELECTED.ref }
						class="pointer plr1 w100pc flex row-space-between-center">
						<div>{layer.type}</div>
						<div class="flex row-stretch-stretch h100pc cp0-5  cbl1-solid">
							<div class="bl1-solid">S</div>
							<div class="bl1-solid">M</div>
						</div>
					</header>
				</div>
			{/each}
		</section>
	</div>
</main>