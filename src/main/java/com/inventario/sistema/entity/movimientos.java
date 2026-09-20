package com.inventario.sistema.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

/**
 * Movimiento de inventario: una ENTRADA suma stock al producto y una SALIDA lo
 * resta.
 * Funciona como historial: se consulta y se registra, no se edita ni se
 * elimina.
 */
@Entity
@Table(name = "MOVIMIENTO")
public class movimientos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_MOVIMIENTO")
    private Integer idMovimiento;

    @NotBlank(message = "El tipo de movimiento es obligatorio")
    @Pattern(regexp = "ENTRADA|SALIDA", message = "El tipo de movimiento debe ser ENTRADA o SALIDA")
    @Column(name = "TIPO_MOVIMIENTO", nullable = false, length = 20)
    private String tipoMovimiento;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor que cero")
    @Column(name = "CANTIDAD", nullable = false)
    private Integer cantidad;

    // La fecha la asigna el servidor al registrar el movimiento
    @Column(name = "FECHA", nullable = false)
    private LocalDate fecha;

    @NotNull(message = "El producto es obligatorio")
    @ManyToOne
    @JoinColumn(name = "ID_PRODUCTO", nullable = false)
    private Producto producto;

    // El usuario se toma del token JWT, no lo envía el cliente
    @ManyToOne
    @JoinColumn(name = "ID_USUARIOS", nullable = false)
    private Usuario usuario;

    public movimientos() {
    }

    // ---------------- Getters y setters ----------------

    public Integer getIdMovimiento() {
        return idMovimiento;
    }

    public void setIdMovimiento(Integer idMovimiento) {
        this.idMovimiento = idMovimiento;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
