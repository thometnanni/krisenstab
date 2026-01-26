<script>
  import { onMount } from "svelte";

  export let data;
  const post = data.post;

  const formatDate = (s) => {
    if (!s) return "—";
    if (/^\d{4}(-\d{4})?$/.test(s)) return s;
    const d = new Date(s);
    return isNaN(d)
      ? s
      : new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(d);
  };

  onMount(() => {
    // Find all gallery divs and add mouse movement
    const galleryDivs = document.querySelectorAll('[data-gallery="start"]');

    galleryDivs.forEach((outer) => {
      let mousemoveEnabled = true;
      let programmaticScroll = false;
      const margin = 30;

      function onMousemove(e) {
        if (!mousemoveEnabled) return;

        const outerElWidth = outer.getBoundingClientRect().width;
        const innerElWidth = outer.scrollWidth;

        if (innerElWidth <= outerElWidth) return;

        const outerRect = outer.getBoundingClientRect();
        const x = e.clientX - outerRect.left;
        const fraction = (x - margin) / (outerElWidth - margin * 2);
        const diff = innerElWidth - outerElWidth;

        programmaticScroll = true;
        outer.scrollTo({ left: diff * fraction, behavior: "instant" });
        requestAnimationFrame(() => (programmaticScroll = false));
      }

      function onMouseover() {
        mousemoveEnabled = true;
      }

      function onScroll() {
        if (!programmaticScroll) mousemoveEnabled = false;
      }

      outer.addEventListener("mousemove", onMousemove);
      outer.addEventListener("mouseenter", onMouseover);
      outer.addEventListener("scroll", onScroll);
    });
  });
</script>

<svelte:head>
  <title>{data.seo.title}</title>
  <meta name="description" content={data.seo.description} />
  <meta property="og:title" content={data.seo.title} />
  <meta property="og:description" content={data.seo.description} />
  <meta property="og:image" content={data.seo.image} />
  <meta property="og:url" content={data.seo.url} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.seo.title} />
  <meta name="twitter:description" content={data.seo.description} />
  <meta name="twitter:image" content={data.seo.image} />
</svelte:head>

{#if post}
  <main class="project mx-auto max-w-[1920px] p-3 text-black">
    <div>
      <div class="grid grid-cols-[auto,1fr] mt-3 gap-[5px] text-left mb-[250px]">
        <time
          class="text-[#777] text-base leading-[1em] [font-variant-numeric:tabular-nums]"
          >{formatDate(post.date)}</time
        >
        <h1 class="text-black text-6xl leading-[1em] max-w-[640px]">
          {post.title}
        </h1>
      </div>
      <div class="w-full text-base sm:text-xl leading-[1.2em]">
        <article class="content">
          {@html post.detailHtml}
        </article>
      </div>
    </div>
  </main>
{:else}
  <main class="mx-auto max-w-[1920px] px-[5px]"><p>Not found</p></main>
{/if}

<style>
  @reference "tailwindcss";

  :global(.project .content [data-gallery="start"]) {
    @apply overflow-x-auto scroll-smooth flex gap-4 py-4 my-4;
    scrollbar-width: none;
  }

  :global(.project .content [data-gallery="start"]::-webkit-scrollbar) {
    display: none;
  }

  :global(.project .content [data-gallery="start"] img) {
    @apply rounded flex-shrink-0;
    height: 400px;
    width: auto;
    object-fit: contain;
  }

  :global(.project .content img) {
    @apply block w-full h-auto rounded;
    @apply mt-5 mb-4;
  }

  :global(.project .content p:has(> img:only-child):has(+ blockquote) > img) {
    @apply mb-1;
  }

  :global(.project .content h1),
  :global(.project .content h2),
  :global(.project .content h3) {
    @apply leading-[1.1] my-1 max-w-[840px];
  }

  :global(.project .content p) {
    @apply my-2 max-w-[840px];
  }

  :global(.project .content p:has(> img:only-child)) {
    @apply my-0 max-w-[840px];
  }

  :global(.project .content a) {
    @apply underline;
  }

  :global(.project .content blockquote) {
    @apply text-sm text-gray-500 max-w-[840px];
    @apply my-3;
  }

  :global(.project .content blockquote p) {
    @apply my-0 max-w-none;
  }

  :global(.project .content p:has(> img:only-child) + blockquote) {
    @apply mt-0;
  }
</style>
