<script>
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';
</script>

<main class="flex flex-col items-center">
	{#each page.data.projects as project, i}
		<Letter {...page.data.letters[i]} isFirst={i === 0}></Letter>
		<Project {...project} />
	{/each}
	{#each page.data.letters.filter((_, i) => i >= page.data.projects.length) as letter, i}
		<Letter {...letter} sticky></Letter>
	{/each}
</main>
