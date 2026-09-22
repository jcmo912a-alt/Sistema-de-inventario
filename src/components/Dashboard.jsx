import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductosPage from './productos/ProductosPage';
import ProveedoresPage from './proveedores/ProveedoresPage';
import UsuariosPage from './Usuarios/UsuariosPage';
import MovimientosPage from './movimientos/MovimientosPage';


export default function Dashboard() {
    const [moduloActivo, setModuloActivo] = useState('inicio');
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        navigate('/login');
    };

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
                        style={{
                            color: moduloActivo === 'productos' ? '#38bdf8' : '#94a3b8',
                            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500
                        }}
                    >
                        Productos
                    </a>
                    <a
                        href="#movimientos"
                        onClick={(e) => { e.preventDefault(); setModuloActivo('movimientos'); }}
                        style={{
                            color: moduloActivo === 'movimientos' ? '#38bdf8' : '#94a3b8',
                            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                        }}
                    >
                        Movimientos
                    </a>
                    <a
                        href="#proveedores"
                        onClick={(e) => { e.preventDefault(); setModuloActivo('proveedores'); }}
                        style={{
                            color: moduloActivo === 'proveedores' ? '#38bdf8' : '#94a3b8',
                            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500
                        }}
                    >
                        Proveedores
                    </a>
                    <a
                        href="#Usuarios"
                        onClick={(e) => { e.preventDefault(); setModuloActivo('usuarios'); }}
                        style={{
                            color: moduloActivo === 'usuarios' ? '#38bdf8' : '#94a3b8',
                            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500
                        }}
                    >
                        Usuarios
                    </a>
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
            {moduloActivo === 'inicio' && (
                <>
                    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Total de productos</span>
                            <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>2</h2>
                        </div>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Productos disponibles</span>
                            <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>1</h2>
                        </div>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Bajo en stock</span>
                            <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>1</h2>
                        </div>
                        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Proveedores</span>
                            <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>2</h2>
                        </div>
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

                            {/* Card Usuarios */}
                            <div
                                onClick={() => setModuloActivo('usuarios')}
                                style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem 1.25rem', textAlign: 'center', cursor: 'pointer' }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#7c3aed', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                                <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem 0' }}>Usuarios</h3>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Administra los usuarios del sistema</p>
                            </div>

                            {/* Card Proveedores */}
                            <div
                                onClick={() => setModuloActivo('proveedores')}
                                style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem 1.25rem', textAlign: 'center', cursor: 'pointer' }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ea580c', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👥</div>
                                <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem 0' }}>Proveedores</h3>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Administra tus proveedores</p>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* VISTA PRODUCTOS */}
            {moduloActivo === 'productos' && (
                <div>
                    <button
                        onClick={() => setModuloActivo('inicio')}
                        style={{
                            backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff',
                            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem'
                        }}
                    >
                        ← Volver al Menú
                    </button>
                    <ProductosPage />
                </div>
            )}

            {/* VISTA MOVIMIENTOS */}
            {moduloActivo === 'movimientos' && (
                <div>
                    <button
                        onClick={() => setModuloActivo('inicio')}
                        style={{
                            backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff',
                            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem'
                        }}
                    >
                        ← Volver al Menú
                    </button>
                    <MovimientosPage />
                </div>
            )}

            {/* VISTA PROVEEDORES */}
            {moduloActivo === 'proveedores' && (
                <div>
                    <button
                        onClick={() => setModuloActivo('inicio')}
                        style={{
                            backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff',
                            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem'
                        }}
                    >
                        ← Volver al Menú
                    </button>
                    <ProveedoresPage />
                </div>
            )}

            {/* VISTA USUARIOS */}
            {moduloActivo === 'usuarios' && (
                <div>
                    <button
                        onClick={() => setModuloActivo('inicio')}
                        style={{
                            backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff',
                            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem'
                        }}
                    >
                        ← Volver al Menú
                    </button>
                    <UsuariosPage />
                </div>
            )}

            {/* Toast Inferior */}
            <div style={{
                position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#111827', border: '1px solid #1f2937', padding: '0.5rem 1.25rem',
                borderRadius: '20px', fontSize: '0.8rem', color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                Sesión iniciada correctamente
            </div>
        </div>
    );
}