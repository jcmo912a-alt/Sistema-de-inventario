package com.inventario.sistema.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilidad para generar y validar tokens JWT.
 */
@Component
public class JwtUtil {

    // Clave secreta de firma, leída de la variable de entorno JWT_SECRET (mínimo 32
    // caracteres).
    // El valor después de ":" solo se usa al correr en local, cuando la variable no
    // existe.
    private final SecretKey clave;

    // Tiempo de vida del token: 1 hora
    private static final long EXPIRACION_MS = 1000 * 60 * 60;

    public JwtUtil(@Value("${JWT_SECRET:clave-solo-para-desarrollo-local-12345678}") String secreto) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    /** Genera un token JWT para el correo indicado, incluyendo el rol. */
    public String generarToken(String correo, String rol) {
        return Jwts.builder()
                .subject(correo)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRACION_MS))
                .signWith(clave)
                .compact();
    }

    /** Devuelve el rol guardado dentro del token. */
    public String extractRol(String token) {
        return Jwts.parser().verifyWith(clave).build()
                .parseSignedClaims(token).getPayload().get("rol", String.class);
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