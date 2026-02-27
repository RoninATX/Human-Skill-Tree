---
# Human-Skill-Tree-qi2m
title: Design Node Data Model
status: completed
type: epic
priority: high
created_at: 2026-02-26T23:36:47Z
updated_at: 2026-02-27T03:59:02Z
parent: 691i
---

Design the core data schema for skill tree nodes that supports domains, hierarchy depth, node types, and future extensibility.

## Context
Current node schema is minimal:
- id, label, image, proficiency (min/max/current)
- Edges are simple source/target pairs

We need a schema that distinguishes between domain nodes, category nodes, and leaf skill nodes, supports metadata, and can grow with Lanes 1-5.

## Key Decisions
- Node type system (domain / category / subcategory / skill)
- What metadata each node type carries
- How edges encode relationship type (hierarchy vs. cross-domain)
- Schema versioning strategy