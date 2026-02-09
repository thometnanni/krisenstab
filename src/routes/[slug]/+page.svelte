<script>
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';

	let { data } = $props();
</script>

<main class="flex flex-col items-center gap-20">
	<Project {...data.project} />

	{#if data.letter}
		<Letter {...data.letter} index={0} />
	{/if}

	{#each data.otherProjects as project (project.slug)}
		<Project {...project} href={`/${project.slug}`} />
	{/each}

	{#each data.otherLetters as letter, i (letter.slug)}
		<Letter {...letter} index={i + 1} />
	{/each}
</main>
