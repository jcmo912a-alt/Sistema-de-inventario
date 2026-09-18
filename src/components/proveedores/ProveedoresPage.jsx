import { useEffect, useState } from 'react';
import { proveedorService } from '../../api/proveedorService.js';
import Tabla from '../common/Tabla.jsx';
import Modal from '../common/Modal.jsx';
import Mensaje from '../common/Mensaje.jsx';
import Boton from '../common/Boton.jsx';
import FormularioProveedor from './FormularioProveedor.jsx';

const COLUMNAS = [
  {
    clave: 'idProveedor',
    titulo: 'ID',
    render: (fila) => fila.idProveedor ?? fila.id ?? '—',
  },
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'telefono', titulo: 'Teléfono' },
  {
    clave: 'contacto',
    titulo: 'Contacto',
    render: (fila) => fila.contacto || fila.correo || fila.email || '—',
  },
  {
    clave: 'direccion',
    titulo: 'Dirección',
    render: (fila) => fila.direccion || '—',
  },
  {
    clave: 'estado',
    titulo: 'Estado',
    render: (fila) => {
      const valor = fila.estado ?? fila.activo;
      const esActivo =
        valor === false || valor === 0 || valor === '0' ? false : true;

      return (
        <span
          className={`etiqueta-estado ${esActivo ? 'etiqueta-estado--activo' : 'etiqueta-estado--inactivo'
            }`}
        >
          {esActivo ? 'Activo' : 'Inactivo'}
        </span>
      );
    },
  },
];
/**
 * Módulo de Proveedores: encabezado, buscador, tabla de registros,
 * botones de acción y formulario emergente para crear/editar.
 * Consume el endpoint /api/proveedores del backend Spring Boot.
 */
function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [proveedorEnEdicion, setProveedorEnEdicion] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Carga inicial de proveedores (GET /api/proveedores) al montar el componente.
  useEffect(() => {
    cargarProveedores();
  }, []);

  async function cargarProveedores() {
    setCargando(true);
    setError('');
    try {
      const datos = await proveedorService.listar();
      setProveedores(datos ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function abrirParaCrear() {
    setProveedorEnEdicion(null);
    setFormularioAbierto(true);
  }

  function abrirParaEditar(proveedor) {
    setProveedorEnEdicion(proveedor);
    setFormularioAbierto(true);
  }

  function cerrarFormulario() {
    setFormularioAbierto(false);
    setProveedorEnEdicion(null);
  }

  async function guardarProveedor(datosProveedor) {
    setError('');

    console.log("Datos que llegan del formulario:", datosProveedor);

    try {
      const id = proveedorEnEdicion?.idProveedor || proveedorEnEdicion?.id;
      if (proveedorEnEdicion) {
        await proveedorService.actualizar(id, datosProveedor);
        setMensajeExito('Proveedor actualizado correctamente.');
      } else {
        await proveedorService.crear(datosProveedor);
        setMensajeExito('Proveedor registrado correctamente.');
      }
      cerrarFormulario();
      await cargarProveedores();
    } catch (err) {
      setError(err.message);
    }
  }
  async function eliminarProveedor(proveedor) {
    const id = proveedor.idProveedor || proveedor.id;
    const confirmar = window.confirm(
      `¿Eliminar al proveedor "${proveedor.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setError('');
    try {
      await proveedorService.eliminar(id);
      setMensajeExito('Proveedor eliminado correctamente.');
      await cargarProveedores();
    } catch (err) {
      setError(err.message);
    }
  }

  const [filtroEstado, setFiltroEstado] = useState('todos');

  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const valorEstado = proveedor.estado ?? proveedor.activo;
    const esActivo =
      valorEstado === false || valorEstado === 0 || valorEstado === '0'
        ? false
        : true;

    if (filtroEstado === 'activos' && !esActivo) return false;
    if (filtroEstado === 'inactivos' && esActivo) return false;

    const texto = terminoBusqueda.trim().toLowerCase();
    if (!texto) return true;

    return (
      proveedor.nombre?.toLowerCase().includes(texto) ||
      proveedor.contacto?.toLowerCase().includes(texto) ||
      proveedor.telefono?.toLowerCase().includes(texto)
    );
  });

  return (
    <section className="modulo">
      <div className="modulo__cabecera">
        <div>
          <h2>Proveedores</h2>
          <p>Consulta, registra, edita y elimina los proveedores del sistema.</p>
        </div>
        <Boton onClick={abrirParaCrear}>+ Registrar proveedor</Boton>
      </div>

      <Mensaje tipo="error" texto={error} onCerrar={() => setError('')} />
      <Mensaje tipo="exito" texto={mensajeExito} onCerrar={() => setMensajeExito('')} />

      <div className="modulo__filtros">
        <input
          type="text"
          placeholder="Buscar por nombre, contacto o teléfono..."
          value={terminoBusqueda}
          onChange={(evento) => setTerminoBusqueda(evento.target.value)}
          className="filtro-control"
          aria-label="Buscar proveedores"
        />

        <select
          value={filtroEstado}
          onChange={(evento) => setFiltroEstado(evento.target.value)}
          className="filtro-control"
          aria-label="Filtrar proveedores por estado"
        >
          <option value="todos">Todos los estados</option>
          <option value="activos">Solo Activos</option>
          <option value="inactivos">Solo Inactivos</option>
        </select>
      </div>

      <Tabla
        columnas={COLUMNAS}
        filas={proveedoresFiltrados}
        cargando={cargando}
        mensajeVacio="Aún no hay proveedores registrados."
        acciones={(proveedor) => (
          <div className="tabla__acciones">
            <Boton variante="secundario" onClick={() => abrirParaEditar(proveedor)}>
              Editar
            </Boton>
            <Boton variante="peligro" onClick={() => eliminarProveedor(proveedor)}>
              Eliminar
            </Boton>
          </div>
        )}
      />

      <Modal
        titulo={proveedorEnEdicion ? 'Editar proveedor' : 'Registrar proveedor'}
        abierto={formularioAbierto}
        onCerrar={cerrarFormulario}
      >
        <FormularioProveedor
          proveedor={proveedorEnEdicion}
          onGuardar={guardarProveedor}
          onCancelar={cerrarFormulario}
        />
      </Modal>
    </section>
  );
}

export default ProveedoresPage;