let cart = [];
    
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('translate-x-full');
}

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('translate-x-full');
  document.getElementById('cart-overlay').classList.toggle('hidden');
}

function addToCart(name, price, img) {
  cart.push({ name, price, img });
  updateCartUI();
  
  const btn = document.getElementById('cart-btn');
  btn.classList.add('cart-bump');
  setTimeout(() => btn.classList.remove('cart-bump'), 300);

  // Auto-open cart briefly to show addition (optional, but good UX)
  // toggleCart(); 
}

function updateCartUI() {
  const itemsContainer = document.getElementById('cart-items');
  const countDisplay = document.getElementById('cart-count');
  const totalDisplay = document.getElementById('cart-total');
  
  countDisplay.innerText = cart.length;
  
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-20 animate-pulse">
        <span class="text-5xl block mb-4">🛒</span>
        <p class="text-gray-400">Your hive is empty!</p>
      </div>`;
    totalDisplay.innerText = `R0`;
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-fadeIn">
<img src="${item.img}" 
 onerror="this.src='https://via.placeholder.com/150?text=No+Image'" 
 class="w-16 h-16 rounded-xl object-cover border border-gray-100">            <div class="flex-1">
          <p class="font-black text-sm text-beeBlack">${item.name}</p>
          <p class="text-beeYellow font-black text-sm italic">R${item.price.toLocaleString()}</p>
        </div>
        <button onclick="removeFromCart(${index})" class="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    `;
  }).join('');
  
  totalDisplay.innerText = `R${total.toLocaleString()}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function checkout() {
  if(cart.length === 0) return alert("Add items to your cart first!");
  
  const itemNames = cart.map(i => i.name).join(', ');
  const total = cart.reduce((acc, curr) => acc + curr.price, 0);
  const text = `🐝 Hi Bee Appliances! I'm interested in: ${itemNames}. Total: R${total}. Can you confirm availability?`;
  const url = `https://wa.me/27637723987?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
// Store the current active category in a global variable
let currentCategory = 'all';

function filterProducts(category, clickedBtn) {
  // 1. Update Category state if a button was clicked
  if (category) {
    currentCategory = category;
    
    // Update Button Styling
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
      btn.classList.remove('bg-beeYellow', 'text-black', 'shadow-md', 'active');
      btn.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
    });

    clickedBtn.classList.add('bg-beeYellow', 'text-black', 'shadow-md', 'active');
    clickedBtn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
  }

  // 2. Get Search Input
  const searchTerm = document.getElementById('product-search').value.toLowerCase();
  
  // 3. Filter Items based on BOTH Category and Search
  const items = document.querySelectorAll('.product-item');
  
  items.forEach(item => {
    const title = item.querySelector('h4').innerText.toLowerCase();
    const itemCategory = item.getAttribute('data-category');
    
    const matchesCategory = (currentCategory === 'all' || itemCategory === currentCategory);
    const matchesSearch = title.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      item.style.display = 'block';
      item.classList.add('animate-fade-in'); // Optional: Add a CSS fade class
    } else {
      item.style.display = 'none';
    }
  });
}
function toggleAuthModal() {
  const modal = document.getElementById('auth-modal');
  const overlay = document.getElementById('auth-overlay');
  
  if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
      // Add a small delay for an entry animation if you want one
  } else {
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
  }
}

function switchAuth(type) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (type === 'register') {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
  } else {
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
  }
}

// Close modal when pressing ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
      document.getElementById('auth-modal').classList.add('hidden');
      document.getElementById('auth-overlay').classList.add('hidden');
  }
});