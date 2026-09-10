package com.model;

public class Proveedor {

    // Atributos
    private int ID_Proveedor;
    private String nombre;
    private String contacto;
    private String telefono;
    private String direccion;

    // Constructor vacío
    public Proveedor() {
    }

    // Constructor sin id
    public Proveedor(String nombre, String contacto, String telefono, String direccion) {
        this.nombre = nombre;
        this.contacto = contacto;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    // Constructor con todos los atributos
    public Proveedor(int ID_Proveedor, String nombre, String contacto, String telefono, String direccion) {
        this.ID_Proveedor = ID_Proveedor;
        this.nombre = nombre;
        this.contacto = contacto;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    public int getID_Proveedor() {
        return ID_Proveedor;
    }

    public void setID_Proveedor(int ID_Proveedor) {
        this.ID_Proveedor = ID_Proveedor;
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

    @Override
    public String toString() {
        return "Proveedor{ID_Proveedor=" + ID_Proveedor + ", nombre='" + nombre + "', contacto='" + contacto
                + "', telefono='" + telefono + "', direccion='" + direccion + "'}";
    }
}