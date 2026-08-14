import { render } from 'svelte/server';
import { getSeo } from '$lib/seo';

// export const prerender = true;
// export const csr = false;

export async function load({ params }) {
	const projects = await parseModules(import.meta.glob('/src/projects/*.md', { eager: false }));
	const letters = await parseModules(import.meta.glob('/src/letters/*.md', { eager: false }));
	const topics = await parseModules(import.meta.glob('/src/topics/*.md', { eager: false }));

	const tables = await getTables();

	// a topic is the curated letter shown in place of a project's plain
	// title/description, matched to its project by filename
	const topicByProjectName = Object.fromEntries(topics.map((t) => [t.name, t.html]));
	const sortedProjects = projects
		.toSorted((a, b) => (a.order ?? 99) - (b.order ?? 99))
		.map((p) => ({ ...p, topic: topicByProjectName[p.name] }));
	const sortedLetters = letters.toSorted((a, b) => (`${a.name}` < `${b.name}` ? 1 : -1));
	const project = sortedProjects.find(({ name }) => name === params.project);

	return { projects: sortedProjects, letters: sortedLetters, seo: getSeo(project), tables };
}

async function parseModules(modules) {
	return Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const mod = await resolver();
			const { html } = await render(mod.default);
			return {
				html,
				name: path.match(/([^/]+)\.md/)[1],
				...mod.metadata
			};
		})
	);
}

async function getTables() {
	try {
		return await fetch('https://api.are.na/v2/channels/tables-gdt5rzhdcii?per=100')
			.then((res) => res.json())
			.then((d) =>
				d.contents
					.filter(({ class: className }) => className === 'Image')
					.map(({ image, id }) => ({ url: image.square.url, id }))
					.toReversed()
			);
		// eslint-disable-next-line no-unused-vars
	} catch (_) {
		return [];
	}
}
