<script lang="ts">
	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from './Toasts';

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
				method: 'POST',
				body: JSON.stringify({
					token: verifyInput
				})
			});
			statusCode = response.status;
		} catch (error) {
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
		if (statusCode == 401) {
			toastStore.trigger(createToast('The code has expired. We have sent you a new one!', 'error'));
		} else if (statusCode == 404) {
			toastStore.trigger(createToast('The code is not correct', 'error'));
		} else if (statusCode == 200) {
			toastStore.trigger(createToast('Account successfully verified', 'success'));
		}
	}
	async function resendToken() {
		const url = 'http://localhost:3000/api/v1' + '/users/mabu2807/activate';
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
	<div class="card w-[40vw] h-[60vh] p-5">
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
