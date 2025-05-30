<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let data = [];
  export let activeFilter;
  export let fading;
  export let effectiveItems;
  export let base;
  const handleClick = (e) => {
    e.stopPropagation();
    // dispatch("filterClick", e);
  };
  const handleHover = (e) => dispatch("hover", e);
  const handleOut = (e) => dispatch("out", e);
</script>

<section
  class="project-list"
  class:fading
  class:filter-active={activeFilter !== null}
>
  <p>
    <span class="static">Before forming Krisenstab, we</span>
    {#each data as project, i (project.id)}
      <a
        href={project.link.includes("http")
          ? project.link
          : `${base}/${project.link}`}
        id={project.id}
        class="project"
        data-related={[
          ...project.domain,
          ...project.media,
          ...project.authors,
        ].join(" ")}
        target={project.link.includes("http") ? "_blank" : "_self"}
        on:click|stopPropagation={handleClick}
        on:mouseover={handleHover}
        on:mouseout={handleOut}
        class:highlighted={effectiveItems.has(project.id)}
      >{project.text}</a><span class="static">{i < data.length - 1 ? ", " : "."}</span>
    {/each}
  </p>
</section>

<style>
  .project {
    cursor: pointer;
    color: var(--highlight, rgb(200, 200, 200));
  }
  .project:hover {
    color: black;
  }
  .highlighted {
    color: black;
  }


  .project-list.fading .project {
    color: var(--faded-color);
    pointer-events: none;
  }
  .project-list.fading .project.highlighted {
    color: black;
    pointer-events: auto;
    cursor: pointer;
  }
  .static {
    color: black;
  }
</style>
