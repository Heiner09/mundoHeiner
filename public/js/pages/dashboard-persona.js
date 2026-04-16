import { requireAuth, cargarUsuario, logout } from '../core/auth-guard.js';
import { api }       from '../core/api.js';
import { showToast } from '../components/toast.js';

requireAuth();

const MODALIDAD_LABEL = { presencial: 'Presencial', remoto: 'Remoto', hibrido: 'Híbrido' };

async function init() {
  const usuario = await cargarUsuario();
  if (!usuario) return;

  document.getElementById('nombre-usuario').textContent = usuario.nombre;

  cargarEmpleos();
}

async function cargarEmpleos() {
  const grid = document.getElementById('empleos-grid');
  grid.innerHTML = '<p class="loading-text">Cargando empleos...</p>';

  try {
    const data = await api.get('/empleos');

    if (!data.empleos.length) {
      grid.innerHTML = '<p class="empty-text">No hay empleos disponibles por el momento.</p>';
      return;
    }

    grid.innerHTML = data.empleos.map(e => `
      <div class="empleo-card">
        <div class="empleo-header">
          <h3 class="empleo-titulo">${e.titulo}</h3>
          <span class="empleo-badge">${MODALIDAD_LABEL[e.modalidad] || e.modalidad}</span>
        </div>
        <p class="empleo-empresa"><i class="fas fa-building"></i> ${e.empresa?.nombre || 'Empresa'}</p>
        <p class="empleo-ubicacion"><i class="fas fa-map-marker-alt"></i> ${e.ubicacion}</p>
        <p class="empleo-salario"><i class="fas fa-coins"></i> ${e.salario}</p>
        <p class="empleo-desc">${e.descripcion}</p>
        <button class="btn-postular" onclick="postular('${e._id}')">Postular</button>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p class="empty-text">Error al cargar los empleos.</p>';
    showToast(err.message, 'error');
  }
}

function postular(empleoId) {
  showToast('Función de postulación próximamente', 'info');
}

window.postular = postular;
window.logout   = logout;

init();
