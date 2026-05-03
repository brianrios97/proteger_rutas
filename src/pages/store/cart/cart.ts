import type { Product } from '../../../types/product';
// 👇 1. Importamos la nueva interfaz global (¡El profe va a estar orgulloso!)
import type { CartItem } from '../../../types/CartItem';

import { showModal } from '../../../utils/modal';
import { initHeader } from '../../../utils/header';
import { initMiniCart, updateCartCount, renderMiniCart } from '../../../utils/miniCart';

// 👇 2. Importamos Autenticación y Utilidades
import { checkAuhtUser } from '../../../utils/auth';
import { Rol } from '../../../types/Rol';
import { getUSer } from '../../../utils/localStorage';

// 👇 3. PROTECCIÓN DE RUTA
checkAuhtUser('/src/pages/auth/login/login.html', '/src/pages/auth/login/login.html', Rol.CLIENT);

// Inicializamos
initHeader();
initMiniCart();

// --- 3. REFERENCIAS AL DOM (CARRITO GRANDE) ---
const itemsContainer = document.getElementById('cart-items-container');
const finalTotalEl = document.getElementById('cart-final-total');
const btnEmpty = document.getElementById('btn-empty-cart');
const btnBuy = document.getElementById('btn-buy');

// --- 4. LÓGICA EXCLUSIVA DE LA PÁGINA CARRITO ---
function renderCartPage() {
    if (!itemsContainer || !finalTotalEl) return;
    updateCartCount();
    renderMiniCart();

    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    itemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align:center; color: #64748b; font-size: 1.1em; padding: 40px 0;">Tu carrito está vacío. ¡Agregá algo rico!</p>';
        finalTotalEl.textContent = '0';
        if (btnBuy) (btnBuy as HTMLButtonElement).disabled = true;
        if (btnEmpty) (btnEmpty as HTMLButtonElement).style.display = 'none';
        return;
    }

    if (btnBuy) (btnBuy as HTMLButtonElement).disabled = false;
    if (btnEmpty) (btnEmpty as HTMLButtonElement).style.display = 'inline-block';

    cart.forEach(item => {
        const subtotal = item.product.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'checkout-item';
        div.innerHTML = `
            <div class="item-info">
                <img src="/assets/${item.product.imagen}" alt="${item.product.nombre}" onerror="this.style.display='none'">
                <div>
                    <p class="item-name">${item.product.nombre}</p>
                    <p class="item-price">$${item.product.precio} c/u</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="qty-selector">
                    <button class="qty-btn minus" data-id="${item.product.id}">-</button>
                    <input type="number" class="cart-qty-input" value="${item.cantidad}" readonly>
                    <button class="qty-btn plus" data-id="${item.product.id}">+</button>
                </div>
                <div class="item-subtotal">
                    <p>$${subtotal}</p>
                </div>
            </div>
        `;
        itemsContainer.appendChild(div);
    });

    finalTotalEl.textContent = total.toString();

    // Eventos de botones de cantidad (Lista Grande)
    itemsContainer.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            cambiarCantidad(id, -1);
        });
    });

    itemsContainer.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            const itemInCart = cart.find(i => i.product.id === id);

            if (itemInCart && itemInCart.cantidad < itemInCart.product.stock) {
                cambiarCantidad(id, 1);
            } else {
                await showModal('Sin Stock', 'No hay más unidades disponibles.', true);
            }
        });
    });
}

function cambiarCantidad(productId: number, cambio: number) {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex(item => item.product.id === productId);

    if (index !== -1) {
        cart[index].cantidad += cambio;
        if (cart[index].cantidad <= 0) cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage();
    }
}

// --- 5. EVENTOS FINALES (CHECKOUT) ---

btnEmpty?.addEventListener('click', async () => {
    const confirm = await showModal('Vaciar Carrito', '¿Querés borrar todo el pedido?');
    if (confirm) {
        localStorage.removeItem('cart');
        renderCartPage();
    }
});

btnBuy?.addEventListener('click', async () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return;

    // 👇 Usamos getUSer() en lugar de leer el localStorage directo
    const usuarioActual = getUSer();
    if (!usuarioActual) return;
    const user = JSON.parse(usuarioActual);

    const total = cart.reduce((sum: number, item: CartItem) => sum + (item.product.precio * item.cantidad), 0);

    const nuevoPedido = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        userEmail: user.email,
        fecha: new Date().toLocaleString('es-AR'),
        timestamp: Date.now(),
        items: cart,
        total: total
    };

    const historial = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    historial.unshift(nuevoPedido);
    localStorage.setItem('orderHistory', JSON.stringify(historial));
    localStorage.removeItem('cart');

    await showModal('¡Éxito!', 'Pedido registrado. ¡Gracias por tu compra! 🛵', true);
    window.location.href = '/src/pages/store/orders/orders.html';
});

window.addEventListener('cartUpdated', renderCartPage);
renderCartPage();