package com.inventario.sistema.controller;

import com.inventario.sistema.dto.productoExternodto;
import com.inventario.sistema.service.openFoodFactsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Servicio web que integra la API pública externa Open Food Facts.
 * Permite consultar los datos de un producto alimenticio por su código de
 * barras, por ejemplo para autocompletar el formulario de Producto.
 *
 * GET /api/externo/productos/{codigoBarras}
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/externo/productos")
public class productoExternoController {

    private final openFoodFactsService openFoodFactsService;

    public productoExternoController(openFoodFactsService openFoodFactsService) {
        this.openFoodFactsService = openFoodFactsService;
    }

    /**
     * 200 con los datos del producto, 400 código inválido, 404 no existe, 502 API
     * caída.
     */
    @GetMapping("/{codigoBarras}")
    public ResponseEntity<productoExternodto> consultarPorCodigoBarras(@PathVariable String codigoBarras) {
        return ResponseEntity.ok(openFoodFactsService.buscarPorCodigoBarras(codigoBarras));
    }
}
