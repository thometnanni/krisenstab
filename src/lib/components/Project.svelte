<script>
	import Carousel from './Carousel.svelte';

	let { title, description = '', images = [] } = $props();
</script>

<article class="project w-full py-20 pb-10 font-serif italic sm:py-0">
	<Carousel {images} {title} />
	<div class="mt-40 mb-20 flex flex-col items-center text-center sm:mt-15">
		<p class="text-2xl font-normal sm:mb-2 sm:text-3xl sm:leading-none">{title}</p>
		{#if description}
			<p class="max-w-2xs text-xs leading-none italic sm:max-w-96 sm:text-base">{description}</p>
		{/if}
	</div>
</article>
