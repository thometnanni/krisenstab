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

{#if html}
  <main>
    <Tables />
    <article class="markdown">
      <Intro />
      {@html html}
    </article>
    <Impressum />
  </main>
{/if}

<style>
  main {
    max-width: 900px;
  }

  .markdown {
    /* max-width: 750px; */
    padding: 10px;
    margin: 0 auto;
  }
</style>
