# Sistema de Gestión de Inventario — Backend Spring Boot
### Evidencia GA7-220501096-AA3-EV01 — Codificación de módulos del software

## 1. Objetivo
Implementar dos módulos funcionales del proyecto **Sistema de Gestión de Inventario**
utilizando **Spring Boot 3.x**, con arquitectura por capas (Controller, Service,
Repository, Entity), conexión a MySQL, endpoints REST y operaciones CRUD.

## 2. Módulos desarrollados
Se tomaron como referencia el modelo relacional y el diagrama de clases aprobados
en las fases anteriores del proyecto:

1. **Módulo Proveedor** — gestión de los proveedores del inventario.
2. **Módulo Producto** — gestión de los productos, relacionado con Proveedor
   (`proveedor_id`) y con Categoría (`categoria_id`) mediante llave foránea, tal
   como se definió en el modelo relacional.

## 3. Estructura del proyecto (Maven)

```
sistema-inventario-springboot/
├── pom.xml
├── database/
│   └── script.sql                 (script de referencia de las tablas)
├── src/main/java/com/inventario/sistema/
│   ├── SistemaInventarioApplication.java
│   ├── entity/
│   │   ├── Proveedor.java
│   │   ├── Producto.java
│   │   └── Categoria.java
│   ├── repository/
│   │   ├── ProveedorRepository.java
│   │   └── ProductoRepository.java
│   ├── service/
│   │   ├── ProveedorService.java
│   │   └── ProductoService.java
│   ├── controller/
│   │   ├── ProveedorController.java
│   │   └── ProductoController.java
│   └── exception/
│       ├── RecursoNoEncontradoException.java
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   └── application.properties
└── src/test/java/.../SistemaInventarioApplicationTests.java
```

Esta organización de paquetes por **capa** (`entity`, `repository`, `service`,
`controller`, `exception`) sigue las convenciones de nomenclatura de Java y separa
claramente las responsabilidades de cada componente.

## 4. Requisitos previos
- **Java 21** o superior instalado (`java -version`).
- **Maven** (o usar el wrapper `mvnw` si lo agregas con `mvn -N wrapper:wrapper`).
- **MySQL** en ejecución (puedes usar el mismo `mydb` de las evidencias anteriores).
- Un IDE: **VS Code** con extensión "Extension Pack for Java" o **IntelliJ**.

## 5. Configuración del entorno
1. Abre `src/main/resources/application.properties`.
2. Reemplaza `spring.datasource.password` por la contraseña real de tu MySQL.
3. Las entidades (`entity/Proveedor.java`, `entity/Categoria.java`,
   `entity/Producto.java`) ya están mapeadas exactamente contra
   `database/script.sql` (tu script real de MySQL Workbench: tablas
   `PROVEEDOR`, `CATEGORIA`, `PRODUCTO` en mayúsculas). Se desactivó la
   estrategia de nombres de Spring (`spring.jpa.hibernate.naming.physical-strategy`)
   para que Hibernate respete el nombre exacto de tablas y columnas tal cual
   fueron creadas, en vez de convertirlas a minúsculas/snake_case.
4. Si tu base de datos ya existe, `spring.jpa.hibernate.ddl-auto=update` no
   la borra: solo crea/ajusta lo que falte. Si aún no la has creado, ejecuta
   `database/script.sql` en MySQL Workbench primero.

## 6. Cómo ejecutar el proyecto
Desde la carpeta del proyecto:

```bash
mvn spring-boot:run
```

o generando el `.jar`:

```bash
mvn clean package
java -jar target/sistema-inventario-1.0.0.jar
```

La aplicación queda disponible en `http://localhost:8080`.

## 7. Endpoints funcionales

