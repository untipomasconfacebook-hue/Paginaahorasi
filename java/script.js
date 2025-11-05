
const VALID_USER = { username: 'mcliente', password: 'password' };

let cart = [];
let currentUser = null;
let allProducts = [];

const fallbackProducts = [
    {
        id: 1,
        title: 'Calajo',
        price: 1299.99,
        description: 'Laptop de alto rendimiento con RTX 4060 y procesador Intel i7',
        category: 'electronics',
        image: 'imagenes/calajo.jpg',
        rating: { rate: 4.5, count: 120 }
    },
    {
        id: 2,
        title: 'Monitor 4K Ultra HD 27"',
        price: 499.99,
        description: 'Monitor profesional de 27 pulgadas con panel IPS y HDR',
        category: 'electronics',
        image: 'imagenes/calajo.jpeg',
        rating: { rate: 4.7, count: 89 }
        category: 'electronicos'
    },
    {
        id: 3,
        title: 'Teclado Mecánico RGB',
        price: 149.99,
        description: 'Teclado mecánico gaming con switches Cherry MX Red',
        category: 'electronics',
        image: 'imagenes/calajo.jpeg',
        rating: { rate: 4.6, count: 234 }
        category: 'electronicos'
    },
    {
        id: 4,
        title: 'Mouse Gaming Inalámbrico',
        price: 79.99,
        description: 'Mouse gaming de precisión con sensor de 16000 DPI',
        category: 'electronics',
        image: 'imagenes/calajo.jpeg',
        rating: { rate: 4.4, count: 156 }
        category: 'electronicos'
    },
    {
        id: 5,
        title: 'Audífonos Bluetooth Premium',
        price: 199.99,
        description: 'Audífonos con cancelación de ruido y 30h de batería',
        category: 'electronics',
        image: 'imagenes/calajo.jpeg',
        rating: { rate: 4.8, count: 445 }
        category: 'electronicos'
    },
    {
        id: 6,
        title: 'Smartphone 5G Pro',
        price: 899.99,
        description: 'Smartphone con pantalla AMOLED y cámara de 108MP',
        category: 'electronics',
        image: 'imagenes/calajo.jpeg',
        rating: { rate: 4.6, count: 678 }
        category: 'electronicos'
    }
];

const popularProducts = [
    {
        id: 'pop1',
        title: 'MacBook Pro M3',
        price: 1999,
        image: 'imagenes/calajo.jpeg',
        description: 'La laptop más potente del mercado con chip M3',
        rating: { rate: 4.9, count: 523 },
        category: 'electronicos'
    },
    {
        id: 'pop2',
        title: 'iPhone 15 Pro Max',
        price: 1299,
        image: 'imagenes/calajo.jpeg',
        description: 'El smartphone más avanzado con chip A17 Pro',
        rating: { rate: 4.8, count: 892 },
        category: 'electronicos'
    },
    {
        id: 'pop3',
        title: 'AirPods Pro 2',
        price: 249,
        image: 'imagenes/calajo.jpeg',
        description: 'Cancelación de ruido adaptativa revolucionaria',
        rating: { rate: 4.7, count: 1205 },
        category: 'electronicos'
    }
];

const techNews = [
    {
        id: 1,
        title: 'IA Revoluciona el Desarrollo de Software',
        summary: 'Nuevas herramientas de inteligencia artificial están transformando cómo se programa.',
        date: '2025-10-25',
        icon: 'Si'
    },
    {
        id: 2,
        title: 'Computación Cuántica Alcanza Nuevo Hito',
        summary: 'Científicos logran mantener qubits estables por tiempo récord.',
        date: '2025-10-24',
        icon: 'Six2'
    },
    {
        id: 3,
        title: '5G Plus: La Próxima Generación de Conectividad',
        summary: 'Las redes 5G avanzadas prometen velocidades 10 veces superiores.',
        date: '2025-10-23',
        icon: 'Six3'
    }
];


const VALIDATORS = {
    username: /^[a-zA-Z0-9_]{3,20}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
};


