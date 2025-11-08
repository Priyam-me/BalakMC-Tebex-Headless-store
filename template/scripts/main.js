import Tebex from '@tebexio/tebex.js';

const API_BASE = 'https://headless.tebex.io/api';

let appConfig = null;
let cart = [];
let currentBasket = null;
let checkoutHandlersRegistered = false;
let currentUser = null;
let serverType = 'java';
let isGiftPurchase = false;
let giftRecipient = '';

const packageIconFallbacks = ['💎', '⚔️', '🏆', '👑', '🎁', '🔥', '⭐', '🎯'];
const iconColors = ['purple', 'orange', 'lime', 'blue', 'red'];
const categoryIcons = ['⚔️', '💎', '🏆', '👑', '🎁', '🔥', '⭐', '🎯', '🛡️', '🗡️'];
let currentView = 'categories';
let allCategories = [];

let discordCache = { count: null, timestamp: 0 };
const DISCORD_CACHE_DURATION = 5 * 60 * 1000;

class ThemeManager {
  constructor() {
    this.effectsContainer = document.getElementById('themeEffects');
    this.activeEffects = [];
    this.animationFrame = null;
  }

  activate(theme) {
    this.clear();
    document.body.className = '';
    
    if (theme.enableHalloween) {
      document.body.classList.add('theme-halloween');
      this.createHalloweenEffects();
    } else if (theme.enableChristmas) {
      document.body.classList.add('theme-christmas');
      this.createChristmasEffects();
    }
  }

  createHalloweenEffects() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.createHalloweenStaticDecorations();
    
