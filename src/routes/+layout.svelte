<article>
  <!-- <aside class="meta">
    <div class="time">
      <a href="/" class="krisenstab-logo">Krisenstab</a>
    </div>

    <div class="time">
      <a href="/projects">Projects</a><br />
    </div>
  </aside> -->

  <section>
    <slot />
  </section>
</article>

<style>
  article {
    /* display: flex;
    gap: 10px; */
    max-width: 1920px;
    overflow: visible;
  }

  .meta {
    position: static;
    width: 100%;
    max-width: none;
    min-height: auto;
    border-right: none;
    margin-bottom: 50px;

    align-self: flex-start;
    width: 100%;
    background: #fff;

    display: flex;
    flex-direction: column;
    /* justify-content: flex-end; */
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
    justify-content: flex-end;
    width: 100%;
    position: static;
  }

  .krisenstab-logo {
    display: block;
    color: gainsboro;
    font-size: 2rem;
    text-align: right;
    margin: 0;
    padding: 0;
  }

  .krisenstab-logo:hover {
    text-decoration: underline;
    text-decoration-color: blue;
    text-decoration-thickness: 1px;
    text-underline-offset: 5px;
  }

  section {
    /* max-width: 960px; */
    padding: 10px;
    margin: 0 auto;
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

    .time {
      padding: 0;
    }
    section {
      max-width: 100%;
    }
  }
</style>
