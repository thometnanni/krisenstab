<script>
  export let data = [];
  export let activeFilter;
  $: filteredData = activeFilter
    ? data.filter(
        (item) =>
          (item.domain && item.domain.includes(activeFilter)) ||
          (item.media && item.media.includes(activeFilter)) ||
          (item.authors && item.authors.includes(activeFilter))
      )
    : data;
</script>

<section class="gallery">
  <div class="gallery-items">
    {#each filteredData as item (item.id)}
      <div class="gallery-item">
        {#each item.images as m}
          <img src="/media/{m}" alt="" />
        {/each}
      </div>
    {/each}
  </div>
</section>

<style>
  .gallery {
    max-width: 1980px;
    height: 400px;
  }

  .gallery-items {
    overflow: scroll;
    display: flex;
    /* flex-wrap: wrap; */
    gap: 10px;
    height: 400px;

  }

  img {
    height: 100%;
    width: 100%;
  }

  
  .gallery-item {
    height: 100%;
    flex: 0 0 auto;
  }

  .gallery-item img {
    height: 100%;
    width: auto;
    object-fit: cover;
    display: block;
  }

</style>
