<script>
	import Carousel from './Carousel.svelte';

	let { title, description = '', images = [] } = $props();
</script>

<article class="project sm:py-0 w-full">
	<Carousel {images} {title} />
	<div class=" mt-40 mb-20 flex flex-col items-center text-center font-serif italic sm:my-40">
		<p class="text-2xl font-normal sm:mb-2 sm:text-3xl sm:leading-none">{title}</p>
		{#if description}
			<p class="max-w-2xs text-xs leading-[1.2em] italic sm:max-w-96 sm:text-base">{description}</p>
		{/if}
	</div>
</article>
