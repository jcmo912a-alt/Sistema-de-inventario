import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


public class Main {
    public static void main(String[] args) {

        System.out.println("### 1. Registro de Proveedor ###");
        Proveedor proveedor1 = new Proveedor(1, "Distribuidora La Economia", "Juan Perez",
                "3001234567", "Calle 10 # 5-20");
        proveedor1.registrarProveedor();

        System.out.println("\n### 2. Registro de Categoria ###");
        Categoria categoriaGranos = new Categoria(1, "Granos", "Arroz, frijol, lentejas y similares");
        Categoria categoriaLacteos = new Categoria(2, "Lacteos", "Leche, queso, yogurt y derivados");

        System.out.println("\n### 3. Registro de Productos ###");
        Producto producto1 = new Producto(1, "Arroz 500g", LocalDate.of(2027, 5, 30), 50);
        producto1.registrarProducto();
        producto1.setCategoria(categoriaGranos);
        proveedor1.agregarProducto(producto1);

        Producto producto2 = new Producto(2, "Leche Entera 1L", LocalDate.of(2026, 12, 15), 8);
        producto2.registrarProducto();
        producto2.setCategoria(categoriaLacteos);
        proveedor1.agregarProducto(producto2);

        System.out.println("\n### 4. Registro de Movimientos (entradas y salidas) ###");
        Movimiento movimiento1 = new Movimiento(1, "Entrada", 20, LocalDate.now(), producto1);
        movimiento1.registrarEntrada();

        Movimiento movimiento2 = new Movimiento(2, "Salida", 5, LocalDate.now(), producto1);
        movimiento2.registrarSalida();

        Movimiento movimiento3 = new Movimiento(3, "Salida", 3, LocalDate.now(), producto2);
        movimiento3.registrarSalida();

        System.out.println("\n### 5. Filtrado de productos por categoria ###");
        List<Producto> todosLosProductos = new ArrayList<>();
        todosLosProductos.add(producto1);
        todosLosProductos.add(producto2);
        categoriaGranos.filtrarProductos(todosLosProductos);

        System.out.println("\n### 6. Reporte y alerta de Inventario ###");
        Inventario inventario = new Inventario(1, LocalDate.now());
        inventario.generarReporteMensual(todosLosProductos);
        inventario.generarAlertaBajoStock(todosLosProductos, 10);

        System.out.println("\n### 7. Edicion y eliminacion ###");
        producto2.editarProducto("Leche Deslactosada 1L", LocalDate.of(2026, 12, 31), producto2.getStock());
        proveedor1.editarProveedor("Distribuidora La Economia S.A.S.", "Juan Perez",
                "3001234567", "Calle 10 # 5-20");
        producto2.eliminarProducto();
        proveedor1.eliminarProveedor();
    }
}