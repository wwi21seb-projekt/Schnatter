<script lang="ts">
	import type { PostStructure, TextColorPost } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../../i18n';
	import { onMount } from 'svelte';
	import { getLocationCity } from '$lib/utils/GeoLocationUtils';
	import { fetchComments, sendComment } from '$lib/utils/Comments';
	import Commentsection from './Commentsection.svelte';
	import { deletePost, checkForHashtags, likeCounter } from '$lib/utils/Posts';
	import type { Comments } from '$lib/types/Comment';
	import Content from './Content.svelte';
	import Header from './Header.svelte';

	export let postData: PostStructure;
	export let currentUsername: string | undefined;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let deleteOption: boolean = true;
	let limit: number = 10;
	let offset: number = 0;

	let locationString = '';
	let repostLocationString = '';

	const loginToken = get(token);

	let postDate: string = '';
	let repostDate: string = '';

	let post: PostStructure = postData;

	let isLoggedOut: boolean = true;

	let showNoComments = false;
	let commentText: string = '';
	let click: number = 0;

	const modalRepost: ModalSettings = {
		type: 'component',
		component: 'modalCreatePost',

		meta: { repostId: post.postId }
	};

	const modalDelete: ModalSettings = {
		type: 'confirm',
		title: $t('modalDeletePost.confirm'),
		response: (t: boolean) => {
			if (t) {
				deletePost(post.postId, toastStore);
			}
		}
	};
	let commentData: Comments = {
		records: [
			{
				commentId: '539328e8-8750-4f42-9d53-d31409877c33',
				content: '',
				creationDate: '',
				author: {
					username: '',
					nickname: '',
					picture: {
						url: '',
						height: 0,
						width: 0,
						tag: ''
					}
				}
			}
		],
		pagination: {
			limit: 100,
			offset: 0,
			records: 1
		}
	};

	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	let newRepostPost: TextColorPost[] = [
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
		//Conversion of the date so that it is displayed in a nicer format
		const dateConverted: Date = new Date(post.creationDate);
		postDate = dateConverted.toLocaleDateString();
		checkDeleteOption();

		if (post.repost != undefined && post.repost != null) {
			newRepostPost = parsePostHashtags(post.repost);
			if (post.repost.location) {
				repostLocationString = await getLocationCity(post.repost.location);
			}
			if (post.repost.creationDate) {
				const repostDateConverted: Date = new Date(post.repost.creationDate);
				repostDate = repostDateConverted.toLocaleDateString();
			}
		}

		newPost = parsePostHashtags(post);
		if (loginToken != '' || loginToken == undefined) {
			isLoggedOut = false;
		}
	});

	function handleLikeClick() {
		if (loginToken != '' || loginToken == undefined) {
			post = likeCounter(post as PostStructure, toastStore) as PostStructure;
		}
	}

	function checkDeleteOption() {
		if (currentUsername == undefined) {
			deleteOption = true;
		} else {
			deleteOption = false;
		}
	}

	function handleRepostClick() {
		modalStore.trigger(modalRepost);
	}

	function parsePostHashtags(post: PostStructure) {
		return checkForHashtags(post);
	}

	async function setShowButton() {
		showNoComments = !showNoComments;
		if (showNoComments) {
			commentData = (await fetchComments(limit, postData.postId, offset, toastStore)) as Comments;
		}
	}

	async function commentSendButton() {
		sendComment(post.postId, commentText, toastStore);
		commentText = '';

		commentData = (await fetchComments(limit, postData.postId, offset, toastStore)) as Comments;
		if (post.comments != undefined) {
			post.comments += 1;
		}
		post.comments = post.comments ?? 1;
	}
</script>

<main class="flex flex-col mb-6">
	<div class="card md:w-[60vw] w-[95vw] mb-2 divide-y divide-current" title="post">
		<header class="card-header w-full flex justify-between items-center">
			{#if post.author}
				<Header author={post.author} {repostDate} {repostLocationString} />
				{#if deleteOption}
					<button
						on:click={() => {
							modalStore.trigger(modalDelete);
						}}
					>
						<Icon class="w-7 h-7 mr-2" icon="clarity:trash-line"></Icon></button
					>
				{/if}
			{:else}
				<div class="flex flex-row items-center justify-between w-full">
					<div class="flex flex-col">
						<p class="text-xs">{locationString}</p>
						<p class="text-xs" title="postdate">{postDate}</p>
					</div>
					{#if deleteOption}
						<button
							on:click={() => {
								modalStore.trigger(modalDelete);
							}}
						>
							<Icon class="w-7 h-7" icon="clarity:trash-line"></Icon></button
						>
					{/if}
				</div>
			{/if}
		</header>
		<section class="p-6 mt-5 w-full">
			<div class="flex flex-col">
				<Content postPicture={post.picture?.url} contentText={newPost} />
			</div>
			{#if post.repost}
				<div class="border-solid border-2 border-current rounded divide-y divide-current">
					{#if post.repost.author}
						<header class="card-header w-full mb-1 flex justify-between items-center">
							<Header author={post.repost.author} {repostDate} {repostLocationString} />
						</header>
						<Content postPicture={post.repost.picture?.url} contentText={newRepostPost} />
					{:else}
						<p class="p-4">{$t('post.repost.deleted')}</p>
					{/if}
				</div>
			{/if}
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-col md:flex-row w-full">
			<div class="flex flex-row float-left items-center justify-center w-[35%]">
				<button disabled={isLoggedOut} on:click={handleLikeClick} title="like">
					<Icon class="w-7 h-7 mr-1" icon="clarity:heart-solid" color={post.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1" title="likeCount">{post.likes}</p>
				{#if loginToken != '' && loginToken != undefined}
					{#if post.repost == undefined || post.repost == null}
						<button on:click={handleRepostClick} title="repost">
							<Icon class="w-7 h-7 mr-1" icon="clarity:repeat-line"></Icon>
						</button>
					{/if}
					<button
						type="button"
						data-sveltekit-preload-data="hover"
						class="ml-2 btn btn-sm border-solid border-2"
						on:click={setShowButton}
					>
						<!--Display whether and how many comments there are-->
						{showNoComments
							? $t('post.comments.buttonHideComments')
							: post.comments +
								' ' +
								(post.comments === 1
									? $t('post.comments.buttonShowComment')
									: $t('post.comments.buttonShowComments'))}</button
					>
				{/if}
			</div>
			{#if loginToken != ''}
				<form
					class="flex float-right w-[65%]"
					on:submit|preventDefault={commentSendButton}
					id="formComment"
				>
					<label class="label p-2 w-full">
						<input
							class="textarea resize-none"
							title="commentInput"
							bind:value={commentText}
							placeholder={$t('post.postComment.placeholder')}
							maxlength="128"
						/>
					</label>
					<button class="w-7" type="submit">
						<Icon class="w-7 h-7" icon="fluent:send-16-filled"></Icon>
					</button>
				</form>
			{/if}
		</footer>
	</div>
	{#if (loginToken != '' || loginToken == undefined) && showNoComments}
		{#key click}
			<Commentsection postId={post.postId} commentData={commentData ?? 404} />
		{/key}
	{/if}
</main>
