<script>
  import LazyImage from "$lib/components/LazyImage.svelte";
  import Gallery from "$lib/components/Gallery.svelte";
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
    content="We are a design studio working at the intersection of technology, journalism and culture."
  />
  <meta property="og:title" content="krisenstab" />
  <meta
    property="og:description"
    content="We are a design studio working at the intersection of technology, journalism and culture."
  />
  <meta property="og:image" content="https://krisenstab.net/og-image.png" />
  <meta property="og:url" content="https://krisenstab.net/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="krisenstab" />
  <meta
    name="twitter:description"
    content="We are a design studio working at the intersection of technology, journalism and culture."
  />
  <meta name="twitter:image" content="https://krisenstab.net/og-image.png" />
</svelte:head>

<main class="mx-auto max-w-screen-3xl mt-2 px-3 text-black text-balance">
  <div class="p-container space-y-2">
    {#each projects as p (p.slug)}
      <div class="border-b border-gray-200 mb-2">
        {#if p.media?.length > 0 || p.summaryHtml}
          <a href={`/projects/${p.slug}`} class="block">
            <Gallery>
              <div
                class="flex-shrink-0 max-w-[300px] h-auto text-sm md:max-w-[350px] md:text-base"
              >
                <div class="space-y-3">
                  <div class="grid grid-cols-[auto,1fr] text-left">
                    <time
                      class="text-gray-500 text-sm [font-variant-numeric:tabular-nums]"
                      >{formatDate(p.date)}</time
                    >
                    <div class="text-black overflow-hidden">
                      <div class="text-xl leading-[1.1]  break-words">
                        {p.title}
                      </div>
                    </div>
                  </div>
                  <div
                    class:opacity-0={!p.summaryHtml}
                    class="content text-xl leading-[1.2] text-wrap"
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
            </Gallery>
          </a>
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
</style>
