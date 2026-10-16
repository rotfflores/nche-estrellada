import { isAdmin, json } from "../../_shared.mjs";

export async function onRequestGet({ request, env }) {
  if (!(await isAdmin(env, request))) return json({ error:"Inicia sesión para ver las respuestas." }, 401);
  try {
    const { results } = await env.DB.prepare(`SELECT id, answer, name, message, created_at, updated_at
      FROM rsvp_responses ORDER BY updated_at DESC, id DESC`).all();
    return json({ responses:results });
  } catch (error) {
    console.error("No se pudieron consultar las confirmaciones:", error);
    return json({ error:"No se pudieron cargar las respuestas." }, 500);
  }
}
