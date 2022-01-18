<script>

	import { SQUARE_CORNERS, LINES, ARROWS, BLOCKS, KEYS, LOREM } from './Defs.js'
	import { MODE_RECT, MODE_TEXT, MODE_POINTER, MODE_SELECT, MODE_CHAR, SPACE } from './Defs.js'
	import { ALIGN_CENTER, ALIGN_END, ALIGN_START, ALIGN_JUSTIFY } from './Defs.js'
	import { INPUT_KEYS } from './Defs.js'

	import { setTextChars, setRectChars, setCharChars } from './Chars.js'
	import { onKeyup, onKeydown } from './Keys.js'
	import { _KEYCODES, _KEYBOARD_ACTIVE } from './Store.js'

	import Keyboard from './Keyboard.svelte'

	let STATES = {}

	let cursor = { start: {}, end: {} }
	let CURSOR = null

	const w = window

	w.DATA = []
	w.OUT = []
	w.FONTSIZE = 13
	w.MODE= MODE_CHAR
	w.HOVER = null
	w.HIGH = []
	w.ACTIVE = null
	w.width = 40
	w.height = 20

	w.TOOLS = {
		[MODE_POINTER]: {},
		[MODE_SELECT]: {},
		[MODE_RECT]: {},
		[MODE_TEXT]: {},
		[MODE_CHAR]: {}
	}


	w.KEYCODES = {}


	function createReference() {
		return { date: new Date() }
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
			w.HIGH = []
			draw()
		}
	}

	let IS_MOVING = false
	let IS_RESIZING = false

	function onMouseover(y,x) {
		// w.HOVER = { y, x }

	}

	function onMousedown(y,x) {

		STATES.pressed = true
		w.ACTIVE = false

		cursor.start = { y, x }
		cursor.end = { y, x }

		if ( w.MODE== MODE_RECT ) {
			console.log('[App] create rect')
			STATES[MODE_RECT] = true
			w.ACTIVE = {
				type: MODE_RECT,
				ref: createReference(),
				chars: [], // OUT
				...cursor,
				fill: 17,
				text: '', // PRE
				corner: 0,
				sides: 0,
				inited: false
			}
			w.DATA = [ w.ACTIVE, ...w.DATA ]
		} else if ( w.MODE== MODE_TEXT ) {
			console.log('[App] create text')
			STATES[MODE_TEXT] = true
			w.ACTIVE = {
				type: MODE_TEXT,
				ref: createReference(),
				chars: [], // OUT
				...cursor,
				text: 'Hello world', // PRE
				inited: false,
				alignX: ALIGN_CENTER,
				alignY: ALIGN_CENTER
			}
			w.DATA = [ w.ACTIVE, ...w.DATA ]
		} else if ( w.MODE== MODE_CHAR ) {
			console.log('[App] create chars')
			STATES[MODE_CHAR] = true
			w.ACTIVE = {
				type: MODE_CHAR,
				ref: createReference(),
				chars: [], // OUT
				...cursor,
				origin: { ...cursor.start },
				inputs: {}, // PRE
				inited: false
			}
			w.DATA = [ w.ACTIVE, ...w.DATA ]
		} else if ( w.MODE== MODE_SELECT ) {
			console.log('[App] create select')
			STATES[MODE_SELECT] = true
			w.ACTIVE = {
				type: MODE_SELECT,
				ref: createReference(),
				...cursor,
				inited: false
			}
			draw()
		} else if (w.MODE== MODE_POINTER) {
			console.log('[App] create pointer')
			let layer = getLayer(y,x)
			if (!layer) {
				w.HIGH = []
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

			if (layer.type == MODE_RECT) setRectChars()
			if (layer.type == MODE_TEXT) setTextChars()
			draw()
		}
	}


	let lastMouseMove = {}

	function onMousemove(y,x) {
		if (!STATES.pressed) return // create dragging only
		if (lastMouseMove.x == x && lastMouseMove.y == y) return

		// set w.HIGH area

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
			console.log(`[App] drag move`)
			const { origin, startOrigin, endOrigin, type } = w.ACTIVE

			w.ACTIVE.start.x = startOrigin.x + ( x - origin.x )
			w.ACTIVE.end.x = endOrigin.x + ( x - origin.x )
			w.ACTIVE.start.y = startOrigin.y + ( y - origin.y )
			w.ACTIVE.end.y = endOrigin.y + ( y - origin.y )

			w.HIGH = []

			draw()
		}

		// resize

		else if ( IS_RESIZING && w.ACTIVE ) {
			console.log(`[App] drag resizing`)
			const { origin, startOrigin, endOrigin, type } = w.ACTIVE

			w.ACTIVE.end.x = endOrigin.x + ( x - origin.x )
			w.ACTIVE.end.y = endOrigin.y + ( y - origin.y )


			w.HIGH = []

			draw()
		}
		// rectangle

		else if (STATES[MODE_RECT]) {
			console.log(`[App] drag rectangle`)
			w.ACTIVE.start = start
			w.ACTIVE.end = end

			draw()
		}
		// textbox

		else if (STATES[MODE_TEXT]) {
			console.log(`[App] drag textbox`)
			w.ACTIVE.start = start
			w.ACTIVE.end = end

			draw()
		}
		// textbox

		else if (STATES[MODE_SELECT]) {
			console.log(`[App] drag select`)
			w.ACTIVE.start = start
			w.ACTIVE.end = end
			draw()
		}
		// char
		else if (STATES[MODE_CHAR]) {
			console.log(`[App] drag chars`)
			w.ACTIVE.start = start
			w.ACTIVE.end = end
			draw()
		}


	}  

	function onMouseup(y,x) {
		STATES.pressed = false


		if (STATES[MODE_SELECT]) {
			STATES[MODE_SELECT] = false
			w.ACTIVE.start = cursor.start
			w.ACTIVE.end = {y,x}
		}
		if (STATES[MODE_RECT]) STATES[MODE_RECT] = false
		if (STATES[MODE_TEXT]) STATES[MODE_TEXT] = false
		if (STATES[MODE_CHAR]) STATES[MODE_CHAR] = false

		IS_RESIZING = false
		IS_MOVING = false

		if ( w.ACTIVE?.type == MODE_RECT || w.ACTIVE?.type == MODE_TEXT) {
			if (w.ACTIVE.start.x == w.ACTIVE.end.x || w.ACTIVE.start.y == w.ACTIVE.end.y) {
				console.log('[App] deleting tiny rectangle')
				let cp = w.DATA
				cp.shift()
				w.DATA = cp


				let layer = getLayer(y,x)
				if (layer && w.MODE== layer?.type) {
					console.log(`[App] selected with same tool type:`, layer)
					w.ACTIVE = layer 
				}
			} else {
				const { start, end } = w.DATA[0]
				console.log('[App] inited new rectangle:', start, end)
				w.DATA[0].inited = true
			}
		}

		draw()


	}

	function setHighChars(y,x) {
		if (!w.ACTIVE) return
		if (w.ACTIVE.type == MODE_RECT || w.ACTIVE.type == MODE_TEXT || w.ACTIVE.type == MODE_SELECT) {
			return (x >= w.ACTIVE.start.x && x <= w.ACTIVE.end.x) && (y >= w.ACTIVE.start.y && y <= w.ACTIVE.end.y)
		}
	}

	let lastWidth, lastHeight
	$: ((w,h) => {
		if (w != lastWidth || h != lastHeight) {
			draw()
			lastWidth = w
			lastHeight = h
		}
	})(w.width,w.height)


	function draw() {

		console.log(`[App] draw`)
		setRectChars()
		setTextChars()
		setCharChars()

		w.HIGH = []

		const { start, end } = w.ACTIVE || {}
		const isBlock = (w.ACTIVE) ? w.ACTIVE.type == MODE_RECT || w.ACTIVE.type == MODE_TEXT || w.ACTIVE.type == MODE_SELECT : false

		// const spans = document.getElementById('canvas')?.querySelectorAll('span') || []

		let i = 0
		for (let y = 0; y < w.height; y++) {
			for (let x = 0; x < w.width; x++) {

				if (!w.OUT[y]) w.OUT[y] = []
				const char = getChar(y,x)
				if (w.OUT[y][x] != char || w.OUT[y][x] == undefined ) w.OUT[y][x] = char

				// if (spans[i]) spans[i].innerText = w.OUT[y][x] || SPACE

				const withinX = (x >= start?.x && x <= end?.x)
				const withinY = (y >= start?.y && y <= end?.y)
				if (!w.HIGH[y]) w.HIGH[y] = []
				w.HIGH[y][x] = (withinX && withinY)

				i += 1
			}
		}
	}


	function getChar( y, x ) {
		for (let layer of w.DATA) if ( layer?.chars?.[y]?.[x] ) return layer.chars[y][x]
		return null
	}
	function getLayer( y, x ) {
		for (let layer of w.DATA) if ( layer?.chars?.[y]?.[x] ) return layer
		return null
	}



	$: fontStyle = `
		font-size: ${w.FONTSIZE}px;
		width: ${Math.round(w.FONTSIZE * 0.6)}px;
		max-width: ${Math.round(w.FONTSIZE * 0.6)}px;
		min-width: ${Math.round(w.FONTSIZE * 0.6)}px;
	`
	$: outlineStyle = !w.ACTIVE ? '' : `
		transform: 
		translate(${w.ACTIVE?.start?.x*8}px, ${w.ACTIVE?.start?.y}em);
		width: ${(w.ACTIVE?.end?.x-w.ACTIVE?.start?.x)*8}px;
		height: ${w.ACTIVE?.end?.y-w.ACTIVE?.start?.y}em;
	`

	let metaKeys = []

	const onKeydownPre = e => {
		console.log('[App] keydown ', e.code)
		$_KEYCODES[e.code] = true
		if (e.metaKey) metaKeys.push(e.code)
		onKeydown( e, $_KEYCODES )
		draw()
	}
	const onKeyupPre = e => {
		console.log('[App] keyup ', e.code)
		$_KEYCODES[e.code] = false
		if (metaKeys.length > 0) {
			for (const key of metaKeys) $_KEYCODES[key] = false
			metaKeys = []
		}
		onKeyup( e, $_KEYCODES )
		draw()
	}

