import Tebex from '@tebexio/tebex.js';

const API_BASE = 'https://headless.tebex.io/api';
const PUBLIC_TOKEN = import.meta.env.VITE_TEBEX_PUBLIC_TOKEN;
const STORE_NAME = import.meta.env.VITE_STORE_NAME || 'Minecraft Store';
const COMPLETE_URL = import.meta.env.VITE_COMPLETE_URL || window.location.origin + '/success';
const CANCEL_URL = import.meta.env.VITE_CANCEL_URL || window.location.origin + '/cancel';

let cart = [];
let currentBasket = null;

document.getElementById('storeName').textContent = STORE_NAME;

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/accounts/${PUBLIC_TOKEN}/categories?includePackages=1`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
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
    const response = await fetch(`${API_BASE}/accounts/${PUBLIC_TOKEN}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complete_url: COMPLETE_URL,
        cancel_url: CANCEL_URL,
        complete_auto_redirect: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create basket: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating basket:', error);
    throw error;
  }
}

async function addPackageToBasket(basketIdent, packageId) {
  try {
    const response = await fetch(`${API_BASE}/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
        quantity: 1
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add package: ${response.statusText}`);
    }
    
    return await response.json();
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
  
  categories.forEach(category => {
    if (!category.packages || category.packages.length === 0) return;
    
    const categoryEl = document.createElement('div');
    categoryEl.className = 'category';
    
    categoryEl.innerHTML = `
      <div class="category-header">
        <h2 class="category-title">${category.name}</h2>
        ${category.description ? `<p class="category-description">${category.description}</p>` : ''}
      </div>
      <div class="packages-grid">
        ${category.packages.map(pkg => `
          <div class="package-card glass-card" data-package-id="${pkg.id}">
            <div class="package-header">
              <h3 class="package-name">${pkg.name}</h3>
            </div>
            <p class="package-description">${pkg.description || 'Enhance your gameplay experience'}</p>
            <div class="package-footer">
              <div class="package-price">${formatPrice(pkg.base_price, pkg.currency)}</div>
              <button class="add-to-cart-btn" data-package='${JSON.stringify({
                id: pkg.id,
                name: pkg.name,
                price: pkg.base_price,
                currency: pkg.currency
              })}'>
                Add to Cart
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    container.appendChild(categoryEl);
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
    updateCartUI();
    showNotification(`${packageData.name} added to cart!`);
  } else {
    showNotification(`${packageData.name} is already in your cart!`);
  }
}

function removeFromCart(packageId) {
  cart = cart.filter(item => item.id !== packageId);
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
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, var(--lime-primary), var(--lime-light));
    color: var(--bg-dark);
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    z-index: 3000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 10px 30px rgba(132, 204, 22, 0.4);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
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

document.getElementById('checkoutButton').addEventListener('click', async () => {
  if (cart.length === 0) return;
  
  try {
    document.getElementById('checkoutButton').textContent = 'Creating order...';
    document.getElementById('checkoutButton').disabled = true;
    
    if (!currentBasket) {
      currentBasket = await createBasket();
    }
    
    for (const item of cart) {
      await addPackageToBasket(currentBasket.ident, item.id);
    }
    
    Tebex.checkout.init({
      ident: currentBasket.ident,
      theme: 'dark',
      colors: {
        primary: '#84cc16'
      }
    });
    
    Tebex.checkout.on('payment:complete', (data) => {
      console.log('Payment successful!', data);
      cart = [];
      currentBasket = null;
      updateCartUI();
      document.getElementById('cartModal').style.display = 'none';
      showNotification('Thank you for your purchase!');
    });
    
    Tebex.checkout.on('payment:cancelled', () => {
      console.log('Payment cancelled');
      showNotification('Checkout cancelled');
      document.getElementById('checkoutButton').textContent = 'Proceed to Checkout';
      document.getElementById('checkoutButton').disabled = false;
    });
    
    Tebex.checkout.launch();
    
    document.getElementById('checkoutButton').textContent = 'Proceed to Checkout';
    document.getElementById('checkoutButton').disabled = false;
    
  } catch (error) {
    console.error('Checkout error:', error);
    showNotification('Failed to initiate checkout. Please try again.');
    document.getElementById('checkoutButton').textContent = 'Proceed to Checkout';
    document.getElementById('checkoutButton').disabled = false;
  }
});

async function init() {
  try {
    if (!PUBLIC_TOKEN || PUBLIC_TOKEN === 'your_public_token_here') {
      throw new Error('Please configure your Tebex API token');
    }
    
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    
    const categories = await fetchCategories();
    
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

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

init();
