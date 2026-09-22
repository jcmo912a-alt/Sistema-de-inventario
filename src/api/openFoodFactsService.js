import { httpClient } from './httpClient.js';

const RECURSO = '/externo/productos';

export const openFoodFactsService = {
    /**
     * Consulta la API externa a través de nuestro backend.
     * GET /api/externo/openfoodfacts/{codigoBarras}
     */
    buscarPorCodigoBarras: (codigoBarras) => httpClient.get(`${RECURSO}/${codigoBarras}`),
};