# OctoFlow — Полный контекст для нового чата Claude Code

## Репозиторий

- **GitHub:** `catherinecoustenoble338-glitch/Mind-Canvas-AI`
- **Ветка:** `claude/octoflow-product-planner-P0XX8`
- **Последний коммит:** `01be501 Add one-command deploy script for Ubuntu VPS`

## Сервер для деплоя

- **Провайдер:** Hostkey.ru (VPS, США, New York)
- **IP:** `82.21.92.90`
- **Root пароль:** `Xp%i8c2NRl`
- **ОС:** Ubuntu 22.04
- **Сетевой интерфейс:** `ens1` (не eth0!)
- **Занятые порты:** 443 (Shadowsocks VPN), 22 (SSH)
- **Свободные:** 80 (для OctoFlow через nginx)
- **Firewall:** UFW (нет внешних Security Groups)

## Стек технологий

### Frontend
- React 19 + TypeScript 5.6
- React Flow 11 (визуальный canvas)
- Zustand 5 (стейт-менеджмент, 4 слайса)
- Tailwind CSS 4 + Radix UI
- React Query (TanStack) — серверный стейт
- wouter — роутинг
- Framer Motion — анимации
- date-fns, lucide-react, recharts

### Backend
- Express 4 + TypeScript (tsx)
- PostgreSQL 16 + Drizzle ORM
- Passport.js (local strategy, email + bcrypt)
- express-session + connect-pg-simple (PostgreSQL session store)
- Zod — валидация запросов
- bcryptjs — хеширование паролей

### Build
- Vite 7 (client build → `dist/public/`)
- esbuild (server bundle → `dist/index.cjs`)
- `npm run build` → production, `npm run start` → запуск
- `npm run dev` → development (Vite HMR + Express)

## Что уже сделано

### Phase 1 — Backend Stabilization (ЗАВЕРШЁН)
1. Серверная авторизация (Passport + bcrypt + PostgreSQL sessions)
2. CRUD API для проектов (JSONB хранение canvas данных)
3. Замена localStorage на серверное хранение
4. Мульти-проектная поддержка (`/projects` → список, `/project/:id` → canvas)
5. ProtectedRoute / GuestRoute с redirect

### Phase 2 — Full Codebase Refactoring (ЗАВЕРШЁН)
1. Создан `shared/types.ts` — каноничные типы для клиента и сервера
2. Создан `client/src/lib/id.ts` — `generateId()` вместо 46x `Math.random()`
3. Перенаписаны все 4 Zustand-слайса с proper typing:
   - `createProjectSlice.ts` — `WithHistory` + `WithUI` cross-slice интерфейсы, extracted helpers
   - `createHistorySlice.ts` — `structuredClone`, `WithCanvas` интерфейс
   - `createTeamSlice.ts` — `WithHistory` интерфейс
   - `createUISlice.ts` — был чистый, без изменений
4. Убраны все `any` типы из 12+ файлов
5. API хуки используют shared типы (`SafeUser`, `ProjectResponse`, `CanvasData`)
6. Серверные routes: `canvasDataSchema` + правильные Zod-каcты
7. Добавлен `ErrorBoundary` компонент
8. `npx tsc --noEmit` — ноль ошибок

### Deploy Script (СОЗДАН, НЕ ЗАПУЩЕН)
- `deploy.sh` — one-command деплой на Ubuntu 22.04
- Устанавливает Node.js 20, PostgreSQL, nginx
- Создаёт базу, билдит, запускает systemd сервис
- Nginx reverse proxy на порт 80

## Структура проекта (ключевые файлы)

