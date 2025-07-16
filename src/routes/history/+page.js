const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export async function load({ fetch }) {
  const repo = "sinanatra/krisenstab";
  const filePath = "static/letter.md";
  const headers = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};

  const res = await fetch(
    `https://api.github.com/repos/${repo}/commits?path=${filePath}&per_page=100`,
    { headers }
  );

  if (!res.ok) {
    return { commits: [] };
  }

  const commits = await res.json();

  return { commits, repo, filePath, GITHUB_TOKEN };
}
