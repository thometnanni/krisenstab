<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let data = [];
  export let activeFilter;
  export let effectiveItems;
  const handleClick = (e) => dispatch("filterClick", e);
  const handleHover = (e) => dispatch("hover", e);
  const handleOut = (e) => dispatch("out", e);
  const people = ["fidel", "giacomo", "julian"];
</script>

<section class="cheers">
  <p>
    We always welcome general inquiries and friendly hellos.
    <br />Contact us
    <a href="mailto:thometnanni@protonmail.com">here</a>, or find us at our favourite
    <a target="_blank" href="https://www.mapillary.com/app/?lat=52.469174399972&lng=13.4311687&z=18.309253095562156&focus=photo&x=0.8456445813647833&y=0.36374892204492837&zoom=0&menu=false&pKey=1254106615818435">spots</a> around Berlin.
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
        >{person.charAt(0).toUpperCase() + person.slice(1)}</span
      >{i < people.length - 1 ? (i === people.length - 2 ? " and " : ", ") : ""}
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
    /* background-color: black; */
    color: black !important;
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
