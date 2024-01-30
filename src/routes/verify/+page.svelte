<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { registerUsername, serverURL } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { CustomError } from '$lib/types/CustomError';
	import { t } from '../../i18n';

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
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
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
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		}
		if (statusCode == 204) {
			toastStore.trigger(createToast($t('toast.send.email'), 'success'));
		}
	}
	$: formCorrectCode = verifyInput.length == 6;
</script>

<main class="flex justify-center items-center w-screen h-screen">
	<div class="card lg:w-[40vw] md:w-[80vw] w-[95vw] h-[60vh] p-5">
		<h2 class="h2">{$t('verify.header')}</h2>

		<form class="w-full h-full flex flex-col items-center justify-around">
			<p>
				{$t('verify.explanation')}
			</p>
			<div class="flex flex-col justify-center items-center">
				<input
					bind:value={verifyInput}
					on:input={handleInput}
					class="input variant-form-material w-[80px]"
					placeholder="XXXXXX"
				/>
				<button on:click={resendToken} class="btn bg-transparent text-blue-400">
					{$t('verify.newCode')}</button
				>
			</div>

			<div class="flex flex-row items-center justify-around w-2/5">
				<a href="/"><button class="btn variant-filled-surface">{$t('verify.later')}</button></a>
				<button
					on:click={handleSubmit}
					disabled={!formCorrectCode}
					class="btn variant-filled-primary">{$t('verify.confirm')}</button
				>
			</div>
		</form>
	</div>
</main>
