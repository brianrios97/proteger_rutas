// src/utils/header.ts
import { showModal } from './modal';

export function initHeader() {
    // 1. Protección de ruta global
    const usuarioActual = localStorage.getItem('userData');
    if (!usuarioActual) {
        window.location.replace('/src/pages/auth/login/login.html');
        throw new Error("Usuario no logueado, deteniendo ejecución.");
    }

    // 2. Referencias al DOM
    const userNameSpan = document.getElementById('user-name');
    const btnLogout = document.getElementById('btn-logout');

    // 3. Saludo
    if (userNameSpan) {
        const user = JSON.parse(usuarioActual);
        userNameSpan.textContent = `Hola, ${user.email.split('@')[0]}`;
    }

    // 4. Logout
    btnLogout?.addEventListener('click', async () => {
        const confirmacion = await showModal('Cerrar Sesión', '¿Estás seguro de que querés salir?');
        if (confirmacion) {
            localStorage.removeItem('userData');
            localStorage.removeItem('cart');
            window.location.replace('/src/pages/auth/login/login.html');
        }
    });
}