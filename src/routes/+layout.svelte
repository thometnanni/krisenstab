<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import { onMount } from "svelte";

  function pickTitle() {
    const h = document.querySelector("h1");
    if (!h) return "krisenstab";
    const t = h.textContent.trim();
    const short =
      t.length > 80 ? t.slice(0, 80).replace(/\s+\S*$/, "") + "…" : t;
    return short;
  }

  function pickImage() {
    const img = document.querySelector("img");
    if (!img) return "https://krisenstab.net/og-image.png";
    return img.currentSrc || img.src;
  }

  function setMeta(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  onMount(() => {
    const titleText = pickTitle();
    const imgSrc = pickImage();
    const fullUrl = `https://krisenstab.net${window.location.pathname}`;

    document.title = titleText;
    setMeta('meta[property="og:title"]', titleText);
    setMeta('meta[name="twitter:title"]', titleText);
    setMeta('meta[property="og:image"]', imgSrc);
    setMeta('meta[name="twitter:image"]', imgSrc);
    setMeta('meta[property="og:url"]', fullUrl);
    setMeta('meta[name="twitter:url"]', fullUrl);
  });
</script>

<Header />

<article>
  <section>
    <slot />
  </section>
</article>
