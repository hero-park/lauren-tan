# content/

Public source cards for the Lauren Tan (poteto) distillation: one small file
per public talk, podcast, or long-form post the distillation draws on. Each card
has the title, venue, date, and public link. Cards hold no transcripts and no
copied post bodies; follow the link to read or watch the original.

File names: `YYYY-MM-DD_<source>_<slug>.md`, where `source` is `x`, `youtube`,
`blog`, `podcast`, `github`, or `web`.

`MANIFEST.json` lists:

- `files`: every card, with `path`, `source`, `id`, `created_at`, `url`, and
  `sha256` (file bytes).
- `docs`: the root docs (`ENTRY.md`, `VOICE.md`, `OPINIONS.md`,
  `BOUNDARIES.md`) with their `sha256`.

Consumers should fetch the remote `MANIFEST.json`, download only paths whose
hash changed, and delete local files that left the manifest. An empty cache
means one full pull; after that it's incremental:

```sh
node ../scripts/pull-lauren-tan.mjs --dir ~/.cache/lauren-tan
```

`OPINIONS.md` and `VOICE.md` stay the compact distilled maps; this folder is
just the list of where it came from.
