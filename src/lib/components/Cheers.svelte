<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let data = [];
  export let activeFilter;
  export let effectiveItems;

  const handleClick = (e) =>
    dispatch("filterClick", { filterId: e.currentTarget.id });
  const handleHover = (e) => dispatch("hover", e);
  const handleOut = (e) => dispatch("out", e);

  const people = ["fidel", "giacomo", "julian"];
</script>

<section class="cheers">
  <p>
    We always welcome <a href="mailto:hi@thometnanni.net">
      general inquiries and friendly hellos</a
    >.<br />
  </p>
  <p>
    Cheers, <br />
    {#each people as person, i}
      <span
        id={person}
        class="people interactive"
        data-related={data
          .filter((d) => d.authors.includes(person))
          .map((d) => `${d.id} ${d.domain.join(" ")} ${d.media.join(" ")}`)
          .join(" ")}
        class:active={activeFilter === person}
        on:click|stopPropagation={handleClick}
        on:mouseover={handleHover}
        on:mouseout={handleOut}
        class:highlighted={effectiveItems.has(person)}
      >
        {person.charAt(0).toUpperCase() + person.slice(1)}</span>{i < people.length - 1
        ? i === people.length - 2
          ? " and "
          : ", "
        : ""}
    {/each}
  </p>
 
</section>

<style>
  .people,
  .interactive {
    cursor: pointer;
    color: var(--highlight, rgb(165, 165, 165));
  }
  a {
    border-bottom: 1px dashed;
  }
  .active {
    color: black !important;
  }
  .highlighted {
    color: black;
  }

</style>
