<script>
	import Cover from './Cover.svelte';

	let { html, id, title, date, left, right, offset } = $props();
</script>

<article class="project my-12 flex flex-col items-center gap-12">
	<Cover {left} {right} {offset} />
	<section class="description mt-4b mx-4 prose prose-2xl font-serif">
		<h2>{title}</h2>
		<section>{@html html}</section>
	</section>
</article>

<style>
	@reference '../../routes/layout.css';

	.prose h2 {
		@apply -ml-12 text-5xl font-normal italic;
	}

	:global(.project a) {
		@apply link;
	}
</style>
