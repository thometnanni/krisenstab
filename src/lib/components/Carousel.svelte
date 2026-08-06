<script>
	let { images = [], title = '' } = $props();

	const isVideo = (src) => /\.(webm|mp4|mov)$/i.test(src ?? '');

	const parseLinks = (text = '') =>
		text.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1 <span aria-hidden="true" style="font-size:1.2em">↗</span></a>'
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

		let figs = [], offsets = [], half = 0, mid = 0, b = 0, k = 0;

		const measure = () => {
			figs = Array.from(track.querySelectorAll('figure'));
			if (!figs.length) return;
			offsets = figs.map((f) => f.offsetLeft + f.offsetWidth / 2);
			half = track.scrollWidth / 2;
			mid = el.offsetWidth / 2;
			b = el.offsetHeight * (isMobile() ? 0.9 : 1.5);
			k = b / (mid * mid);
		};

		let x = 0;
		let velocity = AUTO_SPEED;
		let dragging = false;
		let didDrag = false;
		let dragStartClientX = 0;
		let startX = 0;
		let dragVelocity = 0;
		let prevClientX = 0;
		let prevDragTime = 0;
		let animId;
		let visible = false;
		let hovered = false;
		let lastFrameTime = performance.now();

		const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

		const draw = () => {
			if (!figs.length || !half) return;
			const cx = ((x % -half) - half) % -half;
			track.style.transform = `translateX(${cx}px)`;
			for (let i = 0; i < figs.length; i++) {
				const raw = offsets[i] + cx - mid;
				const dx = raw - Math.round(raw / half) * half;
				figs[i].style.transform = `translateY(${Math.min(dx * dx * k, b)}px)`;
			}
		};

		const onDragStart = (clientX) => {
			dragging = true;
			didDrag = false;
			dragStartClientX = clientX;
			startX = clientX - x;
			dragVelocity = 0;
			prevClientX = clientX;
			prevDragTime = performance.now();
		};

		const onDragMove = (clientX) => {
			if (!dragging) return;
			if (Math.abs(clientX - dragStartClientX) > 4) didDrag = true;
			const now = performance.now();
			const dt = now - prevDragTime;
			if (dt > 0) dragVelocity = ((clientX - prevClientX) / dt) * 16.67;
			prevClientX = clientX;
			prevDragTime = now;
			x = clientX - startX;
			draw();
		};

		const onDragEnd = () => {
			if (!dragging) return;
			dragging = false;
			velocity = Math.max(-20, Math.min(20, dragVelocity));
			lastFrameTime = performance.now();
			el.style.cursor = '';
		};

		let startTouchY = 0;
		let touchLocked = null;

		const onMouseEnter = () => { hovered = true; };
		const onMouseDown = (e) => { onDragStart(e.clientX); el.style.cursor = 'grabbing'; };
		const onMouseLeave = () => { hovered = false; if (dragging) onDragEnd(); };
		const onMouseMove = (e) => { if (dragging) onDragMove(e.clientX); };
		const onMouseUp = () => { if (dragging) onDragEnd(); };
		const onClick = (e) => { if (didDrag) { e.preventDefault(); e.stopPropagation(); didDrag = false; } };

		const onTouchStart = (e) => {
			const t = e.touches[0];
			startTouchY = t.clientY;
			touchLocked = null;
			onDragStart(t.clientX);
		};

		const onTouchMove = (e) => {
			if (!dragging) return;
			const t = e.touches[0];
			if (!touchLocked) {
				const dx = Math.abs(t.clientX - prevClientX);
				const dy = Math.abs(t.clientY - startTouchY);
				if (dx < 4 && dy < 4) return;
				touchLocked = dx >= dy ? 'h' : 'v';
			}
			if (touchLocked === 'v') { onDragEnd(); return; }
			e.preventDefault();
			onDragMove(t.clientX);
		};

		el.addEventListener('mouseenter', onMouseEnter);
		el.addEventListener('mousedown', onMouseDown);
		el.addEventListener('mouseleave', onMouseLeave);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		el.addEventListener('click', onClick, true);
		el.addEventListener('touchstart', onTouchStart, { passive: true });
		el.addEventListener('touchmove', onTouchMove, { passive: false });
		el.addEventListener('touchend', onDragEnd);

		const tick = (time) => {
			animId = requestAnimationFrame(tick);
			if (!visible || dragging || hovered) return;

			const dt = time - lastFrameTime;
			if (isMobile() && dt < 28) return;
			lastFrameTime = time;

			const frames = dt / 16.67;
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
				window.removeEventListener('mouseup', onMouseUp);
				el.removeEventListener('mouseenter', onMouseEnter);
				el.removeEventListener('click', onClick, true);
				observer.disconnect();
			}
		};
	}
</script>

<div style="overflow-x: clip">
	<div use:carouselAction class="h-40 cursor-grab sm:h-80" role="region" aria-label={title}>
		<div class="track flex h-full will-change-transform">
			{#each repeated as img, i (i)}
				{#if img.gap}
					<div class="h-full w-10 shrink-0" aria-hidden="true"></div>
				{:else}
					{@const link = img.link ?? extractLink(img.alt ?? '')}
					{#snippet fig()}
						<figure
							class="relative flex h-full shrink-0 flex-col will-change-transform select-none"
						>
							{#if isVideo(img.src)}
								<video
									class="block h-auto max-h-full w-auto"
									style="{img.width ? `max-width:${img.width}px;` : ''}{img.cropBottom ? `clip-path:inset(0 0 ${img.cropBottom}px 0)` : ''}"
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
								<figcaption class="mt-1 text-xs font-mono">
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
							class="block h-full">{@render fig()}</a
						>
					{:else}
						{@render fig()}
					{/if}
				{/if}
			{/each}
		</div>
	</div>
</div>
