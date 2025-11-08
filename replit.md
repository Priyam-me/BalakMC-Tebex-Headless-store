# Minecraft Tebex Store Project

## Overview
A professional Minecraft store built with Tebex Headless API featuring a dark theme inspired by top Minecraft stores like mcfleet.net. The design includes glowing effects, a Minecraft background, and a clean, centered layout optimized for user experience.

## Project Structure
- **index.html** - Main store page with centered layout
- **template/** - All customizable templates
  - **styles/main.css** - Complete styling with lime green theme and glowing effects
  - **scripts/main.js** - Store functionality with improved Tebex integration and error handling
  - **pages/** - Success and cancel pages
  - **assets/** - Logo and image assets
- **attached_assets/stock_images/** - Background images
- **package.json** - Dependencies and scripts
- **vite.config.js** - Vite configuration with routing for success/cancel pages

## Technology Stack
- **Vite** - Build tool and dev server
- **Tebex.js** - Embedded checkout integration
- **Tebex Headless API** - Product management and basket creation
- **Vanilla JavaScript** - No framework dependencies for maximum performance

## Recent Changes
*2025-01-08* - Major redesign to match mcfleet.net style:
- Added Minecraft background image
- Centered vertical layout with glowing logo
- Product cards with emoji icons and colored glows
- Improved glass card effects with backdrop blur
- Fixed Tebex API integration with better error handling
- Added comprehensive logging for debugging
- Responsive design for all devices

## Design Features
- **Background**: Minecraft-themed with dark overlay
- **Colors**: Lime green (#84cc16) primary with purple, orange, and blue accent glows
- **Effects**: Frosted glass cards, floating logo animation, glowing product cards
- **Layout**: Centered vertical design inspired by professional Minecraft stores

## API Configuration
Required environment variables (set in Replit Secrets):
- **VITE_TEBEX_PUBLIC_TOKEN** - Tebex public API token (required)
- **VITE_STORE_NAME** - Store name (optional, default: "MC STORE")
- **VITE_COMPLETE_URL** - Success redirect URL (optional)
- **VITE_CANCEL_URL** - Cancel redirect URL (optional)

## Development
- Run: `npm run dev` on port 5000
- Build: `npm run build`
- Server configured with allowed hosts for Replit environment

## Customization
All template files are organized in `/template` folder for easy editing:
- Change colors by editing CSS variables in `main.css`
- Add custom logo to `template/assets/logo.png`
- Modify layout in `index.html`
- Customize icons in `main.js`

## User Preferences
- Design Style: mcfleet.net inspired, professional Minecraft store aesthetic
- Theme: Dark mode with lime green accents and multi-color glows
- Template Organization: All editable files in /template folder for easy access
- Background: Minecraft-themed imagery with dark overlay
