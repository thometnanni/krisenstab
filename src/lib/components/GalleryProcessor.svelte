<script>
  import { onMount } from 'svelte';
  import Gallery from '$lib/components/Gallery.svelte';

  export let html = '';

  let fragments = [];
  let mounted = false;

  function parseHTML(htmlString) {
    if (typeof document === 'undefined') return [];
    
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    
    const fragmentList = [];
    let currentFragment = document.createDocumentFragment();

    Array.from(container.childNodes).forEach(node => {
      if (node.nodeName === 'DIV' && node.getAttribute?.('data-gallery') === 'start') {
        if (currentFragment.childNodes.length > 0) {
          fragmentList.push({ type: 'html', content: currentFragment.cloneNode(true) });
          currentFragment = document.createDocumentFragment();
        }
        
        const galleryContent = document.createDocumentFragment();
        let nextNode = node.nextSibling;
        
        while (nextNode && !(nextNode.nodeName === 'DIV' && nextNode.getAttribute?.('data-gallery') === 'end')) {
          const nodeToMove = nextNode;
          nextNode = nextNode.nextSibling;
          galleryContent.appendChild(nodeToMove);
        }
        
        fragmentList.push({ type: 'gallery', content: galleryContent });
        
        if (nextNode && nextNode.getAttribute?.('data-gallery') === 'end') {
          nextNode.remove();
        }
      } else if (!(node.nodeName === 'DIV' && node.getAttribute?.('data-gallery') === 'end')) {
        currentFragment.appendChild(node.cloneNode(true));
      }
    });

    if (currentFragment.childNodes.length > 0) {
      fragmentList.push({ type: 'html', content: currentFragment });
    }

    return fragmentList;
  }

  onMount(() => {
    fragments = parseHTML(html);
    mounted = true;
  });
</script>

{#if mounted}
  {#each fragments as fragment (fragment)}
    {#if fragment.type === 'gallery'}
      <Gallery>
        {@html fragment.content.innerHTML}
      </Gallery>
    {:else}
      {@html fragment.content.innerHTML}
    {/if}
  {/each}
{:else}
  {@html html}
{/if}
