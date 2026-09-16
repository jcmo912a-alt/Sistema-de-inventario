package com.inventario.sistema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal del proyecto.
 * Punto de entrada de la aplicacion Spring Boot: al ejecutarse levanta
 * el servidor embebido (Tomcat) en el puerto configurado en
 * application.properties y expone los endpoints REST de los modulos
 * Proveedor y Producto.
 */
@SpringBootApplication
public class SistemaInventarioApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaInventarioApplication.class, args);
    }

}
