package com.inventario.sistema.controller;

import com.inventario.sistema.Dto.LoginRequest;
import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.repository.UsuarioRepository;
import com.inventario.sistema.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Valida correo y contraseña.
     * Correcto -> 200 con mensaje y token JWT.
     * Incorrecto -> 401 con mensaje de autenticación fallida.
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

            String token = jwtUtil.generarToken(usuario.get().getCorreo());
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Autenticación satisfactoria",
                    "token", token,
                    "tipo", "Bearer"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", "Error en la autenticación: correo o contraseña incorrectos"));
    }
}
