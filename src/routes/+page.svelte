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

	let showModal = false;

	let showQrCodeScanner = false;

	/** @type {import("html5-qrcode").Html5QrcodeResult[] | []} */
	let qrCodeResult = [];

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

{#if showModal}
	<div class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
		<div class="bg-black opacity-70 inset-0 fixed"></div>
		<div
			class="w-full max-w-[480px] bg-white sm:max-h-[600px] h-auto flex flex-col justify-between shadow-2xl rounded-lg p-4 z-50"
		>
			<div class="rounded-lg overflow-hidden">
				<div class="text-center py-4">
					<h2 class="text-2xl font-bold text-gray-800 mb-4">Your Scanned Tickets</h2>
					{#each qrCodeResult as result (result)}
						<div class="mb-2">
							<button
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							>
								{result.decodedText}
							</button>
						</div>
					{/each}
				</div>
				<div class="flex justify-center">
					<button
						on:click={() => (showModal = false)}
						class="px-4 py-2 text-white bg-blue-500 border border-blue-500 font-semibold rounded-lg hover:bg-blue-600"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<div
	class="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
	<div class="absolute bg-black opacity-90 inset-0 z-0"></div>
	<div
		class="absolute bg-black opacity-30 inset-0 z-0"
		style={`background-image: url('aqua2.webp'); background-size: cover; `}
	></div>

	<div
		class="max-w-[552px] aspect-[4/3] flex flex-col w-full space-y-8 p-8 sm:p-14 bg-white rounded-xl z-10"
	>
		<!-- Scan QR Code button container -->
		<div class="flex-1 flex flex-col justify-around">
			<div class="text-center mt-7 mb-10">
				<h2 class="text-5xl font-medium text-gray-900">Welcome!</h2>
			</div>
			<div class="">
				<div class="relative mb-5">
					<button
						on:click={() => (showQrCodeScanner = true)}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-base mb-2 sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
					>
						{qrCodeResult.length ? 'Scan Again' : 'Scan Qr Code'}
					</button>
					{#if qrCodeResult.length > 0}
						<button
							on:click={() => (showModal = true)}
							class="bg-gray-50 border border-gray-300 text-yellow-900 text-base sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
						>
							View Tickets
						</button>
					{/if}
				</div>

				<div class="w-full mx-auto mb-4 sm:mb-8 text-base lg:text-lg">
					<Dropdown data={country_list} />
				</div>

				<form class="mt-8 space-y-8" action="#" method="POST">
					<input type="hidden" name="remember" value="true" />
					<div class="relative">
						<div class="absolute right-0 mt-4"></div>
					</div>

					<!-- Additional form content goes here -->

					<div>
						<button
							type="submit"
							class="w-full flex justify-center bg-indigo-800 text-gray-100 text-base sm:text-lg uppercase p-3 rounded-full tracking-wide
							 font-semibold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300"
						>
							Confirm
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
