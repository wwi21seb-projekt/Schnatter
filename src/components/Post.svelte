<script lang="ts">
	import type { PostStructure, TextColorPost } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';
	import { checkForHashtags, likeCounter } from '$lib/PostFunctions';
	import { getLocationCity } from '$lib/utils/GeoLocationUtils';
	import { sendComment } from '$lib/CommentFunctions';
	import Commentsection from './Commentsection.svelte';
	import { deletePost } from '$lib/PostFunctions';
	import ProfilePicture from './ProfilePicture.svelte';

	export let postData;
	export let currentUsername: string | undefined;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let deleteOption: boolean = true;

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

	function setShowButton() {
		showNoComments = !showNoComments;
	}

	function commentSendButton() {
		sendComment(post.postId, commentText);
		commentText = '';
		click++;
	}
</script>

<main class="flex flex-col mb-6">
	<div class="card md:w-[60vw] w-[95vw] mb-2 divide-y divide-current" title="post">
		<header class="card-header w-full flex justify-between items-center">
			{#if post.author}
				<div class="flex flex-row items-center">
					<ProfilePicture
						cssClass="h-[5vh] w-[5vh] rounded-full mr-3"
						src={post.author.picture?.pictureURL ?? ''}
						username={post.author.username}
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
				<div class="flex flex-row items-center">
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
							<Icon class="w-7 h-7 mr-2" icon="ic:baseline-delete"></Icon></button
						>
					{/if}
				</div>
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
							<Icon class="w-7 h-7" icon="ic:baseline-delete"></Icon></button
						>
					{/if}
				</div>
			{/if}
		</header>
		<section class="p-6 mt-5 w-full">
			<div class="flex flex-col">
				<div class="flex justify-center">
					<img src={post.picture?.pictureURL} alt="" />
				</div>
				<p class="h-auto p-1 text-lg min-h-[5vh]" title="postcontent">
					{#each newPost as { hashtagClass, text, wordID } (wordID)}
						<span class={hashtagClass}>{text} </span>
					{/each}
				</p>
			</div>
			{#if post.repost}
				<div class="border-solid border-2 border-current rounded divide-y divide-current">
					{#if post.repost.author}
						<header class="card-header w-full mb-1 flex justify-between items-center">
							<div class="flex flex-row items-center">
								<ProfilePicture
									cssClass="h-[5vh] w-[5vh] rounded-full mr-3"
									src={post.repost.author.picture?.pictureURL ?? ''}
									username={post.repost.author.username}
								/>
								<div class="flex flex-col">
									<a
										class="text-[0.75rem]"
										title="repostAuthorUsername"
										href="/profile?username={post.repost.author.username}"
										data-sveltekit-preload-data="hover">@{post.repost.author.username}</a
									>

									<p class="font-light text-xs text-[0.75rem]" title="repostAuthorNickname">
										{post.repost.author.nickname}
									</p>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<p class="text-xs text-[0.75rem]">{repostLocationString}</p>
								<p class="text-xs text-[0.75rem]" title="repostPostdate">{repostDate}</p>
							</div>
						</header>
						<section class="p-4">
							<p class="h-[10vh] p-1 text-lg" title="repostPostcontent">
								{#each newRepostPost as { hashtagClass, text, wordID } (wordID)}
									<span class="{hashtagClass} text-[0.75rem]">{text} </span>
								{/each}
							</p>
						</section>
					{:else}
						<p class="p-4">{$t('post.repost.deleted')}</p>
					{/if}
				</div>
			{/if}
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-col md:flex-row w-full">
			<div class="flex flex-row float-left items-center justify-center w-[35%]">
				<button disabled={isLoggedOut} on:click={handleLikeClick} title="like">
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={post.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1" title="likeCount">{post.likes}</p>
				{#if loginToken != '' && loginToken != undefined}
					{#if post.repost == undefined || post.repost == null}
						<button on:click={handleRepostClick} title="repost">
							<Icon class="w-7 h-7 mr-1" icon="mdi:autorenew"></Icon>
						</button>
					{/if}
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
							placeholder={$t('post.postComment.placeholder')}
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
