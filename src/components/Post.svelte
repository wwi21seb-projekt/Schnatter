<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	function sendComment() {
		console.log('comment send');
	}
</script>

<main>
	<div class="card">
		<header class="card-header w-[60vw]">
			<div class="flex flex-row items-center">
				<Avatar class="h-[5vh] w-[5vh] rounded-full mr-3" src="/default-avatar.png" initials="" />
				<p>Username</p>
			</div>
		</header>
		<section class="p-4">
			<textarea
				class="textarea h-[15vh] resize-none"
				placeholder="Hier ist der Post"
				maxlength="256"
			/>
		</section>
		<footer class="card-footer h-18 items-center pb-1 flex flex-row w-full bg-green-600 justify-start">
			<div class="flex flex-row float-left bg-blue-950">
				<Icon class="w-7 h-7 mr-3" icon="ph:heart-fill"></Icon>
				<Icon class="w-7 h-7" icon="pajamas:smile"></Icon>
			</div>
			<div class="flex resize-none bg-white">
				<input class="input mx-3" type="text" placeholder="Write your comment!" maxlength="256" />
			</div>
			<button class="flex float-right bg-black" on:click={sendComment}>
				<Icon class="w-7 h-7" icon="fluent:send-16-filled"></Icon>
			</button>
		</footer>
	</div>
</main>
