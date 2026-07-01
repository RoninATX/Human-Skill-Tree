# Human Skill Tree

A personal skill tree visualization — static HTML/JS, no server required.

## Quick Start

Just open `index.html` in your browser. That's it.

(Or serve it: `npx serve` / `python -m http.server`)

## Structure

```
index.html                 # Main page
static/
  css/styles.css           # Theme + layout
  js/visualization.js      # Cytoscape graph + skill data
  images/                  # Node icons
```

## Customizing Skills

Edit the `graphData` object at the top of `static/js/visualization.js`:

```js
const graphData = {
    nodes: [
        { data: { id: "skill-id", label: "Display Name", proficiency: { min: 1, max: 10 }, image: "static/images/icon.png" } },
        // ...
    ],
    edges: [
        { data: { source: "parent-id", target: "child-id" } },
        // ...
    ]
};
```

## Dependencies (loaded via CDN)

- Cytoscape.js
- Dagre layout
- Font Awesome
