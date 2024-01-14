<script lang="ts">
    import Post from './Post.svelte'; 
    import { onMount } from 'svelte';
    import { serverURL } from '$lib/Store';
    import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { initializeStores } from '@skeletonlabs/skeleton';
    import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
    import { token } from '$lib/Store';
    import { get } from 'svelte/store';

	const loginToken = get(token);

    initializeStores();
	const toastStore = getToastStore();
    let statusCode: number = 0;
    let serverUrl: string;
    let response: Response;
    let posts: Array<Post> = [];
    let value: number = 0;
    let params = new URLSearchParams([
        ["offset", "0"],
        ["limit", "10"],
        ["feedType", "global"],
    ]);

    async function onChange(){
       serverURL.subscribe((prev_val) => (serverUrl = prev_val));
        if ( value === 1){ //loginToken !== '' &&
                params.set("feedType", "personal");
        } else{
            params.set("feedType", "global");
        }
        const url: string = serverUrl + '/feed?' + params;
        console.log(url)
        try{
            response = await fetch(url,{
                mode: 'cors',
                method: 'GET'
            });
            statusCode = response.status;
        } catch(error){
             toastStore.clear();
             console.log(error);
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
        
        if(statusCode == 200){
            const result = await response.json();
            posts = result.records;
            console.log(posts);
        } else {
            posts = [];
            toastStore.clear();
			toastStore.trigger(createToast('Something went wrong!', 'error'));
        } 
    }
        
    onMount(async () => {
        onChange();
    });
</script>


<main class="flex flex-wrap justify-around">
    <div class="pb-2">
        <RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
            <RadioItem bind:group={value} name="justify" value={0} on:change={onChange}>For You</RadioItem>
            <RadioItem bind:group={value} name="justify" value={1} on:change={onChange}>Following</RadioItem>
        </RadioGroup>
    </div>
    {#each posts as postData (postData.postId)}
        <Post {postData} />
    {/each} 
    <Toast />
</main>