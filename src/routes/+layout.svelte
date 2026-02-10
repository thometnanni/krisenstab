<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
			window.scrollTo(0, 0);
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
