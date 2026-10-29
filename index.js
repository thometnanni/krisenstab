import { JSDOM } from "jsdom";
import { readFile, mkdir, writeFile, cp } from "node:fs/promises";
import "dotenv/config";
import Mustache from "mustache";
import { compile, optimize } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const slugs = {
  projects: "krisenstab-projects",
  letters: "krisenstab-letters",
  images: "in-progress-grmlelb7rc8",
};

async function main() {
  const channels = await loadChannels();
  const update = await updateChannels(channels);
  if (!update) return;

  const index = await readFile("./src/index.html", "utf8");
  const dom = new JSDOM(index);
  const document = dom.window.document;

  const images = channels.images.data
    .filter(({ type, image }) => type === "Image" && image.content_type !== "image/gif")
    .map(({ image }) => image.small.src);

  const letters = channels.letters.data.map((d) => ({
    date: d.title ?? d.created_at.replace(/T.+/, ""),
    message: d.content.html,
  }));

  document.querySelector("#projects").innerHTML = await createProjects(channels.projects.data);
  document.querySelector(".letters").innerHTML = await createLetters(letters);
  document.querySelector("#sketch").textContent =
    `import { init } from "./script.js";\ninit(${JSON.stringify(images)});`;
  document.querySelector("style").innerHTML = await buildCss(dom.serialize());
  await mkdir("dist", { recursive: true });
  await writeFile("dist/index.html", dom.serialize());
  await copyAssets();
}

await main();

async function loadChannels() {
  try {
    return JSON.parse(await readFile(`data/channels.json`, "utf8"));
  } catch {
    return Object.fromEntries(Object.keys(slugs).map((key) => [key, {}]));
  }
}

async function updateChannels(channels) {
  let update = false;
  for (const [key, channel] of Object.entries(channels)) {
    const res = await fetch(`https://api.are.na/v3/channels/${slugs[key]}/contents?per=100`, {
      headers: {
        Authorization: `Bearer ${process.env.ARENA_TOKEN}`,
        "User-Agent": "krisenstab/1.0.0 (+hi@krisenstab.net)",
        // "If-None-Match": channel.etag,
      },
    });
    if (res.status === 304) continue;

    update = true;
    channel.etag = res.headers.get("etag");
    channel.data = (await res.json()).data;
  }
  if (update) {
    await mkdir("data", { recursive: true });
    writeFile("data/channels.json", JSON.stringify(channels));
  }
  return update;
}

async function buildCss(html) {
  // const path = join(import.meta.dirname, "style.css");
  const compiler = await compile(await readFile("src/style.css", "utf8"), {
    base: import.meta.dirname,
    onDependency() {},
  });
  const candidates = new Scanner({}).scanFiles([{ content: html, extension: "html" }]);
  return optimize(compiler.build(candidates), { minify: true }).code;
}

async function createProjects(data) {
  const offset = Math.random();
  const phi = (1 + Math.sqrt(5)) / 2;
  const projects = data.map(({ description, title, source, image }, i) => ({
    description: description?.plain,
    title,
    image: image?.small?.src,
    url: source?.url,
    left: (offset + phi * i) % 1,
    right: 1 - ((offset + phi * i) % 1),
  }));

  const html = Mustache.render(await readFile("./templates/projects.html", "utf8"), projects);
  return html;
}

async function createLetters(letters) {
  const width = 210 * 3.65;
  const height = 297 * 3.65;
  const data = letters.map(({ date, message }, i) => {
    const isFirst = i === 0;
    const degrees = isFirst ? 5 : Math.random() * 160 - 80;
    const rad = (degrees * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    return {
      dateLabel: isFirst ? null : formatDate(date),
      message,
      degrees,
      // bounding box of the rotated letter at scale 1
      bboxWidth: width * cos + height * sin,
      bboxHeight: height * cos + width * sin,
      rx: isFirst ? 0 : Math.random() - 0.5,
      ry: isFirst ? 0 : Math.random() - 0.5,
      last: i === letters.length - 1,
    };
  });

  return Mustache.render(await readFile("./templates/letter.html", "utf8"), data);
}

function formatDate(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(`${date}T00:00:00Z`));
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${get("weekday")}, ${get("day")} ${get("month")} ${get("year")}`;
}

async function copyAssets() {
  await cp("assets", "dist", {
    recursive: true,
  });

  await cp("src/script.js", "dist/script.js");

  await cp("node_modules/@krisenstab/dither-dither/dist/dither-dither.js", "dist/dither-dither.js");
}
