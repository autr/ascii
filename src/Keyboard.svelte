<script>

	import { MODE_CHAR, KEYS, KEYS_ICONS, BLOCKS, SQUARE_CORNERS, LINES, DIAGONAL, ARROWS, BOARDS } from './Defs.js'
	import { _KEYCODES, _KEYBOARD_ACTIVE, _KEYBOARD_INDEX } from './Store.js'

	const pattern = [12,12,10]

	const w = window
	$: current = BOARDS[$_KEYBOARD_INDEX]

	let activeElement

	function setActiveElement(event) {
		activeElement = document.activeElement
		const _EXC = ['textarea','number','text']
		$_KEYBOARD_ACTIVE = _EXC.indexOf(activeElement.type) != -1 || w.MODE == MODE_CHAR
	}
	
	document.addEventListener('focus', setActiveElement, true)
	document.addEventListener('blur', setActiveElement, true)

</script>

<aside 
	id="keyboard" 
	class:fade={!$_KEYBOARD_ACTIVE}
	class="flex column w100pc bl1-solid bt1-solid">
	{#each pattern as count, idx}
		<div 
			class="flex row">

			{#each new Array(count) as num, i}

				<div 
					class:fade={!$_KEYBOARD_ACTIVE}
					class:filled={$_KEYBOARD_ACTIVE && $_KEYCODES[KEYS[i+(idx*12)]]}
					class="grow ptb0-5 pointer flex column-center-center br1-solid bb1-solid no-basis"
					class:none={!current[i+(idx*12)]}>
					<span class="pb0-4">{KEYS_ICONS[i+(idx*12)]} </span> 
					<span>{current[i+(idx*12)]}</span>
				</div>
			{/each}
			{#if count == 10}
				<span class="grow" />
				<span class="grow" />
			{/if}
		</div>
	{/each}

</aside>