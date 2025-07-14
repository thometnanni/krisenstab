<script>
  import Intro from "$lib/components/Intro.svelte";
  import { onMount } from "svelte";
  import { diffLines } from "diff";
  import { marked } from "marked";

  let commits = [];
  let currentIndex = 0;
  let diffHtml = "";
  let loading = false;

  const repo = "sinanatra/krisenstab";
  const filePath = "static/letter.md";

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
          return `<span style="background: #c8e6c9;">${marked.parse(part.value)}</span>`;
        if (part.removed)
          return `<span style="background: #ffcdd2;text-decoration:line-through;">${marked.parse(part.value)}</span>`;
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

<div style="margin-bottom:10px;">
  <button
    on:click={prev}
    disabled={loading || currentIndex === commits.length - 1}
  >
    Previous ←
    <!-- ← Previous {commits[currentIndex]?.commit.author.date?.split("T")[0] || ""} -->
  </button>
  <button
    on:click={next}
    disabled={loading || currentIndex === 0}
    style="margin-left:5px;"
  >
    → Next
  </button>
</div>

{#if loading}
  <p>Loading history...</p>
{:else if diffHtml}
  <article class="markdown">
    <Intro />

    {@html diffHtml}
  </article>
{/if}

<style>
  button {
    cursor: pointer;
  }

  button[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .markdown {
    max-width: 700px;
    font-family: inherit;
    font-size: 1.07em;
  }
</style>
