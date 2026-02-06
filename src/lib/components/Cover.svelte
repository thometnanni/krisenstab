<script>
	import { onMount } from 'svelte';

	let { left, right, offset = 0 } = $props();

	let container = $state();
	let parallax = $state(0);
	let containerHeight = $state(0);
	let rafId;

	let leftHeight = $state(0);
	let rightHeight = $state(0);
	const offsets = $derived.by(() => {
		const center = (leftHeight - rightHeight) / 2;
		const r = center + offset * 0.01 * Math.max(rightHeight, leftHeight) * 0.5;
		return { left: Math.max(0, -r), right: Math.max(0, r) };
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (!rafId) rafId = requestAnimationFrame(updateParallax);
					} else {
						if (rafId) {
							cancelAnimationFrame(rafId);
							rafId = null;
						}
					}
				});
			},
			{ threshold: [0, 1] }
		);
		observer.observe(container);
	});

	function updateParallax() {
		const rect = container.getBoundingClientRect();
		const vh = window.innerHeight;

		const travelled = 1 - (vh - rect.top) / (vh + rect.height);

		parallax = offsets.left + leftHeight > offsets.right + rightHeight ? travelled : -travelled;

		if (travelled > 0 && travelled < 1) {
			rafId = requestAnimationFrame(updateParallax);
		} else {
			rafId = null;
		}
	}
</script>

{#if left && right}
	<section class="grid grid-cols-2" bind:this={container}>
		<div
			bind:clientHeight={leftHeight}
			class="self-start justify-self-end"
			style:margin-top="{offsets.left}px"
			style:background={left.bg}
			style:padding={left.padding?.map((p) => `calc(${p} * var(--passepartout))`).join(' ')}
			style:transform="translate(0, {parallax * -100}px)"
		>
			<img loading="lazy" srcset="{left.src} {left.srcset ?? '2x'}" alt={left.alt} />
		</div>
		<div
			bind:clientHeight={rightHeight}
			class="self-start justify-self-start"
			style:margin-top="{offsets.right}px"
			style:background={right.bg}
			style:padding={right.padding?.map((p) => `calc(${p} * var(--passepartout))`).join(' ')}
			style:transform="translate(0, {parallax * 100}px)"
		>
			<img loading="lazy" srcset="{right.src} {right.srcset ?? '2x'}" alt={right.alt} />
		</div>
	</section>
{/if}
