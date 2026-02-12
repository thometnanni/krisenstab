import { render } from 'svelte/server';
import { getSeo } from '$lib/seo';

export const prerender = true;
// export const csr = false;

export async function load({ params }) {
	const projects = await parseModules(import.meta.glob('/src/projects/*.md', { eager: false }));
	const letters = await parseModules(import.meta.glob('/src/letters/*.md', { eager: false }));

	const sortedProjects = projects
		.toSorted((a, b) => (`${a.date}` < `${b.date}` ? 1 : -1))
		.toSorted(featuredSort);
	const sortedLetters = letters
		.toSorted((a, b) => (`${a.name}` < `${b.name}` ? 1 : -1))
		.toSorted(featuredSort);
	const project = sortedProjects.find(({ name }) => name === params.project);

	return { projects: sortedProjects, letters: sortedLetters, seo: getSeo(project) };
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

function featuredSort(a, b) {
	if (a.featured === b.featured) return 0;
	return a.featured ? -1 : 1;
}
