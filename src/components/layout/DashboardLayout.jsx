import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import '../Dashboard.css';

export default function DashboardLayout({ children }) {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (e) {
        setUsuario({ nombre: usuarioGuardado });
      }
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const esAdmin = usuario?.rol === 'ADMIN';

  return (
    <div className="dashboard-container">
      {/* Sidebar Lateral */}
      <aside className="dashboard-sidebar">
        <h1 className="sidebar-title">Inventario App</h1>
        <nav className="sidebar-nav">
          <a href="#inicio" className="nav-item active">Inicio</a>
          <a href="#productos" className="nav-item">Productos</a>
          <a href="#proveedores" className="nav-item">Proveedores</a>
          <a href="#categorias" className="nav-item">Categorías</a>
          {esAdmin && (
            <Link to="/usuarios" className="nav-item">Usuarios</Link>
          )}
        </nav>
        <button onClick={handleCerrarSesion} className="btn-logout">
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Panel de Control</h2>
          <div className="user-badge">
            Usuario: <strong>{usuario?.nombre || usuario?.correo || 'Juan Camilo Muñoz'}</strong>
          </div>
        </header>

        <section className="dashboard-content">
          {children || <Outlet />}
        </section>
      </main>
    </div>
  );
}