<script lang="ts">
	import {
		Avatar,
		Toast,
		Modal,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { UserPostFetchResponse } from '$lib/types/Post';
	import PostUserProfil from '../../components/PostUserProfil.svelte';
	import { onMount } from 'svelte';
	import {
		followUser,
		getProfileDetails,
		getProfilePosts,
		loadPosts,
		unfollowUser,
		updateUserDetails
	} from './requests';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
	import type { UserFetchResponse } from '$lib/types/User';
	import Icon from '@iconify/svelte';
	import ModalChangePwd from '../../components/modals/ModalChangePwd.svelte';
	import { t } from '../../i18n';

	import { createToast } from '$lib/Toasts';

	let editMode: boolean = false;
	let nickname: string = '';
	let userStatus: string = '';
	let maxPostCounter: number = 0;
	let username: string = '';
	let usernameParams: string = '';
	let subscribed: boolean = false;

	const toastStore = getToastStore();

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: ModalChangePwd };

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		response: (response: number) => {
			if (response == 200) {
				toastStore.trigger(createToast('Pwd was changed', 'success'));
			} else {
				toastStore.trigger(createToast('Pwd was not changed', 'error'));
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
			posts: 0,
			subscriptionId: ''
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

	onMount(async () => {
		const url = window.location.search;
		usernameParams = url.split('=')[1];

		if (usernameParams == undefined) {
			username = 'mabu2807';
		} else {
			username = usernameParams;
		}
		profileData = await getProfileDetails(get(token), username);
		if (profileData.statusCode == 500) {
			toastStore.trigger(createToast('User details could not be loaded', 'error'));
		}
		nickname = profileData.user.nickname;
		userStatus = profileData.user.status;
		if (profileData.user.subscriptionId != '') {
			subscribed = true;
		}

		postData = await getProfilePosts(get(token), username);
		maxPostCounter = postData.pagination.limit;
	});

	function changeEditMode() {
		editMode = !editMode;
	}
	async function handleDetailSubmit() {
		const status = await updateUserDetails(get(token), nickname, userStatus);
		if (status == 200) {
			editMode = false;
			toastStore.trigger(createToast('User details were changed', 'success'));
		} else {
			toastStore.trigger(createToast('User details were not changed', 'error'));
		}
	}

	function openChangePwdModal() {
		modalStore.trigger(modal);
	}
	async function loadMorePosts() {
		postData = await loadPosts(get(token), postData, 'mabu2807');
		maxPostCounter = Number(maxPostCounter) + Number(postData.pagination.limit);
	}
	async function subscribe() {
		const followStatus = await followUser(get(token), profileData.user.subscriptionId);
		if (followStatus == 200) {
			subscribed = true;
			toastStore.trigger(createToast('User was followed', 'success'));
		} else {
			toastStore.trigger(createToast('User was not followed', 'error'));
		}
	}
	async function unsubscribe() {
		const unfollowStatus = await unfollowUser(get(token), profileData.user.subscriptionId);
		if (unfollowStatus == 200) {
			subscribed = false;
			toastStore.trigger(createToast('User was unfollowed', 'success'));
		} else {
			toastStore.trigger(createToast('User was not unfollowed', 'error'));
		}
	}
</script>

<Toast />
<Modal />
{#if profileData.statusCode == 200}
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
					{#if usernameParams == undefined}
						{#if editMode == true}
							<button on:click={handleDetailSubmit} class=""
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
						bind:value={userStatus}
						maxlength="128"
						class="textarea"
						placeholder="new Status"
					/>
				{:else}
					<p class="opacity-70 mb-4">{nickname}</p>
					<p>{userStatus}</p>
				{/if}
			</div>
			<div class="flex flex-col justify-center items-center">
				<div class="h-[20vh] w-[22vw] flex flex-row justify-around items-center">
					<div class="flex flex-col items-center justify-center">
						<h2 class="h2">{profileData.user.posts}</h2>
						<p>{$t('profile.posts')}</p>
					</div>
					<a href="/followers">
						<div class="flex flex-col items-center justify-center">
							<h2 class="h2">{profileData.user.follower}</h2>
							<p>{$t('profile.followers')}</p>
						</div>
					</a>
					<a href="/following">
						<div class="flex flex-col items-center justify-center">
							<h2 class="h2">{profileData.user.following}</h2>
							<p>{$t('profile.following')}</p>
						</div>
					</a>
					{#if usernameParams == undefined}
						<button on:click={openChangePwdModal} class="ml-2"
							><Icon class="w-10 h-10" icon="mdi:password-reset"></Icon></button
						>
					{/if}
				</div>
				{#if usernameParams != undefined}
					{#if subscribed}
						<button on:click={unsubscribe} class="btn bg-red-500">{$t('profile.unfollow')}</button>
					{:else}
						<button on:click={subscribe} class="btn variant-filled-primary"
							>{$t('profile.follow')}</button
						>
					{/if}
				{/if}
			</div>
		</div>
		<div class="flex flex-col items-center justify-start mt-3 mb-3 w-full">
			{#if postData.records.length == 0}
				<p class="text-2xl">{$t('profile.noPosts')}</p>
			{:else}
				{#each postData.records as Post}
					<PostUserProfil bind:postData={Post} />
				{/each}
				{#if maxPostCounter == postData.records.length}
					<button on:click={loadMorePosts} class="btn variant-filled"
						>{$t('profile.loadMore')}</button
					>
				{/if}
			{/if}
		</div>
	</main>
{:else}
	<p class="text-2xl">{$t('profile.noUser')}</p>
{/if}
