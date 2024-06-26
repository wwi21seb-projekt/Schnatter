<script lang="ts">
	import { newProfilePicture } from '$lib/Store';
	import { getInitalsFromUsername } from '$lib/utils/Pictures';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let src: string | undefined;
	export let username: string;
	export let cssClass: string = '';
</script>

{#if $newProfilePicture}
	<Avatar class={cssClass} src={$newProfilePicture} alt="profile Picture" />
{:else if src}
	<Avatar class={cssClass} {src} alt="profile Picture" />
{:else}
	<Avatar class={cssClass} initials={getInitalsFromUsername(username)} />
{/if}
