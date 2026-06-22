/* ============================================================
   Render dinámico del sitio público para secciones que antes
   estaban fijas en el HTML: Servicios (horarios) y Sermones.
   Lee del caché que arma public-sync.js desde las tablas
   'services' y 'sermons'. Si no hay datos, deja el HTML por defecto.
   ============================================================ */
(function () {
  'use strict';
  if (!window.SionSite) return;
  var site = window.SionSite.load();
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };

  function fmtTime(t) {
    if (!t) return ['', ''];
    var p = String(t).split(':'); var h = +p[0]; var m = p[1] || '00';
    var ap = h < 12 ? 'AM' : 'PM'; var h12 = h % 12; if (h12 === 0) h12 = 12;
    return [h12 + ':' + m, ap];
  }
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtFecha(d) { if (!d) return ''; var p = d.split('-'); return (+p[2]) + ' ' + (MES[+p[1] - 1] || ''); }

  /* --- SERVICIOS (carrusel "Nuestros servicios") --- */
  (function servicios() {
    var track = document.querySelector('#servicios .svc-track');
    var list = (site.servicios || []).filter(function (s) { return s.activo !== false; });
    if (!track || !list.length) return; // sin datos: deja el HTML por defecto
    var ORDER = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    list.sort(function (a, b) { var d = ORDER.indexOf(a.dia) - ORDER.indexOf(b.dia); return d !== 0 ? d : String(a.ini).localeCompare(String(b.ini)); });
    var ico = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    track.innerHTML = list.map(function (s, i) {
      var t = fmtTime(s.ini), tf = fmtTime(s.fin);
      return '<article class="service-card reveal in' + (i === 0 ? ' featured' : '') + '">'
        + (i === 0 ? '<span class="service-badge">Principal</span>' : '')
        + '<span class="service-ico">' + ico + '</span>'
        + '<span class="service-day">' + esc(s.dia) + '</span>'
        + '<div class="service-time">' + esc(t[0]) + ' <span>' + t[1] + '</span></div>'
        + '<div class="service-name">' + esc(s.nombre) + '</div>'
        + (s.fin ? '<p>Hasta las ' + esc(tf[0]) + ' ' + tf[1] + '</p>' : '')
        + '</article>';
    }).join('');
    window.dispatchEvent(new Event('resize'));
  })();

  /* --- SERMONES (lista "Mensajes anteriores") --- */
  (function sermones() {
    var stack = document.querySelector('#transmisiones .stack');
    var list = (site.sermones || []);
    if (!stack || !list.length) return;
    stack.innerHTML = list.map(function (s) {
      var href = s.yt && String(s.yt).trim() ? String(s.yt).trim() : '#transmisiones';
      var ext = (href !== '#transmisiones') ? ' target="_blank" rel="noopener"' : '';
      var meta = s.serie ? 'Serie · ' + esc(s.serie) : 'Mensaje';
      var pr = esc(s.pred || '') + (s.fecha ? ' · ' + fmtFecha(s.fecha) : '');
      return '<a class="msg-row reveal in" href="' + esc(href) + '"' + ext + '>'
        + '<div class="ph msg-thumb" data-label="thumb"></div>'
        + '<div><div class="meta">' + meta + '</div><h4>' + esc(s.titulo) + '</h4>'
        + '<div class="pr">' + pr + '</div></div></a>';
    }).join('');
  })();

  /* --- VIDEO EN VIVO (embed del canal de YouTube) --- */
  (function liveVideo() {
    var v = ((site.content && site.content['trans.liveChannel']) || '').trim();
    var frame = document.querySelector('#transmisiones .video-frame');
    if (!v || !frame) return;
    var src;
    if (/^UC[\w-]{20,}$/.test(v)) {
      src = 'https://www.youtube.com/embed/live_stream?channel=' + encodeURIComponent(v);
    } else {
      var m = v.match(/(?:v=|youtu\.be\/|embed\/|live\/)([\w-]{11})/);
      src = 'https://www.youtube.com/embed/' + (m ? m[1] : v);
    }
    frame.style.position = 'relative';
    frame.innerHTML = '<iframe src="' + src + '" title="Transmisión en vivo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:inherit"></iframe>';
  })();
})();
