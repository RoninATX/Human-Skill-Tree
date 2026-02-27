---
# Human-Skill-Tree-691i
title: Domain Ontology & Tree Structure
status: completed
type: milestone
priority: high
created_at: 2026-02-26T23:27:37Z
updated_at: 2026-02-27T05:27:18Z
blocking:
    - d838
---

Define the foundational shape of the skill tree itself — top-level domains, nesting depth, and the data model that supports it all.

## Key Questions
- What are the top-level domains? (Physical, Mental, Creative, Technical, Social, etc.)
- How deep does nesting go? (Domain > Category > Subcategory > Skill?)
- Is the hierarchy strict or can skills exist in multiple places?
- What does the node data model look like?

## Checklist
- [ ] Research existing skill/competency taxonomies for inspiration
- [ ] Define top-level domain categories
- [ ] Decide on nesting depth and hierarchy rules
- [ ] Design the core data model (node schema, relationship types)
- [ ] Update graph_data.json schema to support the new model
- [ ] Validate the ontology with a few example domains end-to-end