console.log('✓ script.js loaded successfully');


// Force deduplication of products in localStorage at script start
function deduplicateProducts(arr) {
    if (!Array.isArray(arr)) {
        console.warn('⚠️ deduplicateProducts: input is not an array');
        return [];
    }
    const seenIds = new Set();
    const result = [];
    let removedCount = 0;
    
    for (const p of arr) {
        // Skip invalid products
        if (!p || typeof p !== 'object') {
            console.warn('⚠️ Skipping invalid product:', p);
            removedCount++;
            continue;
        }
        if (!p.id || !p.name) {
            console.warn('⚠️ Skipping product missing id or name:', p);
            removedCount++;
            continue;
        }
        
        // Skip duplicates
        if (seenIds.has(p.id)) {
            console.warn('⚠️ Duplicate product ID found:', p.id);
            removedCount++;
            continue;
        }
        
        seenIds.add(p.id);
        result.push(p);
    }
    
    if (removedCount > 0) {
        console.log(`✅ deduplicateProducts: removed ${removedCount} duplicates/invalid products`);
    }
    return result;
}

let productsRaw = JSON.parse(localStorage.getItem('zonewear-products')) || [];
let products = deduplicateProducts(productsRaw);
if (products.length !== productsRaw.length) {
    localStorage.setItem('zonewear-products', JSON.stringify(products));
    console.log('✅ Duplicate products removed from localStorage:', productsRaw.length - products.length);
}

// Initialize BroadcastChannel for cross-window communication
const channel = new BroadcastChannel('zonewear-products');

// Initialize IndexedDB for images
let db;
let dbReady = false;
const dbRequest = indexedDB.open('ZoneWearDB', 2);
dbRequest.onerror = () => console.log('Database failed to open');
dbRequest.onsuccess = () => {
    db = dbRequest.result;
    dbReady = true;
    console.log('IndexedDB opened successfully');
};
dbRequest.onupgradeneeded = (e) => {
    const database = e.target.result;
    if (database.objectStoreNames.contains('images')) {
        database.deleteObjectStore('images');
    }
    database.createObjectStore('images', { keyPath: 'id', autoIncrement: false });
    console.log('IndexedDB upgraded with images store');
};

