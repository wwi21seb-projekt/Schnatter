<script lang="ts">
	import type { PostStructure, TextColorPost } from '$lib/types/Post';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { onMount } from 'svelte';

	export let postData;

	const loginToken = get(token);
	let likeCount: number = 123;
	let liked: boolean = false;

	let newPost: TextColorPost[] = [
		{
			isHashtag: false,
			text: '',
			wordID: 0
		}
	];

	let wordId: number = 0;
	let post: PostStructure = postData;

	onMount(() => {
		checkForHashtag();
	});

	function likeCounter() {
		if (liked == false) {
			likeCount++;
			liked = true;
		} else {
			likeCount--;
			liked = false;
		}
	}
	function checkForHashtag() {
		let words: RegExpMatchArray | null;
		const regexSentence = /#?\b\w+\b|[.,;?!]/g;
		const text = post.content;
		words = text.match(regexSentence);

		if (words !== null) {
			newPost = words.map((word) => {
				return { isHashtag: word.startsWith('#'), text: word, wordID: wordId++ };
			});
		}
	}
</script>

<main class="flex flex-col h-[35vh]">
	<div class="card w-[60vw] mb-2">
		<header class="card-header w-full">
			<div class="flex justify-between items-center">
				<div class="flex flex-row items-center">
					<Avatar
						class="h-[5vh] w-[5vh] rounded-full mr-3"
						src={post.author.profilePictureUrl}
						initials=""
					/>
					<div class="flex flex-col">
						<p class="">{post.author.username}</p>
						<p class="font-light text-sm">{post.author.nickname}</p>
					</div>
				</div>
				<p class="text-xs">{post.creationDate.toDateString()}</p>
			</div>
		</header>
		<section class="p-4">
			<p class="h-[15vh] border-solid border-2 border-gray-800 p-1 text-lg">
				{#each newPost as { isHashtag, text } (text)}
					{#if isHashtag}
						<span style="color:dodgerBlue;">{text} </span>
					{:else}
						<span>{text} </span>
					{/if}
				{/each}
			</p>
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-row w-full">
			<div class="flex flex-row">
				<button on:click={likeCounter} disabled>
					<Icon class="w-7 h-7 mr-1" icon="ph:heart-fill" color={liked ? 'red' : 'white'}></Icon>
				</button>
				<p class="mr-1">{likeCount}</p>
			</div>
			{#if loginToken != ''}
				<input
					class="input mx-3"
					type="text"
					placeholder={$t('post.postComment.placeholder')}
					maxlength="256"
					disabled
				/>
				<button class="" on:click={checkForHashtag}>
					<Icon class="w-7 h-7" icon="fluent:send-16-filled"></Icon>
				</button>
			{/if}
		</footer>
	</div>
	{#if loginToken != ''}
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