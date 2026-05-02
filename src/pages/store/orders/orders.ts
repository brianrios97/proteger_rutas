// 👇 1. Importamos las utilidades modulares
import { initHeader } from '../../../utils/header';
import { initMiniCart, updateCartCount } from '../../../utils/miniCart';

// 👇 2. Inicializamos el Header (protección, saludo, logout) y el Mini Carrito
initHeader();
initMiniCart();

// --- 3. ESTADO DE PAGINACIÓN ---
let currentPage = 1;
const itemsPerPage = 4;
let fullHistory: any[] = [];

// --- 4. REFERENCIAS AL DOM EXCLUSIVAS DE PEDIDOS ---
const ordersList = document.getElementById('orders-list');
const btnPrev = document.getElementById('btn-prev') as HTMLButtonElement;
const btnNext = document.getElementById('btn-next') as HTMLButtonElement;
const pageInfo = document.getElementById('page-info');

// --- 5. LÓGICA EXCLUSIVA DE RENDERIZADO DE PEDIDOS ---
function renderOrders() {
    // Usamos la función modular para actualizar el numerito rojo
    updateCartCount();

    if (!ordersList || !pageInfo) return;

    const userData = localStorage.getItem('userData');
    if (!userData) return;
    const user = JSON.parse(userData);

    const historyString = localStorage.getItem('orderHistory');
    let allOrders = historyString ? JSON.parse(historyString) : [];

    // FILTRAMOS: Solo los que pertenecen a este usuario
    fullHistory = allOrders.filter((order: any) => order.userEmail === user.email);

    if (fullHistory.length === 0) {
        ordersList.innerHTML = '<p class="empty-msg">Aún no tienes pedidos.</p>';
        updatePaginationButtons(0);
        pageInfo.textContent = "Página 0 de 0";
        return;
    }

    const totalPages = Math.ceil(fullHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const ordersToShow = fullHistory.slice(startIndex, startIndex + itemsPerPage);

    ordersList.innerHTML = '';
    const tiempoActual = Date.now();

    ordersToShow.forEach((order: any) => {
        const estaEntregado = (tiempoActual - order.timestamp) > 60000;
        const div = document.createElement('div');
        div.className = 'order-card';

        const itemsHtml = order.items.map((item: any) =>
            `<p class="order-item">• ${item.cantidad}x ${item.product.nombre}</p>`
        ).join('');

        div.innerHTML = `
            <div class="order-header">
                <div>
                    <h3>Pedido ${order.id}</h3>
                    <p class="order-date">${order.fecha}</p>
                </div>
                <div class="order-status ${estaEntregado ? 'status-delivered' : 'status-pending'}">
                    ${estaEntregado ? '✅ Entregado' : '⏳ Pendiente'}
                </div>
            </div>
            <div class="order-body">
                ${itemsHtml}
            </div>
            <div class="order-footer">
                <p>Total: <strong>$${order.total}</strong></p>
            </div>
        `;
        ordersList.appendChild(div);
    });

    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    updatePaginationButtons(totalPages);
}

function updatePaginationButtons(totalPages: number) {
    if (!btnPrev || !btnNext) return;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage >= totalPages || totalPages === 0;
}

// --- 6. EVENTOS DE PAGINACIÓN ---
btnPrev?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderOrders(); }
});

btnNext?.addEventListener('click', () => {
    const totalPages = Math.ceil(fullHistory.length / itemsPerPage);
    if (currentPage < totalPages) { currentPage++; renderOrders(); }
});

// Refrescar cada 15 segundos para ver si los pedidos cambian a "Entregado"
setInterval(renderOrders, 15000);

// Inicializar la página de pedidos
renderOrders();