```
Mind-Canvas-AI/
├── deploy.sh                          # Деплой-скрипт для VPS
├── package.json                       # Scripts: dev, build, start, db:push
├── drizzle.config.ts                  # Drizzle ORM config (DATABASE_URL)
├── tsconfig.json
├── vite.config.ts
│
├── shared/
│   ├── schema.ts                      # Drizzle таблицы: users, projects
│   └── types.ts                       # Каноничные типы (CanvasData, BlockData, etc.)
│
├── server/
│   ├── index.ts                       # Express app, порт из $PORT (default 5000)
│   ├── auth.ts                        # Passport local, session, requireAuth middleware
│   ├── db.ts                          # Drizzle + pg Pool (DATABASE_URL)
│   ├── routes.ts                      # API: /api/auth/*, /api/projects/*
│   ├── storage.ts                     # DatabaseStorage class (Drizzle queries)
│   ├── static.ts                      # Production: serve dist/public/
│   └── vite.ts                        # Dev: Vite HMR middleware
│
├── client/src/
│   ├── App.tsx                        # ErrorBoundary → QueryClient → Router
│   ├── main.tsx                       # ReactDOM.createRoot
│   │
│   ├── components/
│   │   ├── ErrorBoundary.tsx          # React error boundary
│   │   └── ui/                        # Radix UI (shadcn) компоненты
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # useAuth, useLogin, useRegister, useLogout
│   │   └── useProject.ts             # useProjects, useProject, useCreateProject, useSaveProject, useDeleteProject
│   │
│   ├── store/
│   │   ├── useAppStore.ts            # Zustand store (create + 4 слайса)
│   │   ├── types.ts                   # Re-exports из shared/types + BlockNode
│   │   └── slices/
│   │       ├── createProjectSlice.ts  # Canvas nodes/edges, блоки, чаты, задачи
│   │       ├── createHistorySlice.ts  # Undo/redo (structuredClone, max 50)
│   │       ├── createTeamSlice.ts     # Team members CRUD
│   │       └── createUISlice.ts       # View mode, sidebar, selected node
│   │
│   ├── pages/
│   │   ├── Login.tsx                  # Форма логина → useLogin()
│   │   ├── Register.tsx               # Форма регистрации → useRegister()
│   │   ├── Projects.tsx               # Список проектов + create/delete
│   │   ├── ProjectBoard.tsx           # Canvas-редактор + auto-save (2s debounce)
│   │   ├── Chats.tsx                  # Все чаты из блоков/задач
│   │   └── not-found.tsx
│   │
│   ├── features/
│   │   ├── canvas/
│   │   │   ├── MindMap.tsx            # ReactFlow canvas (основной компонент)
│   │   │   └── components/
│   │   │       ├── BlockNode.tsx       # Custom node (drag & drop блоки)
│   │   │       ├── CustomEdge.tsx      # Custom edge (цвета, анимация)
│   │   │       ├── Sidebar.tsx         # Сайдбар с блоками для добавления
│   │   │       ├── BlockDetailsDialog.tsx   # Детали блока (задачи, чат)
│   │   │       ├── PageDetailsDialog.tsx    # Детали страницы
│   │   │       ├── SettingsDialog.tsx       # Настройки проекта + team
│   │   │       ├── CustomControls.tsx       # Zoom/undo/redo
│   │   │       ├── WireframeVisual.tsx      # 40+ wireframe-визуализаций
│   │   │       ├── blocks/                  # BlockRegistry, FeatureBlocks, etc.
│   │   │       └── nodes/                   # BlockItem, BlockNodeHeader
│   │   ├── admin/AdminDashboard.tsx
│   │   ├── navigation/components/NavigationPopup.tsx
│   │   └── wiki/components/WikiDialog.tsx
│   │
│   └── lib/
│       ├── id.ts                      # generateId() → crypto.randomUUID()
│       ├── queryClient.ts             # React Query client + apiRequest helper
│       └── utils.ts                   # cn() (clsx + tailwind-merge)
```

## API Endpoints

### Auth
```
POST /api/auth/register   { username, email, name, password }  → SafeUser (auto-login)
POST /api/auth/login      { email, password }                  → SafeUser
POST /api/auth/logout                                          → { message }
GET  /api/auth/me                                              → SafeUser | 401
```

### Projects (all require auth via session cookie)
```
GET    /api/projects            → ProjectResponse[]
GET    /api/projects/:id        → ProjectResponse (ownership check)
POST   /api/projects            { name, description?, canvasData? }  → ProjectResponse
PUT    /api/projects/:id        { name?, description?, canvasData? } → ProjectResponse
DELETE /api/projects/:id        → { message }
```

## Database Schema (PostgreSQL)

```sql
-- Таблица users
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,          -- bcrypt hash (12 rounds)
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Таблица projects
CREATE TABLE projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  canvas_data JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Таблица session (автосоздание connect-pg-simple)
CREATE TABLE session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);
```

## Ключевые типы (shared/types.ts)

```typescript
type WireframeType = 'text_video' | 'text' | 'features' | 'cta' | 'header' | ... (40+ типов)
type PageStatus = 'idea' | 'in_progress' | 'review' | 'done' | 'error'
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'
type TeamRole = 'admin' | 'editor' | 'viewer'

interface ChatMessage { id, text, sender: 'user'|'system', timestamp, attachments? }
interface Task { id, title, status, assignee?, reviewer?, startDate?, endDate?, chatMessages, priority? }
interface BlockItem { id, type: WireframeType, label?, description?, chatMessages?, vfp?, features?, assignee?, tasks? }
interface BlockData { label, status: PageStatus, blocks: BlockItem[], description?, icons?, vfp?, features?, assignee? }

interface SerializedNode { id, type, position: {x,y}, data: BlockData, measured? }
interface SerializedEdge { id, source, target, animated?, style?, markerEnd?, data? }
interface CanvasData { nodes: SerializedNode[], edges: SerializedEdge[] }

interface SafeUser { id, username, email, name, createdAt }
interface ProjectResponse { id, userId, name, description, canvasData: CanvasData, createdAt, updatedAt }
```

