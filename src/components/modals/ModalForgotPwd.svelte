<script lang="ts">
	import RegisterInput from '../RegisterInput.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { t } from '../../i18n';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { handleForgotSubmit, handlePasswordInput, handleRepeatPasswordInput, sendToken } from '$lib/utils/ChangePassword';
	import type { PasswordChange } from '$lib/types/PasswordChange';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let username = '';
	let tokenString = '';
	let tokenSent = false;

	var passwordChange : PasswordChange = {
		newPassword: "",
		repeatNewPassword: "",
		isPwdLongEnough: false,
		hasPwdNumber: false,
		hasPwdCapitalLetter: false,
		hasPwdSmallLetter: false,
		hasPwdSpecailCharacter: false,
		validateIconPwd: "",
		validateIconRepeatPwd: "",
		validateIconPwdColor: "",
		validateIconRepeatPwdColor: ""
	};

	function handleUsernameInput(event: Event) {
		username = (event.target as HTMLInputElement).value;
	}

	function handleTokenInput(event: Event) {
		tokenString = (event.target as HTMLInputElement).value;
	}

	async function callHandlePasswordInput(event: Event) {
		await handlePasswordInput(event, passwordChange);
		passwordChange = { ...passwordChange };
	}

	async function callHandleRepeatPasswordInput(event: Event) {
		await handleRepeatPasswordInput(event, passwordChange);
		passwordChange = { ...passwordChange };
	}

	$: areAllInputsCorrect =
		passwordChange.isPwdLongEnough &&
		passwordChange.hasPwdCapitalLetter &&
		passwordChange.hasPwdSmallLetter &&
		passwordChange.hasPwdSpecailCharacter &&
		passwordChange.hasPwdNumber &&
		passwordChange.newPassword === passwordChange.repeatNewPassword

	$: tokenSent = tokenSent;

	async function callHandleSubmit() {
		const statusCode = await handleForgotSubmit(username, tokenString, passwordChange);
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

	async function handleSendToken() {
		const statusCode = await sendToken(username);
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
			on:click={handleSendToken}
			class="btn variant-filled-primary ml-2"
			type="submit"
			>{tokenSent ? $t('modal.forgotPwd.resendToken') : $t('modal.forgotPwd.sendToken')}
		</button>
	</div>
	{#if tokenSent === true}
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
				value={passwordChange.newPassword}
				iconString="mdi:lock-outline"
				placeholder="{$t('modalChangePassword.newPassword')}*"
				onInput={callHandlePasswordInput}
				validateIcon={passwordChange.validateIconPwd}
				type="pwd"
				id="pwd"
				validateIconColor={passwordChange.validateIconPwdColor}
			/>
			{#if !passwordChange.isPwdLongEnough && passwordChange.newPassword.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.tooShort')}</p>
			{/if}
			{#if !passwordChange.hasPwdCapitalLetter && passwordChange.newPassword.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.capitalLetter')}</p>
			{/if}
			{#if !passwordChange.hasPwdSmallLetter && passwordChange.newPassword.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.smallLetter')}</p>
			{/if}
			{#if !passwordChange.hasPwdSpecailCharacter && passwordChange.newPassword.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.specialCharacter')}</p>
			{/if}
			{#if !passwordChange.hasPwdNumber && passwordChange.newPassword.length != 0}
				<p class="text-red-600 text-sm">*{$t('register.password.number')}</p>
			{/if}
		</div>
		<div class="flex flex-col w-full m-auto mt-2">
			<RegisterInput
				value={passwordChange.repeatNewPassword}
				iconString="mdi:lock-reset"
				placeholder="{$t('modalChangePassword.newPasswordRepeat')}*"
				type="pwd"
				onInput={callHandleRepeatPasswordInput}
				validateIcon={passwordChange.validateIconRepeatPwd}
				id="repeatPwd"
				validateIconColor={passwordChange.validateIconRepeatPwdColor}
			/>
		</div>
		{#if passwordChange.repeatNewPassword.length != 0 && passwordChange.newPassword != passwordChange.repeatNewPassword}
			<p class="text-red-600 text-sm">*{$t('register.password.notMatch')}</p>
		{/if}

		<div class="flex flex-row mt-3 justify-between">
			<button on:click={() => modalStore.close()} class="btn variant-filled-surface mr-2"
				>{$t('register.button.cancel')}</button
			>

			<button
				disabled={!areAllInputsCorrect}
				on:click={callHandleSubmit}
				class="btn variant-filled-primary ml-2"
				type="submit">{$t('modalChangePassword.pwdReset')}</button
			>
		</div>
	{/if}
</main>