    if (prefersReducedMotion) return;

    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createHalloweenParticle();
      }, i * 300);
    }
  }
  
  createHalloweenStaticDecorations() {
    const cobwebs = [
      { top: '0', left: '0', transform: 'rotate(0deg)' },
      { top: '0', right: '0', transform: 'scaleX(-1)' },
      { top: '30%', left: '5%', transform: 'rotate(45deg) scale(0.7)' },
      { top: '50%', right: '3%', transform: 'rotate(-30deg) scale(0.6)' }
    ];
    
    cobwebs.forEach(pos => {
      const cobweb = document.createElement('div');
      cobweb.className = 'halloween-cobweb';
      Object.assign(cobweb.style, pos);
      cobweb.innerHTML = '🕸️';
      document.body.appendChild(cobweb);
      this.activeEffects.push(cobweb);
    });
    
    const spiders = [
      { top: '10%', left: '15%' },
      { top: '40%', right: '10%' },
      { top: '70%', left: '8%' }
    ];
    
    spiders.forEach(pos => {
      const spider = document.createElement('div');
      spider.className = 'halloween-spider';
      Object.assign(spider.style, pos);
      spider.innerHTML = '🕷️';
      document.body.appendChild(spider);
      this.activeEffects.push(spider);
    });
    
    const ghosts = [
      { top: '20%', right: '20%' },
      { top: '60%', left: '25%' }
    ];
    
    ghosts.forEach((pos, index) => {
      const ghost = document.createElement('div');
      ghost.className = 'halloween-ghost';
      ghost.style.animationDelay = `${index * 2}s`;
      Object.assign(ghost.style, pos);
      ghost.innerHTML = '👻';
      document.body.appendChild(ghost);
      this.activeEffects.push(ghost);
    });
  }

  createHalloweenParticle() {
    const particle = document.createElement('div');
    particle.className = 'halloween-particle';
    const emojis = ['🦇', '👻', '🎃', '🕷️'];
    particle.innerHTML = `<span class="halloween-bat">${emojis[Math.floor(Math.random() * emojis.length)]}</span>`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 4}s`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    this.effectsContainer.appendChild(particle);
    this.activeEffects.push(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
      this.createHalloweenParticle();
    }, (8 + Math.random() * 4) * 1000);
  }

  createChristmasEffects() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.createChristmasStaticDecorations();
    
    if (prefersReducedMotion) return;

    const snowflakeCount = 30;
    for (let i = 0; i < snowflakeCount; i++) {
      setTimeout(() => {
        this.createSnowflake();
      }, i * 150);
    }
  }
  
  createChristmasStaticDecorations() {
    const footer = document.querySelector('.store-footer') || document.querySelector('footer') || document.body;
    
    const snowLayer = document.createElement('div');
    snowLayer.className = 'christmas-snow-layer';
    footer.appendChild(snowLayer);
    this.activeEffects.push(snowLayer);
    
    const snowman = document.createElement('div');
    snowman.className = 'christmas-snowman';
    snowman.innerHTML = '⛄';
    footer.appendChild(snowman);
    this.activeEffects.push(snowman);
    
    const lightsTop = document.createElement('div');
    lightsTop.className = 'christmas-lights christmas-lights-top';
    lightsTop.innerHTML = '💡🔴💡🟢💡🔵💡🟡💡🔴💡🟢💡🔵💡🟡💡';
    document.body.appendChild(lightsTop);
    this.activeEffects.push(lightsTop);
    
    const decorations = [
      { emoji: '🎄', top: '15%', left: '5%' },
      { emoji: '⭐', top: '25%', right: '8%' },
      { emoji: '🎁', top: '45%', left: '10%' },
      { emoji: '🔔', top: '55%', right: '12%' },
      { emoji: '🎄', top: '75%', right: '5%' }
    ];
    
    decorations.forEach((deco, index) => {
      const decoration = document.createElement('div');
      decoration.className = 'christmas-decoration';
      decoration.style.animationDelay = `${index * 0.5}s`;
      Object.assign(decoration.style, { top: deco.top, left: deco.left, right: deco.right });
      decoration.innerHTML = deco.emoji;
      document.body.appendChild(decoration);
      this.activeEffects.push(decoration);
    });
  }

  createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    const snowTypes = ['❄', '❅', '❆', '✻', '✼'];
    snowflake.textContent = snowTypes[Math.floor(Math.random() * snowTypes.length)];
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.animationDuration = `${5 + Math.random() * 5}s`;
    snowflake.style.animationDelay = `${Math.random() * 2}s`;
    snowflake.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
    this.effectsContainer.appendChild(snowflake);
    this.activeEffects.push(snowflake);

    setTimeout(() => {
      if (snowflake.parentNode) {
        snowflake.remove();
      }
      this.createSnowflake();
    }, (5 + Math.random() * 5) * 1000);
  }

  clear() {
    this.activeEffects.forEach(effect => {
      if (effect.parentNode) {
        effect.remove();
      }
    });
    this.activeEffects = [];
    if (this.effectsContainer) {
      this.effectsContainer.innerHTML = '';
    }
  }
}

const themeManager = new ThemeManager();

function formatUsernameForServer(username, type = 'java') {
  if (!username) return username;
  username = username.trim();
  
  if (type === 'bedrock') {
    if (!username.startsWith('.')) {
      return '.' + username;
    }
  } else if (type === 'java') {
    if (username.startsWith('.')) {
      return username.substring(1);
    }
  }
  
  return username;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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
  
  if (appConfig.theme) {
    themeManager.activate(appConfig.theme);
  }
}

async function fetchDiscordMemberCount() {
  try {
    if (!appConfig || !appConfig.discordId || appConfig.discordId === 'YourDiscordServer') {
      document.getElementById('discordCount').textContent = '';
      return;
    }
    
    const now = Date.now();
    if (discordCache.count !== null && (now - discordCache.timestamp) < DISCORD_CACHE_DURATION) {
      document.getElementById('discordCount').textContent = `(${discordCache.count.toLocaleString()})`;
      return;
    }
    
    const response = await fetch(`https://discord.com/api/v10/invites/${appConfig.discordId}?with_counts=true`);
    if (!response.ok) throw new Error('Failed to fetch Discord data');
    
    const data = await response.json();
    const memberCount = data.approximate_member_count || 0;
    
    discordCache = { count: memberCount, timestamp: now };
    document.getElementById('discordCount').textContent = `(${memberCount.toLocaleString()})`;
  } catch (error) {
    console.error('Discord fetch error:', error);
    document.getElementById('discordCount').textContent = '';
  }
}

