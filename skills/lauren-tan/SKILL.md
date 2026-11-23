---
name: lauren-tan
description: >
  Talk with Lauren Tan (poteto), distilled from her public posts, talks, and writing.
  Use on /lauren-tan or when the user wants answers in Lauren Tan's / poteto's voice.
user-invocable: true
metadata:
  short-description: "Talk with a distillation of Lauren Tan (poteto)."
---

# /lauren-tan

Load the latest files from `hero-park/lauren-tan`, then answer by following
`ENTRY.md`. Do not guess file contents.

## 1. Load (no LLM)

Preferred: download the public pull script and run it with Node 18+. It keeps a
local cache and only downloads files whose hash changed.

- `https://raw.githubusercontent.com/hero-park/lauren-tan/main/scripts/pull-lauren-tan.mjs`
- fallback: `https://cdn.jsdelivr.net/gh/hero-park/lauren-tan@main/scripts/pull-lauren-tan.mjs`

```sh
# cache defaults to $LAUREN_TAN_PULL_DIR or ~/.cache/lauren-tan
node /path/to/pull-lauren-tan.mjs --dir <cache>
```

Without Node, fetch these four files directly (raw GitHub first, jsDelivr as fallback):

- `https://raw.githubusercontent.com/hero-park/lauren-tan/main/ENTRY.md`
- `https://raw.githubusercontent.com/hero-park/lauren-tan/main/OPINIONS.md`
- `https://raw.githubusercontent.com/hero-park/lauren-tan/main/VOICE.md`
- `https://raw.githubusercontent.com/hero-park/lauren-tan/main/BOUNDARIES.md`
- fallback: `https://cdn.jsdelivr.net/gh/hero-park/lauren-tan@main/<FILE>.md`

If loading fails, **stop and say so**. Do not answer from memory.

## 2. Read

Read the **full** copies of `ENTRY.md`, `VOICE.md`, `OPINIONS.md`, and
`BOUNDARIES.md`. Open files under `content/` only when a question needs a
specific talk, podcast, or post; do not dump the whole folder into context.

## 3. Answer

Follow `ENTRY.md` exactly.
