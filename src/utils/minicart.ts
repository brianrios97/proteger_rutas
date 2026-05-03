// src/utils/miniCart.ts
import type { Product } from '../types/product';

export function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum: number, item: any) => sum + item.cantidad, 0);
    cartCountElement.textContent = totalItems.toString();
}

export function renderMiniCart() {
    const miniCartItems = document.getElementById('mini-cart-items');
    const miniCartTotal = document.getElementById('mini-cart-total');
    if (!miniCartItems || !miniCartTotal) return;

    const cart: { product: Product, cantidad: number }[] = JSON.parse(localStorage.getItem('cart') || '[]');
    miniCartItems.innerHTML = '';

    if (cart.length === 0) {
        miniCartItems.innerHTML = '<p style="text-align:center; padding:10px; color: #64748b;">El carrito está vacío.</p>';
        miniCartTotal.textContent = '0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.product.precio * item.cantidad;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <p style="margin: 0; font-weight: bold; font-size: 0.9em;">${item.product.nombre}</p>
                <p style="margin: 0; font-size: 0.8em; color: #64748b;">$${item.product.precio} c/u</p>
            </div>
            <div class="item-controls">
                <button class="btn-minus" data-id="${item.product.id}">-</button>
                <span style="margin: 0 8px; font-weight: bold;">${item.cantidad}</span>
                <button class="btn-plus" data-id="${item.product.id}">+</button>
            </div>
        `;
        miniCartItems.appendChild(div);
    });
    miniCartTotal.textContent = total.toString();

    // Eventos internos del mini-carrito
    miniCartItems.querySelectorAll('.btn-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            cambiarCantidadMini(id, -1);
        });
    });

    miniCartItems.querySelectorAll('.btn-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            cambiarCantidadMini(id, 1);
        });
    });
}

// Acordate de importar showModal arriba de todo en miniCart.ts si aún no lo tenés:
// import { showModal } from './modal';

function cambiarCantidadMini(productId: number, cambio: number) {
    // Nota: si ya importaste la interfaz CartItem, podés usarla acá en vez del tipo largo
    let cart: { product: Product, cantidad: number }[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex(item => item.product.id === productId);

    if (index !== -1) {
        // 👇 ESTA ES LA BARRERA DE STOCK
        if (cambio > 0 && cart[index].cantidad >= cart[index].product.stock) {
            // Frena la función y le avisa al usuario
            showModal('Sin Stock', 'No hay más unidades disponibles de este producto.');
            return;
        }

        // Si pasó la barrera (o si está restando), aplica el cambio
        cart[index].cantidad += cambio;

        if (cart[index].cantidad <= 0) cart.splice(index, 1);

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();
        renderMiniCart();

        window.dispatchEvent(new Event('cartUpdated'));
    }
}

export function initMiniCart() {
    const btnCart = document.getElementById('btn-cart');
    const miniCart = document.getElementById('mini-cart');
    const btnCheckout = document.getElementById('btn-checkout');

    btnCart?.addEventListener('click', () => {
        if (miniCart) {
            miniCart.classList.toggle('hidden');
            renderMiniCart();
        }
    });

    btnCheckout?.addEventListener('click', () => {
        // Redirige al checkout grande
        window.location.href = '/src/pages/store/cart/cart.html';
    });

    // Iniciar conteo
    updateCartCount();
}