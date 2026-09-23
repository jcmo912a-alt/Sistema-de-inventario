package com.inventario.sistema.controller;

import com.inventario.sistema.dto.productoPublicoDto;
import com.inventario.sistema.entity.Categoria;
import com.inventario.sistema.entity.Producto;
import com.inventario.sistema.repository.CategoriaRepository;
import com.inventario.sistema.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * API pública del Sistema de Gestión de Inventario.
 * Solo lectura y sin autenticación: no requiere token JWT.
 */
@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*") // API pública: cualquier origen puede consultarla
@Transactional(readOnly = true)
public class publicApiController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public publicApiController(ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    /** Convierte la entidad en el DTO público (oculta proveedor y stock exacto). */
    private productoPublicoDto aDto(Producto p) {
        String categoria = (p.getCategoria() != null) ? p.getCategoria().getNombre() : null;
        String descripcion = (p.getCategoria() != null) ? p.getCategoria().getDescripcion() : null;
        boolean disponible = p.getStock() != null && p.getStock() > 0;
        return new productoPublicoDto(p.getIdProducto(), p.getNombre(), descripcion,
                p.getPrecio(), disponible, categoria);
    }

    /** GET /api/public/info: información general de la API. */
    @GetMapping("/info")
    public Map<String, Object> info() {
        return Map.of(
                "nombre", "API pública - Sistema de Gestión de Inventario",
                "version", "1.0",
                "estado", "activa",
                "endpoints", List.of(
                        "GET /api/public/info",
                        "GET /api/public/categorias",
                        "GET /api/public/productos",
                        "GET /api/public/productos?nombre={texto}",
                        "GET /api/public/productos?categoria={texto}",
                        "GET /api/public/productos/{id}",
                        "POST /api/auth/registro",
                        "POST /api/auth/login"));
    }

    /** GET /api/public/categorias: tipos de alimentos disponibles. */
    @GetMapping("/categorias")
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    /**
     * GET /api/public/productos: catálogo; filtros opcionales ?nombre= y
     * ?categoria=.
     */
    @GetMapping("/productos")
    public List<productoPublicoDto> listarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String categoria) {

        String txtNombre = (nombre == null) ? "" : nombre.trim().toLowerCase();
        String txtCategoria = (categoria == null) ? "" : categoria.trim().toLowerCase();

        return productoRepository.findAll().stream()
                .filter(p -> p.getNombre() != null && p.getNombre().toLowerCase().contains(txtNombre))
                .filter(p -> txtCategoria.isEmpty()
                        || (p.getCategoria() != null && p.getCategoria().getNombre() != null
                                && p.getCategoria().getNombre().toLowerCase().contains(txtCategoria)))
                .map(this::aDto)
                .toList();
    }

    /** GET /api/public/productos/{id}: un producto (404 si no existe). */
    @GetMapping("/productos/{id}")
    public ResponseEntity<?> productoPorId(@PathVariable Integer id) {
        return productoRepository.findById(id)
                .<ResponseEntity<?>>map(p -> ResponseEntity.ok(aDto(p)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Producto no encontrado con id " + id)));
    }
}