package com.inventario.sistema.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilidad para generar y validar tokens JWT.
 */
@Component
public class JwtUtil {

    // Clave secreta de firma (mínimo 32 caracteres)
    private final SecretKey clave = Keys.hmacShaKeyFor(
            "clave-secreta-del-proyecto-inventario-2026".getBytes(StandardCharsets.UTF_8));

    // Tiempo de vida del token: 1 hora
    private static final long EXPIRACION_MS = 1000 * 60 * 60;

    /** Genera un token JWT para el correo indicado. */
    public String generarToken(String correo) {
        return Jwts.builder()
                .subject(correo)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRACION_MS))
                .signWith(clave)
                .compact();
    }

    /** Devuelve el correo (subject) guardado dentro del token. */
    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(clave).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    /** Devuelve true si el token es válido y no ha vencido. */
    public boolean validarToken(String token) {
        try {
            Jwts.parser().verifyWith(clave).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}