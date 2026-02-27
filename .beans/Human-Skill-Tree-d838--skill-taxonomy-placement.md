---
# Human-Skill-Tree-d838
title: Skill Taxonomy & Placement
status: draft
type: milestone
priority: high
created_at: 2026-02-26T23:27:48Z
updated_at: 2026-02-27T03:33:32Z
blocking:
    - d896
---

Populate the tree with real skills, properly categorized and placed within their domains. This is the content layer — turning the empty structure into a rich, navigable map of human capability.

## Key Questions
- How do we source/curate skills for each domain?
- What metadata does each skill need beyond name and position? (description, icon, tags?)
- How do we handle skills that span multiple domains? (cross-domain edges)
- What's the process for adding new skills over time?

## Seed Skills (from user interview)
These skills were validated during domain design and should be the first to populate the tree:

| Skill | Primary Domain | Cross-Links |
|-------|---------------|-------------|
| Jiu-Jitsu | Physical | — |
| Shooting (pistol/long range) | Physical | Technical |
| Behavioral Psychology | Cognitive | Social |
| Deep Researching/Fact Finding | Cognitive | — |
| Systems Analysis | Cognitive | Technical |
| Writing | Creative | — |
| Persuasion | Social | Cognitive |
| Teaching | Social | — |
| Leadership | Social | Emotional |
| Resilience | Emotional | — |
| AI | Technical | Cognitive |
| Technical/Solution Architecture | Technical | Cognitive |
| Craftsmanship (Carpentry, Welding) | Technical | — |
| Vehicle Mechanics | Technical | — |
| HAM Radio | Technical | — |
| Recce | Fieldcraft | Physical, Cognitive, Technical |
| Land Navigation | Fieldcraft | — |
| Bushcraft | Fieldcraft | — |
| Offroading | Fieldcraft | Technical, Practical |
| Driving | Practical | — |
| Nutrition | Practical | Physical |
| First Aid | Practical | — |
| Knot Tying | Practical | Fieldcraft |
| Finances (tax, investing, trusts) | Practical | — |
| Shintoism | Spiritual | — |
| Philosophy | Spiritual | Cognitive |

## Checklist
- [ ] Define the skill node schema (name, description, icon, domain path, tags, cross-links)
- [ ] Seed initial skills for 2-3 pilot domains
- [ ] Build cross-domain relationship support (skill X relates to skill Y)
- [ ] Create a workflow/tooling for adding new skills
- [ ] Validate placement with real-world examples