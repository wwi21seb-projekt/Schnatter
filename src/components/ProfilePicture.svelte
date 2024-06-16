<script lang="ts">
	import { getInitalsFromUsername } from '$lib/utils/Pictures';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let src: string;
	export let username: string;
	export let cssClass: string = '';
</script>

{#if src}
	<Avatar class={cssClass} {src} alt="profile Picture" />
{:else}
	<Avatar class={cssClass} initials={getInitalsFromUsername(username)} />
{/if}
