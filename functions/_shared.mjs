const encoder = new TextEncoder();

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export function sameOrigin(request) {
  return request.headers.get("Origin") === new URL(request.url).origin;
}

export function configured(env) {
  return Boolean(env.DB && env.ADMIN_PASSWORD && env.SESSION_SECRET);
}

export async function readJson(request) {
  if (!request.headers.get("Content-Type")?.startsWith("application/json")) return null;
  const body = await request.text();
  if (body.length > 2048) return null;
  try { return JSON.parse(body); } catch { return null; }
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name:"HMAC", hash:"SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

export async function fingerprint(secret, value) {
  return base64url(await hmac(secret, value));
}

export async function passwordMatches(env, password) {
  const actual = await hmac(env.SESSION_SECRET, password);
  const expected = await hmac(env.SESSION_SECRET, env.ADMIN_PASSWORD);
  let difference = 0;
  for (let i = 0; i < actual.length; i += 1) difference |= actual[i] ^ expected[i];
  return difference === 0;
}

export async function sessionCookie(env, request) {
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const nonce = crypto.randomUUID();
  const value = `v1.${expires}.${nonce}`;
  const signed = `${value}.${await fingerprint(env.SESSION_SECRET, value)}`;
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `victoria_admin=${signed}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=43200${secure}`;
}

export async function isAdmin(env, request) {
  if (!configured(env)) return false;
  const cookie = request.headers.get("Cookie")?.match(/(?:^|;\s*)victoria_admin=([^;]+)/)?.[1];
  if (!cookie) return false;
  const parts = cookie.split(".");
  if (parts.length !== 4 || parts[0] !== "v1" || !/^\d{13}$/.test(parts[1])) return false;
  if (Number(parts[1]) < Date.now()) return false;
  const unsigned = parts.slice(0, 3).join(".");
  const expected = await fingerprint(env.SESSION_SECRET, unsigned);
  if (parts[3].length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i += 1) difference |= parts[3].charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}

export function expiredCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `victoria_admin=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}
