<script>
  import { onMount, onDestroy } from "svelte";

  export let src = "";
  export let alt = "";
  export let fallbackColor = "#f3f3f3";
  export let wrapperClass = "";
  export let imgClass = "";

  let wrapperEl;
  let observer;
  let isVisible = false;
  let isLoaded = false;

  const setVisible = () => {
    isVisible = true;
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };

  onMount(() => {
    if (typeof IntersectionObserver === "undefined" || !wrapperEl) {
      setVisible();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(wrapperEl);
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
  });
</script>

<div
  bind:this={wrapperEl}
  class={`relative overflow-hidden ${wrapperClass}`.trim()}
  style={`background-color: ${fallbackColor};`}
>
  {#if isVisible}
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      fetchpriority="low"
      class={`transition-opacity duration-300 ${imgClass}`.trim()}
      style={`opacity: ${isLoaded ? 1 : 0};`}
      on:load={() => {
        isLoaded = true;
      }}
    />
  {/if}
</div>
