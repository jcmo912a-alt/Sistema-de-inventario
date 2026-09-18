import React from 'react';

const UsuariosTable = ({ usuarios, onEdit, onDelete }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#1f2937' }}>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No hay usuarios registrados.</td>
                        </tr>
                    ) : (
                        usuarios.map((usuario) => (
                            <tr key={usuario.idUsuarios || usuario.id}>
                                <td>{usuario.idUsuarios || usuario.id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.correo}</td>
                                <td>
                                    <button onClick={() => onEdit(usuario)} style={{ marginRight: '8px' }}>Editar</button>
                                    <button onClick={() => onDelete(usuario.idUsuarios || usuario.id)} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsuariosTable;