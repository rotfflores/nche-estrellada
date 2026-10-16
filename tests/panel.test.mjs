import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import { onRequestPost as submit } from "../functions/api/rsvp.js";
import { onRequestPost as login } from "../functions/api/admin/login.js";
import { onRequestGet as responses } from "../functions/api/admin/responses.js";
import { onRequestGet as session } from "../functions/api/admin/session.js";
import { onRequestPost as logout } from "../functions/api/admin/logout.js";
import worker from "../worker.mjs";

function database() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/0001_rsvp.sql", import.meta.url), "utf8"));
  return {
    prepare(sql) {
      const statement = db.prepare(sql);
      return {
        bind(...values) {
          return {
            first:async () => statement.get(...values) || null,
            all:async () => ({ results:statement.all(...values) }),
            run:async () => statement.run(...values),
          };
        },
        first:async () => statement.get() || null,
        all:async () => ({ results:statement.all() }),
      };
    },
  };
}

function request(path, body, headers = {}) {
  const url = `https://invitation.example${path}`;
  return new Request(url, body === undefined ? { headers } : {
    method:"POST", headers:{ Origin:"https://invitation.example", "Content-Type":"application/json", ...headers },
    body:JSON.stringify(body),
  });
}

test("las respuestas se guardan, se pueden corregir y solo la sesión privada las ve", async () => {
  const env = { DB:database(), ADMIN_PASSWORD:"contraseña de prueba segura", SESSION_SECRET:"secreto de prueba largo para firmar" };
  const id = "5fc82b58-3f58-49d4-a0b2-3a226df7fb74";
  const first = await submit({ env, request:request("/api/rsvp", { id, answer:"si", name:"  Ana   Pérez  ", message:"¡Nos vemos!" }) });
  assert.equal(first.status, 201);
  const anonymous = await responses({ env, request:request("/api/admin/responses") });
  assert.equal(anonymous.status, 401);
  const wrongOrigin = await submit({ env, request:request("/api/rsvp", { id, answer:"si", name:"Ana" }, { Origin:"https://otro.example" }) });
  assert.equal(wrongOrigin.status, 403);
  const invalid = await submit({ env, request:request("/api/rsvp", { id, answer:"si", name:"" }) });
  assert.equal(invalid.status, 400);
  const corrected = await submit({ env, request:request("/api/rsvp", { id, answer:"si", name:"Ana Pérez", message:"Con mucho cariño" }) });
  assert.equal(corrected.status, 201);

  const signedIn = await login({ env, request:request("/api/admin/login", { password:env.ADMIN_PASSWORD }, { "CF-Connecting-IP":"192.0.2.1" }) });
  assert.equal(signedIn.status, 200);
  const cookie = signedIn.headers.get("Set-Cookie").split(";")[0];
  const checkSession = await session({ env, request:request("/api/admin/session", undefined, { Cookie:cookie }) });
  assert.equal((await checkSession.json()).authenticated, true);
  const privateList = await responses({ env, request:request("/api/admin/responses", undefined, { Cookie:cookie }) });
  assert.equal(privateList.status, 200);
  const rows = (await privateList.json()).responses;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "Ana Pérez");
  assert.equal(rows[0].message, "Con mucho cariño");
  const signedOut = await logout({ request:request("/api/admin/logout", {}, { Cookie:cookie }) });
  assert.match(signedOut.headers.get("Set-Cookie"), /Max-Age=0/);
});

test("el panel bloquea el sexto intento incorrecto durante quince minutos", async () => {
  const env = { DB:database(), ADMIN_PASSWORD:"contraseña correcta", SESSION_SECRET:"otro secreto largo de prueba" };
  const headers = { "CF-Connecting-IP":"192.0.2.2" };
  for (let index = 0; index < 5; index += 1) {
    const result = await login({ env, request:request("/api/admin/login", { password:"incorrecta" }, headers) });
    assert.equal(result.status, 401);
  }
  const blocked = await login({ env, request:request("/api/admin/login", { password:env.ADMIN_PASSWORD }, headers) });
  assert.equal(blocked.status, 429);
});

test("el Worker atiende solo las rutas de la API", async () => {
  const missing = await worker.fetch(request("/api/desconocida"), {});
  assert.equal(missing.status, 404);
  const wrongMethod = await worker.fetch(request("/api/rsvp"), {});
  assert.equal(wrongMethod.status, 405);
});
