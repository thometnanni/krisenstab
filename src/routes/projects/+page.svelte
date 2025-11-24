<script>
  import LazyImage from "$lib/components/LazyImage.svelte";
  export let data;
  const projects = data.projects || [];
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

<svelte:head>
  <title>krisenstab</title>
  <meta
    name="description"
    content="Design studio active in interaction
    design, data visualisation, software development and media design"
  />
  <meta property="og:title" content="krisenstab" />
  <meta
    property="og:description"
    content="Design studio active in interaction design, data visualisation, software development and media design"
  />
  <meta property="og:image" content="https://krisenstab.net/og-image.png" />
  <meta property="og:url" content="https://krisenstab.net/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="krisenstab" />
  <meta
    name="twitter:description"
    content="Design studio active in interaction design, data visualisation, software development and media design"
  />
  <meta name="twitter:image" content="https://krisenstab.net/og-image.png" />
</svelte:head>

<main class="mx-auto max-w-screen-3xl mt-2 px-3 text-black text-balance">
  <div class="p-container space-y-2">
    {#each projects as p (p.slug)}
      <div class="border-b border-gray-200 mb-2">
        {#if p.media?.length > 0 || p.summaryHtml}
          <div class="flex overflow-x-auto gap-2 py-3 no-scrollbar">
            <div
              class="sticky left-0 top-0 z-0 flex-shrink-0 max-w-[300px] h-auto text-sm md:max-w-[350px] md:text-base"
            >
              <div class="space-y-3">
                <div class="grid grid-cols-[auto,1fr] text-left">
                  <time
                    class="text-gray-500 text-sm [font-variant-numeric:tabular-nums]"
                    >{formatDate(p.date)}</time
                  >
                  <div class="text-black overflow-hidden">
                    <a
                      href={`/projects/${p.slug}`}
                      class="text-2xl leading-.50em] break-words hover:underline"
                      >{p.title}</a
                    >
                  </div>
                </div>
                <div
                  class:opacity-0={!p.summaryHtml}
                  class="content text-[0.9rem] leading-[1.2rem] text-wrap"
                >
                  {@html p.summaryHtml || ""}
                </div>
              </div>
            </div>

            {#if p.media?.length > 0}
              {#each p.media as m}
                <LazyImage
                  src={m}
                  alt=""
                  fallbackColor="#f3f3f3"
                  wrapperClass="h-[340px] flex-shrink-0 rounded"
                  imgClass="h-full w-full object-cover"
                />
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</main>

<style>
  :global(.p-container p) {
    margin-bottom: 1em;
  }

  @reference "tailwindcss";
  .no-scrollbar {
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
