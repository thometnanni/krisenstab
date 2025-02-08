<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import Intro from "$lib/components/Intro.svelte";
  import Gallery from "$lib/components/Gallery.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import Cheers from "$lib/components/Cheers.svelte";

  let data = [];
  let activeFilter = null;
  let hoveredItems = new Set();
  let effectiveItems = new Set();
  let fading = false;

  function handleFilterClick(event) {
    event.stopPropagation();
    const target = event.currentTarget || event.detail?.currentTarget;
    if (!target) return;
    const filterId = target.id;
    activeFilter = activeFilter === filterId ? null : filterId;
  }

  function handleHover(event) {
    if (activeFilter) return;
    const target = event.currentTarget;
    if (!target) return;
    const { id, related } = getElementData(target);
    hoveredItems = new Set([...related, id]);
  }

  function handleOut() {
    if (!activeFilter) {
      hoveredItems = new Set();
    }
  }

  function getElementData(elem) {
    if (!elem) return { id: "", related: [] };
    const dataRelated = elem.getAttribute("data-related") || "";
    const related = dataRelated.trim() ? dataRelated.trim().split(/\s+/) : [];
    return { id: elem.id, related };
  }

  $: {
    if (activeFilter) {
      const lockedElem =
        typeof document !== "undefined"
          ? document.getElementById(activeFilter)
          : null;
      if (!lockedElem) {
        effectiveItems = new Set();
      } else {
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

  onMount(async () => {
    const response = await fetch("projects.json");
    data = await response.json();
    const handleGlobalClick = () => {
      if (activeFilter) clearFilter();
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  });
</script>

{#if data.length > 0}
  <div class="container">
    <Intro
      {data}
      {activeFilter}
      {fading}
      {effectiveItems}
      on:filterClick={handleFilterClick}
      on:hover={handleHover}
      on:out={handleOut}
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
      on:hover={handleHover}
      on:out={handleOut}
      {base}
    />
    <Cheers
      {data}
      {activeFilter}
      {effectiveItems}
      on:filterClick={handleFilterClick}
      on:hover={handleHover}
      on:out={handleOut}
    />
  </div>
{/if}

<style>
  .container {
    max-width: 840px;
    padding-top: 30px;
    overflow-y: auto;
  }
</style>
