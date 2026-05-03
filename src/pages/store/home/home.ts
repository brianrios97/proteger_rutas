import { PRODUCTS, getCategories } from '../../../data/data';
import type { Product } from '../../../types/product';

// 👇 1. Importamos la lógica compartida que modularizamos
import { showModal } from '../../../utils/modal';
import { initHeader } from '../../../utils/header';
import { initMiniCart, updateCartCount, renderMiniCart } from '../../../utils/miniCart';

// 👇 1.5 IMPORTAMOS LA AUTENTICACIÓN Y EL ROL
import { checkAuhtUser } from '../../../utils/auth';
import { Rol } from '../../../types/Rol';

// 👇 2. Inicializamos Header y Mini Carrito automáticamente
initHeader();
initMiniCart();

// 👇 2.5 PROTECCIÓN DE RUTA (¡La pieza clave!)
// Si no está logueado -> Login
// Si tiene un rol que no es CLIENT (ej. admin) -> Login (o a donde decidas)
checkAuhtUser('/src/pages/auth/login/login.html', '/src/pages/auth/login/login.html', Rol.CLIENT);

// --- 3. REFERENCIAS AL DOM GLOBALES ---
const productGrid = document.getElementById('product-grid') as HTMLDivElement;
const categoryList = document.getElementById('category-list') as HTMLUListElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageInfo = document.getElementById('page-info') as HTMLSpanElement;

// --- 4. VARIABLES DE ESTADO ---
let currentCategory: string | number = 'todas';
let currentSearch = '';
let currentPage = 1;
const itemsPerPage = 8;
let currentFilteredProducts: Product[] = [];

// --- 5. LÓGICA EXCLUSIVA DEL HOME (Catálogo y Grilla) ---
function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    if (currentFilteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #64748b;">No se encontraron productos.</p>';
        updatePaginationControls();
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = currentFilteredProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        const isOutOfStock = product.stock === 0 || !product.disponible;
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src="/assets/${product.imagen}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p class="precio">$<span id="card-price-${product.id}">${product.precio}</span></p>

            <div class="add-to-cart-container">
                <div class="qty-selector">
                    <button class="qty-btn minus" data-id="${product.id}">-</button>
                    <input type="number" id="card-qty-${product.id}" class="card-qty-input" value="1" min="1" max="${product.stock}" readonly>
                    <button class="qty-btn plus" data-id="${product.id}">+</button>
                </div>
                <button class="btn-add" data-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Sin Stock' : 'Agregar'}
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            const inputEl = document.getElementById(`card-qty-${id}`) as HTMLInputElement;
            const priceSpan = document.getElementById(`card-price-${id}`);
            const product = currentFilteredProducts.find(p => p.id === id);

            if (inputEl && product && parseInt(inputEl.value) > 1) {
                const newQty = parseInt(inputEl.value) - 1;
                inputEl.value = newQty.toString();
                if (priceSpan) priceSpan.textContent = (product.precio * newQty).toString();
            }
        });
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            const inputEl = document.getElementById(`card-qty-${id}`) as HTMLInputElement;
            const priceSpan = document.getElementById(`card-price-${id}`);
            const product = currentFilteredProducts.find(p => p.id === id);

            if (inputEl && product) {
                if (parseInt(inputEl.value) < product.stock) {
                    const newQty = parseInt(inputEl.value) + 1;
                    inputEl.value = newQty.toString();
                    if (priceSpan) priceSpan.textContent = (product.precio * newQty).toString();
                } else {
                    await showModal('Sin Stock', 'No hay más unidades disponibles de este producto.', true);
                }
            }
        });
    });

    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
            const inputEl = document.getElementById(`card-qty-${id}`) as HTMLInputElement;
            const priceSpan = document.getElementById(`card-price-${id}`);
            const product = currentFilteredProducts.find(p => p.id === id);

            const cantidadSeleccionada = inputEl ? parseInt(inputEl.value) : 1;
            agregarAlCarrito(id, cantidadSeleccionada);

            if (inputEl) inputEl.value = '1';
            if (priceSpan && product) priceSpan.textContent = product.precio.toString();
        });
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    if (!btnPrev || !btnNext || !pageInfo) return;
    const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage >= totalPages || totalPages === 0;
}

btnPrev?.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderProducts(); } });
btnNext?.addEventListener('click', () => {
    const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) { currentPage++; renderProducts(); }
});

function renderCategories() {
    if (!categoryList) return;
    const categories = getCategories();
    categoryList.innerHTML = `<li class="active" data-id="todas">Todas</li>`;

    categories.forEach(cat => {
        const li = document.createElement('li');
        li.setAttribute('data-id', cat.id.toString());
        li.textContent = cat.nombre;
        categoryList.appendChild(li);
    });

    categoryList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            categoryList.querySelectorAll('li').forEach(i => i.classList.remove('active'));
            const target = e.target as HTMLLIElement;
            target.classList.add('active');
            const idAttr = target.getAttribute('data-id');
            currentCategory = idAttr === 'todas' ? 'todas' : Number(idAttr);
            if (currentCategory === 'todas') {
                if (searchInput) searchInput.value = ''; // Limpia lo visual
                currentSearch = ''; // Limpia el estado interno
            }
            applyFilters();
        });
    });
}

function applyFilters() {
    let filtered = PRODUCTS;
    if (currentCategory !== 'todas') {
        filtered = filtered.filter(p => p.categorias.some(c => c.id === currentCategory));
    }
    if (currentSearch.trim() !== '') {
        const searchTerm = currentSearch.toLowerCase();
        filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm));
    }
    currentFilteredProducts = filtered;
    currentPage = 1;
    renderProducts();
}

searchInput?.addEventListener('input', (e) => {
    currentSearch = (e.target as HTMLInputElement).value;
    applyFilters();
});

function agregarAlCarrito(productId: number, cantidadAAgregar: number = 1) {
    const productToAdd = PRODUCTS.find(p => p.id === productId);
    if (!productToAdd) return;

    let cart: { product: Product, cantidad: number }[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex(item => item.product.id === productId);

    if (index !== -1) {
        cart[index].cantidad += cantidadAAgregar;
    } else {
        cart.push({ product: productToAdd, cantidad: cantidadAAgregar });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // 👇 Usamos las utilidades que importamos!
    updateCartCount();
    renderMiniCart();
}

function init() {
    renderCategories();
    applyFilters();
}
init();