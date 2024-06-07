<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import { afterUpdate } from 'svelte';

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
</script>

<div class="container mx-auto">
	<div class="flex justify-center my-4">
		<label for="fileInput" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
			Profilbild hochladen
		</label>
		<input
			id="fileInput"
			type="file"
			accept="image/*"
			on:change={handleFileChange}
			class="hidden"
		/>
	</div>

	{#if imageDataUrl}
		<div class="flex justify-center my-4">
			<div class="crop-container max-w-full">
				<img bind:this={imageElement} id="image" src={imageDataUrl} alt="Bild zum Zuschneiden" />
			</div>
		</div>
		<div class="flex justify-center my-4">
			<button class="bg-green-500 text-white px-4 py-2 rounded" on:click={handleCrop}
				>Zuschneiden</button
			>
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

<style>
	.cropped-image {
		width: 192px;
		height: 192px;
		border-radius: 50%;
		overflow: hidden;
	}
	.crop-container img {
		height: 600px;
	}
</style>
