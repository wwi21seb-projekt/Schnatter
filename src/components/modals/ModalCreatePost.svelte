<script lang="ts">
	import Icon from '@iconify/svelte';
	import { FileDropzone, getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { t } from '../../i18n';
	import { onMount } from 'svelte';
	import { sendPost } from '$lib/utils/PostFunctions';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	let textClick: boolean = true;
	let imageClick: boolean = false;
	let focusfield: HTMLTextAreaElement;

	let text: string = '';
	let repostId = '';

	let files: FileList;
	let pictureSet: boolean = false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let selectedImage: any;

	onMount(() => {
		focusfield.focus();
		if ($modalStore[0].meta) {
			repostId = $modalStore[0].meta.repostId;
		}
	});

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

	async function handleSubmitPost() {
		let response = await sendPost(text, repostId, selectedImage);
		if (response == 201) {
			modalStore.close();
			window.location.reload();
		} else {
			toastStore.trigger(createToast('We were running into a problem! Sorry', 'error'));
		}
	}

	function onChangePicture(imageUploaded: Blob) {
		pictureSet = true;
		let reader = new FileReader();
		reader.readAsDataURL(imageUploaded);
		reader.onload = (e) => {
			selectedImage = e.target?.result;
		};
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
						bind:this={focusfield}
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
				<FileDropzone
					name="files"
					accept="image/*"
					bind:files
					on:change={() => onChangePicture(files[0])}
				>
					<svelte:fragment slot="message">
						{#if !pictureSet}
							<div class="flex flex-col items-center">
								<Icon class="w-12 h-12" icon="line-md:upload-loop"></Icon>
								<p>{$t('modalCreatePost.fileInput.Message')}</p>
							</div>
						{:else}
							<img
								class="max-h-[400px]"
								src={selectedImage}
								alt={$t('modalCreatePost.pictures.altText')}
							/>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="meta">
						<p>{$t('modalCreatePost.pictures.fileTypes')}</p>
					</svelte:fragment>
				</FileDropzone>
				<label class="label p-3">
					<textarea
						class="textarea h-auto resize-none"
						placeholder={$t('modalCreatePost.textInputImage.Placeholder')}
						bind:value={text}
						rows="2"
						maxlength="256"
					/>
				</label>
			</section>
		{/if}
		<footer class="card-footer flex flex-row justify-end">
			<button type="button" class="btn variant-filled-secondary mx-1" on:click={closeModal}
				>{$t('modalCreatePost.button.close')}</button
			>
			<button type="button" class="btn variant-filled-primary mx-1" on:click={handleSubmitPost}
				>{$t('modalCreatePost.button.post')}</button
			>
		</footer>
	</div>
{/if}
