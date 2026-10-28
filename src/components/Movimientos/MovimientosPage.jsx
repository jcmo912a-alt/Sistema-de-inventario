import { useEffect, useState } from 'react';
import { movimientoService } from '../../api/movimientoService.js';
import { productoService } from '../../api/productoService.js';
import Tabla from '../common/Tabla.jsx';
import Modal from '../common/Modal.jsx';
import Mensaje from '../common/Mensaje.jsx';
import Boton from '../common/Boton.jsx';
import FormularioMovimiento from './FormularioMovimiento.jsx';

const COLUMNAS = [
    {
        clave: 'idMovimiento',
        titulo: 'ID',
        render: (fila) => fila?.idMovimiento ?? '—',
    },
    {
        clave: 'fecha',
        titulo: 'Fecha',
        render: (fila) => fila?.fecha ?? '—',
    },
    {
        clave: 'producto',
        titulo: 'Producto',
        render: (fila) => fila?.producto?.nombre ?? '—',
    },
    {
        clave: 'tipoMovimiento',
        titulo: 'Tipo',
        render: (fila) => (
            <span
                style={{
                    color: fila?.tipoMovimiento === 'ENTRADA' ? '#34d399' : '#fb923c',
                    fontWeight: 600,
                }}
            >
                {fila?.tipoMovimiento ?? '—'}
            </span>
        ),
    },
    {
        clave: 'cantidad',
        titulo: 'Cantidad',
        render: (fila) => fila?.cantidad ?? '—',
    },
    {
        clave: 'usuario',
        titulo: 'Registrado por',
        render: (fila) => fila?.usuario?.nombre ?? '—',
    },
];

// Página del módulo Movimientos: historial de entradas y salidas de inventario.
function MovimientosPage() {
    const [movimientos, setMovimientos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    useEffect(() => {
        cargarMovimientos();
        cargarProductos();
    }, []);

    async function cargarMovimientos() {
        setCargando(true);
        setError('');
        try {
            const datos = await movimientoService.listar();
            setMovimientos(datos ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    // Productos para el <select> del formulario (con su stock actual)
    async function cargarProductos() {
        try {
            const datos = await productoService.listar();
            setProductos(datos ?? []);
        } catch (err) {
            setError(err.message);
        }
    }

    async function registrarMovimiento(datos) {
        setError('');
        try {
            await movimientoService.registrar(datos);
            setMensajeExito('Movimiento registrado correctamente. El stock fue actualizado.');
            setFormularioAbierto(false);
            // Se recargan ambos: el historial y los productos (el stock cambió)
            await Promise.all([cargarMovimientos(), cargarProductos()]);
        } catch (err) {
            setError(err.message);
        }
    }

    const movimientosFiltrados = movimientos.filter((m) => {
        const texto = terminoBusqueda.trim().toLowerCase();
        if (!texto) return true;
        return (
            m.producto?.nombre?.toLowerCase().includes(texto) ||
            m.tipoMovimiento?.toLowerCase().includes(texto) ||
            m.usuario?.nombre?.toLowerCase().includes(texto)
        );
    });

    return (
        <section className="modulo">
            <div className="modulo__cabecera">
                <div>
                    <h2>Movimientos</h2>
                    <p>Historial de entradas y salidas de inventario.</p>
                </div>
                <Boton onClick={() => setFormularioAbierto(true)}>+ Registrar movimiento</Boton>
            </div>

            <Mensaje tipo="error" texto={error} onCerrar={() => setError('')} />
            <Mensaje tipo="exito" texto={mensajeExito} onCerrar={() => setMensajeExito('')} />

            <div className="modulo__filtros">
                <input
                    type="search"
                    placeholder="Buscar por producto, tipo o usuario..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    aria-label="Buscar movimientos"
                />
            </div>

            <Tabla
                columnas={COLUMNAS}
                filas={movimientosFiltrados}
                cargando={cargando}
                mensajeVacio="Aún no hay movimientos registrados."
            />

            <Modal
                titulo="Registrar movimiento"
                abierto={formularioAbierto}
                onCerrar={() => setFormularioAbierto(false)}
            >
                <FormularioMovimiento
                    productos={productos}
                    onGuardar={registrarMovimiento}
                    onCancelar={() => setFormularioAbierto(false)}
                />
            </Modal>
        </section>
    );
}

export default MovimientosPage;