<script>
  import { onMount, onDestroy } from "svelte";

  export let arenaChannelSlug = "tables-gdt5rzhdcii";

  let slides = [];
  let current = 0;
  let currentSlide = null;
  let intervalId;

  async function fetchArena(slug) {
    const res = await fetch(`https://api.are.na/v2/channels/${slug}?per=100`);
    const data = await res.json();
    return (data.contents || [])
      .filter((b) => b.class === "Image" && b.image)
      .map((b) => ({
        src:
          b.image?.thumb?.url ||
          b.image?.display?.url ||
          b.image?.original?.url,
        href: b.permalink || `https://www.are.na/block/${b.id}`,
        alt: b.title || b.image?.filename || "Are.na image",
      }))
      .filter(Boolean);
  }

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  function startSlideshow() {
    clearInterval(intervalId);
    current = 0;
    if (!slides.length) return;
    currentSlide = slides[0];
    intervalId = setInterval(() => {
      current = (current + 1) % slides.length;
      currentSlide = slides[current];
    }, 200);
  }

  onMount(async () => {
    slides = shuffle(await fetchArena(arenaChannelSlug));
    startSlideshow();
  });

  onDestroy(() => clearInterval(intervalId));
</script>

<main>
  {#if currentSlide}
    <a href={currentSlide.href} target="_blank" rel="noopener">
      <img src={currentSlide.src} alt={currentSlide.alt} class="slideshow" />
    </a>
  {/if}
</main>

<style>
  main {
    margin: 60px auto;
    width: auto;
    height: 120px;
  }
  .slideshow {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  @media (max-width: 800px) {
    .slideshow {
      margin: 20px auto;
    }
  }
</style>
