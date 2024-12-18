def get_hierarchy_levels(graph, root):
    """Determine hierarchical levels for nodes."""
    levels = {root: 0}  # Root starts at level 0
    for node in graph.nodes:
        for child in graph.successors(node):
            levels[child] = levels[node] + 1
    return levels

def assign_positions(levels, x_spacing=2.0, y_spacing=-1.5):
    """Generate positions for nodes based on levels."""
    pos = {}
    layered_nodes = {}
    for node, level in levels.items():
        layered_nodes.setdefault(level, []).append(node)

    for level, nodes in layered_nodes.items():
        y = level * y_spacing
        x_offset = -x_spacing * (len(nodes) - 1) / 2
        for i, node in enumerate(nodes):
            pos[node] = (x_offset + i * x_spacing, y)
    return pos
