<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import Tables from "$lib/components/Tables.svelte";
  import Intro from "$lib/components/Intro.svelte";
  import Impressum from "$lib/components/Impressum.svelte";

  let html = "";

  onMount(async () => {
    const res = await fetch("letter.md");
    const md = await res.text();
    html = marked.parse(md);
  });
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

{#if html}
  <main class="max-w-[860px] p-3 m-auto">
    <Tables />
    <article class="markdown m-auto text-2xl text-balance">
      <Intro />
      {@html html}
    </article>
    <Impressum />
  </main>
{/if}
