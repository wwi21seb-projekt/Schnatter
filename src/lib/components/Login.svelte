<script lang="ts">
	import { isValidEmail } from '$lib/ValidateInputs';
	import RegisterInput from '../../lib/components/RegisterInput.svelte';

	let email = '';
	let password = '';
	let validateIconEmail = '';
	let validateIconPwd = '';
	let validateIconEmailColor = '';
	let validateIconPwdColor = '';
	let isEmailEntered: boolean;
	let isPasswordEntered: boolean;

	function handleEmailInput(event: Event) {
		email = (event.target as HTMLInputElement).value;
		if (email.length >= 1) {
			isEmailEntered = isValidEmail(email);
		} else {
			validateIconEmail = '';
		}
	}

	function handlePasswordInput(event: Event) {
		password = (event.target as HTMLInputElement).value;
		if (password.length >= 1) {
			isPasswordEntered = isValidEmail(email);
		} else {
			validateIconPwd = '';
		}
	}

	$: allInputFieldsFilled = isEmailEntered && isPasswordEntered;
	function handleSubmit() {}
</script>

<div class="pt-8 rounded-container-token">
	<div class="justify-center">
		<div class=" p-2 h4 text-center font-bold">Log In</div>
		<div class="h-[50vh] flex flex-col">
			<form class="flex flex-col justify-around items-center w-full" on:submit={handleSubmit}>
				<div class="flex flex-col w-full pr-3 pl-3 pb-2">
					<RegisterInput
						value={email}
						iconString="ic:outline-email"
						placeholder="Email"
						type="text"
						onInput={handleEmailInput}
						validateIcon={validateIconEmail}
						id="email"
						validateIconColor={validateIconEmailColor}
					/>
				</div>
				<div class="flex flex-col w-full pr-3 pl-3 pt-2">
					<RegisterInput
						value={password}
						iconString="mdi:lock-outline"
						placeholder="Password"
						onInput={handlePasswordInput}
						validateIcon={validateIconPwd}
						type="pwd"
						id="pwd"
						validateIconColor={validateIconPwdColor}
					/>
				</div>
			</form>

			<div class="flex flex-row mt-3 justify-center text-center">
				<button disabled={!allInputFieldsFilled} class="btn variant-filled-primary" type="submit"
					>Log In</button
				>
			</div>
			<div class="p-2 text-sm text-center">
				Don't have an account yet? <a class="color=[#2563eb]" href="url">Sign up</a>
			</div>
		</div>
	</div>
</div>
