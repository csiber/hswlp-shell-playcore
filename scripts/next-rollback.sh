#!/bin/bash

echo "🕰️  Yumekaira / Next rollback script"
echo "-------------------------------"
read -p "Add meg a commit hash-t vagy relatív pozíciót (pl. HEAD~1): " rollback_point

# Ellenőrizzük, hogy van-e ilyen commit
if ! git cat-file -e "${rollback_point}^{commit}" 2>/dev/null; then
  echo "❌ Hibás commit: nem található. Ellenőrizd a hash-t vagy pozíciót."
  exit 1
fi

echo "⚠️  A 'main' branch visszaáll erre: $rollback_point"
read -p "Biztosan folytatod? [y/N]: " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "⛔ Megszakítva."
  exit 0
fi

# Visszaállás
git reset --hard "$rollback_point"

# Újra létrehozzuk a 'main' branchet
git checkout -B main

# Force push
git push origin main --force

echo "✅ Rollback kész: main → $rollback_point"
