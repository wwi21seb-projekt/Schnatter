<script lang="ts">
	import type { PostStructure, TextColorPost, LikeObjectStructure } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';
	import { checkForHashtags, likeCounter } from '$lib/PostFunctions';

	export let postData;

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

	let post: PostStructure = postData;
	let postDate: string = '';

	onMount(() => {
		helperHashtagCheck();
		const dateConverted: Date = new Date(post.creationDate);
		postDate = dateConverted.toLocaleDateString();
	});

	function likeHelper() {
		likeObject = likeCounter(likeObject);
	}

	function helperHashtagCheck() {
		newPost = checkForHashtags(post);
	}
</script>

<main class="flex flex-col mb-6">
	<div class="card w-[60vw] mb-2">
		<header class="card-header w-full flex justify-between items-center">
			<div class="flex flex-row items-center">
				<Avatar
					class="h-[5vh] w-[5vh] rounded-full mr-3"
					src={post.author.profilePictureUrl}
					initials=""
				/>
				<div class="flex flex-col">
					<a href="/profile?username={post.author.username}">@{post.author.username}</a>
					<p class="font-light text-sm">{post.author.nickname}</p>
				</div>
			</div>
			<p class="text-xs">{postDate}</p>
		</header>
		<section class="p-4">
			<p class="h-[15vh] border-solid border-2 border-gray-800 p-1 text-lg">
				{#each newPost as { hashtagClass, text, wordID } (wordID)}
					<span class={hashtagClass}>{text} </span>
				{/each}
			</p>
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-row w-full">
			<div class="flex flex-row">
				<button on:click={likeHelper}>
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={likeObject.liked ? 'red' : 'white'}
					></Icon>
				</button>
				<p class="mr-1">{likeObject.likeCount}</p>
			</div>
			{#if loginToken != '' || loginToken != undefined}
				<input
					class="input mx-3"
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
				<p class="font-bold text-xl">{$t('post.comments.header')}</p>
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
