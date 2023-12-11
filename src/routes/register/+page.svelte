<script lang="ts">
	import { changeIconColor, changeValidateIcon, isValidEmail } from '$lib/ValidateInputs';
	import RegisterInput from '../../lib/components/RegisterInput.svelte';

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
			password.length >= 8 &&
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
	function handleSubmit() {}
</script>

<main class=" flex flex-col justify-center items-center h-[90vh]">
	<div class="card w-[40vw] h-[80vh] p-10">
		<h1 class="h1 mb-14">Register</h1>
		<div class="h-[50vh] flex flex-col justify-around items-center">
			<form class="flex flex-col justify-around items-center w-full" on:submit={handleSubmit}>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={email}
						iconString="ic:outline-email"
						placeholder="Email*"
						type="text"
						onInput={handleEmailInput}
						validateIcon={validateIconEmail}
						id="email"
						validateIconColor={validateIconEmailColor}
					/>
					{#if !isEmailValid && email.length != 0}
						<p class="text-red-600 text-sm">*This is no vaild email</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={username}
						iconString="mdi:account"
						placeholder="Username*"
						type="text"
						onInput={handleUsernameInput}
						validateIcon={validateIconUsername}
						id="username"
						validateIconColor={validateIconUsernameColor}
					/>
					{#if username.length > 25}
						<p class="text-red-600 text-sm">*Username to long</p>
					{/if}
					{#if checkSpace.test(username)}
						<p class="text-red-600 text-sm">*no spaces allowed</p>
					{/if}
					{#if containsIllegalCharacters}
						<p class="text-red-600 text-sm">*contains illegal characters</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={nickname}
						iconString="mdi:account-eye-outline"
						placeholder="Nickname (Optional)"
						type="text"
						onInput={handleNicknameInput}
						validateIcon={validateIconNickname}
						id="nickName"
						validateIconColor={validateIconNicknameColor}
					/>
					{#if nickname.length > 25}
						<p class="text-red-600 text-sm">*Nickname to long</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={password}
						iconString="mdi:lock-outline"
						placeholder="Password*"
						onInput={handlePasswordInput}
						validateIcon={validateIconPwd}
						type="pwd"
						id="pwd"
						validateIconColor={validateIconPwdColor}
					/>
					{#if !isPwdLongEnough && password.length != 0}
						<p class="text-red-600 text-sm">*Password to short (min 8 character)</p>
					{/if}
					{#if !hasPwdCapitalLetter && password.length != 0}
						<p class="text-red-600 text-sm">*Password must contain a captial letter</p>
					{/if}
					{#if !hasPwdSmallLetter && password.length != 0}
						<p class="text-red-600 text-sm">*Password must contain a small letter</p>
					{/if}
					{#if !hasPwdSpecailCharacter && password.length != 0}
						<p class="text-red-600 text-sm">*Password must contain a special character</p>
					{/if}
					{#if !hasPwdNumber && password.length != 0}
						<p class="text-red-600 text-sm">*Password must contain a number</p>
					{/if}
				</div>
				<div class="flex flex-col w-full m-auto mt-2">
					<RegisterInput
						value={repeatPassword}
						iconString="mdi:lock-reset"
						placeholder="Repeat Password*"
						type="pwd"
						onInput={handleRepeatPasswordInput}
						validateIcon={validateIconRepeatPwd}
						id="repeatPwd"
						validateIconColor={validateIconRepeatPwdColor}
					/>
				</div>
			</form>

			<div class="flex flex-row mt-3">
				<button class="btn variant-filled-surface mr-2">Cancel</button>
				<button
					disabled={!areAllInputsCorrect}
					class="btn variant-filled-primary ml-2"
					type="submit">Register</button
				>
			</div>
			<p>*required</p>
		</div>
	</div>
</main>
