<script lang="ts">
	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		InternalServerError,
		otherError,
		resendTokenSuccess,
		tokenExpierd,
		tokenNotFound,
		verifySuccess
	} from './Toasts';

	initializeStores();
	const toastStore = getToastStore();

	let verifyInput: string = '';
	let statusCode: number = 0;

	function handleInput(event: Event) {
		const newValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
		verifyInput = newValue.slice(0, 6);
	}

	async function handleSubmit() {
		const url = 'http://localhost:3000/api/v1' + '/users/mabu2807/activate';
		try {
			const response = await fetch(url, {
				body: JSON.stringify({
					token: verifyInput
				})
			});
			statusCode = response.status;
		} catch (error) {
			toastStore.trigger(InternalServerError);
		}
		if (statusCode == 401) {
			toastStore.trigger(tokenExpierd);
		} else if (statusCode == 404) {
			toastStore.trigger(tokenNotFound);
		} else if (statusCode == 200) {
			toastStore.trigger(verifySuccess);
		} else {
			toastStore.trigger(otherError);
		}
	}
	async function resendToken() {
		const url = 'http://localhost:3000/api/v1' + '/users/mabu2807/activate';
		try {
			const response = await fetch(url);
			statusCode = response.status;
		} catch (error) {
			toastStore.trigger(InternalServerError);
		}
		statusCode = 204;
		if (statusCode == 204) {
			toastStore.trigger(resendTokenSuccess);
		}
	}
	$: formCorrectCode = verifyInput.length == 6;
</script>

<Toast />
<main class="flex justify-center items-center w-screen h-screen">
	<div class="card w-[40vw] h-[50vh] p-5">
		<h2 class="h2">Verify your Account</h2>

		<form class="w-full h-full flex flex-col items-center justify-around">
			<p>
				Please verify your account. You have received an email to the specified email address!
				Please enter the code it contains here:
				<button on:click={resendToken} class="btn bg-transparent text-blue-800">
					request new code</button
				>
			</p>
			<input
				bind:value={verifyInput}
				on:input={handleInput}
				class="input variant-form-material w-[80px]"
				placeholder="XXXXXX"
			/>

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
