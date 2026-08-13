---
# Human-Skill-Tree-kdue
title: Ignore .know/ and align CLAUDE.md with AGENTS.md
status: completed
type: task
priority: normal
created_at: 2026-08-13T05:07:02Z
updated_at: 2026-08-13T05:07:19Z
---

Add .know/ to .gitignore (local-by-design knowledge), slim the harness-level Claude CLAUDE.md to point at the repo AGENTS.md instead of duplicating content.

## Summary of Changes

- Added .know/ to .gitignore (verified via git check-ignore)
- Rewrote harness-level ~/.claude/projects/...-Human-Skill-Tree/CLAUDE.md as a thin pointer to repo AGENTS.md + .know/, keeping only the Claude-specific beans prime startup note
- Single source of truth is now AGENTS.md; no duplicated content between harness configs
