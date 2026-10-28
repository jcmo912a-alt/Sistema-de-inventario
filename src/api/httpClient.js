import { API_BASE_URL } from '../config.js';

/**
 * Cierra la sesión local y redirige al login.
 * Se usa cuando el servidor responde 401 (token vencido o inválido).
 */
function cerrarSesionPorVencimiento() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

/**
 * Realiza una petición HTTP hacia el backend y normaliza la respuesta.
 * Centraliza el armado de la URL, el envío de JSON, la autenticación JWT
 * y el manejo de errores.
 */
async function request(path, options = {}) {
  // 1. Obtener el token JWT guardado en localStorage
  const token = localStorage.getItem('token');

  // 2. Preparar los encabezados incluyendo el Bearer Token si existe
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Sesión vencida o token inválido: limpiar sesión y volver al login.
  // Se excluyen los endpoints de autenticación (ahí un 401 es "credenciales inválidas").
  if (response.status === 401 && !path.includes('/auth/')) {
    cerrarSesionPorVencimiento();
    throw new Error('Sesión vencida. Inicia sesión nuevamente.');
  }

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