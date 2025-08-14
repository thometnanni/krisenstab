<script>
  import Intro from "$lib/components/Intro.svelte";
  import { Diff } from "diff";
  import { marked } from "marked";
  import { onMount } from "svelte";

  export let data;

  let { commits, repo, filePath } = data;
  let currentIndex = 0;
  let diffHtml = "";
  let loading = false;

  $: formattedDate =
    commits.length && commits[currentIndex]?.commit?.author?.date
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(commits[currentIndex].commit.author.date))
      : "";

  onMount(() => {
    if (commits.length > 1) {
      currentIndex = 0;
      loadDiff();
    }
  });

  $: if (commits.length > 1 && currentIndex !== undefined) {
    loadDiff();
  }

  async function loadFileAt(sha) {
    const res = await fetch(
      `/api/github/${sha}?repo=${repo}&filePath=${filePath}`
    );
    if (!res.ok) return "";
    const data = await res.json();
    return atob(data.content.replace(/\n/g, ""));
  }

  function htmlAwareDiff(prevHtml, currHtml) {
    const d = new Diff();
    d.tokenize = (value) =>
      value
        .split(/(<[^>]+?>|&[a-zA-Z#0-9]+;|[\s\u00A0]+|[^\s<>&]+)/g)
        .filter(Boolean);

    const parts = d.diff(prevHtml, currHtml);

    return parts
      .map((part) => {
        const isTag = /^<[^>]+>$/.test(part.value.trim());
        if (isTag) return part.value;
        if (part.added) return `<span class="diff-added">${part.value}</span>`;
        if (part.removed)
          return `<span class="diff-removed">${part.value}</span>`;
        return part.value;
      })
      .join("");
  }

  async function loadDiff() {
    if (!commits.length || loading) return;
    loading = true;

    const currCommit = commits[currentIndex];
    const prevCommit = commits[currentIndex + 1];

    const currMd = await loadFileAt(currCommit.sha);
    const prevMd = prevCommit ? await loadFileAt(prevCommit.sha) : "";

    const prevHtml = marked.parse(prevMd);
    const currHtml = marked.parse(currMd);

    diffHtml = htmlAwareDiff(prevHtml, currHtml);

    loading = false;
  }

  function prev() {
    if (currentIndex < commits.length - 1) currentIndex += 1;
  }

  function next() {
    if (currentIndex > 0) currentIndex -= 1;
  }
</script>

<main>
  <div class="intro-history">
    We revise our letter as our studio grows and our interests shift.<br />
    This page lets you explore how our self-description has changed through each
    update.
  </div>

  <div style="margin-bottom:20px;">
    <button
      on:click={prev}
      disabled={loading || currentIndex === commits.length - 1}>Previous</button
    >
    <button
      on:click={next}
      disabled={loading || currentIndex === 0}
      style="margin-left:5px;">Next</button
    >
  </div>

  {#if formattedDate}
    <div class="commit-date">{formattedDate}</div>
  {/if}
  <article class="markdown">
    <Intro />
    {@html diffHtml}
  </article>
</main>

<style>
  button {
    cursor: pointer;
    background-color: white;
    border: 1px solid #ccc;
    padding: 2px 5px;
  }
  button:hover {
    background-color: #f0f0f0;
  }
  button[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  main {
    max-width: 700px;
    padding: 10px;
  }
  .markdown,
  :global(.markdown a) {
    max-width: 700px;
    font-family: inherit;
    color: rgb(146, 146, 146);
  }
  .commit-date {
    color: #000000;
    margin-top: 16px;
  }

  .intro-history {
    padding: 0;
    margin: 0;
    margin-bottom: 50px;
  }

  :global(.diff-added),
  :global(.diff-added a) {
    color: black;
    border-radius: 3px;
    padding: 2px 0;
  }
  :global(.diff-removed),
  :global(.diff-removed a) {
    color: gainsboro;
    text-decoration: line-through;
    text-decoration-color: black;
    text-decoration-thickness: 1px;
    padding: 2px 0;
  }
</style>
