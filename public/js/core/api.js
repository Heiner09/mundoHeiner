const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error en la solicitud');
  return data;
}

export const api = {
  post:   (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put:    (endpoint, body) => request(endpoint, { method: 'PUT',  body: JSON.stringify(body) }),
  get:    (endpoint)       => request(endpoint),
  upload: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res  = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers, body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al subir archivo');
    return data;
  },
};
