import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";

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

        const usuariosGuardados = localStorage.getItem("users");
        const arrayUsuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

        // Verificar si el usuario ya existe
        const existe = arrayUsuarios.some(user => user.email === nuevoUsuario.email);
        if (existe) {
            await showModal('Email Duplicado', 'Ese correo ya se encuentra registrado. Intentá con otro o iniciá sesión.');
            return;
        }

        // Guardar nuevo usuario
        arrayUsuarios.push(nuevoUsuario);
        localStorage.setItem("users", JSON.stringify(arrayUsuarios));

        // 👇 Feedback de éxito metalizado
        await showModal('¡Registro Exitoso!', 'Tu cuenta fue creada correctamente. Ahora vamos al inicio de sesión. 🍔');

        formRegistro.reset();

        // Redirección al login
        window.location.replace("../login/login.html");

    } catch (error: any) {
        console.error("Error en el registro:", error);
        await showModal('Error', error.message || 'No pudimos procesar tu registro. Intentá nuevamente.');
    }
});