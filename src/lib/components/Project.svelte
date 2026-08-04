<script>
	import Carousel from './Carousel.svelte';

	let { title, description = '', images = [] } = $props();
</script>

<article class="project w-full pb-16 font-serif italic sm:pb-20">
	<div class="relative">
		<Carousel {images} {title} />
		<p
			class="pointer-events-none absolute -bottom-10 left-0 right-0 text-center font-mono text-2xl font-normal not-italic sm:-bottom-14 sm:text-2xl sm:leading-none"
		>
			{title}
		</p>
	</div>
</article>
