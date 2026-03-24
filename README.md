# Nuxt + Laravel Monorepo on Laravel Cloud

This repository shows how to deploy a **Nuxt** frontend and a **Laravel** backend as a **single application on [Laravel Cloud](https://cloud.laravel.com/)**. Instead of hosting the SPA and API on separate services, the Nuxt app is statically generated at build time and served directly from Laravel's `public/` directory — one domain, one deployment, zero CORS headaches in production.

## Repository structure

| Directory | What it does |
|-----------|-------------|
| `frontend/` | Nuxt 4 SPA (Vue 3, client-side rendered). Generates static files via `bun run generate`. |
| `backend/` | Laravel 13 API (PHP 8.3+, Sanctum auth, queues, scheduler). Serves both the API and the built SPA. |

## How it works

The key insight is that **Laravel Cloud expects a single application at the repository root**, but a monorepo has two. The cloud build script bridges that gap.

### The build script (`sample_cloud_build.sh`)

This is the centerpiece of the deployment strategy. Laravel Cloud runs this script during the build phase, and it does the following:

```
1. Move both `backend/` and `frontend/` to a temporary directory
2. Clear the repo root of monorepo-level files (composer.json, .git, etc.)
3. Copy the backend into the repo root — so Laravel Cloud sees a normal Laravel app
4. Run `composer install` for production dependencies
5. Install bun, then `bun install` + `bun run generate` the Nuxt frontend
6. Copy the generated static files into Laravel's `public/` directory
7. Clean up the temporary directory
```

After this build completes, Laravel Cloud has a standard Laravel application where `/public` also contains the pre-built Nuxt SPA — no Node.js runtime needed at serve time.

```bash
# sample_cloud_build.sh (abbreviated)

# Stash both apps in /tmp so we can restructure the repo root
mkdir /tmp/monorepo
mv backend frontend /tmp/monorepo/

# Clear monorepo scaffolding
rm -rf composer.lock composer.json README.md .gitignore .git solo.yml

# Promote backend to the repo root (what Laravel Cloud expects)
cp -Rf /tmp/monorepo/backend/. .
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Build the Nuxt SPA as static files
npm i -g bun
cd /tmp/monorepo/frontend
bun install
bun run generate

# Drop the generated SPA into Laravel's public directory
cp -Rf .output/public/* /var/www/html/public/

rm -rf /tmp/monorepo
```

## Considerations and trade-offs

Several choices in both `frontend/` and `backend/` are deliberate to make this single-deployment model work.

### Frontend (`frontend/`)

- **`ssr: false` in `nuxt.config.ts`** — The frontend is configured as a client-side SPA, not server-rendered. This is required because there is no Node.js server running in production; Laravel serves the pre-built static files. `bun run generate` produces a fully static site.
- **`apiBase` runtime config is empty** — Because the SPA and API share the same domain in production, API calls use relative paths (`/api/...`). No need to hardcode a separate API host.
- **Vite dev proxy for `/api` and `/sanctum`** — During local development the Nuxt dev server (port 3000) proxies API requests to the Laravel backend (`https://backend.test`). This mimics the same-origin behavior you get for free in production.

### Backend (`backend/`)

- **SPA catch-all route in `routes/web.php`** — A wildcard route serves `public/index.html` for any request that doesn't match `/api/*` or `/sanctum/*`. This lets the Nuxt client-side router handle all page navigation.

  ```php
  Route::get('/{any?}', function () {
      return response(file_get_contents(public_path('index.html')))
          ->header('Content-Type', 'text/html');
  })->where('any', '^(?!api|sanctum).*$');
  ```

- **Sanctum for authentication** — The API uses Laravel Sanctum with both token-based auth (for API clients) and cookie/session auth (for the SPA). The stateful domains in `config/sanctum.php` are configured for local dev; in production the shared domain handles this naturally.
- **CORS configured for development only** — `config/cors.php` allows `localhost:3000` and `backend.test` with credentials. In production, CORS is a non-issue because everything is same-origin.

### Local development

This assumes you are using [Laravel Herd](https://herd.laravel.com) and linking and securing the backend folder to Herd.

- `herd link` - Links the folder to herd for serving at http://backend.test
- `herd secure` - Configures SSL for the folder to serve at https://backend.test

The repo includes a `solo.yml` config for [Solo](https://soloterm.com) that orchestrates three processes during development:

- `bun run dev` — Nuxt dev server with hot reload
- `php artisan schedule:work` — Laravel task scheduler
- `php artisan queue:work` — Laravel job queue

The Nuxt dev proxy forwards `/api` and `/sanctum` requests to the Laravel backend, so the development experience mirrors production routing.

## Getting started

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Frontend
cd frontend
bun install
bun run dev
```

## Intent

This is a **reference sample**, not a production-ready boilerplate. Use it as a starting point to understand the deployment pattern, then adapt the build script, routing, and auth configuration to your own application's needs.
