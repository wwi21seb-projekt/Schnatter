<script lang="ts">
	import RegisterInput from '../RegisterInput.svelte';
	import { t } from '../../i18n';
	import { Toast, getModalStore } from '@skeletonlabs/skeleton';
	import { type PasswordChange } from '$lib/types/PasswordChecks';
	import {
		handlePasswordInput,
		handleRepeatPasswordInput,
		handleChangeSubmit
	} from '$lib/utils/ChangePassword';

	const modalStore = getModalStore();
	let oldPassword = '';

	var passwordChange: PasswordChange = {
		newPassword: '',
		repeatNewPassword: '',
		isPwdLongEnough: false,
		hasPwdNumber: false,
		hasPwdCapitalLetter: false,
		hasPwdSmallLetter: false,
		hasPwdSpecailCharacter: false,
		validateIconPwd: '',
		validateIconRepeatPwd: '',
		validateIconPwdColor: '',
		validateIconRepeatPwdColor: ''
	};

	$: passwordChange = passwordChange;

	function handleOldPwdInput(event: Event) {
		oldPassword = (event.target as HTMLInputElement).value;
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
		passwordChange.newPassword === passwordChange.repeatNewPassword &&
		oldPassword.length != 0;

	async function callHandleSubmit() {
		const statusCode = await handleChangeSubmit(passwordChange, oldPassword);
		if (statusCode == 204) {
			// @ts-expect-error  | skeleton error (https://www.skeleton.dev/utilities/modals)
			$modalStore[0].response(statusCode);
			modalStore.close();
		}
	}
</script>

<Toast zIndex="1100" />
<main class="card p-4 md:w-[25vw] w-[98vw]">
	<h3 class="h3 mb-2">{$t('modalChangePassword.header')}</h3>
	<RegisterInput
		value={oldPassword}
		iconString="mdi:lock-outline"
		placeholder="{$t('modalChangePassword.oldPassword')}*"
		type="pwd"
		onInput={handleOldPwdInput}
		validateIcon=""
		id="oldPwd"
		validateIconColor=""
	/>

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

	<div class="flex flex-row mt-3">
		<button on:click={() => modalStore.close()} class="btn variant-filled-surface mr-2"
			>{$t('register.button.cancel')}</button
		>

		<button
			disabled={!areAllInputsCorrect}
			on:click={callHandleSubmit}
			class="btn variant-filled-primary ml-2"
			type="submit">{$t('modalChangePassword.changeButton')}</button
		>
	</div>
</main>
