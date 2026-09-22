package com.inventario.sistema.dto;

/**
 * Datos de un producto consultado en la API externa (Open Food Facts) que el
 * sistema entrega a sus clientes. Es un formato propio: el cliente no depende
 * de la estructura de la API externa.
 */

public record productoExternodto(
                String codigoBarras,
                String nombre,
                String marca,
                String cantidad,
                String categorias,
                String imagenUrl,
                String nutriscore) {
}
