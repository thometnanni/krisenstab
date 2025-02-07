<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let data = [];
  export let activeFilter;
  export let effectiveItems;
  const handleClick = (e) => dispatch("filterClick", e);
  const handleHover = (e) => dispatch("hover", e);
  const handleOut = (e) => dispatch("out", e);
  const people = ["julian", "giacomo", "fidel"];
</script>

<section class="cheers">
  <p>
    We always welcome general inquiries and friendly hellos. Contact us
    <a href="mailto:thometnanni@protonmail.com">here</a>, or find us at our
    favourite spots around Berlin.
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
      >{person.charAt(0).toUpperCase() + person.slice(1)}</span>{i < people.length - 1 ? (i === people.length - 2 ? " and " : ", ") : ""}
    {/each}
  </p>
</section>

<style>
  .people,
  .interactive {
    cursor: pointer;
    color: var(--highlight, rgb(165, 165, 165));
  }
  .active {
    background-color: black;
    color: white !important;
  }
  .highlighted {
    color: black;
  }
  .cheers.fading .interactive {
    color: var(--faded-color);
    pointer-events: none;
  }
  .cheers.fading .interactive.highlighted {
    color: black;
    pointer-events: auto;
    cursor: pointer;
  }
</style>
