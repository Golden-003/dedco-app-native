#!/usr/bin/env bash
# ============================================================
# DEDCO — Sauvegarde vers GitHub
# À lancer après chaque étape majeure
# ============================================================
#
# Usage :
#   1. Colle ton PAT GitHub dans upload/.pat (juste le token ghp_xxx)
#   2. Lance : bash scripts/dedco-save.sh "message du commit"
#
# Le script :
#   - Vérifie que le PAT est présent
#   - Ajoute tous les fichiers modifiés
#   - Commit avec le message fourni
#   - Pousse vers GitHub
#   - Crée un zip de sauvegarde locale dans upload/
#   - Supprime le PAT après usage (sécurité)
# ============================================================

set -e

REPO="Golden-003/Dedco"
PAT_FILE="upload/.pat"
COMMIT_MSG="${1:-chore: sauvegarde automatique}"

cd /home/z/my-project

echo "=== Dedco Save ==="
echo ""

# 1. Vérifier le PAT
if [ ! -f "$PAT_FILE" ]; then
  echo "❌ PAT non trouvé dans $PAT_FILE"
  echo ""
  echo "Fais ceci d'abord :"
  echo "  1. Va sur https://github.com/settings/tokens"
  echo "  2. Génère un token (classic) avec scope 'repo', expiration 90 jours"
  echo "  3. Crée le fichier upload/.pat avec juste le token dedans (format ghp_xxx)"
  echo "  4. Relance : bash scripts/dedco-save.sh \"ton message\""
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

# 2. Ajouter le remote si absent
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "ℹ️  Ajout du remote origin..."
  git remote add origin "https://github.com/$REPO.git"
fi

# 3. Vérifier s'il y a des changements
echo "📋 Vérification des changements..."
git add -A 2>&1 | tail -3

if git diff --cached --quiet; then
  echo "ℹ️  Aucun changement à sauvegarder"
else
  # 4. Commit
  echo "💾 Commit : $COMMIT_MSG"
  git commit -m "$COMMIT_MSG" 2>&1 | tail -3

  # 5. Push
  echo "📤 Push vers GitHub..."
  git push "https://Golden-003:${PAT}@github.com/${REPO}.git" main 2>&1 | sed "s/${PAT}/****PAT****/g" | tail -3

  echo "✅ Push réussi"
fi

# 6. Zip de sauvegarde locale (double sécurité)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ZIP_NAME="dedco-${TIMESTAMP}.zip"
echo "📦 Création du zip de sauvegarde : upload/${ZIP_NAME}"
zip -rq "upload/${ZIP_NAME}" src/ public/ package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs components.json prisma/ -x "node_modules/*" ".next/*" 2>&1 | tail -2

# Nettoyer les zips vieux de plus de 10 (garder les 10 plus récents)
ls -t upload/dedco-*.zip 2>/dev/null | tail -n +11 | xargs -r rm -f
echo "ℹ️  Zips conservés : $(ls upload/dedco-*.zip 2>/dev/null | wc -l)"

# 7. Supprimer le PAT (sécurité)
rm -f "$PAT_FILE"
echo "🔐 PAT supprimé de $PAT_FILE (sécurité)"

echo ""
echo "=== Save terminé ==="
echo "GitHub : https://github.com/$REPO"
echo "Zip local : upload/${ZIP_NAME}"
