import { status } from 'minecraft-server-util';

let cachedStatus = null;
let lastFetch = 0;
const CACHE_DURATION = 30000;

export async function getServerStatus(host, port = 25565, timeout = 5000) {
  const now = Date.now();
  
  if (cachedStatus && (now - lastFetch) < CACHE_DURATION) {
    return cachedStatus;
  }
  
  try {
    const response = await status(host, port, { timeout });
    
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
