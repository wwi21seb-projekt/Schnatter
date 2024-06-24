import { type PasswordChange } from '../types/PasswordChecks';
import { changeIconColor, changeValidateIcon } from '$lib/utils/ValidateInputs';
import { get } from 'svelte/store';
import { serverURL, token } from '$lib/Store';

export async function handlePasswordInput(event: Event, passwordChange: PasswordChange) {
	passwordChange.newPassword = (event.target as HTMLInputElement).value;
	if (passwordChange.newPassword.length != 0) {
		passwordChange.hasPwdCapitalLetter = /[A-Z]/.test(passwordChange.newPassword);
		passwordChange.hasPwdSmallLetter = /[a-z]/.test(passwordChange.newPassword);
		passwordChange.hasPwdNumber = /\d/.test(passwordChange.newPassword);
		passwordChange.hasPwdSpecailCharacter = /[^\w]/.test(passwordChange.newPassword);
		if (passwordChange.newPassword.length >= 8) {
			passwordChange.isPwdLongEnough = true;
		} else {
			passwordChange.isPwdLongEnough = false;
		}
	}
	if (
		passwordChange.isPwdLongEnough &&
		passwordChange.hasPwdCapitalLetter &&
		passwordChange.hasPwdSmallLetter &&
		passwordChange.hasPwdNumber &&
		passwordChange.hasPwdSpecailCharacter
	) {
		passwordChange.validateIconPwd = changeValidateIcon(true);
	} else {
		passwordChange.validateIconPwd = changeValidateIcon(false);
	}
	if (passwordChange.newPassword.length === 0) {
		passwordChange.validateIconPwd = '';
	}
	passwordChange.validateIconPwdColor = changeIconColor(passwordChange.validateIconPwd);
}

export async function handleRepeatPasswordInput(event: Event, passwordChange: PasswordChange) {
	passwordChange.repeatNewPassword = (event.target as HTMLInputElement).value;
	if (passwordChange.newPassword === passwordChange.repeatNewPassword) {
		passwordChange.validateIconRepeatPwd = changeValidateIcon(true);
	} else {
		passwordChange.validateIconRepeatPwd = changeValidateIcon(false);
	}
	if (passwordChange.repeatNewPassword.length === 0) {
		passwordChange.validateIconRepeatPwd = '';
	}
	passwordChange.validateIconRepeatPwdColor = changeIconColor(passwordChange.validateIconRepeatPwd);
}

export async function handleChangeSubmit(passwordChange: PasswordChange, oldPassword: string) {
	const response = await fetch(`${get(serverURL)}/users`, {
		method: 'PATCH',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		},
		body: JSON.stringify({
			oldPassword: oldPassword,
			newPassword: passwordChange.newPassword
		})
	});

	return response.status;
}

export async function handleForgotSubmit(
	username: string,
	tokenString: string,
	passwordChange: PasswordChange
) {
	const response = await fetch(`${get(serverURL)}/users/${username}/reset-password`, {
		method: 'PATCH',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		},
		body: JSON.stringify({
			token: tokenString,
			newPassword: passwordChange.newPassword
		})
	});
	return response.status;
}

export async function sendToken(username: string) {
	const serverUrl = `${get(serverURL)}/users/${username}/reset-password`;
	const response = await fetch(serverUrl, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		},
		body: JSON.stringify({})
	});
	return response.status;
}
