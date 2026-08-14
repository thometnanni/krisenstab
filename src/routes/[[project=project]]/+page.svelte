<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';

	const seo = $derived(page.data.seo);
	const project = $derived(page.data.projects.find(({ name }) => name === page.params.project));
	const projects = $derived(page.data.projects.filter(({ name }) => name !== page.params.project));

	const allLetters = $derived(page.data.letters);
	const featuredLetters = $derived(allLetters.filter((l) => l.featured));
	// letters that aren't featured pile up at the bottom of the page; the
	// per-project sections are handled by curated topics instead
	const bottomLetters = $derived(allLetters.filter((l) => !l.featured));
	const orderedProjects = $derived(project ? [project, ...projects] : projects);

	// topics are curated letters matched to a project by name, rendered in
	// place of that project's plain title/description
	const topicLetters = $derived(
		orderedProjects.filter((p) => p.topic).map((p) => ({ name: `topic-${p.name}` }))
	);

	const letterOrder = $derived([...featuredLetters, ...topicLetters, ...bottomLetters]);
	const letterIdx = (letter) => letterOrder.findIndex((l) => l.name === letter.name);
	const topicIdx = (p) => letterIdx({ name: `topic-${p.name}` });

	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta property="og:site_name" content={seo.name} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
</svelte:head>

<main class="flex flex-col items-center" style:visibility={ready ? 'visible' : 'hidden'}>
	{#each featuredLetters as letter}
		<Letter {...letter} index={letterIdx(letter)} />
	{/each}
	{#if project}
		<Project {...project} index={topicIdx(project)} first />
	{/if}
	{#each projects as proj, i}
		<Project {...proj} index={topicIdx(proj)} first={!project && i === 0} />
	{/each}
	{#each bottomLetters as letter}
		<Letter {...letter} sticky index={letterIdx(letter)} />
	{/each}
</main>
