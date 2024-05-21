<script lang="ts">
	import type { PostUserProfilStructure, TextColorPost } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { serverURL, token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';
	import { checkForHashtags, likeCounter } from '$lib/PostFunctions';
	import { createToast } from '$lib/Toasts';
	import type { CustomError } from '$lib/types/CustomError';
	import { getLocationCity } from '$lib/utils/GeoLocationUtils';
	import { sendComment } from '$lib/CommentFunctions';
	import Commentsection from './Commentsection.svelte';

	export let postData;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let deleteOption: boolean = true;
	let statusCode: number = 0;
	export let currentUsername: string | undefined;

	let locationString = '';

	const loginToken = get(token);

	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	let post: PostUserProfilStructure = postData;
	let postDate: string = '';
	let showNoComments = false;
	let commentText: string = '';
	let click: number = 0;

	const modalDelete: ModalSettings = {
		type: 'confirm',
		title: $t('modalDeletePost.confirm'),
		response: (t: boolean) => {
			if (t) {
				deletePost();
			}
		}
	};

	onMount(async () => {
		if (post.location) {
			locationString = await getLocationCity(post.location);
		}
		helperHashtagCheck();
		const dateConverted: Date = new Date(post.creationDate);
		postDate = dateConverted.toLocaleDateString();
		checkDeleteOption();
	});

	function handleLickClick() {
		if (loginToken != '' || loginToken == undefined) {
			post = likeCounter(post as PostUserProfilStructure, toastStore) as PostUserProfilStructure;
		}
	}

	function helperHashtagCheck() {
		newPost = checkForHashtags(post);
	}

	function checkDeleteOption() {
		if (currentUsername == undefined) {
			deleteOption = true;
		} else {
			deleteOption = false;
		}
	}

	async function deletePost() {
		let customError: CustomError = {
			message: '',
			code: ''
		};
		const serverUrl = get(serverURL) + '/posts/' + post.postId;

		try {
			const response = await fetch(serverUrl, {
				method: 'DELETE',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + get(token)
				}
			});
			statusCode = response.status;
			if (statusCode !== 204) {
				const body = await response.json();
				customError = body.error;
			}
		} catch (error) {
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		}
		if (statusCode !== 204 && statusCode !== 500) {
			toastStore.trigger(createToast(customError.message, 'error'));
		} else if (statusCode == 204) {
			window.location.reload();
		}
	}
	function setShowButton() {
		showNoComments = !showNoComments;
	}

	function commentSendButton() {
		sendComment(post.postId, commentText);
		commentText = ' ';
		click++;
	}
</script>

<main class="flex flex-col mb-6">
	<div class="card w-[60vw] mb-2">
		<header class="card-header w-full flex justify-between items-center">
			<div class="flex flex-col items-start">
				<p class="text-xs">{locationString}</p>
				<p class="text-xs">{postDate}</p>
			</div>
			{#if deleteOption}
				<button
					on:click={() => {
						modalStore.trigger(modalDelete);
					}}
				>
					<Icon class="w-7 h-7 mr-2" icon="ic:baseline-delete"></Icon></button
				>
			{/if}
		</header>
		<section class="p-4">
			<p class="h-[15vh] border-solid border-2 border-gray-800 p-1 text-lg overflow-auto">
				{#each newPost as { hashtagClass, text, wordID } (wordID)}
					<span class={hashtagClass}>{text} </span>
				{/each}
			</p>
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-row w-full">
			<div class="flex flex-row float-left items-center w-[35%]">
				<button on:click={handleLickClick}>
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={post.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1">{post.likes}</p>
				{#if loginToken != ''}
					<button
						type="button"
						data-sveltekit-preload-data="hover"
						class="ml-2 btn btn-sm border-solid border-2"
						on:click={setShowButton}
						>{showNoComments
							? $t('post.comments.buttonHideComments')
							: $t('post.comments.buttonShowComments')}</button
					>
				{/if}
			</div>
			{#if loginToken != ''}
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
					<button class="w-7" on:click={commentSendButton}>
						<Icon class="w-7 h-7" icon="fluent:send-16-filled"></Icon>
					</button>
				</div>
			{/if}
		</footer>
	</div>
	{#if (loginToken != '' || loginToken == undefined) && showNoComments}
		{#key click}
			<Commentsection postId={post.postId} />
		{/key}
	{/if}
</main>
