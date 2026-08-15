document.addEventListener('DOMContentLoaded', async function() {
    // Hoisted so handlers wired before the await (theme toggle) can check
    // whether Cytoscape has finished initializing - a const in TDZ would
    // throw a ReferenceError on an early theme click.
    let cy = null;

    // Sidebar toggle functionality
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');

    sidebarCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        // Re-evaluate function-valued styles (hierarchy edge color) once the
        // graph exists; before init there is nothing to restyle.
        if (cy) cy.style().update();
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Fetch the graph data. The shipped JSON stays pristine; a logged-in
    // user's category edits live in an overlay (taxonomy.js) applied on top.
    const response = await fetch('static/data/graph_data.json');
    const baseGraphData = await response.json();
    const graphData = Taxonomy.apply(baseGraphData);

    // Build lookups
    const domainColors = {};
    const domainLabels = {};
    const categoryLabels = {};
    function rebuildLookups(data) {
        Object.keys(categoryLabels).forEach(k => delete categoryLabels[k]);
        data.nodes.forEach(n => {
            if (n.data.type === 'domain') {
                domainColors[n.data.id] = n.data.color;
                domainLabels[n.data.id] = n.data.label;
            }
            if (n.data.type === 'category') {
                categoryLabels[n.data.id] = n.data.label;
            }
        });
    }
    rebuildLookups(graphData);

    function getDomainColor(ele) {
        const data = ele.data();
        if (data.type === 'domain') return data.color;
        return domainColors[data.domain] || '#888';
    }

    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: graphData,

        style: [
            // --- DOMAIN NODES ---
            {
                selector: 'node[type="domain"]',
                style: {
                    'shape': 'round-rectangle',
                    'width': 160,
                    'height': 70,
                    'background-color': 'data(color)',
                    'background-opacity': 0.9,
                    'border-width': 3,
                    'border-color': 'data(color)',
                    'label': 'data(label)',
                    'text-wrap': 'wrap',
                    'text-max-width': '140px',
                    'font-size': '16px',
                    'font-weight': 'bold',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#ffffff',
                    'text-outline-width': 0,
                    'text-background-color': 'transparent',
                    'text-background-opacity': 0,
                    'transition-property': 'width, height, border-width, border-color, opacity',
                    'transition-duration': '0.3s'
                }
            },
            // --- CATEGORY NODES ---
            {
                selector: 'node[type="category"]',
                style: {
                    'shape': 'round-rectangle',
                    'width': 130,
                    'height': 50,
                    'background-color': function(ele) { return getDomainColor(ele); },
                    'background-opacity': 0.5,
                    'border-width': 2,
                    'border-color': function(ele) { return getDomainColor(ele); },
                    'border-opacity': 0.8,
                    'label': 'data(label)',
                    'text-wrap': 'wrap',
                    'text-max-width': '110px',
                    'font-size': '13px',
                    'font-weight': 'bold',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#ffffff',
                    'text-outline-width': 1,
                    'text-outline-color': 'rgba(0,0,0,0.5)',
                    'text-background-color': 'transparent',
                    'text-background-opacity': 0,
                    'transition-property': 'width, height, border-width, border-color, opacity',
                    'transition-duration': '0.3s'
                }
            },
            // --- SKILL NODES ---
            {
                selector: 'node[type="skill"]',
                style: {
                    'shape': 'rectangle',
                    'width': 100,
                    'height': 100,
                    'background-color': '#1a1a2e',
                    'background-image': 'data(image)',
                    'background-fit': 'cover',
                    'background-width': '75%',
                    'background-height': '75%',
                    'background-position-x': '50%',
                    'background-position-y': '40%',
                    'background-opacity': 0.3,
                    'border-width': 2,
                    'border-color': function(ele) { return getDomainColor(ele); },
                    'label': 'data(label)',
                    'text-wrap': 'wrap',
                    'text-max-width': '85px',
                    'font-size': '11px',
                    'font-weight': 'bold',
                    'text-valign': 'bottom',
                    'text-halign': 'center',
                    'text-margin-y': -8,
                    'color': '#ffffff',
                    'text-background-color': 'rgba(0,0,0,0.6)',
                    'text-background-opacity': 1,
                    'text-background-padding': '3px',
                    'text-outline-width': 0,
                    'transition-property': 'width, height, border-width, border-color, opacity',
                    'transition-duration': '0.3s'
                }
            },
            // --- SELECTED STATES ---
            {
                selector: 'node:selected[type="domain"]',
                style: { 'width': 180, 'height': 80, 'border-width': 4, 'border-color': '#ffffff', 'z-index': 999 }
            },
            {
                selector: 'node:selected[type="category"]',
                style: { 'width': 145, 'height': 58, 'border-width': 3, 'border-color': '#ffffff', 'z-index': 999 }
            },
            {
                selector: 'node:selected[type="skill"]',
                style: { 'width': 115, 'height': 115, 'border-width': 3, 'border-color': '#ffffff', 'z-index': 999 }
            },
            // --- EDGE STYLES ---
            {
                selector: 'edge[type="hierarchy"]',
                style: {
                    'curve-style': 'taxi',
                    'taxi-direction': 'vertical',
                    'taxi-turn': 20,
                    // Theme-aware: dark grey disappears on the dark background.
                    'line-color': function() { return edgeLineColor(); },
                    'line-opacity': 0.7,
                    'width': 2,
                    'target-arrow-shape': 'none'
                }
            },
            {
                selector: 'edge[type="prerequisite"]',
                style: {
                    'curve-style': 'bezier',
                    'line-color': '#E74C3C',
                    'line-opacity': 0.8,
                    'width': 2.5,
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': '#E74C3C',
                    'arrow-scale': 1.2
                }
            },
            {
                selector: 'edge[type="cross-domain"]',
                style: {
                    'curve-style': 'bezier',
                    'line-style': 'dashed',
                    'line-dash-pattern': [8, 4],
                    'line-color': '#3498DB',
                    'line-opacity': 0.5,
                    'width': 1.5,
                    'target-arrow-shape': 'none'
                }
            },
            {
                selector: 'edge[type="complements"]',
                style: {
                    'curve-style': 'bezier',
                    'line-style': 'dotted',
                    'line-color': '#2ECC71',
                    'line-opacity': 0.4,
                    'width': 1.5,
                    'target-arrow-shape': 'none'
                }
            },
            // --- HIDDEN STATE ---
            {
                selector: '.hidden',
                style: {
                    'display': 'none'
                }
            }
        ],

        // Start with no layout — we'll run it after filtering
        layout: { name: 'preset' }
    });

    // Hierarchy edge color follows the theme (re-evaluated via cy.style().update()
    // when the theme toggle flips data-theme).
    function edgeLineColor() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? '#a0a0a0' : '#555';
    }

    // ===== NAVIGATION STATE =====
    // Levels: 'domains' | 'categories' | 'skills'
    let navState = { level: 'domains', domainId: null, categoryId: null };

    function showView(state) {
        navState = state;

        // Hide everything first
        cy.elements().addClass('hidden');

        if (state.level === 'domains') {
            // Show only domain nodes — no edges between them
            cy.nodes('[type="domain"]').removeClass('hidden');

        } else if (state.level === 'categories') {
            // Show the parent domain + its categories + hierarchy edges between them
            const domain = cy.getElementById(state.domainId);
            const categories = cy.nodes('[type="category"]').filter(n => n.data('domain') === state.domainId);
            const edges = cy.edges('[type="hierarchy"]').filter(e => e.data('source') === state.domainId);

            domain.removeClass('hidden');
            categories.removeClass('hidden');
            edges.removeClass('hidden');

        } else if (state.level === 'skills') {
            // Show parent category + its skills + hierarchy edges + relevant non-hierarchy edges
            const category = cy.getElementById(state.categoryId);
            const skills = cy.nodes('[type="skill"]').filter(n => n.data('category') === state.categoryId);
            const hierEdges = cy.edges('[type="hierarchy"]').filter(e => e.data('source') === state.categoryId);

            category.removeClass('hidden');
            skills.removeClass('hidden');
            hierEdges.removeClass('hidden');

            // Show prerequisite/cross-domain/complement edges where both endpoints are visible
            const visibleIds = new Set();
            skills.forEach(s => visibleIds.add(s.id()));
            visibleIds.add(state.categoryId);

            cy.edges().filter(e => {
                if (e.data('type') === 'hierarchy') return false;
                return visibleIds.has(e.data('source')) && visibleIds.has(e.data('target'));
            }).removeClass('hidden');
        }

        // Re-layout visible elements
        const visible = cy.elements().not('.hidden');
        visible.layout({
            name: 'dagre',
            rankDir: 'TB',
            padding: 60,
            spacingFactor: 1.5,
            rankSep: 80,
            nodeSep: 50,
            animate: true,
            animationDuration: 400,
            fit: true
        }).run();

        updateBreadcrumb();
    }

    // ===== POST-LAYOUT EVEN SPACING =====
    // Dagre assigns ranks but can pack wide boxes tightly; after each layout,
    // redistribute every rank evenly across the available viewport so nodes
    // never overlap regardless of window size.
    function spreadRanksEvenly() {
        const visible = cy.nodes().not('.hidden');
        if (!visible.length) return;

        const pad = 80;
        const width = Math.max(cy.width() - pad * 2, 200);
        const height = Math.max(cy.height() - pad * 2, 160);

        // Group nodes into ranks by their laid-out y position.
        const ranks = [];
        visible.forEach(n => {
            const y = n.position('y');
            let rank = ranks.find(r => Math.abs(r.y - y) < 1);
            if (!rank) { rank = { y, nodes: [] }; ranks.push(rank); }
            rank.nodes.push(n);
        });
        ranks.sort((a, b) => a.y - b.y);

        ranks.forEach((rank, ri) => {
            rank.nodes.sort((a, b) => a.position('x') - b.position('x'));
            const y = pad + (ranks.length === 1 ? height / 2 : (height * ri) / (ranks.length - 1));
            rank.nodes.forEach((n, ni) => {
                const x = pad + (rank.nodes.length === 1 ? width / 2 : (width * ni) / (rank.nodes.length - 1));
                n.position({ x, y });
            });
        });

        // The spread is computed in viewport pixels; refit the camera so the
        // redistributed nodes are framed rather than left zoomed to dagre's
        // tighter bounding box.
        cy.animate({ fit: { eles: visible, padding: 60 } }, { duration: 250 });
    }

    cy.on('layoutstop', () => spreadRanksEvenly());

    // Called by profile.js when the session changes (login/logout/signup):
    // the overlay is per-user, so the graph must rebuild or the next user
    // would see the previous account's categories.
    window.HST_sessionChanged = function() {
        reloadGraph();
        resetSidebar();
    };

    // ===== BREADCRUMB =====
    const breadcrumb = document.getElementById('breadcrumb');

    function updateBreadcrumb() {
        let html = '';

        // Home is always present
        const homeActive = navState.level === 'domains' ? ' active' : '';
        html += `<span class="breadcrumb-item${homeActive}" data-action="home"><i class="fas fa-home"></i> Domains</span>`;

        if (navState.domainId) {
            const color = domainColors[navState.domainId] || '#888';
            const label = escapeHtml(domainLabels[navState.domainId] || navState.domainId);
            const active = navState.level === 'categories' ? ' active' : '';
            html += `<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`;
            html += `<span class="breadcrumb-item${active}" data-action="domain" data-id="${navState.domainId}" style="color:${color}">${label}</span>`;
        }

        if (navState.categoryId) {
            const label = escapeHtml(categoryLabels[navState.categoryId] || navState.categoryId);
            const color = domainColors[navState.domainId] || '#888';
            html += `<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`;
            html += `<span class="breadcrumb-item active" style="color:${color}">${label}</span>`;
        }

        breadcrumb.innerHTML = html;

        // Bind breadcrumb click handlers
        breadcrumb.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'home') {
                    cy.$(':selected').unselect();
                    showView({ level: 'domains', domainId: null, categoryId: null });
                    resetSidebar();
                } else if (action === 'domain') {
                    showView({ level: 'categories', domainId: item.dataset.id, categoryId: null });
                    // Breadcrumb nav behaves like tapping the node: select it
                    // and show its details instead of leaving a stale
                    // selection from the deeper view.
                    const node = cy.getElementById(item.dataset.id);
                    if (node.length) {
                        cy.$(':selected').unselect();
                        node.select();
                        showSidebarDetail(node.data());
                    }
                }
            });
        });
    }

    // ===== NODE TAP — NAVIGATION + SIDEBAR =====
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        const data = node.data();

        // Double-purpose: navigate drill-down AND show sidebar details
        if (data.type === 'domain' && navState.level === 'domains') {
            // Drill into domain → show categories
            showView({ level: 'categories', domainId: data.id, categoryId: null });
            showSidebarDetail(data);
            return;
        }

        if (data.type === 'category' && navState.level === 'categories') {
            // Drill into category → show skills
            showView({ level: 'skills', domainId: navState.domainId, categoryId: data.id });
            showSidebarDetail(data);
            return;
        }

        // Otherwise just show details in sidebar
        showSidebarDetail(data);
    });

    // Clear sidebar on background tap
    cy.on('tap', function(evt) {
        if (evt.target === cy) {
            resetSidebar();
        }
    });

    // Escape user-authored taxonomy text (labels, descriptions) before it
    // goes anywhere near innerHTML.
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // ===== TAXONOMY EDITING =====
    // Re-apply the user's overlay and re-render in place after an edit.
    function reloadGraph(fallbackState) {
        const patched = Taxonomy.apply(baseGraphData);
        rebuildLookups(patched);
        cy.elements().remove();
        cy.add(patched);
        // If the current view referenced a removed category, fall back.
        if (navState.categoryId && !cy.getElementById(navState.categoryId).length) {
            navState = fallbackState || { level: 'categories', domainId: navState.domainId, categoryId: null };
        }
        showView(navState);
    }

    function requireLogin() {
        if (Auth.currentUser()) return true;
        alert('Sign in (profile button, top right) to edit categories.');
        return false;
    }

    function sidebarCategoryList(data) {
        if (data.type !== 'domain') return '';
        const cats = cy.nodes('[type="category"]').filter(n => n.data('domain') === data.id);
        if (!cats.length) return '';
        const items = cats
            .map(c => `<button class="category-list-item" data-cat="${c.id()}">${escapeHtml(c.data('label'))}</button>`)
            .join('');
        return `<div class="category-list">
            <div class="proficiency-label">Categories (${cats.length})</div>
            ${items}
        </div>`;
    }

    function sidebarEditActions(data) {
        if (data.type === 'domain') {
            return `<div class="edit-actions">
                <button class="profile-action" data-edit="add-category" data-domain="${data.id}">+ Add category</button>
            </div>`;
        }
        if (data.type === 'category') {
            return `<div class="edit-actions">
                <button class="profile-action" data-edit="rename-category" data-id="${data.id}" data-domain="${data.domain}">Rename</button>
                <button class="profile-action danger" data-edit="remove-category" data-id="${data.id}">Delete</button>
            </div>`;
        }
        return '';
    }

    function bindEditActions(container) {
        // Category list items drill straight into the category's skills view.
        container.querySelectorAll('[data-cat]').forEach(item => {
            item.addEventListener('click', () => {
                const node = cy.getElementById(item.dataset.cat);
                if (!node.length) return;
                const d = node.data();
                showView({ level: 'skills', domainId: d.domain, categoryId: d.id });
                cy.$(':selected').unselect();
                node.select();
                showSidebarDetail(d);
            });
        });
        container.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!requireLogin()) return;
                const action = btn.dataset.edit;
                try {
                    if (action === 'add-category') {
                        const label = prompt(`New category name in ${domainLabels[btn.dataset.domain]}:`);
                        if (!label) return;
                        const description = prompt('Short description (optional):') || '';
                        const id = Taxonomy.addCategory(baseGraphData, btn.dataset.domain, label, description);
                        reloadGraph();
                        showSidebarDetail(cy.getElementById(id).data());
                    } else if (action === 'rename-category') {
                        const current = categoryLabels[btn.dataset.id] || btn.dataset.id;
                        const label = prompt('Rename category:', current);
                        if (!label || label === current) return;
                        Taxonomy.renameCategory(baseGraphData, btn.dataset.id, label);
                        reloadGraph();
                        showSidebarDetail(cy.getElementById(btn.dataset.id).data());
                    } else if (action === 'remove-category') {
                        const current = categoryLabels[btn.dataset.id] || btn.dataset.id;
                        if (!confirm(`Delete category "${current}"?`)) return;
                        Taxonomy.removeCategory(baseGraphData, btn.dataset.id);
                        reloadGraph();
                        resetSidebar();
                    }
                } catch (err) {
                    alert(err.message);
                }
            });
        });
    }

    // ===== SIDEBAR DETAILS =====
    function showSidebarDetail(data) {
        const sidebarContent = document.querySelector('.sidebar-content');
        const sidebarHeader = document.querySelector('.sidebar-header h3');

        sidebar.classList.remove('collapsed');
        sidebarHeader.textContent = data.label; // textContent: never parsed as HTML

        if (data.type === 'domain') {
            sidebarContent.innerHTML = `
                <div class="node-detail">
                    <span class="node-type-badge" style="background:${data.color}">${data.type}</span>
                    <p>${escapeHtml(data.description)}</p>
                    <p class="hint">Click to explore categories</p>
                    ${sidebarCategoryList(data)}
                    ${sidebarEditActions(data)}
                </div>
            `;
        } else if (data.type === 'category') {
            const color = domainColors[data.domain] || '#888';
            sidebarContent.innerHTML = `
                <div class="node-detail">
                    <span class="node-type-badge" style="background:${color}">${data.type}</span>
                    <p class="node-domain">${escapeHtml(domainLabels[data.domain] || data.domain)}</p>
                    <p>${escapeHtml(data.description)}</p>
                    <p class="hint">Click to explore skills</p>
                    ${sidebarEditActions(data)}
                </div>
            `;
        } else if (data.type === 'skill') {
            const color = domainColors[data.domain] || '#888';
            // The user's claimed level wins; shipped data defaults to 0.
            const level = Progress.getLevel(data.id) ?? data.proficiency.level;
            const scale = data.proficiency.scale;
            const defs = (data.proficiency.levels && data.proficiency.levels.length === scale.length)
                ? data.proficiency.levels
                : DEFAULT_LEVEL_DEFS;
            const levelLabel = level > 0 ? defs[level - 1].name : 'Not started';
            const loggedIn = !!Auth.currentUser();

            // Pips are clickable when logged in: claim that level.
            const pips = scale.map((name, i) => {
                const filled = i < level;
                const interactive = loggedIn ? ' interactive' : '';
                return `<div class="pip${interactive} ${filled ? 'filled' : ''}" data-claim-level="${i + 1}" data-skill="${data.id}" style="${filled ? 'background:' + color : ''}" title="${escapeHtml(defs[i].name)}${loggedIn ? ' - click to claim' : ''}"></div>`;
            }).join('');

            const progressLog = renderProgressLog(data.id, defs);
            const progressHint = loggedIn
                ? ''
                : '<p class="hint">Sign in to track your level.</p>';

            const tags = (data.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

            sidebarContent.innerHTML = `
                <div class="node-detail">
                    <span class="node-type-badge" style="background:${color}">${data.type}</span>
                    <p class="node-domain">${escapeHtml(domainLabels[data.domain] || data.domain)} / ${escapeHtml(categoryLabels[data.category] || data.category)}</p>
                    <p>${escapeHtml(data.description)}</p>
                    <div class="proficiency-section">
                        <div class="proficiency-label">${escapeHtml(levelLabel)}</div>
                        <div class="proficiency-bar">${pips}</div>
                        ${progressHint}
                        ${progressLog}
                        ${renderMasteryLadder(data.proficiency, color)}
                    </div>
                    ${tags ? '<div class="tags">' + tags + '</div>' : ''}
                </div>
            `;
        }

        bindEditActions(sidebarContent);
        bindProgressClaims(sidebarContent, data);
    }

    // Clicking a pip claims that level (self-assessed; note doubles as the
    // evidence pointer until a backend exists). Down-claims are allowed and
    // logged - decay honesty over vanity.
    function bindProgressClaims(container, data) {
        if (data.type !== 'skill') return;
        container.querySelectorAll('[data-claim-level]').forEach(pip => {
            pip.addEventListener('click', () => {
                if (!Auth.currentUser()) return;
                const level = Number(pip.dataset.claimLevel);
                const defs = (data.proficiency.levels && data.proficiency.levels.length === data.proficiency.scale.length)
                    ? data.proficiency.levels
                    : DEFAULT_LEVEL_DEFS;
                const def = defs[level - 1];
                const note = prompt(
                    `Claim "${def.name}" in ${data.label}?\n\nCapability: ${def.capability}\n\nOptional note / evidence:`,
                    '');
                if (note === null) return; // cancelled
                try {
                    Progress.setLevel(data.id, level, note);
                    showSidebarDetail(data);
                } catch (err) {
                    alert(err.message);
                }
            });
        });
    }

    function renderProgressLog(skillId, defs) {
        const log = Progress.getLog(skillId);
        if (!log.length) return '';
        const rows = log.slice(-5).reverse().map(e => {
            const name = e.level > 0 ? defs[e.level - 1].name : 'Not started';
            const date = new Date(e.at).toLocaleDateString();
            const note = e.note ? ` - ${escapeHtml(e.note)}` : '';
            return `<div class="progress-log-row">
                <span class="progress-log-level">${escapeHtml(name)}</span>
                <span class="progress-log-date">${date}</span>
                ${note ? `<span class="progress-log-note">${note}</span>` : ''}
            </div>`;
        }).join('');
        return `<div class="progress-log">
            <div class="proficiency-label">Your progress</div>
            ${rows}
        </div>`;
    }

    // Default Dreyfus capability descriptors, used when a skill carries no
    // per-skill proficiency.levels (see docs/research/mastery-framework.md).
    const DEFAULT_LEVEL_DEFS = [
        { name: 'Novice', capability: 'Follows rules and instructions; no contextual judgment yet.' },
        { name: 'Beginner', capability: 'Recognizes patterns; applies maxims from limited experience.' },
        { name: 'Competent', capability: 'Plans deliberately; executes independently; invested in outcomes.' },
        { name: 'Proficient', capability: 'Intuitive, holistic grasp; can teach others.' },
        { name: 'Expert', capability: 'Transcends rules; innovates; others seek their expertise.' },
        { name: 'Master', capability: 'Transforms the domain; creates new knowledge; mentors experts.' }
    ];

    function renderMasteryLadder(proficiency, color) {
        const defs = (proficiency.levels && proficiency.levels.length === proficiency.scale.length)
            ? proficiency.levels
            : DEFAULT_LEVEL_DEFS;
        const rows = defs.map((def, i) => {
            const attained = proficiency.level > i;
            return `<div class="ladder-row ${attained ? 'attained' : ''}">
                <span class="ladder-name" ${attained ? `style="color:${color}"` : ''}>${i + 1}. ${escapeHtml(def.name)}</span>
                <span class="ladder-capability">${escapeHtml(def.capability)}</span>
            </div>`;
        }).join('');
        return `<div class="mastery-ladder">${rows}</div>`;
    }

    function resetSidebar() {
        document.querySelector('.sidebar-header h3').textContent = 'Menu';
        document.querySelector('.sidebar-content').innerHTML = '<p>Click a node to explore.</p>';
    }

    // ===== RIGHT-CLICK TO GO BACK =====
    cy.on('cxttap', function(evt) {
        evt.originalEvent.preventDefault();
        goBack();
    });

    // Prevent browser context menu on the cytoscape container
    document.getElementById('cy').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' && e.key !== 'Backspace') return;
        // Don't hijack typing in form fields (e.g. the profile modal's
        // interest inputs) or Escape while a modal is open.
        if (e.target.closest('input, textarea, [contenteditable]')) return;
        const overlay = document.getElementById('profileOverlay');
        if (overlay && !overlay.classList.contains('hidden')) return;
        e.preventDefault();
        goBack();
    });

    function goBack() {
        if (navState.level === 'skills') {
            showView({ level: 'categories', domainId: navState.domainId, categoryId: null });
        } else if (navState.level === 'categories') {
            showView({ level: 'domains', domainId: null, categoryId: null });
        }
    }

    // ===== INITIAL VIEW =====
    showView({ level: 'domains', domainId: null, categoryId: null });
});
