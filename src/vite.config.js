import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from '@svgr/rollup'

export default defineConfig({
    plugins: [svgr(), react()],
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.js$/,  // parse JSX in .js files
    },
});
