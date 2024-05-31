<script lang="ts">
	import { changeIconColor, changeValidateIcon } from '$lib/ValidateInputs';
	import RegisterInput from '../RegisterInput.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { t } from '../../i18n';
	import { get } from 'svelte/store';
	import { serverURL, token } from '$lib/Store';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let username = '';
	let tokenString = '';
	let password = '';
	let repeatPassword = '';
	let validateIconPwd = '';
	let validateIconRepeatPwd = '';
	let validateIconPwdColor = '';
	let validateIconRepeatPwdColor = '';
	let tokenSent: boolean;
	let isPwdLongEnough: boolean;
	let hasPwdNumber: boolean;
	let hasPwdCapitalLetter: boolean;
	let hasPwdSmallLetter: boolean;
	let hasPwdSpecailCharacter: boolean;

	function handleUsernameInput(event: Event) {
		username = (event.target as HTMLInputElement).value;
	}

	function handleTokenInput(event: Event) {
		tokenString = (event.target as HTMLInputElement).value;
	}

	function handlePasswordInput(event: Event) {
		password = (event.target as HTMLInputElement).value;
		if (password.length != 0) {
			hasPwdCapitalLetter = /[A-Z]/.test(password);
			hasPwdSmallLetter = /[a-z]/.test(password);
			hasPwdNumber = /\d/.test(password);
			hasPwdSpecailCharacter = /[^\w]/.test(password);
			if (password.length >= 8) {
				isPwdLongEnough = true;
			} else {
				isPwdLongEnough = false;
			}
		}
		if (
			isPwdLongEnough &&
			hasPwdCapitalLetter &&
			hasPwdSmallLetter &&
			hasPwdNumber &&
			hasPwdSpecailCharacter
		) {
			validateIconPwd = changeValidateIcon(true);
		} else {
			validateIconPwd = changeValidateIcon(false);
		}
		if (password.length === 0) {
			validateIconPwd = '';
		}
		validateIconPwdColor = changeIconColor(validateIconPwd);
	}

	function handleRepeatPasswordInput(event: Event) {
		repeatPassword = (event.target as HTMLInputElement).value;
		if (password === repeatPassword) {
			validateIconRepeatPwd = changeValidateIcon(true);
		} else {
			validateIconRepeatPwd = changeValidateIcon(false);
		}
		if (repeatPassword.length === 0) {
			validateIconRepeatPwd = '';
		}
		validateIconRepeatPwdColor = changeIconColor(validateIconRepeatPwd);
	}

	$: areAllInputsCorrect =
		isPwdLongEnough &&
		hasPwdCapitalLetter &&
		hasPwdSmallLetter &&
		hasPwdSpecailCharacter &&
		hasPwdNumber &&
		password === repeatPassword;

	$: tokenSent = tokenSent;

	async function handleSubmit() {
		const serverUrl = get(serverURL) + '/users/' + username + '/reset-password';
		const response = await fetch(serverUrl, {
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + get(token)
			},
			body: JSON.stringify({
				token: tokenString,
				newPassword: password
			})
		});
		const statusCode = response.status;
		if (statusCode == 204) {
			toastStore.trigger(createToast($t('toast.pwdReset'), 'success'));
			modalStore.close();
		} else if (statusCode == 400) {
			toastStore.trigger(createToast($t('toast.userNotFound'), 'error'));
		} else if (statusCode == 403) {
			toastStore.trigger(createToast($t('toast.tokenInvalid'), 'error'));
		} else {
			toastStore.trigger(createToast($t('toast.sometingWrong'), 'error'));
		}
	}

	async function sendToken() {
		const serverUrl = get(serverURL) + '/users/' + username + '/reset-password';
		const response = await fetch(serverUrl, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + get(token)
			},
			body: JSON.stringify({})
		});
		const statusCode = response.status;
		if (statusCode == 200) {
			toastStore.trigger(createToast($t('toast.tokenSent'), 'success'));
			tokenSent = true;
		} else if (statusCode == 404) {
			toastStore.trigger(createToast($t('toast.userNotFound'), 'error'));
		}
	}
</script>

<main class="card p-4 w-[25vw]">
	<h3 class="h3 mb-2">{$t('modalForgotPassword.header')}</h3>
	<RegisterInput
		value={username}
		iconString="clarity:user-solid"
		placeholder="{$t('modalForgotPassword.username')}*"
		type="text"
		onInput={handleUsernameInput}
		validateIcon=""
		id="username"
		validateIconColor=""
	/>
	<div class="flex flex-row mt-3 justify-center">
		<button
			disabled={username == ''}
			on:click={sendToken}
			class="btn variant-filled-primary ml-2"
			type="submit"
			>{tokenSent ? $t('modal.forgotPwd.resendToken') : $t('modal.forgotPwd.sendToken')}
		</button>
	</div>
	{#if tokenSent == true}
		<div class="flex flex-col w-full m-auto mt-2">
			<RegisterInput
				value={tokenString}
				iconString="mdi:account-key"
				placeholder="{$t('modalForgotPassword.token')}*"
				type="text"
				onInput={handleTokenInput}
				validateIcon=""
				id="token"
				validateIconColor=""
			/>
		</div>

		<div class="flex flex-col w-full m-auto mt-2">
			<RegisterInput
				value={password}
				iconString="mdi:lock-outline"
				placeholder="{$t('modalChangePassword.newPassword')}*"
				onInput={handlePasswordInput}
				validateIcon={validateIconPwd}
				type="pwd"
				id="pwd"
				validateIconColor={validateIconPwdColor}
			/>
			{#if !isPwdLongEnough && password.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.tooShort')}</p>
			{/if}
			{#if !hasPwdCapitalLetter && password.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.capitalLetter')}</p>
			{/if}
			{#if !hasPwdSmallLetter && password.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.smallLetter')}</p>
			{/if}
			{#if !hasPwdSpecailCharacter && password.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.specialCharacter')}</p>
			{/if}
			{#if !hasPwdNumber && password.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.number')}</p>
			{/if}
		</div>
		<div class="flex flex-col w-full m-auto mt-2">
			<RegisterInput
				value={repeatPassword}
				iconString="mdi:lock-reset"
				placeholder="{$t('modalChangePassword.newPasswordRepeat')}*"
				type="pwd"
				onInput={handleRepeatPasswordInput}
				validateIcon={validateIconRepeatPwd}
				id="repeatPwd"
				validateIconColor={validateIconRepeatPwdColor}
			/>
		</div>
		{#if repeatPassword.length != 0 && password != repeatPassword}
			<p class="text-red-600 text-sm">*{$t('register.password.notMatch')}</p>
		{/if}

		<div class="flex flex-row mt-3 justify-between">
			<button on:click={() => modalStore.close()} class="btn variant-filled-surface mr-2"
				>{$t('register.button.cancel')}</button
			>

			<button
				disabled={!areAllInputsCorrect}
				on:click={handleSubmit}
				class="btn variant-filled-primary ml-2"
				type="submit">{$t('modalChangePassword.pwdReset')}</button
			>
		</div>
	{/if}
</main>
