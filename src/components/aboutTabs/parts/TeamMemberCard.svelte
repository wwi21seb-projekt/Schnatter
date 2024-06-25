<script lang="ts">
	export let name: string;
	export let matrixNumber: string;
</script>

<div class="card flex flex-col justify-start items-center w-[200px] m-3 p-3">
	<img class="w-[100px]" src="/default-avatar.png" alt="Default avatar" />
	<p class="h3">{name}</p>
	<p>Matr.: {matrixNumber}</p>
</div>
