<script>
    import { onMount } from "svelte";

    onMount(() => {
        document.querySelectorAll(".project").forEach((link) => {
            link.addEventListener("mouseover", handleMouseOver);
            link.addEventListener("mouseout", handleMouseOut);
        });
    });

    function handleMouseOver(event) {
        const relatedProjects = event.target
            .getAttribute("data-projects")
            .split(" ");

        document.querySelectorAll("article *").forEach((elem) => {
            if (
                elem.classList.contains("project") &&
                (relatedProjects.includes(elem.id) || elem === event.target)
            ) {
                // Keep related project links and the hovered link highlighted
                elem.setAttribute("data-highlight", "true");
                elem.classList.remove("faded");
            } else {
                // Fade out all other elements
                elem.classList.add("faded");
            }
        });
    }

    function handleMouseOut() {
        document.querySelectorAll("article *").forEach((elem) => {
            elem.removeAttribute("data-highlight");
            elem.classList.remove("faded");
        });
    }
</script>

<section>
    <p>Welcome to our website,</p>

    <p>
        We are a collaborative research and design studio working between art,
        journalism, technology, and culture.
    </p>

    <p>
        We are designers and developers building prototypes, installations,
        printed matters and interactive experiences focusing on complex systems.
    </p>
    <p>
        You might have encountered our collective, or individual work already in
        the past, if you: are interested in <a
            href="open-source-tools"
            id="open-source-tools"
            class="project"
            data-projects="spacecraft-cemetery upper-xingu satellite-analysis"
            >open source tools</a
        >
        and … ; have been looking at the
        <a
            href="spacecraft-cemetery"
            id="spacecraft-cemetery"
            class="project"
            data-projects="open-source-tools">spacecraft cemetery</a
        >
        or at the
        <a
            href="upper-xingu"
            id="upper-xingu"
            class="project"
            data-projects="open-source-tools"
            >Upper Xingu south of the Amazon river</a
        >. Perhaps you have seen
        <a
            href="satellite-analysis"
            id="satellite-analysis"
            class="project"
            data-projects="open-source-tools">satellite analysis</a
        > on newspapers,
    </p>
    <p>
        We enjoy exploring new ideas, collaborating, and creating together. We
        are always happy to receive general inquiries—or even just a friendly
        hello.
    </p>
    <p>
        Feel free to reach out, share a drawing, or find us at our favorite
        spots around the city.
    </p>

    <p>Cheers!</p>
    <!-- <p>Cheers,<br />Krisenstab</p> -->
</section>

<style>
    :global(.project):not([data-highlight="true"]) {
        color: var(--highlite);
    }

    :global(.project[data-highlight="true"]) {
        color: black;
    }

    :global(.faded) {
        color: var(--highlite);
        transition: color 0.3s;
    }
</style>
