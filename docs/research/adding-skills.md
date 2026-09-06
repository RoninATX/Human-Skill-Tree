# Adding Skills: Contributor Workflow

How a new skill (or category) gets into the tree. The authoritative field spec
is `data-schema.md`; nesting decisions follow `hierarchy-rules.md`. Validate
before committing:

```
python scripts/validate_graph.py
```

The validator checks the schema and graph invariants described below and exits non-zero on errors. Placement judgment and some naming conventions remain contributor responsibilities.

## 1. Place it: exactly one primary home

Every skill lives in **exactly one category in one domain** — never duplicated
across domains. When a skill genuinely spans domains (Recce draws on
Fieldcraft, Physical, Cognitive, and Technical), place it where its *core
identity* lives and express the rest with edges (step 4).

Placement questions, in order:

1. **What is the skill's core practice?** That's the domain. Jiu-Jitsu is
   Physical even though it rewards strategy; Systems Analysis is Cognitive
   even though it's applied to technical problems.
2. **Which existing category holds its nearest neighbors?** Skills group with
   what practitioners would recognize as siblings (Pistol next to Long Range
   Precision under Marksmanship).
3. **No fitting category?** Propose a new one — but a category earns its place
   by holding 3–5 concrete skills (pressure-test with real examples first,
   per `taxonomy.md`). A category that can only ever hold one skill is a
   skill wearing a category costume.
4. **When in doubt, split.** Distinct practice methods, equipment, or
   progression paths mean separate sibling skills, not one fat node.

Domains are fixed at 9 — do not add or rename them in shipped data.

## 2. Add the node

Append to `nodes` in `static/data/graph_data.json`:

```json
{
  "data": {
    "id": "celestial-nav",
    "label": "Celestial Navigation",
    "type": "skill",
    "domain": "fieldcraft",
    "category": "navigation",
    "description": "Position finding by sun, stars, and sextant",
    "proficiency": {
      "level": 0,
      "scale": ["novice", "beginner", "competent", "proficient", "expert", "master"]
    },
    "tags": ["outdoors", "navigation"]
  }
}
```

Rules checked by the validator:

- **ID syntax and uniqueness**: lowercase hyphenated slug, unique across the
  *entire* graph. The no-hierarchy naming convention is reviewed by the
  contributor rather than checked by the script.
- **Required fields**: `label`, `type`, `description`, `domain`, `category`,
  `proficiency`. `image` and `tags` are optional (icons fall back to the
  category icon, then the domain icon, then the default).
- **`domain`/`category` consistency**: the category must belong to the domain.
- **`proficiency`**: `level` is 0–6 (shipped skills are 0 — user claims live
  on account records, not in the graph); `scale` is the 6 Dreyfus tiers.

## 3. Add the hierarchy edge

A skill without its hierarchy edge never renders:

```json
{ "data": { "source": "navigation", "target": "celestial-nav", "type": "hierarchy" } }
```

Adding a category instead? Same pattern: category node (with `domain` set)
plus a `domain → category` hierarchy edge, and remember it must hold at least
one skill when shipped.

## 4. Wire relationships (optional but encouraged)

| Ask | Edge type | Extra field |
|-----|-----------|-------------|
| Must you learn A before B? | `prerequisite` (A → B) | — |
| Does mastery transfer *across domains*? | `cross-domain` | `strength`: strong / moderate / light |
| Do they enhance each other, same domain, no ordering? | `complements` | — |

A cross-domain edge whose endpoints share a domain is a modeling error — use
`complements` instead (the validator flags this).

## 5. Optional: write the mastery ladder

Add `proficiency.levels` — 6 entries of `{name, capability}` — when the
skill has a natural vocabulary (belt ranks) or its tiers need skill-specific
capability statements. All 6 tiers or none. See `mastery-framework.md` for
capability-writing rules (observable outcomes, never time-based).

## 6. Validate and eyeball

```
python scripts/validate_graph.py   # must exit 0
scripts/serve.sh start             # http://localhost:8000
```

Check in the browser: the skill appears under its category, clicking it shows
the sidebar (mastery ladder, pips), and any new edges render with the right
line style.

## Note: shipped data vs. user overlays

Only **categories** are user-editable at runtime (per-account overlays; see
`taxonomy.js`). Skills and domains are shipped-only — every skill addition is
a commit to `graph_data.json` through this workflow.
