/* ============================================================
   Función serverless (Vercel): recibe un enlace de Google Maps
   (incluye enlaces cortos maps.app.goo.gl / goo.gl) y devuelve
   una URL incrustable para el <iframe> del mapa de "Planifica tu
   visita". Los enlaces cortos no se pueden resolver desde el
   navegador (CORS); por eso se resuelven aquí en el servidor.
   ============================================================ */
function coord(a, b) { return 'https://www.google.com/maps?q=' + a + ',' + b + '&output=embed'; }
function q(s) { return 'https://www.google.com/maps?q=' + encodeURIComponent(s) + '&output=embed'; }
function toEmbed(u) {
  let m;
  if ((m = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/))) return coord(m[1], m[2]); // pin exacto del lugar
  if ((m = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/))) return coord(m[1], m[2]);     // centro del mapa
  if ((m = u.match(/[?&]q=([^&]+)/))) return q(decodeURIComponent(m[1]));
  if ((m = u.match(/[?&]destination=([^&]+)/))) return q(decodeURIComponent(m[1]));
  if ((m = u.match(/\/place\/([^/@]+)/))) return q(decodeURIComponent(m[1]).replace(/\+/g, ' '));
  return null;
}

export default async function handler(req, res) {
  const url = String((req.query && req.query.url) || '').trim();
  if (!url) { res.status(400).json({ error: 'falta url' }); return; }
  try {
    let finalUrl = url;
    if (/goo\.gl|maps\.app|\/url\?/.test(url)) {
      const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
      finalUrl = r.url || url;
    }
    const embed = toEmbed(finalUrl);
    res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400');
    res.status(200).json({ embed, resolved: finalUrl });
  } catch (e) {
    res.status(200).json({ embed: null, error: String(e) });
  }
}
