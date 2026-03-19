# E-commerce Frontend

Frontend de la prueba técnica de e-commerce, desarrollado con **React**, **TypeScript** y **Material UI (MUI)**.  
La aplicación consume una API construida en **NestJS** para la gestión de autenticación, productos y órdenes.

# Objetivo del frontend

Este frontend tiene como objetivo servir como cliente de la API backend, permitiendo:

- Registro e inicio de sesión de usuarios.
- Consumo y visualización del catálogo de productos.
- Creación de productos.
- Creación de órdenes con múltiples ítems.
- Interacción con endpoints protegidos mediante autenticación JWT.

## Stack y dependencias principales

- **Core**: React 18, TypeScript, Vite
- **UI**: Material UI (MUI), Emotion
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: Context API
- **Testing**: Vitest, React Testing Library, Happy DOM

## Requisitos previos

- Node.js **20.0.0** o superior
- npm o yarn
- Backend principal corriendo localmente (puerto 8080)

## Instalación local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/GermanDev7/front-ecommerce-2026.git
   ```

2. **Copiar variables de entorno**:

   ```bash
   cd front-ecommerce-2026
   ```
   Copia el archivo `.env.example` y renómbralo como `.env`.
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Instalación y Ejecución**:
   ```bash
   npm install
   npm run dev
   ```
   
   La aplicación quedará disponible normalmente en:, normalmente: `http://localhost:5173/`

## Scripts disponibles

- `npm run dev` — Ejecuta la app en modo desarrollo
- `npm run build` — Genera el build de producción
- `npm run preview` — Previsualiza el build generado
- `npm run test` — Ejecuta las pruebas
- `npm run lint` — Ejecuta validaciones de lint

## Funcionalidades principales

- Registro de usuarios.
- Inicio de sesión con autenticación JWT.
- Protección de rutas privadas.
- Visualización del catálogo de productos.
- Creación de productos mediante formulario modal.
- Creación de órdenes con múltiples ítems.
- Cálculo automático del total de la orden.
- Validación de stock contra la API.
- Manejo de errores de validación y negocio retornados por el backend.

## Configuración esperada del backend

El frontend espera que el backend esté disponible en:

`http://localhost:8080/api/v1`

Asegúrate de tener el servicio backend corriendo antes de probar la aplicación (puedes modificar este enlace en tu archivo `.env` si es necesario).

## Estructura general del proyecto

```text
src/
  src/
  assets/         # Recursos estáticos
  components/     # Componentes reutilizables y modales
  contexts/       # Contextos globales, como autenticación
  hooks/          # Hooks personalizados para lógica reutilizable
  pages/          # Páginas principales de la aplicación
  services/       # Configuración HTTP y servicios hacia la API
  App.tsx         # Composición principal de rutas y layout
  main.tsx        # Punto de entrada de la aplicación
```

## Decisiones técnicas

- Se utilizó TypeScript para mejorar el tipado estático, reducir errores y facilitar el mantenimiento.
- Se utilizó Material UI para construir una interfaz consistente, reutilizable y responsive de forma ágil.
- La comunicación con la API se centralizó en la carpeta services, separando la lógica de red de la capa visual.
- La autenticación se maneja mediante JWT, integrando rutas protegidas y control de sesión desde el frontend.
- Se emplearon Context API y hooks personalizados para encapsular estado compartido y lógica de negocio del cliente.
- Se añadieron pruebas con Vitest y React Testing Library para validar comportamientos clave de componentes y hooks.
