#!/usr/bin/env bash
# ============================================================
# DEDCO — Diagnostic de l'état du workspace
# À lancer pour vérifier si le sandbox a été reset
# ============================================================

cd /home/z/my-project

echo "=== Dedco Status ==="
echo ""

# 1. État git
echo "📁 Git :"
git log --oneline -5 2>&1 | head -5
LOCAL_COMMITS=$(git log --oneline 2>/dev/null | wc -l)
echo "Commits locaux : $LOCAL_COMMITS"
echo ""

# 2. Fichiers critiques
echo "📂 Fichiers critiques :"
CRITICAL_FILES=(
  "src/components/dedco/pages/mes-projets-page.tsx"
  "src/components/dedco/pages/projet-artisan-detail.tsx"
  "src/components/dedco/pages/projet-designer-detail.tsx"
  "src/components/dedco/pages/projet-paiement-artisan.tsx"
  "src/lib/mes-projets-data.ts"
  "src/lib/dedco-status.tsx"
  "README.md"
  "LICENSE"
  "CONTRIBUTING.md"
  ".github/PULL_REQUEST_TEMPLATE.md"
)
MISSING=0
for f in "${CRITICAL_FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "  ✅ $f"
  else
    echo "  ❌ $f (manquant !)"
    MISSING=$((MISSING + 1))
  fi
done
echo ""

# 3. .gitignore
echo "🔒 .gitignore :"
if grep -q "/upload/" .gitignore 2>/dev/null; then
  echo "  ✅ upload/ protégé"
else
  echo "  ⚠️  upload/ NON protégé dans .gitignore (workspace reset ?)"
fi
echo ""

# 4. Zips de sauvegarde
echo "📦 Zips de sauvegarde :"
echo "  upload/ : $(ls upload/dedco-*.zip 2>/dev/null | wc -l) zip(s)"
ls -t upload/dedco-*.zip 2>/dev/null | head -3 | while read z; do
  echo "    - $(basename $z) ($(du -h "$z" | cut -f1))"
done
echo "  download/ : $(ls download/dedco-*.zip 2>/dev/null | wc -l) zip(s)"
echo ""

# 5. Build
echo "🏗️  Build :"
if [ -d "node_modules" ]; then
  echo "  ✅ node_modules présent"
else
  echo "  ❌ node_modules manquant — lance 'npm install'"
fi
echo ""

# 6. Diagnostic
echo "=== Diagnostic ==="
if [ "$MISSING" -gt 0 ] || [ "$LOCAL_COMMITS" -lt 5 ]; then
  echo "🚨 WORKSPACE RESET DÉTECTÉ"
  echo "   Fichiers manquants : $MISSING"
  echo "   Commits locaux : $LOCAL_COMMITS (attendu : 8+)"
  echo ""
  echo "→ Pour restaurer :"
  echo "   1. Colle ton PAT GitHub dans upload/.pat"
  echo "   2. Lance : bash scripts/dedco-restore.sh"
else
  echo "✅ Workspace OK"
fi
