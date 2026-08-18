<script>
	import raw from '$lib/data/project-list.json';

	const entries = raw.toSorted((a, b) => (b.year ?? 0) - (a.year ?? 0));
</script>

{#if entries.length}
	<section class="my-20 flex w-full max-w-[1080px] items-center flex-col px-8 font-mono text-sm">
		<h2 class="mb-4 text-xs tracking-widest">Recent Projects</h2>
		<ul class="flex items-center flex-col gap-1">
			{#each entries as { year, title, url } (url)}
				<li class="flex gap-4">
					<a href={url} target="_blank" rel="external noopener noreferrer" class="link truncate">
						{title}
					</a>
					{#if year}<span class="shrink-0">{year}</span>{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}
