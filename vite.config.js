import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import config from './app.config.js';
import { status } from 'minecraft-server-util';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedStatus = null;
let lastFetch = 0;
const CACHE_DURATION = 30000;

let cachedTopCustomer = null;
let topCustomerLastFetch = 0;
const TOP_CUSTOMER_CACHE = 300000;

let cachedCartCalculations = new Map();
const CART_CACHE_DURATION = 30000;

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

async function validateGiftCard(code) {
  try {
    const response = await fetch(`https://plugin.tebex.io/gift-cards/lookup/${code}`, {
      headers: {
        'X-Tebex-Secret': config.private.tebex.privateKey
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { valid: false, error: 'Gift card not found' };
      }
      return { valid: false, error: 'Failed to validate gift card' };
    }
    
    const data = await response.json();
    return {
      valid: true,
      balance: data.balance || 0,
      currency: data.currency || 'USD'
    };
  } catch (error) {
    console.error('Gift card validation error:', error);
    return { valid: false, error: 'Failed to validate gift card' };
  }
}

async function calculateCartTotal(packages) {
  const cacheKey = packages.map(p => `${p.id}-${p.quantity || 1}`).sort().join('|');
  const now = Date.now();
  
  const cached = cachedCartCalculations.get(cacheKey);
  if (cached && (now - cached.timestamp) < CART_CACHE_DURATION) {
    cached.timestamp = now;
    return cached.data;
  }
  
  try {
    const basketResponse = await fetch(`https://headless.tebex.io/api/accounts/${config.public.tebex.publicToken}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: 'temp_user',
        return_url: config.public.urls.completeUrl,
        cancel_url: config.public.urls.cancelUrl
      })
    });
    
    if (!basketResponse.ok) {
      throw new Error('Failed to create basket');
    }
    
    const basket = await basketResponse.json();
    const basketIdent = basket.data.ident;
    
    for (const pkg of packages) {
      await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          package_id: pkg.id,
          quantity: pkg.quantity || 1
        })
      });
    }
    
    const finalBasketResponse = await fetch(`https://headless.tebex.io/api/accounts/${config.public.tebex.publicToken}/baskets/${basketIdent}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!finalBasketResponse.ok) {
      throw new Error('Failed to fetch basket totals');
    }
    
    const finalBasket = await finalBasketResponse.json();
    const result = {
      subtotal: finalBasket.data.base_price || 0,
      tax: finalBasket.data.sales_tax || 0,
      total: finalBasket.data.total_price || 0,
      currency: finalBasket.data.currency || 'USD'
    };
    
    cachedCartCalculations.set(cacheKey, {
      data: result,
      timestamp: now
    });
    
    if (cachedCartCalculations.size > 50) {
      const oldestKey = cachedCartCalculations.keys().next().value;
      cachedCartCalculations.delete(oldestKey);
    }
    
    return result;
  } catch (error) {
    console.error('Cart calculation error:', error);
    return null;
  }
}

let topCustomerErrorLogged = false;

async function getTopCustomer() {
  const now = Date.now();
  
  if (cachedTopCustomer !== undefined && (now - topCustomerLastFetch) < TOP_CUSTOMER_CACHE) {
    return cachedTopCustomer;
  }
  
  try {
    const response = await fetch('https://plugin.tebex.io/payments?paged=1&limit=100', {
      headers: {
        'X-Tebex-Secret': config.private.tebex.privateKey
      }
    });
    
    if (!response.ok) {
      if (!topCustomerErrorLogged) {
        console.error('Top customer fetch error: API returned status', response.status);
        topCustomerErrorLogged = true;
      }
      topCustomerLastFetch = now;
      cachedTopCustomer = null;
      return null;
    }
    
    const data = await response.json();
    const payments = data.data || [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyTotals = {};
    
    payments.forEach(payment => {
      const paymentDate = new Date(payment.date);
      paymentDate.setHours(0, 0, 0, 0);
      
      if (paymentDate.getTime() === today.getTime() && payment.status === 'Complete') {
        const username = payment.player.name || payment.player.uuid;
        if (!dailyTotals[username]) {
          dailyTotals[username] = {
            username: username,
            uuid: payment.player.uuid,
            total: 0
          };
        }
        dailyTotals[username].total += payment.price;
      }
    });
    
    const topCustomer = Object.values(dailyTotals).sort((a, b) => b.total - a.total)[0];
    
    if (topCustomer) {
      cachedTopCustomer = {
        username: topCustomer.username,
        amount: topCustomer.total,
        uuid: topCustomer.uuid
      };
    } else {
      cachedTopCustomer = null;
    }
    
    topCustomerLastFetch = now;
    topCustomerErrorLogged = false;
    return cachedTopCustomer;
  } catch (error) {
    if (!topCustomerErrorLogged) {
      console.error('Top customer fetch error:', error.message);
      topCustomerErrorLogged = true;
    }
    topCustomerLastFetch = now;
    cachedTopCustomer = null;
    return null;
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
          
          if (req.url === '/api/giftcards/validate' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const { code } = JSON.parse(body);
                if (!code) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Gift card code is required' }));
                  return;
                }
                const result = await validateGiftCard(code);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
              } catch (error) {
                console.error('Gift card validation error:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ valid: false, error: 'Server error' }));
              }
            });
            return;
          }
          
          if (req.url === '/api/cart/calculate' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const { packages } = JSON.parse(body);
                if (!packages || !Array.isArray(packages)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Packages array is required' }));
                  return;
                }
                const result = await calculateCartTotal(packages);
                if (result) {
                  res.statusCode = 200;
                  res.end(JSON.stringify(result));
                } else {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to calculate total' }));
                }
              } catch (error) {
                console.error('Cart calculation error:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Server error' }));
              }
            });
            return;
          }
          
          if (req.url === '/api/top-customer') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            try {
              const topCustomer = await getTopCustomer();
              res.end(JSON.stringify(topCustomer || {}));
            } catch (error) {
              console.error('Top customer fetch error:', error);
              res.end(JSON.stringify({}));
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
