package com.inventario.sistema.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Mapeo de la respuesta JSON de Open Food Facts (GET /api/v2/product/{codigo}).
 * Solo se declaran los campos que el sistema necesita; el resto se ignora.
 *
 * Ejemplo simplificado de la respuesta externa:
 * {
 * "code": "3017624010701",
 * "status": 1,
 * "product": { "product_name": "...", "brands": "...", ... }
 * }
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record openFoodFactsRespuesta(
        String code,
        int status, // 1 = producto encontrado, 0 = no encontrado
        Producto product) {

    /** Datos del producto tal como los entrega Open Food Facts. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Producto(
            @JsonProperty("product_name") String nombre,
            @JsonProperty("brands") String marca,
            @JsonProperty("quantity") String cantidad,
            @JsonProperty("categories") String categorias,
            @JsonProperty("image_url") String imagenUrl,
            @JsonProperty("nutriscore_grade") String nutriscore) {
    }
}
