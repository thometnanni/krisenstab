<script>
  export let data;
  const post = data.post;
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

{#if post}
  <main class="archive">
    <div class="rows">
      <div>
        <div class="row">
          <time class="col time">{formatDate(post.date)}</time>
          <div class="col project">{post.title}</div>
        </div>
        <div class="info">
          <article class="content">{@html post.detailHtml}</article>
        </div>
      </div>
    </div>
  </main>
{:else}
  <main class="archive"><p>Not found</p></main>
{/if}

<style>
  .archive {
    font-size: 1.4rem;
    line-height: 1.6rem;
    padding: 5px;
  }

  .row {
    gap: 5px;
    align-items: start;
    text-align: left;
    padding-bottom: 20px;
  }

  .col {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .row .col.time {
    color: #777;
    font-size: .875em;
    line-height: 1em;

    font-variant-numeric: tabular-nums;
  }

  .col.project {
    color: #000;
    font-size: 1.4em;
    line-height: 1em;
  }

  .info {
    width: 100%;
    max-width: 840px;
    color: #000;
    font-size: 1em;
    line-height: 1.2em;
  }

  :global(.content img) {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 3px;
    margin: 8px 0;
  }

  @media (max-width: 800px) {
    .archive {
      font-size: 1rem;
      /* line-height: 1.1rem; */
      padding: 5px;
    }
  }
</style>
