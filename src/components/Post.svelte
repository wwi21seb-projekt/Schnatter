<script lang="ts">
	import type { PostStructure, TextColorPost, LikeObjectStructure } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';
	import { checkForHashtags, likeCounter } from '$lib/PostFunctions';
	import { getLocationCity } from '$lib/utils/GeoLocationUtils';
	import Commentsection from './Commentsection.svelte';
	import { sendComment } from '$lib/CommentFunctions';

	export let postData;

	let post: PostStructure = postData;
	let postDate: string = '';

	let locationString = '';

	let commentText: string = '';

	const loginToken = get(token);
	let likeObject: LikeObjectStructure = {
		likeCount: 123,
		liked: false
	};

	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	onMount(async () => {
		if (post.location) {
			locationString = await getLocationCity(post.location);
		}
		helperHashtagCheck();
		const dateConverted: Date = new Date(post.creationDate);
		postDate = dateConverted.toLocaleDateString();
	});

	function likeHelper() {
		if (loginToken != '' || loginToken == undefined) {
			likeObject = likeCounter(likeObject);
		}
	}

	function helperHashtagCheck() {
		newPost = checkForHashtags(post);
	}
	let showComments = false;

	function setShowButton() {
		showComments = !showComments;
	}
</script>

<main class="flex flex-col mb-6">
	<div class="card w-[60vw] mb-2" title="post">
		<header class="card-header w-full flex justify-between items-center">
			<div class="flex flex-row items-center">
				<Avatar
					class="h-[5vh] w-[5vh] rounded-full mr-3"
					src={post.author.profilePictureUrl}
					initials=""
				/>
				<div class="flex flex-col">
					<a
						title="postAuthorUsername"
						href="/profile?username={post.author.username}"
						data-sveltekit-preload-data="hover">@{post.author.username}</a
					>
					<p class="font-light text-sm" title="postAuthorNickname">{post.author.nickname}</p>
				</div>
			</div>
			<div class="flex flex-col items-end">
				<p class="text-xs">{locationString}</p>
				<p class="text-xs" title="postdate">{postDate}</p>
			</div>
		</header>
		<section class="p-4">
			<p
				class="h-[15vh] border-solid border-2 border-gray-800 p-1 text-lg overflow-auto"
				title="postcontent"
			>
				{#each newPost as { hashtagClass, text, wordID } (wordID)}
					<span class={hashtagClass}>{text} </span>
				{/each}
			</p>
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-row w-full">
			<div class="flex flex-row float-left items-center w-[35%]">
				<button on:click={likeHelper} title="like">
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={likeObject.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1" title="likeCount">{likeObject.likeCount}</p>
				<button
					type="button"
					data-sveltekit-preload-data="hover"
					class="ml-2 btn btn-sm border-solid border-2"
					on:click={setShowButton}
					>{showComments
						? $t('post.comments.buttonHideComments')
						: $t('post.comments.buttonShowComments')}</button
				>
			</div>
			{#if loginToken != '' || loginToken != undefined}
				<div class="flex float-right w-[65%]">
					<label class="label p-2 w-full">
						<textarea
							class="textarea resize-none"
							title="commentInput"
							bind:value={commentText}
							placeholder={commentText === '' ? $t('post.postComment.placeholder') : ''}
							rows="1"
							maxlength="128"
						/>
					</label>
					<button class="w-7" on:click={() => sendComment(post.postId, commentText)}>
						<Icon class="w-7 h-7" icon="fluent:send-16-filled"></Icon>
					</button>
				</div>
			{/if}
		</footer>
	</div>
	{#if (loginToken != '' || loginToken == undefined) && showComments}
		<Commentsection postId={post.postId} />
	{/if}
</main>
