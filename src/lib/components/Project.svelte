<script>
	// import IntersectionRouter from '$lib/assets/IntersectionRouter';

	let { title, description = '', images = [] } = $props();
	// const url = '';

	const isVideo = (src) => /\.(webm|mp4|mov)$/i.test(src ?? '');
	const parseLinks = (text = '') =>
		text.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener">$1<span style="font-size:0.7em">↗</span></a>'
		);
	const repeated = $derived(Array.from({ length: 6 }, () => images).flat());

	function carousel(el) {
		const tr = el.querySelector('.track');
		let translateX = 0;
		let dragging = false;
		let dragStartX = 0;
		let animId;

		const clamp = () => {
			const half = tr.scrollWidth / 2;
			while (translateX <= -half) translateX += half;
			while (translateX > 0) translateX -= half;
		};

		const apply = () => {
			tr.style.transform = `translateX(${translateX}px)`;
		};

		el.addEventListener('mouseleave', () => {
			dragging = false;
			el.style.cursor = '';
		});

		el.addEventListener('mousedown', (e) => {
			dragging = true;
			dragStartX = e.clientX - translateX;
			el.style.cursor = 'grabbing';
		});
		window.addEventListener('mousemove', (e) => {
			if (!dragging) return;
			translateX = e.clientX - dragStartX;
			clamp();
			apply();
		});
		window.addEventListener('mouseup', () => {
			if (!dragging) return;
			dragging = false;
			el.style.cursor = '';
		});

		el.addEventListener(
			'touchstart',
			(e) => {
				dragging = true;
				dragStartX = e.touches[0].clientX - translateX;
			},
			{ passive: true }
		);
		el.addEventListener(
			'touchmove',
			(e) => {
				if (!dragging) return;
				translateX = e.touches[0].clientX - dragStartX;
				clamp();
				apply();
			},
			{ passive: true }
		);
		el.addEventListener('touchend', () => {
			dragging = false;
		});

		const tick = () => {
			if (!dragging) {
				translateX -= 0.6;
				clamp();
				apply();
			}
			animId = requestAnimationFrame(tick);
		};
		animId = requestAnimationFrame(tick);

		return { destroy: () => cancelAnimationFrame(animId) };
	}
</script>

<article class="project w-full font-serif italic">
	<div style="overflow-x: clip">
	<div
		use:carousel
		class="carousel relative h-[380px] cursor-grab"
		role="region"
		aria-label={title}
	>
		<div class="track flex h-full will-change-transform">
			{#each repeated as img, i (i)}
				<figure class="relative h-full shrink-0">
					{#if img.alt}
						<figcaption class="absolute bottom-full left-0 text-base leading-snug italic">
							{@html parseLinks(img.alt)}
						</figcaption>
					{/if}
					{#if isVideo(img.src)}
						<video
							class="block h-full w-auto"
							src={img.src}
							autoplay
							muted
							loop
							playsinline
							draggable="false"
						></video>
					{:else}
						<img class="block h-full w-auto" src={img.src} alt={img.alt} draggable="false" />
					{/if}
				</figure>
			{/each}
		</div>
	</div>
	</div>
	<div class="z-10 mb-10 w-fit">
		<p class="text-2xl font-normal sm:mb-2 sm:text-5xl sm:leading-none">{title}</p>
		{#if description}
			<p class="max-w-2xs text-xs leading-none italic sm:max-w-96 sm:text-base">
				{description}
			</p>
		{/if}
	</div>
</article>

<style>
	:global(figcaption a) {
		/* color: blue; */
	}
</style>
