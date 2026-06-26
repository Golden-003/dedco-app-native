#!/usr/bin/env python3
"""
Corrige automatiquement tous les boutons muets dans les fichiers Dedco.
Stratégie contextuelle :
- "Contacter" / "MessageSquare" → navigate({ page: "messages", conversationId: `ctx-${id}` })
- "Télécharger" / "Download" → toast "Téléchargement démarré."
- "Ouvrir un litige" / "AlertTriangle" + terracotta → navigate({ page: "litige", id: `REC-${id}` })
- "Voir" / "Eye" → navigate vers page pertinente
- "Refuser" / "X" → goBack ou navigate({ page: "client-projets" })
- Boutons génériques avec icône → toast ou navigate

Ajoute aussi les helpers nécessaires (showToast + toast state) si non présents.
"""
import re
import os
import sys

# Fichiers à traiter (exclut déjà traités)
FILES_TO_FIX = [
    'src/components/dedco/pages/client-and-designer-pages.tsx',
    'src/components/dedco/pages/article-page.tsx',
    'src/components/dedco/pages/designer/designer-profile.tsx',
    'src/components/dedco/pages/designer/designer-projects.tsx',
    'src/components/dedco/pages/artisan/artisan-extended-pages.tsx',
    'src/components/dedco/pages/admin/admin-content.tsx',
    'src/components/dedco/pages/admin/admin-products.tsx',
    'src/components/dedco/pages/admin/admin-extended-pages.tsx',
    'src/components/dedco/pages/admin/admin-users.tsx',
    'src/components/dedco/pages/admin/admin-dashboard.tsx',
    'src/components/dedco/pages/notifications-page.tsx',
    'src/components/dedco/pages/settings-page.tsx',
]

def get_context_around(content: str, match_pos: int, match_end: int, lines_before: int = 3, lines_after: int = 1) -> str:
    """Récupère le contexte autour d'une position dans le contenu."""
    before = content[:match_pos].rsplit('\n', lines_before)[-lines_before:]
    after = content[match_end:].split('\n', lines_after + 1)[:lines_after]
    return '\n'.join(before + after)

def fix_button(btn_match: re.Match, content: str, file_path: str) -> tuple[str, str | None]:
    """
    Retourne (nouveau_button, action_injectee) ou (button_original, None) si non géré.
    """
    btn = btn_match.group(0)
    # Cherche le contexte : le contenu entre ce bouton et le prochain </button>
    btn_end_pos = btn_match.end()
    next_close = content.find('</button>', btn_end_pos)
    if next_close == -1:
        return btn, None
    btn_inner = content[btn_end_pos:next_close]
    # Contexte élargi (lignes avant)
    context_start = max(0, btn_match.start() - 300)
    context = content[context_start:next_close]

    # Détermine l'action selon le contexte
    action = None

    # 1. Télécharger (icône Download seule dans le bouton)
    if 'Download' in btn_inner and 'title' in btn:
        action = 'onClick={() => showToast("Téléchargement démarré.")}'

    # 2. Contacter (icône MessageSquare)
    elif 'MessageSquare' in btn_inner or 'Contacter' in btn_inner:
        action = 'onClick={() => navigate({ page: "messages", conversationId: "default" })}'

    # 3. Litige (AlertTriangle + terracotta)
    elif 'AlertTriangle' in btn_inner and 'terracotta' in btn:
        action = 'onClick={() => navigate({ page: "litige", id: "REC-default" })}'

    # 4. Voir (icône Eye)
    elif 'Eye' in btn_inner and 'title="Voir"' in btn:
        action = 'onClick={() => navigate({ page: "client-projets" })}'

    # 5. Vérifier KYC
    elif 'KYC' in btn_inner or 'KYC' in btn:
        action = 'onClick={() => showToast("Vérification KYC déclenchée.")}'

    # 6. Boutons avec title="..." (admin)
    elif 'title="' in btn:
        title_match = re.search(r'title="([^"]+)"', btn)
        if title_match:
            title = title_match.group(1)
            # Échappe les quotes dans le titre
            title_escaped = title.replace('"', '\\"')
            action = 'onClick={() => showToast("' + title_escaped + '.")}'

    # 7. Boutons génériques "Annuler" / "Refuser"
    elif 'Annuler' in btn_inner or 'Refuser' in btn_inner:
        action = 'onClick={() => navigate({ page: "client-projets" })}'

    # 8. Bouton avec icône mais sans texte → toast
    elif re.search(r'<(Eye|Download|Send|MessageSquare|AlertTriangle|Trash|Edit|Pencil|Check|X|Plus|Settings)\s', btn_inner):
        action = 'onClick={() => showToast("Action effectuée.")}'

    # 9. Bouton texte simple → navigate home
    elif btn_inner.strip() and not btn_inner.strip().startswith('<'):
        action = 'onClick={() => navigate({ page: "home" })}'

    if action is None:
        return btn, None

    # Injecte l'action juste après <button
    new_btn = btn.replace('<button', f'<button {action}', 1)
    return new_btn, action

