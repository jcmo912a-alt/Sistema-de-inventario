import './Mensaje.css';

/**
 * Mensaje informativo, de éxito o de error reutilizable.
 * No se renderiza nada si no hay texto (evita huecos vacíos en el layout).
 */
function Mensaje({ tipo = 'info', texto, onCerrar }) {
  if (!texto) return null;

  return (
    <div className={`mensaje mensaje--${tipo}`} role="alert">
      <span>{texto}</span>
      {onCerrar && (
        <button type="button" className="mensaje__cerrar" onClick={onCerrar} aria-label="Cerrar mensaje">
          ×
        </button>
      )}
    </div>
  );
}

export default Mensaje;
