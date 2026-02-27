---
# Human-Skill-Tree-oj62
title: Draft top-level domain list
status: completed
type: task
priority: normal
created_at: 2026-02-26T23:37:01Z
updated_at: 2026-02-27T03:20:24Z
parent: 2t7w
blocking:
    - k3di
---

Defined 9 top-level domains for the Human Skill Tree, validated against 26 real skills provided by the user. Full documentation at `docs/research/domain-categories.md`.

## The 9 Domains
1. Physical — Athletics, martial arts, fitness, body mastery
2. Cognitive — Reasoning, analysis, psychology, research, strategy
3. Creative — Visual arts, music, writing, design, performance
4. Social — Communication, leadership, teaching, persuasion
5. Emotional — Self-awareness, regulation, resilience, mindfulness
6. Technical — Engineering, programming, craftsmanship, tool use, mechanics
7. Fieldcraft — Outdoor skills, navigation, bushcraft, survival, ecology
8. Practical — Life management, finance, health, driving, first aid
9. Spiritual — Contemplative practice, ethics, philosophy, faith traditions

## Key Decisions
- Renamed "Environmental" → "Fieldcraft" (better captures tactical/outdoor/survival flavor)
- Added "Spiritual" as a full domain (not optional)
- Cross-domain links handle compound skills (e.g., Recce → primary Fieldcraft, cross-links to Physical, Cognitive, Technical)
- All 26 test skills placed cleanly without forcing