package com.inventario.sistema.controller;

import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.repository.UsuarioRepository;
import com.inventario.sistema.repository.movimientosRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * GET /api/dashboard: indicadores reales de la base de datos según el rol.
 *  - ADMIN: indicadores globales del sistema.
 *  - USUARIO: solo sus propios movimientos y el estado general del inventario.
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    // Un producto con stock menor o igual a este valor se considera "stock bajo"
    private static final int STOCK_BAJO = 10;

    private final UsuarioRepository usuarioRepository;
    private final movimientosRepository movimientosRepository;

    @PersistenceContext
    private EntityManager em;

    public DashboardController(UsuarioRepository usuarioRepository,
            movimientosRepository movimientosRepository) {
        this.usuarioRepository = usuarioRepository;
        this.movimientosRepository = movimientosRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> obtenerDashboard(HttpServletRequest request) {

        // El correo lo deja el JwtFilter ya validado en el request
        String correo = (String) request.getAttribute("correo");
        Usuario actual = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no válido"));

        // Si desactivan la cuenta, el token anterior deja de servir aquí
        if (!Boolean.TRUE.equals(actual.getActivo())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no válido");
        }

        Map<String, Object> indicadores = new LinkedHashMap<>();
        boolean esAdmin = "ADMIN".equals(actual.getRol());

        // Estado del inventario (lectura permitida a ambos roles)
        indicadores.put("totalProductos", contar("select count(p) from Producto p"));
        indicadores.put("productosStockBajo", em
                .createQuery("select count(p) from Producto p where p.stock <= :limite", Long.class)
                .setParameter("limite", STOCK_BAJO)
                .getSingleResult());

        if (esAdmin) {
            // Indicadores globales
            indicadores.put("usuariosActivos", usuarioRepository.countByActivo(true));
            indicadores.put("usuariosInactivos", usuarioRepository.countByActivo(false));
            indicadores.put("proveedoresActivos",
                    contar("select count(v) from Proveedor v where v.estado = true"));
            indicadores.put("totalMovimientos", movimientosRepository.count());
            indicadores.put("movimientosEntrada", movimientosRepository.countByTipoMovimiento("ENTRADA"));
            indicadores.put("movimientosSalida", movimientosRepository.countByTipoMovimiento("SALIDA"));
        } else {
            // Solo lo registrado por este usuario
            Integer id = actual.getId();
            indicadores.put("misMovimientos", movimientosRepository.countByUsuarioId(id));
            indicadores.put("misEntradas",
                    movimientosRepository.countByUsuarioIdAndTipoMovimiento(id, "ENTRADA"));
            indicadores.put("misSalidas",
                    movimientosRepository.countByUsuarioIdAndTipoMovimiento(id, "SALIDA"));
        }

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("nombre", actual.getNombre());
        respuesta.put("rol", actual.getRol());
        respuesta.put("alcance", esAdmin ? "GLOBAL" : "PERSONAL");
        respuesta.put("umbralStockBajo", STOCK_BAJO);
        respuesta.put("indicadores", indicadores);
        return ResponseEntity.ok(respuesta);
    }

    private long contar(String jpql) {
        return em.createQuery(jpql, Long.class).getSingleResult();
    }
}
