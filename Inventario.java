import java.time.LocalDate;
import java.util.List;
 

public class Inventario {
 
    // Atributos
    private int idInventario;
    private LocalDate fechaActualizacion;
 
    // Constructor
    public Inventario(int idInventario, LocalDate fechaActualizacion) {
        this.idInventario = idInventario;
        this.fechaActualizacion = fechaActualizacion;
    }
 
    // Métodos de la clase
    public void actualizarInventario(List<Producto> productos) {
        System.out.println("=== Actualización de inventario (" + fechaActualizacion + ") ===");
        for (Producto producto : productos) {
            System.out.println(" - " + producto.getNombre() + " | stock: " + producto.getStock());
        }
    }
    public void generarReporteMensual(List<Producto> productos) {
        System.out.println("=== Reporte mensual de inventario (" + fechaActualizacion + ") ===");
        for (Producto producto : productos) {
            System.out.println(" - " + producto.getNombre() + " | stock: " + producto.getStock());
        }
    }
 
    public void generarAlertaBajoStock(List<Producto> productos, int umbral) {
        System.out.println("=== Alerta de bajo stock (umbral: " + umbral + ") ===");
        for (Producto producto : productos) {
            if (producto.getStock() < umbral) {
                System.out.println(" ¡Alerta! " + producto.getNombre() + " tiene stock bajo: " + producto.getStock());
            }
        }
    }
 
    // Getters y Setters (camelCase)
    public int getIdInventario() {
        return idInventario;
    }
 
    public void setIdInventario(int idInventario) {
        this.idInventario = idInventario;
    }
 
    public LocalDate getFechaActualizacion() {
        return fechaActualizacion;
    }
 
    public void setFechaActualizacion(LocalDate fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
 
    @Override
    public String toString() {
        return "Inventario{idInventario=" + idInventario + ", fechaActualizacion=" + fechaActualizacion + "}";
    }
}