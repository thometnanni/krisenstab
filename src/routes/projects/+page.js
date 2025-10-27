export const prerender = true;
export const csr = false;

const norm = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[–—−]/g, "-");
const parseDate = (s) => {
  const m = norm(s).match(/^(\d{4})(?:\s*-\s*(\d{4}|ongoing))?$/i);
  if (!m) return { start: -Infinity, end: -Infinity, ongoing: false };
  const start = +m[1];
  const ongoing = !!(m[2] && String(m[2]).includes("ongoing"));
  const end = /^\d{4}$/.test(m[2]) ? +m[2] : ongoing ? Infinity : start;
  return { start, end, ongoing };
};
const splitAndExtract = (html) => {
  const i = html.toLowerCase().indexOf("<hr");
  const head = i >= 0 ? html.slice(0, i) : html;
  const imgs = [...head.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(
    (m) => m[1]
  );
  const summaryHtml = head.replace(/<img[^>]*>/gi, "");
  return { summaryHtml, media: imgs };
};

export async function load() {
  const modules = import.meta.glob("/src/routes/texts/*.md", { eager: true });
  const items = Object.entries(modules).map(([path, mod]) => {
    const rendered =
      typeof mod?.default?.render === "function"
        ? mod.default.render()
        : { html: "" };
    const { summaryHtml, media } = splitAndExtract(rendered.html || "");
    const slug = path.split("/texts/")[1].replace(".md", "");
    return {
      slug,
      title: mod?.metadata?.title || "",
      date: mod?.metadata?.date || "",
      summaryHtml,
      media,
    };
  });
  const projects = items.sort((a, b) => {
    const A = parseDate(a.date);
    const B = parseDate(b.date);
    if (A.ongoing && !B.ongoing) return -1;
    if (B.ongoing && !A.ongoing) return 1;
    if (B.start !== A.start) return B.start - A.start;
    if (B.end !== A.end) return B.end - A.end;
    return (a.title || "").localeCompare(b.title || "", "en", {
      sensitivity: "base",
    });
  });
  return { projects };
}
