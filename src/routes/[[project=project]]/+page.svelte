<script>
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';

	const project = $derived(page.data.projects.find(({ name }) => name === page.params.project));
	const projects = $derived(page.data.projects.filter(({ name }) => name !== page.params.project));
	const letters = $derived(page.data.letters.filter((_, i) => i >= projects.length));
</script>

<main class="flex flex-col items-center">
	{#if project}
		<Project {...project} />
	{/if}
	{#each projects as project, i}
		<Letter {...page.data.letters[i]} index={i}></Letter>
		<Project {...project} />
	{/each}
	{#each letters as letter, i}
		<Letter {...letter} sticky index={i + projects.length}></Letter>
	{/each}
</main>
