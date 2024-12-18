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
    
    // Check for saved theme preference or default to 'light'
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

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: graphData,
        
        style: [
            {
                selector: 'node',
                style: {
                    'shape': 'rectangle',
                    'background-color': 'white',
                    'background-image': 'data(image)',
                    'background-fit': 'cover',
                    'background-width': '80%',
                    'background-height': '80%',
                    'background-position-x': '50%',
                    'background-position-y': '50%',
                    'background-opacity': '1',
                    'border-width': '1px',
                    'border-color': 'var(--text-color)',
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
                    'transition-property': 'width, height, border-width, border-color, box-shadow, background-color',
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
                    'box-shadow': '0 0 15px #4CAF50',
                    'background-color': 'white',
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
                    'line-color': 'var(--text-color)',
                    'target-arrow-color': 'var(--text-color)',
                    'edge-text-rotation': 'autorotate',
                    'color': 'var(--text-color)'
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
});
