export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

export function clearErrs(...ids) {
  ids.forEach(id => showErr(id, false));
}

export function markField(inputId, valid) {
  const el = document.getElementById(inputId);
  if (el) el.classList.toggle('error-field', !valid);
}
