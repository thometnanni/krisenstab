<script>
	import Carousel from './Carousel.svelte';
	import Letter from './Letter.svelte';

	let { title, description = '', images = [], topic, index = 0, first = false } = $props();
</script>

<article class="project w-full sm:py-0">
	<Carousel {images} {title} reverse={index % 2 === 1} {first} />
	{#if topic}
		<Letter html={topic} {index} maxDegrees={45} center compact />
		<!-- {:else} -->
		<!-- <div class="mt-40 mb-20 flex flex-col items-center text-center font-serif italic sm:my-40">
			<p class="text-2xl font-normal sm:mb-2 sm:text-3xl sm:leading-none">{title}</p>
			{#if description}
				<p class="max-w-2xs text-xs leading-[1.2em] italic sm:max-w-96 sm:text-base">{description}</p>
			{/if}
		</div> -->
	{/if}
</article>
