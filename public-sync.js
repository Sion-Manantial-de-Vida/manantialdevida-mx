/* ============================================================
   Sincroniza el contenido del sitio público desde Supabase.
   Si el pastor editó el contenido en el panel, aquí se trae y se
   refresca la página una sola vez para mostrarlo.
   Si no hay nada guardado en Supabase, el sitio usa el contenido
   por defecto (todo sigue funcionando).
   ============================================================ */
(function () {
  'use strict';
  if (!window.sbClient || !window.SionSite || !window.SionSite.pullRemote) return;

  window.SionSite.pullRemote().then(function (remote) {
    if (!remote) return; // aún no hay contenido editado en la nube
    try {
      var remoteStr = JSON.stringify(remote);
      var localStr = localStorage.getItem(window.SionSite.KEY);
      if (remoteStr !== localStr) {
        localStorage.setItem(window.SionSite.KEY, remoteStr);
        if (!sessionStorage.getItem('sionSyncedOnce')) {
          sessionStorage.setItem('sionSyncedOnce', '1');
          location.reload();
        }
      }
    } catch (e) { /* sin acceso a storage: ignorar */ }
  });
})();
