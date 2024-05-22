<script lang="ts">
	import { Avatar, getModalStore } from "@skeletonlabs/skeleton";
	import { t } from "../../i18n";
    console.log("modal chat")
    const modalStore = getModalStore();
    let currentMessage = '';

    function closeModal() {
		modalStore.close();
	}
</script>


<div class="card w-[60vw] h-[50vh]">
    <header class="card-header flex justify-center items-center">
        
    </header>
    <div class="w-full grid grid-cols-2 gap-10">
        <div class="h-auto grid grid-rows-[auto_1fr_auto] gap-1">
            <div class="bg-surface-500/30 p-4">(search)</div>
            <div class="bg-surface-500/30 p-4">(list)</div>
            <div class="bg-surface-500/30 p-4">(footer)</div>
        </div>
        <div class="h-auto grid grid-rows-[1fr_auto] gap-1">
            <div class="bg-surface-500/30 p-4 space-y-4 overflow-y-auto">
                <section class="w-full max-h-[400px] p-4 overflow-y-auto space-y-4">
                    <!-- {#each chatMessage as message}
                        {#if data.records.username === eigener Name} -->
                            <div class="grid grid-cols-[auto_1fr] gap-2 justify-end">
                                <div class="card p-4 variant-soft rounded-tl-none space-y-2">
                                    <header class="flex justify-between items-center">
                                        <p class="font-bold">Username</p>
                                        <small class="opacity-50">Zeit</small>
                                    </header>
                                    <p>Hier steht der Inhalt der Nachricht</p>
                                </div>
                            </div>
                        <!-- {:else} -->
                            <div class="grid grid-cols-[1fr_auto] gap-1">
                                <div class="card p-4 rounded-tr-none space-y-2 ">
                                    <header class="flex justify-between items-center">
                                        <p class="font-bold">Gast Username</p>
                                        <small class="opacity-50">Zeit</small>
                                    </header>
                                    <p>Hier steht der andere Text</p>
                                </div>
                            </div>
                        <!-- {/if}
                    {/each} -->
                </section>
            </div>
            <div class="bg-surface-500/30 p-4">
                <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
                    <textarea
                        bind:value={currentMessage}
                        class="bg-transparent border-0 ring-0"
                        name="prompt"
                        id="prompt"
                        placeholder={$t('chat.button.send')}
                        rows="1"
                    />
                    <button class="variant-filled-primary">{$t('chat.button.send')}</button>
                </div>
            </div>
        </div>
    </div>
    <footer class="card-footer flex flex-row justify-end mt-2">
        <button type="button" class="btn variant-filled-secondary mx-1" on:click={closeModal}
            >{$t('modalCreatePost.button.close')}</button
        >
    </footer>
</div>

