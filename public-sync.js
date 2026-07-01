/* ============================================================
   Sincroniza el contenido del sitio público desde Supabase.
   - Otras secciones: del "paquete" site_data (paso intermedio).
   - Secciones normalizadas (fuente de verdad, tablas):
       eventos → events, anuncios → announcements, blog → blog_posts,
       redes → social_feed, servicios → services, sermones → sermons,
       textos → content.
   Detecta cambios reales en la base de datos (huella determinista) y
   refresca el sitio cuando hay novedades — sin bucles infinitos.
   ============================================================ */
(function () {
  'use strict';
  if (!window.sbClient || !window.SionSite) return;

  function stableSnap(base) {
    const pick = ['eventos', 'anuncios', 'blog', 'social', 'servicios', 'sermones', 'fe'];
    const o = {};
    pick.forEach(k => {
      o[k] = (base[k] || []).slice().sort((a, b) => String(a.id).localeCompare(String(b.id)));
    });
    const c = base.content || {};
    o.content = Object.keys(c).sort().map(k => [k, c[k]]);
    return JSON.stringify(o);
  }

  (async function sync() {
    const base = window.SionSite.load(); // por defecto + caché local

    // Contenido general (paquete site_data), si existe
    try {
      if (window.SionSite.pullRemote) {
        const remote = await window.SionSite.pullRemote();
        if (remote && typeof remote === 'object') Object.assign(base, remote);
      }
    } catch (e) {}

    // Secciones normalizadas: [tabla, clave, función de mapeo opcional]
    const tablas = [
      ['events', 'eventos', r => ({ id: r.id, titulo: r.titulo, fecha: r.fecha, hora: r.hora, lugar: r.lugar, desc: r.descripcion, estado: r.estado, reg: !!r.reg })],
      ['announcements', 'anuncios', null],
      ['blog_posts', 'blog', null],
      ['social_feed', 'social', null],
      ['services', 'servicios', null],
      ['sermons', 'sermones', r => ({ id: r.id, titulo: r.titulo, pred: r.pred, serie: r.serie, fecha: r.fecha, yt: r.yt, desc: r.descripcion, dest: !!r.dest, img: r.img || '' })],
      ['faith', 'fe', null]
    ];
    for (const [tabla, clave, mapFn] of tablas) {
      try {
        const { data: rows, error } = await window.sbClient.from(tabla).select('*');
        if (!error && Array.isArray(rows)) base[clave] = mapFn ? rows.map(mapFn) : rows;
      } catch (e) {}
    }

    // Textos (tabla content, clave/valor) — sobrescriben los textos por defecto
    try {
      const { data: rows, error } = await window.sbClient.from('content').select('key,value');
      if (!error && Array.isArray(rows) && rows.length) {
        const obj = {};
        rows.forEach(r => { obj[r.key] = r.value; });
        base.content = Object.assign({}, base.content || {}, obj);
      }
    } catch (e) {}

    // Guardar siempre en caché; refrescar solo si los datos de la BD cambiaron
    try {
      localStorage.setItem(window.SionSite.KEY, JSON.stringify(base));
      const snap = stableSnap(base);
      if (sessionStorage.getItem('sionDataVer') !== snap) {
        sessionStorage.setItem('sionDataVer', snap);
        location.reload();
      }
    } catch (e) {}
  })();
})();
