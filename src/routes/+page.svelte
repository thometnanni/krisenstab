<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import Tables from "$lib/components/Tables.svelte";
  import Intro from "$lib/components/Intro.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import Cheers from "$lib/components/Cheers.svelte";
  import Impressum from "$lib/components/Impressum.svelte";

  let data = [];
  let clickedFilter = null;
  let hoveredFilter = null;
  $: activeFilter = clickedFilter ?? hoveredFilter;

  let effectiveItems = new Set();
  $: {
    if (activeFilter) {
      const lockedElem = document.getElementById(activeFilter);
      if (!lockedElem) {
        effectiveItems = new Set();
      } else {
        const dataRelated = lockedElem.getAttribute("data-related") ?? "";
        const related = dataRelated.trim() ? dataRelated.split(/\s+/) : [];
        effectiveItems = new Set([lockedElem.id, ...related]);
      }
    } else {
      effectiveItems = new Set();
    }
  }

  $: fading = activeFilter !== null;

  function handleFilterClick({ detail }) {
    const filterId = detail.filterId;
    if (!filterId) return;
    clickedFilter = clickedFilter === filterId ? null : filterId;
    if (clickedFilter === null) hoveredFilter = null;
  }

  function handleHover(event) {
    if (clickedFilter) return;
    const originElem = event.detail.currentTarget;
    if (!originElem) return;
    hoveredFilter = originElem.id;
  }

  function handleOut() {
    if (clickedFilter) return;
    hoveredFilter = null;
  }

  function clearFilter() {
    clickedFilter = null;
    hoveredFilter = null;
  }

  onMount(async () => {
    data = await (await fetch("../projects.json")).json();
    const handleGlobalClick = () => {
      if (clickedFilter || hoveredFilter) clearFilter();
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  });
</script>

<article>
  <Tables {data} {activeFilter} />

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
    </div>

    <div class="container">
      <Cheers
        {data}
        {activeFilter}
        {effectiveItems}
        on:filterClick={handleFilterClick}
        on:hover={handleHover}
        on:out={handleOut}
      />
    </div>

    <Impressum />
  {/if}
</article>

<style>
  article {
  }
  .container {
    max-width: 1200px;
    overflow-y: auto;
    background-color: white;
  }
  @media only screen and (max-width: 800px) {
    article {
      margin-top: 0;
    }
  }
</style>
