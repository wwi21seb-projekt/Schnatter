<script lang="ts">
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import { t } from "../../i18n";


const modalStore = getModalStore();

const modalChat: ModalSettings = {
    type: 'component',
    component:'modalChat'
}

function handleUserChatSearch(){
    //hier kommt die suche dem dem user hin
}
function closeModal() {
		modalStore.close();
        modalStore.trigger(modalChat);
	}
</script>

<div class="card w-[40vw] h-[40vh] p-2">
    <header class="h-[7%] flex flex-row justify-between">
        <div class=" p-4 h-1/6">
            <input
                class="input w-full"
                title={$t('chat.tooltip.search')}
                type="search"
                placeholder={$t('chat.placeholder.search')}
                on:input={handleUserChatSearch}
            />
        </div>
        <div>
            <button type="button" class="btn variant-filled-secondary mx-1 justify-end" on:click={closeModal}>
                {$t('chat.newChat.cancel')}
            </button>
        </div>
    </header>

</div>