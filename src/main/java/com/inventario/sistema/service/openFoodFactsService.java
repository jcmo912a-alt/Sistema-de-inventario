package com.inventario.sistema.service;

import com.inventario.sistema.dto.openFoodFactsRespuesta;
import com.inventario.sistema.dto.productoExternodto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/**
 * Servicio que consume la API pública externa Open Food Facts para consultar
 * información de un producto alimenticio a partir de su código de barras.
 *
 * Flujo: Controller -> este servicio -> Open Food Facts -> DTO propio.
 *
 * Errores controlados:
 * - 400: el código de barras no tiene un formato válido.
 * - 404: Open Food Facts no conoce ese código.
 * - 502: la API externa no respondió o devolvió un error.
 */
@Service
public class openFoodFactsService {

    // Solo pedimos los campos que necesitamos (respuesta más liviana)
    private static final String CAMPOS = "product_name,brands,quantity,categories,image_front_url,nutriscore_grade";

    private final RestClient openFoodFactsClient;

    public openFoodFactsService(RestClient openFoodFactsClient) {
        this.openFoodFactsClient = openFoodFactsClient;
    }

    /**
     * Consulta un producto por código de barras (EAN-8, UPC-12, EAN-13 o GTIN-14).
     *
     * @param codigoBarras solo dígitos, entre 8 y 14 caracteres
     * @return datos del producto en el formato propio del sistema
     */
    public productoExternodto buscarPorCodigoBarras(String codigoBarras) {

        // Validación: evita enviar a la API externa valores que no son códigos de
        // barras
        if (codigoBarras == null || !codigoBarras.matches("\\d{8,14}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El código de barras debe tener entre 8 y 14 dígitos numéricos");
        }

        openFoodFactsRespuesta respuesta;
        try {
            // GET https://world.openfoodfacts.org/api/v2/product/{codigo}?fields=...
            respuesta = openFoodFactsClient.get()
                    .uri(uri -> uri.path("/api/v2/product/{codigo}")
                            .queryParam("fields", CAMPOS)
                            .build(codigoBarras))
                    .retrieve()
                    .body(openFoodFactsRespuesta.class);
        } catch (HttpClientErrorException.NotFound e) {
            // La API externa respondió 404: el producto no existe en su base de datos
            throw noEncontrado(codigoBarras);
        } catch (RestClientException e) {
            // Sin conexión, tiempo de espera agotado o error 5xx de la API externa
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "No fue posible comunicarse con la API externa Open Food Facts");
        }

        // status = 0 (o producto vacío) significa "no encontrado" según la API
        if (respuesta == null || respuesta.status() != 1 || respuesta.product() == null) {
            throw noEncontrado(codigoBarras);
        }

        // Se convierte la respuesta externa en el DTO propio del sistema
        openFoodFactsRespuesta.Producto p = respuesta.product();
        return new productoExternodto(codigoBarras, p.nombre(), p.marca(), p.cantidad(),
                p.categorias(), p.imagenUrl(), p.nutriscore());
    }

    private ResponseStatusException noEncontrado(String codigoBarras) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Producto con código de barras " + codigoBarras + " no encontrado en Open Food Facts");
    }
}
