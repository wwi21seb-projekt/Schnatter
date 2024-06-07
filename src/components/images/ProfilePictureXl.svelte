<script lang="ts">
	import { getInitalsFromUsername } from "$lib/utils/Pictures";
	import { Avatar } from "@skeletonlabs/skeleton";

    export let src: string;
    export let username:string;

</script>

<div class="w-12 h-12">
    <Avatar src={src} initials={getInitalsFromUsername(username)} />
</div>