#!/usr/bin/env node
/* Installs the exact ThreeUI Sylva "Living Green" runtime files and verifies
   every one against the SHA-256 recorded in the ThreeUI source bundle.
   Nothing is kept unless its hash matches.

   Usage:  node scripts/install-sylva-assets.mjs
           node scripts/install-sylva-assets.mjs --from <dir>   (search a local dir, e.g. an unpacked npm package)
   Needs Node 18+.                                                              */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://threeui.com";

/* dest = path inside this project; url = where the preview serves it; sha = bundle hash */
const FILES = [
  { dest: "landing-pages/inner-green-3d.html",
    url: "/landing-pages/inner-green-3d.html",
    sha: "69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197", required: true },
  { dest: "landing-pages/inner-green-assets/three.min.js",
    url: "/landing-pages/inner-green-assets/three.min.js",
    sha: "8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271", required: true },
  /* The shipped HTML points at remote copies of these three, so they are optional here.
     Installed (and verified) when available so the page can be moved offline later. */
  { dest: "landing-pages/inner-green-assets/card-ecostove.jpg",
    url: "/landing-pages/inner-green-assets/card-ecostove.jpg",
    sha: "70ce084084902bc502f00c366405b661ecdff90dee95d363b36a6e146829e433", required: false },
  { dest: "landing-pages/inner-green-assets/card-ethos.jpg",
    url: "/landing-pages/inner-green-assets/card-ethos.jpg",
    sha: "337627390f499b3ae272cec9e2f83c817694a82f42e1aa10a7b26a2c7d679dff", required: false },
  { dest: "landing-pages/inner-green-assets/lexend-latin.woff2",
    url: "/landing-pages/inner-green-assets/lexend-latin.woff2",
    sha: "1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46", required: false },
];

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== ".git") yield* walk(p); }
    else yield p;
  }
}

const fromIdx = process.argv.indexOf("--from");
const fromDir = fromIdx > -1 ? resolve(process.argv[fromIdx + 1] || "") : null;

let localIndex = null;
async function findLocal(sha) {
  if (!fromDir) return null;
  if (!localIndex) {
    localIndex = new Map();
    for await (const p of walk(fromDir)) {
      if ((await stat(p)).size > 5e6) continue;
      localIndex.set(sha256(await readFile(p)), p);
    }
  }
  const p = localIndex.get(sha);
  return p ? readFile(p) : null;
}

let failed = false;
for (const f of FILES) {
  let buf = await findLocal(f.sha);
  let how = "local";
  if (!buf) {
    how = "download";
    try {
      const res = await fetch(ORIGIN + f.url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      buf = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      console.log(`${f.required ? "FAIL" : "skip"}  ${f.dest}  (${err.message})`);
      if (f.required) failed = true;
      continue;
    }
  }
  const got = sha256(buf);
  if (got !== f.sha) {
    console.log(`${f.required ? "FAIL" : "skip"}  ${f.dest}  hash mismatch\n        want ${f.sha}\n        got  ${got}`);
    if (f.required) failed = true;
    continue;
  }
  const out = join(root, f.dest);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  console.log(`ok    ${f.dest}  ${buf.length} bytes  sha256 verified (${how})`);
}
if (failed) {
  console.error("\nA required file could not be verified. Re-run with network access, or pass --from <dir> pointing at an unpacked @designcodeio/threeui package.");
  process.exit(1);
}
console.log("\nDone. Open /sylva-hero.html through a local server (npx serve -s .).");
