// Initialize IndexedDB for images
let db;
const dbRequest = indexedDB.open('ZoneWearDB', 1);
dbRequest.onerror = () => console.log('Database failed to open');
dbRequest.onsuccess = () => {
    db = dbRequest.result;
};
dbRequest.onupgradeneeded = (e) => {
    const database = e.target.result;
    if (!database.objectStoreNames.contains('images')) {
        // Create object store with keyPath
        database.createObjectStore('images', { keyPath: 'id' });
    }
};

// Get image from IndexedDB and return URL
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

// ===== Language & Translations =====
let currentLang = localStorage.getItem('zonewear-lang') || 'en';

const translations = {
    en: {
        home: 'Home',
        shop: 'Shop',
        about: 'About',
        contact: 'Contact',
        addToCart: 'Add to Cart',
        shopNow: 'Shop Now',
        selectSize: 'Please select a size',
        emptyCart: 'Your cart is empty!',
        cartTitle: 'Shopping Cart',
        size: 'Size',
        remove: 'Remove',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        deliveryInfo: 'Delivery Information',
        fullName: 'Full Name',
        phone: 'Phone Number',
        state: 'State/Province',
        completeOrder: 'Complete Order',
        cancel: 'Cancel',
        orderSuccess: '✓ Order completed successfully!',
        price: 'Price',
        searchNoResults: 'No products found',
        elevateYourStyle: 'Elevate Your Style',
        discoverPremium: 'Discover premium clothing that defines your personality',
        featuredCollection: 'Featured Collection',
        ourCollection: 'Our Collection',
        sizes: 'Sizes',
        chooseSize: 'Choose Size',
        addNow: 'Add Now',
        orderNow: 'Order Now',
        availableNow: 'Available Now',
        codAlgeria: 'COD Algeria',
        comingSoon: 'Coming Soon',
        whyChooseUs: 'Why Choose Us',
        quality: 'Quality',
        qualityDesc: 'Premium materials and craftsmanship',
        speed: 'Speed',
        speedDesc: 'Fast shipping across Algeria',
        support: 'Support',
        supportDesc: '24/7 customer support ready to help'
    },
    ar: {
        home: 'الرئيسية',
        shop: 'المتجر',
        about: 'حول',
        contact: 'اتصل بنا',
        addToCart: 'إضافة للسلة',
        shopNow: 'تسوق الآن',
        selectSize: 'الرجاء اختيار المقاس',
        emptyCart: 'سلتك فارغة!',
        cartTitle: '🛒 سلة المشتريات',
        size: 'المقاس',
        remove: 'حذف',
        total: 'الإجمالي',
        checkout: 'متابعة الدفع',
        deliveryInfo: 'معلومات التوصيل',
        fullName: 'الاسم الكامل',
        phone: 'رقم الهاتف',
        state: 'الولاية',
        completeOrder: 'إتمام الطلب',
        cancel: 'إلغاء',
        orderSuccess: 'تم إتمام الطلب بنجاح!',
        price: 'السعر',
        searchNoResults: 'لم يتم العثور على منتجات',
        elevateYourStyle: 'ارفع أسلوبك',
        discoverPremium: 'اكتشف الملابس الفاخرة التي تحدد شخصيتك',
        featuredCollection: 'المجموعة المميزة',
        ourCollection: 'مجموعتنا',
        sizes: 'المقاسات',
        chooseSize: 'اختر المقاس',
        addNow: 'أضف الآن',
        orderNow: 'اطلب الآن',
        availableNow: 'متوفر الآن',
        codAlgeria: 'الدفع عند الاستلام',
        comingSoon: 'قريباً',
        whyChooseUs: 'لماذا تختار ناً',
        quality: 'الجودة',
        qualityDesc: 'مواد فاخرة وحرفية عالية',
        speed: 'السرعة',
        speedDesc: 'شحن سريع في جميع أنحاء الجزائر',
        support: 'الدعم',
        supportDesc: 'دعم عملاء 24/7 جاهز للمساعدة'
    }
};

