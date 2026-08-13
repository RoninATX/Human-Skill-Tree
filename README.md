# Skill Tree Visualization

A web-based skill tree visualization tool that displays hierarchical skill relationships in an interactive graph format.

## Features

### Core Visualization
- Interactive skill tree using Cytoscape.js
- Hierarchical layout with clear parent-child relationships
- Right-angled edges with dot endpoints
- Smooth animations and transitions

### Node Display
- Square nodes with custom background images
- Centered skill names with proficiency ranges
- Semi-transparent text background for readability
- Default skill icon fallback system

### Navigation & Interface
- Collapsible sidebar for future navigation/details
- Fixed position floating controls
- Dark/Light theme toggle
- Profile button placeholder
- Responsive layout that maintains visibility

### Interaction
- Node selection with visual feedback
  - Size increase on selection
  - Glowing border effect
  - Smooth transitions
- Pan and zoom capabilities
- Single node selection mode

### Skill Data Structure

## Setup
1. Ensure all files are in their correct locations
2. Start the dev server:
   ```bash
   scripts/serve.sh start   # or: python -m http.server
   ```
3. Access the visualization at `http://localhost:8000`

`scripts/serve.sh` also provides `stop`, `status`, and `restart`, and runs a
health check on startup. Docker is available as an alternative:
`docker compose up` serves on `http://localhost:3123`.

## Development
- VS Code launch configuration included for Python HTTP server
- Dark/Light theme support using CSS variables
- Modular design for easy feature additions

## Future Enhancements
- Skill details panel in sidebar
- Progress tracking system
- User profiles and progress persistence
- Custom skill tree creation tools
- Additional interactive features

## Dependencies
- Cytoscape.js
- Dagre layout extension
- Font Awesome icons