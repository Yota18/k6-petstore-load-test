import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: resolve(__dirname),
    build: {
        lib: {
            entry: {
                performance: resolve(__dirname, 'scenarios/performance-test.ts'),
                stress: resolve(__dirname, 'scenarios/stress-test.ts'),
            },
            formats: ['es'],
            fileName: (format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            external: [
                /^k6(\/.*)?$/,
                /^https:\/\/.*/
            ],
        },
        outDir: resolve(__dirname, '../dist/tests'),
        emptyOutDir: true,
    },
});