function loadUserSession() {
  try {
    const savedServerType = localStorage.getItem('server_type');
    if (savedServerType && (savedServerType === 'java' || savedServerType === 'bedrock')) {
      serverType = savedServerType;
      updateServerTypeUI();
    }
    
    const savedUser = localStorage.getItem('tebex_user');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      updateLoginUI();
    }
  } catch (error) {
    console.error('Session load error:', error);
    localStorage.removeItem('tebex_user');
  }
}

function updateServerTypeUI() {
  document.querySelectorAll('.modal-server-type-btn').forEach(btn => {
    if (btn.dataset.type === serverType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function saveUserSession(username) {
  const userData = {
    username: username,
    loginDate: new Date().toISOString()
  };
  currentUser = userData;
  localStorage.setItem('tebex_user', JSON.stringify(userData));
  updateLoginUI();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('tebex_user');
  updateLoginUI();
  showNotification('Logged out successfully');
}

function updateLoginUI() {
  const loginButton = document.getElementById('loginButton');
  const loginText = document.getElementById('loginText');
  
  if (currentUser) {
    loginButton.classList.add('logged-in');
    const displayUsername = formatUsernameForServer(currentUser.username, serverType);
    loginText.textContent = displayUsername;
  } else {
    loginButton.classList.remove('logged-in');
    loginText.textContent = 'Login';
  }
}

function showLogoutModal() {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById('logoutModal');
    const usernameSpan = document.getElementById('logoutUsername');
    const confirmBtn = document.getElementById('logoutConfirmBtn');
    const cancelBtn = document.getElementById('logoutCancelBtn');
    const closeBtn = document.getElementById('closeLogoutModal');
    
    const displayUsername = formatUsernameForServer(currentUser.username, serverType);
    usernameSpan.textContent = displayUsername;
    modal.style.display = 'flex';
    
    const handleConfirm = () => {
      cleanup();
      modal.style.display = 'none';
      resolve(true);
    };
    
    const handleCancel = () => {
      cleanup();
      modal.style.display = 'none';
      resolve(false);
    };
    
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    const cleanup = () => {
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      closeBtn.removeEventListener('click', handleCancel);
      document.removeEventListener('keydown', handleKeyPress);
      modal.removeEventListener('click', handleModalClick);
    };
    
    const handleModalClick = (e) => {
      if (e.target.id === 'logoutModal') {
        handleCancel();
      }
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    closeBtn.addEventListener('click', handleCancel);
    document.addEventListener('keydown', handleKeyPress);
    modal.addEventListener('click', handleModalClick);
  });
}

function showProductDescriptionModal(pkg) {
  const modal = document.getElementById('productDescModal');
  const title = document.getElementById('productDescTitle');
  const content = document.getElementById('productDescContent');
  const closeBtn = document.getElementById('closeProductDescModal');
  const closeBottomBtn = document.getElementById('productDescCloseBtn');
  
  title.textContent = pkg.name;
  
  const description = pkg.description || 'No description available.';
  content.innerHTML = description.replace(/\n/g, '<br>');
  
  modal.style.display = 'flex';
  
  const handleClose = () => {
    cleanup();
    modal.style.display = 'none';
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };
  
  const cleanup = () => {
    closeBtn.removeEventListener('click', handleClose);
    closeBottomBtn.removeEventListener('click', handleClose);
    document.removeEventListener('keydown', handleKeyPress);
    modal.removeEventListener('click', handleModalClick);
  };
  
  const handleModalClick = (e) => {
    if (e.target.id === 'productDescModal') {
      handleClose();
    }
  };
  
  closeBtn.addEventListener('click', handleClose);
  closeBottomBtn.addEventListener('click', handleClose);
  document.addEventListener('keydown', handleKeyPress);
  modal.addEventListener('click', handleModalClick);
}

function showUsernameModal() {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById('usernameModal');
    const input = document.getElementById('usernameInput');
    const submitBtn = document.getElementById('usernameSubmitBtn');
    const cancelBtn = document.getElementById('usernameCancelBtn');
    const closeBtn = document.getElementById('closeUsernameModal');
    const serverTypeBtns = modal.querySelectorAll('.modal-server-type-btn');
    
    if (currentUser && currentUser.username) {
      input.value = currentUser.username;
    } else {
      input.value = '';
    }
    
    updateServerTypeUI();
    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 100);
    
    const handleServerTypeClick = (e) => {
      const btn = e.currentTarget;
      const type = btn.dataset.type;
      if (type !== serverType) {
        serverType = type;
        localStorage.setItem('server_type', serverType);
        updateServerTypeUI();
      }
    };
    
    serverTypeBtns.forEach(btn => {
      btn.addEventListener('click', handleServerTypeClick);
    });
    
    const handleSubmit = () => {
      let username = input.value.trim();
      if (!username) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 300);
        return;
      }
      
      username = formatUsernameForServer(username, serverType);
      
      cleanup();
      modal.style.display = 'none';
      resolve(username);
    };
    
    const handleCancel = () => {
      cleanup();
      modal.style.display = 'none';
      reject(new Error('Username input cancelled'));
    };
    
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    const cleanup = () => {
      submitBtn.removeEventListener('click', handleSubmit);
      cancelBtn.removeEventListener('click', handleCancel);
      closeBtn.removeEventListener('click', handleCancel);
      input.removeEventListener('keypress', handleKeyPress);
      modal.removeEventListener('click', handleModalClick);
      serverTypeBtns.forEach(btn => {
        btn.removeEventListener('click', handleServerTypeClick);
      });
    };
    
    const handleModalClick = (e) => {
      if (e.target.id === 'usernameModal') {
        handleCancel();
      }
    };
    
    submitBtn.addEventListener('click', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    closeBtn.addEventListener('click', handleCancel);
    input.addEventListener('keypress', handleKeyPress);
    modal.addEventListener('click', handleModalClick);
  });
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

