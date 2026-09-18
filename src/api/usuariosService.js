import { httpClient } from './httpClient.js';

const API_URL = 'http://localhost:8080/api/usuarios';

// Función auxiliar para obtener las cabeceras con el token JWT
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Ajusta según dónde guardes el token
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getUsuarios = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener la lista de usuarios');
    return response.json();
};

export const getUsuarioById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener el usuario');
    return response.json();
};

export const createUsuario = async (usuarioData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(usuarioData)
    });
    if (!response.ok) throw new Error('Error al registrar el usuario');
    return response.json();
};

export const updateUsuario = async (id, usuarioData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(usuarioData)
    });
    if (!response.ok) throw new Error('Error al actualizar el usuario');
    return response.json();
};

export const deleteUsuario = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar el usuario');
    return response;
};