# AdscodeLatest Monorepo

This is a monorepo containing the frontend and backend applications for AdscodeLatest.

## Project Structure

```
AdscodeLatest/
├── frontend/          # Next.js 15 frontend application
├── backend/           # NestJS backend API
├── prisma/            # Database schema (legacy, will be removed)
├── package.json       # Root workspace configuration
└── README.md          # This file
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.1
- **UI**: React 19, Tailwind CSS, Radix UI
- **State Management**: React Query, Zustand
- **API Client**: Fetch API calling backend

### Backend
- **Framework**: NestJS
- **Database**: MySQL + Prisma ORM 6.18.0
- **Authentication**: Better-Auth
- **Validation**: Zod + class-validator
- **API Style**: RESTful JSON

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL database running on localhost:3306

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install workspace dependencies:
```bash
npm install --workspaces
```

3. Setup environment variables:

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=mysql://root@127.0.0.1:3306/adscode_dev
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=4000
FRONTEND_URL=http://localhost:3000
```

4. Generate Prisma client:
```bash
cd backend && npx prisma generate
```

5. Run database migrations (if needed):
```bash
cd backend && npx prisma migrate deploy
```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Frontend (runs on port 3000)
npm run dev:frontend

# Terminal 2 - Backend (runs on port 4000)
npm run dev:backend
```

### Building for Production

Build both applications:
```bash
npm run build
```

Or build individually:
```bash
npm run build:frontend
npm run build:backend
```

### Running in Production

```bash
# Frontend
npm run start:frontend

# Backend
npm run start:backend
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:4000/api/docs
- Health check: http://localhost:4000/health

## Migration Status

Currently migrating from Next.js API Routes to NestJS backend:

- [x] Monorepo structure setup
- [x] NestJS backend initialized
- [x] Prisma database connection
- [x] Health check endpoint
- [ ] Authentication module
- [ ] Campaigns module (8 endpoints)
- [ ] Products module (2 endpoints)
- [ ] Services module (3 endpoints)
- [ ] Influencers module (3 endpoints)
- [ ] Notifications module (2 endpoints)
- [ ] Other endpoints (5 endpoints)
- [ ] Frontend API client integration

See `MONOREPO_MIGRATION_PLAN.md` for detailed migration plan.

## Available Scripts

### Root Level
- `npm run dev` - Run both apps in development mode
- `npm run build` - Build both apps
- `npm run clean` - Clean all node_modules and build folders

### Frontend Workspace
- `npm run dev --workspace=frontend` - Run Next.js dev server
- `npm run build --workspace=frontend` - Build Next.js app
- `npm run start --workspace=frontend` - Start Next.js production server

### Backend Workspace
- `npm run dev --workspace=backend` - Run NestJS in watch mode
- `npm run build --workspace=backend` - Build NestJS app
- `npm run start:prod --workspace=backend` - Start NestJS production server
- `npm run prisma:generate --workspace=backend` - Generate Prisma client
- `npm run prisma:migrate --workspace=backend` - Run database migrations

## Troubleshooting

### Database Connection Issues
Make sure MySQL is running and the connection string in `backend/.env` is correct.

### Port Already in Use
- Frontend uses port 3000
- Backend uses port 4000

Change the PORT environment variable if needed.

### Prisma Client Not Found
Run `npx prisma generate` in the backend folder.

## License

ISC