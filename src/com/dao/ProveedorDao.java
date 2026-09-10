package com.dao; // Define el paquete DAO

import com.config.ConexionBD; // Importa la clase de conexión
import com.model.Proveedor; // Importa la clase Proveedor

import java.sql.Connection; // Importa Connection para conectarse a la BD
import java.sql.PreparedStatement; // Importa PreparedStatement para consultas seguras
import java.sql.ResultSet; // Importa ResultSet para manejar resultados de consultas
import java.sql.SQLException; // Importa SQLException para manejar errores SQL
import java.util.ArrayList; // Importa ArrayList para almacenar Proveedores
import java.util.List; // Importa List para retornar colecciones

public class ProveedorDao { // Clase que contiene las operaciones CRUD de Proveedor

    public void insertarProveedor(Proveedor proveedor) { // Método para insertar un Proveedor

        String sql = "INSERT INTO Proveedor (nombre, telefono, contacto, direccion) VALUES (?, ?, ?, ?)"; // Consulta
                                                                                                          // SQL
                                                                                                          // parametrizada

        try (Connection conexion = ConexionBD.obtenerConexion(); // Abre conexión a la BD
                PreparedStatement statement = conexion.prepareStatement(sql)) { // Prepara la consulta SQL

            statement.setString(1, proveedor.getNombre()); // Asigna nombres
            statement.setString(2, proveedor.getTelefono()); // Asigna teléfono
            statement.setString(3, proveedor.getContacto()); // Asigna correo electrónico
            statement.setString(4, proveedor.getDireccion()); // Asigna dirección

            statement.executeUpdate(); // Ejecuta la inserción

            System.out.println("Proveedor registrado correctamente."); // Mensaje de éxito

        } catch (SQLException e) { // Captura errores SQL

            System.out.println("Error al insertar Proveedor: " + e.getMessage()); // Muestra error
        }
    }

    public List<Proveedor> listarProveedores() { // Método para consultar todos los Proveedores

        List<Proveedor> Proveedores = new ArrayList<>(); // Crea lista para almacenar Proveedores

        String sql = "SELECT * FROM Proveedor"; // Consulta SQL para listar Proveedores

        try (Connection conexion = ConexionBD.obtenerConexion(); // Abre conexión
                PreparedStatement statement = conexion.prepareStatement(sql); // Prepara consulta
                ResultSet resultSet = statement.executeQuery()) { // Ejecuta consulta y obtiene resultados

            while (resultSet.next()) { // Recorre cada fila encontrada

                Proveedor proveedor = new Proveedor( // Crea objeto Proveedor con los datos de la BD
                        resultSet.getInt("ID_Proveedor"), // Obtiene id
                        resultSet.getString("nombre"), // Obtiene nombre
                        resultSet.getString("contacto"), // Obtiene contacto
                        resultSet.getString("telefono"), // Obtiene teléfono
                        resultSet.getString("direccion") // Obtiene dirección
                );
                Proveedores.add(proveedor); // Agrega el Proveedor a la lista
            }

        } catch (SQLException e) { // Captura errores SQL

            System.out.println("Error al listar Proveedores: " + e.getMessage()); // Muestra error
        }

        return Proveedores; // Retorna la lista de Proveedores
    }

    public void actualizarProveedor(Proveedor proveedor) { // Método para actualizar un Proveedor

        String sql = "UPDATE Proveedor SET nombre = ?, telefono = ?, contacto = ?, direccion = ? WHERE ID_Proveedor = ?"; // Consulta
                                                                                                                          // SQL

        try (Connection conexion = ConexionBD.obtenerConexion(); // Abre conexión
                PreparedStatement statement = conexion.prepareStatement(sql)) { // Prepara consulta

            statement.setString(1, proveedor.getNombre()); // Asigna nombres
            statement.setString(2, proveedor.getTelefono()); // Asigna teléfono
            statement.setString(3, proveedor.getContacto()); // Asigna correo
            statement.setString(4, proveedor.getDireccion()); // Asigna dirección
            statement.setInt(5, proveedor.getID_Proveedor()); // Asigna id del Proveedor a actualizar

            int filas = statement.executeUpdate(); // Ejecuta actualización y retorna filas afectadas

            if (filas > 0) { // Valida si se actualizó algún registro
                System.out.println("Proveedor actualizado correctamente."); // Mensaje exitoso
            } else { // Si no se afectaron filas
                System.out.println("No se encontró el Proveedor."); // Mensaje informativo
            }

        } catch (SQLException e) { // Captura errores SQL

            System.out.println("Error al actualizar Proveedor: " + e.getMessage()); // Muestra error
        }
    }

    public void eliminarProveedor(int ID_Proveedor) { // Método para eliminar un Proveedor

        String sql = "DELETE FROM Proveedor WHERE ID_Proveedor = ?"; // Consulta SQL para eliminar

        try (Connection conexion = ConexionBD.obtenerConexion(); // Abre conexión
                PreparedStatement statement = conexion.prepareStatement(sql)) { // Prepara consulta

            statement.setInt(1, ID_Proveedor); // Asigna el id del Proveedor a eliminar

            int filas = statement.executeUpdate(); // Ejecuta eliminación

            if (filas > 0) { // Verifica si se eliminó un registro
                System.out.println("Proveedor eliminado correctamente."); // Mensaje exitoso
            } else { // Si no encontró el Proveedor
                System.out.println("No se encontró el Proveedor."); // Mensaje informativo
            }

        } catch (SQLException e) { // Captura errores SQL

            System.out.println("Error al eliminar Proveedor: " + e.getMessage()); // Muestra error
        }
    }
}
