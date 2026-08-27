import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'motion',
              test: /node_modules[\\/](?:gsap|lenis|framer-motion|motion-dom|motion-utils)/,
              priority: 20,
              includeDependenciesRecursively: true,
            },
            {
              name: 'react',
              test: /node_modules[\\/](?:react|react-dom|scheduler)/,
              priority: 15,
              includeDependenciesRecursively: true,
            },
          ],
        },
      },
    },
  },
})
