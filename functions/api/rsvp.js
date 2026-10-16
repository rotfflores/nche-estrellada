import { json, readJson, sameOrigin } from "../_shared.mjs";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error:"Origen no permitido." }, 403);
  if (!env.DB) return json({ error:"Confirmaciones no configuradas." }, 503);
  const body = await readJson(request);
  if (!body || !["si", "no"].includes(body.answer) ||
      typeof body.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id)) {
    return json({ error:"Respuesta inválida." }, 400);
  }
  const name = body.answer === "si" && typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const message = body.answer === "si" && typeof body.message === "string" ? body.message.trim() : "";
  if ((body.answer === "si" && (!name || name.length > 80)) || message.length > 300) {
    return json({ error:"Revisa el nombre y el mensaje." }, 400);
  }
  try {
    await env.DB.prepare(`INSERT INTO rsvp_responses (id, answer, name, message, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(id) DO UPDATE SET answer=excluded.answer, name=excluded.name,
      message=excluded.message, updated_at=datetime('now')`)
      .bind(body.id, body.answer, name, message).run();
    return json({ saved:true }, 201);
  } catch (error) {
    console.error("No se pudo guardar una confirmación:", error);
    return json({ error:"No pudimos guardar tu respuesta. Intenta de nuevo." }, 500);
  }
}
