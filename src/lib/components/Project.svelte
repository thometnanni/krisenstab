<script>
	import IntersectionRouter from '$lib/assets/IntersectionRouter';
	import Cover from './Cover.svelte';

	let { html, id, title, date, left, right, offset, name } = $props();
</script>

<article {@attach IntersectionRouter(name)} class="project z-1 mb-40 flex flex-col items-center">
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

	@media (max-width: 640px) {
		:global(.project .prose h2) {
			@apply text-balance text-[clamp(1.75rem,1.4rem+1.9vw,2.25rem)] leading-[1.1] mb-3;
		}

		:global(.project .prose) {
			@apply text-[clamp(1.02rem,0.96rem+0.45vw,1.14rem)] leading-[1.38]  max-w-[32ch];
			/* tracking-[0.005em] */
			word-spacing: normal;
			text-rendering: optimizeLegibility;
		}

		:global(.project .prose p) {
			@apply hyphens-auto text-pretty break-words;
			orphans: 2;
			widows: 2;
		}

		:global(.project .prose p:nth-of-type(n + 2)) {
			@apply indent-[1.25em];
		}
	}
	
</style>
