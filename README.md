# Minecraft Tebex Store

A professional Minecraft store built with the Tebex Headless API featuring a dark theme inspired by top Minecraft stores, dynamic configuration, live server status, and beautiful glowing effects.

## Features

- 🎨 **Professional Design** - Inspired by top Minecraft stores with glowing effects
- 🌙 **Dark Theme** - Beautiful dark mode with lime green accents
- 🖼️ **Custom Background** - Beautiful Minecraft night scene background
- ⚙️ **Easy Configuration** - Edit everything from `app.config.js` file
- 📊 **Live Server Status** - Shows real-time player count from your Minecraft server
- 🛒 **Shopping Cart** - Seamless cart experience with Tebex.js embedded checkout
- 🖼️ **Package Images** - Displays images directly from your Tebex packages
- 💳 **Secure Payments** - Powered by Tebex payment processing
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Built with Vite for optimal performance

## Quick Setup

### 1. Configure Your Store

Copy the example config file and edit it with your details:

```bash
cp app.config.example.js app.config.js
```

Then edit `app.config.js` with your favorite text editor:

```javascript
export const config = {
  public: {
    // Your store name (appears in header)
    storeName: 'MY AWESOME SERVER',
    
    // Your Minecraft server details (for live player count)
    serverIp: 'play.myserver.com',
    serverPort: 25565,  // Default Minecraft port
    
    // Discord integration (links in footer)
    discordLink: 'https://discord.gg/myserver',
    discordId: 'MyDiscordServer',
    
    // Custom images
    assets: {
      // Path to background image (you can use the provided one or add your own)
      backgroundImage: '/attached_assets/febd862108d5aea0b5874cb846c4fca0_1762605406041.jpg',
      // Path to your store logo (add your logo to template/assets/logo.png)
      logo: '/template/assets/logo.png'
    },
    
    // Success/cancel page URLs
    urls: {
      completeUrl: '/success',
      cancelUrl: '/cancel'
    },
    
    // Tebex public token
    tebex: {
      // Get this from https://creator.tebex.io Settings → API Keys
      publicToken: 'your_tebex_public_token_here'
    }
  },
  
  // KEEP THIS SECTION PRIVATE! Never share these keys
  private: {
    tebex: {
      // Tebex private key (for future features - not currently used)
      privateKey: ''
    }
  }
};
```

### 2. Get Your Tebex API Token

