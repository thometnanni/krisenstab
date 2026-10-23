import { JSDOM } from "jsdom";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import "dotenv/config";
import Mustache from "mustache";

const slugs = {
  projects: "krisenstab-projects",
  letters: "krisenstab-letters",
  images: "in-progress-grmlelb7rc8",
};

async function main() {
  const channels = await loadChannels();
  const update = await updateChannels(channels);
  if (!update) {
    return;
  }
  await mkdir("data", { recursive: true });
  writeFile("data/channels.json", JSON.stringify(channels));

  const index = await readFile("./src/index.html", "utf8");
  const dom = new JSDOM(index);
  const document = dom.window.document;

  const projects = Mustache.render(
    await readFile(new URL("./templates/projects.html", import.meta.url), "utf8"),
    channels.projects.data,
  );

  document.querySelector(".projects").innerHTML = projects;
  await mkdir("dist", { recursive: true });
  await writeFile("dist/index.html", dom.serialize());
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
    const res = await fetch(`https://api.are.na/v3/channels/${slugs[key]}/contents`, {
      headers: {
        Authorization: `Bearer ${process.env.ARENA_TOKEN}`,
        "If-None-Match": channel.etag,
      },
    });
    if (res.status === 304) continue;

    update = true;
    channel.etag = res.headers.get("etag");
    channel.data = (await res.json()).data;
  }
  return update;
}
