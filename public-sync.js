/* ============================================================
   Sincroniza el contenido del sitio público desde Supabase.
   - Otras secciones: del "paquete" site_data (paso intermedio).
   - Secciones normalizadas (fuente de verdad, tablas):
       eventos → events, anuncios → announcements, blog → blog_posts,
       redes → social_feed, servicios → services, sermones → sermons.
   Si algo cambió respecto a lo cacheado, refresca la página una sola
   vez. Si Supabase no responde, el sitio sigue funcionando.
   ============================================================ */
(function () {
  'use strict';
  if (!window.sbClient || !window.SionSite) return;

  (async function sync() {
    const base = window.SionSite.load(); // por defecto + caché local

    // Contenido general (paquete site_data), si existe
    try {
      if (window.SionSite.pullRemote) {
        const remote = await window.SionSite.pullRemote();
        if (remote && typeof remote === 'object') Object.assign(base, remote);
      }
    } catch (e) {}

    // Secciones normalizadas: [tabla, clave en el objeto, función de mapeo opcional]
    const tablas = [
      ['events', 'eventos', r => ({ id: r.id, titulo: r.titulo, fecha: r.fecha, hora: r.hora, lugar: r.lugar, desc: r.descripcion, estado: r.estado, reg: !!r.reg })],
      ['announcements', 'anuncios', null],
      ['blog_posts', 'blog', null],
      ['social_feed', 'social', null],
      ['services', 'servicios', null],
      ['sermons', 'sermones', r => ({ id: r.id, titulo: r.titulo, pred: r.pred, serie: r.serie, fecha: r.fecha, yt: r.yt, desc: r.descripcion, dest: !!r.dest })]
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

    // Si cambió respecto a lo cacheado, guardar y refrescar una vez
    try {
      const str = JSON.stringify(base);
      if (str !== localStorage.getItem(window.SionSite.KEY)) {
        localStorage.setItem(window.SionSite.KEY, str);
        if (!sessionStorage.getItem('sionSyncedOnce')) {
          sessionStorage.setItem('sionSyncedOnce', '1');
          location.reload();
        }
      }
    } catch (e) {}
  })();
})();
