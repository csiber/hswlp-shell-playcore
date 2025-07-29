#!/bin/bash

ENV_FILE=".env"
WORKER_NAME="hswlp-next"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env file not found"
  exit 1
fi

echo "📦 Loading secrets from $ENV_FILE"

while IFS= read -r line || [ -n "$line" ]; do
  if [[ -z "$line" || "$line" == \#* ]]; then
    continue
  fi

  key=$(echo "$line" | cut -d '=' -f1)
  value=$(echo "$line" | cut -d '=' -f2-)

  echo "🔐 Setting secret: $key"
  echo "$value" | wrangler secret put "$key" --name "$WORKER_NAME"
done < "$ENV_FILE"

echo "✅ All secrets uploaded."
echo "🚀 Deploying worker: $WORKER_NAME"