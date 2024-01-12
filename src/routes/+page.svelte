<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/Login.svelte';
	import Feed from '../components/Feed.svelte';
	import { token } from '$lib/Store';

	const loginToken = get(token);
</script>

<main class="">
	<div class="grid grid-cols-6 grid-flow-col gap-4 grid-end-auto">
		<div class="col-span-1"></div>
		<div class="card col-span-4">
			<Feed/>
		</div>
		<div class="grid grid-rows-6 grid-flow-col gap-4">
			<div class="card row-start-1">
				{#if loginToken == ''}<Login/>{/if}
			</div>

			<div class="card row-span-5"></div>
		</div>
	</div>
</main>
