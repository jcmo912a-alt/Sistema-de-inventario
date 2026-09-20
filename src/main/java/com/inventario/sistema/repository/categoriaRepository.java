package com.inventario.sistema.repository;

import com.inventario.sistema.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface categoriaRepository extends JpaRepository<Categoria, Integer> {
}