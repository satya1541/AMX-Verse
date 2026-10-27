import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const port = Number(process.env.PORT || '5173');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port,
    host: '0.0.0.0',
    allowedHosts: ['amxverse.com', '.amxverse.com', 'amxverse.in', '.amxverse.in'],
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: ['amxverse.com', '.amxverse.com', 'amxverse.in', '.amxverse.in'],
  },
});
