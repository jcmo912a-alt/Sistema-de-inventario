package com.inventario.sistema.controller;

import com.inventario.sistema.dto.LoginRequest;
import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.repository.UsuarioRepository;
import com.inventario.sistema.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.inventario.sistema.service.UsuarioService;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

/**
 * Controlador de autenticación: POST /api/auth/login
 */

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository, JwtUtil jwtUtil,
            UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.usuarioService = usuarioService;
    }

    /**
     * Valida correo y contraseña.
     */

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // Validación de campos obligatorios
        if (request.getCorreo() == null || request.getCorreo().isBlank()
                || request.getContrasena() == null || request.getContrasena().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "El correo y la contraseña son obligatorios"));
        }

        // Busca el usuario por correo
        Optional<Usuario> usuario = usuarioRepository.findByCorreo(request.getCorreo());

        // Compara la contraseña enviada con el hash BCrypt guardado en la BD
        if (usuario.isPresent()
                && encoder.matches(request.getContrasena(), usuario.get().getcontrasena())) {

            String token = jwtUtil.generarToken(usuario.get().getCorreo(), usuario.get().getRol());
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Autenticación satisfactoria",
                    "token", token,
                    "tipo", "Bearer",
                    "rol", usuario.get().getRol()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", "Credenciales inválidas"));
    }

    /**
     * POST /api/auth/registro: crea una cuenta nueva (endpoint público).
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {

        // Validación de campos obligatorios
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()
                || usuario.getCorreo() == null || usuario.getCorreo().isBlank()
                || usuario.getcontrasena() == null || usuario.getcontrasena().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Nombre, correo y contraseña son obligatorios"));
        }

        try {
            // El servicio valida el correo duplicado y encripta la contraseña
            usuarioService.guardar(usuario);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("mensaje", e.getReason()));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Cuenta creada correctamente"));
    }
}