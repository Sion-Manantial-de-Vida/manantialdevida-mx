/* ============================================================
   IGLESIA SION · MANANTIAL DE VIDA — interacciones + Tweaks
   ============================================================ */
(function () {
  'use strict';
  const root = document.documentElement;
  const body = document.body;

  /* ============================================================
     CONTENIDO EDITABLE — aplica overrides guardados por el admin
     ============================================================ */
  (function applySiteContent() {
    if (!window.SionSite) return;
    const site = window.SionSite.load();
    const c = site.content || {};
    // texto
    document.querySelectorAll('[data-content]').forEach(el => {
      const key = el.getAttribute('data-content');
      if (c[key] != null && c[key] !== '') el.textContent = c[key];
    });
    // enlaces
    document.querySelectorAll('[data-content-href]').forEach(el => {
      const key = el.getAttribute('data-content-href');
      if (c[key]) el.setAttribute('href', c[key]);
    });
    // enlaces sociales (youtube/facebook) por atributo data-social
    document.querySelectorAll('[data-social]').forEach(el => {
      const key = 'social.' + el.getAttribute('data-social');
      if (c[key]) el.setAttribute('href', c[key]);
    });
    // correo (texto + mailto)
    document.querySelectorAll('[data-content-mail]').forEach(el => {
      const key = el.getAttribute('data-content-mail');
      if (c[key]) { el.textContent = c[key]; el.setAttribute('href', 'mailto:' + c[key]); }
    });

    const escA = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

    /* ---- Foto de pastores (imagen + tamaño) ---- */
    const pPhoto = document.getElementById('pastorPhoto');
    const pCard = document.getElementById('pastorCard');
    if (pPhoto) {
      const sizes = { pequena: '220px', mediana: '300px', grande: '400px' };
      const w = sizes[c['pastor.photoSize']] || '300px';
      if (pCard) pCard.style.setProperty('--pastor-w', w);
      if (c['pastor.photo']) {
        pPhoto.style.backgroundImage = `url('${c['pastor.photo']}')`;
        pPhoto.classList.add('has-photo');
        pPhoto.removeAttribute('data-label');
      }
    }

    /* ---- Blog / Devocionales ---- */
    const bg = document.getElementById('blogGrid');
    if (bg) {
      const mes = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const fmtB = (d) => { if (!d) return ''; const p = d.split('-'); return `${+p[2]} ${mes[+p[1] - 1]} ${p[0]}`; };
      const list = (site.blog || []).filter(b => b.activo);
      const empty = document.getElementById('blogEmpty');
      if (!list.length) { bg.innerHTML = ''; if (empty) empty.style.display = 'block'; }
      else {
        if (empty) empty.style.display = 'none';
        bg.innerHTML = list.map(b => `
          <article class="card blog-card reveal in" data-blog="${escA(b.id)}" style="padding:0; overflow:hidden; cursor:pointer;">
            <div class="blog-img"${b.img ? ` style="background-image:url('${escA(b.img)}')"` : ''}>${b.img ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 19H6a2 2 0 0 0-2 2"/></svg>'}</div>
            <div style="padding:clamp(22px,3vw,30px);">
              <div class="blog-tag">${escA(b.tipo || 'Artículo')}${b.fecha ? ' · ' + fmtB(b.fecha) : ''}</div>
              <h3 style="font-size:1.3rem; margin:.4rem 0 .5rem;">${escA(b.titulo)}</h3>
              <p>${escA(b.extracto || '')}</p>
            </div>
          </article>`).join('');
        // modal al hacer click
        bg.querySelectorAll('[data-blog]').forEach(card => card.addEventListener('click', () => {
          const b = list.find(x => x.id === card.getAttribute('data-blog'));
          if (b) openBlogModal(b, fmtB);
        }));
      }
    }

    /* ---- Feed social ---- */
    const sg = document.getElementById('socialGrid');
    if (sg) {
      const list = (site.social || []);
      const yt = c['social.youtube'] || '#', fb = c['social.facebook'] || '#';
      const icoYt = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.5-.4-5.1a2.6 2.6 0 0 0-1.8-1.8C19 4.7 12 4.7 12 4.7s-7 0-8.8.4A2.6 2.6 0 0 0 1.4 6.9C1 8.5 1 12 1 12s0 3.5.4 5.1a2.6 2.6 0 0 0 1.8 1.8c1.8.4 8.8.4 8.8.4s7 0 8.8-.4a2.6 2.6 0 0 0 1.8-1.8C23 15.5 23 12 23 12zM9.8 15.3V8.7l5.7 3.3z"/></svg>';
      const icoFb = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>';
      sg.innerHTML = list.map(p => {
        const isYt = p.red === 'youtube';
        const href = (p.url && p.url.trim()) ? p.url.trim() : (isYt ? yt : fb);
        return `<a class="feed-item${isYt ? ' yt' : ' fb'}" href="${escA(href)}" target="_blank" rel="noopener"${p.img ? ` style="background-image:url('${escA(p.img)}')"` : ''}>
          ${p.img ? '' : '<span class="feed-ph">' + (isYt ? icoYt : icoFb) + '</span>'}
          <span class="feed-badge">${isYt ? icoYt : icoFb}</span>
          <span class="feed-title">${escA(p.titulo || '')}</span>
        </a>`;
      }).join('');
    }
  })();

  function openBlogModal(b, fmtB) {
    let modal = document.getElementById('blogModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'blogModal';
      modal.className = 'blog-modal';
      modal.innerHTML = '<div class="bm-box"><button class="bm-close" aria-label="Cerrar">✕</button><div class="bm-inner"></div></div>';
      document.body.appendChild(modal);
      const close = () => { modal.classList.remove('show'); document.body.style.overflow = ''; };
      modal.querySelector('.bm-close').addEventListener('click', close);
      modal.addEventListener('click', e => { if (e.target === modal) close(); });
      window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }
    const escB = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
    modal.querySelector('.bm-inner').innerHTML =
      (b.img ? `<div class="bm-img" style="background-image:url('${escB(b.img)}')"></div>` : '') +
      `<div class="bm-body"><div class="blog-tag">${escB(b.tipo || 'Artículo')}${b.fecha ? ' · ' + fmtB(b.fecha) : ''}</div>
       <h3>${escB(b.titulo)}</h3>
       ${b.autor ? `<p class="bm-author">Por ${escB(b.autor)}</p>` : ''}
       <p class="bm-text">${escB(b.cuerpo || b.extracto || '')}</p></div>`;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  /* ---------- Tweaks: definición ---------- */
  const TWEAKS = [
    { key: 'theme',   attr: 'data-theme',   label: 'Tratamiento de color',
      options: [['claro', 'Claro'], ['oscuro', 'Oscuro']] },
    { key: 'hero',    attr: 'data-hero',    label: 'Estilo del Hero',
      options: [['foto', 'Foto'], ['dividido', 'Dividido'], ['sereno', 'Sereno']] },
    { key: 'cards',   attr: 'data-cards',   label: 'Estilo de tarjetas',
      options: [['suave', 'Suave'], ['contorno', 'Contorno'], ['elevado', 'Elevado']] },
    { key: 'nav',     attr: 'data-nav',     label: 'Navbar',
      options: [['transparente', 'Transparente'], ['solida', 'Sólida']] },
    { key: 'menu',    attr: 'data-menu',    label: 'Menú móvil',
      options: [['deslizante', 'Deslizante'], ['completa', 'Pantalla completa']] },
    { key: 'corners', attr: 'data-corners', label: 'Esquinas',
      options: [['suaves', 'Suaves'], ['redondas', 'Redondas'], ['rectas', 'Rectas']] },
  ];
  const STORE = 'sionTweaks_v1';
  const defaults = {};
  TWEAKS.forEach(t => defaults[t.key] = root.getAttribute(t.attr) || t.options[0][0]);

  let state = Object.assign({}, defaults);
  try { Object.assign(state, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) {}

  function applyState() {
    TWEAKS.forEach(t => root.setAttribute(t.attr, state[t.key]));
    // El hero "foto" es oscuro → navbar transparente con texto claro.
    body.classList.toggle('hero-dark', state.hero === 'foto');
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }
  applyState();

  /* ---------- Navbar: scroll ---------- */
  const nav = document.getElementById('nav');

  /* ---------- Menú móvil ---------- */
  const burger = document.getElementById('burger');
  const backdrop = document.getElementById('backdrop');
  const closeMenu = () => { body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); };
  const toggleMenu = () => {
    const open = body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  burger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Scroll: navbar + reveal + scrollspy (sin IntersectionObserver) ---------- */
  // Nota: se usa posición de scroll en vez de IntersectionObserver porque éste
  // no dispara de forma fiable dentro de iframes/paneles de previsualización.
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const spyLinks = Array.from(document.querySelectorAll('.nav-links a[data-spy]'));
  const spyIds = ['inicio', 'servicios', 'transmisiones', 'nosotros', 'comunidad', 'eventos'];
  let ticking = false;

  function frame() {
    ticking = false;
    const vh = window.innerHeight;
    nav.classList.toggle('scrolled', window.scrollY > 36);
    // reveal: muestra cualquier elemento cuyo borde superior entra al 88% del viewport
    for (let i = revealEls.length - 1; i >= 0; i--) {
      const el = revealEls[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) { el.classList.add('in'); revealEls.splice(i, 1); }
    }
    // scrollspy
    let current = spyIds[0];
    for (const id of spyIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.45) current = id;
    }
    spyLinks.forEach(a => a.classList.toggle('active', a.dataset.spy === current));
  }
  const onScroll = () => {
    const now = Date.now();
    if (now - lastRun < 16) { return; }
    lastRun = now;
    frame();
  };
  let lastRun = 0;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', frame);
  frame();
  // refuerzo por si el contenido/fuentes cambian la altura tras cargar
  setTimeout(frame, 400);
  setTimeout(frame, 1200);

  /* ---------- Chips (filtros de mensajes) ---------- */
  document.querySelectorAll('.chip-row').forEach(row => {
    const chips = row.querySelectorAll('.chip');
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
    }));
  });

  /* ---------- Botón de reproducción ---------- */
  const play = document.querySelector('.play-btn');
  if (play) play.addEventListener('click', () => window.open('https://youtube.com', '_blank', 'noopener'));

  /* ---------- Formulario de oración ---------- */
  const form = document.getElementById('prayerForm');
  const success = document.getElementById('prayerSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#pf-name');
      const msg = form.querySelector('#pf-msg');
      let ok = true;
      [name, msg].forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = '#c0392b'; ok = false; }
        else { f.style.borderColor = ''; }
      });
      if (!ok) return;
      form.style.display = 'none';
      success.classList.add('show');
    });
    form.querySelectorAll('input, textarea').forEach(f =>
      f.addEventListener('input', () => { f.style.borderColor = ''; }));
  }

  /* ============================================================
     ACCESO PASTORAL — modal de login
     ============================================================ */
  const loginOverlay = document.getElementById('loginOverlay');
  if (loginOverlay) {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginSubmit = document.getElementById('loginSubmit');
    const passInput = document.getElementById('lg-pass');
    const passToggle = document.getElementById('passToggle');
    const mailInput = document.getElementById('lg-mail');

    const openLogin = (e) => {
      if (e) e.preventDefault();
      closeMenu();
      loginError.classList.remove('show');
      loginOverlay.classList.add('show');
      setTimeout(() => mailInput.focus(), 320);
    };
    const closeLogin = () => loginOverlay.classList.remove('show');

    document.querySelectorAll('[data-open-login]').forEach(b => b.addEventListener('click', openLogin));
    document.getElementById('loginClose').addEventListener('click', closeLogin);
    loginOverlay.addEventListener('click', (e) => { if (e.target === loginOverlay) closeLogin(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLogin(); });

    // mostrar / ocultar contraseña
    passToggle.addEventListener('click', () => {
      const show = passInput.type === 'password';
      passInput.type = show ? 'text' : 'password';
      passToggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      passToggle.querySelector('.eye').style.opacity = show ? '.5' : '1';
    });

    // recordar correo
    try {
      const saved = localStorage.getItem('sionAdminMail');
      if (saved) { mailInput.value = saved; document.getElementById('lg-remember').checked = true; }
    } catch (e) {}

    document.getElementById('forgotLink').addEventListener('click', (e) => {
      e.preventDefault();
      loginError.classList.remove('show');
      alert('Te enviaremos un enlace de recuperación al correo registrado. (Demostración)');
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginError.classList.remove('show');
      if (!mailInput.value.trim() || !passInput.value.trim()) {
        loginError.querySelector('span').textContent = 'Por favor completa tu correo y contraseña.';
        loginError.classList.add('show');
        return;
      }
      loginSubmit.classList.add('loading');
      loginSubmit.disabled = true;
      // Demostración: simulamos verificación de credenciales.
      setTimeout(() => {
        try {
          if (document.getElementById('lg-remember').checked) localStorage.setItem('sionAdminMail', mailInput.value.trim());
          else localStorage.removeItem('sionAdminMail');
          sessionStorage.setItem('sionAdminAuth', '1');
        } catch (e) {}
        window.location.href = 'admin.html';
      }, 1100);
    });
  }

  /* ============================================================
     PANEL DE TWEAKS (protocolo del editor)
     ============================================================ */
  injectTweaksPanel();

  function injectTweaksPanel() {
    const style = document.createElement('style');
    style.textContent = `
    #tw-panel{ position:fixed; right:18px; bottom:18px; z-index:1000; width:300px;
      background:#ffffff; color:#222a44; border-radius:18px; overflow:hidden;
      box-shadow:0 30px 70px -24px rgba(8,11,28,.55), 0 0 0 1px rgba(24,39,78,.08);
      font-family:'Hanken Grotesk',system-ui,sans-serif; display:none;
      animation:twIn .26s cubic-bezier(.2,.8,.2,1); max-height:min(82vh,640px); }
    #tw-panel.show{ display:block; }
    @keyframes twIn{ from{ opacity:0; transform:translateY(14px) scale(.98);} to{ opacity:1; transform:none; } }
    .tw-head{ display:flex; align-items:center; gap:.6rem; padding:14px 16px;
      background:#19274E; color:#fff; cursor:grab; }
    .tw-head img{ height:22px; }
    .tw-head h3{ font-family:'Lora',serif; font-size:1.05rem; font-weight:600; margin:0; flex:1; }
    .tw-x{ width:28px; height:28px; border-radius:8px; display:grid; place-items:center;
      color:#fff; opacity:.8; font-size:18px; line-height:1; }
    .tw-x:hover{ opacity:1; background:rgba(255,255,255,.15); }
    .tw-body{ padding:8px 16px 18px; overflow-y:auto; max-height:calc(min(82vh,640px) - 52px); }
    .tw-sec{ margin-top:14px; }
    .tw-sec > label{ font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
      color:#8a7253; display:block; margin-bottom:7px; }
    .tw-seg{ display:flex; gap:5px; background:#F3EADC; padding:4px; border-radius:12px; }
    .tw-seg button{ flex:1; padding:.55em .2em; border-radius:9px; font-size:.82rem; font-weight:600;
      color:#54607a; transition:.18s; white-space:nowrap; }
    .tw-seg button.on{ background:#fff; color:#19274E; box-shadow:0 2px 8px -3px rgba(24,39,78,.3); }
    .tw-seg button:hover:not(.on){ color:#19274E; }
    .tw-foot{ margin-top:16px; padding-top:12px; border-top:1px solid #eee3d4;
      display:flex; justify-content:space-between; align-items:center; font-size:.78rem; color:#54607a; }
    .tw-reset{ font-weight:700; color:#19274E; }
    .tw-reset:hover{ text-decoration:underline; }
    @media (max-width:520px){ #tw-panel{ right:10px; left:10px; width:auto; bottom:10px; } }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'tw-panel';
    panel.innerHTML = `
      <div class="tw-head" id="tw-head">
        <img src="assets/logo-cream.png" alt="" />
        <h3>Tweaks</h3>
        <button class="tw-x" id="tw-close" aria-label="Cerrar">✕</button>
      </div>
      <div class="tw-body">
        ${TWEAKS.map(t => `
          <div class="tw-sec">
            <label>${t.label}</label>
            <div class="tw-seg" data-key="${t.key}">
              ${t.options.map(o => `<button data-val="${o[0]}">${o[1]}</button>`).join('')}
            </div>
          </div>`).join('')}
        <div class="tw-foot">
          <span>Mezcla y combina</span>
          <button class="tw-reset" id="tw-reset">Restablecer</button>
        </div>
      </div>`;
    document.getElementById('tweaksRoot').appendChild(panel);

    function syncButtons() {
      panel.querySelectorAll('.tw-seg').forEach(seg => {
        const key = seg.dataset.key;
        seg.querySelectorAll('button').forEach(b =>
          b.classList.toggle('on', b.dataset.val === state[key]));
      });
    }
    syncButtons();

    panel.querySelectorAll('.tw-seg').forEach(seg => {
      seg.addEventListener('click', (e) => {
        const btn = e.target.closest('button'); if (!btn) return;
        state[seg.dataset.key] = btn.dataset.val;
        applyState(); syncButtons(); onScroll();
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [seg.dataset.key]: btn.dataset.val } }, '*');
      });
    });

    document.getElementById('tw-reset').addEventListener('click', () => {
      state = Object.assign({}, defaults);
      applyState(); syncButtons(); onScroll();
    });

    // --- Protocolo del host ---
    const open = () => panel.classList.add('show');
    const close = () => panel.classList.remove('show');
    document.getElementById('tw-close').addEventListener('click', () => {
      close(); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    });
    window.addEventListener('message', (e) => {
      const t = e && e.data && e.data.type;
      if (t === '__activate_edit_mode') open();
      else if (t === '__deactivate_edit_mode') close();
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    // --- Arrastrar el panel ---
    const head = document.getElementById('tw-head');
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    head.addEventListener('mousedown', (e) => {
      if (e.target.closest('#tw-close')) return;
      dragging = true; sx = e.clientX; sy = e.clientY;
      const r = panel.getBoundingClientRect();
      ox = r.left; oy = r.top;
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
      panel.style.left = ox + 'px'; panel.style.top = oy + 'px';
      head.style.cursor = 'grabbing'; e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panel.style.left = Math.max(6, ox + e.clientX - sx) + 'px';
      panel.style.top = Math.max(6, oy + e.clientY - sy) + 'px';
    });
    window.addEventListener('mouseup', () => { dragging = false; head.style.cursor = 'grab'; });
  }
})();
