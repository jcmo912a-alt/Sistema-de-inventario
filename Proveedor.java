import java.util.ArrayList;
import java.util.List;
 

public class Proveedor {
 
    // Atributos
    private int idProveedor;
    private String nombre;
    private String contacto;
    private String telefono;
    private String direccion;
 
    //Relaciones
    private List<Producto> productos;
 
    // Constructor
    public Proveedor(int idProveedor, String nombre, String contacto, String telefono, String direccion) {
        this.idProveedor = idProveedor;
        this.nombre = nombre;
        this.contacto = contacto;
        this.telefono = telefono;
        this.direccion = direccion;
        this.productos = new ArrayList<>();
    }
 
    // Métodos 
    public void registrarProveedor() {
        System.out.println("Proveedor registrado: " + nombre + " (ID: " + idProveedor + ")");
    }
 
    public void editarProveedor(String nombre, String contacto, String telefono, String direccion) {
        this.nombre = nombre;
        this.contacto = contacto;
        this.telefono = telefono;
        this.direccion = direccion;
        System.out.println("Proveedor editado correctamente: " + this.nombre);
    }
 
    public void eliminarProveedor() {
        System.out.println("Proveedor eliminado: " + nombre + " (ID: " + idProveedor + ")");
    }
 
//metodo de apoyo a la relación con Producto
    public void agregarProducto(Producto producto) {
        productos.add(producto);
        producto.setProveedor(this);
    }
 
    
    public int getIdProveedor() {
        return idProveedor;
    }
 
    public void setIdProveedor(int idProveedor) {
        this.idProveedor = idProveedor;
    }
 
    public String getNombre() {
        return nombre;
    }
 
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
 
    public String getContacto() {
        return contacto;
    }
 
    public void setContacto(String contacto) {
        this.contacto = contacto;
    }
 
    public String getTelefono() {
        return telefono;
    }
 
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
 
    public String getDireccion() {
        return direccion;
    }
 
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
 
    public List<Producto> getProductos() {
        return productos;
    }
 
    @Override
    public String toString() {
        return "Proveedor{idProveedor=" + idProveedor + ", nombre='" + nombre + "', contacto='" + contacto
                + "', telefono='" + telefono + "', direccion='" + direccion + "'}";
    }
}