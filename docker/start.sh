#!/usr/bin/env bash
set -e

cd /var/www/html

# Render injects $PORT (default 10000) - make Apache listen on it
PORT="${PORT:-10000}"
sed -ri "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Rebuild caches from the runtime environment variables
php artisan package:discover --ansi
php artisan config:clear
php artisan config:cache
php artisan view:cache

# Public storage symlink (ignore if it already exists)
php artisan storage:link || true

# Apply database migrations
php artisan migrate --force

# Seed the database once (set RUN_MIGRATE_SEED=true, then remove it)
if [ "${RUN_MIGRATE_SEED:-false}" = "true" ]; then
    php artisan db:seed --force
fi

echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
