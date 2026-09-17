package com.inventario.sistema.service;

import com.inventario.sistema.entity.Producto;
import com.inventario.sistema.exception.RecursoNoEncontradoException;
import com.inventario.sistema.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Autowired
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // listar todos los productos
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // buscar un producto por id; si no se encuentra, lanza una excepción
    public Producto buscarPorId(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontro el producto con id " + id));
    }

    public List<Producto> listarPorProveedor(Integer idProveedor) {
        return productoRepository.findByProveedorIdProveedor(idProveedor);
    }

    public List<Producto> listarPorCategoria(Integer idCategoria) {
        return productoRepository.findByCategoriaIdCategoria(idCategoria);
    }

    public List<Producto> listarConStockBajo(Integer cantidad) {
        return productoRepository.findByStockLessThan(cantidad);
    }

    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto actualizar(Integer id, Producto datosActualizados) {
        Producto productoExistente = buscarPorId(id);

        productoExistente.setNombre(datosActualizados.getNombre());
        productoExistente.setDescripcion(datosActualizados.getDescripcion());
        productoExistente.setPrecio(datosActualizados.getPrecio());
        productoExistente.setStock(datosActualizados.getStock());
        productoExistente.setProveedor(datosActualizados.getProveedor());
        productoExistente.setCategoria(datosActualizados.getCategoria());

        return productoRepository.save(productoExistente);
    }

    public void eliminar(Integer id) {
        Producto producto = buscarPorId(id);
        productoRepository.delete(producto);
    }
}
