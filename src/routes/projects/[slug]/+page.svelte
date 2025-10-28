<script>
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
</script>

{#if post}
  <main class="mx-auto max-w-[1920px] px-[5px] text-black">
    <div>
      <div class="grid grid-cols-[auto,1fr] gap-[5px] text-left pb-5">
        <time
          class="text-[#777] text-base leading-[1em] [font-variant-numeric:tabular-nums]"
          >{formatDate(post.date)}</time
        >
        <div class="text-black text-3xl leading-[1em]">
          {post.title}
        </div>
      </div>
      <div class="w-full max-w-[840px] text-xl leading-[1.2em]">
        <article class="content">{@html post.detailHtml}</article>
      </div>
    </div>
  </main>
{:else}
  <main class="mx-auto max-w-[1920px] px-[5px]"><p>Not found</p></main>
{/if}

<style>
  @reference "tailwindcss";
  :global(.content img) {
    @apply block w-full h-auto rounded my-2;
    @apply mt-20 mb-10;
  }
  :global(.content h1),
  :global(.content h2),
  :global(.content h3) {
    @apply leading-[1.1] my-1;
  }
  :global(.content p) {
    @apply my-2;
  }
  :global(.content a) {
    @apply underline;
  }
</style>
