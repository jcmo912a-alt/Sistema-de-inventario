package com.inventario.sistema.exception;

/**
 * Excepcion lanzada cuando se busca un Proveedor o Producto por id
 * y este no existe en la base de datos. Se traduce en una respuesta
 * HTTP 404 gracias al GlobalExceptionHandler.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
