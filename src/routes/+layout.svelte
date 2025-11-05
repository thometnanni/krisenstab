<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  export let data;
</script>

<svelte:head>
  <title>{data.seo?.title || "krisenstab"}</title>
</svelte:head>

<Header />
<article>
  <section>
    <slot />
  </section>
</article>
