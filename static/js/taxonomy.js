/**
 * taxonomy.js - user-editable categories under each domain.
 *
 * The shipped static/data/graph_data.json stays pristine; each logged-in user
 * carries an overlay on their account record (via Auth.updateUser):
 *
 *   taxonomy: {
 *     added:   [{ id, label, description, domain }],   // new categories
 *     renamed: { [categoryId]: newLabel },             // shipped or added
 *     removed: [categoryId]                            // shipped categories only
 *   }
 *
 * Taxonomy.apply(graphData) merges the overlay into fetched graph data before
 * the graph is built. Guardrails follow docs/research/hierarchy-rules.md:
 * categories group skills inside exactly one domain; a category that still
 * holds skills cannot be removed; labels must be non-empty and unique within
 * the domain (case-insensitive). Domains and skills are not editable here.
 *
 * Editing requires a logged-in account - the overlay lives on the user record.
 */
const Taxonomy = (() => {

    function emptyOverlay() {
        return { added: [], renamed: {}, removed: [] };
    }

    function getOverlay() {
        const user = Auth.currentUser();
        // Normalize: older or hand-edited records may carry a partial
        // taxonomy object ({} or missing keys); never return one as-is.
        return { ...emptyOverlay(), ...((user && user.taxonomy) || {}) };
    }

    function saveOverlay(overlay) {
        const user = Auth.currentUser();
        if (!user) throw new Error('Sign in to edit the taxonomy.');
        Auth.updateUser(user.email, { taxonomy: overlay });
    }

    function slugify(label) {
        return label.toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 40) || 'category';
    }

    function uniqueId(base, taken) {
        let id = base;
        let n = 2;
        while (taken.has(id)) id = `${base}-${n++}`;
        return id;
    }

    /** Merge the current user's overlay into fetched graph data. */
    function apply(graphData) {
        const overlay = getOverlay();
        const removed = new Set(overlay.removed);
        const renamed = overlay.renamed || {};

        const nodes = [];
        for (const n of graphData.nodes) {
            if (n.data.type === 'category' && removed.has(n.data.id)) continue;
            const data = { ...n.data };
            if (data.type === 'category' && renamed[data.id]) data.label = renamed[data.id];
            nodes.push({ data });
        }
        const edges = graphData.edges.filter(e =>
            !(e.data.type === 'hierarchy' && (removed.has(e.data.source) || removed.has(e.data.target)))
        ).map(e => ({ data: { ...e.data } }));

        for (const cat of overlay.added) {
            if (removed.has(cat.id)) continue;
            nodes.push({
                data: {
                    id: cat.id,
                    label: renamed[cat.id] || cat.label,
                    type: 'category',
                    domain: cat.domain,
                    description: cat.description || '',
                    image: 'static/images/skills/skill_default.png'
                }
            });
            edges.push({ data: { source: cat.domain, target: cat.id, type: 'hierarchy' } });
        }

        return { nodes, edges };
    }

    /** Labels of categories in a domain after the overlay is applied. */
    function categoryLabelsIn(graphData, domainId, excludeId = null) {
        return apply(graphData).nodes
            .filter(n => n.data.type === 'category' && n.data.domain === domainId && n.data.id !== excludeId)
            .map(n => n.data.label.toLowerCase());
    }

    function assertUniqueLabel(graphData, domainId, label, excludeId = null) {
        label = String(label || '').trim();
        if (!label) throw new Error('Category name cannot be empty.');
        if (label.length > 60) throw new Error('Category name must be 60 characters or fewer.');
        if (categoryLabelsIn(graphData, domainId, excludeId).includes(label.toLowerCase())) {
            throw new Error(`"${label}" already exists in that domain.`);
        }
        return label;
    }

    function addCategory(graphData, domainId, label, description = '') {
        label = assertUniqueLabel(graphData, domainId, label);
        const overlay = getOverlay();
        const taken = new Set(apply(graphData).nodes.map(n => n.data.id));
        const id = uniqueId(slugify(label), taken);
        overlay.added = [...overlay.added, { id, label, description: String(description || '').trim(), domain: domainId }];
        saveOverlay(overlay);
        return id;
    }

    function renameCategory(graphData, categoryId, newLabel) {
        const cat = apply(graphData).nodes.find(n => n.data.id === categoryId && n.data.type === 'category');
        if (!cat) throw new Error('Category not found.');
        // excludeId: renaming to the same words with different casing or
        // padding is a self-rename, not a duplicate.
        newLabel = assertUniqueLabel(graphData, cat.data.domain, newLabel, categoryId);
        const overlay = getOverlay();
        overlay.renamed = { ...overlay.renamed, [categoryId]: newLabel };
        saveOverlay(overlay);
    }

    /** Remove a category. Blocked while it still holds skills (hierarchy rules). */
    function removeCategory(graphData, categoryId) {
        const patched = apply(graphData);
        const cat = patched.nodes.find(n => n.data.id === categoryId && n.data.type === 'category');
        if (!cat) throw new Error('Category not found.');
        const skills = patched.nodes.filter(n => n.data.type === 'skill' && n.data.category === categoryId);
        if (skills.length > 0) {
            throw new Error(`"${cat.data.label}" still has ${skills.length} skill(s) - move or remove them first.`);
        }
        const overlay = getOverlay();
        if (overlay.added.some(c => c.id === categoryId)) {
            // A user-added category: drop it outright rather than tombstoning.
            overlay.added = overlay.added.filter(c => c.id !== categoryId);
            const renamed = { ...overlay.renamed };
            delete renamed[categoryId];
            overlay.renamed = renamed;
        } else {
            overlay.removed = [...overlay.removed, categoryId];
        }
        saveOverlay(overlay);
    }

    return { apply, addCategory, renameCategory, removeCategory, getOverlay };
})();
