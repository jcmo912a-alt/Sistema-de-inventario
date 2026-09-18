import './Boton.css';

/**
 * Botón reutilizable con variantes visuales.
 * variante: 'primario' | 'secundario' | 'peligro'
 * Props no reconocidas (type, disabled, onClick...) se pasan directo al <button>.
 */
function Boton({ children, variante = 'primario', ...resto }) {
  return (
    <button type="button" className={`boton boton--${variante}`} {...resto}>
      {children}
    </button>
  );
}

export default Boton;
