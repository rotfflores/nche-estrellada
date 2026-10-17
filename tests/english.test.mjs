import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { runInNewContext } from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = name => readFileSync(join(root, name), "utf8");

test("the English invitation shares event data and photos with the Spanish invitation", () => {
  const window = {};
  runInNewContext(read("config.js"), { window });
  const spanish = window.INVITATION_CONFIG;
  runInNewContext(read("config-en.js"), { window });
  const english = window.INVITATION_CONFIG;
  assert.equal(english.locale, "en");
  assert.equal(english.eventStart, spanish.eventStart);
  assert.equal(english.venue.mapsUrl, spanish.venue.mapsUrl);
  assert.equal(english.audioStart, spanish.audioStart);
  assert.equal(english.evolution.photos.length, spanish.evolution.photos.length);
  assert.equal(english.album.photos.length, spanish.album.photos.length);
  assert.equal(english.groupGallery.photos.length, spanish.groupGallery.photos.length);
  assert.match(english.rsvp.thanksYesTitle, /\{nombre\}/);
  assert.match(english.rsvp.thanksYesText, /\{fecha\}.*\{hora\}.*\{lugar\}/);
  assert.equal(english.album.photos.at(-1).caption, "Leo y Ángel");

  const assetPaths = [english.photo, english.audio,
    ...english.evolution.photos.map(photo => photo.src),
    ...english.album.photos.map(photo => photo.src),
    ...english.groupGallery.photos.map(photo => photo.src),
    ...Object.values(english.venue.photos).map(photo => photo.src),
  ].filter(Boolean);
  for (const asset of assetPaths) {
    assert.match(asset, /^\.\.\/assets\//);
    assert.ok(existsSync(join(root, "en", asset.split("?")[0])), asset);
  }
});

test("the English page has its own metadata and reuses the shared RSVP script", () => {
  const html = read("en/index.html");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /property="og:url" content="https:\/\/noche-estrellada\.rotfstudio\.com\/en\/"/);
  assert.match(html, /assets\/share-en\.png/);
  assert.match(html, /src="\.\.\/config-en\.js\?v=/);
  assert.match(html, /src="\.\.\/script\.js\?v=/);
  assert.match(html, /id="rsvp-form"/);
  assert.match(html, /Open my invitation/);
  assert.match(html, /Please RSVP!/);
  assert.match(html, />Date<\/dt>/);
  assert.doesNotMatch(html, />Fecha<\/dt>/);
  assert.ok(existsSync(join(root, "assets", "share-en.png")));
});
