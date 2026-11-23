#!/usr/bin/env node
/**
 * Incremental pull of the hero-park/lauren-tan public distillation.
 *
 * Usage:
 *   node scripts/pull-lauren-tan.mjs
 *   node scripts/pull-lauren-tan.mjs --dir ~/.cache/lauren-tan
 *   LAUREN_TAN_PULL_DIR=/path node scripts/pull-lauren-tan.mjs
 *
 * Defaults:
 *   Local cache: $LAUREN_TAN_PULL_DIR or ~/.cache/lauren-tan (./lauren-tan-cache if HOME unset)
 *   Remote: raw.githubusercontent.com/hero-park/lauren-tan/main/...
 *           fallback cdn.jsdelivr.net/gh/hero-park/lauren-tan@main/...
 *   $LAUREN_TAN_PULL_BASE overrides the remote base URL (testing/mirrors).
 *
 * Reads content/MANIFEST.json, hashes the cached copies, and downloads
 * only new/changed files: root docs (manifest "docs") and content/ cards
 * (manifest "files"). Verifies sha256, deletes files that left the manifest.
 * First empty cache = full pull. No LLM. Exit 1 on any hard failure.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { homedir } from 'node:os';

const OWNER = 'hero-park';
const REPO = 'lauren-tan';
const BRANCH = 'main';
const ROOT_DOCS = ['ENTRY.md', 'VOICE.md', 'OPINIONS.md', 'BOUNDARIES.md'];
const BASES = process.env.LAUREN_TAN_PULL_BASE
  ? [process.env.LAUREN_TAN_PULL_BASE.replace(/\/+$/, '')]
  : [
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`,
      `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}`,
    ];

function usage() {
  console.log(`Usage: node scripts/pull-lauren-tan.mjs [--dir <cacheDir>] [--help]

Fetches content/MANIFEST.json from ${OWNER}/${REPO}@${BRANCH}, then downloads only
new/changed root docs (${ROOT_DOCS.join(', ')}) and content/ cards.

Options:
  --dir <path>   Local cache directory (default: $LAUREN_TAN_PULL_DIR or ~/.cache/lauren-tan)
  --help         Show this help

Env:
  LAUREN_TAN_PULL_DIR    Override default cache directory
  LAUREN_TAN_PULL_BASE   Override remote base URL
`);
}

function parseArgs(argv) {
  const out = { dir: process.env.LAUREN_TAN_PULL_DIR || null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--dir') out.dir = argv[++i];
    else if (a.startsWith('--dir=')) out.dir = a.slice(6);
    else throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

function defaultDir() {
  const home = homedir();
  return home ? join(home, '.cache', 'lauren-tan') : resolve('lauren-tan-cache');
}

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

async function fetchBytes(relPath) {
  let lastErr;
  for (const base of BASES) {
    const url = `${base}/${relPath}`;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status} for ${url}`);
        continue;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error(`Failed to fetch ${relPath}`);
}

async function readJson(p, fallback) {
  if (!existsSync(p)) return fallback;
  try {
    return JSON.parse(await readFile(p, 'utf8'));
  } catch {
    return fallback;
  }
}

// Only plain relative paths inside the cache: ROOT_DOCS or content/<name>.
function safeRel(rel) {
  if (typeof rel !== 'string' || rel.includes('..') || rel.startsWith('/') || rel.includes('\\')) return false;
  return ROOT_DOCS.includes(rel) || /^content\/[A-Za-z0-9._-]+$/.test(rel);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  const cacheDir = resolve(args.dir || defaultDir());
  await mkdir(join(cacheDir, 'content'), { recursive: true });

  let manifestBuf;
  let manifest;
  try {
    manifestBuf = await fetchBytes('content/MANIFEST.json');
    manifest = JSON.parse(manifestBuf.toString('utf8'));
  } catch (err) {
    throw new Error(`failed to load content/MANIFEST.json: ${err.message || err}`);
  }

  const localManifest = await readJson(join(cacheDir, 'content', 'MANIFEST.json'), { files: [], docs: [] });
  const entries = [...(manifest.docs || []), ...(manifest.files || [])].filter((e) => safeRel(e.path));
  const localEntries = [...(localManifest.docs || []), ...(localManifest.files || [])];
  const localHash = new Map(localEntries.map((e) => [e.path, e.sha256]));
  const remotePaths = new Set(entries.map((e) => e.path));

  let neu = 0;
  let updated = 0;
  let removed = 0;
  let unchanged = 0;

  for (const entry of entries) {
    const dest = join(cacheDir, entry.path);
    // Skip when the cached file's own bytes already match (catches local edits too).
    if (existsSync(dest) && sha256(await readFile(dest)) === entry.sha256) {
      unchanged += 1;
      continue;
    }
    const buf = await fetchBytes(entry.path);
    const hash = sha256(buf);
    if (entry.sha256 && hash !== entry.sha256) {
      throw new Error(`hash mismatch for ${entry.path}: got ${hash}, expected ${entry.sha256}`);
    }
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    if (localHash.has(entry.path)) updated += 1;
    else neu += 1;
  }

  // Remove cached files that left the manifest.
  for (const e of localEntries) {
    if (!safeRel(e.path) || remotePaths.has(e.path)) continue;
    const dest = join(cacheDir, e.path);
    if (existsSync(dest)) {
      await unlink(dest);
      removed += 1;
    }
  }
  for (const name of await readdir(join(cacheDir, 'content'))) {
    if (name === 'MANIFEST.json' || !name.endsWith('.md')) continue;
    if (!remotePaths.has(`content/${name}`)) {
      await unlink(join(cacheDir, 'content', name));
      removed += 1;
    }
  }

  // Write the manifest last so an interrupted pull retries next time.
  await writeFile(join(cacheDir, 'content', 'MANIFEST.json'), manifestBuf);
  console.log(`pulled: ${neu} new / ${updated} updated / ${removed} removed / ${unchanged} unchanged → ${cacheDir}${sep}`);
}

main().catch((err) => {
  console.error(`pull-lauren-tan: ${err.message || err}`);
  process.exit(1);
});