// Algerian States
const algierianStates = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna',
    'Béjaia', 'Biskra', 'Béchar', 'Blida', 'Bouira',
    'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou',
    'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
    'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine',
    'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla',
    'Oran', 'El Bayadh', 'El Oued', 'Khenchela', 'Souk Ahras',
    'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'El Menia', 'Bordj Baji Mokhtar', 'Ouled Djellal',
    'Beni Abbès', 'Tindouf', 'Tissemsilt', 'El Meghaier', 'El Menia'
];

function t(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('zonewear-lang', lang);
    document.body.setAttribute('data-lang', lang);
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update all translatable elements
    updatePageTranslations();
}

function updatePageTranslations() {
    // Update nav items
    const navHome = document.querySelector('.nav-home');
    const navShop = document.querySelector('.nav-shop');
    const navAbout = document.querySelector('.nav-about');
    const navContact = document.querySelector('.nav-contact');
    
    if (navHome) navHome.textContent = t('home');
    if (navShop) navShop.textContent = t('shop');
    if (navAbout) navAbout.textContent = t('about');
    if (navContact) navContact.textContent = t('contact');
    
    // Update all translatable elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    
    // Update hero text
    const heroH2 = document.querySelector('.hero-content h2');
    if (heroH2) heroH2.textContent = t('elevateYourStyle');
    const heroP = document.querySelector('.hero-content p');
    if (heroP) heroP.textContent = t('discoverPremium');
    
    // Update shop now button
    const shopNowBtn = document.querySelector('.hero-content .btn-primary');
    if (shopNowBtn) shopNowBtn.textContent = t('shopNow');
    
    // Update Featured Collection title
    const featuredTitle = document.querySelector('.featured h2');
    if (featuredTitle) featuredTitle.textContent = t('featuredCollection');
    
    // Update size selector labels
    document.querySelectorAll('.product-label').forEach(label => {
        if (label.textContent.includes('المقاس') || label.textContent.includes('Size')) {
            label.textContent = t('sizes');
        }
    });
    
    // Update product action buttons
    document.querySelectorAll('.cart-btn').forEach(btn => {
        if (btn.textContent.includes('إضافة') || btn.textContent.includes('Add')) {
            btn.textContent = t('addToCart');
        }
    });
    
    document.querySelectorAll('.order-btn').forEach(btn => {
        if (btn.textContent.includes('طلب') || btn.textContent.includes('Order')) {
            btn.textContent = t('orderNow');
        }
    });
    
    // Update product meta text
    document.querySelectorAll('.product-meta').forEach(meta => {
        const spans = meta.querySelectorAll('span');
        spans.forEach(span => {
            if (span.textContent.includes('متوفر') || span.textContent.includes('Available')) {
                span.textContent = t('availableNow');
            }
            if (span.textContent.includes('COD') || span.textContent.includes('الدفع')) {
                span.textContent = t('codAlgeria');
            }
        });
    });
    
    // Update cart modal elements
    const cartTitle = document.querySelector('.cart-header h2');
    if (cartTitle) cartTitle.textContent = t('cartTitle');
    
    // Update checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.textContent = t('checkout');
    
    // Update all button texts that need translation
    document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent.trim();
        if (text === 'Remove' || text === 'حذف') btn.textContent = t('remove');
        if (text === 'Cancel' || text === 'إلغاء') btn.textContent = t('cancel');
    });
}

// ===== Cart Management =====
// Clear old products on page refresh to ensure latest products load
if (localStorage.getItem('zonewear-products')) {
    try {
        const oldProducts = JSON.parse(localStorage.getItem('zonewear-products'));
        // If we have just 1 product, it means old data
        if (oldProducts.length === 1 && oldProducts[0].name === 'ZW Premium Sweater White') {
            localStorage.removeItem('zonewear-products');
        }
    } catch(e) {}
}

let cart = JSON.parse(localStorage.getItem('zonewear-cart')) || [];
let deliveryInfo = JSON.parse(localStorage.getItem('zonewear-delivery')) || {};
let products = JSON.parse(localStorage.getItem('zonewear-products')) || [];
let lastOrderTime = 0; // Prevent double-click orders