document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando TechStore...');
    showLoading(true);
    
    // Cargar todo el contenido
    loadProducts();
    renderPopularProducts();
    renderNews();
    setupEventListeners();
    updateCartDisplay();
    
    setTimeout(() => {
        showLoading(false);
        console.log('TechStore cargado correctamente');
    }, 1000);
});


async function loadProducts() {
    try {
        console.log('Cargando productos desde API...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Productos API recibidos:', data.length);
        
        // Adaptar productos de la API
        allProducts = data.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            rating: product.rating || { rate: 4.0, count: 0 }
        }));
        
        renderProducts(allProducts);
        
    } catch (error) {
        console.error('Error cargando productos:', error);
        console.log('Usando productos de respaldo...');
        allProducts = fallbackProducts;
        renderProducts(allProducts);
    }
}


function renderProducts(products) {
    const grid = document.getElementById('productosGrid');
    
    if (!grid) {
        console.error('Grid de productos no encontrado');
        return;
    }
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<p style="color: var(--light); text-align: center; padding: 2rem;">No hay productos disponibles</p>';
        return;
    }
    
    console.log('Renderizando', products.length, 'productos');
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const rating = product.rating || { rate: 4.0, count: 0 };
    const stars = generateStars(rating.rate);
    
    return `
        <article class="product-card" data-category="${product.category}" role="listitem">
            <figure class="product-image">
                <img src="${product.image}" 
                     alt="${product.title}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwQURCNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiI+UHJvZHVjdG88L3RleHQ+PC9zdmc+'">
            </figure>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating" aria-label="Calificación: ${rating.rate} de 5 estrellas">
                    <span class="stars" aria-hidden="true">${stars}</span>
                    <span class="rating-count">(${rating.count})</span>
                </div>
                <div class="product-footer">
                    <span class="price" aria-label="Precio: ${product.price} dólares">$${parseFloat(product.price).toFixed(2)}</span>
                    <button class="buy-button" 
                            onclick="addToCart(${product.id})"
                            aria-label="Agregar ${product.title} al carrito">
                        Comprar
                    </button>
                </div>
            </div>
        </article>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '½' : '') + 
           '☆'.repeat(emptyStars);
}

// ============================================
// PRODUCTOS POPULARES
// ============================================

function renderPopularProducts() {
    const grid = document.getElementById('popularesGrid');
    
    if (!grid) {
        console.error('Grid de populares no encontrado');
        return;
    }
    
    console.log('Renderizando productos populares');
    grid.innerHTML = popularProducts.map(product => createProductCard(product)).join('');
}

// ============================================
// NOTICIAS
// ============================================

function renderNews() {
    const grid = document.getElementById('noticiasGrid');
    
    if (!grid) {
        console.error('Grid de noticias no encontrado');
        return;
    }
    
    console.log('Renderizando noticias');
    grid.innerHTML = techNews.map(news => `
        <article class="noticia-card" role="listitem">
            <div class="noticia-image" aria-hidden="true">
                ${news.icon}
            </div>
            <div class="noticia-content">
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <time class="noticia-meta" datetime="${news.date}">
                    ${formatDate(news.date)}
                </time>
            </div>
        </article>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ============================================
// GESTIÓN DEL CARRITO
// ============================================

function addToCart(productId) {
    console.log('Agregando producto al carrito:', productId);
    const product = findProductById(productId);
    
    if (!product) {
        console.error('Producto no encontrado:', productId);
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: parseFloat(product.price),
            image: product.image,
            quantity: 1
        });
    }
    
    console.log('Carrito actualizado:', cart);
    updateCartDisplay();
    showNotification(product.title + ' agregado al carrito', 'success');
    animateCartIcon();
}

