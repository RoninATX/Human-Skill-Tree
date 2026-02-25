# Human Skill Tree

A personal skill tree visualization — static HTML/JS, no backend required.

## Quick Start

Serve the files with any static server:

```bash
python -m http.server
# or: npx serve
```

Then open `http://localhost:8000`.

## Structure

```
index.html              # Main page
static/
  css/styles.css        # Theme + layout
  js/visualization.js   # Cytoscape graph logic
  data/graph_data.json  # Skill data (source of truth)
  images/               # Node icons
```

## Customizing Skills

Edit `static/data/graph_data.json`. Each node needs:

```json
{
  "data": {
    "id": "unique-id",
    "label": "Skill Name",
    "proficiency": { "min": 0, "max": 10 },
    "image": "static/images/icon.svg"
  }
}
```

Edges link skills: `{ "data": { "source": "parent-id", "target": "child-id" } }`

## Dependencies (loaded via CDN)

- Cytoscape.js
- Dagre layout
- Font Awesome
