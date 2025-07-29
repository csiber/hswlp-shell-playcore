#!/bin/bash

set -e

# Keresés a wrangler.toml fájlban
OLD_BINDING=$(grep -A 1 'r2_buckets' wrangler.toml | grep binding | head -n1 | cut -d'"' -f4)

if [[ -z "$OLD_BINDING" ]]; then
  echo "❌ Nem található R2 binding a wrangler.toml fájlban."
  exit 1
fi

echo "📦 Jelenlegi R2 binding neve: $OLD_BINDING"
read -p "🔁 Új binding neve: " NEW_BINDING

if [[ -z "$NEW_BINDING" ]]; then
  echo "❌ Nem adtál meg új nevet."
  exit 1
fi

echo "🔍 Keresés és csere indul... ($OLD_BINDING → $NEW_BINDING)"

# Rekurzív csere minden releváns fájlban
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.toml" \) \
  -exec sed -i "s/${OLD_BINDING}/${NEW_BINDING}/g" {} +

echo "✅ Kész: mindenhol lecserélve ${OLD_BINDING} → ${NEW_BINDING}"
