import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    middlewares: {
      apply: (app) => {
        app.use((req, res, next) => {
          if (req.url === '/success') {
            const html = readFileSync(resolve(__dirname, 'template/pages/success.html'), 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
          }
          if (req.url === '/cancel') {
            const html = readFileSync(resolve(__dirname, 'template/pages/cancel.html'), 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
          }
          next();
        });
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        success: resolve(__dirname, 'template/pages/success.html'),
        cancel: resolve(__dirname, 'template/pages/cancel.html')
      }
    }
  }
});