1. Log in to your [Tebex Creator Panel](https://creator.tebex.io)
2. Go to **Settings** → **API Keys**
3. Copy your **Public Token**
4. Paste it into `app.config.js` under `tebex.publicToken`

### 3. Add Your Logo (Optional)

If you want a custom logo:

1. Prepare your logo image (PNG recommended, transparent background)
2. Save it to `template/assets/logo.png`
3. The logo will automatically appear in the store header

### 4. Run the Store

```bash
npm install
npm run dev
```

Your store will be available at `http://localhost:5000`

## Configuration Guide

### Store Name and Branding

```javascript
storeName: 'MY SERVER STORE'
```

Changes the store name that appears in the header and browser tab.

### Server Integration

```javascript
serverIp: 'play.myserver.com',
serverPort: 25565
```

The store will automatically query your Minecraft server and display:
- ✅ Green dot when server is online
- ❌ Red dot when server is offline
- 👥 Current player count (e.g., "12/100 online")

**Note:** Your Minecraft server must have `query` enabled in `server.properties`:

```properties
enable-query=true
query.port=25565
```

### Discord Integration

```javascript
discordLink: 'https://discord.gg/myserver',
discordId: 'MyAwesomeServer'
```

These settings are used for Discord integration (currently in footer, can be extended).

### Custom Images

#### Background Image

```javascript
backgroundImage: '/path/to/your/background.jpg'
```

You can use:
- The provided Minecraft night scene
- Your own custom background (add to `attached_assets/` folder)
- Any public URL

#### Store Logo

```javascript
logo: '/template/assets/logo.png'
```

Add your custom logo to this path. Recommended size: 200x200px PNG with transparent background.

### Package Images

Package images are automatically fetched from Tebex! When you add an image to a package in your Tebex creator panel:

1. Go to your Tebex package settings
2. Upload an image
3. The image will automatically appear in your store

**Image Specifications:**
- Recommended size: 512x512px
- Format: PNG with transparent background
- Displays at 80x80px with glow effect

## Customization

### Colors and Theme

Edit `template/styles/main.css` to change colors:

```css
:root {
  --lime-primary: #84cc16;     /* Main accent color */
  --lime-light: #a3e635;       /* Light accent */
  --lime-dark: #65a30d;        /* Dark accent */
  
  /* Change these to your server's brand colors */
  --purple-glow: rgba(147, 51, 234, 0.6);
  --orange-glow: rgba(249, 115, 22, 0.6);
}
```

### Package Card Size

Packages are displayed in compact cards. To adjust spacing:

```css
.packages-container {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}
```

Change `160px` to make cards wider or narrower.

### Layout and Structure

- **Header**: Edit `index.html` (lines 15-40)
- **Footer**: Edit `index.html` (lines 50-70)
- **Product Cards**: Auto-generated from Tebex API
- **Modal/Cart**: Edit `index.html` (lines 72-90)

## How It Works

### Configuration System

1. **app.config.js** - Your editable configuration file (git-ignored for security)
2. **API Endpoints** - Vite serves config via `/api/config` and server status via `/api/server-status`
3. **Frontend** - Loads config on startup and applies settings dynamically

### Server Status

- Queries your Minecraft server every 30 seconds
- Caches results to avoid overloading your server
- Shows real-time player count
- Gracefully handles server offline state

### Tebex Integration

1. **Fetch Products** - Gets categories and packages from Tebex API
2. **Shopping Cart** - Local cart management
3. **Checkout** - Creates Tebex basket and launches embedded checkout
4. **Payment** - Tebex handles all payment processing
5. **Delivery** - Items delivered automatically to player accounts

## Troubleshooting

### Products Not Loading

**Problem:** Store shows "No packages available"

**Solutions:**
1. Check your Tebex public token in `app.config.js`
2. Ensure packages are published in Tebex creator panel
3. Check browser console (F12) for API errors

### Server Status Shows Offline

**Problem:** Green dot is red, shows "Offline"

**Solutions:**
1. Verify `serverIp` and `serverPort` in `app.config.js`
2. Ensure your Minecraft server has `enable-query=true` in `server.properties`
3. Check firewall allows connections to query port
4. Test connection with a Minecraft server query tool

### Package Images Not Showing

**Problem:** Emoji icons instead of package images

**Solutions:**
1. Add images to your packages in Tebex creator panel
2. Wait 5-10 minutes for Tebex cache to update
3. Hard refresh the store (Ctrl+Shift+R)

### Checkout Doesn't Work

**Problem:** "Failed to initiate checkout" error

**Solutions:**
1. Verify Tebex public token is correct
2. Check browser console for detailed errors
3. Ensure packages are properly configured in Tebex
4. Try clearing browser cache

### Configuration Changes Not Appearing

**Problem:** Edited `app.config.js` but changes don't show

**Solutions:**
1. Restart the development server (Ctrl+C, then `npm run dev`)
2. Hard refresh your browser (Ctrl+Shift+R)
3. Clear browser cache

## Security

### Important Security Notes

⚠️ **app.config.js is git-ignored** - Your configuration file with API keys is not committed to version control.

⚠️ **Never share your private Tebex key** - The `private` section of config is for server-side use only and never sent to browsers.

⚠️ **Use environment variables in production** - For deployed sites, use environment variables instead of hardcoded tokens.

### Production Deployment

When deploying to production:

1. Set environment variables:
   - `VITE_TEBEX_PUBLIC_TOKEN` - Your Tebex public token
   - `VITE_TEBEX_PRIVATE_KEY` - Your Tebex private key (if needed)

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to your hosting service

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## API Endpoints

The store exposes these API endpoints:

- `GET /api/config` - Public configuration (store name, colors, etc.)
- `GET /api/server-status` - Minecraft server status and player count

## Support

- **Tebex Documentation**: [docs.tebex.io/developers](https://docs.tebex.io/developers)
- **Tebex Support**: Contact through your creator panel
- **Template Help**: Check comments in `app.config.js` and template files

## License

This template is free to use and customize for your Minecraft server store.

---

**Made with ❤️ for the Minecraft community**
"# BalakMC-Tebex-Headless-store" 
"# BalakMC-Tebex-Headless-store" 
