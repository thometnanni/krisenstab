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
</svelte:head>

<div class="container">
	<div class="intro">
		<dither-dither class="dither" src="/cover.jpg" width="400"></dither-dither>

		<p>
			We are a design studio working at the intersection of technology, journalism and culture.
			<br />
			Our work specialises in creating hybrid interfaces for complex datasets, enabling new
			forms of exploration and understanding.
		</p>

		<p>
			Our work is <a href="https://github.com/thometnanni/krisenstab">open source</a> and we
			document our <a href="https://www.are.na/krisenstab/">process</a> on a regular basis.
			<br />

			<a href="mailto:hi@krisenstab.net">Reach out</a> for collaborations, commissions, or
			questions.
		</p>

		<p>
			Best,<br />
			Giacomo &amp; Fidel
		</p>
	</div>

	<div class="col">
		<div class="item">
			<a target="_blank" href="https://vantage.krisenstab.net/">Vantage</a><br />
			2026
		</div>

		<div class="item">
			<a target="_blank" href="https://unfolding-the-archive.thometnanni.net/"
				>Unfolding the Archive</a
			><br />
			2025
		</div>

		<div class="item">
			<a target="_blank" href="http://china-unofficial-archives.org/"
				>China Unofficial Archive</a
			><br />
			2025
		</div>

		<div class="item">
			<a target="_blank" href="https://chemical-bonds.krisenstab.net/">Chemical Bonds</a><br />
			2025
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

	.intro {
		max-width: 600px;
	}

	.dither {
		display: block;
		width: 100%;
		margin-bottom: 18px;
		image-rendering: pixelated;
	}

	.col {
		display: block;
		width: 240px;
		float: left;
		padding-top: 40px;
		padding-right: 14px;
	}

	.item {
		padding-bottom: 0.4em;
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
			width: 100%;
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
