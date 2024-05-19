<script lang="ts">
	import { fetchComments } from '$lib/CommentFunctions';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { t } from '../i18n';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
	import type { UUID } from 'crypto';
	import type { Comments } from '$lib/types/Comment';

	const loginToken = get(token);
	let limit: number = 10;
	let offset: number = 0;
	export let postId: UUID;
	let commentFetchError: string = '0';
	let commentData: Comments = {
		records: [
			{
				commentId: '539328e8-8750-4f42-9d53-d31409877c33',
				content: '',
				creationDate: '',
				author: {
					username: '',
					nickname: '',
					profilePictureUrl: ''
				}
			}
		],
		pagination: {
			limit: 10,
			offset: 0,
			records: 1
		}
	};

	onMount(async () => {
		const response = await fetchComments(loginToken, limit, postId, offset);
		if (typeof response === 'number') {
			if (response == 401) {
				commentFetchError = 'The request is unauthorized.';
			} else if (response == 404) {
				commentFetchError = 'The comments were not found.';
			} else {
				commentFetchError = 'Sorry, we ran into an error!';
			}
		} else {
			commentData = response;
		}
	});
</script>

<div class="card w-[60vw]">
	{#if commentFetchError !== '0'}
		<div class="items-center p-2">{commentFetchError}</div>
	{:else}
		<header class="card-header flex flex-row items-center">
			<p class="font-bold text-xl" title="commentsHeader">{$t('post.comments.header')}</p>
		</header>
		{#each commentData.records as comment}
			{#if commentData.records.length == 0}
				<div>{$t('post.comments.noComments')}</div>
			{:else}
				<section class="p-3 flex flex-col">
					<div class="flex flex-row">
						<div class="items-baseline">
							<Avatar class="h-[3vh] w-[3vh] rounded-full mr-2" src="/default-avatar.png" />
						</div>
						<div class="flex flex-col">
							<p class="font-bold">{comment.author.username}</p>
							<p class="w-full">{comment.content}</p>
						</div>
					</div>
				</section>
			{/if}
		{/each}
	{/if}
</div>
