<script lang="ts">
	import { Avatar, Toast, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Post from '../../components/Post.svelte';
	import type { PostStructure, ProfilePostStructure } from '$lib/types/Post';
	import type { ProfileFeed } from '$lib/types/Feed';

	let editMode: boolean = false;
	let nickname: string = data.user.nickname;
	let bioStatus: string = data.user.status;
	let feed: ProfilePostStructure[]= data.feed.records;

	initializeStores();
	const toastStore = getToastStore();
	const t: ToastSettings = {
		message: 'Internal Server error. Please try again later or reload the page!',
		autohide: false,
		background: 'variant-filled-error'
	};

	const user = data.user;
	if (data.statusCodeDetails == 500) {
		toastStore.trigger(t);
	}
	function changeEditMode() {
		editMode = !editMode;
	}

	//data to fill the example-post
	let post: PostStructure = {
		postID: '535fcd7a-aa7a-4524-88d6-ead97c6e51b7',
		author: {
			username: 'user1',
			nickname: 'cooler User',
			profilePictureUrl: '/default-avatar.png'
		},

		creationDate: new Date(2023, 11, 5),
		content: 'Hier #ist ein Post. Und hier ist #Text!'
	};
</script>

<Toast />
<main class=" flex flex-col items-center justify-start">
	<!--header-->
	<div
		class=" w-full h-[35vh] flex flex-row justify-center items-center border-b-4 border-indigo-800"
	>
		<div class="h-[20vh] w-[20vh] rounded-full">
			<Avatar class="w-full h-full" src={user.profilePictureUrl} initials="" />
		</div>
		<div class="h-[20vh] w-[50vw] p-6">
			<h3 class="h3">{user.username}</h3>
			{#if editMode}
				<input
					bind:value={nickname}
					class="mb-4 input w-[15vw]"
					type="text"
					placeholder="new nickname"
				/>
				<textarea
					bind:value={bioStatus}
					maxlength="128"
					class="textarea"
					placeholder="new Status"
				/>
			{:else}
				<p class="opacity-70 mb-4">{user.nickname}</p>
				<p>{user.status}</p>
			{/if}
		</div>
		<div class="h-[20vh] w-[22vw] flex flex-row justify-around items-center">
			<div class="flex flex-col items-center justify-center">
				<h2 class="h2">{user.posts}</h2>
				<p>Posts</p>
			</div>
			<a href="/followers">
				<div class="flex flex-col items-center justify-center">
					<h2 class="h2">{user.follower}</h2>
					<p>Follwers</p>
				</div>
			</a>
			<a href="/following">
				<div class="flex flex-col items-center justify-center">
					<h2 class="h2">{user.following}</h2>
					<p>Following</p>
				</div>
			</a>
			<div>
				{#if editMode == true}
					<button on:click={changeEditMode} class="btn variant-filled-primary"> Save</button>
				{:else}
					<button on:click={changeEditMode} class="btn variant-filled-tertiary">Edit profil</button>
				{/if}
			</div>
		</div>
	</div>
	<!--Posts-->
	<div class="flex flex-col items-center justify-start w-full h-[100vh] mt-6">
		{#each feed as post (post.postId)}
			<Post  bind:postData={post}></Post>
		{/each}
	</div>
</main>
