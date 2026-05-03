// src/utils/header.ts
import { showModal } from './modal';
// 👇 1. Importamos las funciones centralizadas
import { logout } from './auth';
import { getUSer } from './localStorage';

export function initHeader() {
    // 1. Protección de ruta (Traemos al usuario con la función de utilería)
    const usuarioActual = getUSer();
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
        // Mantenemos tu genial idea del modal de confirmación
        const confirmacion = await showModal('Cerrar Sesión', '¿Estás seguro de que querés salir?');
        if (confirmacion) {
            // 👇 2. DELEGAMOS LA TAREA AL SERVICIO DE AUTH
            logout();
        }
    });
}