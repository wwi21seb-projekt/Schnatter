<script lang="ts">
	import Icon from '@iconify/svelte';
	export let iconString: string;
	export let placeholder: string;
	export let value: string;
	export let validateIcon: string;
	export let onInput: (event: Event) => void;
	export let type: string;
	export let id: string;
	export let validateIconColor:string;




</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
	<Icon class="w-10 h-10" icon={iconString} style="font-size: 32px" />
	{#if type === 'text'}
		<input
			bind:value
			type="text"
			class="bg-transparent border-0 ring-0"
			name="prompt"
			{id}
			{placeholder}
			on:input={onInput}
		/>
	{:else if type === 'pwd'}
		<input
			bind:value
			type="password"
			class="bg-transparent border-0 ring-0"
			name="prompt"
			{id}
			{placeholder}
			on:input={onInput}
		/>
	{/if}
	<Icon
		class="w-10 h-10"
		bind:icon={validateIcon}
		style="font-size: 32px"
		bind:color={validateIconColor}
	/>
</div>
