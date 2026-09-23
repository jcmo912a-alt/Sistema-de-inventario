package com.inventario.sistema.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que exige un token JWT válido en los endpoints /api/usuarios/**.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // Filtra /api/usuarios, /api/movimientos, /api/productos y /api/proveedores;
    // deja pasar el preflight de CORS (OPTIONS)
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        boolean protegida = uri.startsWith("/api/usuarios")
                || uri.startsWith("/api/movimientos")
                || uri.startsWith("/api/productos")
                || uri.startsWith("/api/proveedores");
        return !protegida || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String uri = request.getRequestURI();

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtil.validarToken(token)) {
                // Rutas exclusivas de ADMIN (ajusta según lo que definas)
                boolean requiereAdmin = uri.startsWith("/api/usuarios");

                if (requiereAdmin && !"ADMIN".equals(jwtUtil.extractRol(token))) {
                    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"mensaje\":\"No tiene permisos suficientes\"}");
                    return;
                }

                chain.doFilter(request, response); // token válido y con permisos: continúa
                return;
            }
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"mensaje\":\"Token ausente, inválido o vencido\"}");
    }
}