import React from 'react';

// Tabla de usuarios con el mismo formato que la tabla de Proveedores
const th = {
    textAlign: 'left', padding: '1rem', color: '#38bdf8',
    fontSize: '0.85rem', fontWeight: 600,
};
const td = {
    padding: '1rem', fontSize: '0.875rem', color: '#ffffff',
    borderBottom: '1px solid #1f2937',
};
const btnEliminar = {
    backgroundColor: '#2a1216', border: '1px solid #7f1d1d', color: '#f87171',
    padding: '0.3rem 0.9rem', borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.8rem',
};

export default function UsuarioTable({ usuarios, onDelete }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0b0f19' }}>
                <thead>
                    <tr style={{ backgroundColor: '#1a2332' }}>
                        <th style={th}>ID</th>
                        <th style={th}>Nombre</th>
                        <th style={th}>Correo</th>
                        <th style={th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length === 0 ? (
                        <tr>
                            <td style={{ ...td, color: '#9ca3af' }} colSpan={4}>
                                No hay usuarios registrados
                            </td>
                        </tr>
                    ) : (
                        usuarios.map((u) => (
                            <tr key={u.id}>
                                <td style={td}>{u.id}</td>
                                <td style={td}>{u.nombre}</td>
                                <td style={td}>{u.correo}</td>
                                <td style={td}>

                                    <button style={btnEliminar} onClick={() => onDelete(u.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}