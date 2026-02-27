# Skill Taxonomy Research Summary

## Frameworks Surveyed

### 1. O*NET (US Dept of Labor)
- **Structure**: 6 top-level domains (Worker Characteristics, Worker Requirements, Experience, Occupational Requirements, Occupation-Specific, Workforce)
- **Depth**: 4-6 levels depending on branch
- **Scale**: ~277 core descriptors + 19,000+ task statements
- **Key distinction**: Separates **abilities** (52 innate/stable traits like spatial orientation, manual dexterity) from **skills** (35 learnable capacities like critical thinking, programming) from **knowledge** (33 domain areas like psychology, engineering)
- **Cross-domain**: No explicit linking — each descriptor lives in one place, but occupations are rated against all descriptors
- **Weakness for us**: Purely work-focused, only 35 skills (too coarse), no progression model

### 2. ESCO (European Skills/Competences)
- **Structure**: Skills (8 groups), Knowledge (11 fields via ISCED-F), Transversal Skills (6 categories), Language
- **Depth**: 3-4 levels
- **Scale**: 13,939 skill/competence concepts
- **Transversal categories**: Core, Thinking, Self-management, Social/Communication, Physical/Manual, Life skills
- **Cross-domain**: "Reusability level" system — transversal > cross-sectoral > sector-specific > occupation-specific
- **Weakness for us**: Still labor-market focused, mono-hierarchy (each skill in one group only), no progression model

### 3. Dreyfus Model of Skill Acquisition
- **5+1 stages**: Novice → Advanced Beginner → Competent → Proficient → Expert → Master
- **Core insight**: Progression is from rigid rule-following to deep intuition
- **Key transitions**: Competent→Proficient is the hardest (requires abandoning analytical safety); Master involves deliberate self-disruption to expand the domain
- **Weakness**: No branching/dependencies, assumes all skills follow same progression pattern

### 4. Bloom's Taxonomy
- **Cognitive domain** (revised): Remember → Understand → Apply → Analyze → Evaluate → Create
- **Knowledge dimension**: Factual, Conceptual, Procedural, Metacognitive
- **Three domains**: Cognitive, Affective (values/motivation), Psychomotor (physical)
- **Psychomotor** (Dave): Imitation → Manipulation → Precision → Articulation → Naturalization
- **Affective** (Krathwohl): Receiving → Responding → Valuing → Organizing → Characterizing
- **Key insight**: "Create" is the pinnacle of cognitive mastery; the Affective domain models how a skill becomes part of your identity

### 5. Gardner's Multiple Intelligences
- **8-9 types**: Linguistic, Logical-Mathematical, Spatial, Musical, Bodily-Kinesthetic, Interpersonal, Intrapersonal, Naturalistic, (Existential)
- **Value for us**: Legitimizes physical, social, creative skills as equal to cognitive; provides intuitive top-level branches
- **Weakness**: Scientifically disputed, no progression model, missing practical/technical and creative/aesthetic as distinct categories

### 6. WEF Global Skills Taxonomy
- **Structure**: 3 Level 1 aptitudes (Abilities & Skills, Attitudes & Values, Knowledge & Information) → skill groups → skills → sub-skills
- **Depth**: 4 levels
- **Key insight**: ~40% of core skills shift every 5 years — the tree must be designed for evolution

### 7. Game Skill Trees
| Game | Pattern | Key Lesson |
|------|---------|------------|
| **Path of Exile** | 1,300+ node web/constellation, shared tree with different starting positions | Cluster-based organization; cross-domain travel has a cost |
| **WoW Dragonflight** | Dual trees (Class + Specialization), top-to-bottom with arrows | General vs. specialized separation; explicit prerequisite arrows |
| **Civilization** | DAG with era gates, left-to-right, convergent prerequisites | Era gating; skills can require inputs from multiple branches |
| **Skyrim** | 18 constellation trees, use-based leveling | Small self-contained trees per domain; you improve by doing |
| **FFX Sphere Grid** | Shared grid, spatial navigation, different starting points | Progression feels like exploration |

