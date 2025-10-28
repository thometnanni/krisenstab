<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  let lastUpdated = "";
  onMount(async () => {
    try {
      const r = await fetch(`${base}/lastUpdated.json`);
      if (r.ok) {
        const j = await r.json();
        lastUpdated = j.lastUpdated || "";
      }
    } catch (e) {}
  });
</script>

{#if lastUpdated}
  <footer class="mx-5 mt-20 text-right text-[0.75rem] leading-[1.2] opacity-60">
    <p>Last updated<br />{lastUpdated}<br /><br />Thomet & Nanni GbR</p>
  </footer>
{/if}
