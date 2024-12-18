import networkx as nx

# Define the skills and their dependencies
def get_skill_tree():
    skill_tree = nx.DiGraph()
    skills = [
        ("Basic Skills", "Communication"),
        ("Basic Skills", "Problem Solving"),
        ("Communication", "Public Speaking"),
        ("Communication", "Active Listening"),
        ("Problem Solving", "Critical Thinking"),
        ("Problem Solving", "Creativity"),
        ("Critical Thinking", "Strategic Planning"),
        ("Creativity", "Innovation"),
        ("Active Listening", "Empathy"),
        ("Empathy", "Conflict Resolution"),
        ("Strategic Planning", "Leadership"),
        ("Leadership", "Mentoring")
    ]
    skill_tree.add_edges_from(skills)
    return skill_tree
