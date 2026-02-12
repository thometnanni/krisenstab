<script>
	import { onMount } from 'svelte';

	let { left, right, offset = 0 } = $props();

	let leftHeight = $state(0);
	let rightHeight = $state(0);
	const offsets = $derived.by(() => {
		const center = (leftHeight - rightHeight) / 2;
		const r = center + offset * 0.01 * Math.max(rightHeight, leftHeight) * 0.5;
		return { left: Math.max(0, -r), right: Math.max(0, r) };
	});
</script>

{#if left && right}
	<section class="grid grid-cols-2">
		<div
			bind:clientHeight={leftHeight}
			class="self-start justify-self-end"
			style:margin-top="{offsets.left}px"
			style:background={left.bg}
			style:padding={left.padding?.map((p) => `calc(${p} * var(--passepartout))`).join(' ')}
		>
			<img loading="lazy" srcset="{left.src} {left.srcset ?? '2x'}" alt={left.alt} />
		</div>
		<div
			bind:clientHeight={rightHeight}
			class="self-start justify-self-start"
			style:margin-top="{offsets.right}px"
			style:background={right.bg}
			style:padding={right.padding?.map((p) => `calc(${p} * var(--passepartout))`).join(' ')}
		>
			<img loading="lazy" srcset="{right.src} {right.srcset ?? '2x'}" alt={right.alt} />
		</div>
	</section>
{/if}
