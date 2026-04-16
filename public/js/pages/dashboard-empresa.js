import { requireAuth, cargarUsuario, logout } from '../core/auth-guard.js';
import { api }       from '../core/api.js';
import { showToast } from '../components/toast.js';

requireAuth();

const MODALIDAD_LABEL = { presencial: 'Presencial', remoto: 'Remoto', hibrido: 'Híbrido' };

async function init() {
  const usuario = await cargarUsuario();
  if (!usuario) return;

  document.getElementById('nombre-empresa').textContent = usuario.nombre;

  cargarMisEmpleos();
}

async function cargarMisEmpleos() {
  const lista = document.getElementById('mis-empleos-lista');
  lista.innerHTML = '<p class="loading-text">Cargando vacantes...</p>';

  try {
    const data = await api.get('/empleos/mis-empleos');

    if (!data.empleos.length) {
      lista.innerHTML = '<p class="empty-text">Aún no has publicado ninguna vacante.</p>';
      return;
    }

    lista.innerHTML = data.empleos.map(e => `
      <div class="vacante-item">
        <div class="vacante-info">
          <h4>${e.titulo}</h4>
          <span>${e.ubicacion} · ${MODALIDAD_LABEL[e.modalidad] || e.modalidad} · ${e.salario}</span>
        </div>
        <span class="vacante-estado ${e.activo ? 'activa' : 'inactiva'}">${e.activo ? 'Activa' : 'Inactiva'}</span>
      </div>
    `).join('');
  } catch (err) {
    lista.innerHTML = '<p class="empty-text">Error al cargar las vacantes.</p>';
    showToast(err.message, 'error');
  }
}

async function handlePublicar(e) {
  e.preventDefault();

  const titulo      = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const ubicacion   = document.getElementById('ubicacion').value.trim();
  const salario     = document.getElementById('salario').value.trim();
  const modalidad   = document.getElementById('modalidad').value;

  if (!titulo || !descripcion || !ubicacion) {
    showToast('Título, descripción y ubicación son requeridos', 'error');
    return;
  }

  const btn = document.getElementById('btn-publicar');
  btn.disabled = true;
  btn.textContent = 'Publicando...';

  try {
    await api.post('/empleos', { titulo, descripcion, ubicacion, salario, modalidad });
    showToast('Vacante publicada correctamente', 'success');
    document.getElementById('form-vacante').reset();
    cargarMisEmpleos();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Publicar Vacante';
  }
}

document.getElementById('form-vacante').addEventListener('submit', handlePublicar);

window.logout = logout;

init();
