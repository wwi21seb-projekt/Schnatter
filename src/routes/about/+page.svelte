<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import Project from '../../components/aboutTabs/Project.svelte';
	import Video from '../../components/aboutTabs/Video.svelte';
	import Team from '../../components/aboutTabs/Team.svelte';
	let tabSet: number = 0;
	import Architecture from '../../components/aboutTabs/Architecture.svelte';
	import { t } from '../../i18n';
</script>

<main class="felx flex-row w-screen mx-10 my-[75px]">
	<h1 class="h1">{$t('about.header')}</h1>
	<div class="mt-3 w-11/12">
		<TabGroup>
			<Tab bind:group={tabSet} name="tab3" value={0}>Projekt</Tab>
			<Tab bind:group={tabSet} name="tab1" value={1}>Team</Tab>
			<Tab bind:group={tabSet} name="tab2" value={2}>Video</Tab>
			<Tab bind:group={tabSet} name="tab3" value={3}>Architektur</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<Project />
				{:else if tabSet === 1}
					<Team />
				{:else if tabSet === 2}
					<Video />
				{:else if tabSet === 3}
					<Architecture />
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</main>
