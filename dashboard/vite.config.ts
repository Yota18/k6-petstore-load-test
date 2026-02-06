import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    root: resolve(__dirname),
    base: process.env.CI ? '/k6-petstore-load-test/' : '/',
    build: {
        outDir: resolve(__dirname, '../dist/dashboard'),
        emptyOutDir: true,
    },
});
