package com; // Define el paquete principal del proyecto (Main.java está directo en com)

import com.dao.ProveedorDao; // Importa el DAO de Proveedor
import com.model.Proveedor; // Importa la clase Proveedor

import java.util.Scanner; // Importa Scanner para capturar datos por teclado

public class Main { // Clase principal del programa

    public static void main(String[] args) { // Método principal de ejecución

        Scanner scanner = new Scanner(System.in); // Crea objeto Scanner para leer datos
        ProveedorDao proveedorDao = new ProveedorDao(); // Crea objeto para manejar operaciones de Proveedor

        int opcion; // Variable para guardar la opción del menú

        do { // Inicia ciclo del menú

            System.out.println("\n===== SISTEMA DE INVENTARIO ====="); // Título del sistema
            System.out.println("1. Registrar proveedor"); // Opción para insertar
            System.out.println("2. Listar proveedores"); // Opción para listar
            System.out.println("3. Actualizar proveedor"); // Opción para actualizar
            System.out.println("4. Eliminar proveedor"); // Opción para eliminar
            System.out.println("0. Salir"); // Opción para salir
            System.out.print("Seleccione una opción: "); // Solicita opción al usuario

            opcion = scanner.nextInt(); // Lee opción numérica
            scanner.nextLine(); // Limpia salto de línea pendiente

            switch (opcion) { // Evalúa la opción seleccionada

                case 1: // Registrar proveedor

                    System.out.print("Nombre: ");
                    String nombre = scanner.nextLine();

                    System.out.print("Contacto: ");
                    String contacto = scanner.nextLine();

                    System.out.print("Teléfono: ");
                    String telefono = scanner.nextLine();

                    System.out.print("Dirección: ");
                    String direccion = scanner.nextLine();

                    Proveedor nuevoProveedor = new Proveedor(nombre, contacto, telefono, direccion); // Constructor sin
                                                                                                     // id
                    proveedorDao.insertarProveedor(nuevoProveedor); // Inserta en la BD

                    break; // Finaliza caso 1

                case 2: // Listar proveedores

                    proveedorDao.listarProveedores().forEach(System.out::println); // Lista e imprime

                    break; // Finaliza caso 2

                case 3: // Actualizar proveedor

                    System.out.print("ID del proveedor a actualizar: ");
                    int idActualizar = scanner.nextInt();
                    scanner.nextLine();

                    System.out.print("Nuevo nombre: ");
                    String nuevoNombre = scanner.nextLine();

                    System.out.print("Nuevo contacto: ");
                    String nuevoContacto = scanner.nextLine();

                    System.out.print("Nuevo teléfono: ");
                    String nuevoTelefono = scanner.nextLine();

                    System.out.print("Nueva dirección: ");
                    String nuevaDireccion = scanner.nextLine();

                    Proveedor proveedorActualizado = new Proveedor(idActualizar, nuevoNombre, nuevoContacto,
                            nuevoTelefono, nuevaDireccion); // Constructor con id
                    proveedorDao.actualizarProveedor(proveedorActualizado); // Actualiza en la BD

                    break; // Finaliza caso 3

                case 4: // Eliminar proveedor

                    System.out.print("ID del proveedor a eliminar: ");
                    int idEliminar = scanner.nextInt();

                    proveedorDao.eliminarProveedor(idEliminar); // Elimina de la BD

                    break; // Finaliza caso 4

                case 0: // Salir

                    System.out.println("Saliendo del sistema...");

                    break; // Finaliza caso 0

                default: // Opción inválida

                    System.out.println("Opción no válida.");

                    break;
            }

        } while (opcion != 0); // Repite mientras la opción sea distinta de 0

        scanner.close(); // Cierra Scanner
    }
}