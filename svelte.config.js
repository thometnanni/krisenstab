import adapter from "@sveltejs/adapter-vercel";
// import preprocess from 'svelte-preprocess';
import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],
  preprocess: [mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter(),
    paths: {
      base: dev ? "" : process.env.BASE_PATH,
    },
    alias: {
      "@components": "src/components",
      "@stores": "src/routes/stores.js",
      "@utils": "src/utils.js",
    },
  },
};

export default config;
