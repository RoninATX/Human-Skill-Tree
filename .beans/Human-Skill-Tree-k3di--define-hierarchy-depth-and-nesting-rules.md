---
# Human-Skill-Tree-k3di
title: Define hierarchy depth and nesting rules
status: completed
type: task
priority: normal
created_at: 2026-02-26T23:37:05Z
updated_at: 2026-02-27T03:35:18Z
parent: 2t7w
blocking:
    - z9h2
    - ll2s
---

Defined hierarchy depth and nesting rules. Full documentation at `docs/research/hierarchy-rules.md`.

## Structure
3 levels: Domain → Category → Skill. No 4th level — sub-skill granularity is handled by the mastery framework (Lane 2).

## Key Rules
1. Every skill belongs to exactly one category in one domain
2. Cross-domain relevance uses cross-domain links, not duplicate placement
3. When a skill has distinct practice methods/equipment/progression, split into sibling skills under a shared category (e.g., Marksmanship → Pistol, Long Range Precision)
4. Categories can vary in size — tree reflects reality, not symmetry
5. Sub-skill depth (e.g., BJJ → Guard Play) deferred to mastery framework

## Validated against all 9 domains with user's seed skills.