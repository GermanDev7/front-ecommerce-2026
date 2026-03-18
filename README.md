# E-commerce Frontend

Frontend de la prueba técnica de e-commerce, desarrollado con **React**, **TypeScript** y **Material UI (MUI)**.  
La aplicación consume una API construida en **NestJS** para la gestión de productos y órdenes.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Material UI
- Axios

## Requisitos previos

- Node.js **20.17.0** o superior
- npm o yarn
- Backend corriendo localmente

## Instalación local

1. **Instala las dependencias**:

   ```bash
   npm install
   ```

2. **Configura las variables de entorno**:

   Copia el archivo `.env.example` y renómbralo como `.env`.
   Asegúrate de que contenga la URL correcta del backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Inicia el servidor de desarrollo**:

   ```bash
   npm run dev
   ```
   
   La consola mostrará la URL local de ejecución, normalmente: `http://localhost:5173/`

## Scripts disponibles

- `npm run dev` — Ejecuta la app en modo desarrollo
- `npm run build` — Genera el build de producción
- `npm run preview` — Previsualiza el build generado
- `npm run lint` — Ejecuta validaciones de lint

## Funcionalidades principales

- Visualización de productos.
- Creación de productos mediante formulario modal.
- Creación de órdenes con múltiples ítems.
- Cálculo automático del total de la orden.
- Validación de stock desde la API.
- Manejo de errores detallados retornados por el backend.

## Configuración esperada del backend

El frontend espera que el backend esté disponible en:

`http://localhost:8080/api/v1`

Asegúrate de tener el servicio backend corriendo antes de probar la aplicación (puedes modificar este enlace en tu archivo `.env` si es necesario).

## Estructura general del proyecto

```text
src/
  components/  # Componentes visuales y modales de la interfaz
  services/    # Configuración de Axios y funciones hacia la API
  App.tsx      # Punto principal y Layout de la aplicación
```

## Decisiones técnicas

- Se utilizó **TypeScript** para mejorar el tipado estricto y reducir errores en tiempo de desarrollo.
- Se utilizó **Material UI** para acelerar la construcción de una interfaz consistente, responsive y profesional.
- La comunicación con el backend se centralizó a través de **servicios personalizados** para mantener separada la lógica de red de la capa visual (Clean Architecture).
- Los errores de validación y de negocio del backend se muestran dinámicamente en la interfaz para mejorar la experiencia del usuario y dar claridad funcional.
