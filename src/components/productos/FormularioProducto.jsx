
import React, { useState, useEffect } from 'react';
import Boton from '../common/Boton.jsx';

function FormularioProducto({ producto, proveedores, categorias, onGuardar, onCancelar }) {
  const [valores, setValores] = useState({
    nombre: '',
    idProveedor: '',
    idCategoria: '',
    descripcion: '',
    precio: '',
    stock: '',
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (producto) {
      setValores({
        nombre: producto.nombre ?? '',
        idProveedor: producto.proveedor?.idProveedor ?? '',
        idCategoria: producto.categoria?.idCategoria ?? '',
        descripcion: producto.descripcion ?? '',
        precio: producto.precio ?? '',
        stock: producto.stock ?? '',
      });
    } else {
      setValores({
        nombre: '',
        idProveedor: '',
        idCategoria: '',
        descripcion: '',
        precio: '',
        stock: '',
      });
    }
  }, [producto]);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!valores.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!valores.idProveedor) nuevosErrores.idProveedor = 'El proveedor es obligatorio.';
    if (!valores.precio || Number(valores.precio) <= 0) nuevosErrores.precio = 'Precio inválido.';
    if (valores.stock === '' || Number(valores.stock) < 0) nuevosErrores.stock = 'Stock inválido.';
    return nuevosErrores;
  }

  function manejarEnvio(e) {
    e.preventDefault();

    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    // Sanitización de valores numéricos
    const precioNumerico = Number(
      String(valores.precio).replace(/[^0-9.]/g, '')
    );
    const stockNumerico = parseInt(valores.stock, 10);

    // Construcción del payload: proveedor y categoria van como objetos
    // con el ID real seleccionado en los <select>, tal como los espera
    // el backend (relaciones @ManyToOne de Producto).
    const payload = {
      nombre: valores.nombre,
      descripcion: valores.descripcion,
      precio: isNaN(precioNumerico) ? 0 : precioNumerico,
      stock: isNaN(stockNumerico) ? 0 : stockNumerico,
      proveedor: {
        idProveedor: Number(valores.idProveedor),
      },
      // La categoría es opcional en el backend: solo se envía si se seleccionó una.
      categoria: valores.idCategoria
        ? { idCategoria: Number(valores.idCategoria) }
        : null,
    };

    onGuardar(payload);
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      {producto && (
        <div className="formulario__campo">
          <label>SKU / ID del producto</label>
          <input
            type="text"
            value={producto.idProducto ?? producto.id ?? ''}
            disabled
            readOnly
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
        </div>
      )}

      <div className="formulario__campo">
        <label htmlFor="nombre">Nombre del producto</label>
        <input
          id="nombre"
          name="nombre"
          value={valores.nombre}
          onChange={manejarCambio}
          maxLength={80}
        />
        {errores.nombre && <span className="formulario__error">{errores.nombre}</span>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="idProveedor">Proveedor</label>
        <select
          id="idProveedor"
          name="idProveedor"
          value={valores.idProveedor}
          onChange={manejarCambio}
        >
          <option value="">Selecciona un proveedor...</option>
          {(proveedores ?? []).map((prov) => (
            <option key={prov.idProveedor} value={prov.idProveedor}>
              {prov.nombre}
            </option>
          ))}
        </select>
        {errores.idProveedor && <span className="formulario__error">{errores.idProveedor}</span>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="idCategoria">Categoría</label>
        <select
          id="idCategoria"
          name="idCategoria"
          value={valores.idCategoria}
          onChange={manejarCambio}
        >
          <option value="">Sin categoría</option>
          {(categorias ?? []).map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="formulario__campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={valores.descripcion}
          onChange={manejarCambio}
          maxLength={250}
          rows={3}
        />
      </div>

      <div className="formulario__fila">
        <div className="formulario__campo">
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={valores.precio}
            onChange={manejarCambio}
          />
          {errores.precio && <span className="formulario__error">{errores.precio}</span>}
        </div>

        <div className="formulario__campo">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={valores.stock}
            onChange={manejarCambio}
          />
          {errores.stock && <span className="formulario__error">{errores.stock}</span>}
        </div>
      </div>

      <div className="formulario__acciones">
        <Boton variante="secundario" onClick={onCancelar} type="button">
          Cancelar
        </Boton>
        <Boton type="submit" variante="primario">
          Guardar producto
        </Boton>
      </div>
    </form>
  );
}

export default FormularioProducto;