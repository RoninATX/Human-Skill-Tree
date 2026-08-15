# Mastery Framework

How a skill's progression ladder is defined. Levels are **demonstrated capabilities and
milestone outcomes, not time spent**. This doc is the contributor guide for defining or
customizing a skill's ladder; the field-level spec lives in `data-schema.md`.

## Model choices (from taxonomy-research.md)

- **Dreyfus** is the backbone: the default 6-tier scale (Novice → Master) is the Y-axis
  for every skill.
- **Bloom's cognitive** informs what "mastery" means for knowledge-heavy skills
  (Remember → Create).
- **Bloom's three domains** (cognitive / psychomotor / affective) explain why ladders
  differ by skill type: a psychomotor skill's levels read like belt requirements, a
  cognitive skill's like research milestones, an affective skill's like identity shifts.

## The schema: default ladder + optional per-skill `levels`

Every skill carries `proficiency.scale` (the 6 Dreyfus tier names) and `proficiency.level`
(0–6; 0 = not started). Skills MAY add `proficiency.levels`: an array of 6 entries, one
per tier, each `{ name, capability }`:

- `name` — the tier label for this skill. Defaults to the Dreyfus name; override it when
  the skill has a natural vocabulary (e.g. Jiu-Jitsu belts: white → black).
- `capability` — one or two sentences describing the **demonstrated outcome** that earns
  this tier: what the practitioner can *do*, produce, or withstand. Not hours, not
  courses completed.

If `levels` is absent, the UI falls back to the default Dreyfus descriptors (in
`data-schema.md`). Partial ladders are not allowed: either all 6 tiers are defined or
none, so no skill renders a half-custom ladder.

## Writing good capability statements

- **Observable, not aspirational.** "Holds a conversation on familiar topics" beats
  "gets good at speaking".
- **Testable in principle.** A third party could watch or inspect the outcome.
- **Monotonic.** Each tier strictly contains the previous one plus something new.
- **Subjective skills still get ladders.** Where mastery is subjective (e.g.
  Philosophy), define tiers by the *kind of work produced* (summary → original synthesis
  → work others cite), not by correctness.

## Worked examples

Three pilot skills carry full `levels` ladders in `graph_data.json`, one per Bloom domain:

- `bjj` (psychomotor) — belt-named tiers, capability = what you can do on the mat.
- `land-nav` (measurable) — capability = nav tasks completed under stated conditions.
- `deep-research` (cognitive) — capability = the kind of question you can answer and how.

## Known gaps (deliberate, for later lanes)

- Skill decay/atrophy without practice — no model yet.
- Context/specialization (expert in French cooking ≠ Japanese cooking) — handled by
  separate skill nodes for now, not contexts.
- Transfer learning across skills — cross-domain edges encode *that* skills transfer,
  not *how much*.
