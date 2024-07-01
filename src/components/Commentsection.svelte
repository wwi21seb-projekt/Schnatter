<script lang="ts">
	import { fetchComments } from '$lib/utils/Comments';
	import { onMount } from 'svelte';
	import { t } from '../i18n';
	import type { UUID } from 'crypto';
	import type { Comments } from '$lib/types/Comment';
	import ProfilePicture from './ProfilePicture.svelte';
	import { getInitalsFromUsername } from '$lib/utils/Pictures';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/utils/Toasts';

	let limit: number = 10;
	let offset: number = 0;
	export let commentData: Comments;
	export let postId: UUID;

	const toastStore = getToastStore();

	onMount(async () => {
		const response = await fetchComments(limit, postId, offset);
		if (typeof response === 'number') {
			if (response == 401) {
				toastStore.trigger(createToast($t('post.comments.error.unauthorized')));
			} else if (response == 404) {
				toastStore.trigger(createToast($t('post.comments.error.notFound')));
			} else {
				toastStore.trigger(createToast($t('post.comments.error.unknown')));
			}
		} else {
			commentData = response;
		}
	});
</script>

<div class="card w-[60vw] max-h-96 overflow-auto">
	<header class="card-header flex flex-row items-center">
		<p class="font-bold text-xl" title="commentsHeader">{$t('post.comments.header')}</p>
	</header>
	{#if commentData.records == null}
		<div class="m-3">{$t('post.comments.noComments')}</div>
	{:else}
		{#each commentData.records as comment}
			<section class="p-3 flex flex-col">
				<div class="flex flex-row">
					<div class="items-baseline">
						<ProfilePicture
							cssClass="h-[3vh] w-[3vh] rounded-full mr-2 isolation-auto"
							src={comment.author.picture?.url ?? ''}
							username={getInitalsFromUsername(comment.author.username)}
						/>
					</div>
					<div class="flex flex-col">
						<span class="font-bold">{comment.author.username}</span>
						<p class="w-full">{comment.content}</p>
					</div>
				</div>
			</section>
		{/each}
	{/if}
</div>
