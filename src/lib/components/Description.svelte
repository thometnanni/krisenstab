<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";

    let data = [];
    let activeFilter = null;
    let hoveredItems = new Set();
    let effectiveItems = new Set();

    let fading = false;

    onMount(async () => {
        const response = await fetch("projects.json");
        data = await response.json();
    });

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }

    let greetingMessage = getGreeting();

    function handleFilterClick(event) {
        const filterId = event.currentTarget.id;
        activeFilter = activeFilter === filterId ? null : filterId;
    }

    function handleHover(event) {
        if (activeFilter) return;
        const elem = event.currentTarget;
        const { id, related } = getElementData(elem);
        hoveredItems = new Set([...related, id]);
    }

    function handleOut() {
        if (!activeFilter) {
            hoveredItems = new Set();
        }
    }

    function getElementData(elem) {
        const dataRelated = elem.getAttribute("data-related") || "";
        const related = dataRelated.trim()
            ? dataRelated.trim().split(/\s+/)
            : [];
        return { id: elem.id, related };
    }

    $: {
        if (activeFilter) {
            const lockedElem =
                typeof document !== "undefined"
                    ? document.getElementById(activeFilter)
                    : null;
            if (!lockedElem) {
                effectiveItems = new Set();
            } else {
                const { id, related } = getElementData(lockedElem);
                effectiveItems = new Set([...related, id]);
            }
        } else {
            effectiveItems = hoveredItems;
        }
    }

    $: fading = activeFilter !== null || hoveredItems.size > 0;

    function shouldShowX(id) {
        const categories = ["technology", "journalism", "culture"];
        const mediaItems = [
            "interactive-experiences",
            "spatial-installations",
            "printed matter",
        ];
        return categories.includes(id) || mediaItems.includes(id);
    }
</script>

{#if data.length > 0}
    <section
        class="intro"
        class:fading
        class:filter-active={activeFilter !== null}
    >
        <p>{greetingMessage},</p>
        <p>
            Starting in spring 2025, we are a research and design studio working
            at the intersection of
            {#each ["technology", "journalism", "culture"] as category, i}
                <button
                    class="interactive"
                    id={category}
                    data-related={data
                        .filter((d) => d.domain.includes(category))
                        .map((d) => `${d.id} ${d.authors.join(" ")}`)
                        .join(" ")}
                    class:active={activeFilter === category}
                    on:click={handleFilterClick}
                    on:mouseover={handleHover}
                    on:mouseout={handleOut}
                    class:highlighted={effectiveItems.has(category)}
                >
                    {#if activeFilter === category && shouldShowX(category)}
                        {category} (x)
                    {:else}
                        {category}
                    {/if}
                </button>
                {i < 2 ? (i === 1 ? " and " : ", ") : "."}
            {/each}
            We make
            {#each ["interactive-experiences", "spatial-installations", "printed matter"] as media, i}
                <button
                    class="interactive"
                    id={media}
                    data-related={data
                        .filter((d) => d.media.includes(media))
                        .map((d) => `${d.id} ${d.authors.join(" ")}`)
                        .join(" ")}
                    class:active={activeFilter === media}
                    on:click={handleFilterClick}
                    on:mouseover={handleHover}
                    on:mouseout={handleOut}
                    class:highlighted={effectiveItems.has(media)}
                >
                    {#if activeFilter === media && shouldShowX(media)}
                        {media.replace("-", " ")} (x)
                    {:else}
                        {media.replace("-", " ")}
                    {/if}
                </button>
                {i < 2 ? (i === 1 ? " and " : ", ") : "."}
            {/each}
        </p>
        <p>
            Before forming Krisenstab, we
            {#each data as project, i (project.id)}
                <a
                    href={project.link.includes("http")
                        ? project.link
                        : `${base}/${project.link}`}
                    id={project.id}
                    class="project"
                    data-related={[
                        ...project.domain,
                        ...project.media,
                        ...project.authors,
                    ].join(" ")}
                    target={project.link.includes("http") ? "_blank" : "_self"}
                    on:mouseover={handleHover}
                    on:mouseout={handleOut}
                    class:highlighted={effectiveItems.has(project.id)}
                >
                    {project.text}
                </a>
                {i < data.length - 1 ? ", " : "."}
            {/each}
        </p>
        <p>
            We always welcome general inquiries and friendly hellos. Contact us
            here, or find us at our favourite spots around the city.
        </p>
        <p>
            Cheers, <br />
            {#each ["julian", "giacomo", "fidel"] as person, i (person)}
                <span
                    id={person}
                    class="people interactive project"
                    data-related={data
                        .filter((d) => d.authors.includes(person))
                        .map(
                            (d) =>
                                `${d.id} ${d.domain.join(" ")} ${d.media.join(" ")}`,
                        )
                        .join(" ")}
                    class:active={activeFilter === person}
                    on:click={() => {
                        activeFilter = activeFilter === person ? null : person;
                    }}
                    on:mouseover={handleHover}
                    on:mouseout={handleOut}
                    class:highlighted={effectiveItems.has(person)}
                >
                    {person.charAt(0).toUpperCase() + person.slice(1)}
                </span>
                {i < 2 ? (i === 1 ? " and " : ", ") : "."}
            {/each}
        </p>
    </section>
{/if}

<style>
    section {
        max-width: 840px;
        padding-top: 30px;
        overflow-y: auto;
    }

    section.filter-active :global(.highlighted) {
        pointer-events: auto;
    }

    .interactive,
    .project,
    .people {
        cursor: pointer;
        color: var(--highlight, rgb(165, 165, 165));
        transition: color 0.3s;
    }

    .interactive {
        background-color: white;
        color: black;
        border: 1px solid black;
        padding: 0 4px;
        border-radius: 3px;
        vertical-align: middle;
        font-size: 1rem;
    }

    .people {
        font-size: unset;
    }

    .interactive.active {
        background-color: black;
        color: white !important;
    }

    .people.interactive,
    .people.interactive.active {
        background-color: unset !important;
        border: unset !important;
        padding: 0;
        vertical-align: baseline;
    }

    .people.interactive.active,
    .people.interactive:hover {
        color: black !important;
    }

    .interactive:hover {
        background-color: black;
        color: white !important;
    }

    .highlighted {
        color: black;
    }

    .intro > * {
        display: inline-table;
    }

    .intro.fading * {
        color: var(--faded-color, #bbb);
        pointer-events: none;
    }

    .intro.fading .highlighted {
        color: black;
        pointer-events: auto;
        cursor: pointer;
    }
</style>
