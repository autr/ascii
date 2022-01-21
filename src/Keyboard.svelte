<script>

	import { MODE_CHAR, KEYS, KEYS_ICONS, BLOCKS, SQUARE_CORNERS, LINES, DIAGONAL, ARROWS, BOARDS, BOARD_NAMES, INPUT_ELEMENTS } from './Defs.js'
	import { _keys, _showKeyboard, _keyboardIdx, _activeElement } from './Store.js'

	const pattern = [12,12,10]

	const w = window


	function setActiveElement(event) {
		$_activeElement = document.activeElement
		$_showKeyboard = INPUT_ELEMENTS.indexOf($_activeElement?.type) != -1 || w.MODE == MODE_CHAR
	}
	
	document.addEventListener('focus', setActiveElement, true)
	document.addEventListener('blur', setActiveElement, true)

	function onSetIndex(idx) {
		$_keyboardIdx = idx 
	}

	let currentlyPressed = null
	function onKeyMousedown(i, ii) {
		const idx = i+(ii*12)
		currentlyPressed = idx
	}

	function isKeyActive(i, ii, kys, curp, show) {
		const idx = i+(ii*12)
		return ( ( kys[KEYS[idx]] && show ) || curp == idx)
	}

	function getKeyIcon(i, ii) {
		const idx = i+(ii*12)
		return KEYS_ICONS[idx].toLowerCase()
	}
	function getKeySymbol(i,ii,kidx) {
		const idx = i+(ii*12)
		return BOARDS[kidx]?.[idx] || ''
	}
</script>

<svelte:window on:mouseup={e => (currentlyPressed = null)} />
<div class="flex column w100pc">
	<div class="flex row">
		{#each BOARD_NAMES as name,idx }
			<div class="pointer">
				<div 
					on:mousedown={e => onSetIndex(idx)}
					class="flex bg row-center-center p0-5"
					class:filled={$_keyboardIdx == idx}>
					{name}
				</div>
			</div>
		{/each}
	</div>
	<div 
		id="keyboard" 
		class:fade={!$_showKeyboard}
		class="flex column w100pc bl1-solid bt1-solid">
		{#each pattern as count, ii}
			<div 
				class="flex row">

				{#each new Array(count) as num, i}

					<div 
						class:fade={!$_showKeyboard}
						class:filled={ isKeyActive(i, ii, $_keys, currentlyPressed, $_showKeyboard) }
						class="grow ptb0-5 pointer flex column-center-center br1-solid bb1-solid no-basis bg"
						on:mousedown={ e => onKeyMousedown(i, ii)}>
						<span class="pb0-4">
							{getKeyIcon(i,ii)}
						</span> 
						<span class="f3">{getKeySymbol(i,ii,$_keyboardIdx)}</span>
					</div>
				{/each}
				{#if count == 10}
					<span class="grow" />
					<span class="grow" />
				{/if}
			</div>
		{/each}

	</div>
</div>