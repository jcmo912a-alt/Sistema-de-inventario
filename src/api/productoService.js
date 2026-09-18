import { httpClient } from './httpClient.js';

// Aísla la ruta /api/productos del backend 
// para que los componentes de React no necesiten conocer la URL exacta.
const RECURSO = '/productos';

export const productoService = {
  listar: () => httpClient.get(RECURSO),
  obtener: (id) => httpClient.get(`${RECURSO}/${id}`),
  crear: (producto) => httpClient.post(RECURSO, producto),
  actualizar: (id, producto) => httpClient.put(`${RECURSO}/${id}`, producto),
  eliminar: (id) => httpClient.delete(`${RECURSO}/${id}`),
};
