import React, { useState } from 'react';
import Boton from '../common/Boton.jsx';

// Formulario para registrar un movimiento (entrada o salida) de un producto.
function FormularioMovimiento({ productos, onGuardar, onCancelar }) {
  const [valores, setValores] = useState({
    idProducto: '',
    tipoMovimiento: 'ENTRADA',
    cantidad: '',
  });
  const [errores, setErrores] = useState({});

  const productoSeleccionado = (productos ?? []).find(
    (p) => String(p.idProducto) === String(valores.idProducto)
  );

  function manejarCambio(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevos = {};
    const cantidad = Number(valores.cantidad);

    if (!valores.idProducto) nuevos.idProducto = 'El producto es obligatorio.';
    if (!valores.cantidad || !Number.isInteger(cantidad) || cantidad <= 0) {
      nuevos.cantidad = 'La cantidad debe ser un número entero mayor que cero.';
    } else if (
      valores.tipoMovimiento === 'SALIDA' &&
      productoSeleccionado &&
      cantidad > (productoSeleccionado.stock ?? 0)
    ) {
      nuevos.cantidad = `Stock insuficiente: solo hay ${productoSeleccionado.stock ?? 0} unidades.`;
    }
    return nuevos;
  }

  function manejarEnvio(e) {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setErrores({});

    // El usuario y la fecha los asigna el backend (usuario desde el token JWT)
    onGuardar({
      tipoMovimiento: valores.tipoMovimiento,
      cantidad: parseInt(valores.cantidad, 10),
      producto: { idProducto: Number(valores.idProducto) },
    });
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <div className="formulario__campo">
        <label htmlFor="idProducto">Producto</label>
        <select
          id="idProducto"
          name="idProducto"
          value={valores.idProducto}
          onChange={manejarCambio}
        >
          <option value="">Selecciona un producto...</option>
          {(productos ?? []).map((p) => (
            <option key={p.idProducto} value={p.idProducto}>
              {p.nombre}
            </option>
          ))}
        </select>
        {productoSeleccionado && (
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            Stock actual: {productoSeleccionado.stock ?? 0}
          </span>
        )}
        {errores.idProducto && <span className="formulario__error">{errores.idProducto}</span>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="tipoMovimiento">Tipo de movimiento</label>
        <select
          id="tipoMovimiento"
          name="tipoMovimiento"
          value={valores.tipoMovimiento}
          onChange={manejarCambio}
        >
          <option value="ENTRADA">Entrada (suma stock)</option>
          <option value="SALIDA">Salida (resta stock)</option>
        </select>
      </div>

      <div className="formulario__campo">
        <label htmlFor="cantidad">Cantidad</label>
        <input
          id="cantidad"
          name="cantidad"
          type="number"
          min="1"
          step="1"
          value={valores.cantidad}
          onChange={manejarCambio}
        />
        {errores.cantidad && <span className="formulario__error">{errores.cantidad}</span>}
      </div>

      <div className="formulario__acciones">
        <Boton variante="secundario" onClick={onCancelar} type="button">
          Cancelar
        </Boton>
        <Boton type="submit" variante="primario">
          Registrar movimiento
        </Boton>
      </div>
    </form>
  );
}

export default FormularioMovimiento;