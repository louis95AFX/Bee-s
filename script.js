/* =========================================
   CORE STATE & VARIABLES
   ========================================= */
   let cart = [];
   let currentCategory = 'all';
   let currentShippingMethod = 'pickup';
   const DELIVERY_FEE = 350;
   
   /* =========================================
      NAVIGATION & UI TOGGLES
      ========================================= */
   function toggleMenu() {
       document.getElementById('mobile-menu').classList.toggle('translate-x-full');
   }
   
   function toggleCart() {
       document.getElementById('cart-sidebar').classList.toggle('translate-x-full');
       document.getElementById('cart-overlay').classList.toggle('hidden');
   }
   
   function toggleAuthModal() {
       const modal = document.getElementById('auth-modal');
       const overlay = document.getElementById('auth-overlay');
       modal.classList.toggle('hidden');
       overlay.classList.toggle('hidden');
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
   
   /* =========================================
      CART LOGIC & ANIMATIONS
      ========================================= */
   function addToCart(name, price, img, event) {
       cart.push({ name, price, img });
       updateCartUI();
   
       // Bee Flight Animation (only if event exists, i.e., from main grid)
       if (event) {
           const bee = document.createElement('div');
           bee.className = 'flying-bee bee-animation';
           bee.innerHTML = '🐝';
           bee.style.left = `${event.clientX}px`;
           bee.style.top = `${event.clientY}px`;
           document.body.appendChild(bee);
   
           const cartBtn = document.getElementById('cart-btn');
           const rect = cartBtn.getBoundingClientRect();
           
           setTimeout(() => {
               bee.style.left = `${rect.left + rect.width / 2}px`;
               bee.style.top = `${rect.top + rect.height / 2}px`;
               bee.style.transform = 'scale(0.5) rotate(20deg)';
               bee.style.opacity = '0.5';
           }, 50);
   
           setTimeout(() => {
               bee.remove();
               cartBtn.classList.add('cart-bump');
               setTimeout(() => cartBtn.classList.remove('cart-bump'), 300);
           }, 850);
       }
   }
   
   function updateCartUI() {
       const itemsContainer = document.getElementById('cart-items');
       const countDisplay = document.getElementById('cart-count');
       const totalDisplay = document.getElementById('cart-total');
       
       countDisplay.innerText = cart.length;
       
       if (cart.length === 0) {
           itemsContainer.innerHTML = `<div class="text-center py-20 text-gray-400"><span class="text-5xl block mb-4">🛒</span>Your hive is empty!</div>`;
           totalDisplay.innerText = `R0`;
           return;
       }
   
       let total = 0;
       itemsContainer.innerHTML = cart.map((item, index) => {
           total += item.price;
           return `
               <div class="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                   <img src="${item.img}" onerror="this.src='https://via.placeholder.com/150'" class="w-16 h-16 rounded-xl object-cover">
                   <div class="flex-1">
                       <p class="font-black text-sm text-beeBlack">${item.name}</p>
                       <p class="text-beeYellow font-black text-sm italic">R${item.price.toLocaleString()}</p>
                   </div>
                   <button onclick="removeFromCart(${index})" class="text-red-500 p-2"><i class="fas fa-trash text-xs"></i></button>
               </div>`;
       }).join('');
       
       totalDisplay.innerText = `R${total.toLocaleString()}`;
   }
   
   function removeFromCart(index) {
       cart.splice(index, 1);
       updateCartUI();
   }
   
   /* =========================================
      FILTER & SEARCH
      ========================================= */
   function filterProducts(category, clickedBtn) {
       if (category) {
           currentCategory = category;
           document.querySelectorAll('.category-btn').forEach(btn => {
               btn.className = "category-btn bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold text-sm uppercase hover:border-beeYellow transition-all";
           });
           clickedBtn.className = "category-btn active bg-beeYellow text-black px-6 py-2 rounded-full font-bold text-sm uppercase transition-all shadow-md";
       }
   
       const searchTerm = document.getElementById('product-search').value.toLowerCase();
       document.querySelectorAll('.product-item').forEach(item => {
           const title = item.querySelector('h4').innerText.toLowerCase();
           const itemCat = item.getAttribute('data-category');
           const matchesCat = (currentCategory === 'all' || itemCat === currentCategory);
           const matchesSearch = title.includes(searchTerm);
           item.style.display = (matchesCat && matchesSearch) ? 'block' : 'none';
       });
   }
   
   /* =========================================
      PREVIEW MODAL
      ========================================= */
   function openPreview(name, price, img, desc, category) {
       document.getElementById('preview-title').innerText = name;
       document.getElementById('preview-price').innerText = 'R' + price.toLocaleString();
       document.getElementById('preview-img').src = img;
       document.getElementById('preview-desc').innerText = desc;
       document.getElementById('preview-category').innerText = category;
       
       document.getElementById('preview-add-btn').onclick = () => { addToCart(name, price, img); closePreview(); };
   
       document.getElementById('preview-modal').classList.remove('hidden');
       document.getElementById('preview-overlay').classList.remove('hidden');
       document.body.style.overflow = 'hidden';
   }
   
   function closePreview() {
       document.getElementById('preview-modal').classList.add('hidden');
       document.getElementById('preview-overlay').classList.add('hidden');
       document.body.style.overflow = 'auto';
   }
   
   /* =========================================
      CHECKOUT & TRACKING LOGIC
      ========================================= */
   function toggleCheckoutModal() {
       document.getElementById('checkout-modal').classList.toggle('hidden');
       document.getElementById('checkout-overlay').classList.toggle('hidden');
   }
   
   function checkout() {
       if (cart.length === 0) return alert("Your hive is empty!");
       
       // Reset modal view to step 1
       document.getElementById('checkout-step-1').classList.remove('hidden');
       document.getElementById('checkout-step-2').classList.add('hidden');
       
       toggleCart();
       toggleCheckoutModal();
       updateOrderSummary();
   }
   
   function setShippingMethod(method) {
       currentShippingMethod = method;
       const isDelivery = method === 'delivery';
       
       document.getElementById('delivery-form').classList.toggle('hidden', !isDelivery);
       
       // Update Button Styles
       document.getElementById('btn-delivery').className = isDelivery 
           ? "flex-1 py-4 rounded-xl border-2 border-beeYellow bg-beeYellow text-black font-black uppercase text-xs"
           : "flex-1 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 font-black uppercase text-xs";
           
       document.getElementById('btn-pickup').className = !isDelivery 
           ? "flex-1 py-4 rounded-xl border-2 border-beeYellow bg-beeYellow text-black font-black uppercase text-xs"
           : "flex-1 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 font-black uppercase text-xs";
   
       updateOrderSummary();
   }
   
   function updateOrderSummary() {
       const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
       const fee = currentShippingMethod === 'delivery' ? DELIVERY_FEE : 0;
       
       document.getElementById('summary-subtotal').innerText = `R${subtotal.toLocaleString()}`;
       document.getElementById('summary-fee').innerText = `R${fee.toLocaleString()}`;
       document.getElementById('summary-total').innerText = `R${(subtotal + fee).toLocaleString()}`;
   }
   
   function finalizeWhatsAppOrder() {
    const phoneNumber = "27637723987";
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const fee = currentShippingMethod === 'delivery' ? DELIVERY_FEE : 0;
    const total = subtotal + fee;

    let message = `*🐝 NEW BEE APPLIANCES ORDER*\n`;
    message += `----------------------------\n`;
    message += `*Items:*\n${cart.map(i => `- ${i.name} (R${i.price.toLocaleString()})`).join('\n')}\n\n`;
    message += `*Subtotal:* R${subtotal.toLocaleString()}\n`;
    message += `*Delivery Fee:* R${fee.toLocaleString()}\n`;
    message += `*GRAND TOTAL:* R${total.toLocaleString()}\n`;
    message += `----------------------------\n`;
    message += `*METHOD:* ${currentShippingMethod.toUpperCase()}\n`;

    if (currentShippingMethod === 'delivery') {
        const name = document.getElementById('ship-name').value;
        const surname = document.getElementById('ship-surname').value;
        const phone = document.getElementById('ship-phone').value;
        const altPhone = document.getElementById('ship-phone-alt').value;
        const address = document.getElementById('ship-address').value;

        // Validation
        if (!name || !surname || !phone || !address) {
            alert("Please fill in all required delivery details (Name, Surname, Phone, and Address).");
            return;
        }

        message += `*CUSTOMER:* ${name} ${surname}\n`;
        message += `*PHONE:* ${phone}\n`;
        if(altPhone) message += `*ALT PHONE:* ${altPhone}\n`;
        message += `*ADDRESS:* ${address}\n`;
    }

    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Trigger the realistic Uber tracking demo
    showTracking();
}
   
   function showTracking() {
    document.getElementById('checkout-step-1').classList.add('hidden');
    document.getElementById('checkout-step-2').classList.remove('hidden');
    
    const bee = document.getElementById('bee-driver');
    
    // Step-by-step "Uber" movement animation
    setTimeout(() => {
        // Move to first turn
        bee.style.left = '20%';
        bee.style.top = '70%';
        bee.style.transform = 'rotate(-10deg)';
        
        setTimeout(() => {
            // Drive down the main road
            bee.style.left = '60%';
            bee.style.top = '70%';
            bee.style.transform = 'rotate(0deg)';
            
            setTimeout(() => {
                // Final turn toward the user
                bee.style.left = '80%';
                bee.style.top = '35%';
                bee.style.transform = 'rotate(-45deg)';
            }, 2000);
        }, 2000);
    }, 500);
}
   // Global Event Listeners
   document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
           document.getElementById('auth-modal').classList.add('hidden');
           document.getElementById('auth-overlay').classList.add('hidden');
           closePreview();
       }
   });