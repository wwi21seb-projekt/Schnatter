<script lang="ts">
	import { Modal, getModalStore } from "@skeletonlabs/skeleton";

    const modalStore = getModalStore();

    function closeModal(){
        modalStore.close();
    };
</script>

{#if $modalStore[0]}
<div>
    <header>Write Post</header>
    <div class="flex flex-row">
    <button type="button" class="btn variant-filled-secondary" on:click={closeModal}>Close</button>
    <button type="button" class="btn variant-filled-primary">Post</button>
</div>
</div>
{/if}