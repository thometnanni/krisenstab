<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let lastUpdated = "";

  onMount(async () => {
    try {
      const response = await fetch(`${base}/lastUpdated.json`);
      if (response.ok) {
        const data = await response.json();
        lastUpdated = data.lastUpdated;
        console.log("Last Updated:", lastUpdated);
      } else {
        console.error("Failed to fetch lastUpdated.json:", response.status);
      }
    } catch (error) {
      console.error("Error fetching lastUpdated.json:", error);
    }
  });

  function isWeekend() {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  function isEvening() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 9;
  }

  function isWeekendEvening() {
    return isWeekend() && isEvening();
  }

  function isWorkTime() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekday = day >= 1 && day <= 5;
    return isWeekday && hour >= 9 && hour < 18;
  }
</script>

<article>
  {#if lastUpdated}
    <a href="/">
      <div class="meta">
        <div class="time" style="margin-bottom: 1rem;">
          <p>Last Updated:</p>
          <p>{lastUpdated}</p>
        </div>
        <div class="title">
          {#if isWeekendEvening()}
            <img src="/tables/krisenstab_leisure_drink.svg" alt="Leisure Drink" />
          {:else if isWorkTime()}
            <img src="/tables/krisenstab_work.svg" alt="Work" />
          {:else}
            <img src="/tables/krisenstab_leisure.svg" alt="Leisure" />
          {/if}
        </div>
      </div>
    </a>
    <section>
      <slot />
    </section>
  {/if}
</article>

<style>
  article {
    display: flex;
    gap: 10px;
    min-height: 100%;
  }

  article > a {
    flex: 0 0 var(--col1);
    display: block;
  }

  section {
    flex: 0 0 800px;
    overflow-x: visible;
    max-height: none;
    overflow: hidden;
  }

  .meta {
    display: flex;
    font-size: 14px;
    line-height: 14px;
    align-items: flex-end;
    flex-wrap: wrap;
    align-content: space-between;
    position: sticky;
    top: 0;
    height: 100%;
    max-height: 100vh;
    width: 100%;
  }

  @media only screen and (max-width: 600px) {
    .meta {
      flex-direction: row-reverse;
      text-align: right;
    }
  }

  .title {
    display: flex;
    justify-content: space-between;
    margin: 10px;
    width: 100%;
  }

  .title img {
    width: 100%;
  }

  .time {
    padding: 5px 10px;
  }

  .time p {
    padding: 0;
    margin-bottom: 0;
  }

  section {
    flex: 1;
    overflow: visible;
    max-height: none;
  }

  :global(h1),
  :global(p) {
    margin: 0;
    margin-bottom: 1ex;
    font-weight: normal;
    color: black;
  }

  :global(h1) {
    font-size: 1.2em;
    margin-bottom: 0.5ex;
  }

  :global(a) {
    text-decoration: none;
    color: inherit;
    position: relative;
    cursor: pointer;
  }

  :global(::selection) {
    background-color: var(--color-1);
    color: black;
  }

  @font-face {
    font-family: Ronzino;
    src: url("/fonts/Ronzino-Regular.woff2");
    font-weight: normal;
  }

  @media (max-width: 600px) {
    article {
      flex-direction: column;
      padding: 10px;
    }

    article > a {
      flex: none;
      max-width: 100%;
    }

    .meta {
      margin-bottom: 1rem;
    }

    section {
      max-width: 100%;
      overflow: visible;
      max-height: none;
    }

    .title img {
      width: 50%;
      margin: 0 auto;
    }
  }
</style>