// Clean up any corrupted product data and ensure valid products
function cleanProductsData() {
    if (!Array.isArray(products)) {
        products = [];
        return;
    }
    
    // Remove invalid products
    products = products.filter(p => {
        return p && p.id && p.name && (p.price !== undefined && p.price !== null);
    });
    
    // Save cleaned data
    if (products.length > 0) {
        localStorage.setItem('zonewear-products', JSON.stringify(products));
    } else {
        localStorage.removeItem('zonewear-products');
    }
}

cleanProductsData();

// Initialize with default products if empty and remove duplicates
function initializeDefaultProducts() {
    // Remove duplicates based on product name
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
    
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: 'ZW Half-Zip White',
                descAr: 'نصف سستة أبيض',
                price: 3500,
                category: 'mens',
                stock: 50,
                image: 'images/zw-halfzip-white.png'
            },
            {
                id: 2,
                name: 'ZW Hoodie Black',
                descAr: 'هوديي أسود',
                price: 4500,
                category: 'mens',
                stock: 45,
                image: 'images/zw-hoodie-black.png'
            },
            {
                id: 3,
                name: 'ZW Classic T-shirt White',
                descAr: 'تيشيرت كلاسيك أبيض',
                price: 1999,
                category: 'mens',
                stock: 60,
                image: 'images/zw-classic-tshirt-white.png'
            },
            {
                id: 4,
                name: 'ZW Classic T-shirt Black',
                descAr: 'تيشيرت كلاسيك أسود',
                price: 1999,
                category: 'mens',
                stock: 55,
                image: 'images/zw-classic-tshirt-black.png'
            },
            {
                id: 5,
                name: 'ZW Women Premium Sweater White',
                descAr: 'سويتر نسائي بريميوم أبيض',
                price: 3800,
                category: 'womens',
                stock: 40,
                image: 'images/zw-halfzip-white.png'
            },
            {
                id: 6,
                name: 'ZW Women Premium Sweater Black',
                descAr: 'سويتر نسائي بريميوم أسود',
                price: 3800,
                category: 'womens',
                stock: 35,
                image: 'images/zw-hoodie-black.png'
            }
        ];
        localStorage.setItem('zonewear-products', JSON.stringify(products));
    }
}

// ===== IMPORTANT: Do NOT call initializeDefaultProducts() at top level ===== 
// This is called in DOMContentLoaded instead to ensure fresh localStorage read

