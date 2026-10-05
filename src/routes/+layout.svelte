<script>
	import contact from '../lib/assets/contact.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { onMount } from 'svelte';
	import '../lib/dither-dither.js';
	let { children } = $props();

	function resize() {
		document.querySelector('#background').setAttribute('width', innerWidth);
		document.querySelector('#background').setAttribute('height', innerHeight);
	}

	onMount(() => {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
			window.scrollTo(0, 0);
		}

		resize();

		addEventListener('resize', resize);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="sticky top-0 grid grid-cols-1 grid-rows-1">
	<dither-dither
		id="background"
		src-canvas="#sketch"
		object-fit="cover"
		dark="#0556B1"
		light="#FFC8F0"
	></dither-dither>

	<section class="col-span-1 col-start-1 row-start-1 row-end-1 flex justify-between p-[30px]">
		<h1 class="text-2xl">
			<a
				class="text-dark no-underline! hover:text-light"
				id="email"
				href="mailto:{atob(contact.mail)}">{atob(contact.mail)}</a
			>
		</h1>

		<nav class="text-2xl">
			<span class="text-dark hover:text-light" id="projects">projects</span>
		</nav>
	</section>
</div>
{@render children()}

<style>
	#background {
		@apply col-span-1 col-start-1 row-start-1 row-end-1;
	}
</style>
