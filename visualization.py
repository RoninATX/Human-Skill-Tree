import json
import networkx as nx
import os

def convert_graph_to_json(graph):
    """Convert NetworkX graph to Cytoscape.js format and save to JSON."""
    elements = {
        'nodes': [],
        'edges': []
    }
    
    # Convert nodes
    for node in graph.nodes():
        # Create the expected image path
        image_path = f'static/images/skills/{str(node).lower().replace(" ", "_")}.png'
        
        # Use default image if specific image doesn't exist
        if not os.path.exists(image_path):
            image_path = 'static/images/skills/skill_default.png'
        
        elements['nodes'].append({
            'data': {
                'id': str(node),
                'label': str(node),
                'image': image_path
            }
        })
    
    # Convert edges
    for edge in graph.edges():
        elements['edges'].append({
            'data': {
                'source': str(edge[0]),
                'target': str(edge[1])
            }
        })
    
    # Save to file
    with open('static/data/graph_data.json', 'w') as f:
        json.dump(elements, f, indent=2)
