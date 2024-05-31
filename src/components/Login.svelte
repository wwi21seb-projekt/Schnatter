<script lang="ts">
	import LoginInput from './LoginInput.svelte';
	import { t } from '../i18n';
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { createToast } from '$lib/Toasts';
	import { globalUsername, refreshToken, registerUsername, serverURL, token } from '$lib/Store';
	import type { Login } from '$lib/types/Login';
	import type { CustomError } from '$lib/types/CustomError';
	import { get } from 'svelte/store';
	import { subscribeUserToPush } from '../push';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import ModalForgotPwd from './modals/ModalForgotPwd.svelte';

	const modalStore = getModalStore();

	const modalComponent: ModalComponent = { ref: ModalForgotPwd };

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	function openForgotPwd() {
		modalStore.trigger(modal);
	}

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

		const serverUrl = get(serverURL);
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
				toastStore.clear();
				toastStore.trigger(createToast(customError.message, 'error'));
			} else if (statusCode == 200) {
				const requestData: Login = await response.json();
				token.set(requestData.token);
				refreshToken.set(requestData.refreshToken);
				globalUsername.set(username);
				await subscribeUserToPush();
				location.reload();
			} else if (statusCode == 403) {
				registerUsername.set(username);
				goto('/verify');
			}
		} catch (error) {
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		}
	}
</script>

<Toast />
<div class="pt-8">
	<div class="justify-center">
		<div class=" p-2 h4 text-center font-bold" title="logInHeading">{$t('login.header.title')}</div>
		<div class="h-[50vh] flex flex-col">
			<form
				class="flex flex-col justify-around items-center w-full"
				on:submit|preventDefault={handleSubmit}
			>
				<div class="flex flex-col w-full px-3 pb-2">
					<LoginInput
						value={username}
						iconString="mdi:user"
						placeholder={$t('login.placeholder.username')}
						type="text"
						onInput={handleUsernameInput}
						id="email"
					/>
				</div>
				<div class="flex flex-col w-full px-3 pt-2">
					<LoginInput
						value={password}
						iconString="mdi:password"
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
				<p>
					{$t('login.subtitle.forgotPwd')}
					<button class="text-blue-700" on:click={openForgotPwd}
						>{$t('login.subtitle.resetPwd')}</button
					>
				</p>
			</div>
		</div>
	</div>
</div>