### 8. Real-World Skill Tree Projects
- **NSA SkillTree** — Most mature (Projects > Subjects > Skills, learning paths, cross-project prerequisites, badges, self-reporting with approvals)
- **Maker Skill Trees** — 73 hexagonal tiles per tree, 60+ skill areas, basic→advanced bottom-to-top, printable
- **Project Skill Tree** — Gamified with XP/levels/badges, multi-platform

### 9. Other Systems
- **Scouting Merit Badges**: 135+ badges, no inter-badge prerequisites, "required core + electives" for Eagle rank
- **Martial Arts Belts**: Strictly linear, time-in-grade requirements, holistic assessment (technique + sparring + attitude)
- **AWS Certifications**: 4 tiers (Foundational→Associate→Professional→Specialty), soft prerequisites, role-based branching

---

## Key Takeaways

### What each model contributes to our design

| Model | Contribution | Role in Our Ontology |
|-------|-------------|---------------------|
| **Gardner + ESCO Transversal** | Domain categories | Top-level tree branches |
| **O*NET** | Ability vs. skill vs. knowledge distinction | Node type classification |
| **Dreyfus** | Universal proficiency scale | The Y-axis — how advanced you are |
| **Bloom's Cognitive** | What mastery means (Remember → Create) | Defines mastery for knowledge-based skills |
| **Bloom's Three Domains** | Cognitive, Affective, Psychomotor | Skill type tagging |
| **Bloom's Affective** | Motivation/identity progression | Models how a skill becomes part of who you are |
| **ESCO Reusability** | Transferability tiers | Cross-domain relationship metadata |
| **Game trees** | UX patterns, prerequisite modeling, cluster navigation | Visual design and interaction model |

### Recommended top-level domains (synthesized)
Converging across Gardner, ESCO transversal categories, WEF, and O*NET abilities:
1. **Physical** — Athletics, martial arts, dance, physical fitness, manual dexterity
2. **Cognitive** — Reasoning, analysis, mathematics, science, strategy
3. **Creative** — Visual arts, music, writing, design, innovation
4. **Social** — Communication, leadership, collaboration, teaching, conflict resolution
5. **Emotional/Self** — Self-awareness, regulation, resilience, mindfulness, identity
6. **Technical/Practical** — Engineering, craftsmanship, technology, tool use, trades
7. **Environmental/Natural** — Ecology, agriculture, outdoor skills, animal husbandry, survival
8. *(Optional)* **Existential/Philosophical** — Ethics, meaning-making, spirituality, systems thinking

### Recommended hierarchy depth
- **3-4 levels**: Domain → Category → Skill → (optional Sub-skill)
- Branching factor of **2-3** per node at category level
- Use **era/tier gating** for genuine prerequisites

### Recommended proficiency scale (Dreyfus-based)
1. **Novice** — Follows rules/instructions, no contextual judgment
2. **Beginner** — Recognizes patterns, applies maxims from limited experience
3. **Competent** — Plans deliberately, independent execution, invested in outcomes
4. **Proficient** — Intuitive understanding, holistic situational grasp, teaches others
5. **Expert** — Transcends rules, innovates, others seek their expertise
6. **Master** — Transforms the domain, creates new knowledge, mentors experts

### Gaps none of the models address (we must solve)
- **Prerequisite/dependency graphs** between skills
- **Transfer learning** — how mastery in one skill accelerates another
- **Skill decay/atrophy** without practice
- **Context/specialization** — Expert in French cooking ≠ Expert in Japanese cooking
- **Extensibility** — the tree must grow over time (~40% of skills shift per WEF)

### UX design principles (from game trees)
- **Cluster + zoom** for navigating large trees (PoE model)
- **Visual distinction** between node types (Notable/Keystone pattern)
- **Explicit prerequisite arrows** for dependencies (WoW pattern)
- **Locked/unlocked states** with glow effects for available nodes
- **Use-based progression** where possible (Skyrim model)
- **Dual tree option**: general/foundational vs. specialized (WoW/Civ pattern)
