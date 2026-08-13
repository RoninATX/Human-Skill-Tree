---
# Human-Skill-Tree-z92f
title: Rewrite pi knowledge-prep skill for .know/ folder
status: completed
type: task
priority: normal
created_at: 2026-08-13T02:46:29Z
updated_at: 2026-08-13T02:47:53Z
---

Rewrite the imported pi skill at ~/.pi/agent/skills/knowledge-prep/SKILL.md to be pi-native: target a universal .know/ folder at project root instead of .claude/knowledge/, index from AGENTS.md instead of CLAUDE.md, use pi tool names, and handle migration from .claude/knowledge/ as a detected mode.

## Summary of Changes

Rewrote ~/.pi/agent/skills/knowledge-prep/SKILL.md as a pi-native skill:

- Target pattern changed from .claude/knowledge/ + CLAUDE.md to vendor-neutral .know/ at project root + AGENTS.md index
- Added a new Step M (migrate) mode for moving legacy .claude/knowledge/ folders to .know/, including pointer rewriting and a verification pass on moved content
- Tool references converted to pi's surface (read/write/edit/bash; rg/ls for survey); allowed-tools frontmatter uses pi tool names
- Invocation updated to /skill:knowledge-prep; memory-audit step generalized (Claude Code auto-memory kept as an example source, noted pi has no default equivalent)
- Doctrine (knowledge-vs-memory, descriptive-not-prescriptive, one-topic-per-file, update-in-same-change) preserved verbatim in substance
