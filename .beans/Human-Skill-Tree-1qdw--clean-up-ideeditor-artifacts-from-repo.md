---
# Human-Skill-Tree-1qdw
title: Clean up IDE/editor artifacts from repo
status: completed
type: task
priority: normal
created_at: 2026-08-13T05:33:45Z
updated_at: 2026-08-13T05:35:53Z
---

Remove IDE-era artifacts (venv, .vscode, .idea, pycache, harness-local config) now that agent-driven development is taking over. Keep the repo runnable.

## Summary of Changes

- Removed .venv/ entirely: 3003 tracked files (85MB incl. Pillow) purged via git rm -r, directory deleted. It was accidentally committed because .gitignore had venv/ but not .venv/. Recreatable via python -m venv .venv.
- .gitignore: added .venv/, removed the VS Code block (.vscode/launch.json was already deleted from the worktree)
- requirements.txt trimmed to networkx only (matplotlib unused; Pillow never imported by project code)
- Kept .claude/settings.local.json (harness-local Claude permissions, already covered by global git ignore)
- Updated .know/tooling.md, .know/architecture.md, AGENTS.md in the same change: system Python 3.12 is on PATH with networkx, venv-recreation command documented, IDE section replaced
- Verified: python -m http.server still serves the app
