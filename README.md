# Setup

reqs :
- php 8.5
- npm 10+
- node 22+

## backend

````
composer i
php artisan migrate
cp .env.example .env
php artisan key:generate
````
(sqlite as DB)

## frontend

````
npm i
````

# Launch local setup

## backend

````
php artisan serve
````
-> localhost:8000

## frontend

````
npm run dev
````
-> localhost:5173

# TODO : Instructions to test the upload and delete features
