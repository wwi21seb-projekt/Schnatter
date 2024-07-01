<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { locale, t } from '../../i18n';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { serverURL } from '$lib/Store';
	let language = '';
	let server = get(serverURL);

	onMount(() => {
		language = get(locale);
	});

	function changelangunage() {
		locale.set((document.getElementById('Langauge') as HTMLSelectElement).value);
	}
	function changeServer() {
		serverURL.set((document.getElementById('Server') as HTMLSelectElement).value);
		window.location.reload();
	}
</script>

<main class="flex flex-col justify-center p-2">
	<h5 class="h5 my-1">{$t('settings.header')}</h5>
	<select value={language} on:input={changelangunage} class="select" name="Langauge" id="Langauge">
		<option value="en">{$t('settings.language.en')}</option>
		<option value="de">{$t('settings.language.de')}</option>
	</select>
	<LightSwitch class="w-10 h-10 mt-2" />
	<h5 class="h5 my-1">{$t('settings.server')}</h5>
	<select value={server} on:input={changeServer} class="select" name="Server" id="Server">
		<option value="https://alpha.c930.net/api">Server-alpha</option>
		<option value="https://server-beta.de/api">Server-beta</option>
		<option value="https://projekt-mockserver.mabu2807.de/api">Mockserver-Server</option>
		<option value="http://localhost:3000/api">Mockserver-local</option>
	</select>
</main>
