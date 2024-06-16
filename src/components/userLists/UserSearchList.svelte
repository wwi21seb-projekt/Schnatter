<script lang="ts">
	import type { User } from '$lib/types/User';
	import ProfilePicture from '../ProfilePicture.svelte';
	export let searchData: User[];
</script>

<nav class="list-nav w-full">
	<ul class="w-full">
		{#each searchData as searchedUser}
			<li class="flex flex-row w-full justify-between">
				<a href="/profile?username={searchedUser.username}" title="userResult" class="w-full">
					<ProfilePicture
						cssClass="w-10 h-10 rounded-full"
						src={searchedUser.picture?.url ?? ''}
						username={searchedUser.username}
					/>
					<span class="flex-auto">
						<dt>{searchedUser.username}</dt>
						<dd class="opacity-50">@{searchedUser.nickname}</dd>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
