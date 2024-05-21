<script lang="ts">
	import type { PostStructure, TextColorPost, LikeObjectStructure } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { Avatar, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';
	import { checkForHashtags, likeCounter } from '$lib/PostFunctions';
	import { getLocationCity } from '$lib/utils/GeoLocationUtils';

	export let postData;

	const modalStore = getModalStore();

	let post: PostStructure = postData;
	let postDate: string = '';
	let repostDate: string = '';

	let locationString = '';
	let repostLocationString = '';

	const loginToken = get(token);
	let likeObject: LikeObjectStructure = {
		likeCount: 123,
		liked: false
	};

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalCreatePost',

		meta: {repostId: post.postId}
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

		if (post.repost != undefined && post.repost != null) {
			newRepostPost = helperHashtagCheck(post.repost);
			if (post.repost.location) {
				repostLocationString = await getLocationCity(post.repost.location);
			}
			if (post.repost.creationDate) {
				const repostDateConverted: Date = new Date(post.repost.creationDate);
				repostDate = repostDateConverted.toLocaleDateString();
			}
		}

		newPost = helperHashtagCheck(post);
		const dateConverted: Date = new Date(post.creationDate);
		postDate = dateConverted.toLocaleDateString();
	});

	function likeHelper() {
		if (loginToken != '' || loginToken == undefined) {
			likeObject = likeCounter(likeObject);
		}
	}

	function repostHelper() {
		modalStore.trigger(modal);
	}

	function helperHashtagCheck(post: PostStructure) {
		return checkForHashtags(post);
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
				class="h-[15vh] border-solid border-2 border-gray-800 p-1 text-lg h-auto"
				title="postcontent"
			>
				{#each newPost as { hashtagClass, text, wordID } (wordID)}
					<span class={hashtagClass}>{text} </span>
				{/each}
				{#if post.repost != undefined || post.repost != null}
					<header class="card-header w-full flex justify-between items-center">
						<div class="flex flex-row items-center">
							<Avatar
								class="h-[5vh] w-[5vh] rounded-full mr-3"
								src={post.repost.author.profilePictureUrl}
								initials=""
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
						<p
							class="h-[10vh] border-solid border-2 border-gray-800 p-1 text-lg h-auto"
							title="repostPostcontent"
						>
							{#each newRepostPost as { hashtagClass, text, wordID } (wordID)}
								<span class="{hashtagClass} text-[0.75rem]">{text} </span>
							{/each}
						</p>
					</section>
				{/if}
			</p>
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-row w-full">
			<div class="flex flex-row">
				<button on:click={likeHelper} title="like">
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={likeObject.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1" title="likeCount">{likeObject.likeCount}</p>
			</div>
			{#if loginToken != '' || loginToken != undefined}
				<button on:click={repostHelper} title="repost">
					<Icon class="w-7 h-7 mr-1" icon="mdi:autorenew"></Icon>
				</button>
				<input
					class="input mx-3"
					title="commentInput"
					type="text"
					placeholder={$t('post.postComment.placeholder')}
					maxlength="256"
					disabled
				/>
				<button class="">
					<Icon class="w-7 h-7" icon="fluent:send-16-filled"></Icon>
				</button>
			{/if}
		</footer>
	</div>
	{#if loginToken != '' || loginToken == undefined}
		<div class="card w-[60vw]">
			<header class="card-header">
				<p class="font-bold text-xl" title="commentsHeader">{$t('post.comments.header')}</p>
			</header>
			<section class="p-3 flex flex-col">
				<div class="flex flex-row">
					<div class="items-baseline">
						<Avatar class="h-[3vh] w-[3vh] rounded-full mr-2" src="/default-avatar.png" />
					</div>
					<div class="flex flex-col">
						<p class="font-bold">Username</p>
						<p class="w-full">Kommentar 1 ist hier</p>
					</div>
				</div>
				<div class="flex flex-row">
					<div class="items-baseline">
						<Avatar class="h-[3vh] w-[3vh] rounded-full mr-2" src="/default-avatar.png" />
					</div>
					<div class="flex flex-col">
						<p class="font-bold">Username</p>
						<p class="w-full">Hier ist der 2. Kommentar</p>
					</div>
				</div>
			</section>
		</div>
	{/if}
</main>
