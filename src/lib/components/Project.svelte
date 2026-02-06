<script>
	import Cover from './Cover.svelte';

	let { html, id, title, date, left, right, offset } = $props();
</script>

<article class="flex flex-col items-center gap-4">
	<Cover {left} {right} {offset} />
	<section class="mx-4 prose prose-xl font-serif">
		<h2>{title}</h2>
		<section>{@html html}</section>
	</section>
</article>

<style>
	@reference '../../routes/layout.css';
	.prose h2 {
		@apply text-center text-5xl font-normal italic;
		/* font-family: 'Redaction-50', var(--font-serif); */
	}

	article {
		@apply m-auto max-w-7xl;
	}

	:global(section p) {
		@apply m-1;
	}
	:global(section > p:not(:first-of-type)) {
		@apply indent-8;
	}
</style>
