import './Header.css';

/**
 * Encabezado con la marca de la aplicación y la navegación entre
 * los dos módulos disponibles: Productos y Proveedores.
 */
function Header({ modulo, onCambiarModulo }) {
  return (
    <header className="cabecera">
      <div className="cabecera__marca">
        <span className="cabecera__logo">IN</span>
        <div>
          <h1>Sistema de Gestión de Inventario</h1>
          <p>Alimentos · Proveedores y Productos</p>
        </div>
      </div>
      <nav className="cabecera__nav" aria-label="Navegación principal">
        <button
          type="button"
          className={`cabecera__enlace ${modulo === 'productos' ? 'cabecera__enlace--activo' : ''}`}
          onClick={() => onCambiarModulo('productos')}
        >
          Productos
        </button>
        <button
          type="button"
          className={`cabecera__enlace ${modulo === 'proveedores' ? 'cabecera__enlace--activo' : ''}`}
          onClick={() => onCambiarModulo('proveedores')}
        >
          Proveedores
        </button>
      </nav>
    </header>
  );
}

export default Header;
