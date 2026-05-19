#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/client"
SERVER_DIR="$SCRIPT_DIR/server"
FRONT_BUILD_DIR="$CLIENT_DIR/build"
STAGING_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "$STAGING_DIR"
}

trap cleanup EXIT

require_command() {
    local command_name="$1"

    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "Missing required command: $command_name" >&2
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
        config.php
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

read -r -p "Deploy target (rsync destination, e.g. user@host:/var/www/app): " DEPLOY_TARGET

if [[ -z "$DEPLOY_TARGET" ]]; then
    echo "Deploy target is required" >&2
    exit 1
fi

require_command npm
require_command rsync

echo "1/4 Building frontend..."
pushd "$CLIENT_DIR" >/dev/null
npm run build
rm -f "$FRONT_BUILD_DIR/index.html"
cp "$CLIENT_DIR/src/index.php" "$FRONT_BUILD_DIR/index.php"
popd >/dev/null

echo "2/4 Preparing deployment staging..."
rsync -a "$FRONT_BUILD_DIR/" "$STAGING_DIR/"
stage_backend

echo "3/4 Ensuring deploy destination exists..."
ensure_destination_exists "$DEPLOY_TARGET"

echo "4/4 Uploading files..."
rsync -az --delete "$STAGING_DIR/" "$DEPLOY_TARGET/"

echo "Deployment finished: $DEPLOY_TARGET"