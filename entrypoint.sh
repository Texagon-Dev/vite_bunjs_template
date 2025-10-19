#!/bin/sh
set -e
ENV_FILE="/usr/share/nginx/html/env.config.js"

{
  echo "window.__ENV__ = window.__ENV__ || {};"
  env | grep '^APP_' | while IFS='=' read -r key value; do
    esc=$(printf %s "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')
    echo "window.__ENV__[\"$key\"] = \"$esc\";"
  done
} > "$ENV_FILE"

exec "$@"
