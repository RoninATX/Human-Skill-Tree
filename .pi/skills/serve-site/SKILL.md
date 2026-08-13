---
name: serve-site
description: Start, stop, or check the Human-Skill-Tree dev server for testing. Use when the user asks to run, launch, fire up, or test the site/app locally, or when a change to index.html / static/ needs browser verification.
disable-model-invocation: false
allowed-tools: bash read
---

# Serve the site

Human-Skill-Tree is a static app with no build step. The dev server is managed
by `scripts/serve.sh` at the repo root (run from anywhere; it cds itself).

## Commands

```bash
scripts/serve.sh start        # serve at http://localhost:8000 (or: start 8080)
scripts/serve.sh status       # pid + health check
scripts/serve.sh stop
scripts/serve.sh restart
```

`start` is idempotent: if already running it reports the URL and exits 0. It
verifies the server actually answers (`index.html`, `static/data/graph_data.json`,
`static/js/visualization.js`) before reporting success, and refuses to start if
something foreign already owns the port.

State: `.serve.pid` and `.serve.log` at the repo root (git-ignored). If the
server misbehaves, read `.serve.log` first.

## When testing a change

1. `scripts/serve.sh restart` (or `start` if not running).
2. Verify the surface you changed with `curl -sf http://localhost:8000/<path>`
   — the graph data is `static/data/graph_data.json`, the app shell is
   `index.html`, client logic is `static/js/visualization.js`.
3. Leave the server running if the user may want to look at the site; say so
   and give the URL. Otherwise `scripts/serve.sh stop`.

Docker (`docker compose up`, port 3123) exists as an alternative but is not the
default path — prefer this script unless the user asks for Docker.
