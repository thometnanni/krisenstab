<article>
  <div class="meta">
    <div class="time">
      <a href="/">Krisenstab</a> <br /> <br />
    </div>

    <div class="time">
      <a href="/projects">Projects</a><br />
      <a href="/writings" class="hidden-link">Writings</a>
      <br /> <br />
      <a href="/letters">Letters</a>
    </div>
  </div>

  <section>
    <slot />
  </section>
</article>

<style>
  article {
    display: flex;
    gap: 10px;
    min-height: 100%;
    max-width: 1920px;
  }

  article > .meta {
    padding-bottom: 10px;
    flex: 0 0 var(--col1);
    position: unset;

    /* display: block; */
  }

  section {
    flex: 0 0 800px;
    overflow-x: visible;
    max-height: none;
    overflow: hidden;
  }

  .meta {
    background-color: white;
    display: flex;
    font-size: 14px;
    line-height: 14px;
    align-items: flex-end;
    flex-wrap: wrap;
    align-content: space-between;
    position: sticky;
    top: 0;
    /* height: 100vh; */
    max-height: 100vh;
    width: 100%;
  }

  @media only screen and (max-width: 800px) {
    .meta {
      display: block;
      flex: 0 0 10px !important;
      flex-direction: row-reverse;
      text-align: right;
      align-items: flex-start;
    }
  }

  .time {
    padding: 10px 10px;

    font-size: 0.6rem;
    line-height: 1rem;

    font-size: 0.75rem;
    opacity: 0.6;
    line-height: 1.2;
  }

  .time p {
    padding: 0;
    margin-bottom: 0;
  }

  section {
    flex: 1;
    overflow: visible;
    max-height: none;
  }

  p {
    margin: 0;
    margin-bottom: 1ex;
    font-weight: normal;
    color: black;
  }

  @media (max-width: 800px) {
    article {
      flex-direction: column;
      padding: 5px;
    }

    section {
      max-width: 100%;
      overflow: visible;
      max-height: none;
    }

    .time {
      padding: 5px 10px;
    }
  }
</style>
