import './Tabla.css';

/**
 * Tabla genérica y reutilizable para listar registros.
 * columnas: [{ clave: 'nombre', titulo: 'Nombre', render?: (fila) => JSX }]
 * filas: arreglo de objetos de datos
 * acciones: función(fila) => JSX con los botones de acción para esa fila
 */
function Tabla({ columnas, filas, acciones, cargando, mensajeVacio = 'No hay registros para mostrar.' }) {
  if (cargando) {
    return <p className="tabla__estado">Cargando registros...</p>;
  }

  if (!filas || filas.length === 0) {
    return <p className="tabla__estado">{mensajeVacio}</p>;
  }

  return (
    <div className="tabla__contenedor">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave}>{columna.titulo}</th>
            ))}
            {acciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, index) => {
            // Obtener una clave única válida (id, idProducto, idProveedor o el índice)
            const claveFila = fila.id ?? fila.idProducto ?? fila.idProveedor ?? index;

            return (
              <tr key={claveFila}>
                {columnas.map((columna) => (
                  <td key={columna.clave} data-etiqueta={columna.titulo}>
                    {columna.render
                      ? columna.render(fila)
                      : (fila[columna.clave] ?? '—')}
                  </td>
                ))}
                {acciones && <td data-etiqueta="Acciones">{acciones(fila)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Tabla;