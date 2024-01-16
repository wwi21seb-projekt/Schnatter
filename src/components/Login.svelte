<script lang="ts">
	import LoginInput from './LoginInput.svelte';
	import { t } from '../i18n';
	import { Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { createToast } from '$lib/Toasts';
	import { refreshToken, registerUsername, serverURL, token } from '$lib/Store';
	import type { Login } from '$lib/types/Login';
	import type { CustomError } from '$lib/types/CustomError';

	initializeStores();
	const toastStore = getToastStore();

	let username: string = '';
	let password: string = '';
	let statusCode: number = 0;

	function handleUsernameInput(event: Event) {
		username = (event.target as HTMLInputElement).value;
	}

	function handlePasswordInput(event: Event) {
		password = (event.target as HTMLInputElement).value;
	}

	$: allInputFieldsFilled = password.length != 0 && username.length != 0;
	async function handleSubmit() {
		let customError: CustomError = {
			message: '',
			code: ''
		};
		let serverUrl: string = '';
		serverURL.subscribe((prev_val) => (serverUrl = prev_val));
		try {
			const url = serverUrl + '/users/login';
			const response = await fetch(url, {
				mode: 'cors',
				method: 'POST',

				body: JSON.stringify({
					username: username,
					password: password
				})
			});
			statusCode = response.status;
			if (statusCode !== 200) {
				const body = await response.json();
				customError = body.error;
			}
			if (statusCode !== 200 && statusCode !== 500 && statusCode !== 403) {
				toastStore.trigger(createToast(customError.message, 'error'));
			} else if (statusCode == 200) {
				const requestData: Login = await response.json();
				token.set(requestData.token);
				refreshToken.set(requestData.refreshToken);
				location.reload();
			} else if (statusCode == 403) {
				registerUsername.set(username);
				goto('/verify');
			}
		} catch (error) {
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
	}
</script>

<Toast />
<div class="pt-8">
	<div class="justify-center">
		<div class=" p-2 h4 text-center font-bold">{$t('login.header.title')}</div>
		<div class="h-[50vh] flex flex-col">
			<form class="flex flex-col justify-around items-center w-full" on:submit={handleSubmit}>
				<div class="flex flex-col w-full px-3 pb-2">
					<LoginInput
						value={username}
						iconString="ic:outline-email"
						placeholder={$t('login.placeholder.username')}
						type="text"
						onInput={handleUsernameInput}
						id="email"
					/>
				</div>
				<div class="flex flex-col w-full px-3 pt-2">
					<LoginInput
						value={password}
						iconString="mdi:lock-outline"
						placeholder={$t('login.placeholder.password')}
						onInput={handlePasswordInput}
						type="pwd"
						id="pwd"
					/>
				</div>

				<div class="flex flex-row mt-3 justify-center text-center">
					<button
						on:click={handleSubmit}
						disabled={!allInputFieldsFilled}
						class="btn variant-filled-primary"
						type="submit">{$t('login.submit.btn')}</button
					>
				</div>
			</form>
			<div class="p-2 text-sm text-center">
				<p>
					{$t('login.subtitle.noaccount')}
					<a class="text-blue-700" href="/register">{$t('login.subtitle.signup')}</a>
				</p>
			</div>
		</div>
	</div>
</div>
