import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.wikimint.com", // REQUIRED for sitemap
  trailingSlash: "never",
  output: "static",
  compressHTML: true,
  build: {
    format: "file", // output flat .html files
  },
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      entryLimit: 5000, // ✅ valid
    }),
  ],
  markdown: {
    remarkPlugins: [
      [
        "remark-toc",
        {
          heading: null,
          tight: true,
        },
      ],
    ],
  },
});
