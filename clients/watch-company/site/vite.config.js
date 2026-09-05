import { defineConfig } from 'vite';

// This project sits inside a repository whose root carries a Next.js/Tailwind
// PostCSS config. Passing an inline (empty) PostCSS config stops Vite walking
// up and loading it — this site is plain CSS and needs no PostCSS pipeline.
export default defineConfig({
  css: { postcss: {} },
  build: { assetsDir: 'assets' },
});
