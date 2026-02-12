<script>
	import IntersectionRouter from '$lib/assets/IntersectionRouter';
	import Cover from './Cover.svelte';

	let { html, id, title, date, left, right, offset, name } = $props();
</script>

<article {@attach IntersectionRouter(name)} class="project mb-40 flex flex-col items-center">
	<Cover {left} {right} {offset} />
	<section class="description mx-4 prose prose-2xl mt-16 font-serif">
		<h2>{title}</h2>
		<section>{@html html}</section>
	</section>
</article>

<style>
	@reference '../../routes/layout.css';

	.prose h2 {
		@apply mb-6 text-center text-5xl font-normal italic;
	}

	:global(.project a) {
		@apply link;
	}

	:global(.project .prose p) {
		@apply my-0;

		&:nth-of-type(n + 2) {
			@apply indent-20;
		}
	}
</style>
