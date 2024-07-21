<script lang="ts">
	import type { TextColorPost } from '$lib/types/Post';

	export let postPicture: string | undefined;
	export let contentText: TextColorPost[];
</script>

<!--Content Section for Posts and reposts-->
<section class="p-4">
	{#if postPicture}
		<div class="flex justify-center">
			<img class="max-h-[375px] rounded-md object-contain" src={postPicture} alt="" />
		</div>
	{/if}
	<p class="h-[10vh] p-1 text-lg" title="repostPostcontent">
		{#each contentText as { hashtagClass, text, wordID } (wordID)}
			<span class={hashtagClass}>{text} </span>
		{/each}
	</p>
</section>
