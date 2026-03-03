const baseUrl = 'https://krisenstab.net';

const seoDefaults = {
	name: 'krisenstab',
	description:
		'We are a design studio working at the intersection of technology, journalism and culture.',
	image: 'cover.jpg'
};

export function getSeo(project) {
	const ogImage =
		project?.og === 'left'
			? project?.left?.src
			: project?.og === 'right'
				? project?.right?.src
				: typeof project?.og === 'string'
					? project.og
					: seoDefaults.image;

	return {
		name: seoDefaults.name,
		title: project?.title ? `${project.title} | ${seoDefaults.name}` : seoDefaults.name,
		description: project?.description || seoDefaults.description,
		image: `${baseUrl}/${ogImage.replace(/^\//, '')}`
	};
}
