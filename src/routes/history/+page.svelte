<script>
  import Intro from "$lib/components/Intro.svelte";
  import { diffLines } from "diff";
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

  async function loadDiff() {
    if (!commits.length) return;
    loading = true;
    const currCommit = commits[currentIndex];
    const prevCommit = commits[currentIndex + 1];
    const currContent = await loadFileAt(currCommit.sha);
    const prevContent = prevCommit ? await loadFileAt(prevCommit.sha) : "";
    const diff = diffLines(prevContent, currContent);

    diffHtml = diff
      .map((part) => {
        if (part.added)
          return `<span class="diff-added">${marked.parse(part.value)}</span>`;
        if (part.removed)
          return `<span class="diff-removed">${marked.parse(part.value)}</span>`;
        return marked.parse(part.value);
      })
      .join("");
    loading = false;
  }

  function prev() {
    if (currentIndex < commits.length - 1) {
      currentIndex += 1;
    }
  }

  function next() {
    if (currentIndex > 0) {
      currentIndex -= 1;
    }
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
      disabled={loading || currentIndex === commits.length - 1}
    >
      Previous
    </button>
    <button
      on:click={next}
      disabled={loading || currentIndex === 0}
      style="margin-left:5px;"
    >
      Next
    </button>
  </div>
  {#if loading}
    <!-- <p>Loading history...</p> -->
  {:else if diffHtml}
    {#if formattedDate}
      <div class="commit-date">{formattedDate}</div>
    {/if}
    <article class="markdown">
      <Intro />
      {@html diffHtml}
    </article>
  {/if}
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
  .markdown {
    max-width: 700px;
    font-family: inherit;
    font-size: 1.07em;
    color: #333;
  }
  .commit-date {
    font-size: 1.06em;
    color: #959595;
    margin-bottom: 4px;
    margin-top: 16px;
    letter-spacing: 0.02em;
    font-family: inherit;
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
    border-radius: 3px;
    padding: 2px 0;
  }
</style>
