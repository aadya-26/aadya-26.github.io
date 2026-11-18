import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeStory from './src/lib/rehype-story.mjs';

export default defineConfig({
  site: 'https://aadya-26.github.io',
  markdown: {
    processor: unified({ rehypePlugins: [rehypeStory] }),
  },
});