</script>
<svelte:window 
	on:keydown={ onKeydownPre }
	on:keyup={ onKeyupPre }
	on:mouseup={ e => STATES.pressed = false } />
<input type="text" id="capture" class="invisible hidden fixed" />
<aside class="sassis fixed l0 b0 p1 maxw24em filled z-index99 flex column cmb0-2 none">
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
		{#each w.DATA as layer, idx}
			<span>{idx+1} {layer.type}</span>
		{/each}
	</div>
</aside>
<main class="sassis bg fill flex flex column monospace">
	<nav class="bb1-solid p1 h3em flex row-space-between-center ">
		<div class="flex row-flex-start-center cmr1 w100pc">
			{#if w.ACTIVE}

				{#if w.ACTIVE.type == MODE_RECT}
					<span>fill</span>
					<input 
						on:change={draw}
						type="number" 
						bind:value={w.ACTIVE.fill} />
					<span>corner</span>
					<input 
						on:change={draw}
						type="number" 
						bind:value={w.ACTIVE.corner} />
					<span>sides</span>
					<input 
						on:change={draw}
						type="number" 
						bind:value={w.ACTIVE.sides} />
				{:else if w.ACTIVE.type == MODE_TEXT}

					<span>x</span>
					<select 
						on:change={draw}
						bind:value={w.ACTIVE.alignX}>
						{#each [ALIGN_START,ALIGN_CENTER,ALIGN_END, ALIGN_JUSTIFY] as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
					<span>y</span>
					<select 
						on:change={draw}
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
					bind:value={w.width} />

				<span>height</span>
				<input 
					type="number" 
					bind:value={w.height} />
			{/if}
		</div>
	</nav>
	<!-- 
								class:filled={ w.HIGH?.[y]?.[x] } -->
	<div 
		class="grow mode-{MODE} w100vw overflow-hidden flex row-flex-start-flex-start">
		<nav id="toolbar" class="column flex bb1-solid br1-solid h100pc ">
			{#each Object.keys(w.TOOLS) as tool, idx}
				<button
					on:mousedown={ e => (w.MODE= tool)}
					class:filled={w.MODE== tool}
					class="b0-solid text-left">
					[{idx+1}] {tool}
				</button>
			{/each}
		</nav>
		<div 
			id="workspace"
			class="grow flex column-center-flex-start rel block h100pc p1 overflow-hidden bg">
			<div 
				id="canvas"
				class="flex grow column-center-flex-start rel monospace user-select-none overflow-auto">
				{#each w.OUT as line, y}
					<div class="no-grow sink">
						{#each line as char, x}
							<span
								style={fontStyle}
								class:b1-solid={w.HOVER?.y == y && w.HOVER?.x == x }
								class="char rel"
								class:pop={ w.HIGH?.[y]?.[x] }
								on:mousemove={e => onMousemove(y,x)}
								on:mouseup={e => onMouseup(y,x)}
								on:mousedown={e => onMousedown(y,x)}
								on:mouseover={e => onMouseover(y,x)}>
								{@html char || SPACE}
							</span>
						{/each}
					</div>
				{/each}
				<!-- {#each new Array(w.height) as line, y}
					<div class="no-grow pop">
						{#each new Array(w.width) as char, x}
							<span
								class="char rel"
								on:mousemove={e => onMousemove(y,x)}
								on:mouseup={e => onMouseup(y,x)}
								on:mousedown={e => onMousedown(y,x)}
								on:mouseover={e => onMouseover(y,x)}>
								{@html 'x'}
							</span>
						{/each}
					</div>
				{/each} -->
			</div>

			<Keyboard />

		</div>
		<section id="panel" class="column flex column-space-between-flex-start bb1-solid bl1-solid h100pc grow w16em maxw16em minw16em">
			<div id="layers" class="flex overflow-auto column grow">
				{#each w.DATA as layer, idx}
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
				{#if w.ACTIVE.type == MODE_TEXT || w.ACTIVE.type == MODE_RECT }
					<div id="editor" class="flex column grow bt1-solid">
						<div class="p1">INSPECTOR</div>

						<textarea
							on:keydown={draw}
							class="flex grow b0-solid bt1-solid w100pc"
							bind:value={w.ACTIVE.text} />
					</div>
				{/if}
			{/if}
		</section>
	</div>
</main>