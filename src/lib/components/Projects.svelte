<script>
	const raw = `| Name | Start | End | Description | Links |
|:--|:--|:--|:--|:--|
| China Unofficial Archives | 2025 | | A digital archive for censored and suppressed Chinese history. | [website](https://minjian-danganguan.org) |
| Cadavre Exquis | 2026 | 2026 | It’s the time of monsters again. An interactive piece to create and remix new creatures. | [documentation](https://thometnanni.github.io/cadavre-exquis-roulette/) |
| Index of Contemporary Agriculture | 2026 | 2026 | Exhibit for Design Signals ‹Five Hectares›, Timisoara, RO | |
| Chemical Trajectories | 2025 | 2025 | Exhibit for Design Signals ‹Chemical Bonds›, Timisoara, RO | |
| Unfolding the Archive | 2025 | 2025 | Understanding architectural practice through born-digital design records. A collaboration with Ania Molenda (Nieuwe Instituut). | [visualisation](https://unfolding-the-archive.krisenstab.net) |
| Vantage | 2024 | 2026 | Photo- and video-based spatial reconstructions for investigative journalists and fact-checkers. | [toolkit](https://vantage.krisenstab.net) |
| ‹dither-dither› | 2024 | 2026 | Bringing dithering to the web. | [demo](https://thometnanni.github.io/dither-dither/) |
| Public Wi-Fi | 2023 | 2023 | An exploration of place and SSIDs. | [video](https://public-wifi.krisenstab.net) |
| Not a Network | 2023 | 2023 | Broadcasting poetry through Wi-Fi network names. | [video](https://not-a-network.krisenstab.net) |
`;

	const start = Math.random();

	const projects = raw
		.trim()
		.split('\n')
		.map((r) =>
			r
				.trim()
				.replace(/^\||\|$/g, '')
				.split('|')
				.map((v) => v.trim())
		)
		.map((row, _, rows) => {
			return Object.fromEntries(rows[0].map((label, i) => [label.toLowerCase(), row[i]]));
		})
		.filter((_, i) => i >= 2)
		.map((r, i) => ({ ...r, offset: (start + 1.618 * i) % 1 }));
</script>

<section
	id="projects-background"
	class="relative flex w-full flex-col gap-5 px-7.5 pt-15 pb-20 text-light"
>
	{#each projects as project (project.name)}
		<div class="flex">
			<div style:flex={project.offset}></div>
			<article class="w-full max-w-100" style:left="">
				<h2 class="text-2xl">
					{project.name}
				</h2>
				<p class="text-pretty">{project.description}</p>
			</article>
			<div style:flex={1 - project.offset}></div>
		</div>
	{/each}
</section>
