#!/usr/bin/env python3
"""Create a portable HTML version (without base64 fonts) that references fonts via relative paths.
Then zip HTML + fonts folder together for easy download."""
import re
from pathlib import Path
import zipfile
import shutil

SRC_HTML = Path("/home/z/my-project/scripts/dedcco-brand-book.html")
PKG_DIR = Path("/tmp/dedcco-package")
PKG_HTML = PKG_DIR / "dedcco-design-system.html"

# Read source HTML (with base64 fonts)
html = SRC_HTML.read_text(encoding="utf-8")
print(f"Source HTML: {len(html)//1024}KB")

# Replace base64 data URIs with relative path "fonts/Quache-XXX.ttf"
fonts_files = ["Quache-Light.ttf", "Quache-Regular.ttf", "Quache-Medium.ttf", "Quache-Bold.ttf", "Quache-Black.ttf"]
replacements = 0
for fname in fonts_files:
    # Pattern: src: url("data:font/ttf;base64,XXXXX...") format("truetype");
    pattern = rf'src:\s*url\("data:font/ttf;base64,[A-Za-z0-9+/=]+"\)\s*format\("truetype"\);'
    replacement = f'src: url("fonts/{fname}") format("truetype");'
    new_html, n = re.subn(pattern, replacement, html, count=1)
    if n > 0:
        html = new_html
        replacements += n
        print(f"  ✓ Replaced base64 → fonts/{fname}")

print(f"\nTotal replacements: {replacements}")
print(f"Portable HTML size: {len(html)//1024}KB")

# Write portable HTML
PKG_HTML.write_text(html, encoding="utf-8")

# Add a small README
readme = """# Dedcco Design System — Brand Book v1.1

## Contenu du package

- `dedcco-design-system.html` — le brand book complet (55 pages, éditable)
- `fonts/` — les 5 graisses de la police Quache (Light, Regular, Medium, Bold, Black)

## Utilisation

### Pour prévisualiser
Ouvrez `dedcco-design-system.html` dans un navigateur. Les fonts Quache sont chargées depuis le sous-dossier `fonts/` via `@font-face` — ne pas séparer le HTML du dossier `fonts/`.

### Pour éditer
Ouvrez le HTML dans VS Code, Cursor, ou tout éditeur de texte. Le CSS est inline dans `<head>`, le contenu est dans `<body>`.

### Pour régénérer le PDF
Si vous avez Node.js et Playwright installés :

```bash
npx html2pdf-next.js dedcco-design-system.html --output dedcco-design-system.pdf --width 720px --height 1020px
```

Ou plus simple : ouvrez le HTML dans Chrome → Imprimer → Sauvegarder en PDF (format personnalisé 720×1020px, marges 0, fonds activés).

## Structure

- **Cover page** — Brand book Dedcco avec palette 3 couleurs
- **Sections 1-28** — Identité, palette, typographie, tokens, composants, layouts par rôle, moteur brief-artisan, animations, accessibilité, conventions
- **Section 29 — Chiffres & alternative Quache** — la précision critique sur l'absence de chiffres dans Quache + classe .font-numeric
- **Section 30 — Icônes Lucide** — 46 icônes SVG par contexte d'usage
- **Section 31 — Annexe** — Cheatsheet + glossaire métier

## Métadonnées

- Version : 1.1
- Date : Mars 2026
- Auteur : Dedcco Design Team
- Pages : 55
- Mots : ~13 000
"""
(PKG_DIR / "README.md").write_text(readme, encoding="utf-8")

# Create zip
zip_path = Path("/home/z/my-project/download/dedcco-design-system.zip")
if zip_path.exists():
    zip_path.unlink()

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    # Add HTML
    zf.write(PKG_HTML, "dedcco-design-system.html")
    # Add fonts
    for font_file in sorted((PKG_DIR / "fonts").iterdir()):
        zf.write(font_file, f"fonts/{font_file.name}")
    # Add README
    zf.write(PKG_DIR / "README.md", "README.md")

print(f"\n✓ Zip created: {zip_path}")
print(f"  Size: {zip_path.stat().st_size // 1024}KB")
print(f"  Contents:")
with zipfile.ZipFile(zip_path, 'r') as zf:
    for info in zf.infolist():
        print(f"    {info.filename} ({info.file_size // 1024}KB)")
