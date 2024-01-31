<script lang="ts">
	import { changeIconColor, changeValidateIcon } from '$lib/ValidateInputs';
	import RegisterInput from '../RegisterInput.svelte';

	import { t } from '../../i18n';
	import { get } from 'svelte/store';
	import { serverURL, token } from '$lib/Store';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	let password = '';
	let repeatPassword = '';
	let oldPassword = '';
	let validateIconPwd = '';
	let validateIconRepeatPwd = '';
	let validateIconPwdColor = '';
	let validateIconRepeatPwdColor = '';
	let isPwdLongEnough: boolean;
	let hasPwdNumber: boolean;
	let hasPwdCapitalLetter: boolean;
	let hasPwdSmallLetter: boolean;
	let hasPwdSpecailCharacter: boolean;

	function handleOldPwdInput(event: Event) {
		oldPassword = (event.target as HTMLInputElement).value;
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
		password === repeatPassword &&
		oldPassword.length != 0;

	async function handleSubmit() {
		const serverUrl = get(serverURL) + '/users';
		const response = await fetch(serverUrl, {
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + get(token)
			},
			body: JSON.stringify({
				oldPassword: oldPassword,
				newPassword: password
			})
		});

		const statusCode = response.status;
		if (statusCode == 200) {
			$modalStore[0].response(statusCode);
			modalStore.close();
		}
	}
</script>

<main class="card p-4 w-[25vw]">
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

	<div class="flex flex-row mt-3">
		<button on:click={() => modalStore.close()} class="btn variant-filled-surface mr-2"
			>{$t('register.button.cancel')}</button
		>

		<button
			disabled={!areAllInputsCorrect}
			on:click={handleSubmit}
			class="btn variant-filled-primary ml-2"
			type="submit">{$t('register.button.register')}</button
		>
	</div>
</main>
