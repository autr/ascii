<script>

	import { SQUARE_CORNERS, LINES, ARROWS, BLOCKS, KEYS, LOREM } from './Defs.js'
	import { MODE_RECT, MODE_TEXT, MODE_POINTER, MODE_SELECT, MODE_CHAR, SPACE } from './Defs.js'
	import { ALIGN_CENTER, ALIGN_END, ALIGN_START, ALIGN_JUSTIFY } from './Defs.js'


	export let width = 80
	export let height = 40
	export let data = []

	console.log(KEYS.length, ARROWS.length, LINES.v.length, BLOCKS.length)

	let highlight = [] // used to show highlighted block
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

	const w = window

	function createReference() {
		return { date: new Date() }
	}


	function setHighlight( layer ) {

		// DELETE?

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
		const { start, end } = layer
		console.log(`[App] set selected:`, start, end)
		if (layer) {

			w.ACTIVE = layer

			w.ACTIVE.origin = { ...cursor.start }
			w.ACTIVE.startOrigin = { ...layer.start }
			w.ACTIVE.endOrigin = { ...layer.end }

			setHighlight( w.ACTIVE )

		} else {
			highlight = []
			draw()
		}
	}

	let IS_MOVING = false
	let IS_RESIZING = false

	function onMousedown(y,x) {

		STATES.pressed = true
		w.ACTIVE = false

		cursor.start = { y, x }
		cursor.end = { y, x }

		if ( MODE == MODE_RECT ) {
			STATES[MODE_RECT] = true
			w.ACTIVE = {
				type: MODE_RECT,
				ref: createReference(),
				chars: [],
				...cursor,
				fill: 17,
				corner: 0,
				sides: 0,
				inited: false
			}
			data = [ w.ACTIVE, ...data ]
		} else if ( MODE == MODE_TEXT ) {
			STATES[MODE_TEXT] = true
			w.ACTIVE = {
				type: MODE_TEXT,
				ref: createReference(),
				chars: [],
				...cursor,
				text: LOREM,
				inited: false,
				alignX: ALIGN_CENTER,
				alignY: ALIGN_CENTER
			}
			data = [ w.ACTIVE, ...data ]
		} else if ( MODE == MODE_SELECT ) {
			STATES[MODE_SELECT] = true
			w.ACTIVE = {
				type: MODE_SELECT,
				ref: createReference(),
				...cursor,
				inited: false
			}
		} else if (MODE == MODE_POINTER) {
			let { layer } = getChar(y,x)
			if (!layer) {
				highlight = []
				draw()
				return console.log('[App] no item clicked')
			}
			if (y == layer.end.y && x == layer.end.x) {
				IS_RESIZING = true
			} else {
				IS_MOVING = true
			}

			console.log(`[App] selected layer:`, layer)

			w.ACTIVE = layer 
			layer.origin = { ...cursor.start }
			layer.startOrigin = { ...layer.start }
			layer.endOrigin = { ...layer.end }

			if (layer.type == MODE_RECT) setRectangle( w.ACTIVE )
			if (layer.type == MODE_TEXT) setTextbox( w.ACTIVE )
			draw()
		}
	}


	let lastMouseMove = {}

	function setSelector( layer ) {
		let { start, end } = layer
		console.log(`[App] setting selector:`, start, end)

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {

				const withinX = (x >= start.x && x <= end.x)
				const withinY = (y >= start.y && y <= end.y)

				if (!highlight[y]) highlight[y] = []
				if ( withinX && withinY) {
					highlight[y][x] = true
				} else {
					highlight[y][x] = false

				}
			}
		}
	}

	function setRectangle( layer ) {

		let { start, end } = layer
		console.log(`[App] setting rectangle:`, start, end)

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
				const _BLOCK = BLOCKS[layer.fill]

				if (tl) {
					layer.chars[y][x] = SQUARE_CORNERS.tl[layer.corner] || _BLOCK
				} else if (tr) {
					layer.chars[y][x] = SQUARE_CORNERS.tr[layer.corner] || _BLOCK
				} else if (br) {
					layer.chars[y][x] = SQUARE_CORNERS.br[layer.corner] || _BLOCK
				} else if (bl) {
					layer.chars[y][x] = SQUARE_CORNERS.bl[layer.corner] || _BLOCK
				} else if ( topBottom && withinX ) {
					layer.chars[y][x] = LINES.h[layer.sides] || _BLOCK
				} else if ( leftRight && withinY ) {
					layer.chars[y][x] = LINES.v[layer.sides] || _BLOCK 
				} else if ( withinX && withinY && typeof layer.fill == 'number' ) {
					layer.chars[y][x] = _BLOCK
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


	function setTextbox( layer ) {


		let { start, end } = layer
		const alignX = layer?.alignX || ALIGN_CENTER
		const alignY = layer?.alignY || ALIGN_CENTER

		console.log(`[App] setting textbox with x "${alignX}" and y "${alignY}"` )

		const blockWidth = end.x - start.x
		const blockHeight = end.y - start.y

		// create lines

		layer.text = layer.text || ''
		layer.lines = []
		let currentLine = ''
		let idx = 0

		for (const paragraph of layer.text.split('\n')) {

			for (const word of paragraph.split(' ')) {

				if (currentLine.length + word.length + 1 < blockWidth) {
					const space = currentLine != '' ? ' ' : ''
					currentLine += space + word
				} else {
					layer.lines.push( currentLine )
					currentLine = word
				}
			}

			layer.lines.push(currentLine)
			currentLine = ''

		}

		layer.chars.length = 0

		const { lines } = layer
		const yDiff = blockHeight - layer.lines.length
		const aYCenter = alignY == ALIGN_CENTER && blockHeight > lines.length
		const aXCenter = alignX == ALIGN_CENTER
		const aYEnd = alignY == ALIGN_END && blockHeight > lines.length
		const aXEnd = alignX == ALIGN_END

		for (let y = start.y; y <= end.y; y++) {
			for (let x = start.x; x <= end.x; x++) {

				if (!layer.chars[y]) layer.chars[y] = []

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

		if ( IS_MOVING && w.ACTIVE ) {
			console.log(`[App] moving...`)
			const { origin, startOrigin, endOrigin, type } = w.ACTIVE

			w.ACTIVE.start.x = startOrigin.x + ( x - origin.x )
			w.ACTIVE.end.x = endOrigin.x + ( x - origin.x )
			w.ACTIVE.start.y = startOrigin.y + ( y - origin.y )
			w.ACTIVE.end.y = endOrigin.y + ( y - origin.y )

			highlight = []

			if (type == MODE_RECT) setRectangle( w.ACTIVE )
			if (type == MODE_TEXT) setTextbox( w.ACTIVE )
			draw()
		}

		// resize

		else if ( IS_RESIZING && w.ACTIVE ) {
			console.log(`[App] resizing...`)
			const { origin, startOrigin, endOrigin, type } = w.ACTIVE

			w.ACTIVE.end.x = endOrigin.x + ( x - origin.x )
			w.ACTIVE.end.y = endOrigin.y + ( y - origin.y )


			highlight = []

			if (type == MODE_RECT) setRectangle( w.ACTIVE )
			if (type == MODE_TEXT) setTextbox( w.ACTIVE )
			draw()
		}
		// rectangle

		else if (STATES[MODE_RECT]) {
			console.log(`[App] creating rectangle...`)
			highlight = []
			w.ACTIVE.start = start
			w.ACTIVE.end = end
			setRectangle( w.ACTIVE )
			draw()
		}
		// textbox

		else if (STATES[MODE_TEXT]) {
			console.log(`[App] creating textbox...`)
			highlight = []
			w.ACTIVE.start = start
			w.ACTIVE.end = end
			setTextbox( w.ACTIVE )
			draw()
		}

		setSelectorEnd( start, end )
	}  

	function setSelectorEnd( start, end ) {
		if (STATES[MODE_SELECT]) {
			console.log(`[App] selecting area...`)
			highlight = []
			w.ACTIVE.start = start
			w.ACTIVE.end = end
			setSelector( w.ACTIVE )
			draw()
		}
	}

	function onMouseup(y,x) {
		STATES.pressed = false

		setSelectorEnd( cursor.start, {y,x} )
		if (STATES[MODE_RECT]) STATES[MODE_RECT] = false
		if (STATES[MODE_TEXT]) STATES[MODE_TEXT] = false
		if (STATES[MODE_SELECT]) STATES[MODE_SELECT] = false

		IS_RESIZING = false
		IS_MOVING = false

		if ( w.ACTIVE?.type == MODE_RECT || w.ACTIVE?.type == MODE_TEXT) {
			if (w.ACTIVE.start.x == w.ACTIVE.end.x || w.ACTIVE.start.y == w.ACTIVE.end.y) {
				console.log('[App] deleting tiny rectangle')
				let cp = data
				cp.shift()
				data = cp
				highlight = []


				let { layer } = getChar(y,x)
				if (!layer) {
					highlight = []
				} else if (MODE == layer.type) {
					console.log(`[App] selected with same tool type:`, layer)
					w.ACTIVE = layer 
					layer.origin = { ...cursor.start }
					layer.startOrigin = { ...layer.start }
					layer.endOrigin = { ...layer.end }

					if (layer.type == MODE_RECT) setRectangle( w.ACTIVE )
					if (layer.type == MODE_TEXT) setTextbox( w.ACTIVE )

				}

				draw()
			} else {
				const { start, end } = data[0]
				console.log('[App] inited new rectangle:', start, end)
				data[0].inited = true
			}
		}


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
			char: null,
			layer: null
		}
	}

	const TOOLS = {
		[MODE_POINTER]: {},
		[MODE_SELECT]: {},
		[MODE_RECT]: {},
		[MODE_TEXT]: {},
		[MODE_CHAR]: {}
	}

	let keyboard
	navigator.keyboard.getLayoutMap().then(keyboardLayoutMap => {
		keyboard = keyboardLayoutMap
	})

	let KEYCODES = {}
	const META = 'MetaLeft'
	const ARROWKEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']

	function onKeyup(e) {
		KEYCODES[e.code] = false

	}
	async function onKeydown(e) {
		const visualKey = keyboard.get(e.code)

		KEYCODES[e.code] = true

		console.log(`[App] universal code "${e.code}" = ${visualKey}`)

		let { keyCode } = e
		keyCode -= 49
		const tools = Object.keys(TOOLS)

		if ( e.code == 'KeyC' && KEYCODES[META] && w.ACTIVE ) {

			const { start, end } = w.ACTIVE

			console.log(`[App] copying from`, start, end )

			let _CLIP = ''
			for (let y = start.y; y <= end.y; y++) {
				for (let x = start.x; x <= end.x; x++) {
					_CLIP += DATA?.[y]?.[x] || SPACE
				}
				if (y != end.y) _CLIP += '\n'
			}
			_CLIP = _CLIP.replaceAll(SPACE,' ')

			if (!navigator.clipboard) return alert('no clipboard api!')
		    await navigator.clipboard.writeText(_CLIP)
			console.log(`[App] text copied\n`, _CLIP)

		} else if ( ARROWKEYS.indexOf(e.code) != -1 && w.ACTIVE ) {
			console.log(`[App] move ${e.code}`,)

			highlight = []

			const _UNIT = KEYCODES['ShiftLeft'] ? 4 : 1

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

			setSelector( w.ACTIVE )
			if (w.ACTIVE.type == MODE_RECT) setRectangle( w.ACTIVE )
			if (w.ACTIVE.type == MODE_TEXT) setTextbox( w.ACTIVE )
			draw()

		} else if (keyCode >= 0 && keyCode < tools.length) {
			MODE = tools[keyCode]
		} else if ( e.key == 'Backspace' && w.ACTIVE ) {

			const _EXC = ['textarea','number','text']

			if (_EXC.indexOf(e.target.type) == -1) {

				console.log('[App] deleting layer')
				let cp = data
				let idx = data.indexOf( data.find( l => l.ref == w.ACTIVE.ref ) )
				if (idx == -1) {
					return console.log(`[App] error finding index of selected`)
				}
				cp.splice( idx, 1 )
				data = cp
				highlight = []
				w.ACTIVE = null
				draw()
			}

		}
	}

	$: outlineStyle = !w.ACTIVE ? '' : `
		transform: 
		translate(${w.ACTIVE?.start?.x*8}px, ${w.ACTIVE?.start?.y}em);
		width: ${(w.ACTIVE?.end?.x-w.ACTIVE?.start?.x)*8}px;
		height: ${w.ACTIVE?.end?.y-w.ACTIVE?.start?.y}em;
	`

	function onSelectedChange(e) {
		if (!w.ACTIVE) return
		window.requestAnimationFrame( e => {
			console.log(`[App] changed from "${e.type}" element`)
			if (w.ACTIVE.type == MODE_RECT) setRectangle( w.ACTIVE )
			if (w.ACTIVE.type == MODE_TEXT) setTextbox( w.ACTIVE )
			draw()
		})
	}

</script>
<svelte:window 
	on:keydown={ onKeydown }
	on:keyup={ onKeyup }
	on:mouseup={ e => STATES.pressed = false } />
<aside class="fixed l0 b0 p1 maxw24em filled z-index99 flex column cmb0-2 none">
	<div>1
		mode: {MODE}
	</div>
	<div>
		selected: {w.ACTIVE?.type || 'none'}
		{outlineStyle}
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
	<nav class="bb1-solid p1 h3em flex row-space-between-center ">
		<div class="flex row-flex-start-center cmr1 w100pc">
			{#if w.ACTIVE}

				{#if w.ACTIVE.type == MODE_RECT}
					<span>fill</span>
					<input 
						on:change={onSelectedChange}
						type="number" 
						bind:value={w.ACTIVE.fill} />
					<span>corner</span>
					<input 
						on:change={onSelectedChange}
						type="number" 
						bind:value={w.ACTIVE.corner} />
					<span>sides</span>
					<input 
						on:change={onSelectedChange}
						type="number" 
						bind:value={w.ACTIVE.sides} />
				{:else if w.ACTIVE.type == MODE_TEXT}

					<span>x</span>
					<select 
						on:change={onSelectedChange}
						bind:value={w.ACTIVE.alignX}>
						{#each [ALIGN_START,ALIGN_CENTER,ALIGN_END, ALIGN_JUSTIFY] as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
					<span>y</span>
					<select 
						on:change={onSelectedChange}
						bind:value={w.ACTIVE.alignY}>
						{#each [ALIGN_START,ALIGN_CENTER,ALIGN_END] as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				{/if}
			{:else}

				<span>width</span>
				<input 
					type="number" 
					bind:value={width} />

				<span>height</span>
				<input 
					type="number" 
					bind:value={height} />
			{/if}
		</div>
		<div>
			<button>copy</button>
		</div>
	</nav>
	<!-- 
								class:filled={ highlight?.[y]?.[x] } -->
	<div 
		class="grow mode-{MODE} w100vw overflow-hidden flex row-flex-start-flex-start">
		<nav id="toolbar" class="column flex bb1-solid br1-solid h100pc ">
			{#each Object.keys(TOOLS) as tool, idx}
				<button
					on:mousedown={ e => (MODE = tool)}
					class:filled={MODE == tool}
					class="b0-solid text-left">
					[{idx+1}] {tool}
				</button>
			{/each}
		</nav>
		<div 
			id="workspace"
			class="grow flex row-center-center h100pc p1 overflow-auto">
			<div 
				id="canvas"
				class="rel monospace pre user-select-none">
				{#each (new Array(height)) as n, y}
					<div class="flex row  pre no-grow pop">
						{#each (new Array(width)) as n, x}
							<span
							class:filled={ highlight?.[y]?.[x] }
								class="char flex pre rel"
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
		</div>
		<section id="panel" class="column flex column-space-between-flex-start bb1-solid bl1-solid h100pc grow w16em maxw16em minw16em">
			<div id="layers" class="flex overflow-auto column grow">
				{#each data as layer, idx}
					{#if layer.inited}
						<div 
							on:click={e => setSelected(layer)}
							class="bb1-solid w100pc flex column">
							<header 
								class:filled={ layer?.ref == w.ACTIVE?.ref }
								class="pointer plr1 w100pc flex row-space-between-center">
								<div>{layer.type}</div>
								<div class="flex row-stretch-stretch h100pc cp0-5  cbl1-solid">
									<div class="bl1-solid">S</div>
									<div class="bl1-solid">M</div>
								</div>
							</header>
						</div>
					{/if}
				{/each}
			</div>

			{#if w.ACTIVE}
				<div id="editor" class="flex column grow bt1-solid">
					<div class="p1">INSPECTOR</div>

					<textarea
						on:keydown={onSelectedChange}
						class="flex grow b0-solid bt1-solid w100pc"
						bind:value={w.ACTIVE.text} />
				</div>
			{/if}
		</section>
	</div>
</main>