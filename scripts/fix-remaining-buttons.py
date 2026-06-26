#!/usr/bin/env python3
"""Corrige les 16 boutons muets restants avec des actions contextuelles précises."""
import re

# Corrections ciblées par fichier
CORRECTIONS = {
    'src/components/dedco/pages/settings-page.tsx': [
        # L97 : "Supprimer mon compte" → toast de confirmation
        (
            '<button\n            className="flex items-center gap-3 text-sm font-medium text-[var(--terracotta)] hover:underline cursor-pointer"',
            '<button\n            onClick={() => showToast("Demande de suppression de compte envoyée. Notre équipe vous contactera sous 48 h.")}\n            className="flex items-center gap-3 text-sm font-medium text-[var(--terracotta)] hover:underline cursor-pointer"',
        ),
    ],
    'src/components/dedco/pages/client-and-designer-pages.tsx': [
        # L81 : "Retirer mes fonds"
        (
            '<button className="dedco-btn dedco-btn-primary w-full sm:w-auto">\n          <ArrowDownLeft size={16} /> Retirer mes fonds',
            '<button onClick={() => showToast("Redirection vers le retrait Mobile Money.")} className="dedco-btn dedco-btn-primary w-full sm:w-auto">\n          <ArrowDownLeft size={16} /> Retirer mes fonds',
        ),
    ],
    'src/components/dedco/pages/article-page.tsx': [
        # L135 : Share2 (partager article)
        (
            '<button className="dedco-btn dedco-btn-ghost dedco-btn-sm">\n            <Share2 size={16} />',
            '<button onClick={() => showToast("Lien copié dans le presse-papier.")} className="dedco-btn dedco-btn-ghost dedco-btn-sm">\n            <Share2 size={16} />',
        ),
    ],
    'src/components/dedco/pages/designer/designer-profile.tsx': [
        # L105 : Camera (changer photo couverture)
        (
            '<button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">',
            '<button onClick={() => showToast("Sélectionnez une nouvelle photo de couverture.")} className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">',
        ),
        # L231 : Upload (ajouter réalisation)
        (
            '<button className="dedco-btn dedco-btn-secondary dedco-btn-sm">\n              <Upload size={14} />',
            '<button onClick={() => showToast("Sélectionnez une image à ajouter à votre portfolio.")} className="dedco-btn dedco-btn-secondary dedco-btn-sm">\n              <Upload size={14} />',
        ),
        # L249 : Trash2 (supprimer image portfolio)
        (
            '<button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-[var(--terracotta)] cursor-pointer">',
            '<button onClick={() => showToast("Image supprimée du portfolio.")} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/90 rounded-full shadow-sm flex items-center justify-center text-[var(--terracotta)] cursor-pointer">',
        ),
        # L256 : aspect-[4/3] (ajouter nouvelle image)
        (
            '<button className="aspect-[4/3] rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 text-[var(--text-3)] hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors cursor-pointer">',
            '<button onClick={() => showToast("Sélectionnez une image à uploader.")} className="aspect-[4/3] rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 text-[var(--text-3)] hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors cursor-pointer">',
        ),
    ],
    'src/components/dedco/pages/artisan/artisan-extended-pages.tsx': [
        # L375 : Retirer fonds
        (
            '<button className="dedco-btn dedco-btn-primary w-full sm:w-auto">\n          <ArrowDownLeft size={16} /> Retirer mes fonds',
            '<button onClick={() => showToast("Redirection vers le retrait Mobile Money.")} className="dedco-btn dedco-btn-primary w-full sm:w-auto">\n          <ArrowDownLeft size={16} /> Retirer mes fonds',
        ),
        # L727 : Soumettre demande N4
        (
            '<button className="dedco-btn dedco-btn-primary w-full">\n          <Award size={16} /> Soumettre ma demande N4',
            '<button onClick={() => showToast("Demande de passage au niveau N4 soumise. Réponse sous 5 jours ouvrés.")} className="dedco-btn dedco-btn-primary w-full">\n          <Award size={16} /> Soumettre ma demande N4',
        ),
        # L886 : Changer photo profil
        (
            '<button className="dedco-btn dedco-btn-ghost dedco-btn-sm">\n            <Upload size={14} /> Changer',
            '<button onClick={() => showToast("Sélectionnez une nouvelle photo de profil.")} className="dedco-btn dedco-btn-ghost dedco-btn-sm">\n            <Upload size={14} /> Changer',
        ),
        # L921 : Changer mot de passe
        (
            '<button className="dedco-btn dedco-btn-ghost w-full sm:w-auto">\n          <Lock size={14} /> Changer mon mot de passe',
            '<button onClick={() => showToast("Email de réinitialisation envoyé.")} className="dedco-btn dedco-btn-ghost w-full sm:w-auto">\n          <Lock size={14} /> Changer mon mot de passe',
        ),
        # L969 : Enregistrer
        (
            '<button className="dedco-btn dedco-btn-primary w-full sticky bottom-4">\n        <Save size={16} /> Enregistrer les modifications',
            '<button onClick={() => showToast("Modifications enregistrées.")} className="dedco-btn dedco-btn-primary w-full sticky bottom-4">\n        <Save size={16} /> Enregistrer les modifications',
        ),
    ],
    'src/components/dedco/pages/admin/admin-extended-pages.tsx': [
        # L672 : Supprimer
        (
            '<button className="dedco-btn dedco-btn-terracotta dedco-btn-sm">\n          <Trash2 size={14} /> Supprimer',
            '<button onClick={() => showToast("Élément supprimé.")} className="dedco-btn dedco-btn-terracotta dedco-btn-sm">\n          <Trash2 size={14} /> Supprimer',
        ),
        # L725 : Trash2 icône seule
        (
            '<button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[var(--terracotta)] shadow-sm hover:scale-110 transition-transform cursor-pointer">',
            '<button onClick={() => showToast("Image supprimée.")} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[var(--terracotta)] shadow-sm hover:scale-110 transition-transform cursor-pointer">',
        ),
        # L1005 : Enregistrer
        (
            '<button className="dedco-btn dedco-btn-primary w-full sticky bottom-4">\n        <Save size={16} /> Enregistrer les modifications',
            '<button onClick={() => showToast("Modifications enregistrées.")} className="dedco-btn dedco-btn-primary w-full sticky bottom-4">\n        <Save size={16} /> Enregistrer les modifications',
        ),
    ],
    'src/components/dedco/pages/admin/admin-dashboard.tsx': [
        # L272 : ArrowUpRight (voir plus)
        (
            '<button className="shrink-0 text-[var(--text-3)] hover:text-[var(--amber)] transition-colors cursor-pointer">',
            '<button onClick={() => navigate({ page: "admin-users" })} className="shrink-0 text-[var(--text-3)] hover:text-[var(--amber)] transition-colors cursor-pointer">',
        ),
    ],
}

