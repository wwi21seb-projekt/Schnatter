<script lang="ts">
	import { changeIconColor, changeValidateIcon, isValidEmail } from '$lib/ValidateInputs';
	import { Toast } from '@skeletonlabs/skeleton';
	import RegisterInput from '../../components/RegisterInput.svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { goto } from '$app/navigation';
	import { registerUsername, serverURL } from '$lib/Store';
	import { t } from '../../i18n';

	initializeStores();
	const toastStore = getToastStore();

	let statusCode: number = 0;
	let email = '';
	let username = '';
	let nickname = '';
	let password = '';
	let repeatPassword = '';
	let validateIconEmail = '';
	let validateIconUsername = '';
	let validateIconNickname = '';
	let validateIconPwd = '';
	let validateIconRepeatPwd = '';
	let validateIconEmailColor = '';
	let validateIconUsernameColor = '';
	let validateIconNicknameColor = '';
	let validateIconPwdColor = '';
	let validateIconRepeatPwdColor = '';
	let isPwdLongEnough: boolean;
	let hasPwdNumber: boolean;
	let hasPwdCapitalLetter: boolean;
	let hasPwdSmallLetter: boolean;
	let hasPwdSpecailCharacter: boolean;
	let isEmailValid: boolean;
	let containsIllegalCharacters: boolean;
	const checkLatin1RegExp = /^[a-zA-Z0-9.,_\-@]+$/;
	const checkSpace = /\s/;
	let serverUrl: string;

	function handleEmailInput(event: Event) {
		email = (event.target as HTMLInputElement).value;

		if (email.length >= 1) {
			isEmailValid = isValidEmail(email);
			validateIconEmail = changeValidateIcon(isEmailValid);
		} else {
			validateIconEmail = '';
		}
		validateIconEmailColor = changeIconColor(validateIconEmail);
	}
	function handleUsernameInput(event: Event) {
		username = (event.target as HTMLInputElement).value;
		if (username.length > 0) {
			if (username.length < 25 && checkLatin1RegExp.test(username) && !checkSpace.test(username)) {
				validateIconUsername = changeValidateIcon(true);
			} else {
				validateIconUsername = changeValidateIcon(false);
				if (!checkLatin1RegExp.test(username)) {
					containsIllegalCharacters = true;
				}
			}
		} else {
			validateIconUsername = '';
		}
		validateIconUsernameColor = changeIconColor(validateIconUsername);
	}

	function handleNicknameInput(event: Event) {
		nickname = (event.target as HTMLInputElement).value;
		if (nickname.length > 25) {
			validateIconNickname = changeValidateIcon(false);
		} else {
			validateIconNickname = '';
		}
		validateIconNicknameColor = changeIconColor(validateIconNickname);
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
		isEmailValid &&
		isPwdLongEnough &&
		hasPwdCapitalLetter &&
		hasPwdSmallLetter &&
		hasPwdSpecailCharacter &&
		hasPwdNumber &&
		password === repeatPassword &&
		username.length != 0;
	async function handleSubmit() {
		serverURL.subscribe((prev_val) => (serverUrl = prev_val));

		const url: string = serverUrl + '/users';
		try {
			const respone = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: username,
					password: password,
					nickname: nickname,
					email: email
				})
			});
			statusCode = respone.status;
		} catch (error) {
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
		statusCode == 201;
		if (statusCode == 201) {
			registerUsername.set(username);
			goto('/verify');
		} else if (statusCode == 400) {
			toastStore.trigger(createToast('There was a mistake! Please check your entries', 'error'));
		} else if (statusCode == 422) {
			toastStore.trigger(createToast('Email could not be sent', 'error'));
		} else if (statusCode == 1111) {
			toastStore.trigger(createToast('User already exist', 'error'));
		}
	}
</script>

<Toast />
<main class=" flex flex-col justify-center items-center h-[90vh]">
	<div class="card lg:w-[40vw] md:w-[80vw] w-[95vw] h-[80vh] p-10">
		<h1 class="h1 mb-14">{$t('register.header')}</h1>
		<div class="h-[50vh] flex flex-col justify-around items-center">
			<form class="flex flex-col justify-around items-center w-full">
				<div class="w-full">
					<p class="float-right text-sm">*{$t('register.required.asterisk')}</p>
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={email}
						iconString="ic:outline-email"
						placeholder="{$t('register.mail.header')}*"
						type="text"
						onInput={handleEmailInput}
						validateIcon={validateIconEmail}
						id="email"
						validateIconColor={validateIconEmailColor}
					/>
					{#if !isEmailValid && email.length != 0}
						<p class="text-red-600 text-sm">*{$t('register.mail.invalid')}</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={username}
						iconString="mdi:account"
						placeholder="{$t('register.username.header')}*"
						type="text"
						onInput={handleUsernameInput}
						validateIcon={validateIconUsername}
						id="username"
						validateIconColor={validateIconUsernameColor}
					/>
					{#if username.length > 25}
						<p class="text-red-600 text-sm">*{$t('register.username.tooLong')}</p>
					{/if}
					{#if checkSpace.test(username)}
						<p class="text-red-600 text-sm">*{$t('register.username.spaces')}</p>
					{/if}
					{#if containsIllegalCharacters}
						<p class="text-red-600 text-sm">*{$t('register.username.illegalCharacters')}</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={nickname}
						iconString="mdi:account-eye-outline"
						placeholder={$t('register.nickname.header')}
						type="text"
						onInput={handleNicknameInput}
						validateIcon={validateIconNickname}
						id="nickName"
						validateIconColor={validateIconNicknameColor}
					/>
					{#if nickname.length > 25}
						<p class="text-red-600 text-sm">*{$t('register.nickname.tooLong')}</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={password}
						iconString="mdi:lock-outline"
						placeholder="{$t('register.password.header')}*"
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
						placeholder="{$t('register.password.repeat')}*"
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
					<a href="/"
						><button class="btn variant-filled-surface mr-2">{$t('register.button.cancel')}</button
						></a
					>
					<button
						disabled={!areAllInputsCorrect}
						class="btn variant-filled-primary ml-2"
						type="submit"
						on:click={handleSubmit}>{$t('register.button.register')}</button
					>
				</div>
			</form>
		</div>
	</div>
</main>
