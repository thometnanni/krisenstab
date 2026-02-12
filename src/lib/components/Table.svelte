<script>
	import { page } from '$app/state';

	let { index } = $props();

	const img = $derived(page.data.tables[index % page.data.tables.length]);
</script>

<div class="flex justify-end">
	<a href="https://www.are.na/block/{img.id}">
		<img src={img.url} class="m-0! h-16 p-0! mix-blend-multiply grayscale" alt="" />
	</a>
</div>
