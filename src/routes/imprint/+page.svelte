<script lang="ts">
	import { t } from '../../i18n';
	import type { Imprint } from '$lib/types/Imprint';
	import { onMount } from 'svelte';
	import { imprint } from '$lib/utils/Imprint';
	let backendImprint: Imprint = { text: '' };

	onMount(async () => {
		backendImprint = (await imprint()) as Imprint;
	});
</script>

<main class="flex flex-col justify-center items-center mb-[70px] mt-[90px]">
	<div class="card bg-red p-2 w-[80vw] mb-5">
		<h1 class="font-bold text-2xl">{$t('imprint.frontend.header')}</h1>
		<div class="mt-2">
			<p class="font-bold mb-1">{$t('imprint.frontend.address')}</p>
			<div class="ml-2">
				<p>DHBW Mannheim</p>
				<p>Coblitzallee 1-9</p>
				<p>68163 Mannheim</p>
				<p>{$t('imprint.frontend.country')}</p>
			</div>
		</div>
		<div class="mt-2 mb-3">
			<p class="font-bold mb-1">{$t('imprint.frontend.contact')}:</p>
			<div class="ml-2">
				<p>{$t('imprint.frontend.telephone')}: +49 621 4105-1171</p>
				<p>{$t('imprint.frontend.fax')}: +49 621 4105-1249</p>
				<p>{$t('imprint.frontend.mail')}: info@dhbw-mannheim.de</p>
			</div>
		</div>
		<div>
			<p class="mt-3 font-bold">{$t('imprint.frontend.note.header')}:</p>
			<p class="text-justify mr-2">{$t('imprint.frontend.note')}</p>
			<p class="mt-3 font-bold">{$t('imprint.frontend.liabilityContent.header')}:</p>
			<p class="text-justify mr-2">{$t('imprint.frontend.liabilityContent')}</p>
			<p class="mt-3 font-bold">{$t('imprint.frontend.liabilityLinks.header')}:</p>
			<p class="text-justify mr-2">{$t('imprint.frontend.liabilityLinks')}</p>
			<p class="mt-3 font-bold">{$t('imprint.frontend.copyright.header')}:</p>
			<p class="text-justify mr-2">{$t('imprint.frontend.copyright')}</p>
		</div>
	</div>
	<div class="card bg-red p-2 w-[80vw] mb-3">
		<h1 class="font-bold text-2xl">{$t('imprint.backend.header')}</h1>
		{#if !backendImprint}
			<p>{$t('toast.internalError')}</p>
		{:else}
			<p>{backendImprint.text}</p>
		{/if}
	</div>
</main>
