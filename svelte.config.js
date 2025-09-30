import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
const dev = process.argv.includes("dev");

const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],
  preprocess: [mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter(),
    paths: { base: dev ? "" : process.env.BASE_PATH },
    alias: {
      "@components": "src/components",
      "@stores": "src/routes/stores.js",
      "@utils": "src/utils.js",
    },
  },
};
export default config;
