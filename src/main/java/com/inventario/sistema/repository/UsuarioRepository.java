package com.inventario.sistema.repository;

import com.inventario.sistema.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    // Indicador del dashboard: usuarios activos / inactivos
    long countByActivo(Boolean activo);
}