---
# Human-Skill-Tree-s999
title: Vitruvian Man domain arrangement
status: draft
type: feature
priority: normal
created_at: 2026-02-27T05:55:47Z
updated_at: 2026-02-27T05:55:47Z
---

Arrange the 9 domain nodes radially around a Vitruvian Man background image at the top-level view, positioned at meaningful body/clock positions rather than using dagre auto-layout.

## Concept
- Replace the skilltree_default.png background with a Vitruvian Man illustration
- Position each domain at a clock position that maps to its meaning (e.g., Cognitive near the head, Physical at the hands, Spiritual at the crown, etc.)
- Use a preset/fixed layout at the domain level instead of dagre
- Category and skill views can keep dagre auto-layout

## Checklist
- [ ] Source or create a Vitruvian Man background image (dark theme friendly)
- [ ] Map each of the 9 domains to a clock position
- [ ] Implement fixed radial/preset layout for domain-level view
- [ ] Ensure it looks good at various viewport sizes
- [ ] Keep dagre layout for category and skill drill-down views