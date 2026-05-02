# 🍔 Food Store - Programación III

Aplicación web dinámica de pedidos de comida desarrollada con **TypeScript** y **Vite**. Este proyecto implementa un flujo completo de cliente: desde la autenticación hasta la gestión de pedidos, utilizando **localStorage** para la persistencia de datos y una arquitectura modular, aplicando buenas prácticas de diseño frontend.

## ✍️ Descripción del Proyecto

Este es un proyecto integrador desarrollado para la Evaluación 1 de Programación III. A partir del repositorio base educativo enfocado en la protección de rutas, se expandió el código para incluir un catálogo dinámico completo con funcionalidades e-commerce funcionales.

### 🌟 Funcionalidades Principales Implementadas

- **Autenticación (Guards):** Registro de usuarios y Login con protección manual de rutas en el cliente.
- **Catálogo Dinámico:** Búsqueda en tiempo real por nombre y filtrado cruzado por categorías.
- **Paginación:** División dinámica de los productos del catálogo.
- **Carrito de Compras Persistente:** Gestión de unidades (sumar, restar, límites de stock), cálculo de subtotales y total general. Visualización en mini-carrito y página de checkout.
- **Historial de Pedidos:** Aislamiento estricto de datos; cada usuario visualiza únicamente los pedidos generados desde su cuenta.
- **Interfaz Premium Modular:** Sistema de modales asíncronos propios (evitando `alerts`) y un diseño limpio manejado a través de un único `style.css` global.

---

## ⚠️ Nota Importante sobre Seguridad

La protección de rutas y persistencia implementada en este proyecto **NO ES SEGURA** para entornos reales.
- **Razón:** Toda la autenticación, carritos y pedidos se gestionan mediante `localStorage` en el navegador.
- **Enfoque:** Este proyecto fue desarrollado puramente con fines educativos y de aprendizaje para la manipulación de TypeScript y el DOM. En un entorno de producción, la validación y el resguardo de información deben manejarse estrictamente desde el **Backend**.

---

## 🚀 Instalación y Uso

Se recomienda usar `pnpm` como gestor de paquetes para mayor eficiencia en el manejo de dependencias.

### 1. Gestión del Entorno (NVM)

Se recomienda utilizar NVM (Node Version Manager) para garantizar el uso de una versión de Node.js compatible (v18 o superior). Antes de comenzar, ejecuta:

```bash
nvm use 18
```

### 2. Gestión de Paquetes (pnpm)

Este proyecto utiliza pnpm por su velocidad y eficiencia. Si no lo tienes instalado, puedes obtenerlo globalmente mediante npm:

```bash
npm install -g pnpm
```

### 3.Instalación de Dependencias

Una vez en la raíz del proyecto, descarga todos los paquetes necesarios:

```bash
pnpm install
```

### 4.Ejecución del Servidor

Para iniciar el entorno de desarrollo con Vite, ejecuta:

```bash
pnpm dev
```

La aplicación estará disponible en la URL que aparezca en la terminal (generalmente `http://localhost:5173`).




---

## ⚙️ ¿Cómo Funciona la Protección de Rutas?

El mecanismo de seguridad se gestiona de forma manual mediante lógica de TypeScript y el uso de localStorage:

Persistencia de Sesión: Cuando el usuario ingresa sus credenciales correctamente, el sistema genera un objeto con sus datos y lo almacena en localStorage bajo la clave userData.

Guardia de Rutas (Guards Manuales): Al inicio de cada controlador principal (como home.ts, cart.ts o orders.ts), se ejecuta una verificación inmediata de la clave userData.

Lógica de Redirección:

Si el usuario no está autenticado (la clave es nula), se utiliza window.location.replace() para redirigirlo instantáneamente al Login, impidiendo la visualización del catálogo o el carrito.

Si el usuario está autenticado, se le permite la navegación y se personaliza la interfaz (como el nombre en el Header).

Cierre de Sesión Seguro: Al ejecutar el Logout, se eliminan las entradas userData y cart de localStorage. Esto garantiza que la sesión finalice y que el siguiente usuario no pueda acceder a datos previos.
---

## 📁 Estructura del Proyecto

```
/
├── src/
│   ├── data/                 # Datos simulados de productos y categorías (data.ts)
│   ├── pages/                # Vistas principales modularizadas
│   │   ├── admin/            # (Mantenido de repositorio base)
│   │   ├── auth/             # Login y Registro (.html, .ts)
│   │   ├── client/           # (Mantenido de repositorio base)
│   │   └── store/            # 🛒 E-commerce (Desarrollo del parcial)
│   │       ├── cart/         # Resumen de compra y checkout
│   │       ├── home/         # Catálogo, filtros y grilla de productos
│   │       └── orders/       # Historial aislado de pedidos del usuario
│   ├── types/                # Interfaces y definición estricta de tipos de TS
│   └── utils/                # 🧩 Utilidades Reutilizables (PRINCIPIO DRY)
│       ├── header.ts         # Inicialización de NavBar y cierres de sesión
│       ├── minicart.ts       # Lógica centralizada del carrito flotante
│       ├── modal.ts          # Modales asíncronos UI basados en Promesas
│       └── style.css         # Hoja de estilos global y variables CSS
├── vite.config.ts            # Configuración de entrada múltiple de archivos HTML
└── README.md                 # Documentación
```
