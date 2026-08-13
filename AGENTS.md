# Human-Skill-Tree

A web-based interactive skill tree: a static single-page app (no build step) that
renders a 9-domain human skill taxonomy as a Cytoscape.js graph with a
Domain → Category → Skill hierarchy, cross-domain edges, and a Dreyfus-based
proficiency scale per skill.

## Knowledge Folder

Topic-specific reference docs live in `.know/`. When working on a
subsystem listed below, consult its file first; when you add, remove, or
meaningfully change the underlying surface (new route, new env var, schema
change, etc.), update the matching file in the same change.

- `architecture.md` — App structure: Cytoscape.js frontend, theming, graph data flow, and the legacy Python generator scripts. Open when touching `index.html`, `static/`, or the serving setup.
- `data-model.md` — Node/edge schema, hierarchy rules, ID conventions, proficiency scale. Open when adding skills, categories, domains, or edge types to `graph_data.json`.
- `taxonomy.md` — The 9 domains and the design decisions behind them. Open when placing skills, proposing new domains, or questioning category boundaries.
- `tooling.md` — How to run/serve the app, the venv and its PATH quirk, and the beans workflow. Open for setup, Docker, or task-tracking questions.

## Commands

- Serve for development: `python -m http.server`, then http://localhost:8000
- Serve via Docker: `docker compose up`, then http://localhost:3123
- Session startup: `beans prime` (loads task-tracking context; all work is tracked in beans, and bean files are committed with the code)

## Design philosophy

The taxonomy is validated with real content, not in the abstract: new categories
earn their place by holding 3–5 concrete skills under pressure-testing. Skills
get exactly one primary home in the tree; everything else is an edge, not a
duplicate node.
