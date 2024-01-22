<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { locale } from '../../i18n';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	let language = '';

	onMount(() => {
		language = get(locale);
	});

	function changelangunage() {
		locale.set((document.getElementById('Langauge') as HTMLSelectElement).value);
	}
</script>

<main class="flex flex-col justify-center p-2">
	<h5 class="h5">Settings</h5>
	<select value={language} on:input={changelangunage} class="select" name="Langauge" id="Langauge">
		<option value="en">English</option>
		<option value="de">German</option>
	</select>
	<LightSwitch class="w-10 h-10 mt-2" />
</main>
