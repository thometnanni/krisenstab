const routes = [
	...Object.keys(import.meta.glob('/src/projects/*.md', { eager: false })).map(
		(path) => path.match(/([^/]+)\.md/)[1]
	),
	''
];

export function match(param) {
	return routes.includes(param);
}
