<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/Login.svelte';
	import Feed from '../components/Feed.svelte';
	import { token } from '$lib/Store';

	const loginToken = get(token);
</script>

<main class="p-2">
	<div class="grid grid-cols-1 md:grid-cols-6 gap-2 grid-end-auto">
		<div >
			{#if loginToken == ''}
				<Login />
			{/if}
		</div>
		
		<div class="col-start-1 md:col-start-2 col-span-4">
			<Feed />
		</div>

		
	</div>
</main>
