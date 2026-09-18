import { API_BASE_URL } from '../config.js';

/**
 * Realiza una petición HTTP hacia el backend y normaliza la respuesta.
 * Centraliza el armado de la URL, el envío de JSON y el manejo de errores
 * para que los servicios (proveedorService, productoService, categoriaService) no repitan
 * esta misma lógica en cada operación GET/POST/PUT/DELETE.
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  // Un DELETE exitoso suele responder 204 No Content, sin cuerpo JSON.
  if (response.status === 204) {
    return null;
  }

  const tipoContenido = response.headers.get('content-type') || '';
  const cuerpo = tipoContenido.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const mensaje =
      (cuerpo && (cuerpo.mensaje || cuerpo.message || cuerpo.error)) ||
      `Error ${response.status} al comunicarse con el servidor.`;
    throw new Error(mensaje);
  }

  return cuerpo;
}

// Objeto con los cuatro verbos HTTP usados por las operaciones CRUD.
export const httpClient = {
  get: (path) => request(path),
  post: (path, datos) => request(path, { method: 'POST', body: JSON.stringify(datos) }),
  put: (path, datos) => request(path, { method: 'PUT', body: JSON.stringify(datos) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
