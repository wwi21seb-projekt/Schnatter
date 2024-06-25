<script lang="ts">
	import { t } from '../../i18n';
</script>

<main class="p-10">
	<p class="font-bold text-red-600">{$t('about.projekt.hint')}</p>
	<br />
	<p class="font-bold">{$t('about.projekt.projDescTitle')}</p>
	<p>{$t('about.projekt.desc')}<br />{$t('about.projekt.topic')}</p>
	<br />
	<p>{$t('about.projekt.backends')}</p>
	<br />
	<p>
		{$t('about.projekt.contect')}
		<a class="text-tertiary-500" href="/imprint">{$t('about.projekt.imprint')}</a>.
	</p>
</main>
