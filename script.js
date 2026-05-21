window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.display = 'none'; }, 800);
        }
    }, 1500);
});

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
    showToast(`✅ ${name} añadido a tu orden`);
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
        container.innerHTML = '<p style="text-align:center; margin-top:20px; color:#666;">Sin items en la orden.</p>';
    } else {
        cart.forEach((item, index) => {
            sum += item.price;
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="Img">
                    <div class="item-details">
                        <h4 style="font-size:12px; line-height:1.2;">${item.name}</h4>
                        <p class="price">$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
    }

    if (count) count.innerText = cart.length;
    if (mCount) mCount.innerText = cart.length;
    if (total) total.innerText = sum.toFixed(2);
}

function filterMenu(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'todos') {
            product.style.display = 'block';
            setTimeout(() => { product.style.opacity = '1'; }, 50);
        } else {
            if (product.getAttribute('data-category') === category) {
                product.style.display = 'block';
                setTimeout(() => { product.style.opacity = '1'; }, 50);
            } else {
                product.style.opacity = '0';
                setTimeout(() => { product.style.display = 'none'; }, 300);
            }
        }
    });
}

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


const customModal = document.getElementById("customCrepeModal");

function openCustomCrepeModal() {
    customModal.style.display = "flex";
    updateCrepePrice();
}

function closeCustomCrepeModal() {
    customModal.style.display = "none";
}

function updateCrepePrice() {
    let total = 60;
    const extras = document.querySelectorAll('.crepe-extra:checked');
    total += (extras.length * 15);
    document.getElementById('customCrepeTotal').innerText = `Total: $${total.toFixed(2)}`;
}

function addCustomToCart() {
    let total = 60;
    let selectedExtras = [];
    const extras = document.querySelectorAll('.crepe-extra:checked');

    extras.forEach(cb => {
        selectedExtras.push(cb.value);
        total += 15;
    });

    let desc = selectedExtras.length > 0 ? selectedExtras.join(', ') : "Sencilla";
    let itemName = `Crepa Armada (${desc})`;


    let customImg = 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=500&q=80';

    addToCart(itemName, total, customImg);
    closeCustomCrepeModal();

    document.getElementById('custom-crepe-form').reset();
    updateCrepePrice();
}



function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert("Agrega algo a tu orden primero.");
        return;
    }

    const deliveryType = document.getElementById('btn-delivery').classList.contains('active') ? "DOMICILIO" : "RECOGER EN SUCURSAL";
    const address = document.getElementById('display-address').innerText;
    const phoneNumber = "5527796409";

    let message = `NUEVA ORDEN !! CREPAS  L U N A | L L E N A \n\n`;
    message += `Tipo: ${deliveryType}\n`;
    if (deliveryType === "DOMICILIO") {
        message += `Dirección: ${address}\n\n`;
    }
    message += `Mi pedido:\n`;

    let total = 0;
    cart.forEach(item => {
        message += `- 1x ${item.name} ($${item.price})\n`;
        total += item.price;
    });

    message += `\nTOTAL: $${total.toFixed(2)}\n\n`;
    message += `Hola, quiero confirmar esta orden.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}


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
    if (document.getElementById('btn-delivery').classList.contains('active')) {
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
        alert("Por favor ingresa una dirección válida o usa el GPS.");
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
    mapIframe.src = `https://maps.google.com/maps?q=${encodedAddress}&hl=es&z=15&output=embed`;
}

function getCurrentLocation() {
    const gpsBtn = document.getElementById('gps-btn');
    gpsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    addressInput.value = "Buscando tu ubicación...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                addressInput.value = "📍 Ubicación actual seleccionada";
                mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=16&output=embed`;
                gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
            },
            (error) => {
                let mensajeError = "No pudimos acceder a tu ubicación.";
                if (error.code === 1) mensajeError = "Permiso denegado. Activa el GPS.";
                if (error.code === 2) mensajeError = "La red no responde.";
                if (error.code === 3) mensajeError = "Se agotó el tiempo.";
                alert(mensajeError + " Escribe tu dirección manualmente.");
                addressInput.value = "";
                gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
        gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
    }
}

window.onclick = function (event) {
    if (event.target == mapModal) closeMapModal();
    if (event.target == qvModal) closeQuickView();
    if (event.target == customModal) closeCustomCrepeModal();
}