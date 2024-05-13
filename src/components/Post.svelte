<script lang="ts">
	import type { PostStructure, TextColorPost } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';
	import { checkForHashtags, likeCounter } from '$lib/PostFunctions';
	import { getLocationCity } from '$lib/utils/GeoLocationUtils';

	export let postData;

	let post: PostStructure = postData;
	let postDate: string = '';

	let locationString = '';

	const loginToken = get(token);

	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	let post: PostStructure = postData;
	let postDate: string = '';
	let isLoggedOut: boolean = true;
	const toastStore = getToastStore();


	onMount(async () => {
		if (post.location) {
			locationString = await getLocationCity(post.location);
		}
		helperHashtagCheck();
		const dateConverted: Date = new Date(post.creationDate);
		postDate = dateConverted.toLocaleDateString();
		if (loginToken != '' || loginToken == undefined) {
			isLoggedOut = false;
		}
	});

	function likeHelper() {
		if (loginToken != '' || loginToken == undefined) {
			post = likeCounter(post as PostStructure, toastStore) as PostStructure;
		}
	}

	function helperHashtagCheck() {
		newPost = checkForHashtags(post);
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
			<div class="flex flex-row">
				<button disabled={isLoggedOut} on:click={likeHelper} title="like">
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={post.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1" title="likeCount">{post.likes}</p>
			</div>
			{#if loginToken != '' || loginToken != undefined}
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
