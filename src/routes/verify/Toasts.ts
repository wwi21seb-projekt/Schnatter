import type { ToastSettings } from '@skeletonlabs/skeleton';

export const InternalServerError: ToastSettings = {
	message: 'Internal Server Error! Please try again later!',
	timeout: 20000,
	background: 'variant-filled-error'
};

export const verifySuccess: ToastSettings = {
	message: 'Account successfully verified',
	timeout: 20000,
	background: 'variant-filled-variant-filled-success'
};
export const resendTokenSuccess: ToastSettings = {
	message: 'We have sent you a new code to your email address',
	timeout: 20000,
	background: 'variant-filled-variant-filled-success'
};
export const tokenNotFound: ToastSettings = {
	message: 'The code is not correct',
	timeout: 20000,
	background: 'variant-filled-variant-filled-success'
};
export const tokenExpierd: ToastSettings = {
	message: 'The code has expired. We have sent you a new one!',
	timeout: 20000,
	background: 'variant-filled-variant-filled-success'
};
export const otherError: ToastSettings = {
	message: 'Wie havea problem. Please try again later!',
	timeout: 20000,
	background: 'variant-filled-variant-filled-success'
};
