# Data Schema: Nodes & Edges

## Node Types

### Domain Node
```json
{
  "data": {
    "id": "fieldcraft",
    "label": "Fieldcraft",
    "type": "domain",
    "description": "Outdoor skills, navigation, bushcraft, survival, ecology",
    "image": "static/images/domains/fieldcraft.png",
    "color": "#4A7C59"
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| id | yes | Short unique identifier |
| label | yes | Display name |
| type | yes | Always `"domain"` |
| description | yes | Brief description of what the domain covers |
| image | no | Path to domain icon |
| color | yes | Hex color for visual theming — categories and skills inherit this |

### Category Node
```json
{
  "data": {
    "id": "navigation",
    "label": "Navigation",
    "type": "category",
    "domain": "fieldcraft",
    "description": "Skills for finding your way",
    "image": "static/images/categories/navigation.png"
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| id | yes | Short unique identifier |
| label | yes | Display name |
| type | yes | Always `"category"` |
| domain | yes | ID of parent domain |
| description | yes | Brief description |
| image | no | Path to category icon |

### Skill Node
```json
{
  "data": {
    "id": "land-nav",
    "label": "Land Navigation",
    "type": "skill",
    "domain": "fieldcraft",
    "category": "navigation",
    "description": "Map reading, compass use, terrain association",
    "image": "static/images/skills/land-nav.png",
    "proficiency": {
      "level": 0,
      "scale": ["novice", "beginner", "competent", "proficient", "expert", "master"]
    },
    "tags": ["tactical", "outdoors"]
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| id | yes | Short unique identifier |
| label | yes | Display name |
| type | yes | Always `"skill"` |
| domain | yes | ID of parent domain |
| category | yes | ID of parent category |
| description | yes | What this skill involves |
| image | no | Path to skill icon (falls back to domain/category icon, then default) |
| proficiency | yes | Level (0-5) and the 6-tier Dreyfus-based scale |
| tags | no | Freeform tags for filtering and discovery |

### Proficiency Scale
| Level | Name | Meaning |
|-------|------|---------|
| 0 | (none) | Not started |
| 1 | Novice | Follows rules/instructions, no contextual judgment |
| 2 | Beginner | Recognizes patterns, applies maxims from limited experience |
| 3 | Competent | Plans deliberately, independent execution |
| 4 | Proficient | Intuitive understanding, holistic grasp, can teach others |
| 5 | Expert | Transcends rules, innovates, others seek their expertise |
| 6 | Master | Transforms the domain, creates new knowledge |

Note: Scale is defined on each skill node to allow per-skill customization in Lane 2 (Mastery Frameworks). The default 6-tier Dreyfus scale is the starting point.

### Per-skill level definitions (`proficiency.levels`)

Optional. An array of 6 entries, one per scale tier, each `{ "name": string, "capability": string }`. `name` overrides the Dreyfus tier label when the skill has a natural vocabulary (e.g. belt ranks); `capability` is the demonstrated outcome that earns the tier — observable and testable, never time-based. All 6 tiers must be defined or none. When absent, the UI falls back to the default Dreyfus descriptors above. Contributor guidance and worked examples: `docs/research/mastery-framework.md`.

## Edge Types

### Hierarchy
Connects domain → category and category → skill. Defines the tree structure.
```json
{
  "data": {
    "source": "fieldcraft",
    "target": "navigation",
    "type": "hierarchy"
  }
}
```

### Prerequisite
Skill A should be learned before skill B. Directional.
```json
{
  "data": {
    "source": "land-nav",
    "target": "recce",
    "type": "prerequisite"
  }
}
```

### Cross-Domain
Links skills across different domains representing genuine skill transfer.
```json
{
  "data": {
    "source": "knot-tying",
    "target": "first-aid",
    "type": "cross-domain",
    "strength": "moderate"
  }
}
```

| Strength | Meaning |
|----------|---------|
| strong | Core skill transfer — mastery in one directly accelerates the other |
| moderate | Meaningful overlap — shared concepts or techniques |
| light | Tangential connection — awareness helps but skills are largely independent |

### Complements
Skills that enhance each other without being prerequisites. Bidirectional in meaning.
```json
{
  "data": {
    "source": "behavioral-psych",
    "target": "persuasion",
    "type": "complements"
  }
}
```

## Edge Summary

| Type | Direction | Connects | Visual Style (proposed) |
|------|-----------|----------|------------------------|
| hierarchy | parent → child | domain↔category, category↔skill | Solid line, muted |
| prerequisite | source → target | skill → skill | Solid arrow, prominent |
| cross-domain | skill ↔ skill | across domains | Dashed line, domain colors |
| complements | skill ↔ skill | any | Dotted line, subtle |

## ID Convention
- Short, human-readable slugs: `land-nav`, `bjj`, `ham-radio`, `fieldcraft`
- Lowercase, hyphen-separated
- Unique across the entire graph (not just within a domain)
- Hierarchy is expressed via `domain` and `category` fields, not encoded in the ID
