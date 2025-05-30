<script>
  import { onMount, onDestroy } from "svelte";

  let tables = [
    { src: "/tables/krisenstab_leisure_2.svg", alt: "Krisenstab" },
    { src: "/tables/krisenstab_work.svg", alt: "Krisenstab" },
    { src: "/tables/krisenstab_leisure_drink_2.svg", alt: "Krisenstab" },
  ];
  let current = 0;
  let tablesrc = tables[current].src;
  let logoAlt = tables[current].alt;
  let intervalId;

  onMount(() => {
    intervalId = setInterval(() => {
      current = (current + 1) % tables.length;
      tablesrc = tables[current].src;
      logoAlt = tables[current].alt;
    }, 500);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<a href="/work">
  <main>
    <img src={tablesrc} alt={logoAlt} class="logo" />
    <footer>
      <p class="tiny">
        Krisenstab<br />
        Thomet & Nanni GbR
      </p>
    </footer>
  </main>
</a>

<style>
  a {
    display: block;
    text-decoration: none;
    background-color: white;
    color: inherit;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    cursor: pointer;
    background-color: white;
    text-align: center;
  }

  .logo {
    max-width: 30vh;
    width: auto;
    height: auto;
    margin: auto;
  }

  footer {
    margin-top: auto;
    padding-bottom: 20px;
  }

  .tiny {
    font-size: 0.75rem;
    opacity: 0.6;
    margin: 0;
    line-height: 1.2;
  }
</style>
