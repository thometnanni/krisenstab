<script>
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';
	import { onDestroy, onMount } from 'svelte';

	let preHeight = $state();
	let mainHeight = $state();

	onMount(() => browser && window.addEventListener('scroll', onScroll));

	onDestroy(() => browser && window.removeEventListener('scroll', onScroll));

	function onScroll(e) {
		if (window.scrollY > preHeight + mainHeight) {
			window.scrollTo({ top: window.scrollY - mainHeight, behavior: 'instant' });
		}

		if (window.scrollY < preHeight) {
			window.scrollTo({ top: window.scrollY + mainHeight, behavior: 'instant' });
		}
	}
</script>

<main class="flex flex-col items-center" bind:clientHeight={preHeight}>
	{#each page.data.projects as project, i}
		<Letter {...page.data.letters[i % page.data.letters.length]} index={i}></Letter>
		<Project {...project} />
	{/each}
</main>
<main class="flex flex-col items-center" bind:clientHeight={mainHeight}>
	{#each page.data.projects as project, i}
		<Letter {...page.data.letters[i % page.data.letters.length]} index={i}></Letter>
		<Project {...project} />
	{/each}
</main>
<main class="flex flex-col items-center">
	{#each page.data.projects as project, i}
		<Letter
			{...page.data.letters[(i + page.data.projects.length) % page.data.letters.length]}
			index={i}
		></Letter>
		<Project {...project} />
	{/each}
</main>