function findProductById(id) {
    // Buscar en productos de API
    let product = allProducts.find(p => p.id == id);
    
    // Si no está, buscar en populares
    if (!product) {
        product = popularProducts.find(p => p.id == id);
    }
    
    return product;
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id == productId);
    
    if (index !== -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        updateCartDisplay();
        showNotification(removedItem.title + ' eliminado del carrito', 'warning');
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('El carrito ya está vacío', 'warning');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        updateCartDisplay();
        showNotification('Carrito vaciado', 'success');
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" role="listitem">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="remove-item" 
                        onclick="removeFromCart(${item.id})"
                        aria-label="Eliminar ${item.title} del carrito">
                    Eliminar
                </button>
            </div>
        `).join('');
    }
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }
}



function toggleCart() {
    console.log('Toggle carrito');
    const modal = document.getElementById('cartModal');
    
    if (!modal) {
        console.error('Modal del carrito no encontrado');
        return;
    }
    
    const isOpen = modal.classList.contains('show');
    
    if (isOpen) {
        closeModal('cartModal');
    } else {
        openModal('cartModal');
    }
}

function openModal(modalId) {
    console.log('Abriendo modal:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal no encontrado:', modalId);
        return;
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    console.log('Cerrando modal:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}




function handleLogin(event) {
    event.preventDefault();
    console.log('Procesando login...');
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (username === VALID_USER.username && password === VALID_USER.password) {
        currentUser = { username, email: 'mcliente@techstore.com' };
        console.log('Login exitoso:', currentUser);
        showNotification('¡Bienvenido ' + username + '!', 'success');
        closeModal('loginModal');
        proceedToCheckoutConfirmation();
    } else {
        console.log('Credenciales incorrectas');
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    console.log('Procesando registro...');
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const country = document.getElementById('regCountry').value;
    const payment = document.getElementById('regPayment').value;
    
    currentUser = { username, email, country, payment };
    console.log('Registro exitoso:', currentUser);
    showNotification('¡Cuenta creada exitosamente!', 'success');
    closeModal('registerModal');
    proceedToCheckoutConfirmation();
}

function switchToRegister() {
    closeModal('loginModal');
    openModal('registerModal');
}

function switchToLogin() {
    closeModal('registerModal');
    openModal('loginModal');
}




function proceedToCheckout() {
    console.log('Proceder al checkout');
    
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    if (!currentUser) {
        closeModal('cartModal');
        openModal('loginModal');
    } else {
        proceedToCheckoutConfirmation();
    }
}

function proceedToCheckoutConfirmation() {
    console.log('Mostrando checkout confirmation');
    closeModal('loginModal');
    closeModal('registerModal');
    closeModal('cartModal');
    
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems || !checkoutTotal) {
        console.error('Elementos de checkout no encontrados');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    checkoutItems.innerHTML = `
        <div class="user-info">
            <p><strong>Usuario:</strong> ${currentUser.username}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            ${currentUser.country ? `<p><strong>País:</strong> ${currentUser.country}</p>` : ''}
            ${currentUser.payment ? `<p><strong>Método de Pago:</strong> ${currentUser.payment}</p>` : ''}
        </div>
        ${cart.map(item => `
            <div class="checkout-item">
                <span>${item.title} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
    `;
    
    checkoutTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    openModal('checkoutModal');
}

function confirmPurchase() {
    console.log('Confirmando compra...');
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        closeModal('checkoutModal');
        
        showNotification('¡Compra realizada con éxito! Gracias por tu pedido.', 'success');
        
        cart = [];
        updateCartDisplay();
    }, 2000);
}




function filterProducts(category) {
    console.log('Filtrando por categoría:', category);
    const products = document.querySelectorAll('.productos-section .product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    event.target.classList.add('active');
    event.target.setAttribute('aria-pressed', 'true');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'flex';
            setTimeout(() => {
                product.style.opacity = '1';
            }, 50);
        } else {
            product.style.opacity = '0';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    console.log('Buscando:', searchTerm);
    
    const products = document.querySelectorAll('.product-card');
    let foundCount = 0;
    
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'flex';
            setTimeout(() => {
                product.style.opacity = '1';
            }, 50);
            foundCount++;
        } else {
            product.style.opacity = '0';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    if (searchTerm && foundCount > 0) {
        document.getElementById('productos').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    showNotification('Se encontraron ' + foundCount + ' producto(s)', 'success');
}




function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('Event listeners configurados');
}



function showNotification(message, type = 'info') {
    console.log('Notificación:', message, type);
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    
    if (show) {
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
    } else {
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

console.log('TechStore JavaScript cargado');
console.log('Usuario de prueba: mcliente / password');
console.log('Carrito funcional listo');
console.log('Filtros y búsqueda activos');
