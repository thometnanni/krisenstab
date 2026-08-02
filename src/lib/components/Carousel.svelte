<script>
	let { images = [], title = '' } = $props();

	const isVideo = (src) => /\.(webm|mp4|mov)$/i.test(src ?? '');

	const parseLinks = (text = '') =>
		text.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1 <span aria-hidden="true" style="font-size:0.7em">↗</span></a>'
		);

	const repeated = $derived(Array.from({ length: 6 }, () => images).flat());

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
			b = el.offsetHeight * 1.5;
			k = b / (mid * mid);
		};

		let x = 0;
		let velocity = AUTO_SPEED;
		let dragging = false;
		let startX = 0;
		let dragVelocity = 0;
		let prevClientX = 0;
		let prevDragTime = 0;
		let animId;
		let visible = false;
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
			startX = clientX - x;
			dragVelocity = 0;
			prevClientX = clientX;
			prevDragTime = performance.now();
		};

		const onDragMove = (clientX) => {
			if (!dragging) return;
			const now = performance.now();
			const dt = now - prevDragTime;
			if (dt > 0) {
				dragVelocity = ((clientX - prevClientX) / dt) * 16.67;
			}
			prevClientX = clientX;
			prevDragTime = now;
			x = clientX - startX;
			draw();
		};

		const onDragEnd = () => {
			if (!dragging) return;
			dragging = false;
			velocity = Math.max(-20, Math.min(20, dragVelocity));
			el.style.cursor = '';
		};

		const onMouseDown = (e) => { onDragStart(e.clientX); el.style.cursor = 'grabbing'; };
		const onMouseLeave = () => { if (dragging) onDragEnd(); };
		const onMouseMove = (e) => { if (dragging) onDragMove(e.clientX); };
		const onMouseUp = () => { if (dragging) onDragEnd(); };
		const onTouchStart = (e) => onDragStart(e.touches[0].clientX);
		const onTouchMove = (e) => { if (dragging) onDragMove(e.touches[0].clientX); };

		el.addEventListener('mousedown', onMouseDown);
		el.addEventListener('mouseleave', onMouseLeave);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		el.addEventListener('touchstart', onTouchStart, { passive: true });
		el.addEventListener('touchmove', onTouchMove, { passive: true });
		el.addEventListener('touchend', onDragEnd);

		const tick = (time) => {
			animId = requestAnimationFrame(tick);
			if (!visible || dragging) return;

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
				observer.disconnect();
			}
		};
	}
</script>

<div style="overflow-x: clip">
	<div use:carouselAction class="h-25 cursor-grab sm:h-60" role="region" aria-label={title}>
		<div class="track flex h-full will-change-transform">
			{#each repeated as img, i (i)}
				<figure class="relative h-full shrink-0 select-none will-change-transform">
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
						<img
							class="block h-full w-auto"
							src={img.src}
							alt={img.alt ?? ''}
							draggable="false"
						/>
					{/if}
					{#if img.alt}
						<figcaption class="text-sm leading-snug italic">{@html parseLinks(img.alt)}</figcaption>
					{/if}
				</figure>
			{/each}
		</div>
	</div>
</div>
