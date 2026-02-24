console.log('✓ script.js loaded successfully');

// ========== API CONFIGURATION ==========
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : '/api';

console.log('📡 API URL:', API_URL);

// ========== GLOBAL STATE ==========
let products = [];
let cart = JSON.parse(localStorage.getItem('zonewear-cart')) || [];
let deliveryInfo = JSON.parse(localStorage.getItem('zonewear-delivery')) || {};
let currentLang = localStorage.getItem('zonewear-lang') || 'en';
let isLoadingProducts = false;

// ========== TRANSLATIONS ==========
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
    console.log('🌐 Language set to:', lang);
    location.reload();
}

// ========== API FUNCTIONS ==========

/**
 * Load products from backend API
 */
async function loadProductsFromAPI() {
    if (isLoadingProducts) {
        console.log('⏳ Products already loading...');
        return;
    }

    isLoadingProducts = true;
    try {
        console.log('🔄 Fetching products from API...');
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        products = Array.isArray(data) ? data : (data.products || []);
        
        console.log(`✅ Loaded ${products.length} products from API`);
        await loadProductsToDOM();
        
    } catch (error) {
        console.error('❌ Error loading products from API:', error);
        // Display error to user
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #e74c3c; padding: 20px;">
                Error loading products. Please refresh the page.
            </p>`;
        }
    } finally {
        isLoadingProducts = false;
    }
}

/**
 * Create order in backend
 */
async function createOrderInAPI(orderData) {
    try {
        console.log('📤 Sending order to API:', orderData);
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Order created successfully:', result);
        return result;

    } catch (error) {
        console.error('❌ Error creating order:', error);
        throw error;
    }
}

// ========== IMAGE HANDLING ==========
// Initialize IndexedDB for images
let db;
let dbReady = false;
const dbRequest = indexedDB.open('ZoneWearDB', 2);
dbRequest.onerror = () => console.log('❌ Database failed to open');
dbRequest.onsuccess = () => {
    db = dbRequest.result;
    dbReady = true;
    console.log('✅ IndexedDB opened successfully');
};
dbRequest.onupgradeneeded = (e) => {
    const database = e.target.result;
    if (database.objectStoreNames.contains('images')) {
        database.deleteObjectStore('images');
    }
    database.createObjectStore('images', { keyPath: 'id', autoIncrement: false });
    console.log('✅ IndexedDB upgraded with images store');
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
                console.error('❌ Error getting image from DB:', request.error);
                resolve(null);
            };
        } catch(e) {
            console.error('❌ Error in getImageFromDb:', e);
            resolve(null);
        }
    });
}

// ========== PRODUCT DISPLAY ==========

/**
 * Load products to DOM
 */
async function loadProductsToDOM() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.warn('⚠️ products-grid not found');
        return;
    }

    console.log(`📋 Rendering ${products.length} products to DOM`);
    
    // Remove existing product cards
    const existingCards = document.querySelectorAll('.product-card[data-product-id]');
    existingCards.forEach(card => card.remove());
    
    if (!Array.isArray(products) || products.length === 0) {
        console.warn('⚠️ No products to display');
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products available</p>';
        return;
    }
    
    // Wait for IndexedDB ready
    let waitCount = 0;
    while (!db && waitCount < 50) {
        await new Promise(r => setTimeout(r, 100));
        waitCount++;
    }
    
    if (!db) {
        console.warn('⚠️ IndexedDB not ready after 5 seconds. Using fallback images.');
    } else {
        console.log('✅ IndexedDB ready');
    }
    
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
                            <img src="${imageSrc}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='assets/images/zw-halfzip-white.png'">
                        </div>
                    </div>
                    <div class="product-content">
                        <h3>${product.name}</h3>
                        <p>${product.descAr || product.name}</p>
                        <div class="sizes">
                            ${(product.sizes || ['S', 'M', 'L', 'XL']).map(size => `<span class="size-btn" data-size="${size}">${size}</span>`).join('')}
                        </div>
                        <button class="add-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </article>
            `;
            productsGrid.insertAdjacentHTML('beforeend', productHTML);
        } catch (error) {
            console.error(`❌ Error rendering product ${product.id}:`, error);
        }
    }

    // Attach event listeners to size buttons
    attachSizeButtonListeners();
    // Attach event listeners to add-to-cart buttons
    attachAddToCartListeners();
}

// ========== CART FUNCTIONS ==========

