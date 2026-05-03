export const navigate = (route: string) => {
    // Si la ruta no empieza con "/", se la agregamos por seguridad
    const safeRoute = route.startsWith('/') ? route : `/${route}`;

    // Forzamos la redirección desde la raíz absoluta (ej: http://localhost:5173/ruta)
    window.location.href = window.location.origin + safeRoute;
};