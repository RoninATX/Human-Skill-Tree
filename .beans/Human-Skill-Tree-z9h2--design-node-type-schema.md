---
# Human-Skill-Tree-z9h2
title: Design node type schema
status: completed
type: feature
priority: normal
created_at: 2026-02-26T23:37:13Z
updated_at: 2026-02-27T03:58:58Z
parent: qi2m
blocking:
    - g1k5
---

Designed node type schema with 3 node types matching the 3-level hierarchy. Full spec at `docs/research/data-schema.md`.

## Node Types
- **domain** — id, label, description, image, color (hex for visual theming)
- **category** — id, label, description, image, domain (parent ref)
- **skill** — id, label, description, image, domain, category, proficiency (0-6 Dreyfus scale), tags

## Key Decisions
- Short human-readable IDs (e.g., `land-nav`, `bjj`), globally unique
- Hierarchy expressed via domain/category fields, not encoded in IDs
- Proficiency only on skill nodes (0 = not started, 1-6 = novice through master)
- Scale defined per-skill to allow Lane 2 customization, with Dreyfus 6-tier as default
- Domain color inherited by categories and skills for visual theming
- Image fallback chain: skill icon → category icon → domain icon → default