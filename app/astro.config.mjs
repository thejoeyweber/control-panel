// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db()],
  output: 'server', // Enable server-side rendering
  // Note: TypeScript may show errors for viewTransitions depending on your Astro version
  // You can ignore them if the functionality is working in the browser
  experimental: {
    clientPrerender: true
  }
});