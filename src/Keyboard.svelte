<script>

	import { MODE_CHAR, KEYS, KEYS_ICONS, BLOCKS, SQUARE_CORNERS, LINES, DIAGONAL, ARROWS, BOARDS, BOARD_NAMES, INPUT_ELEMENTS } from './Defs.js'
	import { _keys, _showKeyboard, _keyboardIdx, _activeElement } from './Store.js'

	const pattern = [12,12,10]

	const w = window
	$: current = BOARDS[$_keyboardIdx]


	function setActiveElement(event) {
		$_activeElement = document.activeElement
		$_showKeyboard = INPUT_ELEMENTS.indexOf($_activeElement?.type) != -1 || w.MODE == MODE_CHAR
	}
	
	document.addEventListener('focus', setActiveElement, true)
	document.addEventListener('blur', setActiveElement, true)

	function onSetIndex(idx) {
		$_keyboardIdx = idx 
	}
</script>

<div class="flex column w100pc">
	<div class="flex row pb1">
		{#each BOARD_NAMES as name,idx }
			<div class="b1-solid pointer">
				<div 
					on:click={e => onSetIndex(idx)}
					class="flex bg row-center-center ptb0-5 plr1"
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
		{#each pattern as count, idx}
			<div 
				class="flex row">

				{#each new Array(count) as num, i}

					<div 
						class:fade={!$_showKeyboard}
						class:filled={$_showKeyboard && $_keys[KEYS[i+(idx*12)]]}
						class="grow ptb0-5 pointer flex column-center-center br1-solid bb1-solid no-basis bg"
						class:none={!current[i+(idx*12)]}>
						<span class="pb0-4">
							{KEYS_ICONS[i+(idx*12)].toLowerCase()}
						</span> 
						<span class="pop f2">{current?.[i+(idx*12)] || ''}</span>
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