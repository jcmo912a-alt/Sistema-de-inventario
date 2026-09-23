package com.inventario.sistema.service;

import com.inventario.sistema.entity.Categoria;
import com.inventario.sistema.exception.RecursoNoEncontradoException;
import com.inventario.sistema.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Listar todas las categorías (solo lectura, no hay POST/PUT/DELETE)
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // Buscar una categoría por id; si no se encuentra, lanza una excepción
    public Categoria buscarPorId(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontro la categoria con id " + id));
    }
}