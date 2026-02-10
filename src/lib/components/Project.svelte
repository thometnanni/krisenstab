<script>
	import Cover from './Cover.svelte';
	import { resolve } from '$app/paths';

	let { html, id, title, date, left, right, offset, name } = $props();
</script>

<article class="project my-12 flex flex-col items-center gap-5">
	<Cover {left} {right} {offset} />
	<section class="description mt-4b mx-4 prose prose-2xl font-serif">
		<h2>{title}<a class="ml-1 text-xs" href={resolve(`/${name}`)}>↗</a></h2>
		<section>{@html html}</section>
	</section>
</article>

<style>
	@reference '../../routes/layout.css';

	.prose h2 {
		@apply text-center text-5xl font-normal italic;
	}

	:global(.project a) {
		@apply link;
	}
</style>
