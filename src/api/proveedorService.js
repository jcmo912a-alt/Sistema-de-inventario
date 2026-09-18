import { httpClient } from './httpClient.js';

// Aísla la ruta /api/proveedores del backend 
// para que los componentes de React no necesiten conocer la URL exacta.
const RECURSO = '/proveedores';

export const proveedorService = {
  listar: () => httpClient.get(RECURSO),
  obtener: (id) => httpClient.get(`${RECURSO}/${id}`),
  crear: (proveedor) => httpClient.post(RECURSO, proveedor),
  actualizar: (id, proveedor) => httpClient.put(`${RECURSO}/${id}`, proveedor),
  eliminar: (id) => httpClient.delete(`${RECURSO}/${id}`),
};
