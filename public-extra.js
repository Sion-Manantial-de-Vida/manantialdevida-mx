/* ============================================================
   SION · Componentes interactivos del sitio público
   (Declaración de fe, dropdown de eventos, pestañas de eventos,
    calendario, anuncios, carruseles)
   Lee el contenido de window.SionSite.
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const site = window.SionSite ? window.SionSite.load() : { content: {}, eventos: [], anuncios: [] };
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  /* ============================================================
     1) DECLARACIÓN DE FE — vista maestro/detalle
     ============================================================ */
  const I = {
    trinidad: '<circle cx="12" cy="7.5" r="3.6"/><circle cx="7.5" cy="15" r="3.6"/><circle cx="16.5" cy="15" r="3.6"/>',
    cristo: '<path d="M12 2v20M6 8h12"/>',
    biblia: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 19H6a2 2 0 0 0-2 2"/>',
    gracia: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
    agua: '<path d="M12 3c4 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12z"/>',
    salud: '<path d="M22 12h-4l-3 8-4-16-3 8H4"/>',
    dones: '<path d="M12 2l2.4 6.9H21l-5.3 4.1 2 6.8L12 16.5 6.3 19.8l2-6.8L3 8.9h6.6z"/>',
    avivamiento: '<path d="M12 2C9 7 7 9 7 13a5 5 0 0 0 10 0c0-2-1-3-2-4 0 2-1 2-1 2 .5-3-1-6-2-9z"/>',
    espiritu: '<path d="M12 21c4-3 7-6 7-11a7 7 0 0 0-14 0c0 5 3 8 7 11z"/><circle cx="12" cy="10" r="2"/>',
    resurreccion: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    matrimonio: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
    pureza: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    redencion: '<path d="M3 12a9 9 0 1 0 3-6.7M3 3v4h4"/>',
    dignidad: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/>',
    autoridad: '<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>',
    mayordomia: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 0 1 0 3.5h-3a1.8 1.8 0 0 0 0 3.5h4"/>',
    sion: '<path d="M3 20l6-12 4 7 3-5 5 10z"/>',
    progresiva: '<path d="M3 17l6-6 4 4 7-8M14 7h7v7"/>',
    final: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M9 8h7M9 11h7"/>',
  };
  const FAITH = [
    ['La Trinidad', I.trinidad, 'Creemos en un solo Dios, eternamente existente en tres personas: Padre, Hijo y Espíritu Santo, Creador y Preservador de todo lo visible e invisible.'],
    ['Jesucristo el Señor', I.cristo, 'Jesús existió eternamente con el Padre y se encarnó sin dejar de ser Dios. Es co-Creador del mundo, el único Salvador y el Juez venidero.'],
    ['Las Sagradas Escrituras', I.biblia, 'Todo el canon de la Biblia (Antiguo y Nuevo Testamento) es la Palabra de Dios inspirada y la autoridad final y suprema en todo lo que enseña.'],
    ['Salvación por Gracia', I.gracia, 'El ser humano está perdido sin la gracia de Cristo. El pecado se limpia solo mediante el arrepentimiento personal y la fe en Su sangre preciosa.'],
    ['Bautismo en Agua', I.agua, 'Tras recibir a Cristo como Señor y Salvador, el creyente debe dar el paso del bautismo en agua por inmersión.'],
    ['Seguridad y Perseverancia', I.gracia, 'Dios es fiel para guardarnos de caer, pero el ser humano conserva la libertad de rechazar Su gracia y perder la salvación. Debemos caminar en la verdad.'],
    ['Sanidad Divina', I.salud, 'La obra de Cristo en la cruz provee sanidad integral para el cuerpo, la mente, el alma y el espíritu. Él tiene la respuesta a todo problema humano.'],
    ['Dones del Espíritu', I.dones, 'Los milagros y los dones del Espíritu Santo siguen vigentes hoy para la edificación y el perfeccionamiento de los miembros de la Iglesia.'],
    ['El Avivamiento Venidero', I.avivamiento, 'Dios visitará a Su Iglesia en los últimos días para traer multitudes al Reino, preparándonos para la Segunda Venida de Cristo.'],
    ['El Bautismo del Espíritu Santo', I.espiritu, 'Esta promesa está disponible para quienes la buscan y obedecen a Dios, teniendo como evidencia el hablar en otras lenguas.'],
    ['La Resurrección Final', I.resurreccion, 'Todos los seres humanos, salvos y no salvos, resucitarán para rendir cuentas ante el gran Juez, cuyo veredicto es final y eterno.'],
    ['El Diseño del Matrimonio', I.matrimonio, 'Es una institución santa establecida por Dios como un pacto exclusivo entre un hombre y una mujer para toda la vida, reflejando a Cristo y Su Iglesia.'],
    ['Pureza Sexual', I.pureza, 'La intimidad sexual es un diseño exclusivo para disfrutarse dentro del matrimonio. Cualquier actividad sexual fuera de este vínculo contradice el mandato divino.'],
    ['Inmoralidad Sexual', I.pureza, 'El adulterio, la fornicación, la homosexualidad, la pornografía y cualquier intento de alterar el sexo biológico son considerados pecados que ofenden a Dios.'],
    ['Redención y Restauración', I.redencion, 'Dios ofrece perdón total y restauración a todo aquel que confiesa, abandona su pecado y busca Su misericordia a través de Jesucristo.'],
    ['Dignidad y Respeto', I.dignidad, 'Toda persona merece compasión, amor y dignidad. Se repudia cualquier actitud de odio o acoso, ya que no se alinean con las Escrituras.'],
    ['Divorcio y Nuevo Matrimonio', I.matrimonio, 'Al ser el matrimonio un pacto sagrado ante Dios, el nuevo matrimonio solo es bíblicamente válido tras el fallecimiento del cónyuge anterior.'],
    ['Estándares Morales', I.autoridad, 'El cristiano debe vivir una vida santa y reflejar el fruto del Espíritu. Nos oponemos a las obras de la carne, el ocultismo, los vicios y el homicidio (incluidos el aborto y la eutanasia).'],
    ['Instituciones de Autoridad', I.autoridad, 'Dios ha establecido tres autoridades básicas: el hogar, la Iglesia y el estado. Todos estamos sujetos a ellas, y estas a su vez responden ante Dios.'],
    ['Mayordomía y Generosidad', I.mayordomia, 'El cristiano es administrador de los bienes de Dios y sostiene la iglesia local con alegría mediante el diezmo y ofrendas sacrificadas.'],
    ['La Visión de Sión', I.sion, 'Nuestro propósito va más allá de la recta doctrina; buscamos de todo corazón habitar en la presencia del Señor, deleitar Su corazón y progresar espiritualmente hacia Él.'],
    ['Autoridad de la Fe', I.final, 'Esta declaración no limita nuestra fe. La Biblia es la única e infalible fuente de verdad, moralidad y conducta que rige todo lo que creemos.'],
  ];

  (function faithMD() {
    const root = document.getElementById('faithMD');
    if (!root) return;
    const ico = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
    const n2 = (i) => String(i + 1);
    root.innerHTML = `
      <div class="faith-list" id="faithList">
        ${FAITH.map((f, i) => `<button class="faith-row" data-fi="${i}">
          <span class="fr-ico">${ico(f[1])}</span>
          <span class="fr-title">${n2(i)}. ${esc(f[0])}</span>
          <span class="fr-plus">+</span>
        </button>`).join('')}
      </div>
      <div class="faith-modal" id="faithModal" role="dialog" aria-modal="true">
        <div class="fm-box">
          <button class="fm-close" id="fmClose" aria-label="Cerrar">✕</button>
          <div class="fm-ico" id="fmIco"></div>
          <span class="fm-num" id="fmNum"></span>
          <h3 id="fmTitle"></h3>
          <p id="fmText"></p>
        </div>
      </div>`;
    const modal = document.getElementById('faithModal');
    const box = modal.querySelector('.fm-box');
    function open(i) {
      const f = FAITH[i];
      document.getElementById('fmIco').innerHTML = ico(f[1]);
      document.getElementById('fmNum').textContent = 'Pilar ' + (i + 1);
      document.getElementById('fmTitle').textContent = f[0];
      document.getElementById('fmText').textContent = f[2];
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    function close() { modal.classList.remove('show'); document.body.style.overflow = ''; }
    root.querySelector('#faithList').addEventListener('click', e => { const b = e.target.closest('.faith-row'); if (b) open(+b.dataset.fi); });
    document.getElementById('fmClose').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ============================================================
     2) PASTOR — Ver más / Ver menos
     ============================================================ */
  (function pastorMore() {
    const bio = document.getElementById('pastorBio');
    const btn = document.getElementById('pastorMore');
    if (!bio || !btn) return;
    const full = (site.content && site.content['pastor.bio']) || bio.textContent;
    const short = full.length > 240 ? full.slice(0, full.slice(0, 240).lastIndexOf(' ')) + '…' : full;
    let open = false;
    const sync = () => {
      bio.textContent = open ? full : short;
      btn.innerHTML = (open ? 'Ver menos' : 'Ver más') + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="transform:rotate(' + (open ? '180' : '0') + 'deg)"><path d="M6 9l6 6 6-6"/></svg>';
    };
    if (full.length <= 240) { btn.style.display = 'none'; bio.textContent = full; return; }
    sync();
    btn.addEventListener('click', () => { open = !open; sync(); });
  })();

  // exporta utilidades para el segundo bloque
  window.__sionPub = { $, $$, esc, site, MES, MESL };
})();
