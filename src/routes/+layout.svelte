<article>
    <div class="title">
        <a href="/">
            <span>K</span>
            <span>r</span>
            <span>i</span>
            <span>s</span>
            <span>e</span>
            <span>n</span>
            <span>s</span>
            <span>t</span>
            <span>a</span>
            <span>b</span>
        </a>
    </div>
    <section>
        <slot />
    </section>
</article>

<style>
    :root {
        --highlite: gainsboro;
        --color-1: blue;
    }

    :global(body) {
        font-family: Basel, Arial, Helvetica, sans-serif;
        font-size: 24px;
        line-height: 26px;
        height: 100vh;
        padding: 0;
        margin: 0;
        -webkit-font-smoothing: antialiased;
        background-color: white;
    }

    article {
        display: flex;
        gap: 1ch;
        height: 100%;
    }

    .title {
        flex: 1;
        max-width: 200px;
        background-color: rgb(246, 246, 246);
        width: 100%;
        position: sticky;
        top: 0;
        padding: 0 5px;
        text-align: center;
    }

    .title > a {
        display: flex;
        align-items: flex-end;
        height: 100%;
        justify-content: space-between;
        font-weight: 400;
        color: black;
        font-size: 14px;
    }

    .title span {
        display: inline-block;
    }

    section {
        flex: 4;
        max-width: 840px;
        min-width: 360px;
        padding: 10px;
        overflow: scroll;
        max-height: 100vh;
    }

    :global(h1),
    :global(p) {
        margin: 0;
        margin-bottom: 1ex;
        font-weight: normal;
        color: black;
    }

    :global(h1) {
        font-size: 1.2em;
        margin-bottom: 0.5ex;
    }

    :global(a) {
        text-decoration: none;
        color: inherit;
        position: relative;
        cursor: pointer;
    }

    @font-face {
        font-family: "Basel";
        src: url("/Basel-Grotesk-Book-Trial.otf") format(opentype);
        font-weight: normal;
        font-style: normal;
    }

    @font-face {
        font-family: "Basel";
        src: url("/Basel-Grotesk-Bold-Trial.otf") format(opentype);
        font-weight: bold;
        font-style: normal;
    }

    :global(::selection) {
        background-color: var(--color-1);
        color: white;
    }
</style>
