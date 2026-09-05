<script>
	import { onMount } from 'svelte';

	onMount(() => {
		import('dither-dither');
	});
</script>

<svelte:head>
	<title>krisenstab</title>
	<meta
		name="description"
		content="We are a design studio working at the intersection of technology, journalism and culture."
	/>
	<link rel="preload" href="/cover.jpg" as="image" />
</svelte:head>

<div class="container">
	<div class="intro">
		<dither-dither class="dither" src="/cover.jpg" width="350"></dither-dither>

		<p>
			We are a design studio working at the intersection of technology, journalism and culture.
			<br />
			We specialise in creating hybrid interfaces for complex datasets, enabling new forms of exploration
			and understanding.
		</p>

		<p>
			Our work is <a href="https://github.com/thometnanni">open source</a> and we document our
			<a href="https://www.are.na/krisenstab/">process</a>
			on a regular basis.
			<br />

			<a href="mailto:hi@krisenstab.net">Reach out</a> for collaborations, commissions, or questions.
		</p>

		<p>
			Best,<br />
			Giacomo &amp; Fidel
		</p>
	</div>

	<br />

	<div class="col">
		<div class="item">
			Exhibiting at BIO29
			<br />
			2026
		</div>

		<div class="item">
			Index of Contemporary Agriculture
			<br />
			2026
		</div>
		<div class="item">
			<a target="_blank" href="https://unfolding-the-archive.thometnanni.net/"
				>Unfolding the Archive</a
			><br />
			2025
		</div>

		<div class="item">
			<a target="_blank" href="http://china-unofficial-archives.org/">China Unofficial Archive</a
			><br />
			2025
		</div>

		<div class="item">
			<a target="_blank" href="https://chemical-bonds.krisenstab.net/">Chemical Bonds</a><br />
			2025
		</div>
		<div class="item">
			<a target="_blank" href="https://vantage.krisenstab.net/">Vantage</a><br />
			2024-2026
		</div>
		<div class="item">
			<a target="_blank" href="https://github.com/fidelthomet/dither-dither">dither-dither</a><br />
			2024
		</div>
	</div>

	<div class="col">
		<div class="item">
			<a target="_blank" href="https://www.are.na/krisenstab/">are.na</a>
		</div>

		<div class="item">
			<a target="_blank" href="https://github.com/thometnanni/krisenstab">github</a>
		</div>

		<div class="item">
			<a target="_blank" href="https://krisenstab.substack.com">substack</a>
		</div>
	</div>

	<div class="col">
		<div class="item">
			<a href="mailto:hi@krisenstab.net">hi@krisenstab.net</a><br />
			Emser Str. 68<br />
			12051 Berlin<br />
			VAT DE405805468
		</div>
	</div>
</div>

<style>
	:global(body) {
		padding: 14px;
		margin: 0;
		font-family: 'Times New Roman', serif;
		font-size: 16px;
	}

	.container {
		display: flex;
		flex-wrap: wrap;
	}

	.intro {
		display: block;
		flex-basis: 100%;
		width: 100%;
	}

	.intro > * {
		max-width: 600px;
	}

	.dither {
		display: block;
		width: 100%;
		aspect-ratio: 1200 / 430;
		margin-bottom: 18px;
		image-rendering: pixelated;
	}

	.col {
		flex: 0 0 220px;
		padding-top: 40px;
		padding-right: 14px;
	}

	.col:nth-of-type(3) {
		flex-basis: 120px;
	}

	.item {
		padding-bottom: 0.5em;
		line-height: 1.1;
	}

	.item:last-child {
		padding-bottom: 1.5em;
	}

	a {
		text-decoration: none;
		color: rgb(0, 0, 255);
	}

	a:hover {
		text-decoration: underline;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
		}

		.col {
			flex-basis: 100%;
			padding: 0;
		}

		.item:empty {
			padding-bottom: 0;
		}
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 1000px;
		}
	}
</style>
