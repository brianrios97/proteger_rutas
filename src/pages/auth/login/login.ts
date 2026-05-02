import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";

// --- 1. REFERENCIAS AL DOM Y AL MODAL ---
const formLogin = document.querySelector<HTMLFormElement>("#form-login");

const modal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-message');
const modalConfirm = document.getElementById('modal-btn-confirm');

/**
 * Función para mostrar el modal personalizado
 * (Solo modo alerta para Login/Error)
 */
function showModal(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
        if (!modal || !modalTitle || !modalMsg || !modalConfirm) return;

        modalTitle.textContent = title;
        modalMsg.textContent = message;
        modal.classList.remove('hidden');

        // Al hacer click en aceptar, cerramos y resolvemos
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

        // Validación de campos vacíos
        if (!emailLogin || !passwordLogin) {
             await showModal('Datos Faltantes', 'Por favor, completá todos los campos.');
             return;
        }

        const usuariosGuardados = localStorage.getItem("users");
        const arrayUsuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

        // Buscamos al usuario
        const usuarioAutenticado = arrayUsuarios.find(
            (user) => user.email === emailLogin && user.password === passwordLogin
        );

        if (usuarioAutenticado) {
            // Guardamos la sesión
            localStorage.setItem("userData", JSON.stringify(usuarioAutenticado));

            // Extraemos el nombre del email para el saludo
            const nombreUsuario = usuarioAutenticado.email.split('@')[0];

            // 👇 Modal de bienvenida antes de entrar
            await showModal('¡Bienvenido!', `Hola ${nombreUsuario}, ¡qué bueno verte de nuevo! 🍔`);

            // Redirigimos según el rol
            if (usuarioAutenticado.role === Rol.ADMIN) {
                window.location.replace("/src/pages/admin/home/home.html");
            } else {
                window.location.replace("/src/pages/store/home/home.html");
            }
        } else {
             // 👇 Modal de error en credenciales
             await showModal('Error de Acceso', 'Email o contraseña incorrectos. Volvé a intentarlo.');
             formLogin.reset();
        }

    } catch (error: any) {
         console.error("Error en el login:", error);
         await showModal('Ups!', 'Ocurrió un error inesperado. Intentá más tarde.');
    }
});