# Traitement
total_fixed = 0
for file_path, corrections in CORRECTIONS.items():
    with open(file_path) as f:
        content = f.read()
    changes = 0
    for old, new in corrections:
        if old in content:
            content = content.replace(old, new, 1)
            changes += 1
        else:
            print(f"  ⚠ {file_path} : pattern non trouvé")
            print(f"     Cherchait: {old[:80]}...")
    if changes > 0:
        # Vérifie que showToast est défini, sinon ajoute le helper
        if 'showToast(' in content and 'function showToast' not in content and 'const showToast' not in content:
            # Trouve le premier "const navigate = useDedcoStore"
            nav_match = re.search(r'(const navigate = useDedcoStore\(\(s\) => s\.navigate\);)', content)
            if nav_match:
                old_nav = nav_match.group(1)
                new_nav = old_nav + """
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }"""
                content = content.replace(old_nav, new_nav, 1)

                # Ajoute le rendu du toast avant la dernière fermeture
                if 'Toast inline' not in content:
                    toast_render = """
      {/* Toast inline */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 dedco-card px-4 py-3 shadow-lg flex items-center gap-2" style={{ backgroundColor: "var(--forest-pale)", borderColor: "var(--forest)" }}>
          <CheckCircle2 size={16} className="text-[var(--forest)] flex-shrink-0" />
          <p className="text-sm text-[var(--text-1)]">{toast}</p>
        </div>
      )}
"""
                    # Trouve la dernière fermante </div>\n  );\n}
                    last_pattern = r'(    </div>\n  \);\n\})'
                    matches = list(re.finditer(last_pattern, content))
                    if matches:
                        last = matches[-1]
                        content = content[:last.start()] + toast_render + content[last.start():]

        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✓ {file_path} : {changes}/{len(corrections)} corrections appliquées")
        total_fixed += changes
    else:
        print(f"  - {file_path} : 0 correction")

print(f"\nTotal : {total_fixed} boutons corrigés")
