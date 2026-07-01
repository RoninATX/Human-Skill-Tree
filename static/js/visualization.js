// Skill tree data — edit this to add/remove skills
const graphData = {
    nodes: [
        { data: { id: "Basic Skills", label: "Basic Skills", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Communication", label: "Communication", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Problem Solving", label: "Problem Solving", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Public Speaking", label: "Public Speaking", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Active Listening", label: "Active Listening", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Critical Thinking", label: "Critical Thinking", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Creativity", label: "Creativity", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Strategic Planning", label: "Strategic Planning", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Innovation", label: "Innovation", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Empathy", label: "Empathy", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Conflict Resolution", label: "Conflict Resolution", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Leadership", label: "Leadership", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
        { data: { id: "Mentoring", label: "Mentoring", image: "static/images/skills/skill_default.png", proficiency: { min: 1, max: "∞", current: 0 } } },
    ],
    edges: [
        { data: { source: "Basic Skills", target: "Communication" } },
        { data: { source: "Basic Skills", target: "Problem Solving" } },
        { data: { source: "Communication", target: "Public Speaking" } },
        { data: { source: "Communication", target: "Active Listening" } },
        { data: { source: "Problem Solving", target: "Critical Thinking" } },
        { data: { source: "Problem Solving", target: "Creativity" } },
        { data: { source: "Active Listening", target: "Empathy" } },
        { data: { source: "Critical Thinking", target: "Strategic Planning" } },
        { data: { source: "Creativity", target: "Innovation" } },
        { data: { source: "Strategic Planning", target: "Leadership" } },
        { data: { source: "Empathy", target: "Conflict Resolution" } },
        { data: { source: "Leadership", target: "Mentoring" } },
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');

    sidebarCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Theme colors — Cytoscape has its own style engine and can't read CSS vars,
    // so we drive themed colors from JS and re-apply on toggle.
    const themes = {
        light: { text: '#333333', nodeBg: '#ffffff' },
        dark:  { text: '#ffffff', nodeBg: '#2d2d2d' }
    };

    function currentThemeName() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    function themeColors() {
        return themes[currentThemeName()];
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = currentThemeName() === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        applyThemeToCy();
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    const colors = themeColors();

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: graphData,

        style: [
            {
                selector: 'node',
                style: {
                    'shape': 'rectangle',
                    'background-color': colors.nodeBg,
                    'background-image': 'data(image)',
                    'background-fit': 'cover',
                    'background-width': '80%',
                    'background-height': '80%',
                    'background-position-x': '50%',
                    'background-position-y': '50%',
                    'background-opacity': '1',
                    'border-width': '1px',
                    'border-color': colors.text,
                    'label': function(ele) {
                        const data = ele.data();
                        return `${data.label}\n(${data.proficiency.min}-${data.proficiency.max})`;
                    },
                    'text-wrap': 'wrap',
                    'text-max-width': '80px',
                    'width': '100px',
                    'height': '100px',
                    'font-weight': 'bold',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': 'white',
                    'text-background-color': '#000000',
                    'text-background-opacity': 0.6,
                    'text-background-padding': '3px',
                    'transition-property': 'width, height, border-width, border-color, background-color',
                    'transition-duration': '0.2s'
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'width': '120px',
                    'height': '120px',
                    'border-width': '3px',
                    'border-color': '#4CAF50',
                    'background-color': colors.nodeBg,
                    'z-index': 999
                }
            },
            {
                selector: 'edge',
                style: {
                    'curve-style': 'taxi',
                    'taxi-direction': 'vertical',
                    'taxi-turn': 20,
                    'target-arrow-shape': 'circle',
                    'arrow-scale': 1.5,
                    'line-color': colors.text,
                    'target-arrow-color': colors.text,
                    'edge-text-rotation': 'autorotate',
                    'color': colors.text
                }
            }
        ],

        layout: {
            name: 'dagre',
            rankDir: 'TB',
            padding: 50,
            spacingFactor: 1.25,
            animate: true,
            animationDuration: 500
        }
    });

    // Re-apply theme-dependent styles to the live Cytoscape instance
    function applyThemeToCy() {
        const c = themeColors();
        cy.style()
            .selector('node').style({
                'border-color': c.text,
                'background-color': c.nodeBg
            })
            .selector('node:selected').style({
                'background-color': c.nodeBg
            })
            .selector('edge').style({
                'line-color': c.text,
                'target-arrow-color': c.text,
                'color': c.text
            })
            .update();
    }
});
