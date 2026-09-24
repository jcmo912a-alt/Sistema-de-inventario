package com.inventario.sistema.repository;

import com.inventario.sistema.entity.movimientos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface movimientosRepository extends JpaRepository<movimientos, Integer> {

    List<movimientos> findByTipoMovimiento(String tipoMovimiento);

    List<movimientos> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    List<movimientos> findByProductoIdProducto(Integer idProducto);

    // Historial: primero los más recientes
    List<movimientos> findAllByOrderByFechaDescIdMovimientoDesc();

    // ---- Alcance por usuario (rol USUARIO solo ve lo suyo) ----
    List<movimientos> findByUsuarioIdOrderByFechaDescIdMovimientoDesc(Integer idUsuario);

    // ---- Conteos para los indicadores del dashboard ----
    long countByTipoMovimiento(String tipoMovimiento);

    long countByUsuarioId(Integer idUsuario);

    long countByUsuarioIdAndTipoMovimiento(Integer idUsuario, String tipoMovimiento);
}