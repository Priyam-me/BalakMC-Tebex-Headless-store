# Minecraft Tebex Store Project

## Overview
A modern Minecraft store built with Tebex Headless API featuring an iOS-inspired glassy dark theme with lime green accents. The project uses Vite for development and is structured with templates in mind for easy customization.

## Project Structure
- **index.html** - Main store page
- **template/** - All customizable templates
  - **styles/main.css** - Theme and styling
  - **scripts/main.js** - Store functionality and Tebex integration
  - **pages/** - Success and cancel pages
- **package.json** - Dependencies and scripts
- **vite.config.js** - Vite configuration

## Technology Stack
- **Vite** - Build tool and dev server
- **Tebex.js** - Embedded checkout
- **Tebex Headless API** - Product management
- **Vanilla JavaScript** - No framework dependencies

## Recent Changes
*2025-01-08* - Initial project setup with complete template structure, glassy iOS theme, and Tebex integration

## User Preferences
- Theme: Dark mode with lime green (#84cc16) accents
- Design Style: iOS-inspired frosted glass effects
- Template Organization: All editable files in /template folder

## API Configuration
- Requires VITE_TEBEX_PUBLIC_TOKEN environment variable
- Optional: VITE_STORE_NAME, VITE_COMPLETE_URL, VITE_CANCEL_URL

## Development
Run with: `npm run dev` on port 5000
Build with: `npm run build`
