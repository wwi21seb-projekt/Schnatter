<script lang="ts">
	import type { User } from '$lib/types/User';
	import { getInitalsFromUsername } from '$lib/utils/Pictures';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let searchData: User[];
</script>

<nav class="list-nav w-full">
	<ul class="w-full">
		{#each searchData as searchedUser}
			<li class="flex flex-row w-full justify-between">
				<a href="/profile?username={searchedUser.username}" title="userResult" class="w-full">
					<Avatar
						src={searchedUser.picutre?.pictureURL}
						initials={getInitalsFromUsername(searchedUser.username)}
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
