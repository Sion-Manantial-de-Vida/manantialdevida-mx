/* ============================================================
   Conexión a Supabase (base de datos)
   La "clave pública" (publishable) es SEGURA para el navegador:
   está protegida por las reglas de seguridad (RLS) de la base de datos.
   NUNCA poner aquí la "secret key".
   ============================================================ */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://wisgwbfzyusdwlotspqn.supabase.co';
  var SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_BQ55J6ciToQwFvf51jMnAg_50tK5Z0Y';

  if (window.supabase && window.supabase.createClient) {
    window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } else {
    // Si la librería no cargó (sin internet, etc.), el sitio sigue funcionando
    // en modo local con los datos por defecto.
    console.warn('[Sion] Supabase no disponible; funcionando en modo local.');
    window.sbClient = null;
  }
})();
