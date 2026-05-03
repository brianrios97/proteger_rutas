import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUSer, removeUser } from "./localStorage";
import { navigate } from "./navigate";

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
) => {
  console.log("comienzo de checkeo");

  const user = getUSer();

  if (!user) {
    console.log("no existe en local");
    navigate(redireccion1);
    return;
  } else {
    console.log("existe pero no tiene el rol necesario");

    const parseUser: IUser = JSON.parse(user);
    if (parseUser.role !== rol) {
      navigate(redireccion2);
      return;
    }
  }
};

export const logout = () => {
  removeUser();
  localStorage.removeItem('cart');
  navigate("/src/pages/auth/login/login.html");
};

export const registerUser = async (nuevoUsuario: IUser): Promise<{ success: boolean; message?: string }> => {
    // 1. Traer los usuarios del localStorage (si usáramos base de datos, acá iría el fetch/axios)
    const usuariosGuardados = localStorage.getItem("users");
    const arrayUsuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    // 2. Validar si existe (Tu lógica con .some())
    const existe = arrayUsuarios.some(user => user.email === nuevoUsuario.email);

    if (existe) {
        return { success: false, message: 'Ese correo ya se encuentra registrado. Intentá con otro o iniciá sesión.' };
    }

    // 3. Guardar el nuevo usuario
    arrayUsuarios.push(nuevoUsuario);
    localStorage.setItem("users", JSON.stringify(arrayUsuarios));

    return { success: true };
};

export const loginUser = async (emailLogin: string, passwordLogin: string): Promise<{ success: boolean; user?: IUser; message?: string }> => {
    // 1. Traemos los usuarios (nuestra "base de datos")
    const usuariosGuardados = localStorage.getItem("users");
    const arrayUsuarios: IUser[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    // 2. Buscamos coincidencias
    const usuarioAutenticado = arrayUsuarios.find(
        (user) => user.email === emailLogin && user.password === passwordLogin
    );

    // 3. Evaluamos el resultado
    if (usuarioAutenticado) {
        // Guardamos la sesión centralizada acá
        localStorage.setItem("userData", JSON.stringify(usuarioAutenticado));
        return { success: true, user: usuarioAutenticado };
    }

    return { success: false, message: 'Email o contraseña incorrectos. Volvé a intentarlo.' };
};
