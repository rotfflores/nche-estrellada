import { configured, isAdmin, json } from "../../_shared.mjs";

export async function onRequestGet({ request, env }) {
  if (!configured(env)) return json({ error:"Panel no configurado." }, 503);
  return json({ authenticated:await isAdmin(env, request) });
}
