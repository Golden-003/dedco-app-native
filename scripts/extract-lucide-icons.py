#!/usr/bin/env python3
"""Extract Lucide icon SVG paths properly and build a Python dict {name: svg_inner_html}."""
import re
import json
from pathlib import Path

BASE = Path("/home/z/my-project/node_modules/lucide-react/dist/esm/icons")

# Resolve aliases first
def resolve_alias(name):
    f = BASE / f"{name}.js"
    if not f.exists():
        return name
    content = f.read_text()
    m = re.search(r"from '\./([^.]+)\.js'", content)
    if m:
        return m.group(1)
    return name

def parse_icon_node(name):
    """Parse the __iconNode array and return SVG inner HTML."""
    real_name = resolve_alias(name)
    f = BASE / f"{real_name}.js"
    if not f.exists():
        return None
    content = f.read_text()
    # Extract the __iconNode array literal
    m = re.search(r'const\s+__iconNode\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if not m:
        return None
    body = m.group(1)
    # Find all elements like ["tag", { d: "...", ... }]
    elements = re.findall(r'\["(\w+)",\s*\{([^}]+)\}\s*\]', body)
    if not elements:
        # Try multiline pattern
        elements = re.findall(r'\[\s*"(\w+)"\s*,\s*\{([^}]+)\}\s*\]', body)
    
    svg_parts = []
    for tag, attrs_str in elements:
        # Extract d attribute (path) or other attrs
        attrs = []
        d_match = re.search(r'd:\s*"([^"]+)"', attrs_str)
        if d_match:
            attrs.append(f'd="{d_match.group(1)}"')
        # Other common attrs — exclude 'key' which is React-specific
        for attr_name in ['cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'x1', 'x2', 'y1', 'y2', 'points']:
            m_attr = re.search(rf'\b{attr_name}:\s*"([^"]+)"', attrs_str)
            if m_attr:
                attrs.append(f'{attr_name}="{m_attr.group(1)}"')
        svg_parts.append(f'<{tag} {" ".join(attrs)} />')
    
    return "".join(svg_parts)

# Icons organized by category for the brand book
ICONS_BY_CAT = {
    "Navigation principale": ["home", "search", "heart", "shopping-bag", "user", "bell", "menu", "x"],
    "Sidebar Designer": ["layout-dashboard", "file-text", "folder-kanban", "message-circle", "settings"],
    "Sidebar Artisan": ["hammer", "package", "bar-chart-3", "award"],
    "Sidebar Admin": ["users", "clipboard-list"],
    "Actions": ["plus", "check", "trash-2", "edit", "eye", "download", "share-2", "copy"],
    "Statuts": ["check-circle-2", "clock", "alert-circle", "x-circle", "loader-2"],
    "E-commerce": ["shopping-cart", "credit-card", "tag", "percent"],
    "Flèches & navigation": ["chevron-right", "chevron-down", "arrow-right", "arrow-left", "filter", "more-horizontal"],
    "Communication": ["mail", "phone", "send"],
    "Évaluation": ["star"],
}

result = {}
for cat, names in ICONS_BY_CAT.items():
    for name in names:
        svg = parse_icon_node(name)
        if svg:
            result[name] = svg
        else:
            print(f"  ✗ Failed: {name}")

# Save
Path("/tmp/lucide-icons.json").write_text(json.dumps(result, indent=2, ensure_ascii=False))
print(f"\n{len(result)} icons extracted and saved to /tmp/lucide-icons.json")

# Quick test: print home icon
print("\nExample (home):")
print(result.get("home", "MISSING")[:200])
