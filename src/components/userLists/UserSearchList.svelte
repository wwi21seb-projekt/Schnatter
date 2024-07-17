<script lang="ts">
	import type { User } from '$lib/types/User';
	import ProfilePicture from '../ProfilePicture.svelte';
	export let searchData: User[];
</script>

<nav class="list-nav w-full">
	<ul class="w-full">
		{#each searchData as searchedUser}
			<li class="flex flex-row w-full justify-between h-20">
				<!--forwarding to the profile of the person you are looking for-->
				<a href="/profile?username={searchedUser.username}" title="userResult" class="w-full h-20">
					<ProfilePicture
						cssClass="w-10 h-full rounded-full isolation-auto"
						src={searchedUser.picture?.url ?? ''}
						username={searchedUser.username}
					/>
					<span class="flex-auto">
						<dt>{searchedUser.username}</dt>
						<dd class="text-gray-600">@{searchedUser.nickname}</dd>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
