<script>
	import QrCodeScanner from './../lib/QrCodeScanner.svelte';
	import Dropdown from './../lib/Dropdown.svelte';
	import { onMount } from 'svelte';

	/**
	 * @type {{label:string,value:string}[]}
	 */
	let country_list = [];

	/**
	 * @type {HTMLDivElement}
	 */
	let dropdownEl;

	let showQrCodeScanner = true;

	/** @type {import("html5-qrcode").Html5QrcodeResult | ''} */
	let qrCodeResult = '';

	onMount(() => {
		fetch('https://restcountries.com/v3.1/all?fields=name,flag')
			.then((res) => res.json())
			.then((data) => {
				data.sort((a, b) => (a.name.common > b.name.common ? 1 : -1));
				country_list = data.map((v) => ({
					value: v.name.common.toLowerCase(),
					label: `${v.flag} ${v.name.common}`
				}));
			});
	});
</script>

{#if showQrCodeScanner}
	<QrCodeScanner
		on:insert={(e) => {
			qrCodeResult = e.detail;
			showQrCodeScanner = false;
		}}
		on:close={() => (showQrCodeScanner = false)}
	/>
{/if}
<div
	class="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
	<div class="absolute bg-black opacity-70 inset-0 z-0"></div>
	<div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome!</h2>
		</div>

		<!-- Scan QR Code button container -->
		<div class="relative mb-4">
			{#if qrCodeResult}
				<p>{qrCodeResult.decodedText}</p>
			{/if}
			<button
				on:click={() => (showQrCodeScanner = true)}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
			>
				{qrCodeResult ? 'Scan Again' : 'Scan Qr Code'}
			</button>
		</div>

		<div class="max-w-2xl mx-auto mb-4">
			<Dropdown data={country_list} />
		</div>

		<form class="mt-8 space-y-6" action="#" method="POST">
			<input type="hidden" name="remember" value="true" />
			<div class="relative">
				<div class="absolute right-0 mt-4"></div>
			</div>

			<!-- Additional form content goes here -->

			<div>
				<button
					type="submit"
					class="w-full flex justify-center bg-indigo-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300"
				>
					Confirm
				</button>
			</div>
		</form>
	</div>
</div>
