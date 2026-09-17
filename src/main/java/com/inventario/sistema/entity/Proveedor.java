package com.inventario.sistema.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "PROVEEDOR")
@SQLDelete(sql = "UPDATE PROVEEDOR SET ESTADO = false WHERE ID_PROVEEDOR = ?")
@SQLRestriction("ESTADO = true")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PROVEEDOR")
    private Integer idProveedor;

    @NotBlank(message = "El nombre del proveedor es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;
    @NotBlank(message = "El Numero de telefono es obligatorio")
    @Pattern(regexp = "^\\+?[1-9]\\d{7,10}$", message = "El número de teléfono no es válido")
    @Size(max = 20)
    @Column(name = "TELEFONO", length = 20)
    private String telefono;

    @NotBlank(message = "El contacto es obligatorio")
    @Size(max = 100, message = "El contacto no puede superar 100 caracteres")
    @Email(message = "El contacto debe ser un correo electrónico válido")
    @Column(name = "CONTACTO", length = 100)
    private String contacto;

    @Size(max = 150)
    @Column(name = "DIRECCION", length = 150)
    private String direccion;

    // Evita que el campo booleano bruto se muestre en el JSON
    @JsonIgnore
    @Column(name = "ESTADO", nullable = false)
    private Boolean estado = true;

    public Proveedor() {
    }

    public Proveedor(Integer idProveedor, String nombre, String telefono, String contacto, String direccion,
            Boolean estado) {
        this.idProveedor = idProveedor;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contacto = contacto;
        this.direccion = direccion;
        this.estado = (estado != null) ? estado : true;
    }

    /**
     * Traduce el estado booleano a texto descriptivo para la respuesta JSON.
     */
    @JsonProperty("estado")
    public String getEstadoTexto() {
        return (this.estado != null && this.estado) ? "activo" : "inactivo";
    }

    // ---------------- Getters y setters regulares ----------------

    public Integer getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Integer idProveedor) {
        this.idProveedor = idProveedor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}