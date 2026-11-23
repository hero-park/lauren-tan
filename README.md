<h1 align="center">/lauren-tan</h1>

<p align="center">
  <a href="https://agentskills.io"
    ><img
      alt="Agent Skills"
      src="https://img.shields.io/badge/Agent%20Skills-package-blue?style=flat-square"
  /></a>
  <a href="https://x.com/poteto"
    ><img
      alt="X"
      src="https://img.shields.io/badge/X-@poteto-black?style=flat-square"
  /></a>
</p>

<h3 align="center">Talk with a distillation of Lauren Tan (poteto)</h3>

This is an agent skill that answers as **Lauren Tan**, aka
[poteto](https://x.com/poteto), in first person and in her voice. It's
distilled only from what she has said in public: her posts on X, her blog
[no.lol](https://www.no.lol/), her X articles and the pstack README, conference
talks (EmberConf, React Conf, AI Engineer CODE), and podcasts.

> **Disclaimer.** This is a distillation of Lauren Tan's public talks, posts,
> and writing. It is **not** Lauren, it doesn't know anything she hasn't said
> publicly, and it is **not endorsed by her**. Nothing it says should be quoted
> as something she said; for that, follow the links in `content/` to the
> originals.

## Quick start

```sh
# install (global recommended)
$ npx skills add hero-park/lauren-tan -g

# in your agent
/lauren-tan how do you get to the point where you trust your agents?
/lauren-tan should i become a manager?
/lauren-tan what do you think about useEffect?
/lauren-tan <literally anything>
```

Or copy `skills/lauren-tan/SKILL.md` into your agent's skills folder by hand.

## What's in the repo

| Path | What it is |
| --- | --- |
| `ENTRY.md` | Start here. How the agent speaks as Lauren and what it reads. |
| `VOICE.md` | How she sounds, with numbered exact quotes. |
| `OPINIONS.md` | What she thinks, by topic, plus her public background. |
| `BOUNDARIES.md` | What she's said she won't do or won't get into. |
| `content/` | One card per public talk, podcast, or long-form post (title, date, link), plus `MANIFEST.json`. No transcripts or copied posts. |
| `scripts/pull-lauren-tan.mjs` | Incremental pull into a local cache. No LLM, no GitHub auth. |
| `skills/lauren-tan/SKILL.md` | The thin loader your agent installs. |

## How it works

The skill file stays thin on purpose. On `/lauren-tan`, the agent runs the
public pull script, then reads the docs from a local cache and follows
`ENTRY.md`.

```
nightly refresh                      /lauren-tan question
      │                                     │
      ▼                                     ▼
┌──────────────────────┐          ┌───────────────────────────┐
│ new public posts,    │          │ node pull-lauren-tan.mjs  │
│ talks, and writing   │          │ → ~/.cache/lauren-tan     │
│ merged into the docs │          │ (or $LAUREN_TAN_PULL_DIR) │
└──────────┬───────────┘          └─────────────┬─────────────┘
           ▼                                    ▼
  ENTRY  VOICE  OPINIONS                read ENTRY + docs
  BOUNDARIES  content/ MANIFEST         (+ a content/ card if needed)
           \___________________________________/
                             │
                             ▼
                    answer in her voice
```

The docs are refreshed nightly (around 3am America/Los_Angeles) from her new
public posts, talks, podcasts, and writing, so the skill always reads the latest
commit on `main`.

## Pull script

```sh
# from a clone: incremental sync into ~/.cache/lauren-tan
node scripts/pull-lauren-tan.mjs

# pick the cache dir
node scripts/pull-lauren-tan.mjs --dir ~/.cache/lauren-tan
LAUREN_TAN_PULL_DIR=/tmp/lt node scripts/pull-lauren-tan.mjs

# or download the script alone:
#   https://raw.githubusercontent.com/hero-park/lauren-tan/main/scripts/pull-lauren-tan.mjs
#   (jsDelivr: https://cdn.jsdelivr.net/gh/hero-park/lauren-tan@main/scripts/pull-lauren-tan.mjs)
```

`pull-lauren-tan.mjs` fetches the remote `content/MANIFEST.json`
(raw.githubusercontent.com, jsDelivr fallback), compares it with the cached
copy, downloads only new or changed files (root docs and `content/` cards),
checks each file's sha256, and deletes cached files that left the manifest. An
empty cache gets one full pull; after that it's incremental. Needs Node 18+.

## Contributing

This repo is a generated distillation, so it doesn't take pull requests.
Corrections are welcome as issues, especially anything that misrepresents what
Lauren has said publicly.
