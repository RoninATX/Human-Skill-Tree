#!/usr/bin/env python3
"""Validate static/data/graph_data.json against the project schema.

Encodes the invariants from docs/research/data-schema.md and
docs/research/hierarchy-rules.md so contributors get fast feedback when
adding skills, categories, or edges.

Usage:  python scripts/validate_graph.py [path-to-graph_data.json]
Exit:   0 = clean (warnings ok), 1 = errors found.
"""

import json
import os
import re
import sys

ID_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
HEX_RE = re.compile(r"^#[0-9a-fA-F]{6}$")
SCALE_LEN = 6
CROSS_DOMAIN_STRENGTHS = {"strong", "moderate", "light"}
EDGE_TYPES = {"hierarchy", "prerequisite", "cross-domain", "complements"}
DOMAIN_IDS = {
    "cognitive", "creative", "emotional", "fieldcraft", "physical",
    "practical", "social", "spiritual", "technical",
}

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def check_id(node):
    nid = node.get("id", "<missing>")
    if "id" not in node:
        err(f"node missing id: {node!r:.80}")
    elif not isinstance(nid, str) or not ID_RE.fullmatch(nid):
        err(f"id '{nid}' is not a lowercase hyphenated slug")


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(__file__), "..", "static", "data", "graph_data.json")
    # Repo root derived from the conventional static/data/ location; image
    # existence checks are skipped when the graph lives anywhere else.
    root = os.path.dirname(os.path.abspath(path))
    repo = os.path.abspath(os.path.join(root, "..", ".."))
    check_images = os.path.isdir(os.path.join(repo, "static", "images"))

    try:
        with open(path, encoding="utf-8") as f:
            graph = json.load(f)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        print(f"ERROR unable to read graph data '{path}': {exc}")
        return 1
    if not isinstance(graph, dict):
        err("graph root must be an object")
        graph = {}

    def data_entries(key):
        raw = graph.get(key, [])
        if not isinstance(raw, list):
            err(f"graph '{key}' must be an array")
            return []
        entries = []
        for i, entry in enumerate(raw):
            if not isinstance(entry, dict):
                err(f"graph '{key}' entry {i} must be an object")
                continue
            data = entry.get("data", {})
            if not isinstance(data, dict):
                err(f"graph '{key}' entry {i}.data must be an object")
                continue
            entries.append(data)
        return entries

    nodes = data_entries("nodes")
    edges = data_entries("edges")
    by_id = {}
    for n in nodes:
        check_id(n)
        nid = n.get("id")
        if isinstance(nid, str) and ID_RE.fullmatch(nid):
            if nid in by_id:
                err(f"duplicate node id '{nid}'")
                continue
            by_id[nid] = n

    domains = [n for n in nodes if n.get("type") == "domain"]
    cats = [n for n in nodes if n.get("type") == "category"]
    skills = [n for n in nodes if n.get("type") == "skill"]
    for n in nodes:
        if n.get("type") not in ("domain", "category", "skill"):
            err(f"node '{n.get('id')}' has unknown type '{n.get('type')}'")
        for field in ("label", "description"):
            if not n.get(field):
                err(f"node '{n.get('id')}' missing required field '{field}'")

    # --- Domains -------------------------------------------------------
    domain_ids = {d.get("id") for d in domains}
    if domain_ids != DOMAIN_IDS:
        err(f"expected fixed domain ids {sorted(DOMAIN_IDS)}, found {sorted(domain_ids, key=str)}")
    for d in domains:
        color = d.get("color", "")
        if not HEX_RE.match(color):
            err(f"domain '{d.get('id')}' missing/invalid hex color '{color}'")

    # --- Categories ----------------------------------------------------
    cat_by_id = {}
    for c in cats:
        cid = c.get("id")
        if isinstance(cid, str) and ID_RE.fullmatch(cid) and cid not in cat_by_id:
            cat_by_id[cid] = c
        parent = c.get("domain")
        if not parent:
            err(f"category '{c.get('id')}' missing required field 'domain'")
        elif parent not in by_id or by_id[parent].get("type") != "domain":
            err(f"category '{c.get('id')}' points at unknown domain '{parent}'")

    # --- Skills --------------------------------------------------------
    skills_in_cat = {cid: [] for cid in cat_by_id}
    for s in skills:
        sid = s.get("id")
        dom, cat = s.get("domain"), s.get("category")
        if not dom or by_id.get(dom, {}).get("type") != "domain":
            err(f"skill '{sid}' points at unknown domain '{dom}'")
        if not cat or cat not in cat_by_id:
            err(f"skill '{sid}' points at unknown category '{cat}'")
        else:
            skills_in_cat.setdefault(cat, []).append(sid)
            if cat_by_id[cat].get("domain") != dom:
                err(f"skill '{sid}' domain '{dom}' disagrees with its "
                    f"category '{cat}' (domain '{cat_by_id[cat].get('domain')}')")

        prof = s.get("proficiency")
        if not isinstance(prof, dict):
            err(f"skill '{sid}' missing required 'proficiency' object")
        else:
            level = prof.get("level")
            if type(level) is not int or not 0 <= level <= SCALE_LEN:
                err(f"skill '{sid}' proficiency.level must be an int 0-{SCALE_LEN}")
            scale = prof.get("scale")
            if not (isinstance(scale, list) and len(scale) == SCALE_LEN
                    and all(isinstance(x, str) and x for x in scale)):
                err(f"skill '{sid}' proficiency.scale must be {SCALE_LEN} non-empty strings")
            levels = prof.get("levels")
            if levels is not None:
                if not (isinstance(levels, list) and len(levels) == SCALE_LEN):
                    err(f"skill '{sid}' proficiency.levels must define all "
                        f"{SCALE_LEN} tiers or be omitted")
                else:
                    for i, lv in enumerate(levels):
                        if not (isinstance(lv, dict) and lv.get("name")
                                and lv.get("capability")):
                            err(f"skill '{sid}' proficiency.levels[{i}] needs "
                                "non-empty 'name' and 'capability'")

        img = s.get("image")
        if img is not None and not isinstance(img, str):
            err(f"skill '{sid}' image must be a string when provided")
        elif img and check_images and not os.path.exists(os.path.join(repo, img)):
            warn(f"skill '{sid}' image not found on disk: {img}")

    # --- Hierarchy occupancy -------------------------------------------
    for c in cats:
        if not skills_in_cat.get(c.get("id")):
            err(f"category '{c.get('id')}' holds no skills")
    for d in domains:
        dcats = [c for c in cats if c.get("domain") == d.get("id")]
        if not any(skills_in_cat.get(c.get("id")) for c in dcats):
            err(f"domain '{d.get('id')}' has no category with skills")

    # --- Edges ---------------------------------------------------------
    seen_edges = set()
    for e in edges:
        etype = e.get("type")
        src, tgt = e.get("source"), e.get("target")
        if etype not in EDGE_TYPES:
            err(f"edge {src}->{tgt} has unknown type '{etype}'")
            continue
        for end in (src, tgt):
            if end not in by_id:
                err(f"{etype} edge endpoint '{end}' does not exist")
        if src not in by_id or tgt not in by_id:
            continue
        key = (src, tgt, etype)
        if key in seen_edges:
            err(f"duplicate {etype} edge {src}->{tgt}")
        seen_edges.add(key)

        stype, ttype = by_id[src].get("type"), by_id[tgt].get("type")
        if etype == "hierarchy":
            if stype == "domain" and ttype == "category":
                if by_id[tgt].get("domain") != src:
                    err(f"hierarchy edge {src}->{tgt} but category's domain is "
                        f"'{by_id[tgt].get('domain')}'")
            elif stype == "category" and ttype == "skill":
                if by_id[tgt].get("category") != src:
                    err(f"hierarchy edge {src}->{tgt} but skill's category is "
                        f"'{by_id[tgt].get('category')}'")
            else:
                err(f"hierarchy edge must be domain->category or category->skill, "
                    f"got {src}({stype})->{tgt}({ttype})")
        else:
            if stype != "skill" or ttype != "skill":
                err(f"{etype} edge must connect skills, got "
                    f"{src}({stype})->{tgt}({ttype})")
            if etype == "cross-domain":
                if e.get("strength") not in CROSS_DOMAIN_STRENGTHS:
                    err(f"cross-domain edge {src}->{tgt} strength must be one of "
                        f"{sorted(CROSS_DOMAIN_STRENGTHS)}")
                if by_id[src].get("domain") == by_id[tgt].get("domain"):
                    err(f"cross-domain edge {src}->{tgt} stays inside domain "
                        f"'{by_id[src].get('domain')}' (use 'complements' instead)")

    # Every skill needs its hierarchy edge, or it never renders in the tree.
    hier_pairs = {(e.get("source"), e.get("target")) for e in edges
                  if e.get("type") == "hierarchy"
                  and e.get("source") is not None
                  and e.get("target") is not None}
    for s in skills:
        if (s.get("category"), s.get("id")) not in hier_pairs:
            err(f"skill '{s.get('id')}' has no hierarchy edge from "
                f"'{s.get('category')}'")
    for c in cats:
        if (c.get("domain"), c.get("id")) not in hier_pairs:
            err(f"category '{c.get('id')}' has no hierarchy edge from "
                f"'{c.get('domain')}'")

    # --- Report --------------------------------------------------------
    for w in warnings:
        print(f"WARN  {w}")
    for e_ in errors:
        print(f"ERROR {e_}")
    print(f"\n{len(domains)} domains, {len(cats)} categories, "
          f"{len(skills)} skills, {len(edges)} edges: "
          f"{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
