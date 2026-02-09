import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';

export const prerender = true;

export async function entries() {
	const projects = await parseModules(import.meta.glob('/src/projects/*.md', { eager: false }));
	return sortProjects(projects).map((project) => ({ slug: project.slug }));
}

export async function load({ depends, params }) {
	depends('src:projects');
	depends('src:letters');

	const projects = sortProjects(
		await parseModules(import.meta.glob('/src/projects/*.md', { eager: false }))
	);
	const letters = sortLetters(
		await parseModules(import.meta.glob('/src/letters/*.md', { eager: false }))
	);

	const projectIndex = projects.findIndex((project) => project.slug === params.slug);
	if (projectIndex === -1) {
		throw error(404, 'Project not found');
	}

	const project = projects[projectIndex];
	const letter = letters.length > 0 ? letters[projectIndex % letters.length] : null;

	return {
		project,
		letter,
		otherProjects: projects.filter((item) => item.slug !== project.slug),
		otherLetters: letter ? letters.filter((item) => item.slug !== letter.slug) : letters
	};
}

async function parseModules(modules) {
	return Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const mod = await resolver();
			const { html } = await render(mod.default);
			const metadata = mod.metadata ?? {};

			return {
				html,
				name: path.match(/([^/]+)\.md/)?.[1] ?? path,
				...metadata,
				slug: metadata.slug ?? path.match(/([^/]+)\.md/)?.[1] ?? path,
				left: metadata.left ? normalizeMediaObject(metadata.left) : metadata.left,
				right: metadata.right ? normalizeMediaObject(metadata.right) : metadata.right
			};
		})
	);
}

function sortProjects(projects) {
	return projects.toSorted((a, b) => (`${a.date}` < `${b.date}` ? 1 : -1)).toSorted(stickySort);
}

function sortLetters(letters) {
	return letters.toSorted((a, b) => (`${a.name}` < `${b.name}` ? 1 : -1)).toSorted(stickySort);
}

function stickySort(a, b) {
	if (a.sticky === b.sticky) return 0;
	return a.sticky ? -1 : 1;
}

function normalizeMediaObject(asset) {
	return {
		...asset,
		src: normalizeMediaSrc(asset.src)
	};
}

function normalizeMediaSrc(src) {
	if (typeof src !== 'string') return src;
	if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) return src;
	return `/${src.replace(/^\.\//, '')}`;
}
