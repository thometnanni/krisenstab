import { env } from "$env/dynamic/private";

export async function load({ fetch }) {
  const repo = "sinanatra/krisenstab";
  const filePath = "static/letter.md";

  const headers = env.PRIVATE_GITHUB_TOKEN
    ? { Authorization: `Bearer ${env.PRIVATE_GITHUB_TOKEN}` }
    : {};

  const res = await fetch(
    `https://api.github.com/repos/${repo}/commits?path=${filePath}&per_page=100`,
    { headers }
  );

  if (!res.ok) {
    return { commits: [], repo, filePath };
  }

  const commits = await res.json();
  return { commits, repo, filePath };
}
