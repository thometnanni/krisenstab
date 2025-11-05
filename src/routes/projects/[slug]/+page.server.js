export const prerender = true;
const siteOrigin = "https://krisenstab.net";

const splitHtml = (html) => {
  const i = html.toLowerCase().indexOf("<hr");
  return i >= 0
    ? { detailHtml: html.slice(i).replace(/^\s*<hr[^>]*>/i, "") }
    : { detailHtml: html };
};

const firstMatch = (html, re) => {
  const m = re.exec(html);
  return m && m[1] ? m[1] : "";
};

const stripTags = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const truncateChars = (s, n) =>
  s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s;

const isValidImgExt = (u) =>
  /\.(avif|webp|jpe?g|png|gif|svg)(\?.*)?$/i.test(u || "");

const absolutize = (src) => {
  if (!src) return `${siteOrigin}/og-image.png`;
  try {
    return new URL(src, siteOrigin).toString();
  } catch {
    return `${siteOrigin}/og-image.png`;
  }
};

const pickOgImageSrc = (html) => {
  const img = firstMatch(html, /<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (isValidImgExt(img)) return img;
  const srcset = firstMatch(html, /<source[^>]*srcset=["']([^"']+)["'][^>]*>/i);
  if (srcset) {
    const first = srcset.split(",")[0]?.trim().split(/\s+/)[0];
    if (isValidImgExt(first)) return first;
  }
  const poster = firstMatch(html, /<video[^>]*poster=["']([^"']+)["'][^>]*>/i);
  if (isValidImgExt(poster)) return poster;
  const ditherSrc = firstMatch(
    html,
    /<dither-dither[^>]*\ssrc=["']([^"']+)["'][^>]*>/i
  );
  if (isValidImgExt(ditherSrc)) return ditherSrc;
  return "";
};

export async function entries() {
  const modules = import.meta.glob("/src/routes/texts/*.md", { eager: true });
  return Object.keys(modules).map((p) => ({
    slug: p.split("/texts/")[1].replace(".md", ""),
  }));
}

export async function load({ params }) {
  const key = `/src/routes/texts/${params.slug}.md`;
  const modules = import.meta.glob("/src/routes/texts/*.md", { eager: true });
  const mod = modules[key];
  if (!mod) {
    return {
      post: null,
      seo: {
        title: "krisenstab",
        description: "Krisenstab studio",
        image: `${siteOrigin}/og-image.png`,
        url: `${siteOrigin}/texts/${params.slug}`,
      },
    };
  }
  const rendered =
    typeof mod?.default?.render === "function"
      ? mod.default.render()
      : { html: "" };
  const html = rendered.html || "";
  const { detailHtml } = splitHtml(html);
  const h1Raw =
    firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    mod?.metadata?.title ||
    "";
  const pRaw = firstMatch(html, /<p[^>]*>([\s\S]*?)<\/p>/i) || "";
  const title = truncateChars(stripTags(h1Raw) || "krisenstab", 80);
  const description = truncateChars(
    stripTags(pRaw) || "Krisenstab studio",
    160
  );
  const picked = mod?.metadata?.image || pickOgImageSrc(html);
  const image = absolutize(picked);
  const pageUrl = `${siteOrigin}/texts/${params.slug}`;
  return {
    post: {
      slug: params.slug,
      title: mod?.metadata?.title || "",
      date: mod?.metadata?.date || "",
      detailHtml,
    },
    seo: { title, description, image, url: pageUrl },
  };
}
