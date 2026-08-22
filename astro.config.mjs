import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://romicaubarrere.github.io',
  base: '/personal',
  output: 'static',
  build: {
    format: 'file',
    inlineStylesheets: 'never'
  },
  integrations: [react()]
});
