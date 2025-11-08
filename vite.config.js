import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import config from './app.config.js';
import { status } from 'minecraft-server-util';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedStatus = null;
let lastFetch = 0;
const CACHE_DURATION = 30000;

async function getServerStatus() {
  const now = Date.now();
  
  if (cachedStatus && (now - lastFetch) < CACHE_DURATION) {
    return cachedStatus;
  }
  
  try {
    const response = await status(config.public.serverIp, config.public.serverPort, { timeout: 5000 });
    
    cachedStatus = {
      online: true,
      players: {
        online: response.players.online,
        max: response.players.max
      },
      version: response.version.name,
      motd: response.motd.clean || response.motd.raw
    };
    
    lastFetch = now;
    return cachedStatus;
  } catch (error) {
    console.error('Server status error:', error.message);
    
    cachedStatus = {
      online: false,
      players: {
        online: 0,
        max: 0
      },
      error: error.message
    };
    
    lastFetch = now;
    return cachedStatus;
  }
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  },
  plugins: [
    {
      name: 'api-routes',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/config') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(config.public));
            return;
          }
          
          if (req.url === '/api/server-status') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            try {
              const status = await getServerStatus();
              res.end(JSON.stringify(status));
            } catch (error) {
              console.error('Server status error:', error);
              res.end(JSON.stringify({
                online: false,
                players: { online: 0, max: 0 },
                error: error.message
              }));
            }
            return;
          }
          
          next();
        });
      }
    }
  ],
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
