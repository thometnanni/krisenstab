<script>
    import TextSnippet from "$lib/components/TextSnippet.svelte";
    import { page } from "$app/stores";
    export let data;

    let datum = data.posts.find((d) => d.path.includes($page.params.slug));

</script>

<section>
    {#if datum}
        <TextSnippet data={datum} />
    {:else}
        <TextSnippet />
    {/if}
</section>

<style>
</style>
