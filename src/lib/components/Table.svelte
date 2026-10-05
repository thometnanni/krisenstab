<script>
	import { page } from '$app/state';

	let { index, scale } = $props();

	const img = $derived(page.data.tables[index % page.data.tables.length]);
</script>

<div class="flex justify-end">
	<div style="width: 100px; height: 100px;" class="flex items-center justify-center">
		<div style="transform: scale({1 / scale});">
			<a href="https://www.are.na/block/{img.id}">
				<dither-dither
					src={img.url}
					object-fit="cover"
					dark="#0556B1"
					light="#FFC8F0"
					width={scale * 100}
					height={scale * 100}
					cross-origin
				></dither-dither>
			</a>
		</div>
	</div>
</div>
