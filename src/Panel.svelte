<script>

	import {onMount} from 'svelte'
	export let title = ''
	export let top = null
	export let left = null
	export let right = null
	export let bottom = null
	export let minimised = false

	const SAY = m => console.log(`[Panel] ${m}`)
	const w = window

	$: x = left ? left : right * -1
	$: y = top ? top : bottom * -1
	$: key = `Panel_${title.replaceAll(' ', '_')}`

	let grabbing = false
	let og = null
	let store = null

	onMount(async e => {
		if (title != '') {
			try {
				const o = JSON.parse(w.localStorage.getItem(key))
				top = o.top
				left = o.left
				right = o.right
				bottom = o.bottom
				minimised = o.minimised
				SAY(`💠 loaded ${key} positions`)
				console.log({top,left,right,bottom})
			} catch(err) {}
		}
	})

	let timeout = null
	$: (o => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(e => {
			SAY(`💠 stored`)
			w.localStorage.setItem( key, JSON.stringify({top,left,right,bottom,minimised}))
		}, 400)
	})({top,left,right,bottom,minimised})

	function onMousemove(e) {
		if (grabbing) {
			const {clientX, clientY} = e
			if (left != null) left = store.left - (og.clientX - clientX)
			if (right != null) right = store.right + (og.clientX - clientX)
			if (top != null) top = store.top - (og.clientY - clientY)
			if (bottom != null) bottom = store.bottom + (og.clientY - clientY)

		}
	}

	// function setBoundaries(e) {
	// 	if (left != null) {
	// 		if (left < 0) left = 0
	// 	}
	// }
	function onMouseup(e) {
		if (w.zoomer) w.zoomer.resume()
		grabbing = false
	}

	function onMousedown(e) {
		if (w.zoomer) w.zoomer.pause()
		const no = ['textarea','number','text']
		if (no.indexOf(e.target.type) != -1) return
		grabbing = true
		const {clientX, clientY} = e
		og = {clientX, clientY}
		store = {top,left,right,bottom}
		
	}
</script>

<svelte:window on:mouseup={onMouseup} on:mousemove={onMousemove} />

<div 
	class:t0={top}
	class:l0={left}
	class:r0={right}
	class:b0={bottom}
	on:mousedown={onMousedown}
	style="transform: translate({x}px, {y}px)"
	class="flex column abs">
	<header 
		class="flex row bb pop border">
		<div 
			class="grow p0-5 minh2em">
			{title}
		</div>
		<div 
			class="pointer p0-5 flex">
			<div 
				on:click={e => (minimised = !minimised)}
				class:dash={minimised}
				class="minw1em border clickable" />
		</div>
	</header>
	<div 
		class="flex column"
		class:invisible={minimised}>
		<div class="bg flex column bl br bb">
			<slot />
		</div>
	</div>
</div>