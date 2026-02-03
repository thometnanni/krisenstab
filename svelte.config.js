import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			smartypants: {
				dashes: 'oldschool'
			}
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