function attachSizeButtonListeners() {
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function attachAddToCartListeners() {
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const card = this.closest('.product-card');
            const selectedSize = card.querySelector('.size-btn.selected');
            
            if (!selectedSize) {
                alert(t('selectSize'));
                return;
            }
            
            const product = products.find(p => p.id == productId);
            if (!product) {
                console.error('❌ Product not found:', productId);
                return;
            }
            
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize.textContent
            });
            
            console.log(`✅ ${product.name} - Size: ${selectedSize.textContent} ${t('addToCart')}`);
        });
    });
}

function addToCart(item) {
    const existingItem = cart.find(c => c.id === item.id && c.size === item.size);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    
    localStorage.setItem('zonewear-cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('zonewear-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p>${t('emptyCart')}</p>`;
        return;
    }

    let totalPrice = 0;
    const itemsHTML = cart.map(item => {
        totalPrice += item.price * (item.quantity || 1);
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    Size: ${item.size} | ${item.price.toLocaleString('ar-DZ')} DA × ${item.quantity || 1}
                </div>
                <button onclick="removeFromCart(${item.id}, '${item.size}')" class="remove-btn">${t('remove')}</button>
            </div>
        `;
    }).join('');

    cartContainer.innerHTML = itemsHTML + `
        <div class="cart-total">
            <strong>${t('total')}: ${totalPrice.toLocaleString('ar-DZ')} DA</strong>
        </div>
    `;
}

// ========== CHECKOUT ==========

async function completeOrder() {
    if (cart.length === 0) {
        alert(t('emptyCart'));
        return;
    }

    // Validate delivery info
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.state) {
        alert('Please fill in all delivery information');
        return;
    }

    try {
        const orderData = {
            customerName: deliveryInfo.fullName,
            customerPhone: deliveryInfo.phone,
            customerState: deliveryInfo.state,
            items: cart.map(item => ({
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                size: item.size
            })),
            totalPrice: cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const result = await createOrderInAPI(orderData);
        
        // Clear cart
        cart = [];
        deliveryInfo = {};
        localStorage.removeItem('zonewear-cart');
        localStorage.removeItem('zonewear-delivery');
        
        alert(t('orderSuccess'));
        console.log('✅ Order completed:', result);
        
        // Close modal if it exists
        const modal = document.querySelector('.checkout-modal');
        if (modal) modal.style.display = 'none';
        
        location.href = 'index.html';

    } catch (error) {
        console.error('❌ Error completing order:', error);
        alert('Error placing order. Please try again.');
    }
}

// ========== PAGE INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOMContentLoaded event fired');

    // Update cart count
    updateCartCount();

    // Load products from API on page load
    await loadProductsFromAPI();

    // Product category filtering
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const cards = document.querySelectorAll('.product-card');
            
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Search functionality
    const searchBox = document.querySelector('#search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            let foundAny = false;

            cards.forEach(card => {
                const productName = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const productText = card.textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productText.includes(searchTerm)) {
                    card.style.display = 'block';
                    foundAny = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (!foundAny && searchTerm) {
                console.log(t('searchNoResults'));
            }
        });
    }

    // Cart modal functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCartBtn = cartModal?.querySelector('.close');

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
            updateCartDisplay();
        });

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Checkout modal functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.querySelector('.checkout-modal');
    const closeCheckoutBtn = checkoutModal?.querySelector('.close');

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', function() {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'block';
        });

        if (closeCheckoutBtn) {
            closeCheckoutBtn.addEventListener('click', function() {
                checkoutModal.style.display = 'none';
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }

    // Delivery info form
    const deliveryForm = document.querySelector('.delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            deliveryInfo = {
                fullName: deliveryForm.fullName?.value || '',
                phone: deliveryForm.phone?.value || '',
                state: deliveryForm.state?.value || ''
            };
            
            localStorage.setItem('zonewear-delivery', JSON.stringify(deliveryInfo));
            console.log('📍 Delivery info saved:', deliveryInfo);
        });
    }

    // Complete order button
    const completeOrderBtn = document.querySelector('.complete-order-btn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', completeOrder);
    }

    console.log('✅ Page initialization complete');
});

// ========== PERIODIC REFRESH ==========
// Refresh products every 30 seconds to get latest updates
setInterval(() => {
    if (document.hidden === false && document.querySelector('.products-grid')) {
        console.log('🔄 Auto-refreshing products from API...');
        loadProductsFromAPI();
    }
}, 30000);

console.log('✅ Script fully loaded with API integration');
