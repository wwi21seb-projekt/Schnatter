<script lang="ts">
	import { t } from '../../i18n';
</script>

<main class="p-10">
	<p>{$t('about.projekt.svelte')}</p>
	<br />
	<p>{$t('about.projekt.tests')}</p>
	<br />
	<p>{$t('about.projekt.moreInformations')}</p>
	<br />
	<iframe
		title="Schnatter"
		width="720"
		height="405"
		src="/schnatter.mp4"
		frameborder="0"
		allow="autoplay"
		allowfullscreen
	></iframe>
</main>
