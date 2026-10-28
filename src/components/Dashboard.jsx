import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductosPage from './productos/ProductosPage';
import ProveedoresPage from './proveedores/ProveedoresPage';
import UsuariosPage from './Usuarios/UsuariosPage';
import MovimientosPage from './movimientos/MovimientosPage';
import { dashboardService } from '../api/DashboardService.js';

// Indicadores que se muestran según el alcance que devuelve el backend
const INDICADORES_GLOBAL = [
    { clave: 'totalProductos', titulo: 'Total de productos' },
    { clave: 'productosStockBajo', titulo: 'Bajo en stock' },
    { clave: 'proveedoresActivos', titulo: 'Proveedores activos' },
    { clave: 'usuariosActivos', titulo: 'Usuarios activos' },
    { clave: 'usuariosInactivos', titulo: 'Usuarios inactivos' },
    { clave: 'totalMovimientos', titulo: 'Total de movimientos' },
    { clave: 'movimientosEntrada', titulo: 'Entradas registradas' },
    { clave: 'movimientosSalida', titulo: 'Salidas registradas' },
];

const INDICADORES_PERSONAL = [
    { clave: 'totalProductos', titulo: 'Total de productos' },
    { clave: 'productosStockBajo', titulo: 'Bajo en stock' },
    { clave: 'misMovimientos', titulo: 'Mis movimientos' },
    { clave: 'misEntradas', titulo: 'Mis entradas' },
    { clave: 'misSalidas', titulo: 'Mis salidas' },
];

const estiloTarjeta = {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem'
};

const estiloVolver = {
    backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff',
    padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem'
};

