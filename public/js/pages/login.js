import { api }       from '../core/api.js';
import { session }   from '../core/session.js';
import { showToast } from '../components/toast.js';
import { isEmail, showErr, clearErrs, markField } from '../utils/validators.js';

/* ---------- STAGE NAVIGATION ---------- */
let currentStage = 'stage-login';

function goToStage(targetId) {
  const current = document.getElementById(currentStage);
  const target  = document.getElementById(targetId);

  current.classList.add('exit-left');

  setTimeout(() => {
    current.classList.remove('active', 'exit-left');
    current.style.display = 'none';

    target.style.display   = 'block';
    target.style.opacity   = '0';
    target.style.transform = 'translateX(40px)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.style.opacity   = '1';
        target.style.transform = 'translateX(0)';
        target.classList.add('active');
      });
    });

    currentStage = targetId;
  }, 300);
}

/* ---------- TYPE SELECTION ---------- */
let selectedType = null;

function selectType(type) {
  selectedType = type;
  document.getElementById('card-persona').classList.remove('selected');
  document.getElementById('card-empresa').classList.remove('selected');
  document.getElementById('card-' + type).classList.add('selected');

  const btn = document.getElementById('btn-continue-type');
  btn.style.opacity       = '1';
  btn.style.pointerEvents = 'auto';
}

function goToRegister() {
  if (!selectedType) return;
  goToStage(selectedType === 'persona' ? 'stage-reg-persona' : 'stage-reg-empresa');
}

/* ---------- TOGGLE PASSWORD ---------- */
function togglePass(inputId, iconEl) {
  const input = document.getElementById(inputId);
  const icon  = iconEl.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

/* ---------- REDIRECCIÓN ---------- */
function redirigir(tipo) {
  window.location.href = tipo === 'persona'
    ? 'dashboard-persona.html'
    : 'dashboard-empresa.html';
}

/* ---------- LOGIN HANDLER ---------- */
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;

  clearErrs('login-email-err', 'login-pass-err');
  markField('login-email', true);
  markField('login-pass', true);

  let valid = true;
  if (!isEmail(email)) { showErr('login-email-err', true); markField('login-email', false); valid = false; }
  if (!pass)           { showErr('login-pass-err',  true); markField('login-pass',  false); valid = false; }
  if (!valid) return;

  try {
    const data = await api.post('/auth/login', { email, password: pass });
    session.save(data.token, data.usuario);
    showToast('Bienvenido, ' + data.usuario.nombre, 'success');
    setTimeout(() => redirigir(data.usuario.tipo), 1000);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ---------- REGISTER HANDLER ---------- */
async function handleRegister(tipo) {
  const p      = tipo === 'persona' ? 'rp' : 're';
  const nombre = document.getElementById(`${p}-name`).value.trim();
  const email  = document.getElementById(`${p}-email`).value.trim();
  const pass   = document.getElementById(`${p}-pass`).value;
  const pass2  = document.getElementById(`${p}-pass2`).value;

  clearErrs(`${p}-name-err`, `${p}-email-err`, `${p}-pass-err`, `${p}-pass2-err`);
  [`${p}-name`, `${p}-email`, `${p}-pass`, `${p}-pass2`].forEach(id => markField(id, true));

  let valid = true;
  if (!nombre)           { showErr(`${p}-name-err`,  true); markField(`${p}-name`,  false); valid = false; }
  if (!isEmail(email))   { showErr(`${p}-email-err`, true); markField(`${p}-email`, false); valid = false; }
  if (pass.length < 8)   { showErr(`${p}-pass-err`,  true); markField(`${p}-pass`,  false); valid = false; }
  if (pass !== pass2)    { showErr(`${p}-pass2-err`, true); markField(`${p}-pass2`, false); valid = false; }
  if (!valid) return;

  try {
    const data = await api.post('/auth/register', { nombre, email, password: pass, tipo });
    session.save(data.token, data.usuario);
    showToast('¡Cuenta creada! Bienvenido.', 'success');
    setTimeout(() => redirigir(data.usuario.tipo), 1000);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/* ---------- EXPONER A window.* (requerido por onclick inline del HTML) ---------- */
window.goToStage      = goToStage;
window.selectType     = selectType;
window.goToRegister   = goToRegister;
window.togglePass     = togglePass;
window.handleLogin    = handleLogin;
window.handleRegister = handleRegister;
window.showToast      = showToast; // usado en botones Apple/Google
