<script>
  import { onMount, onDestroy } from "svelte";
  export let data = [];
  export let activeFilter;

  let tables = [];
  let slideshow = [];
  let current = 0;
  let currentImage;
  let intervalId;

  onMount(async () => {
    tables = await (await fetch("../tables.json")).json();
    setupSlideshow();
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  $: if (data || activeFilter || tables) {
    setupSlideshow();
  }

  function setupSlideshow() {
    clearInterval(intervalId);
    current = 0;
    let filteredImages = [];
    if (activeFilter) {
      const filteredItems = data.filter(
        (item) =>
          (item.id && item.id.includes(activeFilter)) ||
          (item.domain && item.domain.includes(activeFilter)) ||
          (item.media && item.media.includes(activeFilter)) ||
          (item.authors && item.authors.includes(activeFilter))
      );
      filteredImages = filteredItems.flatMap((item) =>
        (item.images || []).map((img) => "/media/" + img)
      );
    }

    if (filteredImages.length > 0) {
      slideshow = filteredImages;
    } else {
      slideshow = tables;
    }

    if (slideshow.length > 0) {
      currentImage = slideshow[0];
      intervalId = setInterval(() => {
        current = (current + 1) % slideshow.length;
        currentImage = slideshow[current];
      }, 200);
    } else {
      currentImage = null;
    }
  }
</script>

<main>
  {#if currentImage}
    <img
      class:table={!activeFilter}
      src={currentImage}
      alt="Slideshow image"
      class="slideshow"
    />
  {/if}
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    max-width: 1440px;
    align-items: center;
    height: 300px;
    margin: 10px 0 100px;
    background-color: white;
    text-align: center;
  }

  .slideshow:not(.table) {
    filter: grayscale(100%);
  }

  .slideshow {
    margin-top: 100px;
    max-width: 20%;
    width: auto;
    height: 300px;
    object-fit: contain;
    margin-left: calc((var(--col1)) * -1);
    /* image-rendering: pixelated; */
    /* filter: grayscale(100%);
    image-rendering: pixelated; */
  }

  @media only screen and (max-width: 800px) {
    .slideshow {
      margin-left: 0;
      max-width: 50%;
    }
  }
</style>
