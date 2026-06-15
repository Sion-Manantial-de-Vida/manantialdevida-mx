/* ============================================================
   SION · Eventos (dropdown, pestañas, carrusel, calendario),
   Anuncios y carruseles genéricos.
   ============================================================ */
(function () {
  'use strict';
  const P = window.__sionPub || {};
  const $ = P.$ || ((s, c) => (c || document).querySelector(s));
  const $$ = P.$$ || ((s, c) => Array.from((c || document).querySelectorAll(s)));
  const esc = P.esc || (s => String(s == null ? '' : s));
  const site = P.site || (window.SionSite ? window.SionSite.load() : { eventos: [], anuncios: [], content: {} });
  const MES = P.MES || ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESL = P.MESL || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const today = new Date();
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parseY = (s) => { const p = (s || '').split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  const fmtLong = (d) => `${d.getDate()} de ${MESL[d.getMonth()].toLowerCase()}, ${d.getFullYear()}`;

  // Servicios recurrentes — siempre marcados en calendario y tarjetas
  const SERVICIOS = [
    { titulo: 'Servicio General', weekday: 0, hora: '11:00 AM', lugar: 'Templo principal', desc: 'Nuestra reunión principal: alabanza, Palabra y ministerio para toda la familia.', servicio: true },
    { titulo: 'Estudio Bíblico', weekday: 3, hora: '7:30 PM', lugar: 'Templo principal', desc: 'Un alto a media semana para orar y crecer juntos en la Palabra.', servicio: true },
  ];
  const eventos = (site.eventos || []).filter(e => e.estado === 'proximo')
    .map(e => ({ titulo: e.titulo, date: parseY(e.fecha), hora: e.hora, lugar: e.lugar, desc: e.desc, reg: e.reg, servicio: false }))
    .sort((a, b) => a.date - b.date);

  // icono
  const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const icoClock = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>';
  const icoPin = '<path d="M12 21s-7-5-7-11a7 7 0 0 1 14 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>';

  // Próximas ocurrencias de servicios dentro de N días
  function serviceOccurrences(fromDate, days) {
    const out = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(fromDate); d.setDate(d.getDate() + i);
      SERVICIOS.forEach(s => { if (d.getDay() === s.weekday) out.push(Object.assign({}, s, { date: new Date(d) })); });
    }
    return out;
  }

  function eventCardHTML(e, opts) {
    opts = opts || {};
    const d = e.date;
    const dd = d ? d.getDate() : '';
    const mm = d ? MES[d.getMonth()] : '';
    const badge = e.servicio ? '<span class="evt-chip svc">Servicio semanal</span>'
      : (e.reg ? '<span class="evt-chip reg">Registro abierto</span>' : '');
    const dateLine = e.servicio
      ? `Cada ${['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][e.weekday]}`
      : (d ? fmtLong(d) : '');
    return `<article class="evt-card${e.servicio ? ' is-svc' : ''}">
      <div class="evt-date"><span class="ec-day">${dd}</span><span class="ec-mon">${mm}</span></div>
      <div class="evt-body">
        <h3>${esc(e.titulo)}</h3>
        <div class="evt-line">${esc(dateLine)}</div>
        <div class="evt-meta">
          <span>${svg(icoClock)}${esc(e.hora || '')}</span>
          <span>${svg(icoPin)}${esc(e.lugar || '')}</span>
        </div>
        <p>${esc(e.desc || '')}</p>
        ${badge}
      </div>
    </article>`;
  }

  /* ---------- Carrusel genérico ---------- */
  function initCarousel(el) {
    const track = $('[data-track]', el);
    const prev = $('[data-prev]', el);
    const next = $('[data-next]', el);
    if (!track) return;
    const step = () => {
      const card = track.querySelector(':scope > *');
      return card ? card.getBoundingClientRect().width + 18 : 320;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      const overflow = max > 4;
      el.classList.toggle('no-carousel', !overflow);
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    if (prev) prev.addEventListener('click', () => { track.scrollBy({ left: -track.clientWidth * 0.92, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', () => { track.scrollBy({ left: track.clientWidth * 0.92, behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    setTimeout(update, 60); setTimeout(update, 400);
    el._cupd = update;
  }
  $$('[data-carousel]').forEach(initCarousel);

  /* ============================================================
     EVENTOS — pestañas Todos / Esta semana / Calendario
     ============================================================ */
  const grid = $('#eventsGrid');
  const paneCards = $('#eventsPaneCards');
  const paneCal = $('#eventsPaneCal');
  const emptyMsg = $('#eventsEmpty');

  function renderCards(mode) {
    let list;
    if (mode === 'proximos') {
      const svcs = serviceOccurrences(today, 7);
      const wk = eventos.filter(e => { const diff = (e.date - today) / 86400000; return diff >= -0.5 && diff <= 7; });
      list = svcs.concat(wk).sort((a, b) => a.date - b.date);
    } else {
      // todos: servicios recurrentes + eventos especiales próximos
      const svcs = SERVICIOS.map(s => Object.assign({}, s));
      list = svcs.concat(eventos);
    }
    if (!list.length) { grid.innerHTML = ''; if (emptyMsg) emptyMsg.style.display = 'block'; }
    else { if (emptyMsg) emptyMsg.style.display = 'none'; grid.innerHTML = list.map(e => eventCardHTML(e)).join(''); }
    const car = grid.closest('[data-carousel]');
    if (car && car._cupd) { grid.scrollLeft = 0; setTimeout(car._cupd, 30); }
  }

  /* ---------- Calendario ---------- */
  let calY = today.getFullYear(), calM = today.getMonth();
  const calGrid = $('#calGrid'), calTitle = $('#calTitle'), calDetail = $('#calDetail');

  function eventsOn(d) {
    const out = [];
    SERVICIOS.forEach(s => { if (d.getDay() === s.weekday) out.push(Object.assign({}, s, { date: new Date(d) })); });
    eventos.forEach(e => { if (e.date.getFullYear() === d.getFullYear() && e.date.getMonth() === d.getMonth() && e.date.getDate() === d.getDate()) out.push(e); });
    return out;
  }
  function renderCal() {
    if (!calGrid) return;
    calTitle.textContent = `${MESL[calM]} ${calY}`;
    const first = new Date(calY, calM, 1);
    const start = first.getDay();
    const days = new Date(calY, calM + 1, 0).getDate();
    let html = DOW.map(d => `<span class="cal-dow">${d}</span>`).join('');
    for (let i = 0; i < start; i++) html += `<span class="cal-cell empty"></span>`;
    for (let day = 1; day <= days; day++) {
      const d = new Date(calY, calM, day);
      const evs = eventsOn(d);
      const hasSvc = evs.some(e => e.servicio), hasEvt = evs.some(e => !e.servicio);
      const isToday = ymd(d) === ymd(today);
      let cls = 'cal-cell';
      if (evs.length) cls += ' has';
      if (hasEvt) cls += ' fill-evt'; else if (hasSvc) cls += ' fill-svc';
      if (isToday) cls += ' today';
      html += `<button class="${cls}" data-day="${day}">${day}</button>`;
    }
    calGrid.innerHTML = html;
    $$('.cal-cell.has', calGrid).forEach(c => c.addEventListener('click', () => {
      $$('.cal-cell', calGrid).forEach(x => x.classList.remove('sel'));
      c.classList.add('sel');
      showDay(new Date(calY, calM, +c.dataset.day));
    }));
    // selecciona el primer día con eventos por defecto
    const firstHas = $('.cal-cell.has', calGrid);
    if (firstHas) { firstHas.classList.add('sel'); showDay(new Date(calY, calM, +firstHas.dataset.day)); }
    else calDetail.innerHTML = `<div class="cal-empty">${svg(icoClock)}<p>Selecciona un día con eventos para ver los detalles.</p></div>`;
  }
  function showDay(d) {
    const evs = eventsOn(d);
    if (!evs.length) { calDetail.innerHTML = `<div class="cal-empty">${svg(icoClock)}<p>No hay eventos este día.</p></div>`; return; }
    calDetail.innerHTML = evs.map(e => eventCardHTML(e)).join('');
  }
  const calPrev = $('#calPrev'), calNext = $('#calNext');
  if (calPrev) calPrev.addEventListener('click', () => { calM--; if (calM < 0) { calM = 11; calY--; } renderCal(); });
  if (calNext) calNext.addEventListener('click', () => { calM++; if (calM > 11) { calM = 0; calY++; } renderCal(); });

  // Pestañas
  let calBuilt = false;
  $$('#eventsTabs .events-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('#eventsTabs .events-tab').forEach(t => t.classList.toggle('active', t === tab));
    const v = tab.dataset.etab;
    if (v === 'calendario') {
      paneCards.style.display = 'none'; paneCal.style.display = 'block';
      if (!calBuilt) { renderCal(); calBuilt = true; }
    } else {
      paneCal.style.display = 'none'; paneCards.style.display = 'block';
      renderCards(v);
    }
  }));
  renderCards('todos');

  /* ============================================================
     HERO — dropdown "Próximos Eventos" (eventos de la semana)
     ============================================================ */
  (function heroDD() {
    const dd = $('#heroEventsDD'), btn = $('#heroEventsBtn'), pop = $('#heroEventsPop'), list = $('#hepList');
    if (!dd) return;
    const svcs = serviceOccurrences(today, 7);
    const wk = eventos.filter(e => { const diff = (e.date - today) / 86400000; return diff >= -0.5 && diff <= 7; });
    const week = svcs.concat(wk).sort((a, b) => a.date - b.date).slice(0, 5);
    if (!week.length) {
      list.innerHTML = `<p class="hep-none">No hay eventos esta semana. ¡Mira todos nuestros eventos!</p>`;
    } else {
      list.innerHTML = week.map(e => `<a href="#eventos" class="hep-item">
        <span class="hep-d"><b>${e.date.getDate()}</b><span>${MES[e.date.getMonth()]}</span></span>
        <span class="hep-info"><strong>${esc(e.titulo)}</strong><span>${DOW[e.date.getDay()]} · ${esc(e.hora || '')}</span></span>
      </a>`).join('');
    }
    const open = () => { dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const close = () => { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); dd.classList.contains('open') ? close() : open(); });
    document.addEventListener('click', (e) => { if (!dd.contains(e.target)) close(); });
    $$('.hep-item, #hepMore', pop).forEach(a => a.addEventListener('click', close));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ============================================================
     ANUNCIOS — tarjetas tipo blog con imagen
     ============================================================ */
  (function anuncios() {
    const wrap = $('#announceList');
    if (!wrap) return;
    const empty = $('#announceEmpty');
    const list = (site.anuncios || []).filter(a => a.activo).sort((a, b) => (a.orden || 0) - (b.orden || 0));
    if (!list.length) { wrap.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    const range = (a) => {
      if (!a.ini) return '';
      const di = parseY(a.ini); const df = a.fin ? parseY(a.fin) : null;
      if (df && (di.getMonth() !== df.getMonth() || di.getDate() !== df.getDate()))
        return `${di.getDate()} ${MES[di.getMonth()]} – ${df.getDate()} ${MES[df.getMonth()]}`;
      return `${di.getDate()} ${MES[di.getMonth()]} ${di.getFullYear()}`;
    };
    wrap.innerHTML = list.map(a => `
      <article class="ann-card">
        ${a.img ? `<div class="ann-img"><img src="${esc(a.img)}" alt="${esc(a.titulo)}" loading="lazy" /></div>` : '<div class="ann-img ann-noimg">' + svg('<path d="M3 11l16-7v16L3 13z"/>') + '</div>'}
        <div class="ann-content">
          ${a.ini ? `<span class="ann-date">${esc(range(a))}</span>` : ''}
          <h3>${esc(a.titulo)}</h3>
          <p>${esc(a.texto || '')}</p>
        </div>
      </article>`).join('');
  })();
})();
