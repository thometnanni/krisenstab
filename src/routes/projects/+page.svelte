<script>
  import { projects } from "$lib/projects.js";

  const norm = (s = "") => s.trim().toLowerCase().replace(/[–—−]/g, "-");

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
      b.end - a.end ||
      (a.title || "").localeCompare(b.title || "", "en", {
        sensitivity: "base",
      })
    );
  });

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    if (/^\d{4}(-\d{4})?$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    return isNaN(d)
      ? dateStr
      : new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(d);
  }
</script>

<main class="archive">
  <div class="rows">
    {#each sorted as p (p.title)}
      <div>
        <div class="row">
          <time class="col time">{formatDate(p.date)}</time>
          <div class="col project">{p.title}</div>
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
          <div>
            {p.info}
          </div>
          <div class="col link">
            {#if Array.isArray(p.urls) && p.urls.length > 0}
              {#each p.urls as url, i}
                <a href={url} target="_blank" rel="noopener">
                  Link{p.urls.length > 1 ? ` ${i + 1}` : ""}
                </a>{i < p.urls.length - 1 ? ", " : ""}
              {/each}
            {/if}
          </div>
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
    gap: 5px;
    align-items: start;
    text-align: left;
    padding-bottom: 20px;
  }

  .link {
    font-size: 1rem;
    padding: 10px 0;
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

  .col.project,
  .col.link {
    color: #000;
  }

  .media {
    /* width: calc(100vw - 120px); */
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 5px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
    padding: 5px 0;
    box-sizing: border-box;
  }

  .info {
    width: 100%;
    max-width: 840px;
    padding: 8px 0 20px 0;

    color: #000;
    font-size: 1rem;
    line-height: 1.2rem;
  }

  img {
    height: 240px;
    object-fit: cover;
    scroll-snap-align: start;
    border-radius: 3px;
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
