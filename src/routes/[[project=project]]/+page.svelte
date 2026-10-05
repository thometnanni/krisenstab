<script>
	import { page } from '$app/state';
	import Letter from '$lib/components/Letter.svelte';
	import Project from '$lib/components/Project.svelte';

	const seo = $derived(page.data.seo);
	const project = $derived(page.data.projects.find(({ name }) => name === page.params.project));
	const projects = $derived(page.data.projects.filter(({ name }) => name !== page.params.project));
	const letters = $derived(page.data.letters);
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

<main class="flex flex-col items-center">
	<div class="-mt-[32vh]">
		{#each letters as letter, i (i)}
			<Letter {...letter} sticky index={i} isLast={i === letters.length - 1}></Letter>
		{/each}
	</div>
</main>
