package com.inventario.sistema.controller;

import com.inventario.sistema.entity.movimientos;
import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.repository.UsuarioRepository;
import com.inventario.sistema.security.JwtUtil;
import com.inventario.sistema.service.movimientoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Endpoints de movimientos de inventario (requieren token JWT).
 * Solo consulta y registro: el historial no se edita ni se elimina.
 */
@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "http://localhost:5173")
public class movimientosController {

    private final movimientoService movimientoService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public movimientosController(movimientoService movimientoService,
            JwtUtil jwtUtil,
            UsuarioRepository usuarioRepository) {
        this.movimientoService = movimientoService;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    /** GET /api/movimientos: historial; con ?idProducto= filtra por producto. */
    @GetMapping
    public ResponseEntity<?> listarMovimientos(@RequestParam(required = false) Integer idProducto) {
        if (idProducto != null) {
            return ResponseEntity.ok(movimientoService.listarPorProducto(idProducto));
        }
        return ResponseEntity.ok(movimientoService.listarTodos());
    }

    /** GET /api/movimientos/{id}: un movimiento (404 si no existe). */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerMovimiento(@PathVariable Integer id) {
        return ResponseEntity.ok(movimientoService.obtenerPorId(id));
    }

    /** POST /api/movimientos: registra el movimiento y actualiza el stock (201). */
    @PostMapping
    public ResponseEntity<?> registrarMovimiento(
            @Valid @RequestBody movimientos movimiento,
            @RequestHeader("Authorization") String authorization) {

        // El usuario que registra se obtiene del token JWT
        String correo = jwtUtil.extractUsername(authorization.substring(7));
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no válido"));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(movimientoService.registrar(movimiento, usuario));
    }
}