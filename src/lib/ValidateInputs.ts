export function isValidEmail(email:string):boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email)
}

export function changeValidateIcon(isValid:boolean):string{
    let validateIcon = null
    if (isValid) {
        validateIcon = 'ic:baseline-done';
    } else {
        validateIcon = 'ic:baseline-error-outline';
    }

    return validateIcon
}
