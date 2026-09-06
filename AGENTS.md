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
- `profile-auth.md` — Local-first accounts, login/signup semantics, profile panel, and the interest tag cloud. Open when touching auth, the profile UI, or user records.
- `data-model.md` — Node/edge schema, hierarchy rules, ID conventions, proficiency scale. Open when adding skills, categories, domains, or edge types to `graph_data.json`.
- `taxonomy.md` — The 9 domains and the design decisions behind them. Open when placing skills, proposing new domains, or questioning category boundaries.
- `tooling.md` — How to run/serve the app (serve.sh, Python env, Docker), and the beans workflow. Open for setup, serving, or task-tracking questions.
- `.pi/skills/context/SKILL.md` and `.graph/graphscout.py` — The derived beans+knowledge retrieval graph (`context`, `rot`), its citation discipline, and the vendored implementation. Open when tracing related work or refreshing `.graph/`.

## Artifact Graph

Beans and `.know/` docs form one derived graph, rebuilt on demand (never cached).
Before planning work on a tracked item, run `/context <bean-id>` to get the artifacts
that actually cite it — read what DOCUMENTS it first. When writing a bean or a
knowledge file, cite related items by id in the prose (`paired with <id>`); those
citations are what create the edges.

## Commands

- Serve for development: `scripts/serve.sh start` (stop/status/restart subcommands), then http://localhost:8000
- Serve via Docker (not default): `docker compose up`, then http://localhost:3123
- Session startup: `beans prime` (loads task-tracking context; all work is tracked in beans). The repo is public, so `.beans/` is git-ignored — task data is local-only; commit code without bean files.

## Tracker Shape

Three standing milestones **never close**: **Hardening & Cleanup Backlog**
(`Human-Skill-Tree-3wqy`) holds the standing buckets — CVE & Security (`pca4`),
Operational (`2cuh`), Documentation (`f3cz`), Coordination Needed (`l408`);
**Platform & Capability** (`Human-Skill-Tree-x4v7`) holds real feature epics that
aren't developmental-stage work; **Curriculum & Learning Paths**
(`Human-Skill-Tree-u8ye`) holds the curriculum attachment model and per-skill
curriculum epics (BJJ, First-Aid, …) — a skill graduates into an epic there when
its internal curriculum is too rich for one skill node. Stage work belongs to the
milestone chain 691i → d838 → d896 → 9ig8 → k13v → 7rwp → nyhy.

- **File by what unblocks the work, not by subject.**
- Childless containers are `draft` — count children of **every** status; a
  container whose children all completed is finished, not unstarted.
- Completed work is archived on a boundary (`beans archive`), never re-parented
  under PR/session-named epics.

## Design philosophy

The taxonomy is validated with real content, not in the abstract: new categories
earn their place by holding 3–5 concrete skills under pressure-testing. Skills
get exactly one primary home in the tree; everything else is an edge, not a
duplicate node.
