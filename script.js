// --- 1. SPLASH SCREEN (Ocultar al cargar) ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => { splash.style.display = 'none'; }, 800);
    }, 1500);
});

// --- 2. LÓGICA DEL CARRITO Y TOASTS ---
let cart = []; 

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#27ae60; margin-right:8px;"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => { toast.remove(); }, 3000); 
}

function addToCart(name, price, image) {
    cart.push({ name, price, image });
    updateCartUI();
    showToast(`${name} añadido a tu orden`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const count = document.getElementById('cart-count');
    const mCount = document.getElementById('mobile-cart-count');
    const total = document.getElementById('cart-total');
    
    container.innerHTML = '';
    let sum = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:20px; color:#666;">Tu carrito está vacío.</p>';
    } else {
        cart.forEach((item, index) => {
            sum += item.price;
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="price">$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
    }
    
    count.innerText = cart.length;
    if(mCount) mCount.innerText = cart.length;
    total.innerText = sum.toFixed(2);
}

// --- 3. FILTRADO DE CATEGORÍAS ---
function filterMenu(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'todos') {
            product.style.display = 'block';
        } else {
            if (product.getAttribute('data-category') === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    });
}

// --- 4. MODAL VISTA RÁPIDA ---
const qvModal = document.getElementById("quickViewModal");
let currentQVItem = {}; 

function openQuickView(name, price, image, desc) {
    document.getElementById('qv-title').innerText = name;
    document.getElementById('qv-price').innerText = `$ ${price.toFixed(2)}`;
    document.getElementById('qv-img').src = image;
    document.getElementById('qv-desc').innerText = desc;
    
    currentQVItem = { name, price, image };
    qvModal.style.display = "flex";
}

function closeQuickView() {
    qvModal.style.display = "none";
}

function addFromQuickView() {
    addToCart(currentQVItem.name, currentQVItem.price, currentQVItem.image);
    closeQuickView();
}

// --- 5. LÓGICA WHATSAPP CHECKOUT ---
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert("Agrega algo al carrito primero.");
        return;
    }

    const deliveryType = document.getElementById('btn-delivery').classList.contains('active') ? "DOMICILIO" : "RECOGER EN SUCURSAL";
    const address = document.getElementById('display-address').innerText;
    const phoneNumber = "521111111111"; // <--- CAMBIA ESTO POR TU NÚMERO
    
    let message = `NUEVA ORDEN NIGHT BITES \n\n`;
    message += `Tipo: ${deliveryType}\n`;
    if(deliveryType === "DOMICILIO") {
        message += `Dirección: ${address}\n\n`;
    }
    message += `Mi pedido:\n`;
    
    let total = 0;
    cart.forEach(item => {
        message += `- ${item.name} ($${item.price})\n`;
        total += item.price;
    });

    message += `\nTOTAL: $${total.toFixed(2)}\n\n`;
    message += `Hola, quiero confirmar esta orden.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// --- 6. MAPA Y DELIVERY/PICKUP ---
function setOrderType(type) {
    const btnDelivery = document.getElementById('btn-delivery');
    const btnPickup = document.getElementById('btn-pickup');
    const addressDisplay = document.getElementById('display-address');

    if (type === 'delivery') {
        btnDelivery.classList.add('active');
        btnPickup.classList.remove('active');
        addressDisplay.innerText = "Ingresa tu dirección de entrega...";
    } else {
        btnPickup.classList.add('active');
        btnDelivery.classList.remove('active');
        addressDisplay.innerText = "Recoger en: Sucursal Centro";
    }
}

const mapModal = document.getElementById("mapModal");

function openMapModal() {
    if(document.getElementById('btn-delivery').classList.contains('active')) {
        mapModal.style.display = "flex";
    }
}

function closeMapModal() {
    mapModal.style.display = "none";
}

function confirmAddress() {
    const inputAddress = document.getElementById('address-input').value;
    const addressDisplay = document.getElementById('display-address');
    
    if (inputAddress.trim() === "") {
        alert("Por favor ingresa una dirección válida.");
        return;
    }
    addressDisplay.innerText = inputAddress;
    closeMapModal();
}

const addressInput = document.getElementById('address-input');
const mapIframe = document.getElementById('google-map-iframe');
let typingTimer;                
const doneTypingInterval = 800; 

addressInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (addressInput.value) {
        typingTimer = setTimeout(updateMap, doneTypingInterval);
    }
});

addressInput.addEventListener('keydown', () => {
    clearTimeout(typingTimer);
});

function updateMap() {
    const address = addressInput.value;
    const encodedAddress = encodeURIComponent(address);
    mapIframe.src = `https://maps.google.com/maps?q=$${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

// Cerrar modales al tocar el fondo negro
window.onclick = function(event) {
    if (event.target == mapModal) closeMapModal();
    if (event.target == qvModal) closeQuickView();
}