/* ============================================================
   Sincroniza el contenido del sitio público desde Supabase.
   - Otras secciones: del "paquete" site_data (paso intermedio).
   - EVENTOS: de la tabla normalizada 'events' (fuente de verdad).
   Si algo cambió respecto a lo que ya está cacheado, refresca la
   página una sola vez para mostrarlo. Si Supabase no responde, el
   sitio sigue funcionando con el contenido por defecto.
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

    // EVENTOS desde la tabla normalizada
    try {
      const { data: rows, error } = await window.sbClient
        .from('events').select('*').order('fecha', { ascending: true });
      if (!error && Array.isArray(rows)) {
        base.eventos = rows.map(r => ({
          id: r.id, titulo: r.titulo, fecha: r.fecha, hora: r.hora,
          lugar: r.lugar, desc: r.descripcion, estado: r.estado, reg: !!r.reg
        }));
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
