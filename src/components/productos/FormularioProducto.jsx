import React, { useState, useEffect } from 'react';
import { openFoodFactsService } from '../../api/openFoodFactsService.js';
import Boton from '../common/Boton.jsx';

const VALORES_INICIALES = {
  nombre: '',
  idProveedor: '',
  idCategoria: '',
  precio: '',
  stock: '',
};
const handleBuscarApiExterna = async () => {
  if (!codigoBarras.trim()) {
    alert('Por favor, ingresa un código de barras para buscar.');
    return;
  }

  setCargandoApiExterna(true);
  try {
    const datos = await openFoodFactsService.buscarPorCodigoBarras(codigoBarras);

    // Armamos un nombre más completo usando la marca y cantidad que vienen del DTO
    let nombreFormateado = datos.nombre || '';
    if (datos.marca) {
      nombreFormateado += ` - ${datos.marca}`;
    }
    if (datos.cantidad) {
      nombreFormateado += ` (${datos.cantidad})`;
    }

    setValores((prev) => ({
      ...prev,
      nombre: nombreFormateado.trim() || prev.nombre,
    }));

    alert('¡Producto encontrado en Open Food Facts y datos cargados!');
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    setCargandoApiExterna(false);
  }
};

function FormularioProducto({ producto, proveedores, categorias, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (producto) {
      setValores({
        nombre: producto.nombre ?? '',
        idProveedor: producto.proveedor?.idProveedor ?? '',
        idCategoria: producto.categoria?.idCategoria ?? '',
        precio: producto.precio ?? '',
        stock: producto.stock ?? '',
      });
    } else {
      setValores(VALORES_INICIALES);
    }
  }, [producto]);

  const [codigoBarras, setCodigoBarras] = useState('');
  const [cargandoApiExterna, setCargandoApiExterna] = useState(false);

  // Consulta la API pública externa y autocompleta el nombre del producto
  const handleBuscarApiExterna = async () => {
    if (!codigoBarras.trim()) {
      alert('Por favor, ingresa un código de barras para buscar.');
      return;
    }

    setCargandoApiExterna(true);
    try {
      const datos = await openFoodFactsService.buscarPorCodigoBarras(codigoBarras);

      // Autocompleta el campo 'nombre' con la respuesta de Open Food Facts
      setValores((prev) => ({
        ...prev,
        nombre: datos.nombre ? (datos.marca ? `${datos.nombre} (${datos.marca})` : datos.nombre) : prev.nombre,
      }));

      alert('¡Producto encontrado en Open Food Facts y datos cargados!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setCargandoApiExterna(false);
    }
  };

  // La descripción del producto es la de su categoría (solo se muestra, no se edita)
  const categoriaSeleccionada = (categorias ?? []).find(
    (cat) => String(cat.idCategoria) === String(valores.idCategoria)
  );

  function manejarCambio(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!valores.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!valores.idProveedor) nuevosErrores.idProveedor = 'El proveedor es obligatorio.';
    if (!valores.idCategoria) nuevosErrores.idCategoria = 'La categoría es obligatoria.';
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
    setErrores({});

    // Sanitización de valores numéricos
    const precioNumerico = Number(
      String(valores.precio).replace(/[^0-9.]/g, '')
    );
    const stockNumerico = parseInt(valores.stock, 10);

    // Payload: proveedor y categoria van como objetos con el ID seleccionado
    // (relaciones @ManyToOne de Producto). Ya no se envía descripción:
    // se toma de la categoría.
    const payload = {
      nombre: valores.nombre,
      precio: isNaN(precioNumerico) ? 0 : precioNumerico,
      stock: isNaN(stockNumerico) ? 0 : stockNumerico,
      proveedor: {
        idProveedor: Number(valores.idProveedor),
      },
      categoria: {
        idCategoria: Number(valores.idCategoria),
      },
    };

    onGuardar(payload);
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      {/* Sección de consulta a la API Pública Externa */}
      <div className="formulario__campo" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
        <label htmlFor="codigoBarras">Buscar en catálogo externo (Open Food Facts):</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <input
            id="codigoBarras"
            type="text"
            placeholder="Ej: 3017624010701"
            value={codigoBarras}
            onChange={(e) => setCodigoBarras(e.target.value)}
            style={{ flex: 1 }}
          />
          <Boton
            type="button"
            variante="secundario"
            onClick={handleBuscarApiExterna}
            disabled={cargandoApiExterna}
          >
            {cargandoApiExterna ? 'Buscando...' : '🔍 Buscar'}
          </Boton>
        </div>
      </div>

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
          <option value="">Selecciona una categoría...</option>
          {(categorias ?? []).map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errores.idCategoria && <span className="formulario__error">{errores.idCategoria}</span>}
      </div>

      {/* Descripción tomada de la categoría seleccionada (solo lectura) */}
      <div className="formulario__campo">
        <label htmlFor="descripcion">Descripción (según la categoría)</label>
        <textarea
          id="descripcion"
          value={categoriaSeleccionada?.descripcion ?? ''}
          placeholder="Selecciona una categoría para ver su descripción"
          rows={3}
          disabled
          readOnly
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
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