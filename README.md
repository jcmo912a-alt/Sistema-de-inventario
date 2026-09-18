# Sistema de Gestión de Inventario — Front-End (React + Vite)

Front-End construido en **React + Vite** que consume el backend en **Spring Boot** (evidencia GA7-220501096-AA3-EV01), implementando los dos módulos ya desarrollados en el backend: **Productos** y **Proveedores**.

## 1. Requisitos previos

- Node.js 18 o superior (incluye npm).
- El backend Spring Boot corriendo en `http://localhost:8080` (o el host/puerto que configures).
- Git.

## 2. Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo (http://localhost:5173)
npm run dev

# 3. Generar la build de producción
npm run build
npm run preview
```

## 3. Configuración de la API

La URL base del backend está centralizada en **`src/config.js`**:

```js
export const API_BASE_URL = 'http://localhost:8080/api';
```

Si tu backend expone los endpoints en otra ruta o puerto, solo necesitas cambiar esa línea.

## 4. Estructura del proyecto

```
src/
├── config.js                 # URL base del backend
├── api/
│   ├── httpClient.js         # Cliente fetch genérico (maneja JSON y errores)
│   ├── productoService.js    # GET/POST/PUT/DELETE sobre /api/productos
│   └── proveedorService.js   # GET/POST/PUT/DELETE sobre /api/proveedores
├── components/
│   ├── common/                Tabla, Modal, Boton, Mensaje (reutilizables)
│   ├── layout/                 Header, Footer
│   ├── productos/               ProductosPage, FormularioProducto
│   └── proveedores/             ProveedoresPage, FormularioProveedor
├── App.jsx                   # Componente raíz (navegación entre módulos)
├── main.jsx                  # Punto de entrada de React
├── index.css                 # Variables de diseño y reset
└── App.css                   # Estilos de layout, módulos y formularios
```

## 5. Nota importante sobre los campos (DTO)

Los formularios y las tablas se construyeron con los campos que se documentaron en el diseño de interfaces previo (evidencia GA6-220501096-AA3-EV03) y en el análisis del proyecto:

- **Producto**: `sku`, `nombre`, `categoria`, `descripcion`, `precio`, `stock`.
- **Proveedor**: `nombre`, `ciudad`, `categoria`, `telefono`, `correo`, `activo`.

Si los nombres exactos de los campos en tus clases `Producto`/`Proveedor` de Spring Boot son distintos (por ejemplo, si `categoria` se serializa como un objeto anidado `{ id, nombre }` en vez de texto plano), solo debes ajustar:

- Las columnas (`COLUMNAS`) en `ProductosPage.jsx` / `ProveedoresPage.jsx`.
- Los campos del `useState` inicial y el objeto que se envía en `onGuardar` dentro de `FormularioProducto.jsx` / `FormularioProveedor.jsx`.

El resto de la aplicación (Tabla, Modal, cliente HTTP) no necesita cambios porque es genérico.

## 6. Control de versiones (Git)

```bash
git init
git add .
git commit -m "Front-End inicial: módulos Productos y Proveedores en React + Vite"
git branch -M main
git remote add origin <URL-de-tu-repositorio>
git push -u origin main
```

## 7. Conceptos de React aplicados

- **JSX** en todos los componentes de `src/components`.
- **Componentes reutilizables**: `Tabla`, `Modal`, `Boton` y `Mensaje` se usan en ambos módulos.
- **Props**: por ejemplo, `FormularioProducto` recibe `producto`, `onGuardar` y `onCancelar`.
- **useState**: manejo de listas, campos de formulario, errores de validación y mensajes.
- **useEffect**: carga inicial de datos desde el backend al montar `ProductosPage` y `ProveedoresPage`.
- **Organización por componentes**: separación en `common/`, `layout/`, `productos/` y `proveedores/`.

## 8. Validaciones implementadas

| Campo | Regla |
|---|---|
| Nombre (producto/proveedor) | Obligatorio, entre 3 y 80 caracteres |
| SKU | Obligatorio, entre 3 y 20 caracteres |
| Categoría | Obligatoria |
| Descripción | Máximo 250 caracteres |
| Precio | Obligatorio, numérico, mayor que 0 |
| Stock | Obligatorio, entero, mayor o igual a 0 |
| Ciudad | Obligatoria |
| Teléfono | Obligatorio, entre 7 y 15 dígitos |
| Correo | Obligatorio, formato de correo válido |
