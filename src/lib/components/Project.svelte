<script>
	let { title, description = '', images = [] } = $props();

	const isVideo = (src) => /\.(webm|mp4|mov)$/i.test(src ?? '');

	const parseLinks = (text = '') =>
		text.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1 <span aria-hidden="true" style="font-size:0.7em">↗</span></a>'
		);

	const repeated = $derived(Array.from({ length: 6 }, () => images).flat());

	function carousel(el) {
		const track = el.querySelector('.track');
		const wrapper = el.closest('div');

		let figs, offsets, half, mid, b, k;

		const measure = () => {
			figs = Array.from(track.querySelectorAll('figure'));
			offsets = figs.map((f) => f.offsetLeft + f.offsetWidth / 2);
			half = track.scrollWidth / 2;
			mid = el.offsetWidth / 2;
			b = el.offsetHeight * 0.5;
			k = b / (mid * mid);
			wrapper.style.setProperty('--curve-drop', `${b}px`);
		};

		let x = 0;
		let dragging = false;
		let startX = 0;
		let animId;
		let visible = false;
		const isMobile = () => window.matchMedia('(pointer: coarse)').matches;
		let lastTime = 0;

		const draw = () => {
			const cx = ((x % -half) - half) % -half;
			track.style.transform = `translateX(${cx}px)`;
			for (let i = 0; i < figs.length; i++) {
				const raw = offsets[i] + cx - mid;
				const dx = raw - Math.round(raw / half) * half;
				figs[i].style.transform = `translateY(${Math.min(dx * dx * k, b)}px)`;
			}
		};

		const onDragStart = (clientX) => { dragging = true; startX = clientX - x; };
		const onDragMove = (clientX) => { x = clientX - startX; draw(); };
		const onDragEnd = () => { dragging = false; };

		el.addEventListener('mousedown', (e) => { onDragStart(e.clientX); el.style.cursor = 'grabbing'; });
		el.addEventListener('mouseleave', () => { dragging = false; el.style.cursor = ''; });
		window.addEventListener('mousemove', (e) => { if (dragging) onDragMove(e.clientX); });
		window.addEventListener('mouseup', () => { if (dragging) { onDragEnd(); el.style.cursor = ''; } });

		el.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
		el.addEventListener('touchmove', (e) => { if (dragging) onDragMove(e.touches[0].clientX); }, { passive: true });
		el.addEventListener('touchend', onDragEnd);

		const tick = (time) => {
			animId = requestAnimationFrame(tick);
			if (!visible) return;
			if (isMobile() && time - lastTime < 32) return; // ~30fps on mobile
			lastTime = time;
			if (!dragging) { x -= 0.6; draw(); }
		};

		const observer = new IntersectionObserver(
			([e]) => { visible = e.isIntersecting; },
			{ threshold: 0 }
		);
		observer.observe(el);

		track.querySelectorAll('img').forEach((img) => {
			if (!img.complete) img.addEventListener('load', measure, { once: true });
		});
		track.querySelectorAll('video').forEach((v) => {
			if (v.readyState < 1) v.addEventListener('loadedmetadata', measure, { once: true });
		});

		measure();
		window.addEventListener('resize', measure);
		animId = requestAnimationFrame(tick);

		return {
			destroy() {
				cancelAnimationFrame(animId);
				window.removeEventListener('resize', measure);
				observer.disconnect();
			}
		};
	}
</script>

<article class="project w-full py-20 pb-10 font-serif italic sm:py-0">
	<div style="overflow-x: clip; padding-bottom: var(--curve-drop, 0px)">
		<div use:carousel class="carousel h-40 cursor-grab sm:h-60" role="region" aria-label={title}>
			<div class="track flex h-full will-change-transform">
				{#each repeated as img, i (i)}
					<figure class="relative h-full shrink-0 select-none will-change-transform">
						{#if isVideo(img.src)}
							<video class="block h-full w-auto" src={img.src} autoplay muted loop playsinline draggable="false"></video>
						{:else}
							<img class="block h-full w-auto" src={img.src} alt={img.alt ?? ''} draggable="false" />
						{/if}
						{#if img.alt}
							<figcaption class="text-sm leading-snug italic">{@html parseLinks(img.alt)}</figcaption>
						{/if}
					</figure>
				{/each}
			</div>
		</div>
	</div>
	<div class="my-20 flex flex-col items-center text-center">
		<p class="text-2xl font-normal sm:mb-2 sm:text-3xl sm:leading-none">{title}</p>
		{#if description}
			<p class="max-w-2xs text-xs leading-none italic sm:max-w-96 sm:text-base">{description}</p>
		{/if}
	</div>
</article>
