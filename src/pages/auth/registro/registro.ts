import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";
// 👇 1. IMPORTAMOS LA FUNCIÓN DESDE TU ARCHIVO AUTH
import { registerUser } from "../../../utils/auth";

// --- 1. REFERENCIAS AL DOM Y AL MODAL ---
const formRegistro = document.querySelector<HTMLFormElement>("#form-registro");

const modal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-message');
const modalConfirm = document.getElementById('modal-btn-confirm');

/**
 * Función para mostrar el modal metalizado
 */
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

// --- 2. EVENTO DE REGISTRO (ASÍNCRONO) ---
formRegistro?.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    try {
        const formData = new FormData(formRegistro);
        const emailInput = formData.get("email") as string;
        const passwordInput = formData.get("password") as string;

        // Validación de campos vacíos
        if (!emailInput || !passwordInput) {
            await showModal('Campos Incompletos', 'Por favor, completá tu email y contraseña para continuar.');
            return;
        }

        const nuevoUsuario: IUser = {
            email: emailInput,
            password: passwordInput,
            role: Rol.CLIENT
        };

        // 👇 2. ACÁ USAMOS EL SERVICIO CENTRALIZADO (¡Chau a leer el localStorage a mano!)
        const resultado = await registerUser(nuevoUsuario);

        // Si la función devuelve success en false, mostramos el error
        if (!resultado.success) {
            await showModal('Email Duplicado', resultado.message || 'Ese correo ya se encuentra registrado.');
            return;
        }

        // 👇 Feedback de éxito metalizado (Si llegó acá, success fue true)
        await showModal('¡Registro Exitoso!', 'Tu cuenta fue creada correctamente. Ahora vamos al inicio de sesión. 🍔');

        formRegistro.reset();

        // Redirección al login
        window.location.replace("../login/login.html");

    } catch (error: any) {
        console.error("Error en el registro:", error);
        await showModal('Error', error.message || 'No pudimos procesar tu registro. Intentá nuevamente.');
    }
});