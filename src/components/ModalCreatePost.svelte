<script lang="ts">
	import { serverURL, token } from '$lib/Store';
	import Icon from '@iconify/svelte';
	import { FileDropzone, getModalStore } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { t } from '../i18n';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	let textClick: boolean = true;
	let imageClick: boolean = false;

	let text: string = '';

	function closeModal() {
		modalStore.close();
	}

	function clickText() {
		if (!textClick) {
			textClick = true;
		}
		imageClick = false;
	}

	function clickImage() {
		if (!imageClick) {
			imageClick = true;
		}
		textClick = false;
	}

	async function sendPost() {
		const url = get(serverURL) + '/posts';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + get(token)
			},
			body: JSON.stringify({
				content: text
			})
		});
		if (response.status == 201) {
			modalStore.close();
		} else {
			toastStore.trigger(createToast('We were running into a problem! Sorry', 'error'));
		}
	}
</script>

{#if $modalStore[0]}
	<div class="card w-[40vw]">
		<header class="card-header flex justify-center items-center">
			<div class="w-min flex justify-center outline-none border-none">
				<button class="p-2" on:click={clickText}>{$t('modalCreatePost.header.Text')}</button>
				<button class="p-2" on:click={clickImage}>{$t('modalCreatePost.header.Image')}</button>
			</div>
		</header>
		{#if textClick == true}
			<section>
				<label class="label p-3">
					<textarea
						class="textarea resize-none"
						rows="4"
						bind:value={text}
						placeholder={text === '' ? $t('modalCreatePost.textInput.Placeholder') : ''}
						maxlength="256"
					/>
				</label>
			</section>
		{/if}
		{#if imageClick == true}
			<section class="p-3 flex flex-col">
				<FileDropzone name="files" accept="image/*">
					<svelte:fragment slot="message">
						<div class="flex flex-col items-center">
							<Icon class="w-12 h-12" icon="line-md:upload-loop"></Icon>
							<p>{$t('modalCreatePost.fileInput.Message')}</p>
						</div>
					</svelte:fragment>
				</FileDropzone>
				<label class="label p-3">
					<textarea
						class="textarea h-auto resize-none"
						placeholder={$t('modalCreatePost.textInputImage.Placeholder')}
						maxlength="256"
					/>
				</label>
			</section>
		{/if}
		<footer class="card-footer flex flex-row justify-end">
			<button type="button" class="btn variant-filled-secondary mx-1" on:click={closeModal}
				>{$t('modalCreatePost.button.close')}</button
			>
			<button type="button" class="btn variant-filled-primary mx-1" on:click={sendPost}
				>{$t('modalCreatePost.button.post')}</button
			>
		</footer>
	</div>
{/if}
