#!/usr/bin/env bash
# ============================================================
#  db.sh — Corre SQL en Supabase desde la terminal (sin navegador)
#  Uso:
#    ./scripts/db.sh "select * from public.events;"
#    ./scripts/db.sh "$(cat migracion.sql)"
#  Lee SUPABASE_ACCESS_TOKEN y SUPABASE_PROJECT_REF de .env.local.
#  Maneja acentos y comillas correctamente (JSON vía python).
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env.local; set +a

if [ $# -lt 1 ]; then
  echo "Uso: ./scripts/db.sh \"<consulta SQL>\""; exit 1
fi

BODY=$(python3 -c 'import json,sys; print(json.dumps({"query": sys.argv[1]}))' "$1")

curl -s -X POST "https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$BODY"
echo
