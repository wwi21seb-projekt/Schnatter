<script lang="ts">
    import Login from '../../lib/components/Login.svelte';
</script>

<main class="">
    <div class="grid grid-cols-6 grid-flow-col gap-4 grid-end-auto">
        <div class=" col-span-1"></div>
        <div class="card col-span-4"> </div>
        <div class="grid grid-rows-6 grid-flow-col gap-4">
            <div class="row-start-auto"><Login/></div>
            <div class=" row-span-2"></div>
            <div class=" row-span-2"></div>
        </div>
    </div>
    
</main>