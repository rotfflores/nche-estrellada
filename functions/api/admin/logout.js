import { expiredCookie, json, sameOrigin } from "../../_shared.mjs";

export function onRequestPost({ request }) {
  if (!sameOrigin(request)) return json({ error:"Origen no permitido." }, 403);
  return json({ authenticated:false }, 200, { "Set-Cookie":expiredCookie(request) });
}
