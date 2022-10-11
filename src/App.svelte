<script>
	import panzoom from 'panzoom'
	import { onMount } from 'svelte'
	import Panel from './Panel.svelte'
	import { SQUARE_CORNERS, LINES, ARROWS, BLOCKS, KEYS, LOREM } from './Defs.js'
	import { MODE_RECT, MODE_POINTER, MODE_SELECT, MODE_CHAR, SPACE, MODES } from './Defs.js'
	import { ALIGN_CENTER, ALIGN_END, ALIGN_START, ALIGN_JUSTIFY } from './Defs.js'
	import { INPUT_KEYS } from './Defs.js'

	import { setTextChars, setRectChars, setCharChars } from './Chars.js'
	import { onKeyup, onKeydown, onTextboxKeyup, onTextboxKeydown } from './Keys.js'
	import { _keys, _mode } from './Store.js'

	import Keyboard from './Keyboard.svelte'

	let STATES = {}

	let cursor = { start: {}, end: {} }
	let CURSOR = null

	const SAY = m => console.log(`[App] ${m}`)
	const w = window

	w.zoomEl = null
	w.canvasEl = null
	w.zoomTransform = {}

	w.DATA = []
	w.OUT = []
	w.FONTSIZE = 13
	w.HOVER = null
	w.HIGH = []
	w.ACTIVE = null
	w.width = 80
	w.height = 32



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

		}

		draw()
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

		if ( $_mode == MODE_RECT ) {
			SAY(' create rect')
			STATES[MODE_RECT] = true
			w.ACTIVE = {
				type: MODE_RECT,
				ref: createReference(),
				chars: [], // OUT
				...cursor,
				text: LOREM.substring(0,10), // PRE
				fill: 17,
				corner: 0,
				sides: 0,
				padding: 2,
				inited: false,
				alignX: ALIGN_START,
				alignY: ALIGN_CENTER,
			}
			w.DATA = [ w.ACTIVE, ...w.DATA ]
		} else if ( $_mode == MODE_CHAR ) {
			SAY(' create chars')
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
		} else if ( $_mode == MODE_SELECT ) {
			SAY(' create select')
			STATES[MODE_SELECT] = true
			w.ACTIVE = {
				type: MODE_SELECT,
				ref: createReference(),
				...cursor,
				inited: false
			}
			draw()
		} else if ($_mode == MODE_POINTER) {
			SAY(' create pointer')
			let layer = getLayer(y,x)
			if (!layer) {
				w.HIGH = []
				draw()
				return SAY(' no item clicked')
			}
			if (y == layer.end.y && x == layer.end.x) {
				IS_RESIZING = true
			} else {
				IS_MOVING = true
			}

			console.log(`[App] selected layer:`, layer)

			w.ACTIVE = layer 
			w.ACTIVE.origin = { ...cursor.start }
			w.ACTIVE.startOrigin = { ...w.ACTIVE.start }
			w.ACTIVE.endOrigin = { ...w.ACTIVE.end }

			setRectChars()
			setTextChars()
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
		if (STATES[MODE_CHAR]) STATES[MODE_CHAR] = false

		IS_RESIZING = false
		IS_MOVING = false

		if ( w.ACTIVE?.type == MODE_RECT) {
			if (w.ACTIVE.start.x == w.ACTIVE.end.x || w.ACTIVE.start.y == w.ACTIVE.end.y) {
				SAY(' deleting tiny rectangle')
				let cp = w.DATA
				cp.shift()
				w.DATA = cp


				let layer = getLayer(y,x)
				if (layer && $_mode == layer?.type) {
					console.log(`[App] selected with same tool type:`, layer)
					w.ACTIVE = layer 
				}
			} else {
				const { start, end } = w.DATA[0]
				SAY(' inited new rectangle:', start, end)
				w.DATA[0].inited = true
			}
		}

		draw()


	}

	function setHighChars(y,x) {
		if (!w.ACTIVE) return
		if (w.ACTIVE.type == MODE_RECT || w.ACTIVE.type == MODE_SELECT) {
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

	function awaitDraw() {
		w.requestAnimationFrame( draw )
	}

	// w.DB = null
	w.DB_TIMEOUT = null

	function draw() {

		SAY(`🌱 drawn`)
		setRectChars()
		setTextChars()
		setCharChars()

		w.HIGH = []

		const { start, end } = w.ACTIVE || {}
		const isBlock = (w.ACTIVE) ? w.ACTIVE.type == MODE_RECT || w.ACTIVE.type == MODE_SELECT : false

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

		if (w.DB_TIMEOUT) clearTimeout(w.DB_TIMEOUT)
		w.DB_TIMEOUT = setTimeout( e => {
			w.localStorage.setItem('DB', JSON.stringify(w.DATA))
			SAY(`💾 saved`)
		}, 1000)

	}

	onMount( async e => {
		try {
			SAY(`💾 loading...`)
			w.DATA = JSON.parse(w.localStorage.getItem('DB')) || []
			await awaitDraw()
			SAY(`💾 loaded`)
		} catch(err) {
			console.warn(`💾 nothing loaded`)
		}


        w.zoomer = panzoom( w.zoomEl, {
            maxZoom: 20,
            minZoom: 0.02,
            zoomDoubleClickSpeed: 1,
            filterKey: e => true,
            beforeMouseDown: e => {
            	return e.target.classList.contains('char')
            }
        })

        w.zoomer.on('transform', e => {
            w.zoomTransform = w.zoomer.getTransform()
        })
        w.zoomer.on('pan', e => {
        	w.isPanning = true
        })
        w.zoomer.on('panend', e => {
        	w.isPanning = false
        })
	})


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
		line-height: 1em;
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
		// SAY(' keydown ', e.code)
		$_keys[e.code] = true
		if (e.metaKey) metaKeys.push(e.code)
		onKeydown( e )
		draw()
	}
	const onKeyupPre = e => {
		// SAY(' keyup ', e.code)
		$_keys[e.code] = false
		if (metaKeys.length > 0) {
			for (const key of metaKeys) $_keys[key] = false
			metaKeys = []
		}
		onKeyup( e )
		draw()
	}

	function deselectAll() {
		console.log('?')
		w.ACTIVE = null
		w.HIGH = []
		draw()
	}

	function onTextboxKeydownPre(e) {
		onTextboxKeydown(e)
		awaitDraw()
	}

	w.mousecursor = ''
	w.isPanning = false

	function onWindowMousemove(e ) {
		const {classList} = e.target
		if (w.isPanning) return
		if (classList.contains('active')) {
			w.mousecursor = 'pointer'
		} else if (classList.contains('dragger')) {
			w.mousecursor = ''
		} else {
			w.mousecursor = ''
		}
	} 


</script>
<svelte:window 
	on:keydown={ onKeydownPre }
	on:keyup={ onKeyupPre }
	on:mousemove={ onWindowMousemove }
	on:mouseup={ e => STATES.pressed = false } />
<input type="text" id="capture" class="invisible hidden fixed" />
<main class="sassis sink fill monospace overflow-hidden b10-solid {w.mousecursor}">

		<div 
			on:mousedown={ deselectAll }
			class="dragger fill" />

		<div 
			bind:this={w.zoomEl}
			id="zoom"
			class="fill flex column-center-center">
			<div 
				bind:this={w.canvasEl}
				id="canvas"
				class="flex column-center-flex-start rel monospace user-select-none bg overflow-auto pop">
				{#each w.OUT as line, y}
					<div class="no-grow">
						{#each line as char, x}
							<span
								class:active={char}
								class:inactive={!char}
								style={fontStyle}
								class:b1-solid={w.HOVER?.y == y && w.HOVER?.x == x }
								class="char rel"
								class:filled={ w.HIGH?.[y]?.[x] }
								on:mousemove={e => onMousemove(y,x)}
								on:mouseup={e => onMouseup(y,x)}
								on:mousedown={e => onMousedown(y,x)}
								on:mouseover={e => onMouseover(y,x)}>
								{@html char || SPACE}
							</span>
						{/each}
					</div>
				{/each}
			</div>

		</div>







		<Panel title="Properties" right={20} top={100}>

			<div class="flex column-stretch-flex-start p0-5">
				{#if w.ACTIVE}

					{#if w.ACTIVE.type == MODE_RECT}
						<label>fill</label>
						<input 
							on:change={awaitDraw}
							type="number" 
							bind:value={w.ACTIVE.fill} />
						<label>corner</label>
						<input 
							on:change={awaitDraw}
							type="number" 
							bind:value={w.ACTIVE.corner} />
						<label>sides</label>
						<input 
							on:change={awaitDraw}
							type="number" 
							bind:value={w.ACTIVE.sides} />
						<label>x</label>
						<select 
							on:change={awaitDraw}
							bind:value={w.ACTIVE.alignX}>
							{#each [ALIGN_START,ALIGN_CENTER,ALIGN_END, ALIGN_JUSTIFY] as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
						<label>y</label>
						<select 
							on:change={awaitDraw}
							bind:value={w.ACTIVE.alignY}>
							{#each [ALIGN_START,ALIGN_CENTER,ALIGN_END] as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
						<label class="checkbox">
							<input 
								on:change={awaitDraw}
								type="checkbox" 
								bind:checked={w.ACTIVE.whitespace} />
							whitespace
							<span />
						</label>
					{/if}
				{:else}

					<span>fontsize</span>
					<input 
						type="number" 
						bind:value={w.FONTSIZE} />
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
		</Panel>

		<Panel title="Tools" left={20} top={50}>

			<nav id="toolbar" class="column flex">
				{#each Object.keys(MODES) as tool, idx}
					<div
						on:mousedown={ e => ($_mode = tool)}
						class:filled={$_mode == tool}
						class="bb p0-5 text-left">
						[{idx+1}] {tool}
					</div>
				{/each}
			</nav>
		</Panel>

		<Panel title="Input" left={20} bottom={20}>
			<Keyboard />
		</Panel>

		<Panel title="Layers" right={20} top={50}>
			<div id="layers" class="flex overflow-auto column grow">
				{#each w.DATA as layer, idx}
					{#if layer.inited}
						<div 
							on:click={e => setSelected(layer)}
							class="bb1-solid w100pc flex column">
							<header 
								class:filled={ layer?.ref == w.ACTIVE?.ref }
								class="pointer p0-5 w100pc flex row-space-between-center">
								<div>{layer.type}</div>
								<!-- <div class="flex row-stretch-stretch h100pc cp0-5  cbl1-solid">
									<div class="">S</div>
									<div class="">M</div>
								</div> -->
							</header>
						</div>
					{/if}
				{/each}
				{#if w.DATA.length == 0}

					<div class="grow w100pc flex row-center-center italic p0-5 fade">
						no layers
					</div>
				{/if}
			</div>
		</Panel>


			<Panel title="Text" right={20} bottom={20}>
				<div class="minh16em minw24em grow flex column">
					{#if w.ACTIVE?.type == MODE_RECT}
						<textarea
							on:keyup={onTextboxKeyup}
							on:keydown={onTextboxKeydownPre}
							class="flex grow w100pc h100pc grow b0-solid"
							rows="4"
							bind:value={w.ACTIVE.text} />
					{:else}
						<div class="grow w100pc flex row-center-center italic p0-5 fade">
							nothing selected
						</div>
					{/if}
				</div>
			</Panel>
</main>