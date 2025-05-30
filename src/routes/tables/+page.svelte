<script>
  import { onMount, onDestroy } from "svelte";

  let tables = [
    // { src: "/tables/krisenstab_work.svg"},
    { src: "/tables/met.jpg" },
    { src: "/tables/skok.jpg" },
    { src: "/tables/gabri.jpg" },
    { src: "/tables/pesaris.jpg" },
    
  ];
  let current = 0;
  let tablesrc = tables[current].src;
  let intervalId;

  onMount(() => {
    intervalId = setInterval(() => {
      current = (current + 1) % tables.length;
      tablesrc = tables[current].src;
      logoAlt = "Just another table";
    }, 200);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<a href="/" data-sveltekit-reload>
  <main>
    <img src={tablesrc} alt="Just another table" class="logo" />
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
    max-width: 40vh;
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

  :global(.meta-link) {
    display: none !important;
  }
</style>
