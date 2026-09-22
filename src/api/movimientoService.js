import { httpClient } from './httpClient.js';

// Aísla la ruta /api/movimientos del backend.
// El historial solo se consulta y se registra (no se edita ni se elimina).
const RECURSO = '/movimientos';

export const movimientoService = {
    listar: () => httpClient.get(RECURSO),
    listarPorProducto: (idProducto) => httpClient.get(`${RECURSO}?idProducto=${idProducto}`),
    registrar: (movimiento) => httpClient.post(RECURSO, movimiento),
};