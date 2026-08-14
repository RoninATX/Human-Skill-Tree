document.addEventListener('DOMContentLoaded', async function() {
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
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Fetch the graph data
    const response = await fetch('static/data/graph_data.json');
    const graphData = await response.json();

    // Build lookups
    const domainColors = {};
    const domainLabels = {};
    const categoryLabels = {};
    graphData.nodes.forEach(n => {
        if (n.data.type === 'domain') {
            domainColors[n.data.id] = n.data.color;
            domainLabels[n.data.id] = n.data.label;
        }
        if (n.data.type === 'category') {
            categoryLabels[n.data.id] = n.data.label;
        }
    });

    function getDomainColor(ele) {
        const data = ele.data();
        if (data.type === 'domain') return data.color;
        return domainColors[data.domain] || '#888';
    }

    const cy = cytoscape({
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
                    'line-color': '#555',
                    'line-opacity': 0.6,
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

    // ===== BREADCRUMB =====
    const breadcrumb = document.getElementById('breadcrumb');

    function updateBreadcrumb() {
        let html = '';

        // Home is always present
        const homeActive = navState.level === 'domains' ? ' active' : '';
        html += `<span class="breadcrumb-item${homeActive}" data-action="home"><i class="fas fa-home"></i> Domains</span>`;

        if (navState.domainId) {
            const color = domainColors[navState.domainId] || '#888';
            const label = domainLabels[navState.domainId] || navState.domainId;
            const active = navState.level === 'categories' ? ' active' : '';
            html += `<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`;
            html += `<span class="breadcrumb-item${active}" data-action="domain" data-id="${navState.domainId}" style="color:${color}">${label}</span>`;
        }

        if (navState.categoryId) {
            const label = categoryLabels[navState.categoryId] || navState.categoryId;
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
                    showView({ level: 'domains', domainId: null, categoryId: null });
                } else if (action === 'domain') {
                    showView({ level: 'categories', domainId: item.dataset.id, categoryId: null });
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

    // ===== SIDEBAR DETAILS =====
    function showSidebarDetail(data) {
        const sidebarContent = document.querySelector('.sidebar-content');
        const sidebarHeader = document.querySelector('.sidebar-header h3');

        sidebar.classList.remove('collapsed');
        sidebarHeader.textContent = data.label;

        if (data.type === 'domain') {
            sidebarContent.innerHTML = `
                <div class="node-detail">
                    <span class="node-type-badge" style="background:${data.color}">${data.type}</span>
                    <p>${data.description}</p>
                    <p class="hint">Click to explore categories</p>
                </div>
            `;
        } else if (data.type === 'category') {
            const color = domainColors[data.domain] || '#888';
            sidebarContent.innerHTML = `
                <div class="node-detail">
                    <span class="node-type-badge" style="background:${color}">${data.type}</span>
                    <p class="node-domain">${domainLabels[data.domain] || data.domain}</p>
                    <p>${data.description}</p>
                    <p class="hint">Click to explore skills</p>
                </div>
            `;
        } else if (data.type === 'skill') {
            const color = domainColors[data.domain] || '#888';
            const level = data.proficiency.level;
            const scale = data.proficiency.scale;
            const levelLabel = level > 0 ? scale[level - 1] : 'Not started';

            const pips = scale.map((name, i) => {
                const filled = i < level;
                return `<div class="pip ${filled ? 'filled' : ''}" style="${filled ? 'background:' + color : ''}" title="${name}"></div>`;
            }).join('');

            const tags = (data.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

            sidebarContent.innerHTML = `
                <div class="node-detail">
                    <span class="node-type-badge" style="background:${color}">${data.type}</span>
                    <p class="node-domain">${domainLabels[data.domain] || data.domain} / ${categoryLabels[data.category] || data.category}</p>
                    <p>${data.description}</p>
                    <div class="proficiency-section">
                        <div class="proficiency-label">${levelLabel}</div>
                        <div class="proficiency-bar">${pips}</div>
                    </div>
                    ${tags ? '<div class="tags">' + tags + '</div>' : ''}
                </div>
            `;
        }
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
