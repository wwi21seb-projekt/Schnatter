<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/Login.svelte';
	import Feed from '../components/Feed.svelte';
	import { token } from '$lib/Store';
	import ChangeFeedTypeButton from '../components/ChangeFeedTypeButton.svelte';

	const loginToken = get(token);
</script>

<main class="">
	<div class="float-right mr-12">
		{#if loginToken == ''}
			<Login />
		{/if}
	</div>

	<div class="p-2 flex flex-row justify-center items-start">
		<ChangeFeedTypeButton />
	</div>
	<div class="p-2 flex flex-row justify-center items-start">
		<Feed />
	</div>
</main>
