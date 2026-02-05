---
title: "OctoFlow Phase 1: Backend Stabilization"
status: active
created: 2026-02-05T12:00:00Z
updated: 2026-02-05T12:00:00Z
---

# OctoFlow Phase 1: Backend Stabilization

## Overview

Transition OctoFlow from a frontend-only prototype (localStorage + mock auth) to a
production-ready app with real authentication, PostgreSQL persistence, and multi-project support.

## Current State

- Frontend: React 19 + TypeScript + React Flow + Zustand + Tailwind + Radix UI
- Canvas works with 80+ wireframe block types, chat, tasks, VFP fields
- Backend: Express skeleton — `routes.ts` is empty, `storage.ts` has MemStorage only
- Auth: Mock (Login/Register pages with setTimeout, no API calls)
- Data: All in localStorage under key `octoflow-storage`
- Database: PostgreSQL with Drizzle ORM, only `users` table (id, username, password)
- Packages installed but unconfigured: passport, passport-local, express-session, connect-pg-simple

## Goals

1. **Backend Auth** — Passport.js local strategy + bcrypt + PostgreSQL sessions
2. **Projects CRUD API** — Store project canvas data in JSONB column
3. **Server-side Storage** — Replace localStorage with API calls
4. **Multi-project Support** — Project list + per-project routes

## Deliverables

### 1. Backend Auth
- Add `email`, `name` fields to users table
- Install bcryptjs, hash passwords
- Configure Passport local strategy
- PostgreSQL session store (connect-pg-simple)
- Routes: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Auth middleware for protected routes

### 2. Projects CRUD
- Add `projects` table: id, userId, name, description, canvasData (JSONB), createdAt, updatedAt
- Routes: GET /api/projects, GET /api/projects/:id, POST /api/projects, PUT /api/projects/:id, DELETE /api/projects/:id
- canvasData stores: { nodes, edges }

### 3. Server-side Storage
- Create `useAuth` hook with React Query
- Create `useProject` hook for loading/saving
- Auto-save with debounce on canvas changes
- Remove localStorage persistence from Zustand

### 4. Multi-project Support
- Project list page at `/projects`
- Project editor at `/project/:id`
- Create/delete projects
- Protected routes (redirect to /login if not authenticated)

## Tech Stack (unchanged)
- React 19, TypeScript, React Flow, Zustand, Tailwind, Radix UI
- Express, PostgreSQL, Drizzle ORM
- Passport.js, bcryptjs, express-session, connect-pg-simple
