<script lang="ts">
	import { isValidEmail } from '$lib/ValidateInputs';
	import LoginInput from '../../lib/components/LoginInput.svelte';
	import { t } from '../../i18n';

	let email = '';
	let password = '';
	let isEmailValid: boolean;

	function handleEmailInput(event: Event) {
		email = (event.target as HTMLInputElement).value;
		if (password.length >= 1) {
			isEmailValid = isValidEmail(email);
		}
	}

	function handlePasswordInput(event: Event) {
		password = (event.target as HTMLInputElement).value;
	}

	$: allInputFieldsFilled = password.length != 0 && email.length != 0 && isEmailValid;
	function handleSubmit() {}
</script>

<div class="pt-8">
	<div class="justify-center">
		<div class=" p-2 h4 text-center font-bold">{$t('login.header.title')}</div>
		<div class="h-[50vh] flex flex-col">
			<form class="flex flex-col justify-around items-center w-full" on:submit={handleSubmit}>
				<div class="flex flex-col w-full px-3 pb-2">
					<LoginInput
						value={email}
						iconString="ic:outline-email"
						placeholder={$t('login.placeholder.email')}
						type="text"
						onInput={handleEmailInput}
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
			</form>

			<div class="flex flex-row mt-3 justify-center text-center">
				<button disabled={!allInputFieldsFilled} class="btn variant-filled-primary" type="submit"
					>{$t('login.submit.btn')}</button
				>
			</div>
			<div class="p-2 text-sm text-center">
				{$t('login.subtitle.noaccount')}<a class="text=primary" href="/register"
					>{$t('login.subtitle.signup')}</a
				>
			</div>
		</div>
	</div>
</div>
