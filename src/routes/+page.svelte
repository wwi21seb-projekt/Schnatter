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
		<div class="card col-span-4 pt8">
				<Feed/>
		</div>
		<div class="grid grid-rows-6 grid-flow-col gap-4">
			{#if loginToken == ''}
				<div class="row-start-1">
					<Login/>
				</div>
			{/if}
			<div class=" row-span-5"></div>
		</div>
	</div>
</main>
