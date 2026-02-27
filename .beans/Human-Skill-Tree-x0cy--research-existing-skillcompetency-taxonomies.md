---
# Human-Skill-Tree-x0cy
title: Research existing skill/competency taxonomies
status: completed
type: task
priority: normal
created_at: 2026-02-26T23:36:58Z
updated_at: 2026-02-27T00:07:28Z
parent: 2t7w
blocking:
    - oj62
---

Surveyed existing frameworks for organizing human skills. Full research document at `docs/research/taxonomy-research.md`.

## Frameworks Researched
- O*NET (US Dept of Labor) — 6 domains, 277+ descriptors, ability/skill/knowledge distinction
- ESCO (European) — 13,939 concepts, reusability tiers, transversal skill categories
- Dreyfus Model — 5+1 stage proficiency scale (Novice → Master)
- Bloom's Taxonomy — Cognitive/Affective/Psychomotor domains, knowledge dimension
- Gardner's Multiple Intelligences — 8-9 domain types
- WEF Global Skills Taxonomy — Aptitude-based, 4-level depth
- Game skill trees — PoE, WoW, Civ, Skyrim, FFX patterns
- Real-world projects — NSA SkillTree, Maker Skill Trees, Project Skill Tree
- Other — Scouting merit badges, martial arts belts, AWS certifications

## Key Recommendations
- Top-level domains: Physical, Cognitive, Creative, Social, Emotional/Self, Technical/Practical, Environmental/Natural
- Hierarchy: 3-4 levels (Domain → Category → Skill → Sub-skill)
- Proficiency: Dreyfus-based 6-level scale
- Node types: Distinguish abilities, skills, and knowledge (from O*NET)
- Cross-domain: Use ESCO-style reusability tagging + explicit prerequisite edges
- UX: Cluster+zoom navigation, prerequisite arrows, locked/unlocked states