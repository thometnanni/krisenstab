<script>
  import { onMount, onDestroy } from "svelte";
  export let arenaChannelSlug = "tables-gdt5rzhdcii";
  let slides = [];
  let current = 0;
  let currentSlide = null;
  let intervalId;

  const fetchArena = async (slug) => {
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
  };
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
  const startSlideshow = () => {
    clearInterval(intervalId);
    current = 0;
    if (!slides.length) return;
    currentSlide = slides[0];
    intervalId = setInterval(() => {
      current = (current + 1) % slides.length;
      currentSlide = slides[current];
    }, 200);
  };
  onMount(async () => {
    slides = shuffle(await fetchArena(arenaChannelSlug));
    startSlideshow();
  });
  onDestroy(() => clearInterval(intervalId));
</script>

<main class="my-16 mx-auto w-auto h-[120px] px-2">
  {#if currentSlide}
    <a href={currentSlide.href} target="_blank" rel="noopener">
      <img src={currentSlide.src} class="w-full h-full object-contain block" />
    </a>
  {/if}
</main>
