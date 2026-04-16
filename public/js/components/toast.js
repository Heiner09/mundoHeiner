let toastTimer;

function ensureToast() {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.innerHTML = '<i id="toast-icon"></i><span id="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  return toast;
}

export function showToast(msg, type = 'info') {
  const toast = ensureToast();
  const msgEl = document.getElementById('toast-msg');
  const icon  = document.getElementById('toast-icon');

  toast.className = 'toast toast-' + type;
  msgEl.textContent = msg;
  icon.className = type === 'success' ? 'fas fa-check-circle'
                 : type === 'error'   ? 'fas fa-times-circle'
                 :                      'fas fa-info-circle';

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
