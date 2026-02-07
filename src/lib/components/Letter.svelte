<script>
	let { html, index = 0 } = $props();
	import contact from '../assets/contact.js';

	let degrees = $derived(index === 0 ? 5 : Math.random() * 160 - 80);

	let width = 210 * 4;
	let height = 297 * 4;

	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let basicBBox = rotatedBBox(width, height, 5);
	let scale = $derived(Math.min(1, innerWidth / basicBBox.width, innerHeight / basicBBox.height));

	const wrapper = $derived(rotatedBBox(width, height, degrees, scale));

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
<div class="letter-wrapper" style:width="{wrapper.width}px" style:height="{wrapper.height}px">
	<article
		class="letter prose prose-2xl p-8 font-mono"
		style:transform="translate({(wrapper.width - width) / 2}px, {(wrapper.height - height) / 2}px)
		scale({scale}) rotate({degrees}deg)"
		style:width="{width}px"
		style:height="{height}px"
	>
		<section class="info prose-base border-0 pb-8 text-right leading-6">
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
				<a class="no-underline" href="mailto:{atob(contact.mail)}">{atob(contact.mail)}</a>
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
		@apply bg-slate-50;
		width: calc(210px * 4);
		height: calc(297px * 4);
	}

	
</style>
