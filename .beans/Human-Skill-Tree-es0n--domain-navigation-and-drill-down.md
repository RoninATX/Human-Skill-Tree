---
# Human-Skill-Tree-es0n
title: Domain navigation and drill-down
status: completed
type: feature
priority: normal
created_at: 2026-02-26T23:37:29Z
updated_at: 2026-02-27T05:26:54Z
parent: 8c45
blocking:
    - q3l0
---

Implemented drill-down navigation with 3 view levels and breadcrumb.

## Navigation Flow
1. **Top level** — Shows only the 9 domain nodes in a clean grid
2. **Click a domain** — Drills into that domain, showing its categories with hierarchy edges
3. **Click a category** — Drills into that category, showing its skills with all relevant edges

## Breadcrumb
- Centered bar at top of viewport: Home > Domain > Category
- Click any breadcrumb segment to navigate back to that level
- Escape/Backspace keyboard shortcuts to go back one level

## Sidebar Integration
- Tapping a node both navigates AND shows details in sidebar
- Hint text ("Click to explore categories/skills") at domain and category levels
- Skill detail view unchanged (proficiency pips, tags, description)

## Edge Visibility
- Hierarchy edges shown between parent and children at each level
- Prerequisite/cross-domain/complement edges shown only when both endpoints are visible
- Prevents confusing long-distance edges at higher zoom levels

## Technical
- Uses Cytoscape `.hidden` class with `display: none` for filtering
- Re-runs dagre layout on visible elements at each navigation
- Animated transitions (400ms) between views