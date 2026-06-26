#!/usr/bin/env python3
"""
Corrige tous les boutons muets en injectant un onClick contextuel.
Stratégie :
- Bouton "Ouvrir un litige" → navigate({ page: "litige", id: ... })
- Bouton "Contacter" / "MessageSquare" → navigate({ page: "messages", conversationId: ... })
- Bouton "Télécharger" / "Download" → showToast() ou alert
- Bouton "Annuler" / "X" → action locale ou goBack
- Boutons génériques → navigate vers page pertinente ou toast

Pour chaque fichier, on vérifie si `navigate` et/ou `useState` sont disponibles.
"""
import re
import os

# Mapping heuristique : pattern dans le bouton → action
def get_action_for_button(btn_full: str, file_context: str, file_path: str) -> str:
    """
    Retourne le code onClick à injecter, ou None si non gérable heuristiquement.
    """
    # Cas 1 : "Ouvrir un litige" → page litige
    if 'terracotta' in btn_full and ('AlertTriangle' in file_context or 'litige' in file_context.lower()):
        return 'onClick={() => navigate({ page: "litige", id: `REC-${projectId}` })}'

    # Cas 2 : Télécharger (icône Download)
    if 'Download' in file_context or 'Télécharger' in file_context:
        return 'onClick={() => showToast("Téléchargement démarré.")}'

    # Cas 3 : Contacter (MessageSquare)
    if 'MessageSquare' in file_context or 'Contacter' in file_context:
        return 'onClick={() => navigate({ page: "messages", conversationId: `proj-${projectId}` })}'

    # Cas 4 : Send (envoyer message) → on désactive le bouton ou on ajoute une action placeholder
    if 'Send' in file_context:
        return 'onClick={() => showToast("Message envoyé.")}'

    return None

# Pour simplifier, on va traiter manuellement chaque fichier en particulier
# Ce script est juste un placeholder pour la documentation

print("Script de correction des boutons muets")
print("Utilisation : corrections manuelles par fichier")
