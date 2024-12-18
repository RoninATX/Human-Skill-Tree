from skill_tree_data import get_skill_tree
from visualization import convert_graph_to_json

# Create the skill tree
skill_tree = get_skill_tree()

# Convert and save graph data
convert_graph_to_json(skill_tree)
