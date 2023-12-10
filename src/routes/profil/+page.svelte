<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;

	const user = data.user;
</script>

<main class=" flex flex-col items-center justify-start">
	<!--header-->
	<div
		class=" w-full h-[30vh] flex flex-row justify-center items-center border-b-4 border-indigo-800"
	>
		<div class="h-[20vh] w-[20vh] rounded-full">
			<Avatar class="w-full h-full" src={user.avatar} initials="" />
		</div>
		<div class="h-[20vh] w-[50vw] p-6">
			<h3 class="h3">{user.userName}</h3>
			<p class="opacity-70 mb-4">{user.nickName}</p>
			<p>{user.bio}</p>
		</div>
		<div class="h-[20vh] w-[20vw] flex flex-row justify-around items-center">
			<div class="flex flex-col items-center justify-center">
				<h2 class="h2">{user.posts}</h2>
				<p>Posts</p>
			</div>
			<div class="flex flex-col items-center justify-center">
				<h2 class="h2">{user.follower}</h2>
				<p>Follwer</p>
			</div>
			<div class="flex flex-col items-center justify-center">
				<h2 class="h2">{user.followed}</h2>
				<p>Followed</p>
			</div>
		</div>
	</div>
	<!--Posts-->
	<div class="e w-full h-[100vh]"></div>
</main>
