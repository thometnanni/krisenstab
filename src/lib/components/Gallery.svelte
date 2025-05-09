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

  let landscapeMap = {};

  function markLandscape(e, src) {
    const img = e.target;
    landscapeMap[src] = img.naturalWidth > img.naturalHeight;
  }
</script>

<section class="gallery">
  <div class="gallery-items">
    {#each sorted as item (item.id)}
      {#each item.images as m}
        <div
          class="gallery-item {landscapeMap['/media/' + m] ? 'landscape' : ''}"
        >
          <img
            src={"/media/" + m}
            alt=""
            on:load={(e) => markLandscape(e, "/media/" + m)}
          />
        </div>
      {/each}
    {/each}
  </div>
</section>

<style>
  .gallery {
    width: 100vw;
    margin-left: calc((-1 * var(--col1) - 10px));
    height: 400px;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .gallery-items {
    overflow-x: auto;
    display: flex;
    gap: 5px;
    height: 100%;
    box-sizing: border-box;
  }

  .gallery-item {
    flex: 0 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gallery-item img {
    height: 100%;
    width: auto;
    object-fit: contain;
    display: block;
    filter: grayscale(100%);
  }

  .gallery-item.landscape {
    aspect-ratio: 3 / 2;
    overflow: hidden;
  }

  .gallery-item.landscape img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  img:hover {
    filter: grayscale(0%);
  }

  @media only screen and (max-width: 600px) {
    .gallery {
      width: 100vw;
      margin-left: 0;
    }
  }
</style>
