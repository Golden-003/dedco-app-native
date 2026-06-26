# Dedco — Guide de sauvegarde & restauration

> **Problème** : Le sandbox Z.ai se réinitialise périodiquement. Le code source et l'historique git locaux sont effacés, mais les dossiers `upload/` et `download/` survivent.

> **Solution** : GitHub est la source de vérité. On utilise 3 scripts pour synchroniser.

---

## 🚀 Démarrage rapide

### C'est ta première session ? (à faire une seule fois)

1. **Génère un PAT GitHub avec expiration 90 jours**
   - Va sur https://github.com/settings/tokens
   - Generate new token (classic)
   - Note : `Dedco sandbox`
   - Expiration : `90 days`
   - Scopes : coche uniquement `repo`
   - Generate → copie le token (format `ghp_xxxxxxxx...`)

2. **Crée le fichier `upload/.pat`**
   - Dans le dossier `/home/z/my-project/upload/`
   - Crée un fichier `.pat` (attention au point au début)
   - Colle JUSTE le token dedans, rien d'autre : `ghp_xxxxxxxx...`
   - Sauvegarde

3. **Restaure depuis GitHub**
   ```bash
   bash scripts/dedco-restore.sh
   ```
   → Le script va récupérer tout le code depuis GitHub, restaurer les fichiers, puis supprimer le PAT.

---

## 📋 En début de chaque session

### Vérifie l'état du workspace
```bash
bash scripts/dedco-status.sh
```

Le script te dit :
- Combien de commits locaux
- Quels fichiers critiques sont manquants
- Si le workspace a été reset
- Combien de zips de sauvegarde existent

### Si reset détecté → restaure
1. Colle ton PAT dans `upload/.pat` (si pas déjà fait)
2. Lance :
   ```bash
   bash scripts/dedco-restore.sh
   ```

---

## 💾 Pendant la session — Règle d'or

### Après chaque étape majeure, sauvegarde

```bash
bash scripts/dedco-save.sh "feat: ajoute machine d'états brief artisan"
```

Le script :
1. Vérifie le PAT dans `upload/.pat`
2. Ajoute tous les fichiers modifiés
3. Commit avec ton message
4. Pousse vers GitHub
5. Crée un zip de sauvegarde dans `upload/`
6. Supprime le PAT (sécurité)

**Exemples de moments où sauvegarder** :
- Après avoir corrigé des bugs
- Après avoir ajouté une fonctionnalité
- Avant une pause longue
- À la fin de la session
- Avant un changement risqué

---

## 🔄 Workflow type d'une session

```text
1. Arrivée → bash scripts/dedco-status.sh
              ↓
2. Reset détecté → colle PAT dans upload/.pat
              ↓
3. → bash scripts/dedco-restore.sh
              ↓
4. Travail sur le code...
              ↓
5. Étape majeure → bash scripts/dedco-save.sh "feat: ..."
              ↓
6. Continue à coder...
              ↓
7. Fin de session → bash scripts/dedco-save.sh "chore: fin session"
```

---

## 🛡️ Sécurité

### Le PAT

- ✅ Stocké dans `upload/.pat` (survit aux resets sandbox)
- ✅ Supprimé automatiquement après chaque save/restore
- ✅ Jamais envoyé dans le chat (sinon GitHub le révoque)
- ✅ Expiration 90 jours max
- ✅ Scope limité à `repo`

### Si tu soupçonnes une fuite

1. Va immédiatement sur https://github.com/settings/tokens
2. Supprime le token compromis
3. Génère un nouveau token
4. Mets-le dans `upload/.pat`

---

## 📦 Les 3 scripts

### `dedco-status.sh` — Diagnostic
- Vérifie l'état du workspace
- Détecte les resets
- Liste les fichiers manquants
- Affiche les zips disponibles

### `dedco-restore.sh` — Restauration
- Récupère le code depuis GitHub
- Restore les fichiers manquants
- Reset le git local à l'état de GitHub
- Supprime le PAT après usage

### `dedco-save.sh "message"` — Sauvegarde
- Commit + push vers GitHub
- Crée un zip de sauvegarde locale
- Nettoie les vieux zips (garde les 10 plus récents)
- Supprime le PAT après usage

---

## 🆘 En cas de problème

### "PAT non trouvé dans upload/.pat"
→ Crée le fichier `upload/.pat` avec ton token dedans

### "Le PAT ne commence pas par ghp_"
→ Le format est invalide. Le token doit commencer par `ghp_`

### "Authentication failed"
→ Le PAT a été révoqué ou a expiré. Génère un nouveau token.

### "Nothing to commit"
→ Aucun changement depuis le dernier save. C'est normal.

### Le workspace reset pendant que tu codes
→ Pas de panique. Tes changements sont dans `upload/dedco-*.zip`. Lance `dedco-restore.sh` puis reprends.

---

## 🎯 Règles d'or

1. **GitHub = source de vérité**. Le code local peut disparaître, GitHub reste.
2. **Save après chaque étape majeure**. Ne pas attendre la fin de session.
3. **PAT dans `upload/.pat`**, jamais dans le chat.
4. **Status en début de session** pour détecter les resets.
5. **Messages de commit clairs** : `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

---

## 📊 État actuel du repo

- **Repo** : https://github.com/Golden-003/Dedco
- **Branche** : `main`
- **Dernier commit** : voir `git log --oneline -1`
- **Fichiers trackés** : 339+
- **Backups locaux** : `upload/dedco-*.zip` (10 plus récents conservés)
