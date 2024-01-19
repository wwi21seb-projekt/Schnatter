<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
	export const followerData: string[] = [
		'a',
		'b',
		'lisa',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o'
	];


</script>

<nav class="list-nav w-1/3">
	<!-- (optionally you can provide a label here) -->
	<ul class="w-[40vw]">
		<li class="flex flex-row w-full justify-between">
			<a href="/profile?username={followerData[2]}" class="w-5/6">
				<Avatar src="../default-avatar.png" />

				<span class="flex-auto">
					<dt>Title</dt>
					<dd>Description</dd>
				</span>
			</a>
			<div class="flex flex-row w-1/6">

			</div>
		</li>
		<!-- ... -->
	</ul>
</nav>