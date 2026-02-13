<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	onMount(() => {
		if (page.status === 404) {
			goto(resolve('/'), { replaceState: true });
		}
	});
</script>

<svelte:head>
	{#if page.status === 404}
		<meta http-equiv="refresh" content="0;url=/" />
	{/if}
</svelte:head>

{#if page.status !== 404}
	<section class="p-10">
		<h1>{page.status}</h1>
		<p>{page.error?.message ?? 'An unexpected error occurred.'}</p>
	</section>
{/if}