### Módulo Proveedor — `/api/proveedores`
| Método | Endpoint                  | Descripción              |
|--------|----------------------------|---------------------------|
| GET    | `/api/proveedores`         | Listar todos              |
| GET    | `/api/proveedores/{id}`    | Obtener uno por id        |
| POST   | `/api/proveedores`         | Crear un proveedor        |
| PUT    | `/api/proveedores/{id}`    | Actualizar un proveedor   |
| DELETE | `/api/proveedores/{id}`    | Eliminar un proveedor     |

Ejemplo de cuerpo JSON para `POST /api/proveedores`:
```json
{
  "nombre": "Distribuidora ABC",
  "telefono": "3001234567",
  "contacto": "Juan Perez",
  "direccion": "Cra 10 #20-30"
}
```

### Módulo Producto — `/api/productos`
| Método | Endpoint                                    | Descripción                       |
|--------|----------------------------------------------|-------------------------------------|
| GET    | `/api/productos`                             | Listar todos                        |
| GET    | `/api/productos/{id}`                         | Obtener uno por id                  |
| GET    | `/api/productos/proveedor/{idProveedor}`      | Listar productos de un proveedor    |
| GET    | `/api/productos/categoria/{idCategoria}`      | Listar productos de una categoría   |
| GET    | `/api/productos/stock-bajo/{cantidad}`        | Listar productos con stock bajo     |
| POST   | `/api/productos`                              | Crear un producto                   |
| PUT    | `/api/productos/{id}`                          | Actualizar un producto              |
| DELETE | `/api/productos/{id}`                          | Eliminar un producto                |

Ejemplo de cuerpo JSON para `POST /api/productos`:
```json
{
  "nombre": "Mouse inalambrico",
  "descripcion": "Mouse optico USB",
  "precio": 35000.00,
  "stock": 50,
  "proveedor": { "idProveedor": 1 },
  "categoria": { "idCategoria": 1 }
}
```

## 8. Validaciones implementadas
- `Proveedor`: nombre obligatorio (`@NotBlank`), campos opcionales con longitud
  máxima validada (`@Size`) para teléfono, contacto y dirección.
- `Producto`: nombre obligatorio, precio mayor que cero cuando se envía
  (`@Positive`), stock obligatorio y no negativo (`@PositiveOrZero`), proveedor
  obligatorio (`@NotNull`).
- Los errores de validación se devuelven como JSON con código **400** gracias al
  `GlobalExceptionHandler`.
- Si se busca un id que no existe, se devuelve **404** con un mensaje claro
  (`RecursoNoEncontradoException`).

## 9. Cómo probar los endpoints
Puedes usar **Postman**, **Insomnia** o `curl`, por ejemplo:

```bash
curl http://localhost:8080/api/proveedores
curl -X POST http://localhost:8080/api/proveedores \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Distribuidora ABC","contacto":"Juan Perez","telefono":"3001234567","email":"contacto@abc.com","direccion":"Cra 10 #20-30"}'
```

Toma pantallazos de estas pruebas (petición y respuesta) para incluir en la
sustentación de la evidencia.

## 10. Control de versiones (Git/GitHub)
Este proyecto reutiliza y evoluciona el repositorio de las evidencias anteriores
(`Sistema-de-inventario`). Pasos sugeridos:

```bash
git init                       # si es un repo nuevo
git add .
git commit -m "Modulos Proveedor y Producto en Spring Boot - GA7-220501096-AA3-EV01"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/Sistema-de-inventario.git
git push -u origin main
```

Si ya tienes el repositorio de las evidencias anteriores, puedes crear una rama
o carpeta nueva dentro del mismo repo (ej. `backend-springboot/`) para mantener
el historial del proyecto completo (consola JDBC → web con Servlets → API REST
Spring Boot).

## 11. Próximos pasos (fuera del alcance de esta evidencia)
No se desarrolla interfaz gráfica ni frontend en esta evidencia: el foco es
exclusivamente el backend con Spring Boot. La capa de presentación (por ejemplo,
un frontend web o móvil que consuma estos endpoints REST) se abordará en una
evidencia posterior.
