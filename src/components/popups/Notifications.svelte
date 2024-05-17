<script lang="ts">
	import { Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import { locale, t } from '../../i18n';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { Notifications } from '$lib/types/notifications';
	let language = '';

	onMount(() => {
		language = get(locale);
	});

    const notifications:Notifications = {
        records: [
            {
				notificationId: "",
				timestamp: "",
			    notificationType: "follow",// follow, repost,
                user:{
                    username: "",            
                    nickname: "",             
                    profilePictureUrl : ""
                }
            }
        ]};

    //function create
    

	
</script>

<main class="flex flex-col justify-center p-2">
    <ul class="list">
        <li >
            <Avatar class="w-10 h-10" initials="AB"/>
            <span class="flex-auto">Ticki daka ist dir gefolgt</span>
        </li>
        
            {#each notifications.records as notification}
                <li>
                    <Avatar class="w-10 h-10" initials="AB"/>
                    <span class="flex-auto">{notification}</span>
                </li>
            {/each}
            <!-- {#if notifications.records.length === 0 ? true : false}
                <li>
                    <span class="flex-auto">Keine Benachrichtigungen</span>
                </li>
            {/if} -->
        <hr class="!border-t-2" />
        
    </ul>
	
</main>