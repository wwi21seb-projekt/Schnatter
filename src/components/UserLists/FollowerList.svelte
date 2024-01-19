<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	export const followerData: string[] = [
		'a',
		'b',
		'lisa',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o'
	];
// async function handleBlockUserClick() {
//     function zum Blocken des Users
// }
async function handleSubscribeClick() {
    
}

</script>

<nav class="list-nav w-1/3">
	<!-- (optionally you can provide a label here) -->
	<ul class="w-[40vw]">
		<li class="flex flex-row w-full justify-between">
			<a href="/profile?username={followerData[2]}" class="w-5/6">
				<Avatar src="../default-avatar.png" />

				<span class="flex-auto">
					<dt>Title</dt>
					<dd>Description</dd>
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
		<!-- ... -->
	</ul>
</nav>
