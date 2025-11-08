# Minecraft Tebex Store

A beautiful Minecraft store built with the Tebex Headless API, featuring a dark theme inspired by professional Minecraft stores with glowing effects and a stunning background.

## Features

- 🎨 **Professional Design** - Inspired by top Minecraft stores like mcfleet.net
- 🌙 **Dark Theme** - Beautiful dark mode with lime green accents and glowing effects
- 🖼️ **Custom Background** - Minecraft-themed background with overlay
- 🛒 **Shopping Cart** - Seamless cart experience with Tebex.js embedded checkout
- 💳 **Secure Payments** - Powered by Tebex payment processing
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Built with Vite for optimal performance

## Quick Start

### 1. Get Your Tebex API Token

1. Log in to your [Tebex Creator Panel](https://creator.tebex.io)
2. Navigate to **Settings** → **API Keys**
3. Copy your **Public Token**

### 2. Configure Your Store

The store uses environment variables managed through Replit Secrets:

- **VITE_TEBEX_PUBLIC_TOKEN** - Your Tebex public API token (required)
- **VITE_STORE_NAME** - Your store name (optional, default: "MC STORE")
- **VITE_COMPLETE_URL** - Success redirect URL (optional)
- **VITE_CANCEL_URL** - Cancel redirect URL (optional)

### 3. Run the Store

The store is already configured and running! Just add your Tebex token and your products will appear automatically.

## Template Customization

All templates are located in the `/template` folder for easy editing:

### Template Structure

```
template/
├── styles/
│   └── main.css          # All styling, colors, and animations
├── scripts/
│   └── main.js           # Store functionality and Tebex integration
├── pages/
│   ├── success.html      # Purchase success page
│   └── cancel.html       # Purchase cancellation page
└── assets/
    └── logo.png          # Store logo (add your own)
```

### Customizing Colors

Edit `template/styles/main.css` CSS variables:

```css
:root {
  --lime-primary: #84cc16;     /* Main accent color */
  --lime-light: #a3e635;       /* Light accent */
  --lime-dark: #65a30d;        /* Dark accent */
  
  --purple-glow: rgba(147, 51, 234, 0.6);  /* Purple card glow */
  --blue-glow: rgba(59, 130, 246, 0.6);    /* Blue card glow */
  --orange-glow: rgba(249, 115, 22, 0.6);  /* Orange card glow */
  
  --glass-bg: rgba(15, 23, 42, 0.85);      /* Glass card background */
  --bg-dark: #0f172a;                       /* Main background color */
}
```

### Adding Your Logo

1. Add your logo image to `template/assets/logo.png`
2. The logo will automatically appear at the top of the store
3. If no logo is found, the text "MC STORE" will be displayed

### Changing the Background

To use a different background image:

1. Replace the image in `attached_assets/stock_images/` or add your own
2. Update the path in `template/styles/main.css`:

```css
.background-image {
  background-image: url('/path/to/your/image.jpg');
}
```

### Customizing the Layout

- **Header**: Edit the `.main-header` section in `index.html`
- **Server Info**: Modify the `.server-info` section
- **Product Cards**: Customize `.package-card` in `template/styles/main.css`
- **Footer**: Edit the `.store-footer` section in `index.html`

### Package Icons

Package icons are automatically assigned from a preset list. To customize:

Edit the `packageIcons` array in `template/scripts/main.js`:

```javascript
const packageIcons = ['💎', '⚔️', '🏆', '👑', '🎁', '🔥', '⭐', '🎯'];
```

## How It Works

1. **Fetching Products**: The store fetches categories and packages from Tebex Headless API
2. **Shopping Cart**: Users can add multiple packages to their cart
3. **Checkout**: Tebex.js creates a secure basket and launches embedded checkout
4. **Payment**: Tebex handles all payment processing securely
5. **Delivery**: Items are automatically delivered to the player's Minecraft account

## API Integration

The store uses:
- **Tebex Headless API** - For fetching products and creating baskets
- **Tebex.js** - For embedded, secure checkout experience

All API calls are made from `template/scripts/main.js` with proper error handling.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Troubleshooting

### Products Not Loading

1. Verify your Tebex public token is correct
2. Check browser console for API errors
3. Ensure your Tebex store has published packages

### Checkout Not Working

1. Make sure you're using the correct public token (not private key)
2. Check that your packages are properly configured in Tebex
3. Review browser console for detailed error messages

### Styling Issues

1. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Ensure all files in `/template` folder are properly saved
3. Check browser console for CSS loading errors

## Support

- **Tebex Documentation**: [docs.tebex.io/developers](https://docs.tebex.io/developers)
- **Tebex Support**: Contact through your creator panel
- **Template Help**: Check comments in template files

## License

This template is free to use and customize for your Minecraft server store.