async function createBasket(username) {
  try {
    const completeUrl = window.location.origin + appConfig.urls.completeUrl;
    const cancelUrl = window.location.origin + appConfig.urls.cancelUrl;
    
    const basketData = {
      complete_url: completeUrl,
      cancel_url: cancelUrl,
      complete_auto_redirect: true
    };
    
    if (username) {
      basketData.username = username;
    }
    
    const response = await fetch(`${API_BASE}/accounts/${appConfig.tebex.publicToken}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(basketData)
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
  allCategories = categories;
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';
  
  if (categories.length === 0) {
    container.innerHTML = '<p class="error-state">No packages available at the moment.</p>';
    return;
  }

  const backButton = document.getElementById('backToCategoriesBtn');
  if (backButton) {
    backButton.style.display = 'none';
  }
  
  currentView = 'categories';
  let categoryIndex = 0;
  
  categories.forEach(category => {
    if (!category.packages || category.packages.length === 0) return;
    
    const iconFallback = categoryIcons[categoryIndex % categoryIcons.length];
    const iconColor = iconColors[categoryIndex % iconColors.length];
    categoryIndex++;
    
    const categoryEl = document.createElement('div');
    categoryEl.className = 'category-card glass-card';
    categoryEl.dataset.categoryId = category.id;
    
    categoryEl.innerHTML = `
      <div class="category-icon ${iconColor}">${iconFallback}</div>
      <h3 class="category-name">${category.name}</h3>
      <p class="category-description">${category.packages.length} Package${category.packages.length !== 1 ? 's' : ''}</p>
    `;
    
    categoryEl.addEventListener('click', () => {
      renderPackages(category);
    });
    
    container.appendChild(categoryEl);
  });
}

function renderPackages(category) {
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';
  currentView = 'packages';
  
  const backButton = document.getElementById('backToCategoriesBtn');
  if (backButton) {
    backButton.style.display = 'inline-flex';
  }
  
  let packageIndex = 0;
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
             loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="package-image-fallback ${iconColor}" style="display:none;">${iconFallback}</div>
      `;
    } else {
      imageHtml = `<div class="package-icon ${iconColor}">${iconFallback}</div>`;
    }
    
    let description = pkg.description || 'Enhance your gameplay experience';
    
    const cleanDescription = (desc) => {
      if (!desc) return 'Enhance your gameplay experience';
      
      let cleaned = desc;
      
      const placeholderPatterns = [
        /see\s+image/gi,
        /check\s+image/gi,
        /refer\s+to\s+image/gi,
        /view\s+image/gi,
        /see\s+the\s+image/gi,
        /check\s+the\s+image/gi,
        /refer\s+to\s+the\s+image/gi,
        /please\s+see\s+image/gi,
        /please\s+check\s+image/gi,
        /see\s+img/gi,
        /check\s+img/gi
      ];
      
      placeholderPatterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, '');
      });
      
      cleaned = cleaned
        .replace(/[.,:;!?]+\s*[.,:;!?]+/g, '. ')
        .replace(/\s+/g, ' ')
        .replace(/^\s*[.,:;!?]+\s*/g, '')
        .trim();
      
      if (cleaned.length < 10) {
        return 'Enhance your gameplay experience';
      }
      
      if (cleaned.length > 200) {
        return cleaned.substring(0, 200).trim() + '...';
      }
      
      return cleaned;
    };
    
    description = cleanDescription(description);
    
    packageEl.innerHTML = `
      <button class="package-info-btn" title="View details">i</button>
      ${imageHtml}
      <h3 class="package-name">${pkg.name}</h3>
      <p class="package-description">${description}</p>
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
    
    const infoBtn = packageEl.querySelector('.package-info-btn');
    infoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showProductDescriptionModal(pkg);
    });
    
    container.appendChild(packageEl);
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
  cart.push(packageData);
  currentBasket = null;
  updateCartUI();
  
  const count = cart.filter(item => item.id === packageData.id).length;
  if (count > 1) {
    showNotification(`${packageData.name} added to cart (x${count})!`);
  } else {
    showNotification(`${packageData.name} added to cart!`);
  }
}

function removeFromCart(packageId) {
  const index = cart.findIndex(item => item.id === packageId);
  if (index > -1) {
    const removedItem = cart.splice(index, 1)[0];
    const remaining = cart.filter(item => item.id === packageId).length;
    
    currentBasket = null;
    updateCartUI();
    renderCart();
    
    if (remaining > 0) {
      showNotification(`${removedItem.name} removed (${remaining} remaining)`);
    } else {
      showNotification(`${removedItem.name} removed from cart`);
    }
  }
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
}

async function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartTotalEl.textContent = '$0.00';
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
  
  cartTotalEl.textContent = 'Calculating...';
  document.getElementById('checkoutButton').disabled = false;
  
  try {
    const packageCounts = {};
    cart.forEach(item => {
      packageCounts[item.id] = (packageCounts[item.id] || 0) + 1;
    });
    
    const packages = Object.entries(packageCounts).map(([id, quantity]) => ({
      id: parseInt(id),
      quantity: quantity
    }));
    
    const response = await fetch('/api/cart/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ packages })
    });
    
    if (response.ok) {
      const data = await response.json();
      cartTotalEl.textContent = formatPrice(data.total, data.currency);
    } else {
      const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
      const currency = cart[0]?.currency || 'USD';
      cartTotalEl.textContent = formatPrice(total, currency);
    }
  } catch (error) {
    console.error('Cart total calculation error:', error);
    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const currency = cart[0]?.currency || 'USD';
    cartTotalEl.textContent = formatPrice(total, currency);
  }
  
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

document.getElementById('backToCategoriesBtn').addEventListener('click', () => {
  if (allCategories.length > 0) {
    renderCategories(allCategories);
  }
});

document.getElementById('checkGiftcardBtn').addEventListener('click', async () => {
  const input = document.getElementById('giftcardInput');
  const result = document.getElementById('giftcardResult');
  const code = input.value.trim();
  
  if (!code) {
    result.style.display = 'block';
    result.className = 'giftcard-result error';
    result.textContent = 'Please enter a gift card code.';
    return;
  }
  
  result.style.display = 'block';
  result.className = 'giftcard-result';
  result.textContent = 'Checking gift card...';
  
  try {
    const response = await fetch('/api/giftcards/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    
    if (data.valid) {
      result.className = 'giftcard-result success';
      result.textContent = `Valid! Balance: ${formatPrice(data.balance, data.currency)}`;
    } else {
      result.className = 'giftcard-result error';
      result.textContent = data.error || 'Invalid gift card code.';
    }
  } catch (error) {
    console.error('Gift card validation error:', error);
    result.className = 'giftcard-result error';
    result.textContent = 'Failed to validate gift card. Please try again.';
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
    if (isGiftPurchase && !giftRecipient) {
      showNotification('Please enter recipient username for gift purchase');
      document.getElementById('giftRecipientInput').focus();
      return;
    }
    
    const username = await showUsernameModal();
    
    if (!username || username.trim() === '') {
      showNotification('Username is required for checkout');
      return;
    }
    
    if (currentUser && username) {
      currentUser.username = username;
      saveUserSession(username);
    }
    
    checkoutBtn.textContent = 'Creating order...';
    checkoutBtn.disabled = true;
    
    if (!appConfig || !appConfig.tebex || !appConfig.tebex.publicToken) {
      throw new Error('Store configuration is not loaded. Please refresh the page.');
    }
    
    const recipientUsername = isGiftPurchase ? formatUsernameForServer(giftRecipient, serverType) : username.trim();
    
    console.log('Creating fresh basket for current cart items...');
    console.log('Is gift:', isGiftPurchase, 'Recipient:', recipientUsername);
    currentBasket = await createBasket(recipientUsername);
    
    if (!currentBasket || !currentBasket.ident) {
      throw new Error('Failed to create basket. Please check your Tebex configuration.');
    }
    
    console.log('Basket created with ident:', currentBasket.ident);
    
    for (const item of cart) {
      console.log('Adding package to basket:', item.id, item.name);
      await addPackageToBasket(currentBasket.ident, item.id, 1);
    }
    
    console.log('Initializing Tebex checkout with ident:', currentBasket.ident);
    
    registerCheckoutHandlers();
    
    Tebex.checkout.init({
      ident: currentBasket.ident,
      theme: 'dark',
      colors: {
        primary: '#84cc16'
      }
    });
    
    console.log('Launching Tebex checkout');
    await new Promise(resolve => setTimeout(resolve, 500));
    Tebex.checkout.launch();
    
    checkoutBtn.textContent = originalText;
    checkoutBtn.disabled = false;
    
  } catch (error) {
    if (error.message === 'Username input cancelled') {
      console.log('User cancelled username input');
      return;
    }
    
    console.error('Checkout error details:', error);
    let errorMessage = 'Failed to initiate checkout. ';
    
    if (error.message.includes('configuration') || error.message.includes('token')) {
      errorMessage += 'Please check your store configuration.';
    } else if (error.message.includes('basket')) {
      errorMessage += 'Unable to create basket. Please try again.';
    } else if (error.message.includes('login') || error.message.includes('auth')) {
      errorMessage += 'Authentication required. Please ensure username is valid.';
    } else {
      errorMessage += 'Please try again or contact support.';
    }
    
    showNotification(errorMessage);
    checkoutBtn.textContent = originalText;
    checkoutBtn.disabled = false;
    
    currentBasket = null;
  }
});

document.getElementById('discordButton').addEventListener('click', () => {
  if (appConfig && appConfig.discordLink) {
    window.open(appConfig.discordLink, '_blank');
  }
});

document.getElementById('loginButton').addEventListener('click', async () => {
  if (currentUser) {
    const shouldLogout = await showLogoutModal();
    if (shouldLogout) {
      logoutUser();
    }
  } else {
    const modal = document.getElementById('loginModal');
    const input = document.getElementById('loginUsernameInput');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const cancelBtn = document.getElementById('loginCancelBtn');
    const closeBtn = document.getElementById('closeLoginModal');
    const serverTypeBtns = modal.querySelectorAll('.modal-server-type-btn');
    
    updateServerTypeUI();
    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 100);
    
    const handleServerTypeClick = (e) => {
      const btn = e.currentTarget;
      const type = btn.dataset.type;
      if (type !== serverType) {
        serverType = type;
        localStorage.setItem('server_type', serverType);
        updateServerTypeUI();
      }
    };
    
    serverTypeBtns.forEach(btn => {
      btn.addEventListener('click', handleServerTypeClick);
    });
    
    const handleSubmit = () => {
      const username = input.value.trim();
      if (!username) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 300);
        return;
      }
      cleanup();
      modal.style.display = 'none';
      saveUserSession(username);
      showNotification('Logged in successfully!');
    };
    
    const handleCancel = () => {
      cleanup();
      modal.style.display = 'none';
    };
    
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    const cleanup = () => {
      submitBtn.removeEventListener('click', handleSubmit);
      cancelBtn.removeEventListener('click', handleCancel);
      closeBtn.removeEventListener('click', handleCancel);
      input.removeEventListener('keypress', handleKeyPress);
      modal.removeEventListener('click', handleModalClick);
      serverTypeBtns.forEach(btn => {
        btn.removeEventListener('click', handleServerTypeClick);
      });
    };
    
    const handleModalClick = (e) => {
      if (e.target.id === 'loginModal') {
        handleCancel();
      }
    };
    
    submitBtn.addEventListener('click', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    closeBtn.addEventListener('click', handleCancel);
    input.addEventListener('keypress', handleKeyPress);
    modal.addEventListener('click', handleModalClick);
  }
});

document.getElementById('giftCheckbox').addEventListener('change', (e) => {
  isGiftPurchase = e.target.checked;
  const recipientSection = document.getElementById('giftRecipientSection');
  
  if (isGiftPurchase) {
    recipientSection.style.display = 'block';
  } else {
    recipientSection.style.display = 'none';
    giftRecipient = '';
    document.getElementById('giftRecipientInput').value = '';
  }
});

document.getElementById('giftRecipientInput').addEventListener('input', (e) => {
  giftRecipient = e.target.value.trim();
});

async function fetchTopCustomer() {
  const topCustomerContent = document.getElementById('topCustomerContent');
  
  try {
    const response = await fetch('/api/top-customer');
    if (!response.ok) {
      throw new Error('Failed to fetch top customer');
    }
    
    const data = await response.json();
    
    if (data && data.username && typeof data.amount === 'number') {
      const avatarUrl = `https://minotar.net/avatar/${data.username}/64`;
      topCustomerContent.innerHTML = `
        <div class="customer-item">
          <img src="${avatarUrl}" alt="${data.username}" class="customer-avatar" onerror="this.src='https://minotar.net/avatar/steve/64'">
          <div class="customer-info">
            <span class="customer-name">${data.username}</span>
            <span class="customer-amount">$${data.amount.toFixed(2)} USD</span>
          </div>
        </div>
      `;
    } else {
      topCustomerContent.innerHTML = `
        <div class="customer-item">
          <img src="https://minotar.net/avatar/steve/64" alt="No data" class="customer-avatar">
          <div class="customer-info">
            <span class="customer-name">No purchases today</span>
            <span class="customer-amount">$0.00 USD</span>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Top customer fetch error:', error);
    topCustomerContent.innerHTML = `
      <div class="customer-item">
        <img src="https://minotar.net/avatar/steve/64" alt="Error" class="customer-avatar">
        <div class="customer-info">
          <span class="customer-name">Unable to load data</span>
          <span class="customer-amount">$0.00 USD</span>
        </div>
      </div>
    `;
  }
}

async function init() {
  try {
    console.log('Loading application configuration...');
    await loadConfig();
    applyConfig();
    
    if (!appConfig.tebex.publicToken || appConfig.tebex.publicToken === 'your_tebex_public_token_here') {
      throw new Error('Please configure your Tebex API token in app.config.js');
    }
    
    loadUserSession();
    
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    
    fetchServerStatus();
    setInterval(fetchServerStatus, 60000);
    
    fetchDiscordMemberCount();
    
    fetchTopCustomer();
    setInterval(fetchTopCustomer, 300000);
    
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
