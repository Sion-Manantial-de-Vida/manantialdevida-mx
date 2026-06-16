/* ============================================================
   PANEL ADMINISTRATIVO · Iglesia Sion Manantial de Vida
   Prototipo interactivo con datos de demostración (en memoria)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sesión (Supabase Auth) ---------- */
  // Si no hay sesión válida, regresar al sitio público.
  // La seguridad real la imponen las reglas (RLS) de la base de datos:
  // sin sesión no se pueden leer/editar los datos protegidos.
  (async function guardSession() {
    if (!window.sbClient) return; // respaldo: modo local
    try {
      const { data } = await window.sbClient.auth.getSession();
      if (!data || !data.session) window.location.replace('index.html');
    } catch (e) {}
  })();

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  /* ============================================================
     DATOS DE DEMOSTRACIÓN
     ============================================================ */
  const data = {
    actividad: [
      { ico: 'msg', t: '<strong>Nueva petición de oración</strong> de María G.', ts: 'Hace 2 horas' },
      { ico: 'play', t: '<strong>Sermón publicado:</strong> «Ríos de agua viva»', ts: 'Ayer · 18:40' },
      { ico: 'cal', t: '<strong>Evento creado:</strong> Noche de Adoración', ts: 'Hace 2 días' },
      { ico: 'ann', t: '<strong>Anuncio activado:</strong> Campaña de ayuno', ts: 'Hace 3 días' },
      { ico: 'give', t: '<strong>Ofrenda recurrente</strong> registrada', ts: 'Hace 4 días' },
    ],
    equipo: [
      { id: 't1', nombre: 'Pastores Principales', cargo: 'Liderazgo general', bio: 'Acompañan a la congregación con enseñanza, cuidado y visión.' },
    ],
    horarios: [
      { id: 'h1', dia: 'Domingo', nombre: 'Oración pre-servicio', ini: '09:30', fin: '', activo: true },
      { id: 'h2', dia: 'Domingo', nombre: 'Iglesia Infantil', ini: '10:00', fin: '', activo: true },
      { id: 'h3', dia: 'Domingo', nombre: 'Servicio General', ini: '11:00', fin: '13:30', activo: true },
      { id: 'h4', dia: 'Domingo', nombre: 'Servicio Juvenil', ini: '17:00', fin: '', activo: false },
      { id: 'h5', dia: 'Miércoles', nombre: 'Estudio Bíblico', ini: '19:30', fin: '20:30', activo: true },
      { id: 'h6', dia: 'Viernes', nombre: 'Reunión de Jóvenes', ini: '19:00', fin: '', activo: true },
      { id: 'h7', dia: 'Viernes', nombre: 'Noche de Oración', ini: '20:00', fin: '', activo: true },
      { id: 'h8', dia: 'Sábado', nombre: 'Discipulado', ini: '17:00', fin: '', activo: true },
    ],
    sermones: [
      { id: 's1', titulo: 'Sube al monte: una vida con propósito', pred: 'Ps. Principal', serie: 'Nuevas Alturas', fecha: '2026-04-14', yt: 'https://youtu.be/xxxx', desc: 'Un llamado a buscar un nivel más alto en Dios.', dest: true },
      { id: 's2', titulo: 'Hogares firmes, generaciones fuertes', pred: 'Ps. Principal', serie: 'Familia', fecha: '2026-04-07', yt: '', desc: 'La familia como base de la iglesia.', dest: false },
      { id: 's3', titulo: 'Ríos de agua viva', pred: 'Ps. Invitado', serie: 'Manantial', fecha: '2026-03-31', yt: 'https://youtu.be/yyyy', desc: 'El fluir del Espíritu en el creyente.', dest: false },
      { id: 's4', titulo: 'Restauración: un nuevo nivel', pred: 'Ps. Principal', serie: 'Nuevas Alturas', fecha: '2026-03-24', yt: '', desc: 'Dios restaura lo que parecía perdido.', dest: false },
    ],
    eventos: [
      { id: 'e1', titulo: 'Noche de Adoración', fecha: '2026-06-20', hora: '19:00', lugar: 'Templo principal', estado: 'proximo', reg: true, desc: 'Una noche para adorar juntos en familia.' },
      { id: 'e2', titulo: 'Retiro de Matrimonios', fecha: '2026-07-12', hora: '09:00', lugar: 'Salón de eventos', estado: 'proximo', reg: true, desc: 'Fortaleciendo los lazos del hogar.' },
      { id: 'e3', titulo: 'Bautizos de Primavera', fecha: '2026-05-18', hora: '11:00', lugar: 'Templo principal', estado: 'pasado', reg: false, desc: 'Celebramos nuevas vidas en Cristo.' },
      { id: 'e4', titulo: 'Conferencia de Jóvenes', fecha: '2026-08-02', hora: '17:00', lugar: 'Por confirmar', estado: 'borrador', reg: false, desc: 'En preparación.' },
    ],
    anuncios: [
      { id: 'a1', titulo: 'Campaña de Ayuno y Oración', texto: 'Únete los próximos 21 días. Información en recepción.', ini: '2026-06-01', fin: '2026-06-21', orden: 1, activo: true },
      { id: 'a2', titulo: 'Inscripciones Escuela Bíblica', texto: 'Abiertas hasta fin de mes para todas las edades.', ini: '2026-06-03', fin: '2026-06-30', orden: 2, activo: true },
      { id: 'a3', titulo: 'Kermés Pro-Misiones', texto: 'Apoya nuestras misiones este domingo.', ini: '2026-05-10', fin: '2026-05-25', orden: 3, activo: false },
    ],
    peticiones: [
      { id: 'p1', nombre: 'María G.', tipo: 'Petición', msg: 'Pido oración por la salud de mi madre, que está hospitalizada.', estado: 'nueva', conf: false, nota: '' },
      { id: 'p2', nombre: 'Anónimo', tipo: 'Petición', msg: 'Por restauración en mi matrimonio.', estado: 'nueva', conf: true, nota: '' },
      { id: 'p3', nombre: 'Jorge R.', tipo: 'Acción de gracias', msg: '¡Conseguí trabajo! Gracias a Dios y a su oración.', estado: 'nueva', conf: false, nota: '' },
      { id: 'p4', nombre: 'Familia López', tipo: 'Petición', msg: 'Por nuestro hijo que viaja esta semana.', estado: 'orando', conf: false, nota: 'Contactados el lunes.' },
      { id: 'p5', nombre: 'Sofía M.', tipo: 'Petición', msg: 'Por sabiduría en una decisión importante.', estado: 'atendida', conf: false, nota: 'Acompañamiento pastoral realizado.' },
    ],
  };

  /* ---- Sincronización con el sitio público (localStorage) ---- */
  const store = (window.SionSite ? window.SionSite.load() : { content: {}, eventos: null, anuncios: null });
  data.content = store.content || {};
  if (Array.isArray(store.eventos)) data.eventos = store.eventos;
  if (Array.isArray(store.anuncios)) data.anuncios = store.anuncios;
  if (Array.isArray(store.blog)) data.blog = store.blog;
  if (Array.isArray(store.social)) data.social = store.social;
  function persist() {
    if (!window.SionSite) return;
    const payload = { content: data.content, eventos: data.eventos, anuncios: data.anuncios, blog: data.blog, social: data.social };
    window.SionSite.save(payload);               // copia local (cache)
    if (window.SionSite.pushRemote) {            // guardar en la nube (Supabase)
      window.SionSite.pushRemote(payload).then(function (r) {
        if (r && r.ok === false) console.warn('[Sion] No se pudo guardar en la nube:', r.error);
      });
    }
  }

  /* ============================================================
     NAVEGACIÓN ENTRE VISTAS
     ============================================================ */
  const titles = {
    dashboard: ['Dashboard', 'Resumen general de la iglesia'],
    info: ['Información de la Iglesia', 'Edita la información que se muestra en el sitio'],
    horarios: ['Horarios de servicios', 'Gestiona los servicios semanales'],
    sermones: ['Sermones', 'Administra los mensajes publicados'],
    eventos: ['Eventos', 'Crea y gestiona los eventos de la iglesia'],
    anuncios: ['Anuncios destacados', 'Anuncios que aparecen en el sitio público'],
    blog: ['Devocionales y Blog', 'Publicaciones que aparecen en “Aprende con nosotros”'],
    redes: ['Redes / Feed', 'Publicaciones del feed de redes sociales'],
    peticiones: ['Peticiones de Oración', 'Bandeja de peticiones recibidas'],
  };

  function go(view) {
    $$('.sb-link[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
    const t = titles[view] || ['', ''];
    $('#pageTitle').textContent = t[0];
    $('#pageSub').textContent = t[1];
    closeSidebar();
    window.scrollTo(0, 0);
    if ($('.content')) $('.content').scrollTop = 0;
  }
  $$('.sb-link[data-view]').forEach(b => b.addEventListener('click', () => go(b.dataset.view)));
  $$('.quick[data-quick]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.quick; go(v);
    if (v === 'sermones') openSermForm();
    else if (v === 'eventos') openEvtForm();
    else if (v === 'anuncios') openAnnForm();
  }));

  /* ---------- Sidebar móvil ---------- */
  const sidebar = $('#sidebar'), backdrop = $('#sbBackdrop');
  const openSidebar = () => { sidebar.classList.add('open'); backdrop.classList.add('show'); };
  const closeSidebar = () => { sidebar.classList.remove('open'); backdrop.classList.remove('show'); };
  $('#sbBurger').addEventListener('click', openSidebar);
  backdrop.addEventListener('click', closeSidebar);

  /* ---------- Logout ---------- */
  $('#logoutBtn').addEventListener('click', () => {
    confirmAction({
      title: 'Cerrar sesión',
      msg: '¿Deseas salir del panel administrativo?',
      btn: 'Cerrar sesión', danger: false,
      onYes: async () => {
        try { if (window.sbClient) await window.sbClient.auth.signOut(); } catch (e) {}
        try { sessionStorage.removeItem('sionAdminAuth'); } catch (e) {}
        window.location.href = 'index.html';
      }
    });
  });

  /* ============================================================
     TOASTS
     ============================================================ */
  function toast(msg, kind) {
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' ' + kind : '');
    const ico = kind === 'warn'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>';
    el.innerHTML = ico + '<span>' + esc(msg) + '</span>';
    $('#toastWrap').appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s, transform .3s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, 2600);
    setTimeout(() => el.remove(), 3000);
  }

  /* ============================================================
     MODALES
     ============================================================ */
  const formModal = $('#formModal'), confirmModal = $('#confirmModal');
  function openModal(m) { m.classList.add('show'); }
  function closeModal(m) { m.classList.remove('show'); }
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', (e) => closeModal(e.target.closest('.modal-overlay'))));
  $$('.modal-overlay').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); }));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal-overlay.show').forEach(closeModal); });

  let confirmCb = null;
  function confirmAction({ title, msg, btn, danger, onYes }) {
    $('#cfTitle').textContent = title; $('#cfMsg').textContent = msg;
    const c = $('#cfConfirm'); c.textContent = btn || 'Eliminar';
    c.className = 'btn ' + (danger === false ? 'btn-navy' : 'btn-danger');
    confirmCb = onYes; openModal(confirmModal);
  }
  $('#cfConfirm').addEventListener('click', () => { closeModal(confirmModal); if (confirmCb) confirmCb(); });

  // Modal de formulario genérico
  let saveCb = null;
  function openForm(title, bodyHTML, onSave) {
    $('#fmTitle').textContent = title;
    $('#fmBody').innerHTML = bodyHTML;
    saveCb = onSave; openModal(formModal);
    setTimeout(() => { const f = $('#fmBody input, #fmBody textarea, #fmBody select'); if (f) f.focus(); }, 60);
  }
  $('#fmSave').addEventListener('click', () => { if (saveCb) saveCb(); });
  const val = (n) => { const el = $('#fmBody [name="' + n + '"]'); return el ? el.value.trim() : ''; };
  const chk = (n) => { const el = $('#fmBody [name="' + n + '"]'); return el ? el.checked : false; };

  /* ---------- Selector de imagen reutilizable ----------
     Devuelve el HTML; llama wireImagePicker(prefix, onChange) tras abrir el modal.
     getVal() lee el valor actual vía closure expuesto en _imgVals. ---------- */
  const _imgVals = {};
  function imagePickerHTML(prefix, value, opts) {
    opts = opts || {};
    _imgVals[prefix] = value || '';
    const v = value || '';
    return `<div class="img-picker">
      <div class="img-drop${v ? ' has' : ''}" id="${prefix}Drop">
        <img id="${prefix}Prev" src="${esc(v)}" alt="" ${v ? '' : 'style="display:none"'} />
        <div class="img-drop-empty" ${v ? 'style="display:none"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg>
          <span>Arrastra una imagen o haz clic para subir</span>
          <small>${esc(opts.hint || 'JPG o PNG')}</small>
        </div>
      </div>
      <input type="file" id="${prefix}File" accept="image/*" hidden />
      <div class="img-picker-row">
        <button type="button" class="btn btn-ghost btn-sm" id="${prefix}Btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Subir imagen</button>
        <button type="button" class="btn btn-ghost btn-sm" id="${prefix}Clear" ${v ? '' : 'style="display:none"'}>Quitar</button>
      </div>
      <input class="img-url" id="${prefix}Url" placeholder="…o pega una URL de imagen" value="${esc(v && v.indexOf('data:') !== 0 ? v : '')}" />
    </div>`;
  }
  function wireImagePicker(prefix, onChange) {
    const drop = $('#' + prefix + 'Drop'), prev = $('#' + prefix + 'Prev'), emptyEl = $('#' + prefix + 'Drop .img-drop-empty');
    const fileInput = $('#' + prefix + 'File'), clearBtn = $('#' + prefix + 'Clear'), urlInput = $('#' + prefix + 'Url');
    if (!drop) return;
    function setImg(src) {
      _imgVals[prefix] = src || '';
      if (src) { prev.src = src; prev.style.display = ''; emptyEl.style.display = 'none'; drop.classList.add('has'); clearBtn.style.display = ''; }
      else { prev.src = ''; prev.style.display = 'none'; emptyEl.style.display = ''; drop.classList.remove('has'); clearBtn.style.display = 'none'; }
      if (onChange) onChange(_imgVals[prefix]);
    }
    function readF(f) { if (!f || !f.type.startsWith('image/')) { toast('Selecciona una imagen válida', 'warn'); return; } const r = new FileReader(); r.onload = () => { setImg(r.result); urlInput.value = ''; }; r.readAsDataURL(f); }
    $('#' + prefix + 'Btn').addEventListener('click', () => fileInput.click());
    drop.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => readF(fileInput.files[0]));
    clearBtn.addEventListener('click', e => { e.stopPropagation(); setImg(''); });
    urlInput.addEventListener('input', () => { if (urlInput.value.trim()) setImg(urlInput.value.trim()); });
    ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) readF(e.dataTransfer.files[0]); });
  }
  const imgVal = (prefix) => _imgVals[prefix] || '';

  /* ============================================================
     DASHBOARD render
     ============================================================ */
  function renderActivity() {
    const icos = {
      msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
      cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>',
      ann: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l16-7v16L3 13z"/></svg>',
      give: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    };
    $('#activityList').innerHTML = data.actividad.map(a =>
      `<div class="act-item"><span class="act-dot">${icos[a.ico] || ''}</span><div><div class="t">${a.t}</div><div class="ts">${esc(a.ts)}</div></div></div>`
    ).join('');
  }

  /* ============================================================
     EQUIPO (en Información)
     ============================================================ */
  function renderTeam() {
    $('#teamList').innerHTML = data.equipo.map(t => `
      <div class="list-row">
        <div class="list-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg></div>
        <div class="list-body"><div class="meta">${esc(t.cargo)}</div><h4>${esc(t.nombre)}</h4><div class="sub">${esc(t.bio)}</div></div>
        <div class="list-actions">
          <button class="btn-icon" data-edit-team="${t.id}" aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="btn-icon" data-del-team="${t.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>`).join('');
    $$('[data-edit-team]').forEach(b => b.addEventListener('click', () => openTeamForm(b.dataset.editTeam)));
    $$('[data-del-team]').forEach(b => b.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar miembro?', msg: 'Se quitará del equipo pastoral en el sitio.', onYes: () => { data.equipo = data.equipo.filter(x => x.id !== b.dataset.delTeam); renderTeam(); toast('Miembro eliminado', 'ok'); } });
    }));
  }
  function openTeamForm(id) {
    const t = data.equipo.find(x => x.id === id) || { nombre: '', cargo: '', bio: '' };
    openForm(id ? 'Editar miembro' : 'Agregar miembro', `
      <div class="field"><label>Foto</label><div class="list-thumb" style="width:100%;height:120px;border-radius:10px;">Arrastra una foto aquí (demo)</div></div>
      <div class="field"><label>Nombre</label><input name="nombre" value="${esc(t.nombre)}" placeholder="Nombre del pastor o líder" /></div>
      <div class="field"><label>Cargo</label><input name="cargo" value="${esc(t.cargo)}" placeholder="Ej. Pastores principales" /></div>
      <div class="field"><label>Biografía breve</label><textarea name="bio" placeholder="Una breve reseña…">${esc(t.bio)}</textarea></div>
    `, () => {
      const n = val('nombre'); if (!n) { toast('Escribe un nombre', 'warn'); return; }
      if (id) Object.assign(t, { nombre: n, cargo: val('cargo'), bio: val('bio') });
      else data.equipo.push({ id: 't' + Date.now(), nombre: n, cargo: val('cargo'), bio: val('bio') });
      renderTeam(); closeModal(formModal); toast('Equipo actualizado', 'ok');
    });
  }
  $('#addTeam').addEventListener('click', () => openTeamForm(null));

  // Poblar los campos de texto desde el contenido guardado
  function fillInfoForm() {
    document.querySelectorAll('#infoForm [data-c]').forEach(el => {
      const key = el.getAttribute('data-c');
      el.value = (data.content[key] != null) ? data.content[key] : '';
    });
    // selector de foto de pastores
    const holder = $('#pastorPhotoPicker');
    if (holder) {
      holder.innerHTML = imagePickerHTML('pastorImg', data.content['pastor.photo'] || '', { hint: 'Se muestra en la tarjeta de pastores' });
      wireImagePicker('pastorImg');
    }
  }
  fillInfoForm();
  $('#infoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelectorAll('#infoForm [data-c]').forEach(el => {
      data.content[el.getAttribute('data-c')] = el.value.trim();
    });
    data.content['pastor.photo'] = imgVal('pastorImg');
    persist();
    toast('Cambios guardados · visibles en el sitio público', 'ok');
  });

  /* ============================================================
     HORARIOS
     ============================================================ */
  function renderHorarios() {
    const ORDER = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const byDay = ORDER.filter(d => data.horarios.some(h => h.dia === d));
    const editIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
    const delIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';
    let rows = '';
    byDay.forEach(d => {
      const items = data.horarios.filter(h => h.dia === d);
      rows += `<tr class="day-sep"><td colspan="5"><span class="ds-day">${esc(d)}</span><span class="ds-count">${items.length} servicio${items.length === 1 ? '' : 's'}</span></td></tr>`;
      rows += items.map(h => `
        <tr class="${h.activo ? '' : 'is-off'}">
          <td class="t-strong">${esc(h.nombre)}${h.activo ? '' : ' <span class="pill pill-slate">Pausado</span>'}</td>
          <td>${esc(h.ini)}</td>
          <td>${h.fin ? esc(h.fin) : '<span class="muted">—</span>'}</td>
          <td><label class="switch"><input type="checkbox" data-toggle-h="${h.id}" ${h.activo ? 'checked' : ''}><span class="sl"></span></label></td>
          <td><div class="cell-actions">
            <button class="btn-icon" data-edit-h="${h.id}" aria-label="Editar">${editIco}</button>
            <button class="btn-icon" data-del-h="${h.id}" aria-label="Eliminar">${delIco}</button>
          </div></td>
        </tr>`).join('');
    });
    $('#horariosBody').innerHTML = rows || `<tr><td colspan="5"><div class="empty"><p>No hay servicios. Agrega el primero.</p></div></td></tr>`;
    $$('[data-toggle-h]').forEach(t => t.addEventListener('change', () => {
      const h = data.horarios.find(x => x.id === t.dataset.toggleH); h.activo = t.checked;
      toast(h.activo ? 'Servicio activado' : 'Servicio desactivado', 'ok');
    }));
    $$('[data-edit-h]').forEach(b => b.addEventListener('click', () => openHorarioForm(b.dataset.editH)));
    $$('[data-del-h]').forEach(b => b.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar servicio?', msg: 'Se quitará del sitio público.', onYes: () => { data.horarios = data.horarios.filter(x => x.id !== b.dataset.delH); renderHorarios(); toast('Servicio eliminado', 'ok'); } });
    }));
  }
  function openHorarioForm(id) {
    const h = data.horarios.find(x => x.id === id) || { dia: 'Domingo', nombre: '', ini: '', fin: '', activo: true };
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    openForm(id ? 'Editar servicio' : 'Agregar servicio', `
      <div class="field"><label>Día</label><select name="dia">${dias.map(d => `<option ${d === h.dia ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
      <div class="field"><label>Nombre del servicio</label><input name="nombre" value="${esc(h.nombre)}" placeholder="Ej. Servicio General" /></div>
      <div class="grid-2">
        <div class="field"><label>Hora inicio</label><input name="ini" type="time" value="${esc(h.ini)}" /></div>
        <div class="field"><label>Hora fin</label><input name="fin" type="time" value="${esc(h.fin)}" /></div>
      </div>
    `, () => {
      const n = val('nombre'); if (!n) { toast('Escribe el nombre del servicio', 'warn'); return; }
      if (id) Object.assign(h, { dia: val('dia'), nombre: n, ini: val('ini'), fin: val('fin') });
      else data.horarios.push({ id: 'h' + Date.now(), dia: val('dia'), nombre: n, ini: val('ini'), fin: val('fin'), activo: true });
      renderHorarios(); closeModal(formModal); toast('Horario guardado', 'ok');
    });
  }
  $('#addHorario').addEventListener('click', () => openHorarioForm(null));

  /* ============================================================
     SERMONES
     ============================================================ */
  const fmtDate = (d) => { if (!d) return ''; const [y, m, day] = d.split('-'); const mes = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']; return `${day} ${mes[+m - 1]} ${y}`; };

  function renderSermones() {
    const series = [...new Set(data.sermones.map(s => s.serie))];
    const preds = [...new Set(data.sermones.map(s => s.pred))];
    $('#sermSerie').innerHTML = '<option value="">Todas las series</option>' + series.map(s => `<option>${esc(s)}</option>`).join('');
    $('#sermPred').innerHTML = '<option value="">Todos los predicadores</option>' + preds.map(p => `<option>${esc(p)}</option>`).join('');
    const q = $('#sermSearch').value.toLowerCase(), fs = $('#sermSerie').value, fp = $('#sermPred').value;
    const list = data.sermones.filter(s =>
      (!q || s.titulo.toLowerCase().includes(q)) && (!fs || s.serie === fs) && (!fp || s.pred === fp));
    const wrap = $('#sermList');
    if (!list.length) { wrap.innerHTML = emptyState('No hay sermones que coincidan.'); return; }
    wrap.innerHTML = list.map(s => `
      <div class="list-row">
        <div class="list-thumb"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
        <div class="list-body">
          <div class="meta">${esc(s.serie)} · ${fmtDate(s.fecha)}</div>
          <h4>${esc(s.titulo)}</h4>
          <div class="sub">${esc(s.pred)}</div>
          <div class="list-tags">
            ${s.dest ? '<span class="pill pill-sand"><span class="dot"></span>Destacado</span>' : ''}
            ${s.yt ? '<span class="pill pill-red">YouTube</span>' : '<span class="pill pill-slate">Sin video</span>'}
          </div>
        </div>
        <div class="list-actions">
          <button class="btn-icon" data-edit-s="${s.id}" aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="btn-icon" data-del-s="${s.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>`).join('');
    $$('[data-edit-s]').forEach(b => b.addEventListener('click', () => openSermForm(b.dataset.editS)));
    $$('[data-del-s]').forEach(b => b.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar sermón?', msg: 'Esta acción no se puede deshacer.', onYes: () => { data.sermones = data.sermones.filter(x => x.id !== b.dataset.delS); renderSermones(); toast('Sermón eliminado', 'ok'); } });
    }));
  }
  function openSermForm(id) {
    const s = data.sermones.find(x => x.id === id) || { titulo: '', pred: '', serie: '', fecha: '', yt: '', desc: '', dest: false };
    openForm(id ? 'Editar sermón' : 'Nuevo sermón', `
      <div class="field"><label>Título</label><input name="titulo" value="${esc(s.titulo)}" placeholder="Título del mensaje" /></div>
      <div class="grid-2">
        <div class="field"><label>Predicador</label><input name="pred" value="${esc(s.pred)}" placeholder="Nombre" /></div>
        <div class="field"><label>Serie</label><input name="serie" value="${esc(s.serie)}" placeholder="Ej. Nuevas Alturas" /></div>
        <div class="field"><label>Fecha</label><input name="fecha" type="date" value="${esc(s.fecha)}" /></div>
        <div class="field"><label>Link de YouTube</label><input name="yt" value="${esc(s.yt)}" placeholder="https://youtu.be/…" /></div>
      </div>
      <div class="field"><label>Miniatura</label><div class="list-thumb" style="width:100%;height:120px;border-radius:10px;">Arrastra una imagen (demo)</div></div>
      <div class="field"><label>Descripción</label><textarea name="desc" placeholder="Breve resumen del mensaje">${esc(s.desc)}</textarea></div>
      <label class="field" style="flex-direction:row; align-items:center; gap:.7rem;"><label class="switch"><input type="checkbox" name="dest" ${s.dest ? 'checked' : ''}><span class="sl"></span></label><span style="font-weight:600;">Marcar como destacado</span></label>
    `, () => {
      const t = val('titulo'); if (!t) { toast('Escribe un título', 'warn'); return; }
      const obj = { titulo: t, pred: val('pred'), serie: val('serie'), fecha: val('fecha'), yt: val('yt'), desc: val('desc'), dest: chk('dest') };
      if (id) Object.assign(s, obj); else data.sermones.unshift(Object.assign({ id: 's' + Date.now() }, obj));
      renderSermones(); closeModal(formModal); toast('Sermón guardado', 'ok');
    });
  }
  $('#addSerm').addEventListener('click', () => openSermForm(null));
  ['sermSearch', 'sermSerie', 'sermPred'].forEach(id => $('#' + id).addEventListener('input', renderSermones));

  /* ============================================================
     EVENTOS
     ============================================================ */
  const estadoPill = { proximo: '<span class="pill pill-green"><span class="dot"></span>Próximo</span>', pasado: '<span class="pill pill-slate">Pasado</span>', borrador: '<span class="pill pill-amber">Borrador</span>' };
  /* ---- Eventos en Supabase (tabla 'events') ---- */
  function evtRow(e) { return { id: e.id, titulo: e.titulo, fecha: e.fecha, hora: e.hora, lugar: e.lugar, descripcion: e.desc, estado: e.estado, reg: !!e.reg }; }
  function eventsUpsert(e) { if (window.sbClient) window.sbClient.from('events').upsert(evtRow(e)).then(r => { if (r.error) console.warn('[Sion] evento no guardado en la nube:', r.error.message); }); }
  function eventsDelete(id) { if (window.sbClient) window.sbClient.from('events').delete().eq('id', id).then(r => { if (r.error) console.warn('[Sion] evento no borrado en la nube:', r.error.message); }); }
  /* ---- Helpers genéricos para CRUD en Supabase (secciones que mapean 1:1) ---- */
  function sbUpsert(table, row) { if (window.sbClient) window.sbClient.from(table).upsert(row).then(r => { if (r.error) console.warn('[Sion] ' + table + ' no guardado:', r.error.message); }); }
  function sbDelete(table, id) { if (window.sbClient) window.sbClient.from(table).delete().eq('id', id).then(r => { if (r.error) console.warn('[Sion] ' + table + ' no borrado:', r.error.message); }); }
  async function loadEventsRemote() {
    if (!window.sbClient) return;
    try {
      const { data: rows, error } = await window.sbClient.from('events').select('*').order('fecha', { ascending: true });
      if (error || !rows) return;
      data.eventos = rows.map(r => ({ id: r.id, titulo: r.titulo, fecha: r.fecha, hora: r.hora, lugar: r.lugar, desc: r.descripcion, estado: r.estado, reg: !!r.reg }));
      renderEventos();
    } catch (e) {}
  }
  function renderEventos() {
    const q = $('#evtSearch').value.toLowerCase(), fe = $('#evtEstado').value;
    const list = data.eventos.filter(e => (!q || e.titulo.toLowerCase().includes(q)) && (!fe || e.estado === fe));
    const wrap = $('#evtList');
    if (!list.length) { wrap.innerHTML = emptyState('No hay eventos que coincidan.'); return; }
    wrap.innerHTML = list.map(e => `
      <div class="list-row">
        <div class="list-thumb" style="background:var(--navy);color:var(--sand);"><div style="text-align:center;line-height:1;"><div style="font-family:var(--serif);font-size:1.5rem;">${e.fecha.split('-')[2]}</div><div style="font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;">${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][+e.fecha.split('-')[1]-1]}</div></div></div>
        <div class="list-body">
          <div class="meta">${fmtDate(e.fecha)} · ${esc(e.hora)}</div>
          <h4>${esc(e.titulo)}</h4>
          <div class="sub">${esc(e.lugar)}</div>
          <div class="list-tags">${estadoPill[e.estado] || ''}${e.reg ? '<span class="pill pill-navy">Con registro</span>' : ''}</div>
        </div>
        <div class="list-actions">
          <button class="btn-icon" data-edit-e="${e.id}" aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="btn-icon" data-del-e="${e.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>`).join('');
    $$('[data-edit-e]').forEach(b => b.addEventListener('click', () => openEvtForm(b.dataset.editE)));
    $$('[data-del-e]').forEach(b => b.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar evento?', msg: 'Esta acción no se puede deshacer.', onYes: () => { const delId = b.dataset.delE; data.eventos = data.eventos.filter(x => x.id !== delId); persist(); eventsDelete(delId); renderEventos(); toast('Evento eliminado', 'ok'); } });
    }));
  }
  function openEvtForm(id) {
    const e = data.eventos.find(x => x.id === id) || { titulo: '', fecha: '', hora: '', lugar: '', estado: 'proximo', reg: false, desc: '' };
    openForm(id ? 'Editar evento' : 'Nuevo evento', `
      <div class="field"><label>Título</label><input name="titulo" value="${esc(e.titulo)}" placeholder="Nombre del evento" /></div>
      <div class="grid-2">
        <div class="field"><label>Fecha</label><input name="fecha" type="date" value="${esc(e.fecha)}" /></div>
        <div class="field"><label>Hora</label><input name="hora" type="time" value="${esc(e.hora)}" /></div>
      </div>
      <div class="field"><label>Lugar</label><input name="lugar" value="${esc(e.lugar)}" placeholder="Lugar del evento" /></div>
      <div class="grid-2">
        <div class="field"><label>Estado</label><select name="estado">${['proximo','pasado','borrador'].map(s=>`<option value="${s}" ${s===e.estado?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}</select></div>
        <label class="field" style="flex-direction:row; align-items:center; gap:.7rem; margin-top:1.6rem;"><label class="switch"><input type="checkbox" name="reg" ${e.reg ? 'checked' : ''}><span class="sl"></span></label><span style="font-weight:600;">Registro abierto</span></label>
      </div>
      <div class="field"><label>Imagen</label><div class="list-thumb" style="width:100%;height:120px;border-radius:10px;">Arrastra una imagen (demo)</div></div>
      <div class="field"><label>Descripción</label><textarea name="desc">${esc(e.desc)}</textarea></div>
    `, () => {
      const t = val('titulo'); if (!t) { toast('Escribe un título', 'warn'); return; }
      const obj = { titulo: t, fecha: val('fecha'), hora: val('hora'), lugar: val('lugar'), estado: val('estado'), reg: chk('reg'), desc: val('desc') };
      let saved;
      if (id) { Object.assign(e, obj); saved = e; } else { saved = Object.assign({ id: 'e' + Date.now() }, obj); data.eventos.unshift(saved); }
      persist(); eventsUpsert(saved); renderEventos(); closeModal(formModal); toast('Evento guardado', 'ok');
    });
  }
  $('#addEvt').addEventListener('click', () => openEvtForm(null));
  ['evtSearch', 'evtEstado'].forEach(id => $('#' + id).addEventListener('input', renderEventos));

  /* ============================================================
     ANUNCIOS
     ============================================================ */
  function renderAnuncios() {
    $('#annList').innerHTML = data.anuncios.sort((a, b) => a.orden - b.orden).map(a => `
      <div class="list-row">
        <div class="list-thumb"${a.img ? ` style="background-image:url('${esc(a.img)}');background-size:cover;background-position:center;"` : ' style="background:var(--sand-soft);color:var(--sand-deep);"'}>${a.img ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11l16-7v16L3 13z"/></svg>'}</div>
        <div class="list-body">
          <div class="meta">${fmtDate(a.ini)} → ${fmtDate(a.fin)} · Orden ${a.orden}</div>
          <h4>${esc(a.titulo)}</h4>
          <div class="sub">${esc(a.texto)}</div>
          <div class="list-tags">${a.activo ? '<span class="pill pill-green"><span class="dot"></span>Activo</span>' : '<span class="pill pill-slate">Inactivo</span>'}${a.img ? '' : ' <span class="pill pill-amber">Sin imagen</span>'}</div>
        </div>
        <div class="list-actions">
          <button class="btn-icon" data-prev-a="${a.id}" aria-label="Vista previa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="btn-icon" data-edit-a="${a.id}" aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="btn-icon" data-del-a="${a.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>`).join('');
    $$('[data-edit-a]').forEach(b => b.addEventListener('click', () => openAnnForm(b.dataset.editA)));
    $$('[data-prev-a]').forEach(b => b.addEventListener('click', () => previewAnn(b.dataset.prevA)));
    $$('[data-del-a]').forEach(b => b.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar anuncio?', msg: 'Dejará de mostrarse en el sitio.', onYes: () => { const delId = b.dataset.delA; data.anuncios = data.anuncios.filter(x => x.id !== delId); persist(); sbDelete('announcements', delId); renderAnuncios(); toast('Anuncio eliminado', 'ok'); } });
    }));
  }
  function annBannerHTML(a) {
    return `<div class="ann-banner"><span class="ab-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11l16-7v16L3 13z"/></svg></span><div><h4>${esc(a.titulo || 'Título del anuncio')}</h4><p>${esc(a.texto || 'Texto del anuncio…')}</p></div></div>`;
  }
  function previewAnn(id) {
    const a = data.anuncios.find(x => x.id === id);
    openForm('Vista previa del anuncio', `<p class="muted" style="margin-bottom:14px;">Así se verá en la portada del sitio público:</p><div class="ann-preview">${annBannerHTML(a)}</div>`, () => closeModal(formModal));
    $('#fmSave').textContent = 'Cerrar';
  }
  function openAnnForm(id) {
    const a = data.anuncios.find(x => x.id === id) || { titulo: '', texto: '', img: '', ini: '', fin: '', orden: data.anuncios.length + 1, activo: true };
    let imgVal = a.img || '';
    openForm(id ? 'Editar anuncio' : 'Nuevo anuncio', `
      <div class="field"><label>Imagen del anuncio</label>
        <div class="img-picker" id="annImgPicker">
          <div class="img-drop${imgVal ? ' has' : ''}" id="annImgDrop">
            <img id="annImgPrev" src="${esc(imgVal)}" alt="" ${imgVal ? '' : 'style="display:none"'} />
            <div class="img-drop-empty" ${imgVal ? 'style="display:none"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg>
              <span>Arrastra una imagen o haz clic para subir</span>
              <small>JPG o PNG · se ve en la tarjeta pública</small>
            </div>
          </div>
          <input type="file" id="annImgFile" accept="image/*" hidden />
          <div class="img-picker-row">
            <button type="button" class="btn btn-ghost btn-sm" id="annImgBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Subir imagen</button>
            <button type="button" class="btn btn-ghost btn-sm" id="annImgClear" ${imgVal ? '' : 'style="display:none"'}>Quitar</button>
          </div>
          <input class="img-url" id="annImgUrl" placeholder="…o pega una URL de imagen" value="${esc(imgVal && imgVal.indexOf('data:') !== 0 ? imgVal : '')}" />
        </div>
      </div>
      <div class="field"><label>Título</label><input name="titulo" value="${esc(a.titulo)}" placeholder="Título del anuncio" oninput="document.getElementById('annLiveT').textContent=this.value||'Título del anuncio'" /></div>
      <div class="field"><label>Texto</label><textarea name="texto" placeholder="Mensaje breve" oninput="document.getElementById('annLiveP').textContent=this.value||'Texto del anuncio…'">${esc(a.texto)}</textarea></div>
      <div class="grid-2">
        <div class="field"><label>Inicio</label><input name="ini" type="date" value="${esc(a.ini)}" /></div>
        <div class="field"><label>Fin <span class="hint">(auto-expira)</span></label><input name="fin" type="date" value="${esc(a.fin)}" /></div>
        <div class="field"><label>Orden / prioridad</label><input name="orden" type="number" min="1" value="${a.orden}" /></div>
        <label class="field" style="flex-direction:row; align-items:center; gap:.7rem; margin-top:1.6rem;"><label class="switch"><input type="checkbox" name="activo" ${a.activo ? 'checked' : ''}><span class="sl"></span></label><span style="font-weight:600;">Activo</span></label>
      </div>
      <div class="field"><label>Vista previa de la tarjeta</label>
        <div class="ann-card-preview">
          <div class="acp-img" id="annLiveImg"${imgVal ? ` style="background-image:url('${esc(imgVal)}')"` : ''}>${imgVal ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l16-7v16L3 13z"/></svg>'}</div>
          <div class="acp-body"><h4 id="annLiveT">${esc(a.titulo || 'Título del anuncio')}</h4><p id="annLiveP">${esc(a.texto || 'Texto del anuncio…')}</p></div>
        </div>
      </div>
    `, () => {
      const t = val('titulo'); if (!t) { toast('Escribe un título', 'warn'); return; }
      const obj = { titulo: t, texto: val('texto'), img: imgVal, ini: val('ini'), fin: val('fin'), orden: +val('orden') || 1, activo: chk('activo') };
      let saved; if (id) { Object.assign(a, obj); saved = a; } else { saved = Object.assign({ id: 'a' + Date.now() }, obj); data.anuncios.push(saved); }
      persist(); sbUpsert('announcements', saved); renderAnuncios(); closeModal(formModal); toast('Anuncio guardado', 'ok');
    });
    // --- lógica del selector de imagen ---
    const drop = $('#annImgDrop'), prev = $('#annImgPrev'), emptyEl = $('#annImgDrop .img-drop-empty');
    const fileInput = $('#annImgFile'), clearBtn = $('#annImgClear'), urlInput = $('#annImgUrl'), liveImg = $('#annLiveImg');
    function setImg(src) {
      imgVal = src || '';
      if (imgVal) {
        prev.src = imgVal; prev.style.display = ''; emptyEl.style.display = 'none'; drop.classList.add('has'); clearBtn.style.display = '';
        liveImg.style.backgroundImage = `url('${imgVal}')`; liveImg.innerHTML = '';
      } else {
        prev.src = ''; prev.style.display = 'none'; emptyEl.style.display = ''; drop.classList.remove('has'); clearBtn.style.display = 'none';
        liveImg.style.backgroundImage = ''; liveImg.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l16-7v16L3 13z"/></svg>';
      }
    }
    function readFile(f) {
      if (!f || !f.type.startsWith('image/')) { toast('Selecciona una imagen válida', 'warn'); return; }
      const r = new FileReader(); r.onload = () => { setImg(r.result); urlInput.value = ''; }; r.readAsDataURL(f);
    }
    $('#annImgBtn').addEventListener('click', () => fileInput.click());
    drop.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => readFile(fileInput.files[0]));
    clearBtn.addEventListener('click', (e) => { e.stopPropagation(); setImg(''); });
    urlInput.addEventListener('input', () => { if (urlInput.value.trim()) setImg(urlInput.value.trim()); });
    ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => { if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });
  }
  $('#addAnn').addEventListener('click', () => openAnnForm(null));

  /* ============================================================
     BLOG / DEVOCIONALES
     ============================================================ */
  function renderBlog() {
    const q = ($('#blogSearch').value || '').toLowerCase();
    const list = (data.blog || []).filter(b => !q || (b.titulo || '').toLowerCase().includes(q) || (b.tipo || '').toLowerCase().includes(q));
    const wrap = $('#blogList');
    if (!list.length) { wrap.innerHTML = emptyState('No hay publicaciones que coincidan.'); return; }
    wrap.innerHTML = list.map(b => `
      <div class="list-row">
        <div class="list-thumb"${b.img ? ` style="background-image:url('${esc(b.img)}');background-size:cover;background-position:center;"` : ''}>${b.img ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 19H6a2 2 0 0 0-2 2"/></svg>'}</div>
        <div class="list-body">
          <div class="meta">${esc(b.tipo || 'Artículo')}${b.fecha ? ' · ' + fmtDate(b.fecha) : ''}</div>
          <h4>${esc(b.titulo)}</h4>
          <div class="sub">${esc(b.extracto || '')}</div>
          <div class="list-tags">${b.activo ? '<span class="pill pill-green"><span class="dot"></span>Publicado</span>' : '<span class="pill pill-slate">Borrador</span>'}${b.img ? '' : ' <span class="pill pill-amber">Sin imagen</span>'}</div>
        </div>
        <div class="list-actions">
          <button class="btn-icon" data-edit-b="${b.id}" aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="btn-icon" data-del-b="${b.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>`).join('');
    $$('[data-edit-b]').forEach(x => x.addEventListener('click', () => openBlogForm(x.dataset.editB)));
    $$('[data-del-b]').forEach(x => x.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar publicación?', msg: 'Dejará de mostrarse en el sitio.', onYes: () => { const delId = x.dataset.delB; data.blog = data.blog.filter(y => y.id !== delId); persist(); sbDelete('blog_posts', delId); renderBlog(); toast('Publicación eliminada', 'ok'); } });
    }));
  }
  function openBlogForm(id) {
    const b = (data.blog || []).find(x => x.id === id) || { tipo: 'Devocional', titulo: '', extracto: '', cuerpo: '', autor: '', fecha: '', img: '', activo: true };
    openForm(id ? 'Editar publicación' : 'Nueva publicación', `
      <div class="field"><label>Imagen</label><div id="blogImgHolder">${imagePickerHTML('blogImg', b.img || '', { hint: 'Portada del devocional o artículo' })}</div></div>
      <div class="grid-2">
        <div class="field"><label>Tipo / categoría</label><input name="tipo" value="${esc(b.tipo)}" placeholder="Devocional, Blog · Familia…" /></div>
        <div class="field"><label>Fecha</label><input name="fecha" type="date" value="${esc(b.fecha)}" /></div>
      </div>
      <div class="field"><label>Título</label><input name="titulo" value="${esc(b.titulo)}" placeholder="Título de la publicación" /></div>
      <div class="field"><label>Autor</label><input name="autor" value="${esc(b.autor)}" placeholder="Nombre del autor" /></div>
      <div class="field"><label>Extracto <span class="hint">(resumen en la tarjeta)</span></label><textarea name="extracto">${esc(b.extracto)}</textarea></div>
      <div class="field"><label>Contenido completo</label><textarea name="cuerpo" style="min-height:140px;">${esc(b.cuerpo)}</textarea></div>
      <label class="field" style="flex-direction:row; align-items:center; gap:.7rem;"><label class="switch"><input type="checkbox" name="activo" ${b.activo ? 'checked' : ''}><span class="sl"></span></label><span style="font-weight:600;">Publicado (visible en el sitio)</span></label>
    `, () => {
      const t = val('titulo'); if (!t) { toast('Escribe un título', 'warn'); return; }
      const obj = { tipo: val('tipo') || 'Artículo', titulo: t, extracto: val('extracto'), cuerpo: val('cuerpo'), autor: val('autor'), fecha: val('fecha'), img: imgVal('blogImg'), activo: chk('activo') };
      let saved; if (id) { Object.assign(b, obj); saved = b; } else { saved = Object.assign({ id: 'b' + Date.now() }, obj); data.blog.unshift(saved); }
      persist(); sbUpsert('blog_posts', saved); renderBlog(); closeModal(formModal); toast('Publicación guardada', 'ok');
    });
    wireImagePicker('blogImg');
  }
  $('#addBlog').addEventListener('click', () => openBlogForm(null));
  $('#blogSearch').addEventListener('input', renderBlog);

  /* ============================================================
     REDES / FEED SOCIAL
     ============================================================ */
  function renderSocial() {
    const wrap = $('#socialList');
    const list = data.social || [];
    if (!list.length) { wrap.innerHTML = emptyState('No hay publicaciones en el feed.'); return; }
    const redPill = { youtube: '<span class="pill pill-red">YouTube</span>', facebook: '<span class="pill pill-navy">Facebook</span>' };
    wrap.innerHTML = list.map(p => `
      <div class="list-row">
        <div class="list-thumb"${p.img ? ` style="background-image:url('${esc(p.img)}');background-size:cover;background-position:center;"` : ''}>${p.img ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg>'}</div>
        <div class="list-body">
          <div class="meta">Abre en ${p.red === 'youtube' ? 'YouTube' : 'Facebook'}</div>
          <h4>${esc(p.titulo || 'Publicación')}</h4>
          <div class="sub">${esc(p.url || (p.red === 'youtube' ? 'Canal de YouTube de la iglesia' : 'Página de Facebook de la iglesia'))}</div>
          <div class="list-tags">${redPill[p.red] || ''}${p.img ? '' : ' <span class="pill pill-amber">Sin imagen</span>'}</div>
        </div>
        <div class="list-actions">
          <button class="btn-icon" data-edit-soc="${p.id}" aria-label="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
          <button class="btn-icon" data-del-soc="${p.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>`).join('');
    $$('[data-edit-soc]').forEach(x => x.addEventListener('click', () => openSocialForm(x.dataset.editSoc)));
    $$('[data-del-soc]').forEach(x => x.addEventListener('click', () => {
      confirmAction({ title: '¿Eliminar publicación?', msg: 'Dejará de mostrarse en el feed.', onYes: () => { const delId = x.dataset.delSoc; data.social = data.social.filter(y => y.id !== delId); persist(); sbDelete('social_feed', delId); renderSocial(); toast('Publicación eliminada', 'ok'); } });
    }));
  }
  function openSocialForm(id) {
    const p = (data.social || []).find(x => x.id === id) || { titulo: '', img: '', red: 'youtube', url: '' };
    openForm(id ? 'Editar publicación' : 'Nueva publicación', `
      <div class="field"><label>Imagen de la publicación</label><div id="socImgHolder">${imagePickerHTML('socImg', p.img || '', { hint: 'Miniatura del post' })}</div></div>
      <div class="field"><label>Título</label><input name="titulo" value="${esc(p.titulo)}" placeholder="Ej. Servicio dominical en vivo" /></div>
      <div class="field"><label>¿A dónde redirige?</label>
        <div class="radio-row" style="display:flex; gap:10px;">
          <label class="radio-pill" style="flex:1;"><input type="radio" name="red" value="youtube" ${p.red !== 'facebook' ? 'checked' : ''} /><span>YouTube</span></label>
          <label class="radio-pill" style="flex:1;"><input type="radio" name="red" value="facebook" ${p.red === 'facebook' ? 'checked' : ''} /><span>Facebook</span></label>
        </div>
      </div>
      <div class="field"><label>Enlace específico <span class="hint">(opcional)</span></label><input name="url" value="${esc(p.url)}" placeholder="Déjalo vacío para usar el canal/página principal" /></div>
    `, () => {
      const t = val('titulo'); if (!t) { toast('Escribe un título', 'warn'); return; }
      const red = (document.querySelector('#fmBody [name="red"]:checked') || {}).value || 'youtube';
      const obj = { titulo: t, img: imgVal('socImg'), red: red, url: val('url') };
      let saved; if (id) { Object.assign(p, obj); saved = p; } else { saved = Object.assign({ id: 's' + Date.now() }, obj); data.social.push(saved); }
      persist(); sbUpsert('social_feed', saved); renderSocial(); closeModal(formModal); toast('Publicación guardada', 'ok');
    });
    wireImagePicker('socImg');
  }
  $('#addSocial').addEventListener('click', () => openSocialForm(null));

  /* ============================================================
     PETICIONES
     ============================================================ */
  const stateLabel = { nueva: 'Nueva', orando: 'En oración', atendida: 'Atendida' };
  function updateBadge() {
    const n = data.peticiones.filter(p => p.estado === 'nueva').length;
    const b = $('#reqBadge');
    if (n) { b.textContent = n; b.style.display = ''; } else b.style.display = 'none';
  }
  function renderPeticiones() {
    const q = $('#reqSearch').value.toLowerCase(), f = $('#reqFilter').value;
    const list = data.peticiones.filter(p => (!q || p.msg.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q)) && (!f || p.estado === f));
    const wrap = $('#reqList');
    if (!list.length) { wrap.innerHTML = emptyState('No hay peticiones que coincidan.'); updateBadge(); return; }
    wrap.innerHTML = list.map(p => `
      <div class="req-card ${p.estado}">
        <div class="req-head">
          <span class="req-name">${p.conf ? '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' : ''}${esc(p.nombre)}</span>
          <span class="pill ${p.tipo === 'Petición' ? 'pill-navy' : 'pill-green'}">${esc(p.tipo)}</span>
        </div>
        <p class="req-msg">${esc(p.msg)}</p>
        <div class="req-foot">
          <div class="req-state-row">
            ${['nueva', 'orando', 'atendida'].map(st => `<button class="state-btn ${p.estado === st ? 'on' : ''}" data-state="${st}" data-set-state="${p.id}">${stateLabel[st]}</button>`).join('')}
          </div>
          <label class="conf-tag pill ${p.conf ? 'pill-red' : 'pill-slate'}" style="cursor:pointer;"><input type="checkbox" data-conf="${p.id}" ${p.conf ? 'checked' : ''} style="display:none;">${p.conf ? 'Confidencial' : 'Marcar confidencial'}</label>
        </div>
        <input class="req-note" data-note="${p.id}" value="${esc(p.nota)}" placeholder="Nota interna privada…" />
      </div>`).join('');
    const updateReq = (id, fields) => {
      if (window.sbClient) window.sbClient.from('prayer_requests').update(fields).eq('id', id).then(r => { if (r.error) console.warn('[Sion] petición no actualizada:', r.error.message); });
    };
    $$('[data-set-state]').forEach(b => b.addEventListener('click', () => {
      const p = data.peticiones.find(x => x.id === b.dataset.setState); p.estado = b.dataset.state; renderPeticiones(); toast('Estado: ' + stateLabel[p.estado], 'ok');
      updateReq(p.id, { estado: p.estado });
    }));
    $$('[data-conf]').forEach(c => c.addEventListener('change', () => {
      const p = data.peticiones.find(x => x.id === c.dataset.conf); p.conf = c.checked; renderPeticiones(); toast(p.conf ? 'Marcada confidencial' : 'Confidencialidad quitada', 'ok');
      updateReq(p.id, { confidencial: p.conf });
    }));
    $$('[data-note]').forEach(i => i.addEventListener('change', () => {
      const p = data.peticiones.find(x => x.id === i.dataset.note); p.nota = i.value; toast('Nota guardada', 'ok');
      updateReq(p.id, { nota: i.value });
    }));
    updateBadge();
  }
  ['reqSearch', 'reqFilter'].forEach(id => $('#' + id).addEventListener('input', renderPeticiones));

  /* ---------- util ---------- */
  function emptyState(msg) {
    return `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg><p>${esc(msg)}</p></div>`;
  }

  /* ============================================================
     INIT
     ============================================================ */
  renderActivity();
  renderTeam();
  renderHorarios();
  renderSermones();
  renderEventos();
  renderAnuncios();
  renderPeticiones();
  renderBlog();
  renderSocial();

  /* ============================================================
     CARGA DESDE LA NUBE (Supabase)
     ============================================================ */
  // 1) Trae las peticiones de oración reales recibidas desde el sitio.
  (async function loadPeticionesRemote() {
    if (!window.sbClient) return;
    try {
      const { data: rows, error } = await window.sbClient
        .from('prayer_requests').select('*').order('created_at', { ascending: false });
      if (error || !rows) return;
      const tipoMap = { peticion: 'Petición', gracias: 'Acción de gracias' };
      data.peticiones = rows.map(r => ({
        id: r.id,
        nombre: r.nombre || 'Anónimo',
        tipo: tipoMap[r.tipo] || 'Petición',
        msg: r.mensaje || '',
        estado: r.estado || 'nueva',
        conf: !!r.confidencial,
        nota: r.nota || ''
      }));
      renderPeticiones();
    } catch (e) { /* sin conexión: se quedan los datos locales */ }
  })();

  // 1b) Trae los eventos reales desde la tabla 'events'.
  loadEventsRemote();

  // 1c) Trae anuncios, blog y redes desde sus tablas.
  (async function loadListsRemote() {
    if (!window.sbClient) return;
    const map = [['announcements', 'anuncios', renderAnuncios], ['blog_posts', 'blog', renderBlog], ['social_feed', 'social', renderSocial]];
    for (const [table, key, render] of map) {
      try {
        const { data: rows, error } = await window.sbClient.from(table).select('*');
        if (!error && Array.isArray(rows)) { data[key] = rows; render(); }
      } catch (e) {}
    }
  })();

  // 2) Trae el contenido más reciente del sitio (si fue editado en otro dispositivo).
  (async function syncContentRemote() {
    if (!window.SionSite || !window.SionSite.pullRemote) return;
    try {
      const remote = await window.SionSite.pullRemote();
      if (!remote) return;
      const remoteStr = JSON.stringify(remote);
      const localStr = localStorage.getItem(window.SionSite.KEY);
      if (remoteStr !== localStr) {
        localStorage.setItem(window.SionSite.KEY, remoteStr);
        if (!sessionStorage.getItem('sionAdminSyncedOnce')) {
          sessionStorage.setItem('sionAdminSyncedOnce', '1');
          location.reload();
        }
      }
    } catch (e) {}
  })();
})();
