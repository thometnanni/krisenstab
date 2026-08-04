<script>
	let { images = [], title = '' } = $props();

	const isVideo = (src) => /\.(webm|mp4|mov)$/i.test(src ?? '');

	const parseLinks = (text = '') =>
		text.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1 <span aria-hidden="true" style="font-size:0.7em">↗</span></a>'
		);

	const extractLink = (text = '') => text.match(/\(([^)]+)\)/)?.[1] ?? null;

	// Support grouped [{group, items}] or flat [{src}] formats
	const flat = $derived(
		images.flatMap((img) => (img.items ? [...img.items, { gap: true }] : [img]))
	);
	const repeated = $derived(Array.from({ length: 6 }, () => flat).flat());

	const AUTO_SPEED = -0.6;
	const FRICTION = 0.88;

	function carouselAction(el) {
		const track = el.querySelector('.track');

		// Geometry — recomputed on resize/load
		let figs = [],
			offsets = [],
			half = 0,
			mid = 0,
			b = 0,
			k = 0;

		const measure = () => {
			figs = Array.from(track.querySelectorAll('figure'));
			if (!figs.length) return;
			offsets = figs.map((f) => f.offsetLeft + f.offsetWidth / 2);
			half = track.scrollWidth / 2;
			mid = el.offsetWidth / 2;
			b = el.offsetHeight * 0.95;
			k = b / (mid * mid);
		};

		// Scroll state
		let x = 0;
		let velocity = AUTO_SPEED;
		let hoverOffset = 0;
		let hoverTarget = 0;
		let hovering = false;
		let enterFraction = 0.5;

		// Animation state
		let animId;
		let visible = false;
		let lastFrameTime = performance.now();

		const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

		const draw = () => {
			if (!figs.length || !half) return;
			const cx = (((x + hoverOffset) % -half) - half) % -half;
			track.style.transform = `translateX(${cx}px)`;
			for (let i = 0; i < figs.length; i++) {
				const raw = offsets[i] + cx - mid;
				const dx = raw - Math.round(raw / half) * half;
				figs[i].style.transform = `translateY(${Math.min(dx * dx * k, b)}px)`;
			}
		};

		// On entry: normalize x to one image set (visually lossless, images repeat every iw).
		// Mouse position becomes the pivot — no jump. Left → first image, right → last image.
		const onMouseEnter = (e) => {
			hovering = true;
			if (half > 0) {
				const iw = half / 3;
				const cx = (((x + hoverOffset) % -half) - half) % -half;
				x = Math.max(-(iw - el.offsetWidth), Math.min(0, cx % -iw));
				hoverOffset = 0;
				hoverTarget = 0;
			}
			enterFraction = toFraction(e.clientX);
		};

		const onMouseLeave = () => {
			hovering = false;
			x += hoverOffset;
			hoverOffset = 0;
			hoverTarget = 0;
			lastFrameTime = performance.now();
		};

		const toFraction = (clientX) => {
			const { left, width } = el.getBoundingClientRect();
			return Math.max(0, Math.min(1, (clientX - left) / width));
		};

		const onMouseMove = (e) => {
			if (!hovering || !half) return;
			const iw = half / 3;
			const scrollRange = Math.max(0, iw - el.offsetWidth);
			if (!scrollRange) return;
			const fraction = toFraction(e.clientX);
			const distBack = -x;
			const distFwd = scrollRange + x;
			hoverTarget =
				fraction < enterFraction
					? enterFraction > 0
						? ((enterFraction - fraction) / enterFraction) * distBack
						: 0
					: enterFraction < 1
						? (-(fraction - enterFraction) / (1 - enterFraction)) * distFwd
						: 0;
		};

		el.addEventListener('mouseenter', onMouseEnter);
		el.addEventListener('mouseleave', onMouseLeave);
		window.addEventListener('mousemove', onMouseMove);

		const tick = (time) => {
			animId = requestAnimationFrame(tick);
			if (!visible) return;

			const dt = time - lastFrameTime;
			if (isMobile() && dt < 28) return;
			lastFrameTime = time;

			const frames = dt / 16.67;

			const diff = hoverTarget - hoverOffset;
			hoverOffset += diff * Math.min(1, 0.06 * frames);
			if (Math.abs(diff) < 0.1) hoverOffset = hoverTarget;

			if (hovering) {
				draw();
				return;
			}

			const decay = Math.pow(FRICTION, frames);
			velocity = velocity * decay + AUTO_SPEED * (1 - decay);
			if (Math.abs(velocity - AUTO_SPEED) < 0.001) velocity = AUTO_SPEED;
			x += velocity * frames;
			draw();
		};

		const observer = new IntersectionObserver(
			([e]) => {
				visible = e.isIntersecting;
				if (visible) lastFrameTime = performance.now();
			},
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
				window.removeEventListener('mousemove', onMouseMove);
				observer.disconnect();
			}
		};
	}
</script>

<div style="overflow-x: clip">
	<div use:carouselAction class="my-10 h-60 sm:my-0 sm:h-120" role="region" aria-label={title}>
		<div class="track flex h-full will-change-transform">
			{#each repeated as img, i (i)}
				{#if img.gap}
					<div class="h-full w-50 shrink-0" aria-hidden="true"></div>
				{:else}
					{@const link = img.link ?? extractLink(img.alt ?? '')}
					{#snippet fig()}
						<figure
							class="relative flex h-full shrink-0 flex-col will-change-transform select-none"
						>
							{#if isVideo(img.src)}
								<video
									class="block h-auto max-h-full w-auto"
									style={img.width ? `max-width:${img.width}px` : ''}
									src={img.src}
									autoplay
									muted
									loop
									playsinline
									draggable="false"
								></video>
							{:else}
								<img
									class="block h-auto max-h-full w-auto"
									style={img.width ? `max-width:${img.width}px` : ''}
									src={img.src}
									alt={img.alt ?? ''}
									draggable="false"
								/>
							{/if}
							{#if img.alt}
								<figcaption class="mt-1 text-xs font-medium">
									{@html parseLinks(img.alt)}
								</figcaption>
							{/if}
						</figure>
					{/snippet}
					{#if link}
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							draggable="false"
							class="block h-full shrink-0">{@render fig()}</a
						>
					{:else}
						{@render fig()}
					{/if}
				{/if}
			{/each}
		</div>
	</div>
</div>
