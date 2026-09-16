package com.inventario.sistema.repository;

import com.inventario.sistema.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio del modulo Producto.
 * Incluye operaciones CRUD heredadas de JpaRepository y consultas
 * derivadas utiles para el sistema de inventario (buscar por proveedor,
 * por categoria o por productos con stock bajo).
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    // Todos los productos asociados a un proveedor especifico
    List<Producto> findByProveedorIdProveedor(Integer idProveedor);

    // Todos los productos asociados a una categoria especifica
    List<Producto> findByCategoriaIdCategoria(Integer idCategoria);

    // Productos cuyo stock esta por debajo de una cantidad dada
    // (util para alertas de reabastecimiento del inventario)
    List<Producto> findByStockLessThan(Integer cantidad);
}
