# syntax=docker/dockerfile:1

########################################
# Stage 1 - Build React / Inertia (Vite) assets
########################################
FROM node:22-bookworm-slim AS assets

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build


########################################
# Stage 2 - Install PHP (Composer) dependencies
########################################
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --no-scripts \
        --prefer-dist \
        --optimize-autoloader


########################################
# Stage 3 - Runtime (Apache + PHP 8.3)
########################################
FROM php:8.3-apache

# System libraries + PHP extensions (PostgreSQL, bcmath, opcache) and mod_rewrite
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql bcmath opcache \
    && a2enmod rewrite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Serve directly from Laravel's /public and allow .htaccess rewrites
RUN sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's!<Directory /var/www/>!<Directory /var/www/html/public>!g' /etc/apache2/apache2.conf \
    && sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

WORKDIR /var/www/html

# Application code
COPY . .

# Dependencies and compiled assets produced by the previous stages
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

# Entrypoint: warm caches, run migrations, then start Apache
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Render routes traffic to the port in $PORT (default 10000)
EXPOSE 10000

CMD ["/usr/local/bin/start.sh"]
