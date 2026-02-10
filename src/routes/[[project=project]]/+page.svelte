<script>
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';

	const project = $derived(page.data.projects.find(({ name }) => name === page.params.project));
	const projects = $derived(page.data.projects.filter(({ name }) => name !== page.params.project));
	const letters = $derived(page.data.letters.filter((_, i) => i >= projects.length));
</script>

<main class="flex flex-col items-center gap-20">
	{#if project}
		<Project {...project} />
	{/if}
	{#each projects as project, i}
		<Letter {...page.data.letters[i]} isFirst={i === 0}></Letter>
		<Project {...project} />
	{/each}
	{#each letters as letter, i}
		{@const bgColors = ['bg-emerald-50', 'bg-yellow-50', 'bg-fuchsia-50', 'bg-slate-50']}
		<Letter {...letter} sticky class={bgColors[i % 4]}></Letter>
	{/each}
</main>