// Function to render products from localStorage to the page
async function loadProductsToDOM() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return; // Not on products page

    // Clear existing products except coming soon items
    const existingCards = document.querySelectorAll('.product-card[data-product-id]');
    existingCards.forEach(card => card.remove());

    // Add products from localStorage
    for (const product of products) {
        let imageSrc = product.image;
        
        // If image is from IndexedDB (contains 'product-'), get it from DB
        if (product.image && product.image.startsWith('product-')) {
            const imageUrl = await getImageFromDb(product.image);
            if (imageUrl) {
                imageSrc = imageUrl;
            } else {
                // Image not found in IndexedDB, use default
                imageSrc = 'images/zw-halfzip-white.png';
            }
        }
        
        // Ensure imageSrc is valid before using
        if (!imageSrc) {
            imageSrc = 'images/zw-halfzip-white.png';
        }
        
        const productHTML = `
            <article class="product-card" data-category="${product.category}" data-product-id="${product.id}">
                <div class="product-top">
                    <div class="price-badge">${product.price.toLocaleString('ar-DZ')} DA</div>
                    <div class="product-image">
                        <img src="${imageSrc}" alt="${product.name}" class="product-img" onerror="this.src='images/zw-halfzip-white.png'">
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
        
        // Insert before the coming soon items
        const firstComingSoon = productsGrid.querySelector('.product-card:not([data-product-id])');
        if (firstComingSoon) {
            firstComingSoon.insertAdjacentHTML('beforebegin', productHTML);
        } else {
            productsGrid.insertAdjacentHTML('beforeend', productHTML);
        }
    }
}

function attachProductEventListeners() {
    // Remove old event listeners by cloning and replacing elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Add fresh event listeners to cloned buttons
    const newAddToCartButtons = document.querySelectorAll('.add-to-cart');
    newAddToCartButtons.forEach(button => {
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
    
    // Order button functionality
    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    const newOrderBtns = document.querySelectorAll('.order-btn');
    newOrderBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Prevent rapid double-clicks
            const now = Date.now();
            if (now - lastOrderTime < 1000) {
                return;
            }
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
    document.getElementById('cart-count').textContent = cart.length;
    localStorage.setItem('zonewear-cart', JSON.stringify(cart));
}

function addToCart(productName, price, size) {
    if (!size) {
        showNotification(t('selectSize'));
        return;
    }
    
    // Decrease product stock in localStorage
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

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== Language Button Setup (Global) =====
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

// ===== Mobile Navigation =====
document.addEventListener('DOMContentLoaded', async function() {
    // Close any open modals when page loads
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Wait a moment for IndexedDB to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set initial language
    setLanguage(currentLang);
    
    // Setup language buttons
    setupLanguageButtons();

    // Reload products from localStorage to ensure we have latest data from admin panel
    products = JSON.parse(localStorage.getItem('zonewear-products')) || [];
    cleanProductsData();
    
    // Initialize defaults if needed (removes duplicates and adds defaults if empty)
    initializeDefaultProducts();
    
    // Load products from localStorage (for products.html page)
    await loadProductsToDOM();

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Update cart count on page load
    updateCartCount();

    // Attach product-related event listeners (these will also handle dynamically loaded products)
    attachProductEventListeners();

    // Cart icon functionality
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
    }

    // Product filtering and search
    const categoryFilter = document.getElementById('category-filter');
    const searchProducts = document.getElementById('search-products');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (searchProducts) {
        searchProducts.addEventListener('input', filterAndSearchProducts);
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
});

// ===== Show Cart =====
function showCart() {
    if (cart.length === 0) {
        showNotification(t('emptyCart'));
        return;
    }

    // Create modal
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
    if (modal) {
        modal.style.display = 'none';
    }
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
    
    // Save order to localStorage
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
    let modal = document.getElementById('delivery-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'delivery-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

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
    if (modal) {
        modal.style.display = 'none';
    }
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

// ===== Product Filtering =====
// ===== Advanced Product Filtering & Search =====
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
        const description = card.querySelector('.description')?.textContent.toLowerCase() || '';
        
        // Check category filter
        const categoryMatch = !selectedCategory || category === selectedCategory;
        
        // Check search term
        const searchMatch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no products found
    const productsGrid = document.querySelector('.products-grid');
    if (visibleCount === 0 && productsGrid) {
        if (!document.getElementById('no-results')) {
            const noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: #999;';
            noResults.textContent = t('searchNoResults') || 'No products found / لم يتم العثور على منتجات';
            productsGrid.appendChild(noResults);
        }
    } else {
        const noResults = document.getElementById('no-results');
        if (noResults) noResults.remove();
    }
}

function filterProducts(e) {
    filterAndSearchProducts();
}

// ===== Contact Form Handling =====
function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!name || !email || !subject || !message) {
        showFormStatus('املأ جميع الحقول المطلوبة', 'error');
        return;
    }

    // Simulate form submission
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString('ar-DZ')
    };

    console.log('Form Data:', formData);

    // Show success message
    showFormStatus('شكراً! تم إرسال رسالتك. سنرد عليك قريباً', 'success');

    // Reset form
    document.getElementById('contact-form').reset();

    // Clear message after 5 seconds
    setTimeout(() => {
        document.getElementById('form-status').style.display = 'none';
    }, 5000);
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
}

// ===== Newsletter Handling =====
function handleNewsletterSubmit(e) {
    e.preventDefault();

    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (!email) {
        showNotification('ادخل بريد إلكتروني صحيح');
        return;
    }

    // Simulate newsletter signup
    console.log('Newsletter signup:', email);
    showNotification('[✓] اشتركت بنجاح! تابع بريدك');

    emailInput.value = '';
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Add Animation Styles =====
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

// ===== Setup Language Buttons (Fallback) =====
setupLanguageButtons();
