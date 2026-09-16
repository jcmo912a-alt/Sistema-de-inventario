package com.inventario.sistema.repository;

import com.inventario.sistema.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {

    // Metodo derivado: Spring Data JPA genera la consulta automaticamente
    // a partir del nombre del metodo (busqueda por nombre exacto)
    Proveedor findByNombre(String nombre);
}
