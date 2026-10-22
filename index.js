import { JSDOM } from "jsdom";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import "dotenv/config";

const headers = { Authorization: `Bearer ${process.env.ARENA_TOKEN}` };

const index = await readFile("./index.html", "utf8");
const dom = new JSDOM(index);

const channels = {
  projects: "krisenstab-projects",
  letters: "krisenstab-letters",
  images: "in-progress-grmlelb7rc8",
};

async function main() {
  let data;
  try {
    data = JSON.parse(await readFile(`data.json`, "utf8"));
  } catch {
    data = Object.fromEntries(Object.keys(channels).map((key) => [key, {}]));
  }

  let update = false;
  for (const [key, channel] of Object.entries(data)) {
    const res = await fetch(`https://api.are.na/v3/channels/${channels[key]}/contents`, {
      headers: {
        Authorization: `Bearer ${process.env.ARENA_TOKEN}`,
        "If-None-Match": channel.etag,
      },
    });
    if (res.status === 304) continue;

    update = true;
    channel.etag = res.headers.get("etag");
    console.log(res);
    channel.data = await res.json();
  }

  if (!update) {
    return;
  }
  writeFile("data.json", JSON.stringify(data));
}

await main();
