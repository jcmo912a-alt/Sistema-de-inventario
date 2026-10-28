import { httpClient } from './httpClient.js';

// Consulta GET /api/dashboard: el backend decide qué indicadores devolver según el rol del token.
export const dashboardService = {
    obtener: () => httpClient.get('/dashboard'),
};