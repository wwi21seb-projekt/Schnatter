<script lang="ts">
	import {
		Avatar,
		Toast,
		Modal,
		getModalStore,
		type ToastSettings,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type {  UserPostFetchResponse } from '$lib/types/Post';
	import PostUserProfil from '../../components/PostUserProfil.svelte';
	import { onMount } from 'svelte';
	import { getProfileDetails, getProfilePosts } from './requests';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
	import type { UserFetchResponse } from '$lib/types/User';
	import Icon from '@iconify/svelte';
	import ModelChangePwd from '../../components/modals/ModalChangePwd.svelte';
	
	import { createToast } from '$lib/Toasts';

	const toastStore = getToastStore();
	const t: ToastSettings = {
		message: 'Internal Server error. Please try again later or reload the page!',
		autohide: false,
		background: 'variant-filled-error'
	};

	const modelStore = getModalStore();
	const modalComponent: ModalComponent = { ref: ModelChangePwd };

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		response: (response: any) => {
			if(response == 200){
			toastStore.trigger(createToast("Pwd was changed","success"))
			}else{
				toastStore.trigger(createToast("Pwd was not changed","error"))
			}
		}
	};

	let profileData: UserFetchResponse = {
		user: {
			username: '',
			nickname: '',
			status: '',
			profilePictureUrl: '',
			follower: 0,
			following: 0,
			posts: 0
		},
		statusCode: 0
	};
	let postData: UserPostFetchResponse = {
		records: [],
		pagination: {
			limit: 0,
			offset: 0,
			records: 0
		},
		statusCode: 0
	};
	let editMode: boolean = false;
	let nickname: string = '';
	let bioStatus: string = '';

	onMount(async () => {
		profileData = await getProfileDetails(get(token), 'mabu2807');
		nickname = profileData.user.nickname;
		bioStatus = profileData.user.status;

		if (profileData.statusCode == 500) {
			toastStore.trigger(t);
		}

		postData = await getProfilePosts(get(token), 'mabu2807');
	});


	function changeEditMode() {
		editMode = !editMode;
	}
	function handleDetailSubmit() {
		editMode = false;
	}

	function openChangePwdModel() {
		modelStore.trigger(modal);
	}
</script>

<Toast />
<Modal />
<main class=" flex flex-col items-center justify-start">
	<div
		class=" w-full h-[35vh] flex flex-row justify-center items-center border-b-4 border-indigo-800"
	>
		<div class="h-[20vh] w-[20vh] rounded-full">
			<Avatar class="w-full h-full" src={profileData.user.profilePictureUrl} initials="" />
		</div>
		<div class="h-[20vh] w-[50vw] p-6">
			<div class="flex col-row">
				<h3 class="h3 mr-4">{profileData.user.username}</h3>
				{#if editMode == true}
					<button on:click={changeEditMode} class=""
						><Icon class="w-7 h-7" icon="material-symbols:save-outline"></Icon></button
					>
					<button on:click={changeEditMode} class="ml-2"
						><Icon class="w-7 h-7" icon="material-symbols:cancel-outline"></Icon></button
					>
				{:else}
					<button on:click={changeEditMode} class="">
						<Icon class="w-7 h-7" icon="material-symbols:edit-outline"></Icon></button
					>
				{/if}
			</div>
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
				<p class="opacity-70 mb-4">{profileData.user.nickname}</p>
				<p>{profileData.user.status}</p>
			{/if}
		</div>
		<div class="h-[20vh] w-[22vw] flex flex-row justify-around items-center">
			<div class="flex flex-col items-center justify-center">
				<h2 class="h2">{profileData.user.posts}</h2>
				<p>Posts</p>
			</div>
			<a href="/followers">
				<div class="flex flex-col items-center justify-center">
					<h2 class="h2">{profileData.user.follower}</h2>
					<p>Follwers</p>
				</div>
			</a>
			<a href="/following">
				<div class="flex flex-col items-center justify-center">
					<h2 class="h2">{profileData.user.following}</h2>
					<p>Following</p>
				</div>
			</a>
			<button on:click={openChangePwdModel} class="ml-2"
				><Icon class="w-7 h-7" icon="material-symbols:cancel-outline"></Icon></button
			>
		</div>
	</div>
	<div class="flex flex-col items-center justify-start mt-3 w-full h-[100vh]">
		{#each postData.records as Post}
			<PostUserProfil bind:postData={Post} />
		{/each}
	</div>
</main>
