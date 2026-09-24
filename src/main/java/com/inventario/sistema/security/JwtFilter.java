package com.inventario.sistema.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro JWT: exige token válido en los endpoints protegidos y aplica
 * permisos por rol en el servidor (ADMIN / USUARIO).
 *
 * Reglas:
 * - /api/usuarios/** -> solo ADMIN
 * - /api/proveedores/** -> lectura (GET) cualquier rol; POST/PUT/DELETE solo
 * ADMIN
 * - /api/productos/** -> cualquier rol autenticado; DELETE solo ADMIN
 * - /api/movimientos/** -> cualquier rol autenticado
 * - /api/dashboard/** -> cualquier rol autenticado (el contenido cambia según
 * el rol)
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        boolean protegida = uri.startsWith("/api/usuarios")
                || uri.startsWith("/api/movimientos")
                || uri.startsWith("/api/productos")
                || uri.startsWith("/api/proveedores")
                || uri.startsWith("/api/dashboard");
        return !protegida || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtil.validarToken(token)) {
                String rol = jwtUtil.extractRol(token);
                request.setAttribute("rol", rol);
                request.setAttribute("correo", jwtUtil.extractUsername(token));

                if (requiereAdmin(request) && !"ADMIN".equals(rol)) {
                    responder(response, HttpServletResponse.SC_FORBIDDEN,
                            "No tiene permisos suficientes");
                    return;
                }

                // El controlador podrá leer el rol sin volver a procesar el token
                chain.doFilter(request, response);
                return;
            }
        }

        responder(response, HttpServletResponse.SC_UNAUTHORIZED,
                "Token ausente, inválido o vencido");
    }

    private boolean requiereAdmin(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String metodo = request.getMethod();
        boolean soloLectura = "GET".equalsIgnoreCase(metodo);

        if (uri.startsWith("/api/usuarios")) {
            return true;
        }
        if (uri.startsWith("/api/proveedores")) {
            return !soloLectura;
        }
        if (uri.startsWith("/api/productos")) {
            return "DELETE".equalsIgnoreCase(metodo);
        }
        return false;
    }

    private void responder(HttpServletResponse response, int estado, String mensaje)
            throws IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setStatus(estado);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"mensaje\":\"" + mensaje + "\"}");
    }
}