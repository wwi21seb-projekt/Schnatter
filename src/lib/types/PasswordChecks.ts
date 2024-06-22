export type PasswordChange = {
	newPassword: string;
	repeatNewPassword: string;
	isPwdLongEnough: boolean;
	hasPwdNumber: boolean;
	hasPwdCapitalLetter: boolean;
	hasPwdSmallLetter: boolean;
	hasPwdSpecailCharacter: boolean;
	validateIconPwd: string;
	validateIconRepeatPwd: string;
	validateIconPwdColor: string;
	validateIconRepeatPwdColor: string;
};
