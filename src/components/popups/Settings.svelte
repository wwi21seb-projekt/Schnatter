<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { locale, t } from '../../i18n';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { serverURL, token } from '$lib/Store';
	let language = '';
	let server = get(serverURL);
	onMount(() => {
		language = get(locale);
	});

	function changeLanguage() {
		locale.set((document.getElementById('Language') as HTMLSelectElement).value);
	}
	function changeServer() {
		//every user can change the backend server when logged out
		serverURL.set((document.getElementById('Server') as HTMLSelectElement).value);
		window.location.reload();
	}
</script>

<main class="flex flex-col justify-center p-2">
	<h5 class="h5 my-1">{$t('settings.header')}</h5>
	<select value={language} on:input={changeLanguage} class="select" name="Language" id="Language">
		<option value="en">{$t('settings.language.en')}</option>
		<option value="de">{$t('settings.language.de')}</option>
	</select>
	<LightSwitch class="w-10 h-10 mt-2" />
	{#if !$token}
		<h5 class="h5 my-1">{$t('settings.server')}</h5>
		<select value={server} on:input={changeServer} class="select" name="Server" id="Server">
			<option value="https://alpha.c930.net/api">Server-alpha</option>
			<option value="https://server-beta.de/api">Server-beta</option>
			<option value="https://projekt-mockserver.mabu2807.de/api">Mockserver-Server</option>
			<option value="http://localhost:3000/api">Mockserver-local</option>
		</select>
	{/if}
</main>
