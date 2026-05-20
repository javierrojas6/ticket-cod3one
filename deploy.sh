#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/client"
SERVER_DIR="$SCRIPT_DIR/server"
FRONT_BUILD_DIR="$CLIENT_DIR/build"
STAGING_DIR="$(mktemp -d)"

# Default deploy target (override with first argument)
DEPLOY_TARGET="${1:-/var/www/opensupports}"
WEB_USER="${2:-www-data}"

cleanup() {
    rm -rf "$STAGING_DIR"
}

trap cleanup EXIT

require_command() {
    local command_name="$1"

    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "ERROR: Missing required command: $command_name" >&2
        exit 1
    fi
}

ensure_destination_exists() {
    local destination="$1"

    if [[ "$destination" == *:* && "$destination" != /* ]]; then
        local remote_host="${destination%%:*}"
        local remote_path="${destination#*:}"

        ssh "$remote_host" "mkdir -p '$remote_path'"
        return
    fi

    mkdir -p "$destination"
}

stage_backend() {
    local backend_stage_dir="$STAGING_DIR/api"
    local server_items=(
        index.php
        .htaccess
        composer.json
        composer.lock
        controllers
        data
        libs
        models
        vendor
        files
    )

    mkdir -p "$backend_stage_dir"

    for item in "${server_items[@]}"; do
        if [[ -e "$SERVER_DIR/$item" ]]; then
            rsync -a "$SERVER_DIR/$item" "$backend_stage_dir/"
        fi
    done
}

require_command npm
require_command rsync

echo "Deploy target: $DEPLOY_TARGET"
echo ""

echo "1/5 Building frontend..."
pushd "$CLIENT_DIR" >/dev/null
npm run build
rm -f "$FRONT_BUILD_DIR/index.html"
cp "$CLIENT_DIR/src/index.php" "$FRONT_BUILD_DIR/index.php"
popd >/dev/null

echo "2/5 Preparing deployment staging..."
rsync -a "$FRONT_BUILD_DIR/" "$STAGING_DIR/"
stage_backend

echo "    Staged files:"
echo "    - Frontend: $(find "$STAGING_DIR" -maxdepth 1 -type f | wc -l) files"
echo "    - Backend:  $(find "$STAGING_DIR/api" -type f | wc -l) files"

echo "3/5 Ensuring deploy destination exists..."
ensure_destination_exists "$DEPLOY_TARGET"

echo "4/5 Uploading files..."
rsync -avz --checksum --delete \
    --exclude="config.php" \
    --exclude="config.php.bak" \
    --exclude="api/files/*" \
    "$STAGING_DIR/" "$DEPLOY_TARGET/"

echo "5/5 Fixing permissions..."
if [[ "$DEPLOY_TARGET" != *:* ]]; then
    chown -R "$WEB_USER:$WEB_USER" "$DEPLOY_TARGET"
    chmod 664 "$DEPLOY_TARGET/api/config.php" 2>/dev/null || true
    chmod -R 775 "$DEPLOY_TARGET/api/files" 2>/dev/null || true
fi

echo ""
echo "Deployment finished: $DEPLOY_TARGET"
SCRIPT
chmod +x /app/cod3one/support/deploy.sh