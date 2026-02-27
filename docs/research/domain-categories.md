# Top-Level Domain Categories

## The 9 Domains

| # | Domain | Description | Example Skills |
|---|--------|-------------|---------------|
| 1 | **Physical** | Athletics, martial arts, fitness, dance, body mastery | Jiu-Jitsu, Shooting, running, yoga |
| 2 | **Cognitive** | Reasoning, analysis, psychology, research, strategy | Behavioral Psychology, Deep Research, Systems Analysis |
| 3 | **Creative** | Visual arts, music, writing, design, performance | Writing, painting, music, design |
| 4 | **Social** | Communication, leadership, teaching, persuasion | Leadership, Teaching, Persuasion |
| 5 | **Emotional** | Self-awareness, regulation, resilience, mindfulness | Resilience, emotional intelligence, meditation |
| 6 | **Technical** | Engineering, programming, craftsmanship, tool use, radio, mechanics | AI, Solution Architecture, Carpentry, Welding, Vehicle Mechanics, HAM Radio |
| 7 | **Fieldcraft** | Outdoor skills, navigation, bushcraft, survival, ecology, agriculture | Recce, Land Navigation, Bushcraft, Offroading |
| 8 | **Practical** | Life management, finance, cooking, health, driving, first aid | Finances, First Aid, Driving, Nutrition, Knot Tying |
| 9 | **Spiritual** | Contemplative practice, ethics, philosophy, meaning-making, faith traditions | Shintoism, Philosophy |

## Validation: Skill Placement Test

The following real skills were placed against the domains to validate the structure:

| Skill | Primary Domain | Cross-Domain Links |
|-------|---------------|-------------------|
| Jiu-Jitsu | Physical | — |
| Shooting (pistol/long range) | Physical | Technical (ballistics, optics) |
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

## Design Decisions

- **Cross-domain links**: Skills live in one primary domain but can have explicit cross-domain links representing genuine skill transfer. This keeps the tree navigable while acknowledging that real skills span boundaries.
- **"Fieldcraft" over "Environmental"**: Renamed to better capture the tactical/outdoor/survival flavor of skills in this domain. "Environmental" sounded too academic and ecological.
- **9 domains is the right size**: Enough granularity to avoid catch-all buckets, few enough to scan at a glance. Each domain held 2-6 test skills without strain.
- **Compound skills go in their primary domain**: Skills like Recce that draw heavily from 3-4 domains are placed where their core identity lives, with cross-links handling the rest.
