package com.config; // Define el paquete donde se encuentra la clase de conexión

import java.sql.Connection; // Importa la clase Connection para representar la conexión a la base de datos
import java.sql.DriverManager; // Importa DriverManager para crear la conexión con MySQL
import java.sql.SQLException; // Importa SQLException para manejar errores relacionados con SQL

public class ConexionBD { // Define la clase responsable de conectar Java con la base de datos

    private static final String URL = "jdbc:mysql://localhost:3306/mydb"; // URL de conexión a la base de datos MySQL

    private static final String USUARIO = "root"; // Usuario de la base de datos

    private static final String CLAVE = "*****************"; // Contraseña de la base de datos.

    public static Connection obtenerConexion() { // Método que retorna una conexión a la base de datos

        Connection conexion = null; // Variable donde se almacenará la conexión

        try { // Bloque para intentar ejecutar la conexión

            conexion = DriverManager.getConnection(URL, USUARIO, CLAVE); // Establece la conexión con MySQL

        } catch (SQLException e) { // Captura errores si la conexión falla

            System.out.println("Error al conectar con la base de datos: " + e.getMessage()); // Muestra el error en
                                                                                             // consola
        }

        return conexion; // Retorna la conexión creada o null si falló
    }
}
