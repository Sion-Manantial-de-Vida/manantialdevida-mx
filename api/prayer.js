/* ============================================================
   Función serverless (Vercel): envía por correo las peticiones
   de oración / acciones de gracias a la iglesia, vía Resend.
   Requiere la variable de entorno RESEND_API_KEY en Vercel.
   Si no está configurada, no falla: simplemente no envía correo
   (la petición igual se guarda en la base de datos).
   ============================================================ */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'method' }); return; }
  const key = process.env.RESEND_API_KEY;
  if (!key) { res.status(200).json({ ok: false, skipped: 'sin-RESEND_API_KEY' }); return; }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { tipo, nombre, contacto, mensaje } = body;
    const tipoTxt = tipo === 'gracias' ? 'Acción de gracias' : 'Petición de oración';
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="color:#19274E">🙏 ${tipoTxt}</h2>
        <p><strong>Nombre:</strong> ${esc(nombre) || 'Anónimo'}</p>
        <p><strong>Contacto:</strong> ${esc(contacto) || '—'}</p>
        <p><strong>Mensaje:</strong><br>${esc(mensaje).replace(/\n/g, '<br>')}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:18px 0">
        <p style="color:#888;font-size:.85rem">Enviado desde el formulario de manantialdevida.mx</p>
      </div>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Peticiones Sion <onboarding@resend.dev>',
        to: ['sion@manantialdevida.mx'],
        reply_to: contacto && /\S+@\S+\.\S+/.test(contacto) ? contacto : undefined,
        subject: `${tipoTxt} de ${nombre || 'Anónimo'}`,
        html
      })
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
