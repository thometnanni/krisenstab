<article>
  <aside class="meta">
    <div class="time">
      <a href="/" class="krisenstab-logo">Krisenstab</a>
    </div>

    <!--
    <div class="time">
      <a href="/projects">Projects</a><br />
      <a href="https://krisenstab.substack.com/" target="_blank">Writings</a><br /><br />
      <a href="/letters">Letters</a>
    </div>
    -->
  </aside>

  <section>
    <slot />
  </section>
</article>

<style>
  article {
    display: flex;
    gap: 10px;
    max-width: 1920px;
    overflow: visible;
  }

  .meta {
    position: sticky;
    top: 0;
    align-self: flex-start;
    width: 100px;
    max-width: 80px;
    min-height: 100svh;
    border-right: 1px dashed #ccc;
    background: #fff;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    font-size: 1rem;
    line-height: 14px;
    flex-wrap: wrap;
    align-content: center;
  }

  .time {
    padding: 5px;
    opacity: 0.6;
    line-height: 1.2;
    display: flex;
    align-items: flex-end;
    width: 100%;
    position: static;
  }

  .krisenstab-logo {
    display: block;
    transform: rotate(270deg);
    color: gainsboro;
    text-decoration: none;
    font-size: 4rem;
    margin: 10px 0;
    white-space: nowrap;
    width: 100%;
    text-align: left;
  }

  .krisenstab-logo:hover {
    text-decoration: underline;
    text-decoration-color: blue;
    text-decoration-thickness: 1px;
    text-underline-offset: 5px;
  }

  section {
    flex: 1 1 auto;
    overflow: visible;
    max-height: none;
  }

  p {
    margin: 0 0 1ex 0;
    font-weight: normal;
    color: #000;
  }

  @media (max-width: 800px) {
    article {
      flex-direction: column;
      padding: 5px;
    }

    .meta {
      position: static;
      width: 100%;
      max-width: none;
      min-height: auto;
      border-right: none;
      margin-bottom: 50px;
    }

    .krisenstab-logo {
      transform: rotate(0deg);
      font-size: 2rem;
      text-align: right;
      margin: 0;
      padding: 0;
    }
    .time {
      padding: 0;
    }
    section {
      max-width: 100%;
    }
  }
</style>
