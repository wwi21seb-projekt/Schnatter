<script lang="ts">
	import { t } from '../../i18n';
</script>

<main class="m-10">
	<p class="h3 mb-4">{$t('about.video.header')}</p>
	<iframe
		title={$t('about.video.header')}
		width="720"
		height="405"
		src="/schnatter.mp4"
		frameborder="0"
		allow="autoplay"
		allowfullscreen
	></iframe>
</main>
