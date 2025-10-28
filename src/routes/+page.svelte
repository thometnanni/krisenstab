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
  <main class="max-w-[960px] m-auto">
    <Tables />
    <article class="markdown p-10 m-auto">
      <Intro />
      {@html html}
    </article>
    <Impressum />
  </main>
{/if}
