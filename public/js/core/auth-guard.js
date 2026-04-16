import { api }     from './api.js';
import { session } from './session.js';

export function requireAuth() {
  if (!session.isLoggedIn()) {
    session.clear();
    window.location.href = 'login.html';
  }
}

export async function cargarUsuario() {
  try {
    const data = await api.get('/auth/me');
    return data.usuario;
  } catch {
    session.clear();
    window.location.href = 'login.html';
  }
}

export function logout() {
  session.clear();
  window.location.href = 'login.html';
}
