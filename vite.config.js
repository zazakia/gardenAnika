import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    base: './',
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true
    }
}); 