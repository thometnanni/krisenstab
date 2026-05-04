<script>
	import IntersectionRouter from '$lib/assets/IntersectionRouter.js';
	let { html, index, sticky = false } = $props();
	import contact from '../assets/contact.js';
	import Table from './Table.svelte';

	function seeded(seed) {
		const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
		return x - Math.floor(x);
	}

	let randomRotation = $derived(seeded((index + 1) * 1.13));
	let randomOffsetX = $derived(seeded((index + 1) * 2.17));
	let randomOffsetY = $derived(seeded((index + 1) * 3.29));

	let degrees = $derived(index === 0 ? 5 : randomRotation * 160 - 80);

	let width = 210 * 4;
	let height = 297 * 4;
	const FALLBACK_VIEWPORT_WIDTH = 1280;
	const FALLBACK_VIEWPORT_HEIGHT = 800;

	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let effectiveInnerWidth = $derived(innerWidth || FALLBACK_VIEWPORT_WIDTH);
	let effectiveInnerHeight = $derived(innerHeight || FALLBACK_VIEWPORT_HEIGHT);

	const colors = [
		'bg-[#EBF4F0]',
		'bg-[#F5F6F7]',
		'bg-[#EEF2F6]',
		'bg-[#F8F1F9]',
		'bg-[#F9F1F1]',
		'bg-[#F1F7F9]',
		'bg-[#F1F9F4]',
		'bg-[#FBF9E4]'
	];

	let color = $derived(colors[index % colors.length]);

	let basicBBox = {
		width: rotatedBBox(width, height, 5).width,
		height: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
	};
	let scale = $derived(
		Math.min(1, effectiveInnerWidth / basicBBox.width, effectiveInnerHeight / basicBBox.height)
	);

	const bbox = $derived(rotatedBBox(width, height, degrees, scale));

	const wrapper = $derived.by(() => {
		return {
			width: sticky ? effectiveInnerWidth : Math.min(effectiveInnerWidth, bbox.width),
			height: sticky ? effectiveInnerHeight : bbox.height
		};
	});

	let offsetX = $derived(
		sticky
			? (wrapper.width - width) * 0.5 + (wrapper.width - bbox.width) * (randomOffsetX - 0.5)
			: (wrapper.width - width) * 0.5
	);
	let offsetY = $derived(
		sticky
			? (wrapper.height - height) * 0.5 + (wrapper.height - bbox.height) * (randomOffsetY - 0.5)
			: (wrapper.height - height) * 0.5
	);

	function rotatedBBox(width, height, degrees, scale = 1) {
		const rad = (degrees * Math.PI) / 180;
		const c = Math.abs(Math.cos(rad));
		const s = Math.abs(Math.sin(rad));

		const w = width * scale;
		const h = height * scale;

		const bboxWidth = w * c + h * s;
		const bboxHeight = h * c + w * s;
		return { width: bboxWidth, height: bboxHeight };
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div
	class="letter-wrapper -mb-20"
	class:sticky
	style:top={sticky && '0%'}
	style:width="{wrapper.width}px"
	style:height="{wrapper.height}px"
	{@attach IntersectionRouter()}
>
	<article
		class="letter prose prose-2xl p-8 font-mono {color}"
		style:transform={`translate(${offsetX}px, ${offsetY}px) scale(${scale})  rotate(${degrees}deg)`}
		style:width="{width}px"
		style:height="{height}px"
	>
		<section class="prose-base border-0 pb-8 text-right leading-6">
			<Table {index} />
			<p>
				Krisenstab
				<br />
				Thomet & Nanni GbR
				<br />
				{atob(contact.street)}
				<br />
				{atob(contact.town)}
			</p>

			<p>
				<a class="no-underline!" href="mailto:{atob(contact.mail)}">{atob(contact.mail)}</a>
				<br />
				{atob(contact.vat)}
			</p>
		</section>
		{@html html}
	</article>
</div>

<style>
	@reference '../../routes/layout.css';
	.letter {
		width: calc(210px * 4);
		height: calc(297px * 4);
	}

	:global(.letter a) {
		@apply link not-italic;
	}

	.letter-wrapper {
		overflow: hidden;
	}
</style>
