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
    ];

    let activeItems = writable([]);

    onMount(() => {
        document
            .querySelectorAll(".interactive, .project, .people")
            .forEach((item) => {
                item.addEventListener("mouseover", handleHover);
                item.addEventListener("mouseout", clearHover);
            });
    });

    function handleHover(event) {
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
    }

    function clearHover() {
        document.querySelectorAll(".intro *").forEach((elem) => {
            elem.classList.remove("highlighted", "faded");
        });
    }

    function toggleActive(event) {
        const itemId = event.target.id;
        activeItems.update((current) => {
            if (current.includes(itemId)) {
                return current.filter((id) => id !== itemId);
            } else {
                return [...current, itemId];
            }
        });
    }
</script>

<section class="intro">
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
                on:click={toggleActive}
                on:mouseover={handleHover}
                on:mouseout={clearHover}
            >
                {category}
            </button>{i < 2 ? (i === 1 ? " and " : ", ") : "."}
        {/each}
        We make
        {#each ["interactive-experiences", "spatial-installations", "printed-matter"] as key, i}
            <button
                class="interactive"
                id={key}
                data-related={data
                    .filter((d) => d.media.includes(key))
                    .map((d) => `${d.id} ${d.authors.join(" ")}`)
                    .join(" ")}
                on:click={toggleActive}
                on:mouseover={handleHover}
                on:mouseout={clearHover}
            >
                {key.replace("-", " ")}
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
                on:mouseover={handleHover}
                on:mouseout={clearHover}
            >
                {project.text}
            </a>{i < data.length - 1 ? ", " : "."}
        {/each}
    </p>
    <p>
        In our work we value collaboration and co-authorship, we are willing to
        share our knowledge and learn from our partners. It is important to us
        to create projects that are inclusive, resourceful, and relevant. We're
        also invested in open source development and in allowing others to reuse
        and remix our work.
    </p>
    <p>
        We always welcome general inquiries and friendly hellos. Contact us
        here, or find us at our favourite spots around the city.
    </p>
    <p>XOXO,</p>
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
                on:mouseover={handleHover}
                on:mouseout={clearHover}
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
        max-height: 100vh;
    }

    :global(.project) {
        cursor: pointer;
        color: var(--highlight, rgb(187, 187, 187));
        transition: color 0.3s;
    }

    :global(.interactive),
    :global(.people) {
        cursor: pointer;
        color: var(--highlight);
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
    }
</style>
