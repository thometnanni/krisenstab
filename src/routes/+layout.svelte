<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
</script>

<Header />
<article>
  <section>
    <slot />
  </section>
</article>
