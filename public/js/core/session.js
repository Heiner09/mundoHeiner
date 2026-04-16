const TOKEN_KEY   = 'token';
const USUARIO_KEY = 'usuario';

export const session = {
  save(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },
  getToken()   { return localStorage.getItem(TOKEN_KEY); },
  getUsuario() {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  },
  isLoggedIn() { return !!localStorage.getItem(TOKEN_KEY); },
};
