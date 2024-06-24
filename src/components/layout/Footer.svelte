<!-- App Footer -->
<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<img
			class="w-10 h-10"
			src="/Schnatter_Logo.webp"
			alt="Schnatter Logo Footer"
			style="font-size: 32px"
		/>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<a href="/imprint">{$t('footer.imprint')}</a>
	</svelte:fragment>
</AppBar>
