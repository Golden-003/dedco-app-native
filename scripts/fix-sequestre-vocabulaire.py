#!/usr/bin/env python3
"""
Remplace toutes les mentions de 'séquestre' / 'escrow' par le vocabulaire Fedapay.
Conserve le sens (paiement sécurisé) mais supprime l'idée que DEDCO détient les fonds.
"""
import re
import os

# Mapping de remplacement (ordre important : les plus longs d'abord)
REPLACEMENTS = [
    # Phrases complètes
    ("Paiement séquestré", "Paiement sécurisé"),
    ("paiement séquestré", "paiement sécurisé"),
    ("Paiement séquestré via Fedapay", "Paiement sécurisé via Fedapay"),
    ("paiement séquestré via Fedapay", "paiement sécurisé via Fedapay"),
    ("Séquestré via Fedapay", "Sécurisé via Fedapay"),
    ("séquestré via Fedapay", "sécurisé via Fedapay"),
    ("Paiement séquestre", "Paiement sécurisé"),
    ("paiement séquestre", "paiement sécurisé"),
    ("système de paiement séquestré Fedapay", "paiement sécurisé Fedapay"),
    ("Paiement sécurisé via séquestre", "Paiement sécurisé via Fedapay"),
    ("paiement sécurisé via séquestre", "paiement sécurisé via Fedapay"),
    ("Paiement sécurisé par séquestre", "Paiement sécurisé via Fedapay"),
    ("paiement sécurisé par séquestre", "paiement sécurisé via Fedapay"),
    ("sécurisé par séquestre", "sécurisé via Fedapay"),
    ("Séquestre", "Fedapay"),
    ("séquestre", "Fedapay"),
    ("séquestré", "sécurisé"),
    ("séquestrés", "sécurisés"),
    ("Séquestré", "Sécurisé"),
    ("escrow", "Fedapay"),
    ("Escrow", "Fedapay"),
    
    # Cas spécifiques (à corriger manuellement après)
    ("Paiement sécurisé Fedapay Fedapay", "Paiement sécurisé Fedapay"),  # double Fedapay
    ("via Fedapay Fedapay", "via Fedapay"),
    ("Fedapay Mobile Money · Fedapay", "Fedapay Mobile Money"),
    ("Fedapay, livraison 3 temps", "Fedapay, livraison sécurisée"),
    ("livraison 3 temps photo", "livraison avec confirmation"),
    ("livraison 3 temps", "livraison sécurisée"),
    ("Paiement sécurisé. L'artisan démarre la fabrication.", "Paiement sécurisé via Fedapay. L'artisan démarre la fabrication."),
    ("Paiement sécurisé. L'artisan est payé uniquement après votre validation.", "Paiement sécurisé via Fedapay. L'artisan est payé après validation de la livraison."),
    ("Le Fedapay protège votre paiement pendant la résolution.", "Fedapay protège votre paiement pendant la résolution."),
    ("Comment fonctionne le paiement sécurisé Fedapay ?", "Comment fonctionne le paiement sécurisé ?"),
    ("Paiement via Fedapay, livrables PDF.", "Paiement sécurisé via Fedapay, livrables PDF."),
    ("3 temps photo", "confirmation photo"),
]

# Fichiers à traiter
FILES = [
    'src/components/dedco/product-page.tsx',
    'src/components/dedco/marketplace-page.tsx',
    'src/components/dedco/cart-search.tsx',
    'src/components/dedco/brief-page.tsx',
    'src/components/dedco/pages/about-page.tsx',
    'src/components/dedco/pages/order-pages.tsx',
    'src/components/dedco/pages/artisan/artisan-brief-workflow.tsx',
    'src/components/dedco/pages/onboarding-page.tsx',
    'src/components/dedco/pages/become-artisan-page.tsx',
    'src/components/dedco/pages/help-center-page.tsx',
    'src/components/dedco/home-page.tsx',
    'src/components/dedco/pages/mes-projets-page.tsx',
    'src/components/dedco/pages/brief-artisan-detail.tsx',
    'src/components/dedco/pages/projet-paiement-artisan.tsx',
    'src/components/dedco/pages/projet-artisan-detail.tsx',
    'src/components/dedco/pages/projet-designer-detail.tsx',
    'src/components/dedco/pages/artisan/artisan-extended-pages.tsx',
    'src/components/dedco/pages/designer-workflow-pages.tsx',
    'src/components/dedco/pages/client-and-designer-pages.tsx',
]

total_changes = 0
for f in FILES:
    if not os.path.exists(f):
        continue
    with open(f) as fh:
        original = fh.read()
    
    content = original
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    
    # Corrections spécifiques post-remplacement
    # "Paiement confirmé (séquestre)" → "Paiement confirmé"
    content = content.replace("Paiement confirmé (Fedapay)", "Paiement confirmé")
    content = content.replace("Paiement confirmé (sécurisé)", "Paiement confirmé")
    
    # "Le paiement est sécurisé jusqu'à validation de la livraison." → OK
    # "Paiement sécurisé. Artisan payé après validation T3." → "Paiement sécurisé. Artisan payé après validation de la livraison."
    content = content.replace("Artisan payé après validation T3.", "Artisan payé après validation de la livraison.")
    content = content.replace("T1 (photo produit prêt) → T2 (photo transit) → T3 (photo remise) → Validation → Paiement libéré", "Fabrication → Livraison → Validation → Paiement libéré")
    
    # "Paiement sécurisé Fedapay Mobile Money · Fedapay" → "Paiement sécurisé · Fedapay Mobile Money"
    content = content.replace("Paiement sécurisé · Fedapay Mobile Money · Fedapay", "Paiement sécurisé · Fedapay Mobile Money")
    
    # "Votre paiement est sécurisé. L'artisan démarre la fabrication." (déjà OK)
    # "votre paiement est bloqué jusqu'à confirmation" → "votre paiement est sécurisé jusqu'à confirmation"
    content = content.replace("votre paiement est bloqué", "votre paiement est sécurisé")
    content = content.replace("Votre paiement est bloqué", "Votre paiement est sécurisé")
    
    # "Le Fedapay protège" → "Fedapay protège"
    content = content.replace("Le Fedapay protège", "Fedapay protège")
    
    if content != original:
        changes = sum(1 for a, b in zip(original.split('\n'), content.split('\n')) if a != b)
        with open(f, 'w') as fh:
            fh.write(content)
        print(f"  ✓ {f}: ~{changes} ligne(s) modifiée(s)")
        total_changes += changes
    else:
        print(f"  - {f}: aucun changement")

print(f"\nTotal: ~{total_changes} lignes modifiées")

# Vérification finale
print("\n=== Vérification ===")
import subprocess
result = subprocess.run(['grep', '-rn', 'séquestre\|escrow\|Séquestre\|Escrow', 'src/', '--include=*.tsx', '--include=*.ts'], 
                       capture_output=True, text=True)
remaining = [l for l in result.stdout.split('\n') if l and 'node_modules' not in l]
print(f"Occurrences restantes: {len(remaining)}")
for l in remaining[:5]:
    print(f"  {l}")
