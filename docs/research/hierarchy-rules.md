# Hierarchy Depth & Nesting Rules

## Structure: 3 Levels

```
Domain → Category → Skill
```

| Level | What It Is | Example |
|-------|-----------|---------|
| **Domain** | Top-level branch (1 of 9) | Fieldcraft |
| **Category** | Grouping of related skills within a domain | Navigation, Bushcraft, Reconnaissance |
| **Skill** | A learnable, practicable capability | Land Navigation, Knot Tying, Recce |

No 4th level. Sub-skill granularity (e.g., Jiu-Jitsu → Guard Play, Takedowns) is handled by the mastery framework (Lane 2), not by deeper nesting.

## Nesting Rules

1. **Every skill belongs to exactly one category in one domain.** Cross-domain relevance is expressed through cross-domain links, not duplicate placement.

2. **Categories group related skills, not skill types.** "Marksmanship" is a category containing Pistol and Long Range Precision as sibling skills — not "Shooting" as a single skill with sub-types.

3. **When in doubt, split into siblings under a category.** If a skill has meaningfully distinct practice methods, equipment, or progression paths, it's a separate skill node, not a sub-type.

4. **Cross-domain links handle multi-domain relevance.** Knot Tying lives under Fieldcraft > Bushcraft, with a cross-link to Practical. It does not appear in both domains.

5. **Categories can vary in size.** Some categories may have 2 skills, others 10+. Balance is nice but not a constraint — the tree reflects reality, not symmetry.

6. **Domains cannot be empty.** Every domain must have at least one category with at least one skill.

## Validated Examples

### Fieldcraft
```
Fieldcraft
├── Navigation
│   ├── Land Navigation
│   └── Celestial Navigation
├── Bushcraft
│   ├── Shelter Building
│   ├── Fire Starting
│   └── Knot Tying
├── Reconnaissance
│   └── Recce
└── Overland
    └── Offroading
```

### Technical
```
Technical
├── Software & Computing
│   ├── AI
│   └── Solution Architecture
├── Trades & Craftsmanship
│   ├── Carpentry
│   ├── Welding
│   └── Vehicle Mechanics
└── Communications
    └── HAM Radio
```

### Physical
```
Physical
├── Martial Arts
│   └── Jiu-Jitsu
└── Marksmanship
    ├── Pistol
    └── Long Range Precision
```

### Social
```
Social
├── Interpersonal
│   ├── Persuasion
│   └── Leadership
├── Education
│   └── Teaching
└── (further categories TBD)
```

### Cognitive
```
Cognitive
├── Analysis
│   ├── Systems Analysis
│   └── Behavioral Psychology
├── Research
│   └── Deep Researching / Fact Finding
└── (further categories TBD)
```

### Practical
```
Practical
├── Health
│   ├── First Aid
│   └── Nutrition
├── Finance
│   └── Finances (tax, investing, trusts)
├── Transportation
│   └── Driving
└── (further categories TBD)
```

### Creative
```
Creative
├── Writing
│   └── Writing
└── (further categories TBD)
```

### Emotional
```
Emotional
├── Inner Strength
│   └── Resilience
└── (further categories TBD)
```

### Spiritual
```
Spiritual
├── Faith & Tradition
│   └── Shintoism
├── Inquiry
│   └── Philosophy
└── (further categories TBD)
```
