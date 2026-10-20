<script>
	import IntersectionRouter from '$lib/assets/IntersectionRouter.js';
	let { html, index, sticky = false, isLast } = $props();
	import contact from '../assets/contact.js';
	import Table from './Table.svelte';

	let isFirst = $derived(index === 0);
	let degrees = $derived(isFirst ? 5 : Math.random() * 160 - 80);

	let width = 210 * 3.65;
	let height = 297 * 3.65;

	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let basicBBox = {
		width: rotatedBBox(width, height, 5).width,
		height: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
	};
	let scale = $derived(Math.min(1, innerWidth / basicBBox.width, innerHeight / basicBBox.height));

	const bbox = $derived(rotatedBBox(width, height, degrees, scale));

	const wrapper = $derived.by(() => {
		return {
			width: sticky ? innerWidth : Math.min(innerWidth, bbox.width),
			height: sticky ? innerHeight : bbox.height
		};
	});

	let offsetX = $derived(
		!isFirst
			? (wrapper.width - width) * 0.5 + (wrapper.width - bbox.width) * (Math.random() - 0.5)
			: (wrapper.width - width) * 0.5
	);
	let offsetY = $derived(
		!isFirst
			? (wrapper.height - height) * 0.5 + (wrapper.height - bbox.height) * (Math.random() - 0.5)
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
	class="letter-wrapper pointer-events-none -mb-20"
	class:mb-0={isLast}
	class:sticky
	style:top={sticky && '0%'}
	style:width="{wrapper.width}px"
	style:height="{wrapper.height}px"
	{@attach IntersectionRouter()}
>
	<article
		class="letter pointer-events-auto prose-2xl border border-dark bg-[#F5FFC5] p-8 font-sans leading-tight text-pretty text-dark var-half-mono"
		style:transform={`translate(${offsetX}px, ${offsetY}px) scale(${scale})  rotate(${degrees}deg)`}
		style:width="{width}px"
		style:height="{height}px"
	>
		<section class="prose-base border-0 pb-8 text-right leading-6 var-mono">
			<!-- <Table {index} {scale} /> -->
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
		width: calc(210px * 3.65);
		height: calc(297px * 3.65);
	}

	:global(.letter a) {
		@apply link;
		font-variation-settings:
			'MONO' 50,
			'slnt' -5;
	}

	.letter-wrapper {
		overflow: hidden;
	}
</style>
