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
    <div class="col info">info</div>
  </div>

  <div class="rows">
    {#each sorted as p (p.title)}
      <div class="row">
        <time class="col time">{formatDate(p.date)}</time>
        <div class="col project">{p.title}</div>
        <div class="col link">
          {#if Array.isArray(p.urls) && p.urls.length > 0}
            {#each p.urls as url, i}
              <a href={url} target="_blank" rel="noopener">Link {i + 1}</a>{i <
              p.urls.length - 1
                ? ", "
                : ""}
            {/each}
          {:else}
            —
          {/if}
        </div>
        <div class="col info">{p.info || "—"}</div>
        {#if p.media?.length > 0}
          <div class="media">
            {#each p.media as m}
              <img src={m} alt="" />
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</main>

<style>
  .archive {
    --time-col: 140px;
    --link-col: 120px;
    --info-col: 160px;
    font-size: 1rem;
    line-height: 1.2rem;
  }

  .row {
    display: grid;
    grid-template-columns: var(--time-col) 1fr var(--link-col) var(--info-col);
    gap: 5px;
    align-items: start;
    text-align: left;
    padding: 2px;
    border-bottom: 1px solid #eee;
  }

  .row.header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    padding: 2px;
    border-bottom: 1px solid #ddd;
    text-transform: lowercase;
  }

  .row.header > * {
    word-break: break-word;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .rows > .row:nth-child(odd),
  .rows > .media:nth-child(odd) {
    background: #fff;
  }
  .rows .row:nth-child(even),
  .rows > .media:nth-child(even) {
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
  .col.link,
  .col.info {
    color: #000;
  }

  .row:not(.header) .col.link,
  .row:not(.header) .col.info,
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
    margin-bottom: 20px;
    box-sizing: border-box;
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
      font-size: 0.75rem;
      line-height: 1.1rem;
      width: 100%;
    }

    .row .media {
      grid-column: 1 / -1;
      /* display: block; */
      width: 100%;
      margin-top: 8px;
      margin-bottom: 20px;
      overflow-x: auto;
    }

    .col {
      min-width: 0;
    }
  }

  @media (max-width: 764px) {
    /* .row.header {
      display: none;
    } */

    .col.info {
      display: none;
    }

    .row.header ~ * {
      border-top: 1px solid #eee;
    }

    /* .row {
      display: grid;
      grid-template-columns: 90px 1fr;
      grid-template-areas:
        "time project"
        "link info";
      gap: 5px;
      align-items: start;
      width: 100%;
      padding: 5px;
    } */

    /* .col {
      min-width: 0;
    } */
    /* 
    .col.time {
      grid-area: time;
      white-space: nowrap;
      color: #777;
      font-variant-numeric: tabular-nums;
    }
    .col.project {
      grid-area: project;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .col.link {
      grid-area: link;
    }
    .col.info {
      grid-area: info;
    } */
  }
</style>
