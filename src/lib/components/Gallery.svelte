<script>
  let outer, inner;
  let mousemoveEnabled = true;
  let programmaticScroll = false;

  let margin = 20;

  function onMousemove(e) {
    // console.log('mousemove event fired');
    if (!mousemoveEnabled) {
      // console.log('mousemove disabled');
      return;
    }
    const outerElWidth = outer.getBoundingClientRect().width;
    const innerElWidth = inner.getBoundingClientRect().width;
    // console.log('outerElWidth:', outerElWidth, 'innerElWidth:', innerElWidth);
    if (innerElWidth <= outerElWidth) {
      // console.log('inner not wider than outer, returning');
      return;
    }

    const outerRect = outer.getBoundingClientRect();
    const x = e.clientX - outerRect.left;
    const fraction = (x - margin) / (outerElWidth - margin * 2);
    const diff = innerElWidth - outerElWidth;

    // console.log('e.clientX:', e.clientX, 'outerRect.left:', outerRect.left, 'x:', x, 'fraction:', fraction, 'diff:', diff);

    programmaticScroll = true;
    outer.scrollTo({ left: diff * fraction, behavior: "instant" });
    requestAnimationFrame(() => (programmaticScroll = false));
  }

  function onMouseover(e) {
    // console.log('mouseover - enabling mousemove');
    mousemoveEnabled = true;
  }

  function onScroll(e) {
    // console.log('scroll event, programmaticScroll:', programmaticScroll);
    if (!programmaticScroll) mousemoveEnabled = false;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
  bind:this={outer}
  class="outer w-[100%] overflow-x-auto scroll-smooth"
  on:mousemove={onMousemove}
  on:mouseenter={onMouseover}
  on:scroll={onScroll}
>
  <div
    bind:this={inner}
    class="inner sc m-auto mt-0 mb-0 flex w-max flex-nowrap items-start justify-start gap-4 px-4"
  >
    <slot />
  </div>
</div>

<style>
  .outer {
    scrollbar-width: none;
  }

  :global(.p-container  a) {
    text-decoration: none;
  }
</style>
