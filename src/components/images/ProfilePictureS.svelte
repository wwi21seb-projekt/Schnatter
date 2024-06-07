<script lang="ts">
	import { getInitalsFromUsername } from "$lib/utils/Pictures";
	import { Avatar } from "@skeletonlabs/skeleton";

    export let src: string;
    export let username:string;

</script>

<div class="w-3 h-3">
    <Avatar src={src} initials={getInitalsFromUsername(username)} />
</div>
