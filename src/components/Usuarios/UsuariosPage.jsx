import React, { useState, useEffect } from 'react';
import UsuariosTable from './UsuariosTable';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../api/usuariosService';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({ id: null, nombre: '', correo: '', contrasena: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const data = await getUsuarios();
            setUsuarios(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateUsuario(formData.id, {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    contrasena: formData.contrasena
                });
                alert('Usuario actualizado con éxito');
            } else {
                await createUsuario({
                    nombre: formData.nombre,
                    correo: formData.correo,
                    contrasena: formData.contrasena
                });
                alert('Usuario registrado con éxito');
            }
            resetForm();
            fetchUsuarios();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (usuario) => {
        setIsEditing(true);
        setFormData({
            id: usuario.idUsuarios || usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            contrasena: ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este usuario?')) {
            try {
                await deleteUsuario(id);
                alert('Usuario eliminado con éxito');
                fetchUsuarios();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({ id: null, nombre: '', correo: '', contrasena: '' });
        setIsEditing(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Usuarios</h2>



            {/* Estado de carga y errores */}
            {loading && <p>Cargando usuarios...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Tabla de usuarios */}
            {!loading && !error && (
                <UsuariosTable usuarios={usuarios} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

export default Usuarios;