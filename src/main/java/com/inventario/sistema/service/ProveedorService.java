package com.inventario.sistema.service;

import com.inventario.sistema.entity.Proveedor;
import com.inventario.sistema.exception.RecursoNoEncontradoException;
import com.inventario.sistema.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    @Autowired
    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    // Listar todos los proveedores registrados, incluso inactivos,
    // para que el filtro del frontend pueda mostrarlos sin perder el estado real.
    public List<Proveedor> listarTodos() {
        return proveedorRepository.findAllByOrderByIdProveedorAsc();
    }

    // Buscar un proveedor por id; si no se encuentra, lanza una excepción
    public Proveedor buscarPorId(Integer id) {
        return proveedorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontro el proveedor con id " + id));
    }

    // Crear un nuevo proveedor
    public Proveedor guardar(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    // Actualizar un proveedor existente
    public Proveedor actualizar(Integer id, Proveedor datosActualizados) {
        Proveedor proveedorExistente = buscarPorId(id);

        proveedorExistente.setNombre(datosActualizados.getNombre());
        proveedorExistente.setTelefono(datosActualizados.getTelefono());
        proveedorExistente.setContacto(datosActualizados.getContacto());
        proveedorExistente.setDireccion(datosActualizados.getDireccion());
        proveedorExistente.setEstado(datosActualizados.getEstado());

        return proveedorRepository.save(proveedorExistente);
    }

    // Eliminar un proveedor por id
    public void eliminar(Integer id) {
        Proveedor proveedor = buscarPorId(id);
        proveedorRepository.delete(proveedor);
    }
}
