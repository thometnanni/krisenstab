<script>
  export let data;
</script>

<article class="project">
  <div>
    {@html data?.text}
  </div>
</article>

<style>
  :global(.project a) {
    text-decoration: underline;
    /* max-height: 100vh;
        overflow: scroll; */
  }

  article {
    max-width: 1200px;
  }

  :global(img),
  :global(video) {
    width: 100%;
  }
</style>
