#!/usr/bin/env bash
# ============================================================
# DEDCO — Restauration depuis GitHub
# À lancer au début de chaque session (ou après un reset sandbox)
# ============================================================
#
# Usage :
#   1. Colle ton PAT GitHub dans upload/.pat (juste le token ghp_xxx)
#   2. Lance : bash scripts/dedco-restore.sh
#
# Le script :
#   - Vérifie que le PAT est présent
#   - Fetch le contenu du repo GitHub
#   - Restaure src/ et les fichiers de config
#   - Supprime le PAT après usage (sécurité)
# ============================================================

set -e

REPO="Golden-003/Dedco"
PAT_FILE="upload/.pat"

cd /home/z/my-project

echo "=== Dedco Restore ==="
echo ""

# 1. Vérifier le PAT
if [ ! -f "$PAT_FILE" ]; then
  echo "❌ PAT non trouvé dans $PAT_FILE"
  echo ""
  echo "Fais ceci d'abord :"
  echo "  1. Va sur https://github.com/settings/tokens"
  echo "  2. Génère un token (classic) avec scope 'repo', expiration 90 jours"
  echo "  3. Crée le fichier upload/.pat avec juste le token dedans (format ghp_xxx)"
  echo "  4. Relance ce script"
  exit 1
fi

PAT=$(cat "$PAT_FILE" | tr -d '[:space:]')

if [ -z "$PAT" ]; then
  echo "❌ Le fichier $PAT_FILE est vide"
  exit 1
fi

if [[ ! "$PAT" == ghp_* ]]; then
  echo "❌ Le PAT ne commence pas par ghp_ — format invalide"
  exit 1
fi

echo "✅ PAT trouvé"

# 2. Vérifier l'état du workspace
LOCAL_COMMITS=$(git log --oneline 2>/dev/null | wc -l)
echo "ℹ️  Commits locaux : $LOCAL_COMMITS"

# 3. Ajouter le remote si absent
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "ℹ️  Ajout du remote origin..."
  git remote add origin "https://github.com/$REPO.git"
fi

# 4. Fetch depuis GitHub
echo "📥 Récupération depuis GitHub..."
git fetch "https://Golden-003:${PAT}@github.com/${REPO}.git" main 2>&1 | sed "s/${PAT}/****PAT****/g"

# 5. Vérifier ce qui diffère
REMOTE_COMMITS=$(git log --oneline FETCH_HEAD 2>/dev/null | wc -l)
echo "ℹ️  Commits sur GitHub : $REMOTE_COMMITS"

if [ "$LOCAL_COMMITS" -lt "$REMOTE_COMMITS" ]; then
  echo ""
  echo "⚠️  Workspace reset détecté : $LOCAL_COMMITS commits locaux vs $REMOTE_COMMITS sur GitHub"
  echo "🔄 Restauration en cours..."

  # Reset hard vers le remote (écrase l'état local)
  git reset --hard FETCH_HEAD 2>&1 | tail -5

  echo ""
  echo "✅ Restauration terminée"
  echo "ℹ️  $REMOTE_COMMITS commits restaurés"
else
  echo "✅ Workspace à jour (ou en avance sur GitHub)"
fi

# 6. Vérification
echo ""
echo "=== État final ==="
git log --oneline -5 2>&1
echo ""
echo "Fichiers src/ : $(find src -name '*.tsx' -o -name '*.ts' 2>/dev/null | wc -l)"

# 7. Supprimer le PAT (sécurité)
rm -f "$PAT_FILE"
echo ""
echo "🔐 PAT supprimé de $PAT_FILE (sécurité)"

echo ""
echo "=== Restore terminé ==="
