# Nuxt + Laravel (sample monorepo)

This repository is a **reference sample** for running a **Nuxt** frontend and a **Laravel** backend together. The goal is to show how you can **deploy both apps to a single environment on [Laravel Cloud](https://cloud.laravel.com/)**—one managed stack instead of splitting the frontend and API across separate hosts.

## What’s here

| Directory   | Role |
|------------|------|
| `frontend` | Nuxt application (Vue, SSR/SPA as you configure it). |
| `backend`  | Laravel API and server-side application (PHP, Artisan, queues, etc.). |

Together they illustrate the split you often want in production: a JavaScript UI served or built separately from the Laravel app, while still fitting the deployment model Laravel Cloud is designed around.

## Intent

Use this repo as a **starting point or teaching aid** when you need to:

- Document or reproduce a **Nuxt × Laravel** setup for your team.
- Prove out **one-environment hosting** on Laravel Cloud (build steps, document root, environment variables, and how the two codebases relate).

It is not meant to prescribe a single “correct” architecture for every product; it is a **minimal, clear example** of the pairing and deployment story.
