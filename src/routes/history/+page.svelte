<script>
  import Intro from "$lib/components/Intro.svelte";
  import Impressum from "$lib/components/Impressum.svelte";
  import { onMount } from "svelte";
  import { diffLines } from "diff";
  import { marked } from "marked";

  let commits = [];
  let currentIndex = 0;
  let diffHtml = "";
  let loading = false;

  const repo = "sinanatra/krisenstab";
  const filePath = "static/letter.md";

  $: formattedDate =
    commits.length && commits[currentIndex]?.commit?.author?.date
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(commits[currentIndex].commit.author.date))
      : "";

  onMount(async () => {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits?path=${filePath}&per_page=100`
    );
    commits = await res.json();
    if (commits.length > 1) {
      currentIndex = 0;
      await loadDiff();
    }
  });

  async function loadFileAt(sha) {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${sha}`
    );
    const data = await res.json();
    return atob(data.content.replace(/\n/g, ""));
  }

  async function loadDiff() {
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

  async function prev() {
    if (currentIndex < commits.length - 1) {
      currentIndex += 1;
      await loadDiff();
    }
  }

  async function next() {
    if (currentIndex > 0) {
      currentIndex -= 1;
      await loadDiff();
    }
  }
</script>

<main>
  <div class="intro-history">
    <p>
      We regularly update the way we present ourselves to reflect our practice,
      our work, and our ambitions.<br />
      Here, you can browse every change over time.<br />
    </p>
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
    <p>Loading history...</p>
  {:else if diffHtml}
    {#if formattedDate}
      <div class="commit-date">{formattedDate}</div>
    {/if}
    <article class="markdown">
      <Intro />
      {@html diffHtml}
    </article>
  {/if}
  <Impressum />
</main>

<style>
  button {
    cursor: pointer;
  }

  button[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  main {
    max-width: 900px;
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
    margin-bottom: 10px;
  }

  :global(.diff-added),
  :global(.diff-added a) {
    color: black;
    display: block;
    border-radius: 3px;
    padding: 2px 0;
  }

  :global(.diff-removed),
  :global(.diff-removed a) {
    /* color: #ff1314; */
    color: gainsboro;
    text-decoration: line-through;
    text-decoration-color: black;
    display: block;
    border-radius: 3px;
    padding: 2px 0;
  }
</style>
