<script lang="ts">
	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { registerUsername, serverURL } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { CustomError } from '$lib/types/CustomError';

	initializeStores();
	const toastStore = getToastStore();

	let verifyInput: string = '';
	let statusCode: number = 0;
	let username: string;

	function handleInput(event: Event) {
		const newValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
		verifyInput = newValue.slice(0, 6);
	}

	async function handleSubmit() {
		let serverUrl: string = '';
		let customError: CustomError = {
			message: '',
			code: ''
		};
		registerUsername.subscribe((prev_val) => (username = prev_val));
		serverURL.subscribe((prev_val) => (serverUrl = prev_val));
		const url = serverUrl + '/users/' + username + '/activate';
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token: verifyInput
				})
			});
			statusCode = response.status;
			if (statusCode !== 200) {
				const body = await response.json();
				customError = body.error;
			}
		} catch (error) {
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
		if (statusCode !== 200 && statusCode !== 500) {
			toastStore.trigger(createToast(customError.message, 'error'));
		} else if (statusCode == 200) {
			goto('/');
		}
	}
	async function resendToken() {
		let serverUrl: string = '';
		registerUsername.subscribe((prev_val) => (username = prev_val));
		serverURL.subscribe((prev_val) => (serverUrl = prev_val));
		const url = serverUrl + '/users/' + username + '/activate';
		try {
			const response = await fetch(url, {
				method: 'DELETE'
			});
			statusCode = response.status;
		} catch (error) {
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
		if (statusCode == 204) {
			toastStore.trigger(
				createToast('We have sent you a new code to your email address', 'success')
			);
		}
	}
	$: formCorrectCode = verifyInput.length == 6;
</script>

<Toast />
<main class="flex justify-center items-center w-screen h-screen">
	<div class="card lg:w-[40vw] md:w-[80vw] w-[95vw] h-[60vh] p-5">
		<h2 class="h2">Verify your Account</h2>

		<form class="w-full h-full flex flex-col items-center justify-around">
			<p>
				Please verify your account. Enter the 6-digit code from the email we sent you. If you have
				not received it, please also check your spam folder.
			</p>
			<div class="flex flex-col justify-center items-center">
				<input
					bind:value={verifyInput}
					on:input={handleInput}
					class="input variant-form-material w-[80px]"
					placeholder="XXXXXX"
				/>
				<button on:click={resendToken} class="btn bg-transparent text-blue-400">
					request new code</button
				>
			</div>

			<div class="flex flex-row items-center justify-around w-2/5">
				<a href="/"><button class="btn variant-filled-surface">Ask later</button></a>
				<button
					on:click={handleSubmit}
					disabled={!formCorrectCode}
					class="btn variant-filled-primary">Verify</button
				>
			</div>
		</form>
	</div>
</main>
