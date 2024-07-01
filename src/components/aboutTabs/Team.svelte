<script lang="ts">
	import TeamMemberCard from './parts/TeamMemberCard.svelte';
	import { t } from '../../i18n';
</script>

<main class="p-10">
	<p class="h3">{$t('about.team.header')}</p>

	<div class="flex md:flex-row flex-col">
		<TeamMemberCard name="Lisa Ress-Park" matrixNumber="3798263" />
		<TeamMemberCard name="Nora Klemp" matrixNumber="7979965" />
		<TeamMemberCard name="Dennis Bollian" matrixNumber="8043245" />
		<TeamMemberCard name="Marcel Bulling" matrixNumber="2953627" />
	</div>
</main>
