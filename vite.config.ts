import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(async ({ command }) => {
  const plugins: any[] = [react(), tailwindcss()];
  
  if (command === 'serve') {
    process.env.VITE_DEV_SERVER = "true";
    const m = await import('./server');
    plugins.push({
      name: 'express-api-plugin',
      configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: any) => {
          if (req.url && req.url.startsWith('/api')) {
            m.app(req, res, next);
          } else {
            next();
          }
        });
      }
    });
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
