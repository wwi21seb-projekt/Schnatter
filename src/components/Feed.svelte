<script lang="ts">
    import type Post from './Post.svelte'; 
    import { onMount } from 'svelte';
  
    let posts: Post[] = [];
    let username = 'exampleUser'; 
    let offset = 0; 
    let limit = 10; 

    onMount(async () => {
        posts = await fetch('/users/${username}/feed').then(response => response.json());
        console.log(posts);
    });
</script>


<main class="flex flex-wrap justify-around">
    <!-- {#each posts.records as post (post.postId)}
        <Post {post} />
    {/each}  -->
</main>