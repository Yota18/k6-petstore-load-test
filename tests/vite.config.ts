import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
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
        outDir: '../dist/tests',
        emptyOutDir: true,
    },
});
