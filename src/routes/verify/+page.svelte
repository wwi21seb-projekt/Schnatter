<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/utils/Toasts';
	import { registerUsername } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { CustomError } from '$lib/types/CustomError';
	import { t } from '../../i18n';
	import { get } from 'svelte/store';
	import { resendToken, verifyUser } from '$lib/utils/Verify';

	const toastStore = getToastStore();

	let verifyInput: string = '';
	let statusCode: number = 0;

	function handleInput(event: Event) {
		const newValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
		verifyInput = newValue.slice(0, 6);
	}

	async function handleSubmit() {
		let customError: CustomError = {
			message: '',
			code: ''
		};
		try {
			const response = await verifyUser(get(registerUsername), verifyInput);
			statusCode = response.status;
			if (statusCode !== 200) {
				const body = await response.json();
				customError = body.error;
			}
		} catch (error) {
			toastStore.trigger(createToast(customError.message, 'error'));
		}
		if (statusCode == 200) {
			goto('/');
		}
	}
	async function resend() {
		try {
			const response = await resendToken(get(registerUsername));
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

<main class="flex justify-center items-center w-screen h-screen mt-[90px]">
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
				<button on:click={resend} class="btn bg-transparent text-blue-400">
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
