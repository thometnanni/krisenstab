<script>
    export let data;
</script>

<article>
    {#if data?.meta.title}
        <section>
            <h1>
                {@html data?.meta.title}
            </h1>
            <p>
                {@html data?.meta.snippet}
            </p>
        </section>
    {/if}
    <div>
        {@html data?.text}
    </div>
</article>

<style>
    article {
        /* max-height: 100vh;
        overflow: scroll; */
    }

    h1 {
        color: black;
    }

    p {
        color: gainsboro;
    }

    section {
        min-height: 200px;
    }

    :global(img),
    :global(video) {
        width: 100%;
    }
</style>
