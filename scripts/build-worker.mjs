import { readFile, writeFile } from "node:fs/promises";

const files = [
  ["functions/_shared.mjs", null],
  ["functions/api/rsvp.js", "submit"],
  ["functions/api/admin/login.js", "login"],
  ["functions/api/admin/logout.js", "logout"],
  ["functions/api/admin/session.js", "session"],
  ["functions/api/admin/responses.js", "responses"],
];

const sections = [];
for (const [path, handler] of files) {
  let source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  source = source.replace(/^import .+;\r?\n/gm, "");
  source = source.replace(/^export /gm, "");
  if (handler) source = source.replace(/\bonRequest(Get|Post)\b/g, handler);
  sections.push(`// ${path}\n${source.trim()}`);
}

const routing = `
const routes = {
  "/api/rsvp": { POST: submit },
  "/api/admin/login": { POST: login },
  "/api/admin/logout": { POST: logout },
  "/api/admin/session": { GET: session },
  "/api/admin/responses": { GET: responses },
};

export default {
  async fetch(request, env) {
    const route = routes[new URL(request.url).pathname];
    if (!route) return json({ error: "Ruta no encontrada." }, 404);
    const handler = route[request.method];
    if (!handler) return json({ error: "Método no permitido." }, 405, { Allow: Object.keys(route).join(", ") });
    return handler({ request, env });
  },
};
`;

const output = `${sections.join("\n\n")}\n${routing}`;
const outputPath = new URL("../worker-dashboard.mjs", import.meta.url);
await writeFile(outputPath, output);
console.log(`Built ${output.length} characters in worker-dashboard.mjs`);
