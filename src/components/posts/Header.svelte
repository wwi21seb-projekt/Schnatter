<script lang="ts">
	import type { Author } from '$lib/types/Author';
	import ProfilePicture from '../ProfilePicture.svelte';
	export let author: Author;
	export let repostLocationString: string;
	export let repostDate: string;
</script>

<div class="flex flex-row items-center">
	<ProfilePicture
		cssClass="h-[5vh] w-[5vh] rounded-full mr-3 isolation-auto"
		src={author.picture?.url ?? ''}
		username={author.username}
	/>
	<div class="flex flex-col">
		<a
			class="text-[0.75rem]"
			title="repostAuthorUsername"
			href="/profile?username={author.username}"
			data-sveltekit-preload-data="hover">@{author.username}</a
		>

		<p class="font-light text-xs text-[0.75rem]" title="repostAuthorNickname">
			{author.nickname}
		</p>
	</div>
</div>
<div class="flex flex-col items-end">
	<p class="text-xs text-[0.75rem]">{repostLocationString}</p>
	<p class="text-xs text-[0.75rem]" title="repostPostdate">{repostDate}</p>
</div>
