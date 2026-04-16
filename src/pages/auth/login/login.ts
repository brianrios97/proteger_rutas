import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";

const formLogin = document.querySelector<HTMLFormElement>("#form-login");

formLogin?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    try {
        const formData = new FormData(formLogin);
        const emailLogin = formData.get("email") as string;
        const passwordLogin = formData.get("password") as string;

        if (!emailLogin || !passwordLogin) {
             throw new Error("El email y la contraseña son obligatorios.");
        }

        const usuariosGuardados = localStorage.getItem("users");
        const arrayUsuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

        const usuarioAutenticado = arrayUsuarios.find(
            (user) => user.email === emailLogin && user.password === passwordLogin
        );

        if (usuarioAutenticado) {
            // Guardamos la sesión
            localStorage.setItem("userData", JSON.stringify(usuarioAutenticado));

            alert(`¡Bienvenido, ${usuarioAutenticado.email}!`);

            // Redirigimos según el rol
            if (usuarioAutenticado.role === Rol.ADMIN) {
                // Como el login está en /src/pages/auth/login/, subimos 3 niveles para llegar a /src/pages/
                window.location.replace("../../admin/home/home.html");
            } else {
                window.location.replace("../../client/home/home.html");
            }
        } else {
             // Credenciales incorrectas
             alert("Credenciales incorrectas. Verifica tu email y contraseña.");
             formLogin.reset();
        }

    } catch (error: any) {
         console.error("Error en el login:", error);
         alert(error.message || "Ocurrió un error al intentar iniciar sesión.");
    }
});