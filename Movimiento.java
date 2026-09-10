import java.time.LocalDate;
 

public class Movimiento {
 
    // Atributos
    private int idMovimiento;
    private String tipoMovimiento;
    private int cantidad;
    private LocalDate fecha;
 
    // Relaciones
    private Producto producto;
 
    // Constructor
    public Movimiento(int idMovimiento, String tipoMovimiento, int cantidad, LocalDate fecha, Producto producto) {
        this.tipoMovimiento = tipoMovimiento;
        this.cantidad = cantidad;
        this.fecha = fecha;
        this.producto = producto;
        producto.agregarMovimiento(this);
    }
 
    // Métodos de la clase
    public void registrarEntrada() {
        this.tipoMovimiento = "Entrada";
        producto.setStock(producto.getStock() + cantidad);
        System.out.println("Entrada registrada: +" + cantidad + " unidades de " + producto.getNombre()
                + " (stock actual: " + producto.getStock() + ")");
    }
 
    public void registrarSalida() {
        this.tipoMovimiento = "Salida";
        producto.setStock(producto.getStock() - cantidad);
        System.out.println("Salida registrada: -" + cantidad + " unidades de " + producto.getNombre()
                + " (stock actual: " + producto.getStock() + ")");
    }
 
    //(camelCase)
    public int getIdMovimiento() {
        return idMovimiento;
    }
 
    public void setIdMovimiento(int idMovimiento) {
        this.idMovimiento = idMovimiento;
    }
 
    public String getTipoMovimiento() {
        return tipoMovimiento;
    }
 
    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }
 
    public int getCantidad() {
        return cantidad;
    }
 
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
 
    public LocalDate getFecha() {
        return fecha;
    }
 
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
 
    public Producto getProducto() {
        return producto;
    }
 
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
 
    @Override
    public String toString() {
        return "Movimiento{idMovimiento=" + idMovimiento + ", tipoMovimiento='" + tipoMovimiento
                + "', cantidad=" + cantidad + ", fecha=" + fecha + "}";
    }
}
