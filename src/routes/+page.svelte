<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import Intro from "$lib/components/Intro.svelte";
  import Gallery from "$lib/components/Gallery.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import Cheers from "$lib/components/Cheers.svelte";
  import Impressum from "$lib/components/Impressum.svelte";

  let data = [];
  let activeFilter = null;
  let hoveredItems = new Set();
  let effectiveItems = new Set();
  let fading = false;

  function handleFilterClick({ detail }) {
    const filterId = detail.filterId;
    if (!filterId) return;
    activeFilter = activeFilter === filterId ? null : filterId;
  }

  function handleHover(event) {
    if (activeFilter) return;
    const { id, related } = getElementData(event.currentTarget);
    hoveredItems = new Set([...related, id]);
  }

  function handleOut() {
    if (!activeFilter) hoveredItems = new Set();
  }

  function getElementData(elem) {
    const dataRelated = elem?.getAttribute("data-related") ?? "";
    const related = dataRelated.trim() ? dataRelated.split(/\s+/) : [];
    return { id: elem.id, related };
  }

  $: {
    if (activeFilter) {
      const lockedElem = document.getElementById(activeFilter);
      if (!lockedElem) effectiveItems = new Set();
      else {
        const { id, related } = getElementData(lockedElem);
        effectiveItems = new Set([...related, id]);
      }
    } else {
      effectiveItems = hoveredItems;
    }
  }

  $: fading = activeFilter !== null || hoveredItems.size > 0;

  function clearFilter() {
    activeFilter = null;
  }

  $: console.log("activeFilter", activeFilter);

  onMount(async () => {
    data = await (await fetch("projects.json")).json();
    const handleGlobalClick = () => {
      if (activeFilter) clearFilter();
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  });
</script>

<article>
  {#if data.length > 0}
    <div class="container">
      <Intro
        {data}
        {activeFilter}
        {fading}
        {effectiveItems}
        on:filterClick={handleFilterClick}
      />
    </div>

    <Gallery {data} {activeFilter} />

    <div class="container">
      <ProjectList
        {data}
        {activeFilter}
        {fading}
        {effectiveItems}
        on:filterClick={handleFilterClick}
        {base}
      />
      <Cheers
        {data}
        {activeFilter}
        {effectiveItems}
        on:filterClick={handleFilterClick}
      />
    </div>
    <Impressum />
  {/if}
</article>

<style>
  article {
    margin-top: 50px;
  }
  
  .container {
    max-width: 840px;
    padding-top: 30px;
    overflow-y: auto;
  }
</style>