// Get image from IndexedDB
function getImageFromDb(imageName) {
    return new Promise((resolve) => {
        if (!db) {
            resolve(null);
            return;
        }
        try {
            const transaction = db.transaction(['images'], 'readonly');
            const objectStore = transaction.objectStore('images');
            const request = objectStore.get(imageName);
            request.onsuccess = () => {
                if (request.result && request.result.blob) {
                    resolve(URL.createObjectURL(request.result.blob));
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => {
                console.error('Error getting image from DB:', request.error);
                resolve(null);
            };
        } catch(e) {
            console.error('Error in getImageFromDb:', e);
            resolve(null);
        }
    });
}

// Language setup
let currentLang = localStorage.getItem('zonewear-lang') || 'en';
const translations = {
    en: {
        selectSize: 'Please select a size',
        addToCart: 'added to cart',
        cartTitle: 'Shopping Cart',
        emptyCart: 'Your cart is empty',
        remove: 'Remove',
        total: 'Total',
        size: 'Size',
        checkout: 'Checkout',
        deliveryInfo: 'Delivery Information',
        fullName: 'Full Name',
        phone: 'Phone',
        state: 'State',
        cancel: 'Cancel',
        completeOrder: 'Complete Order',
        orderSuccess: 'Order placed successfully!',
        searchNoResults: 'No products found'
    },
    ar: {
        selectSize: 'اختر المقاس',
        addToCart: 'تمت إضافته للسلة',
        cartTitle: 'سلة التسوق',
        emptyCart: 'السلة فارغة',
        remove: 'حذف',
        total: 'الإجمالي',
        size: 'المقاس',
        checkout: 'الدفع',
        deliveryInfo: 'معلومات التوصيل',
        fullName: 'الاسم الكامل',
        phone: 'رقم الهاتف',
        state: 'الولاية',
        cancel: 'إلغاء',
        completeOrder: 'إكمال الطلب',
        orderSuccess: 'تم الطلب بنجاح!',
        searchNoResults: 'لم يتم العثور على منتجات'
    }
};

function t(key) {
    return translations[currentLang]?.[key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('zonewear-lang', lang);
    console.log('Language set to:', lang);
}

// Data initialization
let cart = JSON.parse(localStorage.getItem('zonewear-cart')) || [];
let deliveryInfo = JSON.parse(localStorage.getItem('zonewear-delivery')) || {};
let products = JSON.parse(localStorage.getItem('zonewear-products')) || [];
// Deduplicate products immediately
products = deduplicateProducts(products);
let lastOrderTime = 0;

console.log('Initial products from localStorage:', products.length);

// Clean products data
function deduplicateProducts(arr) {
    if (!Array.isArray(arr)) return [];
    const seenIds = new Set();
    const seenNames = new Set();
    return arr.filter(p => {
        if (!p || typeof p !== 'object') return false;
        if (!p.id || !p.name) return false;
        if (seenIds.has(p.id) || seenNames.has(p.name)) return false;
        seenIds.add(p.id);
        seenNames.add(p.name);
        return true;
    });
}

function cleanProductsData() {
    console.log('🧹 cleanProductsData - input:', products.length, 'products');
    const originalLength = products.length;
    products = deduplicateProducts(products);
    if (originalLength !== products.length) {
        console.log(`🧹 cleanProductsData - removed ${originalLength - products.length} duplicates`);
    }
    localStorage.setItem('zonewear-products', JSON.stringify(products));
    console.log('🧹 cleanProductsData - final count:', products.length, 'products saved to localStorage');
}

// Initialize default products
function initializeDefaultProducts() {
    console.log('initializeDefaultProducts - current count:', products.length);
    const uniqueProducts = [];
    const seenNames = new Set();
    products.forEach(product => {
        if (!seenNames.has(product.name)) {
            uniqueProducts.push(product);
            seenNames.add(product.name);
        }
    });
    products = uniqueProducts;
    localStorage.setItem('zonewear-products', JSON.stringify(products));
    console.log('initializeDefaultProducts - final count:', products.length);
}

// Load products to DOM
async function loadProductsToDOM() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.warn('products-grid not found');
        return;
    }
    console.log('loadProductsToDOM: Adding', products.length, 'products');
    
    const existingCards = document.querySelectorAll('.product-card[data-product-id]');
    existingCards.forEach(card => card.remove());
    
    if (!Array.isArray(products) || products.length === 0) {
        console.warn('No products to display');
        return;
    }
    
    // Wait for IndexedDB to be ready (max 5 seconds)
    let waitCount = 0;
    while (!db && waitCount < 50) {
        await new Promise(r => setTimeout(r, 100));
        waitCount++;
    }
    
    if (!db) {
        console.warn('⚠️ IndexedDB not ready after 5 seconds. Using fallback images.');
    } else {
        console.log('✓ IndexedDB ready');
    }
    
    let addedCount = 0;
    for (const product of products) {
        try {
            let imageSrc = 'assets/images/zw-halfzip-white.png';
            if (product.image && product.image.startsWith('product-')) {
                const imageUrl = await getImageFromDb(product.image);
                if (imageUrl) imageSrc = imageUrl;
            }
            
            const productHTML = `
                <article class="product-card" data-category="${product.category}" data-product-id="${product.id}">
                    <div class="product-top">
                        <div class="price-badge">${product.price.toLocaleString('ar-DZ')} DA</div>
                        <div class="product-image">
                            <img src="${imageSrc}" alt="${product.name}" class="product-img" onerror="this.src='assets/images/zw-halfzip-white.png'">
                        </div>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-sub">${product.descAr || ''}</p>
                        <div class="product-section">
                            <div class="label-row">
                                <div class="product-label">المقاسات</div>
                                <div class="product-hint">اختر المقاس</div>
                            </div>
                            <div class="product-sizes">
                                <label class="size-item"><input type="radio" name="size-${product.id}" checked><span>S</span></label>
                                <label class="size-item"><input type="radio" name="size-${product.id}"><span>M</span></label>
                                <label class="size-item"><input type="radio" name="size-${product.id}"><span>L</span></label>
                                <label class="size-item"><input type="radio" name="size-${product.id}"><span>XL</span></label>
                            </div>
                            <div class="product-actions">
                                <button class="cart-btn add-to-cart" data-product="${product.name}" data-price="${product.price}">إضافة للسلة</button>
                                <button class="order-btn" data-product="${product.name}" data-price="${product.price}">طلب الآن</button>
                            </div>
                            <div class="product-meta">
                                <span>متوفر الآن</span>
                                <span>COD الجزائر</span>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            productsGrid.insertAdjacentHTML('beforeend', productHTML);
            addedCount++;
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }
    console.log('✓ loadProductsToDOM complete:', addedCount, 'products added');
}

// Attach event listeners
function attachProductEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const checkedRadio = productCard.querySelector('.product-sizes input[type="radio"]:checked');
            const selectedSize = checkedRadio ? checkedRadio.nextElementSibling.textContent : null;
            const productName = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');
            addToCart(productName, price, selectedSize);
        });
    });
    
    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const now = Date.now();
            if (now - lastOrderTime < 1000) return;
            lastOrderTime = now;
            
            const productCard = this.closest('.product-card');
            const checkedRadio = productCard.querySelector('.product-sizes input[type="radio"]:checked');
            const selectedSize = checkedRadio ? checkedRadio.nextElementSibling.textContent : null;
            const productName = this.getAttribute('data-product') || productCard.querySelector('.product-title')?.textContent || 'Product';
            const price = this.getAttribute('data-price') || productCard.querySelector('.price-badge')?.textContent?.replace(/[^0-9]/g, '');
            
            if (selectedSize) {
                addToCart(productName, price, selectedSize);
                setTimeout(() => showDeliveryForm(), 500);
            } else {
                showNotification(t('selectSize'));
            }
        });
    });
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.textContent = cart.length;
    localStorage.setItem('zonewear-cart', JSON.stringify(cart));
}

function addToCart(productName, price, size) {
    if (!size) {
        showNotification(t('selectSize'));
        return;
    }
    const productObj = products.find(p => p.name === productName);
    if (productObj && productObj.stock > 0) {
        productObj.stock -= 1;
        localStorage.setItem('zonewear-products', JSON.stringify(products));
    } else if (productObj && productObj.stock <= 0) {
        showNotification('منتج غير متوفر');
        return;
    }
    const product = {
        id: Date.now(),
        name: productName,
        price: parseFloat(price),
        quantity: 1,
        size: size
    };
    cart.push(product);
    updateCartCount();
    showNotification(`${productName} (${size}) ${t('addToCart')}!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #cc0000, #990000);
        color: white;
        padding: 15px 25px;
        border-radius: 0px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        border: 2px solid #cc0000;
        white-space: pre-wrap;
        line-height: 1.5;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function setupLanguageButtons() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

function showCart() {
    if (cart.length === 0) {
        showNotification(t('emptyCart'));
        return;
    }
    let modal = document.getElementById('cart-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    let cartHTML = `
        <div class="modal-content cart-modal-content">
            <div class="modal-header">
                <h2>${t('cartTitle')}</h2>
                <button class="close-btn" onclick="closeCartModal()">&times;</button>
            </div>
            <div class="modal-body cart-items">
    `;
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-size">${t('size')}: <strong>${item.size}</strong></p>
                    <p class="item-price">${item.price.toLocaleString('ar-DZ')} DA</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">${t('remove')}</button>
            </div>
        `;
    });
    cartHTML += `
            </div>
            <div class="modal-footer cart-footer">
                <div class="cart-total">
                    <h3>${t('total')}: <span>${total.toLocaleString('ar-DZ')} DA</span></h3>
                </div>
                <button class="btn btn-primary checkout-btn" onclick="showDeliveryForm()">${t('checkout')}</button>
            </div>
        </div>
    `;
    modal.innerHTML = cartHTML;
    modal.style.display = 'flex';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    if (cart.length === 0) {
        closeCartModal();
    } else {
        showCart();
    }
}

function handleCheckout() {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    const orders = JSON.parse(localStorage.getItem('zonewear-orders')) || [];
    const newOrder = {
        id: Date.now(),
        customer: deliveryInfo.name || 'Guest',
        phone: deliveryInfo.phone || 'N/A',
        state: deliveryInfo.state || 'N/A',
        products: cart,
        total: total,
        status: 'pending',
        date: new Date().toLocaleString('ar-DZ')
    };
    orders.push(newOrder);
    localStorage.setItem('zonewear-orders', JSON.stringify(orders));
    closeCartModal();
    showNotification(`${t('orderSuccess')}\n${t('total')}: ${total.toLocaleString('ar-DZ')} DA`);
    cart = [];
    updateCartCount();
}

function showDeliveryForm() {
    closeCartModal();  // ✅ Close cart modal before opening delivery form
    
    let modal = document.getElementById('delivery-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'delivery-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    const algierianStates = ['Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Annaba', 'Alger', 'Tlemcen', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saida', 'Skikda', 'Sidi Bel Abbès', 'Béjaïa', 'Bidar', 'Tébessa', 'Tlemcen'];
    let stateOptions = algierianStates.map(state => `<option value="${state}">${state}</option>`).join('');
    let formHTML = `
        <div class="modal-content delivery-modal-content">
            <div class="modal-header">
                <h2>${t('deliveryInfo')}</h2>
                <button class="close-btn" onclick="closeDeliveryModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="delivery-form" onsubmit="handleDeliverySubmit(event)">
                    <div class="form-group">
                        <label>${t('fullName')}</label>
                        <input type="text" id="customer-name" required placeholder="${t('fullName')}">
                    </div>
                    <div class="form-group">
                        <label>${t('phone')}</label>
                        <input type="tel" id="customer-phone" required placeholder="07XX XXX XXX">
                    </div>
                    <div class="form-group">
                        <label>${t('state')}</label>
                        <select id="customer-state" required>
                            <option value="">${t('state')}</option>
                            ${stateOptions}
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-cancel" onclick="closeDeliveryModal()">${t('cancel')}</button>
                        <button type="submit" class="btn btn-primary">${t('completeOrder')}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    modal.innerHTML = formHTML;
    modal.style.display = 'flex';
}

function closeDeliveryModal() {
    const modal = document.getElementById('delivery-modal');
    if (modal) modal.style.display = 'none';
}

function handleDeliverySubmit(e) {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const state = document.getElementById('customer-state').value;
    deliveryInfo = { name, phone, state };
    localStorage.setItem('zonewear-delivery', JSON.stringify(deliveryInfo));
    closeDeliveryModal();
    handleCheckout();
}

function filterAndSearchProducts() {
    const searchInput = document.getElementById('search-products');
    const categoryFilter = document.getElementById('category-filter');
    if (!searchInput || !categoryFilter) return;
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const categoryMatch = !selectedCategory || category === selectedCategory;
        const searchMatch = !searchTerm || title.includes(searchTerm);
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
}

function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    if (!name || !email || !subject || !message) {
        showFormStatus('Please fill all required fields', 'error');
        return;
    }
    const formData = { name, email, subject, message, timestamp: new Date().toLocaleString('ar-DZ') };
    console.log('Form Data:', formData);
    showFormStatus('Thank you! We will reply soon', 'success');
    document.getElementById('contact-form').reset();
    setTimeout(() => {
        document.getElementById('form-status').style.display = 'none';
    }, 5000);
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    }
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    if (!email) {
        showNotification('Please enter a valid email');
        return;
    }
    console.log('Newsletter signup:', email);
    showNotification('Subscribed successfully!');
    emailInput.value = '';
}

// BroadcastChannel listener
channel.onmessage = (event) => {
    if (event.data.type === 'productsUpdated') {
        console.log('🎯 BroadcastChannel: Products updated!');
        try {
            products = event.data.products;
            console.log('✓ Updated products:', products.length);
            localStorage.setItem('zonewear-products', JSON.stringify(products));
            loadProductsToDOM();
            updateCartCount();
            attachProductEventListeners();
        } catch (error) {
            console.error('Error in BroadcastChannel handler:', error);
        }
    }
};

// Fallback: Check localStorage every 2 seconds for updates
setInterval(() => {
    try {
        const savedProducts = JSON.parse(localStorage.getItem('zonewear-products')) || [];
        if (savedProducts.length !== products.length) {
            console.log('📦 localStorage changed, reloading products:', savedProducts.length, 'found');
            products = deduplicateProducts(savedProducts);
            loadProductsToDOM();
            attachProductEventListeners();
            updateCartCount();
        }
    } catch (error) {
        console.error('❌ Error in polling interval:', error);
    }
}, 2000);

// Storage event listener (for updates from other tabs)
window.addEventListener('storage', (e) => {
    if (e.key === 'zonewear-products') {
        console.log('📦 Storage event: Products updated from another tab');
        try {
            products = JSON.parse(e.newValue) || [];
            products = deduplicateProducts(products);
            loadProductsToDOM();
            attachProductEventListeners();
        } catch (error) {
            console.error('Error in storage event:', error);
        }
    }
});

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('========== PAGE INITIALIZATION START ==========');
    console.log('DOMContentLoaded: Starting page initialization');
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    let waitCount = 0;
    while (!dbReady && waitCount < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitCount++;
    }
    console.log('✓ IndexedDB ready:', dbReady);
    
    setLanguage(currentLang);
    setupLanguageButtons();
    
    // Reload from localStorage
    const storedData = localStorage.getItem('zonewear-products');
    console.log('📦 Raw localStorage data:', storedData);
    products = JSON.parse(storedData) || [];
    console.log('🔄 Reloaded products from localStorage:', products.length);
    console.log('📦 Products array:', products);
    
    cleanProductsData();
    initializeDefaultProducts();
    
    console.log('✅ Ready to render:', products.length, 'products');
    
    await loadProductsToDOM();
    console.log('========== PAGE INITIALIZATION COMPLETE ==========');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
    
    updateCartCount();
    attachProductEventListeners();
    
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
    }
    
    const categoryFilter = document.getElementById('category-filter');
    const searchProducts = document.getElementById('search-products');
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndSearchProducts);
    if (searchProducts) searchProducts.addEventListener('input', filterAndSearchProducts);
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    console.log('✅ Page initialization complete');
});

// Storage listener (fallback)
window.addEventListener('storage', function(e) {
    if (e.key === 'zonewear-products') {
        console.log('Storage event: Products changed');
        products = JSON.parse(e.newValue) || [];
        loadProductsToDOM();
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Add animations
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
    .product-card {
        animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('✅ script.js fully loaded and ready');
