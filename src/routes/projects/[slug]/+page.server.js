export const prerender = true;
// export const csr = false;

const splitHtml = (html) => {
  const i = html.toLowerCase().indexOf("<hr");
  return i >= 0
    ? { detailHtml: html.slice(i).replace(/^\s*<hr[^>]*>/i, "") }
    : { detailHtml: html };
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
  if (!mod) return { post: null };
  const rendered =
    typeof mod?.default?.render === "function"
      ? mod.default.render()
      : { html: "" };
  const html = rendered.html || "";
  const { detailHtml } = splitHtml(html);
  return {
    post: {
      slug: params.slug,
      title: mod?.metadata?.title || "",
      date: mod?.metadata?.date || "",
      detailHtml,
    },
  };
}
