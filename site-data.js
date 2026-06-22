/* ============================================================
   SION · Contenido compartido entre el sitio público y el panel
   Guardado en localStorage para que las ediciones del administrador
   se reflejen en la página pública sin tocar código.
   ============================================================ */
(function () {
  'use strict';
  const KEY = 'sionSiteData_v4';

  // Valores por defecto (se usan si no hay nada guardado)
  const DEFAULTS = {
    content: {
      'hero.eyebrow': 'Toluca · Estado de México',
      'hero.title': '¡Bienvenidos a la Iglesia Sion Manantial de Vida!',
      'hero.subtitle': '...Un manantial de vida para las naciones',
      'hero.verse': '«Jehová te pastoreará siempre… y serás como huerto de riego, y como manantial de aguas, cuyas aguas nunca faltan.»',
      'hero.verseRef': 'Isaías 58:11',
      'afil.title': 'Parte de la familia Zion Fellowship',
      'afil.org': 'Zion Fellowship International Inc. · Sede en Waverly, Nueva York, EE. UU.',
      'afil.desc': 'Estamos afiliados a Zion Fellowship, una familia de iglesias y ministerios alrededor del mundo. [Espacio para describir brevemente la historia de cómo nos afiliamos: en qué fecha, en qué circunstancias y lo que esta relación significa para nuestra congregación — editable].',
      'afil.date': '[Mes Año]',
      'afil.link': 'https://zionfellowship.org',
      'nosotros.desc': 'Nos dedicamos a acompañar a cada familia en su crecimiento espiritual a través de la enseñanza de la Palabra, la oración y el servicio, ayudando a cada persona a alcanzar nuevas alturas en su vida con Dios.',
      'mision': 'Predicar el evangelio de Jesucristo con amor y poder, formando creyentes firmes en la fe, desarrollando líderes conforme al corazón de Dios y llevando esperanza, restauración y vida a Toluca, México y las naciones.',
      'vision': 'Ser una iglesia llena de la presencia de Dios, que levante discípulos con pasión por Cristo, restaure familias, sane corazones y transforme generaciones mediante el poder del Espíritu Santo y la verdad de la Palabra de Dios.',
      'historia': 'Lo que comenzó como un grupo de familias orando juntas se ha convertido en una comunidad que sueña con transformar su ciudad. Esta es una reseña breve de nuestros inicios y trayecto — editable con sus fechas y momentos reales.',
      'pastor.bio': 'En 2015, los pastores Tomás Díaz y Liliana le dijeron "sí" a Dios y comenzaron una aventura de fe que los llevó como misioneros a Costa Rica. Durante 10 años sembraron amor en ese país, mientras continuaban sus estudios en el Instituto Ministerial Sion y veían crecer a sus mayores tesoros: sus hijos, Tomás y Ana Belén. Dios aprovecha cada desierto y cada montaña para hablarnos, y fue allá donde les regaló a través de sueños y profecías el nombre de “Iglesia Sion Manantial de Vida”. Pero el plan no terminaba en Costa Rica; el Señor sembró en ellos el profundo deseo de volver a México para compartir lo aprendido. Hoy, la promesa es una realidad en Toluca. Los pastores Tomás y Liliana, de la mano de sus hijos y su nuera —quienes sirven al Señor con todo su corazón y sus talentos—, te abren las puertas de esta gran familia. ¡Queremos ser ese manantial de vida para ti!',
      'expect.1.t': 'Dos horas', 'expect.1.d': 'Cantos, un mensaje de la Biblia y tiempo para conectar.',
      'expect.2.t': 'Vestimenta casual', 'expect.2.d': 'Ven tal como eres. Aquí lo importante eres tú.',
      'expect.3.t': 'Estacionamiento', 'expect.3.d': 'Contamos con espacio para que llegues sin preocupaciones.',
      'expect.4.t': 'Un lugar para tus hijos', 'expect.4.d': 'Iglesia Infantil con un ambiente seguro y divertido.',
      'contacto.dir': 'Av. Solidaridad Las Torres 1096, Madero, Metepec, Méx. C.P. 52172',
      'contacto.mail': 'sion@manantialdevida.mx',
      'contacto.tel': '55 7433 9562',
      'oracion.s1.t': 'Comparte tu petición', 'oracion.s1.d': 'Llena el formulario con lo que tienes en tu corazón. Puedes hacerlo de forma confidencial.',
      'oracion.s2.t': 'La recibe el equipo de intercesión', 'oracion.s2.d': 'Un grupo de personas dedicadas a orar recibe tu petición con respeto y cuidado.',
      'oracion.s3.t': 'Oramos por ti durante la semana', 'oracion.s3.d': 'Si lo deseas, un pastor te contactará para acompañarte de cerca.',
      'oracion.pastor.t': '¿Necesitas hablar con un pastor?', 'oracion.pastor.d': 'Consejería familiar, bodas, bautizos y emergencias.',
      'social.youtube': 'https://www.youtube.com/@iglesiasionmanantialdevida',
      'social.facebook': 'https://facebook.com',
      'pastor.photo': '',
      'pastor.photoSize': 'mediana',
      'comunidad.titulo': 'Nadie debe caminar solo',
      'comunidad.sub': 'La vida cristiana se vive mejor en familia. Encuentra tu lugar para crecer, servir y pertenecer.',
      'comunidad.c1.t': 'Grupos pequeños / Células', 'comunidad.c1.d': 'Nos reunimos en hogares durante la semana para compartir la vida, orar y crecer en la Palabra. Hay un grupo cerca de ti.', 'comunidad.c1.cta': 'Horarios y zonas disponibles',
      'comunidad.c2.t': 'Ministerios y voluntariado', 'comunidad.c2.d': 'Pon tus dones al servicio de la familia: música y alabanza, equipo de bienvenida, ministerio técnico y mucho más.', 'comunidad.c2.cta': 'Quiero servir',
      'comunidad.c3.t': 'Ministerio de niños', 'comunidad.c3.d': 'Iglesia Infantil: un espacio seguro y divertido donde los más pequeños aprenden de Dios, dándote tranquilidad durante el servicio.', 'comunidad.c3.cta': 'Conoce el espacio',
      'objetivos.titulo': 'Objetivos ministeriales',
      'objetivos.1': 'Alcanzar almas para Cristo',
      'objetivos.2': 'Levantar líderes y ministros',
      'objetivos.3': 'Restaurar familias',
      'objetivos.4': 'Expandir el Reino de Dios',
      'objetivos.5': 'Formar una iglesia con identidad profética y evangelística',
      'historia.titulo': 'De un pequeño manantial a un río',
      'historia.t1.yr': 'Los inicios', 'historia.t1.h': 'Una familia que ora', 'historia.t1.p': 'Un grupo pequeño se reúne en casa con el sueño de servir a Toluca.',
      'historia.t2.yr': 'Crecimiento', 'historia.t2.h': 'Nace una congregación', 'historia.t2.p': 'Las reuniones crecen y se establece la iglesia con servicios semanales.',
      'historia.t3.yr': 'Hoy', 'historia.t3.h': 'Una casa para la ciudad', 'historia.t3.p': 'Familias, grupos en casa y ministerios que suben a nuevas alturas en Dios.',
      'trans.eyebrow': 'Transmisiones en vivo',
      'trans.titulo': 'Conéctate desde donde estés',
      'trans.lead': 'Únete a nuestro stream en vivo los domingos por la mañana y los miércoles, o mira los mensajes anteriores en nuestro canal de YouTube.',
      'trans.msgTitulo': 'Mensajes anteriores',
      'trans.msgSub': 'Explora por series, temas o predicador.',
      'trans.btnCanal': 'Ver canal de Youtube',
      'trans.liveChannel': '',
      'trans.coverImg': '',
      'serv.eyebrow': 'Acompáñanos', 'serv.titulo': 'Nuestros servicios', 'serv.lead': 'Reúnete con nuestra familia esta semana. Ven tal como eres; aquí hay un lugar para ti.',
      'nosotros.eyebrow': 'Quiénes Somos', 'nosotros.titulo': 'Una comunidad centrada en Cristo y en las personas',
      'valores.eyebrow': 'Lo que nos sostiene', 'valores.titulo': 'Valores Fundamentales',
      'fe.eyebrow': 'Declaración de fe', 'fe.titulo': 'Nuestros Pilares Fundamentales', 'fe.lead': '22 verdades centrales de nuestra fe, fundamentadas en la Biblia. Toca un pilar para leerlo completo.',
      'equipo.eyebrow': 'Equipo pastoral y liderazgo', 'equipo.titulo': 'Rostros de la familia Sion',
      'eventos.eyebrow': 'Calendario', 'eventos.titulo': 'Próximos eventos', 'eventos.lead': 'Hay un lugar para ti en cada encuentro. Estos son los eventos especiales de nuestra familia.',
      'anuncios.eyebrow': 'Tablón de la iglesia', 'anuncios.titulo': 'Anuncios', 'anuncios.lead': 'Mantente al día con lo que está pasando en la vida de nuestra congregación.',
      'aprende.eyebrow': 'Aprende con nosotros', 'aprende.titulo': 'Devocionales y blog', 'aprende.lead': 'Recursos para alimentar tu fe durante la semana, no solo el domingo.',
      'oracion.eyebrow': 'Cuidado pastoral y peticiones de oración', 'oracion.titulo': 'Permítenos orar por ti', 'oracion.lead': 'No tienes que pasar por esto solo. Cuéntanos cómo podemos orar; nuestro equipo de intercesión está aquí para ti.',
      'redes.eyebrow': 'Síguenos', 'redes.titulo': 'Vive la comunidad también en línea', 'redes.lead': 'Lo que Dios hace en Sion no cabe en una hora el domingo. Conéctate con nuestra familia durante toda la semana.',
      'visita.eyebrow': 'Planifica tu visita', 'visita.titulo': 'Te esperamos en Metepec', 'visita.lead': 'Estamos en Av. Solidaridad Las Torres 1096, Madero, Metepec. Llega con confianza: hay estacionamiento y un equipo de bienvenida listo para recibirte.',
    },
    eventos: [
      { id: 'e1', titulo: 'Noche de Adoración', fecha: '2026-06-20', hora: '19:00', lugar: 'Templo principal', estado: 'proximo', reg: true, desc: 'Una noche para adorar juntos en familia y buscar la presencia de Dios.' },
      { id: 'e2', titulo: 'Retiro de Matrimonios', fecha: '2026-07-12', hora: '09:00', lugar: 'Salón de eventos', estado: 'proximo', reg: true, desc: 'Un tiempo especial para fortalecer los lazos del hogar.' },
      { id: 'e4', titulo: 'Conferencia de Jóvenes', fecha: '2026-08-02', hora: '17:00', lugar: 'Por confirmar', estado: 'proximo', reg: false, desc: 'Dos días de avivamiento para la próxima generación.' },
    ],
    anuncios: [
      { id: 'a1', titulo: 'Estudio Bíblico', texto: 'Acompáñanos a profundizar en la Palabra de Dios. Un espacio para crecer, preguntar y fortalecer tu fe en comunidad.', img: 'assets/anuncio-oracion.png', ini: '2026-06-01', fin: '2026-12-31', orden: 1, activo: true },
      { id: 'a2', titulo: 'Servicio de Oración', texto: 'Únete a un tiempo poderoso de oración mientras buscamos juntos la presencia de Dios. En la oración encontramos fuerza, paz y dirección.', img: 'assets/anuncio-padre.png', ini: '2026-06-01', fin: '2026-12-31', orden: 2, activo: true },
      { id: 'a3', titulo: '¡Feliz Día del Padre!', texto: 'Gracias por ser nuestra fortaleza, guía y nuestro mayor soporte. Dios los bendiga.', img: 'assets/anuncio-bazar.png', ini: '2026-06-15', fin: '2026-06-22', orden: 3, activo: true },
      { id: 'a4', titulo: 'Viernes Santo', texto: 'Por sus heridas fuimos sanados. Te deseamos un día lleno de paz y abundantes bendiciones.', img: 'assets/anuncio-biblia.png', ini: '2026-04-01', fin: '2026-04-04', orden: 4, activo: true },
      { id: 'a5', titulo: 'Bazar Navideño', texto: 'Regalos hechos con corazón por emprendedores locales. Del 12 al 14 de diciembre · Entrada gratuita.', img: 'assets/anuncio-viernes.png', ini: '2026-12-01', fin: '2026-12-14', orden: 5, activo: true },
    ],
    blog: [
      { id: 'b1', tipo: 'Devocional', titulo: 'Empieza tu día en la cima', extracto: 'Una pausa de cinco minutos para subir a un lugar más alto con Dios cada mañana.', cuerpo: 'Cada mañana es una nueva oportunidad para buscar la presencia de Dios antes que cualquier otra cosa. Te invitamos a tomar cinco minutos en silencio, leer un salmo y entregar tu día al Señor.', autor: 'Equipo Pastoral', fecha: '2026-06-01', img: '', activo: true },
      { id: 'b2', tipo: 'Blog · Familia', titulo: 'Cómo orar en familia', extracto: 'Ideas sencillas para convertir tu hogar en un manantial de fe para todos.', cuerpo: 'La oración en familia fortalece los lazos y siembra fe en los más pequeños. Aquí compartimos ideas prácticas para comenzar: un horario fijo, turnos para orar y un cuaderno de peticiones y respuestas.', autor: 'Ps. Liliana', fecha: '2026-05-20', img: '', activo: true },
      { id: 'b3', tipo: 'Blog · Fe', titulo: 'Restauración: un nuevo nivel', extracto: 'Dios no terminó contigo. Descubre lo que significa volver a empezar en Él.', cuerpo: 'No importa cuán lejos parezca estar la restauración: en Dios siempre hay un nuevo comienzo. Su gracia alcanza cada área de nuestra vida y nos lleva a un nuevo nivel.', autor: 'Ps. Tomás', fecha: '2026-05-10', img: '', activo: true },
    ],
    social: [
      { id: 's1', titulo: 'Servicio dominical en vivo', img: '', red: 'youtube', url: '' },
      { id: 's2', titulo: 'Momentos de nuestra familia', img: '', red: 'facebook', url: '' },
      { id: 's3', titulo: 'Palabra de aliento', img: '', red: 'youtube', url: '' },
      { id: 's4', titulo: 'Galería de eventos', img: '', red: 'facebook', url: '' },
    ],
  };

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
    const out = deepClone(DEFAULTS);
    if (saved.content) Object.assign(out.content, saved.content);
    if (Array.isArray(saved.eventos)) out.eventos = saved.eventos;
    if (Array.isArray(saved.anuncios)) out.anuncios = saved.anuncios;
    if (Array.isArray(saved.blog)) out.blog = saved.blog;
    if (Array.isArray(saved.social)) out.social = saved.social;
    if (Array.isArray(saved.servicios)) out.servicios = saved.servicios;
    if (Array.isArray(saved.sermones)) out.sermones = saved.sermones;
    if (Array.isArray(saved.fe)) out.fe = saved.fe;
    return out;
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  /* ---- Lectura/escritura en Supabase (la nube) ---- */
  async function pullRemote() {
    if (!window.sbClient) return null;
    try {
      const { data, error } = await window.sbClient
        .from('site_data').select('data').eq('id', 1).maybeSingle();
      if (error || !data) return null;
      return data.data || null;
    } catch (e) { return null; }
  }
  async function pushRemote(obj) {
    if (!window.sbClient) return { ok: false };
    try {
      const { error } = await window.sbClient
        .from('site_data')
        .upsert({ id: 1, data: obj, updated_at: new Date().toISOString() });
      return { ok: !error, error };
    } catch (e) { return { ok: false, error: e }; }
  }

  window.SionSite = { DEFAULTS, load, save, KEY, pullRemote, pushRemote };
})();
