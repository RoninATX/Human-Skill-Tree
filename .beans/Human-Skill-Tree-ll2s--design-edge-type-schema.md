---
# Human-Skill-Tree-ll2s
title: Design edge type schema
status: completed
type: feature
priority: normal
created_at: 2026-02-26T23:37:17Z
updated_at: 2026-02-27T03:58:59Z
parent: qi2m
blocking:
    - g1k5
---

Designed edge type schema with 4 edge types. Full spec at `docs/research/data-schema.md`.

## Edge Types
- **hierarchy** — domain→category, category→skill (tree structure)
- **prerequisite** — skill→skill, directional (learn A before B)
- **cross-domain** — skill↔skill across domains, with strength (strong/moderate/light)
- **complements** — skill↔skill, bidirectional (enhance each other, no ordering)

## Key Decisions
- Cross-domain edges carry a strength field for transfer learning intensity
- Visual styling varies by type: solid/dashed/dotted, arrows for directional edges
- Prerequisite edges are strictly between skills, not domains or categories