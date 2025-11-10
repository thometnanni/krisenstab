<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
  <title>"krisenstab"</title>
  <meta
    name="description"
    content={"Berlin-based studio active in interaction design, data visualisation, software development and media design"}
  />
  <meta property="og:title" content="krisenstab" />
  <meta
    property="og:description"
    content="Berlin-based studio active in interaction design, data visualisation, software development and media design"
  />
  <meta property="og:image" content="https://krisenstab.net/og-image.png.png" />
  <meta property="og:url" content="https://krisenstab.net/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="krisenstab" />
  <meta
    name="twitter:description"
    content="Berlin-based studio active in interaction design, data visualisation, software development and media design"
  />
  <meta
    name="twitter:image"
    content="https://krisenstab.net/og-image.png.png"
  />
</svelte:head>

<Header />
<article>
  <section>
    <slot />
  </section>
</article>
