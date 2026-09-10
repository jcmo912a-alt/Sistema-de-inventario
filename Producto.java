import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
 

public class Producto {
 
    // Atributos
    private int idProducto;
    private String nombre;
    private LocalDate fechaVencimiento;
    private int stock;
 
    // Relaciones
    private Proveedor proveedor;           
    private Categoria categoria;           
    private List<Movimiento> movimientos;  
 
    // Constructor
    public Producto(int idProducto, String nombre, LocalDate fechaVencimiento, int stock) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.fechaVencimiento = fechaVencimiento;
        this.stock = stock;
        this.movimientos = new ArrayList<>();
    }
 
    // Métodos de la clase
    public void registrarProducto() {
        System.out.println("Producto registrado: " + nombre + " (ID: " + idProducto + ")");
    }
 
    public void editarProducto(String nombre, LocalDate fechaVencimiento, int stock) {
        this.nombre = nombre;
        this.fechaVencimiento = fechaVencimiento;
        this.stock = stock;
        System.out.println("Producto editado correctamente: " + this.nombre);
    }
 
    public void eliminarProducto() {
        System.out.println("Producto eliminado: " + nombre + " (ID: " + idProducto + ")");
    }
 
    // Método de apoyo a la relación con Movimiento
    public void agregarMovimiento(Movimiento movimiento) {
        movimientos.add(movimiento);
    }
 
    
    public int getIdProducto() {
        return idProducto;
    }
 
    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }
 
    public String getNombre() {
        return nombre;
    }
 
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
 
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
 
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
 
    public int getStock() {
        return stock;
    }
 
    public void setStock(int stock) {
        this.stock = stock;
    }
 
    public Proveedor getProveedor() {
        return proveedor;
    }
 
    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }
 
    public Categoria getCategoria() {
        return categoria;
    }
 
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
 
    public List<Movimiento> getMovimientos() {
        return movimientos;
    }
 
    @Override
    public String toString() {
        return "Producto{idProducto=" + idProducto + ", nombre='" + nombre
                + "', fechaVencimiento=" + fechaVencimiento + ", stock=" + stock + "}";
    }
}