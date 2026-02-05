<script>
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';
</script>

<main class="flex flex-col items-center">
	{#each page.data.projects as project, i}
		<Letter {...page.data.letters[i % page.data.letters.length]} index={i}></Letter>
		<Project {...project} />
	{/each}
</main>
