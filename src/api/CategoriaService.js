import { httpClient } from './httpClient.js';

// Aísla la ruta /api/categorias del backend
// para que los componentes de React no necesiten conocer la URL exacta.
const RECURSO = '/public/categorias';

export const categoriaService = {
    listar: () => httpClient.get(RECURSO),
    obtener: (id) => httpClient.get(`${RECURSO}/${id}`),
    crear: (categoria) => httpClient.post(RECURSO, categoria),
    actualizar: (id, categoria) => httpClient.put(`${RECURSO}/${id}`, categoria),
    eliminar: (id) => httpClient.delete(`${RECURSO}/${id}`),
};