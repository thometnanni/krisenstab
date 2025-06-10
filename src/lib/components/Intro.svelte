<!-- Intro.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let data = [];
  export let activeFilter;
  export let fading;
  export let effectiveItems;

  let greetingMessage =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  const handleClick = (e) =>
    dispatch("filterClick", { filterId: e.currentTarget.id });
  const handleHover = (e) => dispatch("hover", e);
  const handleOut = () => dispatch("out");

  const categories = ["technology", "journalism", "culture"];
  const mediaTypes = ["websites", "spatial-installations", "printed-matters"];
</script>

<section class="intro" class:fading class:filter-active={activeFilter !== null}>
  <p>{greetingMessage},</p>
  <p>
    We are a design studio working at the intersection of
    {#each categories as category, i}
      <button
        class="interactive"
        id={category}
        data-related={data
          .filter((d) => d.domain.includes(category))
          .map((d) => `${d.id} ${d.authors.join(" ")}`)
          .join(" ")}
        class:active={activeFilter === category}
        on:click|stopPropagation={handleClick}
        on:mouseover={handleHover}
        on:mouseout={handleOut}
        class:highlighted={effectiveItems.has(category)}>{category}</button
      >{i < categories.length - 1
        ? i === categories.length - 2
          ? " and "
          : ", "
        : "."}
    {/each}
    <br />
    By writing software, building tools and designing interfaces we create
    {#each mediaTypes as media, i}
      <button
        class="interactive"
        id={media}
        data-related={data
          .filter((d) => d.media.includes(media))
          .map((d) => `${d.id} ${d.authors.join(" ")}`)
          .join(" ")}
        class:active={activeFilter === media}
        on:click|stopPropagation={handleClick}
        on:mouseover={handleHover}
        on:mouseout={handleOut}
        class:highlighted={effectiveItems.has(media)}
        >{media.replace("-", " ")}</button
      >{i < mediaTypes.length - 1
        ? i === mediaTypes.length - 2
          ? " and "
          : ", "
        : "."}
    {/each}
  </p>
</section>

<style>
  section {
    margin-bottom: 20px;
  }

  button {
    font-family: "Ronzino", Helvetica, Arial, sans-serif;
  }

  .interactive,
  .project,
  .people {
    cursor: pointer;
    /* color: var(--highlight, rgb(200, 200, 200)); */
    background: white;
    border: 1px solid black;
    padding: 0 4px;
    border-radius: 3px;
    vertical-align: middle;
    font-size: 1rem;
  }

  .interactive:hover {
    background: black;
    color: white;
  }

  .active {
    background: black;
    color: white !important;
  }

  .highlighted {
    color: black;
  }

  .intro.fading .interactive.highlighted {
    color: white;
    background: black;
    pointer-events: auto;
    cursor: pointer;
  }
</style>
