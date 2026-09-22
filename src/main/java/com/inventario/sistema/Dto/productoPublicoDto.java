package com.inventario.sistema.dto;

import java.math.BigDecimal;

/**
 * Datos de un producto que se muestran en la API pública.
 * este no incluye información del proveedor ni el stock exacto.
 */
public record productoPublicoDto(
                Integer idProducto,
                String nombre,
                String descripcion,
                BigDecimal precio,
                boolean disponible,
                String categoria) {
}
