# Minecraft Tebex Store Project

## Overview
A professional, fully-featured Minecraft store built with Tebex Headless API. Features dynamic configuration system, live Minecraft server status, package images from Tebex, and beautiful mcfleet-inspired glassy design with lime green accents.

## Project Structure
- **app.config.js** - **MAIN CONFIGURATION FILE** (git-ignored, edit this to customize your store)
- **app.config.example.js** - Example configuration file (copy to app.config.js)
- **index.html** - Main store page
- **template/** - All customizable templates
  - **styles/main.css** - Complete styling with lime green theme and glowing effects
  - **scripts/main.js** - Store functionality with dynamic config loading
  - **pages/** - Success and cancel pages
  - **assets/** - Logo and image assets
- **server/** - Backend API modules
  - **config-api.js** - Configuration management
  - **server-status.js** - Minecraft server query (deprecated, moved to vite.config.js)
- **attached_assets/** - User-uploaded images (background, etc.)
- **vite.config.js** - Vite configuration with API endpoints
- **package.json** - Dependencies and scripts

## Technology Stack
- **Vite** - Build tool and dev server with API middleware
- **Tebex.js** - Embedded checkout integration
- **Tebex Headless API** - Product management and basket creation
- **minecraft-server-util** - Minecraft server status queries
- **Vanilla JavaScript** - No framework dependencies for maximum performance

## Recent Changes
*2025-11-08* - Enhanced checkout and authentication features:
- **Custom username modal** - Replaced browser prompt with themed modal matching website design
- **Discord integration** - Top corner button showing live member count from Discord server
- **Login system** - User authentication with localStorage persistence
- **Saved username** - Login remembers your Minecraft username for faster checkout
- **Improved UX** - All modals use website theme with glassmorphic design

*2025-11-08* - Earlier UI/UX improvements:
- **Category-based navigation** - Categories shown first, click to view packages within
- **Back button** - Easy navigation between categories and packages view
- **Top Customer daily section** - Displays top spender with avatar and amount
- **Giftcard Balance section** - Gift card code validation interface
- **Enhanced glassy design** - More transparent, refined glass effect on all cards
- **Smaller, compact cards** - Optimized card sizes (140px minimum width)
- **Improved checkout error handling** - Better user feedback for checkout issues
- **Mobile responsive** - All new sections adapt perfectly to mobile screens

*2025-11-08* - Earlier updates:
- **app.config.js system** - Centralized configuration for easy customization
- **Live server status** - Real-time Minecraft player count display
- **Package images** - Automatic image loading from Tebex packages
- **Dynamic config loading** - API endpoints serve config at runtime
- **New background** - Beautiful Minecraft night scene
- **Fixed basket reuse issue** - Fresh basket created for each checkout
- **Prevented duplicate event handlers** - Single registration for Tebex events

## Key Features

### 1. Dynamic Configuration System
All store settings can be edited in `app.config.js`:
```javascript
export const config = {
  public: {
    storeName: 'MC STORE',          // Your store name
    serverIp: 'play.yourserver.com', // Your Minecraft server
    serverPort: 25565,               // Query port
    discordLink: '...',              // Discord invite
    discordId: '...',                // Discord ID
    assets: { ... },                 // Paths to images
    urls: { ... },                   // Success/cancel URLs
    tebex: { publicToken: '...' }    // Tebex public API key
  },
  private: {
    tebex: { privateKey: '...' }     // Keep secret!
  }
};
```

### 2. API Endpoints
- **GET /api/config** - Returns public configuration (never exposes private keys)
- **GET /api/server-status** - Returns Minecraft server status with 30s cache

### 3. Minecraft Server Integration
- Queries server every 30 seconds
- Shows online/offline status with colored dot
- Displays current player count (e.g., "12/100 online")
- Graceful fallback when server is offline

### 4. Category Navigation
- Categories displayed first on main page
- Click any category to view its packages
- Back button to return to category view
- Smooth transitions between views
- Category cards show package count

### 5. Package Display
- Fetches images directly from Tebex API
- Falls back to emoji icons if no image
- Compact card design (140px min width)
- Glowing hover effects with multiple colors

### 6. Top Customer Daily
- Displays top daily spender
- Shows Minecraft player avatar
- Username and purchase amount
- Glassy card with hover effects

### 7. Giftcard Balance
- Input field for gift card codes
- Check button for validation
- User feedback on results
- Ready for backend integration

### 8. Shopping Cart & Checkout
- Local cart management
- Custom username modal with website theme (replaces browser prompt)
- Fresh basket created for each checkout attempt
- Basket invalidated on cart changes (add/remove items)
- Tebex.js embedded checkout
- Improved error handling with clear messages
- Event handlers registered once (no duplicates)
- Username saved for logged-in users

### 9. User Authentication
- Login modal with email-based authentication
- User session saved in localStorage
- Persistent login across page refreshes
- Logout functionality with confirmation
- Username auto-populated for logged-in users
- Login status displayed in top corner button

### 10. Discord Integration
- Live member count displayed from Discord API
- Click to join Discord server
- Auto-refreshes every 5 minutes
- Fallback to "Join" if API unavailable
- Positioned in top corner for easy access

## Design Features
- **Background**: Minecraft night scene with overlay (configurable)
- **Colors**: Lime green (#84cc16) primary with purple, orange, blue accent glows
- **Effects**: Frosted glass cards, floating logo animation, glowing product cards
- **Layout**: Centered vertical design with responsive grid
- **Typography**: Apple system fonts for clean, professional look

## Configuration Guide

### Quick Start
1. Copy `app.config.example.js` to `app.config.js`
2. Edit `app.config.js` with your details
3. Add your Tebex public token
4. Run `npm run dev`

### Customization Options
- **Store Name**: Change `storeName` in config
- **Server Status**: Update `serverIp` and `serverPort`
- **Discord Integration**: Update `discordId` with your Discord invite code (e.g., 'abc123xyz')
- **Discord Link**: Set `discordLink` to your Discord invite URL
- **Background**: Change `assets.backgroundImage` path
- **Logo**: Add image to `template/assets/logo.png`
- **Colors**: Edit CSS variables in `template/styles/main.css`

## Security Notes
- ⚠️ `app.config.js` is git-ignored to protect API keys
- ⚠️ Only public config is exposed via `/api/config`
- ⚠️ Private keys stay server-side and never sent to browser
- ⚠️ Use environment variables in production deployments

## API Configuration
Environment variables (used if present):
- **VITE_TEBEX_PUBLIC_TOKEN** - Overrides config file public token
- **VITE_TEBEX_PRIVATE_KEY** - Overrides config file private key

## Development
- Run: `npm run dev` on port 5000
- Build: `npm run build`
- Server configured with allowed hosts for Replit environment
- API endpoints served via Vite middleware plugin

## User Preferences
- Design Style: mcfleet.net inspired, professional Minecraft store aesthetic
- Theme: Dark mode with lime green accents and multi-color glows
- Configuration: File-based (`app.config.js`) for easy non-technical editing
- Template Organization: All editable files clearly organized
- Background: User-provided Minecraft night scene
- Package Display: Compact cards with Tebex images

## Technical Implementation

### Config Loading Flow
1. Frontend requests `/api/config` on page load
2. Vite middleware serves `config.public` from `app.config.js`
3. JavaScript applies config (store name, background, server IP)
4. Config never exposes private keys to browser

### Server Status Flow
1. Frontend requests `/api/server-status` on load and every 30s
2. Vite middleware queries Minecraft server via `minecraft-server-util`
3. Results cached for 30s to avoid server overload
4. Returns player count, online status, version, MOTD

### Checkout Flow
1. User adds packages to cart (stored locally)
2. Click checkout → Always create fresh basket via Tebex API
3. Add all cart items to basket
4. Launch Tebex.js embedded checkout
5. On cancel/close → Reset basket reference
6. On cart change → Invalidate basket

## Troubleshooting

### Configuration Not Loading
- Ensure `app.config.js` exists (copy from `app.config.example.js`)
- Check browser console for API errors
- Restart dev server after config changes

### Server Status Shows Offline
- Verify correct `serverIp` and `serverPort` in config
- Ensure Minecraft server has `enable-query=true`
- Check firewall allows query port connections

### Package Images Missing
- Add images to packages in Tebex creator panel
- Wait 5-10 minutes for Tebex cache update
- Hard refresh browser (Ctrl+Shift+R)

## Dependencies
- `@tebexio/tebex.js` - Embedded checkout
- `minecraft-server-util` - Server status queries
- `vite` - Build tool and dev server

## License
Free to use and customize for Minecraft server stores.
