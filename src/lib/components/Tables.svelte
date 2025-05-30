<script>
  import { onMount, onDestroy } from "svelte";

  let tables = [];
  let current = 0;
  let tablesrc;
  let intervalId;

  onMount(async () => {
    tables = await (await fetch("../tables.json")).json();

    intervalId = setInterval(() => {
      current = (current + 1) % tables.length;
      tablesrc = tables[current].src;
    }, 200);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

{#if tables && tablesrc}
  <main>
    <img src={tablesrc} alt="Just another table" class="logo" />
  </main>
{/if}

<style>
  main {
    display: flex;
    justify-content: center;
    max-width: 1440px;
    align-items: center;
    height: 300px;
    margin: 0;
    background-color: white;
    text-align: center;
    margin: 10px;
    margin-bottom: 100px;
  }

  .logo {
    margin-top: 100px;
    max-width: 20%;
    width: auto;
    height: 300px;
    object-fit: contain;
    /* height: auto; */

    margin-left: calc((var(--col1)) * -1);
  }

  @media only screen and (max-width: 800px) {
    .logo {
      margin-left: 0;
      max-width: 50%;
    }
  }

  /* :global(.meta-link) {
    display: none !important;
  } */
</style>
