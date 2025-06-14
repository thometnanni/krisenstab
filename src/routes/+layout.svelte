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
</script>

<article>
  {#if lastUpdated}
    <div class="meta">
      <div class="time" style="margin-bottom: 1rem;">
        <p>Last updated</p>
        <p>{lastUpdated}</p>
      </div>
    </div>

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
    max-width: 1920px;
  }

  article > .meta {
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

  @media only screen and (max-width: 800px) {
    .meta {
      flex-direction: row-reverse;
      text-align: right;
    }
  }

  .time {
    padding: 5px 10px;

    font-size: 0.6em;
    line-height: 0.9em;

    font-size: 0.75rem;
    opacity: 0.6;
    line-height: 1.2;
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

  p {
    margin: 0;
    margin-bottom: 1ex;
    font-weight: normal;
    color: black;
  }

  @media (max-width: 800px) {
    article {
      flex-direction: column;
      padding: 10px;
    }

    .meta {
      margin-bottom: 1rem;
    }

    section {
      max-width: 100%;
      overflow: visible;
      max-height: none;
    }
  }
</style>
