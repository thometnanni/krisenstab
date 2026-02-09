<script>
	import { resolve } from '$app/paths';
	import Cover from './Cover.svelte';

	let { html, title, left, right, offset, href } = $props();
</script>

<article class="project my-12 flex flex-col items-center gap-5">
	<Cover {left} {right} {offset} />
	<section class="description mt-4b mx-4 prose prose-2xl font-serif">
		{#if href}
			<h2 class="flex items-center">{title}<a class="ml-1 text-xs" href={resolve(href)}>↗</a></h2>
		{:else}
			<h2>{title}</h2>
		{/if}
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
