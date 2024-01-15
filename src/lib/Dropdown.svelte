<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { useOutsideClick } from '$lib';
	let dropdownEl;

	/**
	 * @type {{label:string,value:string}[] | []}
	 */
	export let data = [];
	let isItemShow = false;

	$: data_to_render = data;

	/** @type {{label:string,value:string} | undefined}*/
	let selected = undefined;

	const dispatch = createEventDispatcher();

	function handleSearching(event) {
		const search_text = event.currentTarget.value;

		// @ts-ignore
		data_to_render = [...data.filter((value) => value.value.startsWith(search_text.toLowerCase()))];
	}

	$: if (isItemShow) {
		tick().then(() => {
			dropdownEl.querySelector('#dropdown-search-input').focus();
		});
	}
</script>

<div bind:this={dropdownEl} class="dropdown relative group">
	{#if isItemShow}
		<input
			class="text-left border w-full py-2 px-4 rounded-md"
			id="dropdown-search-input"
			placeholder="Search..."
			on:input={handleSearching}
			on:click={() => (isItemShow = true)}
		/>
	{:else if selected !== undefined}
		<button
			class="text-left px-4 border w-full py-2 rounded-md"
			on:click={() => (isItemShow = true)}>{selected.label}</button
		>
	{:else}
		<button
			class="text-left px-4 border w-full py-2 rounded-md"
			on:click={() => (isItemShow = true)}>Select Country</button
		>
	{/if}
	{#if isItemShow}
		<div
			class="dropdown-content absolute bg-white w-full border top-[105%] max-h-[250px] rounded-lg shadow-lg overflow-auto"
			use:useOutsideClick={[dropdownEl.querySelector('#dropdown-search-input')]}
			on:outclick={() => (isItemShow = false)}
		>
			<ul>
				{#if selected !== undefined}
					<li class="">
						<button
							tabindex="0"
							on:click={() => {
								selected = undefined;
								isItemShow = false;
							}}
							class="px-4 py-2 border-b hover:bg-blue-400 cursor-pointer hover:text-white w-full text-left focus:bg-blue-400 focus:text-white"
						>
							Clear Selection
						</button>
					</li>
				{/if}
				{#each data_to_render as d}
					<li class="">
						<button
							tabindex="0"
							on:click={() => {
								selected = d;
								isItemShow = false;
							}}
							class="px-4 py-2 border-b hover:bg-blue-400 cursor-pointer hover:text-white w-full text-left focus:bg-blue-400 focus:text-white"
						>
							{@html d.label}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
