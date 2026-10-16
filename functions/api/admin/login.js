import { configured, fingerprint, json, passwordMatches, readJson, sameOrigin, sessionCookie } from "../../_shared.mjs";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error:"Origen no permitido." }, 403);
  if (!configured(env)) return json({ error:"Panel no configurado." }, 503);
  const body = await readJson(request);
  if (!body || typeof body.password !== "string" || body.password.length > 256) return json({ error:"Contraseña inválida." }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const key = await fingerprint(env.SESSION_SECRET, `login:${ip}`);
  const now = Math.floor(Date.now() / 1000);
  try {
    const attempt = await env.DB.prepare("SELECT failures, reset_at FROM admin_login_attempts WHERE id = ?").bind(key).first();
    if (attempt && attempt.reset_at > now && attempt.failures >= 5) {
      return json({ error:"Demasiados intentos. Prueba en 15 minutos." }, 429);
    }
    if (!(await passwordMatches(env, body.password))) {
      const failures = attempt && attempt.reset_at > now ? attempt.failures + 1 : 1;
      await env.DB.prepare(`INSERT INTO admin_login_attempts (id, failures, reset_at) VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET failures=excluded.failures, reset_at=excluded.reset_at`)
        .bind(key, failures, now + 900).run();
      return json({ error:"Contraseña incorrecta." }, 401);
    }
    await env.DB.prepare("DELETE FROM admin_login_attempts WHERE id = ?").bind(key).run();
    return json({ authenticated:true }, 200, { "Set-Cookie":await sessionCookie(env, request) });
  } catch (error) {
    console.error("No se pudo iniciar sesión:", error);
    return json({ error:"El panel no está disponible en este momento." }, 500);
  }
}
