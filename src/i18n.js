// "@ts-expect-error"
import { derived } from 'svelte/store';
import translations from './translation';
import { persisted } from 'svelte-local-storage-store';

export const locale = persisted('lang', 'en');
export const locales = Object.keys(translations);

// @ts-expect-error: ignore-any-type
function translate(locale, key, vars) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error('no key provided to $t()');
	if (!locale) throw new Error(`no translation for key "${key}"`);

	// Grab the translation from the translations object.
	// @ts-expect-error: ignore-any-type
	let text = translations[locale][key];

	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

// "@ts-expect-error"
export const t = derived(
	locale,
	($locale) =>
		// @ts-expect-error: ignore-any-type
		(key, vars = {}) =>
			translate($locale, key, vars)
);
