<script>
	import Cover from './Cover.svelte';

	let { html, id, title, date, left, right, offset } = $props();
</script>

<article class="my-12 flex flex-col items-center gap-6">
	<Cover {left} {right} {offset} />
	<section class="mx-4 prose prose-xl mt-4 font-serif">
		<h2>{title}</h2>
		<section>{@html html}</section>
	</section>
</article>

<style>
	@reference '../../routes/layout.css';

	.prose h2 {
		@apply m-auto text-center max-w-[640px] text-5xl leading-tight font-normal text-balance italic;
	}
</style>
