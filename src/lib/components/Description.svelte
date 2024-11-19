<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        else if (hour < 18) return "Good afternoon";
        else return "Good evening";
    }

    let greetingMessage = getGreeting();

    const data = [
        {
            id: "vantage",
            text: "democratised investigative photo matching",
            domain: "journalism, technology",
            media: "interactive-experiences",
            authors: ["giacomo", "fidel"],
            link: "https://vantage.thometnanni.net/",
        },
        {
            id: "xingu",
            text: "told the entangled stories of the Kuikuro",
            domain: "culture",
            media: "interactive-experiences, spatial-installations",
            authors: ["fidel"],
            link: "https://amazoniafuturelab.fh-potsdam.de/",
        },
        {
            id: "dither",
            text: "brought fast dithering to the web",
            domain: "technology",
            media: "interactive-experiences",
            authors: ["fidel"],
            link: "https://fidelthomet.github.io/dither-dither/",
        },
        {
            id: "tracing",
            text: "explained the technology behind covid tracing",
            domain: "technology, journalism",
            media: "interactive-experiences",
            authors: ["fidel"],
            link: "https://tracing.ft0.ch/#/",
        },
        {
            id: "new-normal",
            text: "invited people to speculate on local futures",
            domain: "culture",
            media: "interactive-experiences",
            authors: ["fidel"],
            link: "https://newnormalneighbourhood.org/",
        },
        {
            id: "not-a-network",
            text: "wrote dispersive poetry",
            domain: "culture",
            media: "interactive-experiences",
            authors: ["fidel", "giacomo"],
            link: "https://not-a-network.thometnanni.net/",
        },
        {
            id: "refa",
            text: "juxtaposed essaying to graph-based representations",
            domain: "culture",
            media: "interactive-experiences",
            authors: ["giacomo"],
            link: "https://refareader.fh-potsdam.de/",
        },
        {
            id: "oceanic",
            text: "georeferenced the space junk that fell into the Spacecraft Cemetery",
            domain: "culture, journalism",
            media: "spatial-installations, interactive-experiences",
            authors: ["julian", "giacomo"],
            link: "oceanic-pole",
        },
        {
            id: "archives",
            text: "structured and visualised cultural archives",
            domain: "culture",
            media: "interactive-experiences",
            authors: ["giacomo", "julian"],
            link: "https://bake.nieuweinstituut.nl/",
        },
        {
            id: "airwars",
            text: "analysed IDF tweets during the Gaza conflict",
            domain: "journalism",
            media: "interactive-experiences",
            authors: ["giacomo"],
            link: "https://idf-tweets-gaza.airwars.org/",
        },
        {
            id: "Teaching",
            text: "taught students in coding, data work, and design",
            domain: "",
            media: "",
            authors: ["giacomo", 'julian,"fidel'],
            link: "",
        },
        {
            id: "modes-of-perception",
            text: "reconstructed and narrated the role of satellites surveillance for EU border protection",
            domain: "technology, journalism",
            media: "spatial-installations",
            authors: ["julian"],
            link: "https://www.youtube.com/watch?v=Wji2Ic4ciOc",
        },
        {
            id: "ashes",
            text: "curated and visualised the Smithsonian Institution’s main database of active volcanoes around the world",
            domain: "culture",
            media: "printed matter",
            authors: ["julian"],
            link: "ashes",
        },
        {
            id: "Planet",
            text: "visualised data of humanitarian conflicts and climate disasters for global news coverage",
            domain: "journalism",
            media: "interactive-experiences",
            authors: ["julian"],
            link: "",
        },
    ]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    let activeFilter = writable(null);

    function handleFilterClick(event) {
        const filterId = event.target.id;
        activeFilter.update((current) =>
            current === filterId ? null : filterId,
        );
    }

    function handleHover(event) {
        activeFilter.subscribe((current) => {
            if (current) return;
            const relatedItems = event.target
                .getAttribute("data-related")
                .split(" ");
            document.querySelectorAll(".intro *").forEach((elem) => {
                if (relatedItems.includes(elem.id) || elem === event.target) {
                    elem.classList.add("highlighted");
                    elem.classList.remove("faded");
                } else {
                    elem.classList.add("faded");
                }
            });
        })();
    }

    function clearHover() {
        activeFilter.subscribe((current) => {
            if (current) return;
            document.querySelectorAll(".intro *").forEach((elem) => {
                elem.classList.remove("highlighted", "faded");
            });
        })();
    }

    onMount(() => {
        document.addEventListener("click", (event) => {
            const isFilter = event.target.closest(".interactive");
            if (!isFilter) {
                activeFilter.set(null);
                clearHover();
            }
        });
    });
