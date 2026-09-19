package com.inventario.sistema.controller;

import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST del módulo Usuario: CRUD en /api/usuarios.
 * Todos los endpoints exigen token JWT (lo valida JwtFilter).
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /** GET /api/usuarios: lista todos los usuarios. */
    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    /** GET /api/usuarios/{id}: consulta un usuario por ID (404 si no existe). */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Usuario no encontrado con id " + id)));
    }

    /** POST /api/usuarios: registra un usuario (201 Created). */
    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.guardar(usuario));
    }

    /** PUT /api/usuarios/{id}: actualiza un usuario (404 si no existe). */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Usuario datos) {
        if (usuarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Usuario no encontrado con id " + id));
        }
        return ResponseEntity.ok(usuarioService.actualizar(id, datos));
    }

    /** DELETE /api/usuarios/{id}: elimina un usuario (204 No Content). */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (usuarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Usuario no encontrado con id " + id));
        }
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}