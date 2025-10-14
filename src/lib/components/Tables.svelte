<script>
  import { onMount, onDestroy } from "svelte";

  export let arenaChannelSlug = "tables-gdt5rzhdcii";

  let slides = [];
  let current = 0;
  let currentSlide = null;
  let intervalId;

  async function fetchArena(slug, per = 100) {
    async function fetchPage(page) {
      const url = `https://api.are.na/v2/channels/${slug}?per=${per}&page=${page}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Are.na request failed: ${res.status}`);
      return res.json();
    }

    const first = await fetchPage(1);
    const totalBlocks = first.length ?? first.contents?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalBlocks / per));

    const pages = [first];
    for (let p = 2; p <= totalPages; p++) pages.push(await fetchPage(p));

    const allBlocks = pages.flatMap((p) => p.contents || []);

    console.log(allBlocks);

    const items = allBlocks
      .filter((b) => b.class === "Image" && b.image)
      .map((b) => {
        const src =
          b.image?.thumb?.url ||
          b.image?.display?.url ||
          b.image?.original?.url ||
          null;

        const href =
          b.permalink || (b.id ? `https://www.are.na/block/${b.id}` : null);

        const alt = b.title || b.image?.filename || "Are.na image";

        return src && href ? { src, href, alt } : null;
      })
      .filter(Boolean);

    return items;
  }

  function setupSlideshow() {
    clearInterval(intervalId);
    current = 0;

    if (slides.length > 0) {
      currentSlide = slides[0];
      intervalId = setInterval(() => {
        current = (current + 1) % slides.length;
        currentSlide = slides[current];
      }, 200);
    } else {
      currentSlide = null;
    }
  }

  onMount(async () => {
    slides = await fetchArena(arenaChannelSlug);
    setupSlideshow();
  });

  onDestroy(() => clearInterval(intervalId));
</script>

<main>
  {#if currentSlide}
    <a href={currentSlide.href} target="_blank" rel="noopener">
      <img
        src={currentSlide.src}
        alt={currentSlide.alt}
        class="table slideshow"
      />
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
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  @media (max-width: 800px) {
    .slideshow {
      margin: 20px auto;
    }
  }
</style>
