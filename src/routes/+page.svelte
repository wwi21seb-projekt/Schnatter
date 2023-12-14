<script lang="ts">
	import Login from '../components/Login.svelte';
</script>

<main class="">
	<div class="grid grid-cols-6 grid-flow-col gap-4 grid-end-auto">
		<div class="col-span-1"></div>
		<div class="card col-span-4"></div>
		<div class="grid grid-rows-6 grid-flow-col gap-4">
			<div class="card row-start-1"><Login /></div>
			<div class="card row-span-5"></div>
		</div>
	</div>
</main>
