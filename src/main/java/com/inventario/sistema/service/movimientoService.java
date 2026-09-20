package com.inventario.sistema.service;

import com.inventario.sistema.entity.movimientos;
import com.inventario.sistema.entity.Producto;
import com.inventario.sistema.entity.Usuario;
import com.inventario.sistema.exception.RecursoNoEncontradoException;
import com.inventario.sistema.repository.movimientosRepository;
import com.inventario.sistema.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

/**
 * Lógica de negocio de los movimientos de inventario.
 * Al registrar un movimiento se actualiza el stock del producto en la misma
 * transacción.
 */
@Service
public class movimientoService {

    private final movimientosRepository movimientosRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public movimientoService(movimientosRepository movimientosRepository,
            ProductoRepository productoRepository) {
        this.movimientosRepository = movimientosRepository;
        this.productoRepository = productoRepository;
    }

    /** Historial completo, del más reciente al más antiguo. */
    @Transactional(readOnly = true)
    public List<movimientos> listarTodos() {
        return movimientosRepository.findAllByOrderByFechaDescIdMovimientoDesc();
    }

    /** Movimientos de un producto. */
    @Transactional(readOnly = true)
    public List<movimientos> listarPorProducto(Integer idProducto) {
        return movimientosRepository.findByProductoIdProducto(idProducto);
    }

    /** Un movimiento por ID (404 si no existe). */
    @Transactional(readOnly = true)
    public movimientos obtenerPorId(Integer id) {
        return movimientosRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró el movimiento con id " + id));
    }

    /**
     * Registra un movimiento y actualiza el stock del producto:
     * ENTRADA suma la cantidad; SALIDA la resta y se rechaza (409) si supera el
     * stock.
     */
    @Transactional
    public movimientos registrar(movimientos movimiento, Usuario usuario) {
        if (movimiento.getProducto() == null || movimiento.getProducto().getIdProducto() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto es obligatorio");
        }

        Integer idProducto = movimiento.getProducto().getIdProducto();
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró el producto con id " + idProducto));

        int stockActual = (producto.getStock() == null) ? 0 : producto.getStock();
        int cantidad = movimiento.getCantidad();

        if ("ENTRADA".equals(movimiento.getTipoMovimiento())) {
            producto.setStock(stockActual + cantidad);
        } else {
            if (cantidad > stockActual) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente: disponible " + stockActual + ", solicitado " + cantidad);
            }
            producto.setStock(stockActual - cantidad);
        }
        productoRepository.save(producto);

        // Datos que asigna el servidor
        movimiento.setIdMovimiento(null);
        movimiento.setProducto(producto);
        movimiento.setUsuario(usuario);
        movimiento.setFecha(LocalDate.now());

        return movimientosRepository.save(movimiento);
    }
}