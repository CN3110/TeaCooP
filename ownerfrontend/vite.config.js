import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@mui\/material\/(.*)/,
        replacement: '@mui/material/$1',
      },
      {
        find: /^@mui\/icons-material\/(.*)/,
        replacement: '@mui/icons-material/$1',
      },
    ],
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },

  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
});