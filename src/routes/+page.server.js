import { render } from 'svelte/server';

export const prerender = true;
// export const csr = false;

export async function load({ depends }) {
	depends('src:projects');
	const projects = await parseModules(import.meta.glob('/src/projects/*.md', { eager: false }));
	const letters = await parseModules(import.meta.glob('/src/letters/*.md', { eager: false }));

	const sortedProjects = projects
		.toSorted((a, b) => (`${a.date}` < `${b.date}` ? 1 : -1))
		.toSorted(stickySort);
	const sortedLetters = letters
		.toSorted((a, b) => (`${a.name}` < `${b.name}` ? 1 : -1))
		.toSorted(stickySort);

	return { projects: sortedProjects, letters: sortedLetters };
}

async function parseModules(modules) {
	return Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const mod = await resolver();
			const { html } = await render(mod.default);
			const name = path.match(/([^/]+)\.md/)[1];
			return {
				html,
				name,
				...mod.metadata,
				slug: mod.metadata?.slug ?? name
			};
		})
	);
}

function stickySort(a, b) {
	if (a.sticky === b.sticky) return 0;
	return a.sticky ? -1 : 1;
}
