import { httpClient } from './httpClient.js';

export const getUsuarios = () => httpClient.get('/usuarios');

export const getUsuarioById = (id) => httpClient.get(`/usuarios/${id}`);

export const createUsuario = (usuarioData) => httpClient.post('/usuarios', usuarioData);

export const updateUsuario = (id, usuarioData) => httpClient.put(`/usuarios/${id}`, usuarioData);

export const deleteUsuario = (id) => httpClient.delete(`/usuarios/${id}`);