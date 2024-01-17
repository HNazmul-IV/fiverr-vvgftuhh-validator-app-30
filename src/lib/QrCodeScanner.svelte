<script>
	import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';

	/** @type {HTMLVideoElement}  */
	let videoElement;
	let cameras;
	/** @type {import("html5-qrcode").Html5QrcodeScanner} */
	let scanner;
	/** @type {import("html5-qrcode").Html5QrcodeResult[] | []}*/
	let result = [];

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const html5QrCodeScanner = (await import('html5-qrcode')).Html5QrcodeScanner;
		await tick();
		scanner = new html5QrCodeScanner(
			'qrcode-renderer',
			{
				fps: 10,
				// aspectRatio: 3 / 4,
				qrbox: { width: 150, height: 150 },
				showTorchButtonIfSupported: true
			},

			false
		);
		scanner.render(onScanSuccess, onScanFailed);

		async function onScanSuccess(_decodedText, _result) {
			if (_result) {
				dispatch('success', _result);
				result = [...result, _result];
				scanner.pause(true);
			}
		}
		function onScanFailed(e) {}
	});

	onDestroy(() => {
		if (!scanner) return;
		scanner.clear().catch((e) => console.log('Failed to clear HTML5QRcode Scanner'));
	});
</script>

<div class="fixed top-0 left-0 bg-black/50 z-50 grid place-items-center w-full h-full">
	<div
		class="w-full max-w-[360px] bg-white h-[calc(100vh_-_100px)] sm:h-[600px] flex flex-col justify-between shadow-2xl rounded-lg p-1"
		id=""
	>
		<div class=" rounded-lg overflow-hidden" id="qrcode-renderer"></div>
		<div class="">
			{#if result.length}
				{#each result as r}
					<p class="bg-green-200 p-2 rounded-md mb-2 text-xs w-11/12 mx-auto">
						{@html r.decodedText}
					</p>
				{/each}

				<div class="flex flex-wrap gap-2">
					<button
						on:click={() => dispatch('insert', result)}
						class=" px-4 py-1 w-full flex-[0_0_100%] text-green-600 border-2 border-current rounded-lg hover:bg-green-200 active:text-white active:bg-green-600 active:border-green-600"
						>Insert</button
					>
					<button
						on:click={() => dispatch('close', result)}
						class=" px-4 py-1 w-[45%] flex-[1_1_auto] text-red-600 border-2 border-current rounded-lg hover:bg-red-200 active:text-white active:bg-red-600 active:border-red-600"
					>
						Cancel</button
					>
					<button
						on:click={() => scanner.resume()}
						class=" px-4 py-1 w-[45%] flex-[1_1_auto] text-cyan-600 border-2 border-current rounded-lg hover:bg-cyan-200 active:text-white active:bg-cyan-600 active:border-cyan-600"
						>Scan Another</button
					>
				</div>
			{:else}
				<button
					on:click={() => dispatch('close')}
					class=" px-4 py-1 w-full text-red-600 border border-current rounded-lg hover:bg-red-200 active:text-white active:bg-red-600 active:border-red-600"
					>Close</button
				>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.mut-layer {
		clip-path: polygon(
			0% 0%,
			0% 100%,
			20% 100%,
			20% 30%,
			80% 30%,
			80% 70%,
			20% 70%,
			20% 100%,
			100% 100%,
			100% 0%
		);
	}
</style>
