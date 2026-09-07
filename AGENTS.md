# Human-Skill-Tree

A static single-page skill-tree application built with Cytoscape.js. There is no
build step: `index.html` and `static/` are served directly.

## Contributor commands

- Validate graph data: `python scripts/validate_graph.py`
- Serve locally: `scripts/serve.sh start` (then http://localhost:8000)
- Stop/status: `scripts/serve.sh stop` / `scripts/serve.sh status`

## Code structure

- `static/js/visualization.js` — graph rendering and navigation.
- `static/data/graph_data.json` — domain, category, skill, and edge data.
- `static/css/styles.css` — presentation and responsive layout.
- `docs/research/adding-skills.md` — contributor workflow for taxonomy changes.

Keep each skill in exactly one primary category; express relationships with
edges rather than duplicated nodes.
