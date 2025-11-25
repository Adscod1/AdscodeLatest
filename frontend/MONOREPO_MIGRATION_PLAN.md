# Monorepo Migration Plan

## Overview
Restructuring AdscodeLatest into a monorepo with separate frontend (Next.js) and backend (NestJS) applications.

## Structure

```
AdscodeLatest/                    # Root monorepo folder
├── frontend/                     # Next.js frontend application
│   ├── app/                      # Next.js app router
│   ├── components/               # React components
│   ├── lib/                      # Frontend utilities
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   └── ...
├── backend/                      # NestJS backend application
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── campaigns/            # Campaigns module
│   │   ├── products/             # Products module
│   │   ├── services/             # Services module
│   │   ├── influencers/          # Influencers module
│   │   ├── notifications/        # Notifications module
│   │   ├── health/               # Health check module
│   │   └── main.ts               # NestJS entry point
│   ├── prisma/                   # Prisma schema & migrations
│   ├── package.json              # Backend dependencies
│   └── ...
├── package.json                  # Root package.json (workspace manager)
├── docker-compose.yml            # Docker orchestration
└── README.md                     # Monorepo documentation
```

## Migration Steps

### Phase 1: Setup Monorepo Structure ✅
- [x] Create `frontend/` and `backend/` folders
- [ ] Move Next.js files to `frontend/`
- [ ] Initialize NestJS in `backend/`
- [ ] Create root `package.json` with workspaces

### Phase 2: Backend Setup
- [ ] Initialize NestJS project in `backend/`
- [ ] Move Prisma schema to `backend/prisma/`
- [ ] Create NestJS modules:
  - [ ] Auth module (Better-Auth integration)
  - [ ] Campaigns module
  - [ ] Products module
  - [ ] Services module
  - [ ] Influencers module
  - [ ] Notifications module
  - [ ] Health module
- [ ] Migrate 25 API routes to NestJS controllers
- [ ] Convert 7 server actions to NestJS services

### Phase 3: Frontend Updates
- [ ] Remove `/api` folder from frontend
- [ ] Remove `/actions` folder from frontend
- [ ] Create API client for backend calls
- [ ] Update authentication to use backend API
- [ ] Update all data fetching to use backend endpoints

### Phase 4: Configuration & Deployment
- [ ] Setup environment variables for both apps
- [ ] Create Docker Compose configuration
- [ ] Setup CORS for cross-origin requests
- [ ] Configure development scripts
- [ ] Update CI/CD pipelines

## API Endpoints to Migrate

### Authentication
- `POST /api/auth/[...all]` → Better-Auth handler

### Campaigns (8 endpoints)
- `GET /api/campaigns` → List campaigns
- `POST /api/campaigns` → Create campaign
- `GET /api/campaigns/[id]` → Get campaign
- `PUT /api/campaigns/[id]` → Update campaign
- `POST /api/campaigns/[id]/publish` → Publish campaign
- `POST /api/campaigns/[id]/apply` → Apply to campaign
- `GET /api/campaigns/[id]/applicants` → Get applicants
- `POST /api/campaigns/[id]/applicants/[influencerId]/select` → Select influencer
- `GET /api/campaigns/available` → Get available campaigns
- `GET /api/campaigns/my-applications` → Get user applications
- `GET /api/campaigns/products` → Get campaign products

### Products (2 endpoints)
- `POST /api/product/media` → Upload product media
- `GET/POST /api/comments/[productId]` → Product comments

### Services (3 endpoints)
- `GET /api/service` → List services
- `POST /api/service` → Create service
- `GET/PUT/DELETE /api/service/[serviceId]` → Manage service
- `POST /api/service/media` → Upload service media

### Influencers (3 endpoints)
- `GET /api/influencer/list` → List influencers
- `POST /api/influencer/register` → Register influencer
- `POST /api/influencer/reset` → Reset influencer

### Notifications (2 endpoints)
- `GET /api/notifications` → Get notifications
- `PUT /api/notifications/[id]/read` → Mark as read

### Other (5 endpoints)
- `GET /api/health` → Health check
- `GET /api/check-influencer-status` → Check influencer status
- `GET /api/stores` → Get stores
- `POST /api/upload/media` → Upload media
- `POST /api/new/media` → Upload new media

## Server Actions to Convert

1. `actions/campaign.ts` → CampaignsService
2. `actions/influencer.ts` → InfluencersService
3. `actions/product.ts` → ProductsService
4. `actions/profile.ts` → ProfilesService
5. `actions/reviews.ts` → ReviewsService
6. `actions/service.ts` → ServicesService
7. `actions/store.ts` → StoresService

## Technology Stack

### Frontend
- **Framework**: Next.js 15.3.1
- **UI**: React 19, Tailwind CSS, Radix UI
- **State**: React Query, Zustand
- **Auth**: API client to backend

### Backend
- **Framework**: NestJS (to be installed)
- **Database**: MySQL + Prisma ORM
- **Auth**: Better-Auth with Prisma adapter
- **Validation**: Zod + class-validator
- **API**: RESTful JSON endpoints

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)
```
DATABASE_URL=mysql://root@127.0.0.1:3306/adscode_dev
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## Development Scripts

### Root package.json
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend",
    "build": "npm run build --workspaces",
    "docker:dev": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

## Timeline

- **Week 1**: Setup monorepo structure, initialize NestJS backend
- **Week 2**: Migrate authentication and simple endpoints (health, stores)
- **Week 3**: Migrate complex modules (campaigns, products, services)
- **Week 4**: Frontend updates, testing, deployment configuration

## Notes

- Keep MySQL database running locally during migration
- Test each module after migration before moving to next
- Maintain git history by using `git mv` commands
- Create feature branch for migration: `feature/monorepo-migration`
