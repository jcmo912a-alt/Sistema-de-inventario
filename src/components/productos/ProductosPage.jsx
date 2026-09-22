import { useEffect, useState } from 'react';
import { productoService } from '../../api/productoService.js';
import { proveedorService } from '../../api/proveedorService.js';
import { categoriaService } from '../../api/CategoriaService.js';
import Tabla from '../common/Tabla.jsx';
import Modal from '../common/Modal.jsx';
import Mensaje from '../common/Mensaje.jsx';
import Boton from '../common/Boton.jsx';
import FormularioProducto from './FormularioProducto.jsx';

const COLUMNAS = [
  {
    clave: 'idProducto',
    titulo: 'ID',
    render: (fila) => fila?.idProducto ?? fila?.id ?? '—',
  },
  {
    clave: 'nombre',
    titulo: 'Nombre',
  },
  {
    clave: 'descripcion',
    titulo: 'Descripción',
    render: (fila) => fila?.categoria?.descripcion || '—',
  },
  {
    clave: 'proveedor',
    titulo: 'Proveedor',
    render: (fila) =>
      typeof fila?.proveedor === 'object'
        ? fila?.proveedor?.nombre
        : fila?.proveedor || fila?.nombreProveedor || '—',
  },
  {
    clave: 'categoria',
    titulo: 'Categoría',
    render: (fila) =>
      typeof fila?.categoria === 'object'
        ? fila?.categoria?.nombre
        : fila?.categoria || '—',
  },
  {
    clave: 'precio',
    titulo: 'Precio',
    render: (fila) =>
      fila?.precio != null
        ? `$${Number(fila.precio).toLocaleString('es-CO')}`
        : '—',
  },
  {
    clave: 'stock',
    titulo: 'Stock',
    render: (fila) => fila?.stock ?? '—',
  },
];

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    cargarProductos();
    cargarListasApoyo();
  }, []);

  async function cargarProductos() {
    setCargando(true);
    setError('');
    try {
      const datos = await productoService.listar();
      setProductos(datos ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // Carga proveedores y categorías para alimentar los <select> del formulario.
  async function cargarListasApoyo() {
    try {
      const [datosProveedores, datosCategorias] = await Promise.all([
        proveedorService.listar(),
        categoriaService.listar(),
      ]);
      setProveedores(datosProveedores ?? []);
      setCategorias(datosCategorias ?? []);
    } catch (err) {
      setError(err.message);
    }
  }

  function abrirParaCrear() {
    setProductoEnEdicion(null);
    setFormularioAbierto(true);
  }

  function abrirParaEditar(producto) {
    setProductoEnEdicion(producto);
    setFormularioAbierto(true);
  }

  function cerrarFormulario() {
    setFormularioAbierto(false);
    setProductoEnEdicion(null);
  }

  async function guardarProducto(datosProducto) {
    setError('');
    try {
      const { idProducto, id, ...payloadSinId } = datosProducto;

      if (productoEnEdicion) {
        const idActualizar = productoEnEdicion.idProducto ?? productoEnEdicion.id;

        if (!idActualizar) {
          throw new Error('No se pudo determinar el ID del producto.');
        }

        await productoService.actualizar(idActualizar, payloadSinId);
        setMensajeExito('Producto actualizado correctamente.');
      } else {
        await productoService.crear(payloadSinId);
        setMensajeExito('Producto registrado correctamente.');
      }

      cerrarFormulario();
      await cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminarProducto(producto) {
    const id = producto.idProducto ?? producto.id;

    if (!id) {
      setError('No se pudo identificar el ID del producto a eliminar.');
      return;
    }

    const confirmar = window.confirm(
      `¿Eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setError('');
    try {
      await productoService.eliminar(id);
      setMensajeExito('Producto eliminado correctamente.');
      await cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  const productosFiltrados = productos.filter((producto) => {
    const texto = terminoBusqueda.trim().toLowerCase();
    if (!texto) return true;
    return (
      producto.nombre?.toLowerCase().includes(texto) ||
      producto.sku?.toLowerCase().includes(texto)
    );
  });

  return (
    <section className="modulo">
      <div className="modulo__cabecera">
        <div>
          <h2>Productos</h2>
          <p>Consulta, registra, edita y elimina los productos del inventario.</p>
        </div>
        <Boton onClick={abrirParaCrear}>+ Registrar producto</Boton>
      </div>

      <Mensaje tipo="error" texto={error} onCerrar={() => setError('')} />
      <Mensaje tipo="exito" texto={mensajeExito} onCerrar={() => setMensajeExito('')} />

      <div className="modulo__filtros">
        <input
          type="search"
          placeholder="Buscar por nombre o SKU..."
          value={terminoBusqueda}
          onChange={(evento) => setTerminoBusqueda(evento.target.value)}
          aria-label="Buscar productos"
        />
      </div>

      <Tabla
        columnas={COLUMNAS}
        filas={productosFiltrados}
        cargando={cargando}
        mensajeVacio="Aún no hay productos registrados."
        acciones={(producto) => (
          <div className="tabla__acciones">
            <Boton variante="secundario" onClick={() => abrirParaEditar(producto)}>
              Editar
            </Boton>
            <Boton variante="peligro" onClick={() => eliminarProducto(producto)}>
              Eliminar
            </Boton>
          </div>
        )}
      />

      <Modal
        titulo={productoEnEdicion ? 'Editar producto' : 'Registrar producto'}
        abierto={formularioAbierto}
        onCerrar={cerrarFormulario}
      >
        <FormularioProducto
          producto={productoEnEdicion}
          proveedores={proveedores}
          categorias={categorias}
          onGuardar={guardarProducto}
          onCancelar={cerrarFormulario}
        />
      </Modal>
    </section>
  );
}

export default ProductosPage;