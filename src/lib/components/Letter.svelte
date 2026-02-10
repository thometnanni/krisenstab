<script>
	let { html, isFirst = false, sticky = false, class: className = 'bg-slate-50' } = $props();
	import contact from '../assets/contact.js';

	let degrees = $derived(isFirst ? 5 : Math.random() * 160 - 80);

	let width = 210 * 4;
	let height = 297 * 4;

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
		sticky
			? (wrapper.width - width) * 0.5 + (wrapper.width - bbox.width) * (Math.random() - 0.5)
			: (wrapper.width - width) * 0.5
	);
	let offsetY = $derived(
		sticky
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
	class="letter-wrapper"
	class:sticky
	style:top={sticky && '0%'}
	style:width="{wrapper.width}px"
	style:height="{wrapper.height}px"
>
	<article
		class="letter prose prose-2xl p-8 font-mono {className}"
		style:transform={`translate(${offsetX}px, ${offsetY}px) scale(${scale})  rotate(${degrees}deg)`}
		style:width="{width}px"
		style:height="{height}px"
	>
		<section class="prose-base border-0 pb-8 text-right leading-6">
			<div class="flex justify-end">
				<img src="/table.png" class="m-0! max-w-8 p-0! grayscale" alt="" />
			</div>
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
