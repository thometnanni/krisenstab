<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";

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

{#if lastUpdated}
  <footer>
    <p class="tiny">
      Last updated <br />
      {lastUpdated}
      <br /><br />
      Thomet & Nanni GbR
    </p>
  </footer>
{/if}

<style>
  .tiny {
    margin: 20px;
    margin-top: 80px;
    text-align: right;
    font-size: 0.6em;
    line-height: 0.9em;

    font-size: 0.75rem;
    opacity: 0.6;
    line-height: 1.2;
  }
</style>
