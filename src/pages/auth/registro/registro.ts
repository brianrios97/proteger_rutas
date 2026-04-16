import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";

const formRegistro = document.querySelector<HTMLFormElement>("#form-registro");

formRegistro?.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    try {
        const formData = new FormData(formRegistro);
        const emailInput = formData.get("email") as string;
        const passwordInput = formData.get("password") as string;

        if (!emailInput || !passwordInput) {
            throw new Error("Por favor, completa todos los campos.");
        }

        const nuevoUsuario: IUser = {
            email: emailInput,
            password: passwordInput,
            role: Rol.CLIENT
        };

        const usuariosGuardados = localStorage.getItem("users");
        const arrayUsuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

        const existe = arrayUsuarios.some(user => user.email === nuevoUsuario.email);
        if (existe) {
            alert("Ese email ya está registrado. Intenta con otro.");
            return;
        }

        arrayUsuarios.push(nuevoUsuario);
        localStorage.setItem("users", JSON.stringify(arrayUsuarios));

        alert("¡Registro exitoso! Redirigiendo al login...");
        formRegistro.reset();

        // Redirección segura usando ruta relativa
        window.location.replace("../login/login.html");

    } catch (error: any) {
        // Acá atrapamos los errores y los mostramos en consola y en un alert
        console.error("Error en el registro:", error);
        alert(error.message || "Ocurrió un error inesperado al registrarte.");
    }
});