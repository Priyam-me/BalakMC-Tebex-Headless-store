# Minecraft Tebex Store

A beautiful, modern Minecraft store built with the Tebex Headless API featuring an iOS-inspired glassy dark theme with lime green accents.

## Features

- 🎨 **iOS-Inspired Design** - Frosted glass effects with backdrop blur
- 🌙 **Dark Theme** - Professional dark mode with lime green highlights
- 🛒 **Shopping Cart** - Seamless cart experience with Tebex.js checkout
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Built with Vite for optimal performance

## Quick Start

### 1. Get Your Tebex API Token

1. Log in to your [Tebex Creator Panel](https://creator.tebex.io)
2. Navigate to **Settings** → **API Keys**
3. Copy your **Public Token** (starts with your webstore ID)

### 2. Configure Environment Variables

The Tebex API token will be requested when you start the application. You can also configure:

- **VITE_TEBEX_PUBLIC_TOKEN** - Your Tebex public API token
- **VITE_STORE_NAME** - Your store name (default: "Minecraft Store")
- **VITE_COMPLETE_URL** - URL to redirect after successful purchase
- **VITE_CANCEL_URL** - URL to redirect after cancelled purchase

### 3. Run the Store

```bash
npm install
npm run dev
```

Your store will be available at `http://localhost:5000`

## Customization Guide

All templates are located in the `/template` folder for easy editing:

### Template Structure

```
template/
├── styles/
│   └── main.css          # All styling and theme colors
├── scripts/
│   └── main.js           # Store functionality and API integration
└── pages/
    ├── success.html      # Purchase success page
    └── cancel.html       # Purchase cancellation page
```

### Changing Colors

Edit `template/styles/main.css` and modify the CSS variables:

```css
:root {
  --lime-primary: #84cc16;     /* Main lime green */
  --lime-light: #a3e635;       /* Light lime green */
  --lime-dark: #65a30d;        /* Dark lime green */
  --lime-glow: rgba(132, 204, 22, 0.3);  /* Glow effect */
  
  --glass-bg: rgba(23, 23, 23, 0.7);     /* Glass background */
  --glass-border: rgba(255, 255, 255, 0.1);  /* Glass border */
  
  --bg-dark: #0a0a0a;          /* Main background */
  --text-primary: #ffffff;     /* Primary text */
  --text-secondary: #a3a3a3;   /* Secondary text */
}
```

### Changing Layouts

- **Header**: Edit the `.glass-header` section in `index.html`
- **Hero Section**: Modify the `.hero` section in `index.html`
- **Product Cards**: Customize `.package-card` in `template/styles/main.css`
- **Cart Modal**: Edit `.modal-content` in `index.html`

### Adding Custom Content

You can add custom sections in `index.html` between the `<main>` tags. All new sections will automatically inherit the glassy theme.

## How It Works

1. **Fetching Products**: The app fetches categories and packages from Tebex Headless API
2. **Shopping Cart**: Users can add packages to cart (stored locally)
3. **Checkout**: Tebex.js creates a basket and launches the embedded checkout
4. **Payment**: Tebex handles secure payment processing
5. **Delivery**: Items are automatically delivered to the player's Minecraft account

## API Integration

The store uses:
- **Tebex Headless API** - For fetching products and creating baskets
- **Tebex.js** - For embedded checkout experience

All API calls are made from `template/scripts/main.js`.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Support

For Tebex-related issues, visit [Tebex Documentation](https://docs.tebex.io/developers)

For store customization help, refer to the comments in the template files.

## License

This template is free to use and customize for your Minecraft server store.
