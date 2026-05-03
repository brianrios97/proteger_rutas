import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";
// 👇 1. IMPORTAMOS EL SERVICIO DE LOGIN
import { loginUser } from "../../../utils/auth";

// --- 1. REFERENCIAS AL DOM Y AL MODAL ---
const formLogin = document.querySelector<HTMLFormElement>("#form-login");

const modal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-message');
const modalConfirm = document.getElementById('modal-btn-confirm');

function showModal(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
        if (!modal || !modalTitle || !modalMsg || !modalConfirm) return;

        modalTitle.textContent = title;
        modalMsg.textContent = message;
        modal.classList.remove('hidden');

        modalConfirm.onclick = () => {
            modal.classList.add('hidden');
            resolve();
        };
    });
}

// --- 2. EVENTO DE LOGIN (ASÍNCRONO) ---
formLogin?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    try {
        const formData = new FormData(formLogin);
        const emailLogin = formData.get("email") as string;
        const passwordLogin = formData.get("password") as string;

        if (!emailLogin || !passwordLogin) {
             await showModal('Datos Faltantes', 'Por favor, completá todos los campos.');
             return;
        }

        // 👇 2. LLAMAMOS A NUESTRA FUNCIÓN CENTRALIZADA
        const resultado = await loginUser(emailLogin, passwordLogin);

        if (resultado.success && resultado.user) {
            // Extraemos el nombre del email para el saludo
            const nombreUsuario = resultado.user.email.split('@')[0];

            await showModal('¡Bienvenido!', `Hola ${nombreUsuario}, ¡qué bueno verte de nuevo! 🍔`);

            // Redirigimos según el rol
            if (resultado.user.role === Rol.ADMIN) {
                window.location.replace("/src/pages/admin/home/home.html");
            } else {
                window.location.replace("/src/pages/store/home/home.html");
            }
        } else {
             // Si success es false, mostramos el error que mandó auth.ts
             await showModal('Error de Acceso', resultado.message || 'Error al iniciar sesión.');
             formLogin.reset();
        }

    } catch (error: any) {
         console.error("Error en el login:", error);
         await showModal('Ups!', 'Ocurrió un error inesperado. Intentá más tarde.');
    }
});