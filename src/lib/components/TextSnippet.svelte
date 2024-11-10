<script>
    export let data;
</script>

{#if data?.meta.title}
    <section>
        <h1>
            {@html data?.meta.title}
        </h1>
        <p>
            {@html data?.meta.snippet}
        </p>
    </section>

    <div>
        {@html data?.text}
    </div>
{:else}
    <p>
        What are you doing here?
    </p>
{/if}

<style>
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
