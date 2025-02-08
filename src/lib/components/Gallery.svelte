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

  $: sorted = [...filteredData].sort(() => 0.5 - Math.random());
</script>

<section class="gallery">
  <div class="gallery-items">
    {#each sorted as item (item.id)}
      {#each item.images as m}
        <div class="gallery-item">
          <img src="/media/{m}" alt="" />
        </div>
      {/each}
    {/each}
  </div>
</section>

<style>
  .gallery {
    max-width: calc(100vw - 250px);
    height: 400px;
  }

  .gallery-items {
    overflow: scroll;
    display: flex;
    gap: 10px;
    height: 400px;
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

  @media only screen and (max-width: 600px) {
    .gallery {
      max-width: calc(100vw - 20px);
    }
  }
</style>
