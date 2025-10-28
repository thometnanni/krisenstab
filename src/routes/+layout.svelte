<script>
  import "../app.css";

  import Header from "$lib/components/Header.svelte";
</script>

<Header />

<article>
  <!-- <aside class="meta">
    <div class="time">
      <a href="/" class="krisenstab-logo">Krisenstab</a>
    </div>

    <div class="time">
      <a href="/projects">Projects</a><br />
    </div>
  </aside> -->

  <section>
    <slot />
  </section>
</article>

<style>
  article {
    /* display: flex;
    gap: 10px; */
    max-width: 1920px;
    overflow: visible;
  }

  section {
    /* max-width: 960px; */
    padding: 10px;
    margin: 0 auto;
    overflow: visible;
    max-height: none;
  }

  p {
    margin: 0 0 1ex 0;
    font-weight: normal;
    color: #000;
  }

  @media (max-width: 800px) {
    article {
      flex-direction: column;
      padding: 5px;
    }

    .meta {
      position: static;
      width: 100%;
      max-width: none;
      min-height: auto;
      border-right: none;
      margin-bottom: 50px;
    }

    .time {
      padding: 0;
    }
    section {
      max-width: 100%;
    }
  }
</style>
