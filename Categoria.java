import java.util.ArrayList;
import java.util.List;
 

public class Categoria {
 
    // Atributos
    private int idCategoria;
    private String nombre;
    private String descripcion;
 
    // Constructor
    public Categoria(int idCategoria, String nombre, String descripcion) {
        this.idCategoria = idCategoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
 
    // Método de la clase
    public List<Producto> filtrarProductos(List<Producto> productos) {
        List<Producto> resultado = new ArrayList<>();
        for (Producto producto : productos) {
            if (producto.getCategoria() != null
                    && producto.getCategoria().getIdCategoria() == this.idCategoria) {
                resultado.add(producto);
            }
        }
        System.out.println("Productos filtrados en categoria '" + nombre + "': " + resultado.size());
        return resultado;
    }
 
    // (camelCase)
    public int getIdCategoria() {
        return idCategoria;
    }
 
    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }
 
    public String getNombre() {
        return nombre;
    }
 
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
 
    public String getDescripcion() {
        return descripcion;
    }
 
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
 
    @Override
    public String toString() {
        return "Categoria{idCategoria=" + idCategoria + ", nombre='" + nombre + "', descripcion='" + descripcion + "'}";
    }
}