export default function Dashboard() {
    const [moduloActivo, setModuloActivo] = useState('inicio');
    const [datosDashboard, setDatosDashboard] = useState(null);
    const [cargandoDashboard, setCargandoDashboard] = useState(true);
    const [errorDashboard, setErrorDashboard] = useState('');
    const navigate = useNavigate();

    const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
    const esAdmin = usuarioActual?.rol === 'ADMIN';

    // Carga los indicadores reales cada vez que se vuelve a la vista de inicio
    useEffect(() => {
        if (moduloActivo !== 'inicio') return;

        let activo = true;
        setCargandoDashboard(true);
        setErrorDashboard('');

        dashboardService.obtener()
            .then((datos) => { if (activo) setDatosDashboard(datos); })
            .catch((err) => { if (activo) setErrorDashboard(err.message); })
            .finally(() => { if (activo) setCargandoDashboard(false); });

        return () => { activo = false; };
    }, [moduloActivo]);

    const handleCerrarSesion = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const esGlobal = datosDashboard?.alcance === 'GLOBAL';
    const listaIndicadores = esGlobal ? INDICADORES_GLOBAL : INDICADORES_PERSONAL;

    const estiloEnlace = (modulo) => ({
        color: moduloActivo === modulo ? '#38bdf8' : '#94a3b8',
        textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500
    });

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0b0f19',
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem 4rem',
            boxSizing: 'border-box'
        }}>
            {/* Top Navbar */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div
                    onClick={() => setModuloActivo('inicio')}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                >
                    <div style={{
                        width: '42px', height: '42px', backgroundColor: '#2563eb',
                        borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.2rem'
                    }}>📈</div>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Sistema de inventario</h1>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Gestiona tu negocio de la manera más eficiente</p>
                    </div>
                </div>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <a
                        href="#productos"
                        onClick={(e) => { e.preventDefault(); setModuloActivo('productos'); }}
                        style={estiloEnlace('productos')}
                    >
                        Productos
                    </a>

                    <a
                        href="#movimientos"
                        onClick={(e) => { e.preventDefault(); setModuloActivo('movimientos'); }}
                        style={estiloEnlace('movimientos')}
                    >
                        Movimientos
                    </a>

                    <a
                        href="#proveedores"
                        onClick={(e) => { e.preventDefault(); setModuloActivo('proveedores'); }}
                        style={estiloEnlace('proveedores')}
                    >
                        Proveedores
                    </a>

                    {esAdmin && (
                        <a
                            href="#usuarios"
                            onClick={(e) => { e.preventDefault(); setModuloActivo('usuarios'); }}
                            style={estiloEnlace('usuarios')}
                        >
                            Usuarios
                        </a>
                    )}

                    <button
                        onClick={handleCerrarSesion}
                        style={{
                            backgroundColor: 'transparent', border: '1px solid #ef4444',
                            color: '#f87171', padding: '0.4rem 1.2rem', borderRadius: '20px',
                            cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        ➔ Salir
                    </button>
                </nav>
            </header>

            {/* VISTA INICIO */}
            {
                moduloActivo === 'inicio' && (
                    <>
                        <section style={{ marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                                {datosDashboard?.nombre ? `Hola, ${datosDashboard.nombre}` : 'Resumen'}
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                {datosDashboard
                                    ? (esGlobal
                                        ? `Rol ${datosDashboard.rol}: vista global del sistema`
                                        : `Rol ${datosDashboard.rol}: vista personal, solo tus movimientos`)
                                    : ' '}
                            </p>
                        </section>

                        {errorDashboard && (
                            <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                No se pudieron cargar los indicadores: {errorDashboard}
                            </p>
                        )}

                        <section style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.25rem',
                            marginBottom: '2.5rem'
                        }}>
                            {cargandoDashboard && !datosDashboard && (
                                <div style={estiloTarjeta}>
                                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Cargando indicadores...</span>
                                </div>
                            )}

                            {datosDashboard && listaIndicadores.map((indicador) => (
                                <div key={indicador.clave} style={estiloTarjeta}>
                                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>
                                        {indicador.titulo}
                                        {indicador.clave === 'productosStockBajo' && datosDashboard.umbralStockBajo != null
                                            ? ` (≤ ${datosDashboard.umbralStockBajo})`
                                            : ''}
                                    </span>
                                    <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>
                                        {datosDashboard.indicadores?.[indicador.clave] ?? 0}
                                    </h2>
                                </div>
                            ))}
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Menú principal</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                                {/* Card Productos */}
                                <div
                                    onClick={() => setModuloActivo('productos')}
                                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem 1.25rem', textAlign: 'center', cursor: 'pointer' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#2563eb', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem 0' }}>Productos</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Gestiona tu catálogo de productos</p>
                                </div>

                                {/* Card Movimientos */}
                                <div
                                    onClick={() => setModuloActivo('movimientos')}
                                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem 1.25rem', textAlign: 'center', cursor: 'pointer' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#10b981', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔄</div>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem 0' }}>Movimientos</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Gestiona entradas y salidas</p>
                                </div>

                                {/* Card Usuarios (solo ADMIN) */}
                                {esAdmin && (
                                    <div
                                        onClick={() => setModuloActivo('usuarios')}
                                        style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem 1.25rem', textAlign: 'center', cursor: 'pointer' }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#7c3aed', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                                        <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem 0' }}>Usuarios</h3>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Administra los usuarios del sistema</p>
                                    </div>
                                )}

                                {/* Card Proveedores */}
                                <div
                                    onClick={() => setModuloActivo('proveedores')}
                                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem 1.25rem', textAlign: 'center', cursor: 'pointer' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ea580c', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👥</div>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem 0' }}>Proveedores</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                                        {esAdmin ? 'Administra tus proveedores' : 'Consulta tus proveedores'}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )
            }

            {/* VISTA PRODUCTOS */}
            {
                moduloActivo === 'productos' && (
                    <div>
                        <button onClick={() => setModuloActivo('inicio')} style={estiloVolver}>
                            ← Volver al Menú
                        </button>
                        <ProductosPage />
                    </div>
                )
            }

            {/* VISTA MOVIMIENTOS */}
            {
                moduloActivo === 'movimientos' && (
                    <div>
                        <button onClick={() => setModuloActivo('inicio')} style={estiloVolver}>
                            ← Volver al Menú
                        </button>
                        <MovimientosPage />
                    </div>
                )
            }

            {/* VISTA PROVEEDORES */}
            {
                moduloActivo === 'proveedores' && (
                    <div>
                        <button onClick={() => setModuloActivo('inicio')} style={estiloVolver}>
                            ← Volver al Menú
                        </button>
                        <ProveedoresPage />
                    </div>
                )
            }

            {/* VISTA USUARIOS (solo ADMIN) */}
            {
                moduloActivo === 'usuarios' && esAdmin && (
                    <div>
                        <button onClick={() => setModuloActivo('inicio')} style={estiloVolver}>
                            ← Volver al Menú
                        </button>
                        <UsuariosPage />
                    </div>
                )
            }
        </div >
    );
}