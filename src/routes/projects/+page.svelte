<script>
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

<main
  class="mx-auto max-w-screen-2xl px-3 text-black text-[1.4rem] leading-[1.4rem] text-balance"
>
  <div class="space-y-2">
    {#each projects as p (p.slug)}
      <div class="border-b border-gray-200 mb-2">
        <div class="grid grid-cols-[auto,1fr] gap-1 text-left pb-5">
          <time
            class="text-gray-500 text-sm [font-variant-numeric:tabular-nums]"
            >{formatDate(p.date)}</time
          >
          <div class="text-black overflow-hidden">
            <a href={`/projects/${p.slug}`} class="break-words hover:underline"
              >{p.title}</a
            >
          </div>
        </div>

        {#if p.media?.length > 0}
          <div class="flex overflow-x-auto snap-x snap-mandatory gap-1 py-1">
            {#each p.media as m}
              <img
                src={m}
                alt=""
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="h-60 object-cover rounded"
              />
            {/each}
          </div>
        {/if}

        <div class="w-full max-w-[840px] py-2 pb-5 text-base leading-[1.2rem]">
          <div class="content">{@html p.summaryHtml}</div>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  @reference "tailwindcss";
</style>
