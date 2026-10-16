// API en Cloudflare Worker: deja la invitación estática en GitHub Pages y atiende solo /api/*.
import { json } from "./functions/_shared.mjs";
import { onRequestPost as submit } from "./functions/api/rsvp.js";
import { onRequestPost as login } from "./functions/api/admin/login.js";
import { onRequestPost as logout } from "./functions/api/admin/logout.js";
import { onRequestGet as session } from "./functions/api/admin/session.js";
import { onRequestGet as responses } from "./functions/api/admin/responses.js";

const routes = {
  "/api/rsvp": { POST:submit },
  "/api/admin/login": { POST:login },
  "/api/admin/logout": { POST:logout },
  "/api/admin/session": { GET:session },
  "/api/admin/responses": { GET:responses },
};

export default {
  async fetch(request, env) {
    const route = routes[new URL(request.url).pathname];
    if (!route) return json({ error:"Ruta no encontrada." }, 404);
    const handler = route[request.method];
    if (!handler) return json({ error:"Método no permitido." }, 405, { Allow:Object.keys(route).join(", ") });
    return handler({ request, env });
  },
};
