/**
 * Genera y abre el diálogo de impresión con la hoja de vida en formato Harvard.
 * @param {Object} cv - { datosPersonales, perfilLaboral, educacion, referencias }
 */
export function exportarCVPDF(cv) {
  const dp  = cv.datosPersonales  || {};
  const edu = cv.educacion        || [];
  const ref = cv.referencias      || [];
  const per = cv.perfilLaboral    || '';

  const nombre   = (dp.nombre    || '').toUpperCase();
  const cedula   = dp.cedula     || '';
  const ciudad   = dp.ciudad     || '';
  const telefono = dp.telefono   || '';
  const direccion= dp.direccion  || '';
  const fn       = dp.fechaNacimiento || {};
  const fechaNac = (fn.dia && fn.mes && fn.anio) ? `${fn.dia} de ${fn.mes} de ${fn.anio}` : '';

  /* ── Educación ── */
  const eduRows = edu.filter(e => e.titulo || e.institucion).map(e => {
    const grad = [e.fechaGrad?.mes, e.fechaGrad?.anio].filter(Boolean).join(' ');
    return `
    <div class="entry">
      <span class="entry-titulo">${e.titulo || '—'}</span>
      <span class="entry-sub">${e.institucion || ''}${grad ? ` · ${grad}` : ''}</span>
      ${e.certNombre ? `<span class="entry-cert">Certificado: ${e.certNombre}</span>` : ''}
    </div>
  `;
  }).join('') || '<p class="vacio">—</p>';

  /* ── Referencias ── */
  const refRows = ref.filter(r => r.nombre).map(r => `
    <div class="ref-card">
      <p class="ref-nombre">${r.nombre}</p>
      ${r.ocupacion ? `<p class="ref-dato">${r.ocupacion}</p>` : ''}
      ${r.direccion ? `<p class="ref-dato">${r.direccion}</p>` : ''}
      ${r.telefono  ? `<p class="ref-dato">Tel: ${r.telefono}</p>` : ''}
    </div>
  `).join('') || '<p class="vacio">—</p>';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Hoja de Vida – ${nombre}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      color: #000;
      background: #fff;
      padding: 18mm 22mm 18mm 22mm;
      max-width: 210mm;
      margin: 0 auto;
    }

    /* ── Encabezado ── */
    .hv-nombre {
      font-size: 20pt;
      font-weight: bold;
      text-align: center;
      letter-spacing: 2px;
      margin-bottom: 4pt;
    }
    .hv-hr      { border: none; border-top: 2.5px solid #000; margin: 8pt 0 12pt; }
    .hv-hr-thin { border: none; border-top: 1px solid #666;   margin: 5pt 0 10pt; }

    /* ── Secciones ── */
    .seccion {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4pt;
    }

    /* ── Datos personales: tabla 2 columnas ── */
    .dp-tabla { width: 100%; border-collapse: collapse; margin-bottom: 4pt; }
    .dp-tabla td {
      padding: 3pt 6pt 3pt 0;
      font-size: 10.5pt;
      vertical-align: top;
      width: 50%;
    }
    .dp-label { font-weight: bold; }

    /* ── Perfil ── */
    .perfil-txt { text-align: justify; line-height: 1.6; font-size: 10.5pt; }

    /* ── Educación ── */
    .entry         { margin-bottom: 10pt; }
    .entry-titulo  { display: block; font-weight: bold; font-size: 10.5pt; }
    .entry-sub     { display: block; font-style: italic; color: #333; font-size: 10pt; }
    .entry-cert    { display: block; font-size: 9.5pt; color: #555; margin-top: 2pt; }

    /* ── Referencias: grid 2 columnas ── */
    .refs-tabla { width: 100%; border-collapse: collapse; }
    .refs-tabla td { vertical-align: top; padding: 0 12pt 10pt 0; width: 50%; }
    .ref-nombre { font-weight: bold; font-size: 10.5pt; margin-bottom: 2pt; }
    .ref-dato   { font-size: 10pt; color: #333; }

    .vacio { color: #666; font-style: italic; font-size: 10pt; }

    @media print {
      body { padding: 0; }
      @page { margin: 18mm 22mm; }
    }
  </style>
</head>
<body>

  <!-- Nombre -->
  <p class="hv-nombre">${nombre || 'SIN NOMBRE'}</p>
  <hr class="hv-hr"/>

  <!-- Datos personales -->
  <p class="seccion">Datos Personales</p>
  <hr class="hv-hr-thin"/>
  <table class="dp-tabla">
    <tr>
      ${cedula   ? `<td><span class="dp-label">Cédula:</span> ${cedula}</td>` : '<td></td>'}
      ${fechaNac ? `<td><span class="dp-label">Fecha de nacimiento:</span> ${fechaNac}</td>` : '<td></td>'}
    </tr>
    <tr>
      ${ciudad   ? `<td><span class="dp-label">Ciudad:</span> ${ciudad}</td>` : '<td></td>'}
      ${telefono ? `<td><span class="dp-label">Teléfono:</span> ${telefono}</td>` : '<td></td>'}
    </tr>
    ${direccion ? `<tr><td colspan="2"><span class="dp-label">Dirección:</span> ${direccion}</td></tr>` : ''}
  </table>

  <!-- Perfil laboral -->
  <p class="seccion">Perfil Laboral</p>
  <hr class="hv-hr-thin"/>
  <p class="perfil-txt">${per || '—'}</p>
  <br/>

  <!-- Educación -->
  <p class="seccion">Educación</p>
  <hr class="hv-hr-thin"/>
  ${eduRows}

  <!-- Referencias -->
  <p class="seccion">Referencias Personales</p>
  <hr class="hv-hr-thin"/>
  <table class="refs-tabla">
    <tr>
      ${ref.filter(r => r.nombre).map(r => `
        <td>
          <p class="ref-nombre">${r.nombre}</p>
          ${r.ocupacion ? `<p class="ref-dato">${r.ocupacion}</p>` : ''}
          ${r.direccion ? `<p class="ref-dato">${r.direccion}</p>` : ''}
          ${r.telefono  ? `<p class="ref-dato">Tel: ${r.telefono}</p>` : ''}
        </td>
      `).join('') || '<td class="vacio">—</td>'}
    </tr>
  </table>

  <script>
    window.onload = function () { window.print(); };
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.open();
  win.document.write(html);
  win.document.close();
}
