<script lang="ts">
	import { page } from '$app/stores';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let followerData:Subscriptions;
// async function handleBlockUserClick() {
//     function zum Blocken des Users
// }
async function handleSubscribeClick() {
    
}

</script>

<nav class="list-nav w-1/3">
	<!-- (optionally you can provide a label here) -->
	<ul class="w-[40vw]">
		{#each followerData.records as follower}
			
		
		<li class="flex flex-row w-full justify-between">
			<a href="/profile?username={follower.user.username}" class="w-5/6">
				<Avatar src="../default-avatar.png" />

				<span class="flex-auto">
					<dt>{follower.user.username}</dt>
					<dd class="opacity-50">@{follower.user.nickname}</dd>
				</span>
			</a>
			<div class="flex flex-row w-1/6">
				<button>							
                    <Icon
                    class="w-10 h-10"
                    icon='mdi:account-check'
                    style="font-size: 32px"
                /></button>
                <!-- Das ist der Blockier Butten der aktuell noch nicht geht -->
				<!-- <button on:click={handleBlockUserClick}><Icon
                    class="w-10 h-10"
                    icon='mdi:account-check'
                    style="font-size: 32px"
                /></button> -->
			</div>
		</li>
		{/each}
		<li class="flex flex-row w-full justify-between">
			<a href="/profile?username=test" class="w-5/6">
				<Avatar src="../default-avatar.png" />

				<span class="flex-auto">
					<dt>test</dt>
					<dd class="opacity-50">test</dd>
				</span>
			</a>
			<div class="flex flex-row w-1/6">
				<button>							
                    <Icon
                    class="w-10 h-10"
                    icon='mdi:account-check'
                    style="font-size: 32px"
                /></button>
                <!-- Das ist der Blockier Butten der aktuell noch nicht geht -->
				<!-- <button on:click={handleBlockUserClick}><Icon
                    class="w-10 h-10"
                    icon='mdi:account-check'
                    style="font-size: 32px"
                /></button> -->
			</div>
		</li>
		
	</ul>
</nav>
