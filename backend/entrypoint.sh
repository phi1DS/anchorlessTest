#!/bin/bash

# Clear cache manually if artisan fails
rm -f bootstrap/cache/*.php

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Run migrations
php artisan migrate --force

# Generate key if not set
php artisan key:generate --no-interaction

# Link storage
php artisan storage:link

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000