## Zustand Store — Cross-Slice архитектура

```typescript
// Каждый слайс объявляет интерфейсы зависимостей от других слайсов:
interface WithHistory { pushToHistory: () => void }  // ProjectSlice, TeamSlice → HistorySlice
interface WithUI { showDetails: boolean }            // ProjectSlice → UISlice
interface WithCanvas { nodes: BlockNode[], edges: Edge[] }  // HistorySlice → ProjectSlice

// StateCreator типизация:
createProjectSlice: StateCreator<ProjectSlice & WithHistory & WithUI, [], [], ProjectSlice>
createHistorySlice: StateCreator<HistorySlice & WithCanvas, [], [], HistorySlice>
createTeamSlice:    StateCreator<TeamSlice & WithHistory, [], [], TeamSlice>
createUISlice:      StateCreator<UISlice>

// Helper functions в ProjectSlice (извлечены для переиспользования):
findNode(nodes, nodeId)           → BlockNode | undefined
mapBlocksInNode(nodes, nodeId, fn) → BlockNode[]
updateBlockField(nodes, nodeId, blockId, field, value) → BlockNode[]
createChatMessage(text, sender)    → ChatMessage
```

## Environment Variables

```bash
DATABASE_URL=postgresql://octoflow:PASSWORD@localhost:5432/octoflow
SESSION_SECRET=any-random-string
NODE_ENV=development|production
PORT=5000  # default
```

## Запуск локально

```bash
# Dev mode (Vite HMR + Express)
DATABASE_URL="postgresql://octoflow:octoflow@localhost:5432/octoflow" npm run dev

# Production
npm run build
DATABASE_URL="..." SESSION_SECRET="..." NODE_ENV=production npm run start
```

## Деплой на сервер 82.21.92.90

```bash
ssh root@82.21.92.90
# Пароль: Xp%i8c2NRl

git clone -b claude/octoflow-product-planner-P0XX8 \
  https://github.com/catherinecoustenoble338-glitch/Mind-Canvas-AI.git /opt/octoflow

bash /opt/octoflow/deploy.sh
# → Установит Node.js 20, PostgreSQL, nginx
# → Соберёт приложение
# → Запустит на http://82.21.92.90 (порт 80, nginx → 5000)
```

**Важно:** На сервере порт 443 занят Shadowsocks VPN. OctoFlow работает на порт 80.

## Что нужно делать дальше (Phases 2-5)

### Phase 2 — UX/Canvas Improvements
- Drag & drop для блоков внутри нод (sortable)
- Копирование/вставка нод и блоков
- Мини-карта canvas
- Группировка нод (section headers)
- Zoom to fit
- Улучшение Sidebar (поиск, категории)

### Phase 3 — Collaboration
- WebSocket (real-time sync между пользователями)
- Комментарии и чат на уровне проекта
- Roles & permissions (admin/editor/viewer)
- Activity log

### Phase 4 — Export & Integration
- Экспорт в PDF/PNG sitemap
- Генерация технического задания (ТЗ)
- AI-ассистент (генерация структуры сайта по описанию)
- Интеграция с Figma/Notion

### Phase 5 — Production Hardening
- HTTPS (Let's Encrypt / certbot) на сервере
- Rate limiting на auth endpoints
- Backup PostgreSQL (pg_dump cron)
- Мониторинг (healthcheck endpoint)
- CI/CD (GitHub Actions)

## Известные моменты

1. **ccpm (Claude Code PM)** установлен в `.claude/` — система управления проектом через команды `/pm:*`
2. `npx tsc --noEmit` — ноль ошибок (проверено)
3. Все коммиты чистые, ветка запушена
4. `deploy.sh` создан но НЕ запущен на сервере — нужно запустить вручную или через SSH
5. `SettingsDialog.tsx` использует `TeamRole` import из `useAppStore`
6. `useProject.ts` имеет `CanvasInput = { nodes: unknown[]; edges: unknown[] }` — permissive тип для mutation inputs (reactflow types шире чем SerializedNode)
