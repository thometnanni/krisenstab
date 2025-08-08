<script>
  import { onMount, onDestroy } from "svelte";

  let tables = [];
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

  $: if (tables) {
    setupSlideshow();
  }

  function setupSlideshow() {
    clearInterval(intervalId);
    current = 0;

    if (tables.length > 0) {
      currentImage = tables[0];
      intervalId = setInterval(() => {
        current = (current + 1) % tables.length;
        currentImage = tables[current];
      }, 200);
    } else {
      currentImage = null;
    }
  }
</script>

{#if currentImage}
  <img src={currentImage} alt="Slideshow image" class="table slideshow" />
{/if}

<style>
  .slideshow {
    display: block;
    margin: 60px auto;
    width: auto;
    height: 120px;
    object-fit: contain;
  }
  @media (max-width: 800px) {
    .slideshow {
      margin: 20px auto;
    }
  }
</style>
