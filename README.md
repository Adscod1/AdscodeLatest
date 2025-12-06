# AdscodeLatest Monorepo

Monorepo containing the frontend and backend applications for AdscodeLatest.

## Project Structure

```
AdscodeLatest/
├── frontend/          # Next.js 15 frontend application
├── backend/           # NestJS backend API
├── prisma/            # Database schema
├── package.json       # Root workspace configuration
├── README.md          # Documentation
```

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 15.3.1, React 19, Tailwind CSS, Radix UI, React Query, Zustand |
| **Backend** | NestJS, MySQL, Prisma ORM 6.18.0, Better-Auth |
| **Validation** | Zod, class-validator |

## Quick Start

### Prerequisites
- Node.js >= 18.0.0, npm >= 9.0.0
- MySQL running on localhost:3306

### Installation

```bash
# Install all dependencies
npm install

# Setup environment variables
# Frontend: frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000

# Backend: backend/.env
DATABASE_URL=mysql://root@127.0.0.1:3306/adscode_dev
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=4000
FRONTEND_URL=http://localhost:3000

# Generate Prisma client
cd backend && npx prisma generate
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run both frontend & backend |
| `npm run dev:frontend` | Run frontend only (port 3000) |
| `npm run dev:backend` | Run backend only (port 4000) |
| `npm run build` | Build both apps |
| `npm run build:frontend` | Build frontend only |
| `npm run build:backend` | Build backend only |
| `npm run start:frontend` | Start frontend production |
| `npm run start:backend` | Start backend production |
| `npm run clean` | Remove node_modules & build artifacts |
| `npm run test` | Run tests |
| `npm install <pkg> --workspace=frontend` | Install in frontend |
| `npm install <pkg> --workspace=backend` | Install in backend 

### Backend Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## Services & URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js app |
| Backend API | http://localhost:4000 | NestJS API |
| Health Check | http://localhost:4000/health | Backend status |
| API Docs | http://localhost:4000/api/docs | Swagger documentation |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Database connection fails** | Ensure MySQL is running: `mysql -u root -p` |
| **Port 3000/4000 already in use** | Kill process: `lsof -i :3000` then `kill -9 <PID>` |
| **Prisma Client not found** | Run: `cd backend && npx prisma generate` |
| **Workspace not found** | Run from root: `cd /Users/kiwana/projects/AdscodeLatest && npm run dev` |

## Tips

- Always run `npm install` from root for all workspaces
- Use `--workspace=` flag for workspace-specific commands
- Frontend should not access DB directly after migration
- Keep .env files in sync during migration
- Test each module after migration before moving to next
- Use `npx prisma studio` to inspect the database visually


npx prisma db push

git pull --rebase origin main



User fills form → Zustand store → Media page submit → 
API client → NestJS backend → Prisma → MySQL database

cd backend && npx prisma migrate dev --name add_store_highlight_table
cd backend && npx prisma generate
npx prisma generate