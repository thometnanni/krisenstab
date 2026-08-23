<script>
	import raw from '$lib/data/project-list.json';

	const entries = raw.toSorted((a, b) => (b.year ?? 0) - (a.year ?? 0));
</script>

{#if entries.length}
	<section class="my-40 flex w-full max-w-[1080px] flex-col items-center px-8 font-mono text-base">
		<h2 class="mb-4 text-xs">Recent Projects</h2>
		<ul class="flex flex-col items-center gap-2 font-normal">
			{#each entries as { year, title, url } (url)}
				<li>
					<a
						href={url}
						target="_blank"
						rel="external noopener noreferrer"
						class="link truncate not-italic underline"
						>{title}{#if year},<span class="shrink-0 underline">{year}</span>{/if}
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}
