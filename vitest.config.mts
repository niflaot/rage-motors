import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/** Vitest configuration for colocated React component tests. */
const config = defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/test-setup.ts'],
  },
})

export default config
