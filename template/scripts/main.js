import Tebex from '@tebexio/tebex.js';

const API_BASE = 'https://headless.tebex.io/api';

let appConfig = null;
let cart = [];
let currentBasket = null;
let checkoutHandlersRegistered = false;

const packageIconFallbacks = ['💎', '⚔️', '🏆', '👑', '🎁', '🔥', '⭐', '🎯'];
const iconColors = ['purple', 'orange', 'lime', 'blue', 'red'];

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to load configuration');
    }
    appConfig = await response.json();
    console.log('Configuration loaded:', appConfig);
    return appConfig;
  } catch (error) {
    console.error('Config load error:', error);
    throw error;
  }
}

function applyConfig() {
  if (!appConfig) return;
  
  document.querySelector('#storeName').textContent = appConfig.storeName;
  document.querySelector('#serverIp').textContent = appConfig.serverIp;
  
  const bgElement = document.querySelector('.background-image');
  if (bgElement && appConfig.assets.backgroundImage) {
    bgElement.style.backgroundImage = `url('${appConfig.assets.backgroundImage}')`;
  }
  
  const logoImg = document.querySelector('#storeLogo');
  if (logoImg && appConfig.assets.logo) {
    logoImg.src = appConfig.assets.logo;
  }
}

async function fetchServerStatus() {
  try {
    const response = await fetch('/api/server-status');
    const status = await response.json();
    
    const statusDot = document.getElementById('statusDot');
    const playerCount = document.getElementById('playerCount');
    
    if (status.online) {
      statusDot.style.background = 'var(--lime-primary)';
      statusDot.style.boxShadow = '0 0 10px var(--lime-glow)';
      playerCount.textContent = `${status.players.online}/${status.players.max} online`;
    } else {
      statusDot.style.background = '#ef4444';
      statusDot.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.6)';
      playerCount.textContent = 'Offline';
    }
  } catch (error) {
    console.error('Server status fetch error:', error);
    document.getElementById('playerCount').textContent = '';
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/accounts/${appConfig.tebex.publicToken}/categories?includePackages=1`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function createBasket() {
  try {
    const completeUrl = window.location.origin + appConfig.urls.completeUrl;
    const cancelUrl = window.location.origin + appConfig.urls.cancelUrl;
    
    const response = await fetch(`${API_BASE}/accounts/${appConfig.tebex.publicToken}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        complete_url: completeUrl,
        cancel_url: cancelUrl,
        complete_auto_redirect: true
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Basket creation error:', errorText);
      throw new Error(`Failed to create basket: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Basket created:', data);
    return data.data;
  } catch (error) {
    console.error('Error creating basket:', error);
    throw error;
  }
}

async function addPackageToBasket(basketIdent, packageId, quantity = 1) {
  try {
    const response = await fetch(`${API_BASE}/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        package_id: packageId,
        quantity: quantity
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Add package error:', errorText);
      throw new Error(`Failed to add package: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Package added:', data);
    return data;
  } catch (error) {
    console.error('Error adding package to basket:', error);
    throw error;
  }
}

function renderCategories(categories) {
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';
  
  if (categories.length === 0) {
    container.innerHTML = '<p class="error-state">No packages available at the moment.</p>';
    return;
  }
  
  let packageIndex = 0;
  categories.forEach(category => {
    if (!category.packages || category.packages.length === 0) return;
    
    category.packages.forEach(pkg => {
      const iconFallback = packageIconFallbacks[packageIndex % packageIconFallbacks.length];
      const iconColor = iconColors[packageIndex % iconColors.length];
      packageIndex++;
      
      const packageEl = document.createElement('div');
      packageEl.className = 'package-card glass-card';
      packageEl.dataset.packageId = pkg.id;
      
      let imageHtml = '';
      if (pkg.image) {
        imageHtml = `
          <img src="${pkg.image}" 
               alt="${pkg.name}" 
               class="package-image"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div class="package-image-fallback ${iconColor}" style="display:none;">${iconFallback}</div>
        `;
      } else {
        imageHtml = `<div class="package-icon ${iconColor}">${iconFallback}</div>`;
      }
      
      packageEl.innerHTML = `
        ${imageHtml}
        <h3 class="package-name">${pkg.name}</h3>
        <p class="package-description">${pkg.description || 'Enhance your gameplay experience'}</p>
        <div class="package-price">${formatPrice(pkg.base_price, pkg.currency)}</div>
        <button class="add-to-cart-btn" data-package='${JSON.stringify({
          id: pkg.id,
          name: pkg.name,
          price: pkg.base_price,
          currency: pkg.currency
        }).replace(/'/g, "&apos;")}'>
          Buy Now
        </button>
      `;
      
      container.appendChild(packageEl);
    });
  });
  
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const packageData = JSON.parse(btn.dataset.package);
      addToCart(packageData);
    });
  });
}

function formatPrice(price, currency) {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${parseFloat(price).toFixed(2)}`;
}

function addToCart(packageData) {
  const existingItem = cart.find(item => item.id === packageData.id);
  
  if (!existingItem) {
    cart.push(packageData);
    currentBasket = null;
    updateCartUI();
    showNotification(`${packageData.name} added to cart!`);
  } else {
    showNotification(`${packageData.name} is already in your cart!`);
  }
}

function removeFromCart(packageId) {
  cart = cart.filter(item => item.id !== packageId);
  currentBasket = null;
  updateCartUI();
  renderCart();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    document.getElementById('cartTotal').textContent = '$0.00';
    document.getElementById('checkoutButton').disabled = true;
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">${formatPrice(item.price, item.currency)}</span>
      <button class="remove-item" data-id="${item.id}">Remove</button>
    </div>
  `).join('');
  
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const currency = cart[0]?.currency || 'USD';
  document.getElementById('cartTotal').textContent = formatPrice(total, currency);
  document.getElementById('checkoutButton').disabled = false;
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(parseInt(btn.dataset.id));
    });
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

document.getElementById('cartButton').addEventListener('click', () => {
  document.getElementById('cartModal').style.display = 'flex';
  renderCart();
});

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cartModal').style.display = 'none';
});

document.getElementById('cartModal').addEventListener('click', (e) => {
  if (e.target.id === 'cartModal') {
    document.getElementById('cartModal').style.display = 'none';
  }
});

function registerCheckoutHandlers() {
  if (checkoutHandlersRegistered) return;
  
  Tebex.checkout.on('payment:complete', (data) => {
    console.log('Payment successful!', data);
    cart = [];
    currentBasket = null;
    updateCartUI();
    document.getElementById('cartModal').style.display = 'none';
    showNotification('Thank you for your purchase!');
  });
  
  Tebex.checkout.on('payment:cancelled', () => {
    console.log('Payment cancelled by user');
    currentBasket = null;
    showNotification('Checkout cancelled');
  });
  
  Tebex.checkout.on('checkout:closed', () => {
    console.log('Checkout window closed');
    currentBasket = null;
  });
  
  Tebex.checkout.on('checkout:loaded', () => {
    console.log('Checkout UI loaded successfully');
  });
  
  checkoutHandlersRegistered = true;
  console.log('Tebex checkout event handlers registered');
}

document.getElementById('checkoutButton').addEventListener('click', async () => {
  if (cart.length === 0) return;
  
  const checkoutBtn = document.getElementById('checkoutButton');
  const originalText = checkoutBtn.textContent;
  
  try {
    checkoutBtn.textContent = 'Creating order...';
    checkoutBtn.disabled = true;
    
    console.log('Creating fresh basket for current cart items...');
    currentBasket = await createBasket();
    console.log('Basket created with ident:', currentBasket.ident);
    
    for (const item of cart) {
      console.log('Adding package to basket:', item.id, item.name);
      await addPackageToBasket(currentBasket.ident, item.id, 1);
    }
    
    console.log('Initializing Tebex checkout with ident:', currentBasket.ident);
    
    Tebex.checkout.init({
      ident: currentBasket.ident,
      theme: 'dark',
      colors: {
        primary: '#84cc16'
      }
    });
    
    registerCheckoutHandlers();
    
    console.log('Launching Tebex checkout');
    Tebex.checkout.launch();
    
    checkoutBtn.textContent = originalText;
    checkoutBtn.disabled = false;
    
  } catch (error) {
    console.error('Checkout error:', error);
    showNotification('Failed to initiate checkout. Please try again or contact support.');
    checkoutBtn.textContent = originalText;
    checkoutBtn.disabled = false;
    
    currentBasket = null;
  }
});

async function init() {
  try {
    console.log('Loading application configuration...');
    await loadConfig();
    applyConfig();
    
    if (!appConfig.tebex.publicToken || appConfig.tebex.publicToken === 'your_tebex_public_token_here') {
      throw new Error('Please configure your Tebex API token in app.config.js');
    }
    
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    
    fetchServerStatus();
    setInterval(fetchServerStatus, 30000);
    
    console.log('Fetching categories from Tebex...');
    const categories = await fetchCategories();
    console.log('Categories loaded:', categories.length);
    
    document.getElementById('loadingState').style.display = 'none';
    renderCategories(categories);
    
  } catch (error) {
    console.error('Initialization error:', error);
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('errorState').querySelector('p').textContent = 
      error.message || 'Failed to load store. Please check your configuration.';
  }
}

init();
