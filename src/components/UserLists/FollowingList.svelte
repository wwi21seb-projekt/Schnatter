<script lang="ts">
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let followingData: Subscriptions;
</script>

<nav class="list-nav w-1/3">
	<!-- (optionally you can provide a label here) -->
	<ul class="w-[40vw]">
		{#each followingData.records as follower}
			<li class="flex flex-row w-full justify-between">
				<a href="/profile?username={follower.user.username}" class="w-5/6">
					<Avatar src="../default-avatar.png" />

					<span class="flex-auto">
						<dt>{follower.user.username}</dt>
						<dd class="opacity-50">@{follower.user.nickname}</dd>
					</span>
				</a>
				<div class="flex flex-row w-1/6"></div>
			</li>
		{/each}
		<!-- ... -->
	</ul>
</nav>
