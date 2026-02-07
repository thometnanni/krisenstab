<script>
	import Cover from './Cover.svelte';

	let { html, id, title, date, left, right, offset } = $props();
</script>

<article class="flex flex-col items-center gap-8">
	<Cover {left} {right} {offset} />
	<section class="description mt-4b mx-4 prose prose-2xl font-serif">
		<h2>{title}</h2>
		<section>{@html html}</section>
	</section>
</article>

<style>
	@reference '../../routes/layout.css';

	.prose h2 {
		@apply m-auto mb-5 max-w-[640px] text-center text-5xl leading-tight font-normal text-balance italic;
	}

	:global(.description p) {
		@apply m-0 p-0;
	}

	:global(.description p:not(:first-child)) {
		@apply indent-8;
	}
</style>
