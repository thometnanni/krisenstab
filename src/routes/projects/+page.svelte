<script>
  import { projects } from "$lib/projects.js";

  function timeKey(dateStr) {
    if (!dateStr) return -Infinity;
    if (/^\d{4}$/.test(dateStr)) return Number(dateStr);
    const m = dateStr.match(/^(\d{4})-(\d{4})$/);
    if (m) return Number(m[2]);
    const d = new Date(dateStr);
    return isNaN(d) ? -Infinity : d.getTime();
  }

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

  const sorted = [...projects].sort((a, b) => {
    const ta = timeKey(a.date);
    const tb = timeKey(b.date);
    if (tb !== ta) return tb - ta;
    return (a.title || "").localeCompare(b.title || "", "en", {
      sensitivity: "base",
    });
  });
</script>

<main class="archive">
  <div class="row header">
    <div class="col time">time <span class="small">↓</span></div>
    <div class="col project">project</div>
    <div class="col link">links</div>
  </div>

  <div class="rows">
    {#each sorted as p (p.title)}
      <div>
        <div class="row">
          <time class="col time">{formatDate(p.date)}</time>
          <div class="col project">{p.title}</div>
          <div class="col link">
            {#if Array.isArray(p.urls) && p.urls.length > 0}
              {#each p.urls as url, i}
                <a href={url} target="_blank" rel="noopener">Link {i + 1}</a
                >{i < p.urls.length - 1 ? ", " : ""}
              {/each}
            {:else}
              —
            {/if}
          </div>
        </div>
        {#if p.media?.length > 0}
          <div class="media">
            {#each p.media as m}
              <img src={m} alt="" />
            {/each}
          </div>
        {/if}
        <div class="info-block">{p.info || "—"}</div>
      </div>
    {/each}
  </div>
</main>

<style>
  .archive {
    --time-col: 180px;
    --link-col: 120px;
    --info-col: 160px;
    font-size: 1.4rem;
    line-height: 1.4rem;
  }

  .row {
    display: grid;
    grid-template-columns: var(--time-col) 1fr var(--link-col) var(--info-col);
    gap: 5px;
    align-items: start;
    text-align: left;
    padding: 10px;
    padding-bottom: 20px;
  }

  .row.header {
    background: white;
    font-size: 1rem;
  }

  .row.header > * {
    word-break: break-word;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .rows > div:nth-child(odd) {
    background: #fff;
  }
  .rows > div:nth-child(even) {
    background: #f7f7f7;
  }

  .col {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .row:not(.header) .col.time {
    color: #777;
    font-variant-numeric: tabular-nums;
  }

  .col.project,
  .col.link {
    color: #000;
  }

  .row:not(.header) .col.link,
  .small {
    font-size: 1rem;
    align-items: center;
  }

  .media {
    width: calc(100vw - 120px);
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 5px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
    padding: 5px 0;
    box-sizing: border-box;
  }

  .info-block {
    width: 100%;
    padding: 8px 0 20px 0;
    color: #000;
    font-size: 1rem;
    line-height: 1.2rem;
    border-bottom: 1px solid #eee;
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

    .row,
    .row.header {
      grid-template-columns:
        clamp(72px, 22vw, var(--time-col))
        minmax(160px, 1fr)
        clamp(120px, 42vw, var(--link-col))
        clamp(90px, 32vw, var(--info-col));
      gap: 4px;
      width: 100%;
    }

    .media,
    .info-block {
      width: 100%;
      font-size: 1rem;
      line-height: 1.1rem;
    }
    .col {
      min-width: 0;
    }
  }

  @media (max-width: 764px) {
    /* .row.header {
      display: none;
    } */

    .row.header ~ * {
      border-top: 1px solid #eee;
    }
  }
</style>