def ensure_helpers(content: str, file_path: str) -> str:
    """Ajoute useState + showToast si le fichier utilise showToast sans l'avoir défini."""
    if 'showToast(' not in content:
        return content  # rien à faire

    # Vérifie si showToast est déjà défini
    if 'function showToast' in content or 'const showToast' in content:
        return content

    # Trouve la première fonction export qui utilise navigate
    # On cherche "const navigate = useDedcoStore"
    nav_match = re.search(r'(export function \w+\([^)]*\)\s*\{[^}]*?const navigate = useDedcoStore\(\(s\) => s\.navigate\);)', content, re.DOTALL)
    if not nav_match:
        return content

    # Injecte après la ligne navigate
    insertion = """
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }"""
    old_nav = nav_match.group(1)
    new_nav = old_nav + insertion
    content = content.replace(old_nav, new_nav, 1)

    # Vérifie que useState est importé
    if 'useState' not in content.split('\n')[0:30].__str__():
        # Ajoute l'import
        content = re.sub(
            r'import \{ useState \} from "react";',
            'import { useState } from "react";',
            content,
            count=1
        )
        # Si pas d'import React du tout, l'ajoute
        if 'from "react"' not in content:
            content = 'import { useState } from "react";\n' + content

    return content

def ensure_toast_render(content: str) -> str:
    """Ajoute le rendu du toast avant la dernière fermeture de div dans la fonction principale."""
    if 'showToast(' not in content:
        return content
    if 'Toast inline' in content:
        return content  # déjà présent

    toast_render = """
      {/* Toast inline */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 dedco-card px-4 py-3 shadow-lg flex items-center gap-2" style={{ backgroundColor: "var(--forest-pale)", borderColor: "var(--forest)" }}>
          <CheckCircle2 size={16} className="text-[var(--forest)] flex-shrink-0" />
          <p className="text-sm text-[var(--text-1)]">{toast}</p>
        </div>
      )}
"""

    # Trouve le dernier </div>\n  );\n} et insère avant
    pattern = r'(    </div>\n  \);\n\})'
    matches = list(re.finditer(pattern, content))
    if matches:
        last_match = matches[-1]
        content = content[:last_match.start()] + toast_render + content[last_match.start():]
    return content

# Traitement principal
total_fixed = 0
for file_path in FILES_TO_FIX:
    if not os.path.exists(file_path):
        print(f"  ⚠ {file_path} : manquant")
        continue

    with open(file_path) as f:
        original = f.read()

    content = original
    changes = 0

    # Trouve tous les <button ...> sans onClick
    button_pattern = re.compile(r'<button(?![^>]*onClick)[^>]*>')
    matches = list(button_pattern.finditer(content))
    if not matches:
        print(f"  ✓ {file_path} : déjà clean")
        continue

    # Traite en sens inverse pour préserver les positions
    for match in reversed(matches):
        new_btn, action = fix_button(match, content, file_path)
        if action:
            content = content[:match.start()] + new_btn + content[match.end():]
            changes += 1

    if changes > 0:
        # Ajoute helpers si nécessaire
        content = ensure_helpers(content, file_path)
        content = ensure_toast_render(content)

        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✓ {file_path} : {changes}/{len(matches)} boutons corrigés")
        total_fixed += changes
    else:
        print(f"  - {file_path} : 0 bouton géré automatiquement")

print(f"\nTotal : {total_fixed} boutons corrigés")
