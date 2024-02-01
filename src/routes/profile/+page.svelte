<script lang="ts">
	import {
		Avatar,
		Toast,
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
	import { globalUsername, token } from '$lib/Store';
	import type { UserFetchResponse } from '$lib/types/User';
	import Icon from '@iconify/svelte';
	import ModalChangePwd from '../../components/modals/ModalChangePwd.svelte';
	import { t } from '../../i18n';

	import { createToast } from '$lib/Toasts';
	import { manageSession } from '$lib/utils/Session';

	let editMode: boolean = false;
	let nickname: string = '';
	let userStatus: string = '';
	let username: string = '';
	let usernameParams: string | undefined = '';
	let subscribed: boolean = false;

	const toastStore = getToastStore();

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: ModalChangePwd };

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		response: (response: number) => {
			if (response == 204) {
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
		manageSession();
		const url = window.location.search;
		usernameParams = url.split('=')[1];

		if (usernameParams == undefined) {
			username = get(globalUsername);
		} else if (usernameParams == get(globalUsername)) {
			username = get(globalUsername);
			usernameParams = undefined;
		} else {
			username = usernameParams;
		}
		profileData = await getProfileDetails(get(token), username);
		nickname = profileData.user.nickname;
		userStatus = profileData.user.status;

		if (profileData.statusCode == 500) {
			toastStore.trigger(createToast('User details could not be loaded', 'error'));
		}
		nickname = profileData.user.nickname;
		userStatus = profileData.user.status;
		if (profileData.user.subscriptionId != '' && profileData.user.subscriptionId != null) {
			subscribed = true;
		}
		postData = await getProfilePosts(get(token), username);
	});

	function changeEditMode() {
		editMode = !editMode;
	}
	async function handleDetailSubmit() {
		const status = await updateUserDetails(get(token), userStatus, nickname);
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
		postData = await loadPosts(get(token), postData, username);
	}
	async function subscribe() {
		const followStatus = await followUser(get(token), username);
		if (followStatus.status == 201) {
			subscribed = true;
			toastStore.trigger(createToast('User was followed', 'success'));
		} else {
			toastStore.trigger(createToast('User was not followed', 'error'));
		}
	}
	async function unsubscribe() {
		const unfollowStatus = await unfollowUser(get(token), profileData.user.subscriptionId);
		if (unfollowStatus.status == 204) {
			subscribed = false;
			toastStore.trigger(createToast('User was unfollowed', 'success'));
		} else {
			toastStore.trigger(createToast('User was not unfollowed', 'error'));
		}
	}
</script>

<Toast />
{#if profileData.statusCode == 200}
	<main class=" flex flex-col items-center justify-start">
		<div
			class=" w-full min-h-[35vh] flex flex-row justify-center items-center border-b-4 border-indigo-800"
		>
			<div class="h-[20vh] w-[20vh] rounded-full">
				<Avatar class="w-full h-full" src={profileData.user.profilePictureUrl} initials="" />
			</div>
			<div class="min-h-[20vh] w-[50vw] p-6">
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
						placeholder={$t('profile.placeholder.newNickname')}
						maxlength="25"
					/>
					<textarea
						bind:value={userStatus}
						rows="3"
						cols="60"
						maxlength="128"
						class="textarea"
						placeholder={$t('profile.placeholder.newStatus')}
					/>
				{:else}
					<p class="opacity-70 mb-4">{nickname}</p>
					{#if userStatus == '' || userStatus == null}
						<p class="opacity-70 mb-4">{$t('profile.noStatus')}</p>
					{:else}
						<p class="whitespace-pre-wrap text-wrap break-words max-w-[95%]">
							{userStatus}
						</p>
					{/if}
				{/if}
			</div>
			<div class="flex flex-col justify-center items-center">
				<div class="h-[20vh] w-[22vw] flex flex-row justify-around items-center">
					<div class="flex flex-col items-center justify-center">
						<h2 class="h2" title="postcount">{profileData.user.posts}</h2>
						<p>{$t('profile.posts')}</p>
					</div>
					<a href="/profile/follower?username={profileData.user.username}">
						<div class="flex flex-col items-center justify-center">
							<h2 class="h2" title="followerCount">{profileData.user.follower}</h2>
							<p>{$t('profile.followers')}</p>
						</div>
					</a>
					<a href="/profile/following?username={profileData.user.username}">
						<div class="flex flex-col items-center justify-center">
							<h2 class="h2" title="followingCount">{profileData.user.following}</h2>
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
		<div>
			{#if postData.records == null || postData.records.length == 0}
				<p class="text-2xl">{$t('profile.noPosts')}</p>
			{:else}
				<div class="flex flex-col items-center justify-start mt-3 mb-3 w-full">
					{#each postData.records as Post}
						<PostUserProfil bind:postData={Post} currentUsername={usernameParams} />
					{/each}
					{#if postData.records.length < postData.pagination.records}
						<button on:click={loadMorePosts} class="btn variant-filled"
							>{$t('profile.loadMore')}</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</main>
{:else}
	<p class="text-2xl">{$t('profile.noUser')}</p>
{/if}
