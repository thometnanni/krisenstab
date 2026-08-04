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
	const lettersFor = (projectName) => allLetters.filter((l) => !l.featured && l.project === projectName);
	const remainingLetters = $derived(allLetters.filter((l) => !l.featured && !l.project));

	const letterOrder = $derived([
		...featuredLetters,
		...(project ? lettersFor(project.name) : []),
		...projects.flatMap((p) => lettersFor(p.name)),
		...remainingLetters
	]);
	const letterIdx = (letter) => letterOrder.findIndex((l) => l.name === letter.name);

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
		<Project {...project} />
		{#each lettersFor(project.name) as letter}
			<Letter {...letter} index={letterIdx(letter)} />
		{/each}
	{/if}
	{#each projects as proj}
		<Project {...proj} />
		{#each lettersFor(proj.name) as letter}
			<Letter {...letter} index={letterIdx(letter)} />
		{/each}
	{/each}
	{#each remainingLetters as letter}
		<Letter {...letter} sticky index={letterIdx(letter)} />
	{/each}
</main>
