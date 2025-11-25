# Quick Start Guide

## Directory Structure

```
AdscodeLatest/                    # 👈 You are here (root)
├── frontend/                     # Next.js application
├── backend/                      # NestJS API server
├── package.json                  # Root workspace config
├── README.md                     # Full documentation
├── MIGRATION_STATUS.md           # Migration progress tracker
└── MONOREPO_MIGRATION_PLAN.md    # Detailed migration plan
```

## Quick Commands

### 🚀 Start Development

```bash
# Start both frontend and backend
npm run dev

# Start frontend only (port 3000)
npm run dev:frontend

# Start backend only (port 4000)
npm run dev:backend
```

### 📦 Install Dependencies

```bash
# Install all dependencies (root + workspaces)
npm install

# Install in specific workspace
npm install <package> --workspace=frontend
npm install <package> --workspace=backend
```

### 🏗️ Build

```bash
# Build both applications
npm run build

# Build specific app
npm run build:frontend
npm run build:backend
```

### 🧪 Testing

```bash
# Run tests in all workspaces
npm run test

# Test specific workspace
npm run test --workspace=backend
```

### 🗄️ Database (Backend)

```bash
# Generate Prisma client
cd backend && npx prisma generate

# Run migrations
cd backend && npx prisma migrate dev

# Open Prisma Studio
cd backend && npx prisma studio
```

### 🧹 Clean

```bash
# Remove all node_modules and build artifacts
npm run clean

# Then reinstall
npm install
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js app |
| Backend | http://localhost:4000 | NestJS API |
| Health Check | http://localhost:4000/health | Backend health status |
| API Docs | http://localhost:4000/api/docs | Swagger documentation |

## 📁 Working in Workspaces

### Frontend Development

```bash
cd frontend

# Install package
npm install <package>

# Run Next.js dev server
npm run dev

# Build
npm run build
```

### Backend Development

```bash
cd backend

# Install package
npm install <package>

# Run NestJS in watch mode
npm run dev

# Build
npm run build

# Generate Prisma client after schema changes
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)

```env
DATABASE_URL=mysql://root@127.0.0.1:3306/adscode_dev
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Backend won't start

**Error**: Can't reach database server
**Solution**: Make sure MySQL is running on port 3306

```bash
# Check if MySQL is running
mysql -u root -p
```

### Port already in use

**Error**: Port 3000/4000 already in use
**Solution**: Kill the process or change the port

```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Prisma Client not found

**Error**: Cannot find module '@prisma/client'
**Solution**: Generate Prisma client

```bash
cd backend
npx prisma generate
```

### Workspace not found

**Error**: Could not find workspace
**Solution**: Run from root directory

```bash
cd /Users/kiwana/projects/AdscodeLatest
npm run dev
```

## 📚 Next Steps

1. ✅ Monorepo setup complete
2. 🔄 Implement Authentication module in backend
3. 🔄 Migrate API endpoints to NestJS
4. 🔄 Update frontend to use backend API
5. 🚀 Deploy separately

See `MIGRATION_STATUS.md` for detailed progress.

## 💡 Tips

- Always run `npm install` from root to install all workspaces
- Use `--workspace=` flag to run commands in specific workspace
- Backend uses Prisma - frontend should not access DB directly after migration
- Keep .env files in sync during migration
- Test each module after migration before moving to next

---

**Ready to start?**

```bash
npm run dev
```

Then visit:
- Frontend: http://localhost:3000
- Backend Health: http://localhost:4000/health
- API Docs: http://localhost:4000/api/docs
