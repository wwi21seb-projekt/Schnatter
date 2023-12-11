export function isValidEmail(email: string): boolean {
	const emailRegex = /^[a-zA-Z0-9.,_\-@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	return emailRegex.test(email);
}

export function changeValidateIcon(isValid: boolean): string {
	let validateIcon = null;
	if (isValid) {
		validateIcon = 'ic:baseline-done';
	} else {
		validateIcon = 'ic:baseline-error-outline';
	}

	return validateIcon;
}

export function changeIconColor(validateIcon: string): string {
	let validateIconColor = '';
	if (validateIcon == 'ic:baseline-done') {
		validateIconColor = 'green';
	}
	if (validateIcon == 'ic:baseline-error-outline') {
		validateIconColor = 'red';
	}
	return validateIconColor;
}
