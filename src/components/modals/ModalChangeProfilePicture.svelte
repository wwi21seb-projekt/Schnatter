<!-- Change profile Picture on profile view and registration -->
<script lang="ts">
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import { afterUpdate, onDestroy } from 'svelte';
	import { t } from '../../i18n';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { modalHiddenCss, newProfilePicture } from '$lib/Store';

	const modalStore = getModalStore();

	let cropper: Cropper | undefined;
	let imageDataUrl: string = '';
	let croppedImageDataUrl: string = '';
	let imageElement: HTMLImageElement | null = null;

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files ? input.files[0] : null;
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imageDataUrl = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
	// get croped profile picture
	afterUpdate(() => {
		if (imageElement && imageDataUrl) {
			if (cropper) {
				cropper.destroy();
			}
			cropper = new Cropper(imageElement, {
				aspectRatio: 1,
				viewMode: 1,
				autoCropArea: 1,
				scalable: false,
				zoomable: false,
				cropBoxMovable: false,
				cropBoxResizable: false,
				ready() {
					const containerData = cropper?.getContainerData();
					const cropBoxData = cropper?.getCropBoxData();
					const aspectRatio = (cropBoxData?.width ?? 0) / (cropBoxData?.height ?? 1);

					cropper?.setCropBoxData({
						width: aspectRatio * 600,
						height: 600,
						left: ((containerData?.width ?? 0) - aspectRatio * 600) / 2,
						top: ((containerData?.height ?? 0) - 600) / 2
					});
				}
			});
		}
	});
	//  crop profile picture
	function handleCrop() {
		if (cropper) {
			const canvas = cropper.getCroppedCanvas({
				width: 192,
				height: 192,
				imageSmoothingEnabled: true,
				imageSmoothingQuality: 'high'
			});
			croppedImageDataUrl = canvas.toDataURL();
		}
	}

	function handleSubmit() {
		newProfilePicture.set(croppedImageDataUrl);
		modalStore.close();
	}
	onDestroy(() => {
		modalHiddenCss.set('');
	});
</script>

<main class="card md:w-[60vw] w-[98vw] min-h-[80vh] max-h-[85vh] overflow-auto h-auto">
	<div class="mx-auto">
		<div class="flex justify-center my-4">
			{#if imageDataUrl}
				<label
					for="fileInput"
					class="variant-filled-primary text-white px-4 py-2 rounded cursor-pointer"
				>
					{$t('modal.profilePicture.uploadother')}
				</label>
			{:else}
				<label
					for="fileInput"
					class="variant-filled-primary text-white px-4 py-2 rounded cursor-pointer"
				>
					{$t('modal.profilePicture.upload')}
				</label>
			{/if}
			<input
				id="fileInput"
				type="file"
				accept="image/*"
				on:change={handleFileChange}
				class="hidden"
			/>
		</div>

		{#if imageDataUrl}
			<p class="m-3">
				{$t('modal.profilePicture.hint')}
			</p>
			<div class="flex justify-center my-4">
				<div class="max-h-[40vh]">
					<img
						bind:this={imageElement}
						id="image"
						src={imageDataUrl}
						alt={$t('modal.profilePicture.cut')}
					/>
				</div>
			</div>
			<div class="flex flex-row justify-center items-center">
				<div class="flex justify-center my-4">
					<button class="variant-filled-secondary px-4 py-2 mr-2 rounded" on:click={handleCrop}
						>{$t('modal.profilePicture.cut')}</button
					>
				</div>
				{#if croppedImageDataUrl}
					<button class="variant-filled-primary px-4 py-2 rounded" on:click={handleSubmit}
						>{$t('modal.profilePicture.select')}</button
					>
				{/if}
			</div>
		{/if}

		{#if croppedImageDataUrl}
			<div class="flex justify-center my-4">
				<div class="cropped-image">
					<img src={croppedImageDataUrl} alt="Zugeschnittenes Bild" />
				</div>
			</div>
		{/if}
	</div>
</main>
