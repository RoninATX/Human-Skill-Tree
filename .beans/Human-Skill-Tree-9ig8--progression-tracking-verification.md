---
# Human-Skill-Tree-9ig8
title: Progression Tracking & Verification
status: draft
type: milestone
priority: normal
created_at: 2026-02-26T23:27:58Z
updated_at: 2026-02-26T23:29:23Z
blocking:
    - 7rwp
---

Enable users to actively track their journey through a skill's mastery levels. Support verification mechanisms, curriculum attachment, and progression logging.

## Key Questions
- How does a user claim/update their level in a skill?
- What verification methods do we support? (self-assessment, evidence upload, external certs, peer review?)
- Can curricula or learning paths be attached to skills?
- What does the progression log look like? (timestamps, evidence, notes?)
- How do we handle data persistence? (local storage, file-based, backend?)

## Checklist
- [ ] Design the user progress data model (skill -> level, evidence, timestamps)
- [ ] Implement self-assessment progression (user marks their own level)
- [ ] Build progression log UI (history of level changes per skill)
- [ ] Add support for attaching evidence/artifacts to level claims
- [ ] Design curriculum/learning path attachment system
- [ ] Implement data persistence layer