</script>

<section class="intro" class:filter-active={$activeFilter !== null}>
    <p>{greetingMessage},</p>
    <p>
        Starting in spring 2025, we are a research and design studio working at
        the intersection of
        {#each ["technology", "journalism", "culture"] as category, i}
            <button
                class="interactive"
                id={category}
                data-related={data
                    .filter((d) => d.domain.includes(category))
                    .map((d) => `${d.id} ${d.authors.join(" ")}`)
                    .join(" ")}
                class:active={$activeFilter === category}
                on:click={handleFilterClick}
                on:mouseover={() =>
                    $activeFilter === null && handleHover(event)}
                on:mouseout={() => $activeFilter === null && clearHover()}
            >
                {category}
            </button>{i < 2 ? (i === 1 ? " and " : ", ") : "."}
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
                class:active={$activeFilter === media}
                on:click={handleFilterClick}
                on:mouseover={() =>
                    $activeFilter === null && handleHover(event)}
                on:mouseout={() => $activeFilter === null && clearHover()}
            >
                {media.replace("-", " ")}
            </button>{i < 2 ? (i === 1 ? " and " : ", ") : "."}
        {/each}
    </p>
    <p>
        Before forming Krisenstab, we
        {#each data as project, i (project.id)}
            <a
                href={project.link}
                id={project.id}
                class="project"
                data-related={[
                    project.domain,
                    project.media,
                    ...project.authors,
                ].join(" ")}
                target={project.link.includes("http") ? "_blank" : "_self"}
                on:mouseover={() =>
                    $activeFilter === null && handleHover(event)}
                on:mouseout={() => $activeFilter === null && clearHover()}
            >{project.text}</a>{i < data.length - 1 ? ", " : "."}
        {/each}
    </p>
    <p>
        We always welcome general inquiries and friendly hellos. Contact us
        here, or find us at our favourite spots around the city.
    </p>
    <p>Cheers,</p>
    <p>
        {#each ["julian", "giacomo", "fidel"] as person, i (person)}
            <span
                id={person}
                class="people"
                data-related={data
                    .filter((d) => d.authors.includes(person))
                    .map((d) => `${d.id} ${d.domain} ${d.media}`)
                    .flat()
                    .join(" ")}
                on:mouseover={() =>
                    $activeFilter === null && handleHover(event)}
                on:mouseout={() => $activeFilter === null && clearHover()}
            >
                {person.charAt(0).toUpperCase() + person.slice(1)}
            </span>{i < 2 ? (i === 1 ? " and " : ", ") : "."}
        {/each}
    </p>
</section>

<style>
    section {
        max-width: 840px;
        padding-top: 30px;
        overflow-y: auto;
        /* max-height: 100vh; */
    }

    :global(.interactive),
    :global(.project),
    :global(.people) {
        cursor: pointer;
        color: var(--highlight, rgb(165, 165, 165));
        transition: color 0.3s;
    }

    :global(.interactive) {
        background-color: white;
        color: black;
        border: 1px solid black;
        padding: 2px 5px;
        border-radius: 3px;
        vertical-align: middle;
    }

    :global(.interactive.active) {
        background-color: black;
        color: white;
    }

    section.filter-active :global(.interactive:not(.active)) {
        pointer-events: none;
        opacity: 0.5;
    }

    :global(.interactive:hover) {
        background-color: black;
        color: white;
    }

    :global(.highlighted) {
        color: black;
    }

    :global(.faded) {
        color: var(--faded-color, #bbb);
        transition: color 0.3s;
        cursor: not-allowed;
    }
</style>
