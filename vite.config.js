import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const fullReloadOnMdChanges = {
	handleHotUpdate({ server /*, file*/ }) {
		// if (file.endsWith('.md')) {
		server.ws.send({ type: 'full-reload' });
		// }
		return [];
	}
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), fullReloadOnMdChanges]
});
