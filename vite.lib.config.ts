// vite.config.js
import { resolve } from 'path' // npm i -D @types/node
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts' // npm i -D vite-plugin-dts

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/core/plum-chart.ts'),
            name: 'plumchart',
            fileName: "plumchart",
            // fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd', 'cjs', 'iife'],
        },
        rollupOptions: {
            output: {
                assetFileNames: "plumchart.[ext]",
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    plugins: [dts({
        rollupTypes: true,
    })]
})