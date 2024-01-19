<script lang="ts">
	import { onMount } from 'svelte';
	import FollowerList from '../../components/UserLists/FollowerList.svelte';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { getSubscriptions } from '$lib/utils/Subscription';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
    let offsetList = 0
    let limit = 10
    let followerdata:Subscriptions  = {
        records: [],
        pagination: {
            offset: 0,
            limit: 0
        }
    }

    onMount(async() => {
        followerdata =  await getSubscriptions(get(token),"follower",offsetList, limit)
        offsetList += limit
        console.log(followerdata)
        
    });
</script>

<main class="flex flex-col items-center mt-16 min-h-[75vh]">
	<h2 class="h2 mb-10">Your Followers</h2>
	<div class="mb-20">
		<FollowerList />
	</div>
</main>
