import { PRIVATE_GITHUB_TOKEN } from "$env/static/private";

export async function load({ fetch }) {
  const repo = "sinanatra/krisenstab";
  const filePath = "static/letter.md";
  const headers = PRIVATE_GITHUB_TOKEN
    ? { Authorization: `Bearer ${PRIVATE_GITHUB_TOKEN}` }
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
