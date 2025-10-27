<script>
  export let data;
  const projects = data.projects || [];

  const norm = (s) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[–—−]/g, "-");
  function parseDate(str = "") {
    const m = norm(str).match(/^(\d{4})(?:\s*-\s*(\d{4}|ongoing))?$/i);
    if (!m) return { start: -Infinity, end: -Infinity, ongoing: false };
    const start = +m[1];
    const ongoing = m[2]?.includes("ongoing") || false;
    const end = /^\d{4}$/.test(m[2]) ? +m[2] : ongoing ? Infinity : start;
    return { start, end, ongoing };
  }

  const sorted = [...projects].sort((a, b) => {
    const A = parseDate(a.date);
    const B = parseDate(b.date);
    if (B.start !== A.start) return B.start - A.start;
    if (A.ongoing !== B.ongoing) return A.ongoing ? -1 : 1;
    return (
      (B.end || 0) - (A.end || 0) ||
      (a.title || "").localeCompare(b.title || "", "en", {
        sensitivity: "base",
      })
    );
  });

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

<main class="archive">
  <div class="rows">
    {#each sorted as p (p.slug)}
      <div>
        <div class="row">
          <time class="col time">{formatDate(p.date)}</time>
          <div class="col project">
            <a href={`/projects/${p.slug}`}>{p.title}</a>
          </div>
        </div>

        {#if p.media?.length > 0}
          <div class="media">
            {#each p.media as m}
              <img
                src={m}
                alt=""
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />
            {/each}
          </div>
        {/if}

        <div class="info">
          <div class="content">{@html p.summaryHtml}</div>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  .archive {
    font-size: 1.4rem;
    line-height: 1.4rem;
    padding: 5px;
  }

  .rows > div {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }

  .row {
    text-align: left;
    padding-bottom: 20px;
  }

  .col {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .row .col.time {
    color: #777;
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
  }
  .col.project {
    color: #000;
  }

  .media {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 5px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
    padding: 5px 0;
    box-sizing: border-box;
  }
  .media img {
    height: 240px;
    object-fit: cover;
    scroll-snap-align: start;
    border-radius: 3px;
  }

  .info {
    width: 100%;
    max-width: 840px;
    padding: 8px 0 20px 0;
    color: #000;
    font-size: 1rem;
    line-height: 1.2rem;
  }
  
  :global(.content hr) {
    display: none;
  }
  :global(.content h1),
  :global(.content h2),
  :global(.content h3) {
    line-height: 1.1;
    margin: 0.2rem 0;
  }
  :global(.content p) {
    margin: 0 0 0.6rem 0;
  }
  :global(.content a) {
    text-decoration: underline;
  }

  @media (max-width: 1024px) {
    .archive {
      overflow-x: hidden;
    }

    .row {
      gap: 4px;
      width: 100%;
    }

    .media,
    .info {
      width: 100%;
      font-size: 1rem;
      line-height: 1.1rem;
    }
    .col {
      min-width: 0;
    }
  }
</style>
