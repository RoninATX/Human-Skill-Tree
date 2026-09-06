---
name: context
description: Retrieve the artifacts that actually cite a bean or knowledge doc - parent/children, blocking, and prose citations across .beans and .know/ - as one derived graph query. Use before planning work on a tracked item ("what's related to X", "what should I read before touching <bean>"). Supplements beans-first orientation; never replaces it.
disable-model-invocation: false
allowed-tools: bash read
---

# Context

The project keeps a **derived** artifact graph (vendored at `.graph/graphscout.py`,
rebuilt on demand — there is no cache to go stale). It answers "what should I
read before working on this?" from real citations, not filename guesses.

## Usage

```bash
python .graph/graphscout.py context <bean-id-or-doc>
```

Target accepts a full bean id (`Human-Skill-Tree-9ig8`), a bare slug (`9ig8`),
a doc stem (`taxonomy`), or a `kind/stem` path (`knowledge/taxonomy`).
Ambiguity is reported, never guessed.

## Reading the output

- **its parent / child of it / blocks / blocked by** — declared tracker edges.
- **it references / references it** — prose citations between beans (the layer
  the tracker has no schema for).
- **documents it / it cites** — doc↔bean edges. **Read what DOCUMENTS a bean
  first** — that file is usually the orientation you need.
- An isolated result ("no edges") is a valid outcome, not a bug.

## Also useful

```bash
python .graph/graphscout.py rot          # cited ids that resolve to nothing, file:line
```

Run `rot` after pruning the tracker — a knowledge file naming a dead bean is
silent without it.

## Discipline

This graph **does not replace beans-first orientation** — `beans list` /
`beans show` remain the source of truth; the graph re-ranks what to open.
When writing a bean or knowledge doc, cite related items by id in prose
(`paired with Human-Skill-Tree-9ig8`); those citations are what create edges.
Bare slugs (`9ig8`) resolve within this project, but prefer the full id so the
citation survives copying elsewhere.
