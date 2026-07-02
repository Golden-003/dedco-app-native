#!/usr/bin/env python3
"""
Configure les branch protection rules sur main du repo Dedco.
Utilise le PAT fourni (à révoquer après usage).
"""
import json
import urllib.request
import urllib.error

REPO = "Golden-003/Dedco"
BRANCH = "main"
PAT = "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"

url = f"https://api.github.com/repos/{REPO}/branches/{BRANCH}/protection"

# Configuration complète de protection
config = {
    "required_status_checks": {
        "strict": True,                    # Require branches to be up to date before merging
        "contexts": []                     # Pas de CI obligatoire pour l'instant (ajouter plus tard)
    },
    "enforce_admins": True,                # Même les admins respectent les règles
    "required_pull_request_reviews": {
        "required_approving_review_count": 1,  # Au moins 1 review avant merge
        "dismiss_stale_reviews": True,         # Reviews annulées si nouveau commit
        "require_code_owner_reviews": False,   # Pas encore de CODEOWNERS
        "require_last_push_approval": False,
        "dismissal_restrictions": {
            "users": [],
            "teams": []
        }
    },
    "restrictions": None,                  # Pas de restriction par utilisateur/équipe
    "required_linear_history": True,       # Pas de merge commit, que rebase/squash
    "allow_force_pushes": False,           # Pas de force push
    "allow_deletions": False,              # Pas de suppression de branche
    "block_creations": False,
    "required_conversation_resolution": True,  # Conversations doivent être résolues avant merge
}

data = json.dumps(config).encode("utf-8")
req = urllib.request.Request(
    url,
    data=data,
    method="PUT",
    headers={
        "Authorization": f"token {PAT}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
    },
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        status = resp.status
        body = resp.read().decode("utf-8")
        print(f"OK {status}")
        print(f"Branch protection configurée sur {REPO}:{BRANCH}")
        # Résumé
        result = json.loads(body) if body else {}
        print("\nRésumé :")
        print(f"  - Reviews requises : {result.get('required_pull_request_reviews', {}).get('required_approving_review_count', 'N/A')}")
        print(f"  - Admins soumis : {result.get('enforce_admins', {}).get('enabled', 'N/A')}")
        print(f"  - Force push bloqué : {not result.get('allow_force_pushes', {}).get('enabled', True)}")
        print(f"  - Historique linéaire : {result.get('required_linear_history', {}).get('enabled', 'N/A')}")
        print(f"  - Conversations à résoudre : {result.get('required_conversation_resolution', {}).get('enabled', 'N/A')}")
except urllib.error.HTTPError as e:
    print(f"ERREUR HTTP {e.code}")
    body = e.read().decode("utf-8")
    print(body)
    if e.code == 403:
        print("\n→ Le PAT n'a probablement pas le scope 'repo' ou le repo n'est pas accessible.")
    elif e.code == 404:
        print("\n→ Le repo ou la branche n'existe pas encore.")
    elif e.code == 422:
        print("\n→ La branche main doit exister avant de configurer la protection.")
except Exception as e:
    print(f"ERREUR : {e}")
