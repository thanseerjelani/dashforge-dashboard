// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the Tailwind CSS plugin
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3011,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },

  // Explicitly define environment variables (optional but helpful)
  define: {
    // This can help with environment variable issues
    __DEV__: JSON.stringify(true),
  },
  // Ensure env files are loaded
  envDir: '.', // Look for env files in root directory
})