---
# Human-Skill-Tree-ej3v
title: Dockerize the app
status: completed
type: task
priority: normal
created_at: 2026-02-27T04:42:03Z
updated_at: 2026-02-27T04:43:00Z
---

Dockerized the app with nginx:alpine serving static files on port 3123.

## Files Added
- `Dockerfile` — nginx:alpine, copies index.html + static/ + nginx.conf
- `nginx.conf` — listens on 3123, serves static files
- `docker-compose.yml` — single service, port 3123:3123, restart unless-stopped
- `.dockerignore` — excludes .venv, .git, .beans, docs, python files

## Usage
- `docker compose up -d --build` — build and run
- App at http://localhost:3123