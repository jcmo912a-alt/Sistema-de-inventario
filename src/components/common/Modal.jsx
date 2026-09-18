import React from 'react';
import './Modal.css'; // o la ruta donde guardaste el CSS

export default function Modal({ abierto, titulo, onCerrar, children }) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenedor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          <h3>{titulo}</h3>
          <button className="btn-cerrar-modal" onClick={onCerrar}>
            ✕
          </button>
        </div>
        <div className="modal-cuerpo">
          {children}
        </div>
      </div>
    </div>
  );
}