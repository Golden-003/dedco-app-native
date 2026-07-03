#!/usr/bin/env python3
"""Corrige le padding non-responsive p-6 → p-4 sm:p-6 sur toutes les pages dashboard.
Préserve les p-6 qui sont déjà dans un contexte responsive (p-4 sm:p-6)."""
import re
import os
from pathlib import Path

# Pages à traiter (dashboards + pages de détail partagées)
PATTERNS = [
    'src/components/dedco/pages/artisan/*.tsx',
    'src/components/dedco/pages/designer/*.tsx',
    'src/components/dedco/pages/admin/*.tsx',
    'src/components/dedco/pages/maison/*.tsx',
    'src/components/dedco/pages/projet-*.tsx',
    'src/components/dedco/pages/brief-*-detail.tsx',
    'src/components/dedco/pages/order-pages.tsx',
    'src/components/dedco/pages/messages-page.tsx',
    'src/components/dedco/pages/notifications-page.tsx',
    'src/components/dedco/pages/mes-projets-page.tsx',
    'src/components/dedco/pages/designer-workflow-pages.tsx',
    'src/components/dedco/pages/client-and-designer-pages.tsx',
]

# Regex : capture "p-6 max-w-XXX mx-auto" (avec ou sans autres classes après)
# et le remplace par "p-4 sm:p-6 max-w-XXX mx-auto"
# Mais ne touche pas si c'est déjà "p-4 sm:p-6"
PATTERN = re.compile(r'"p-6 (max-w-\S+ mx-auto[^"]*)"')

total_changes = 0
files_changed = []

for pattern in PATTERNS:
    for filepath in Path('.').glob(pattern):
        if not filepath.is_file():
            continue
        content = filepath.read_text(encoding='utf-8')
        new_content, n = PATTERN.subn(r'"p-4 sm:p-6 \1"', content)
        if n > 0:
            filepath.write_text(new_content, encoding='utf-8')
            files_changed.append((str(filepath), n))
            total_changes += n

print(f"\n=== {total_changes} corrections sur {len(files_changed)} fichiers ===\n")
for f, n in files_changed:
    print(f"  {f}: {n} correction(s)")
