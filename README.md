This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🐳 Docker Deployment

This project is fully containerized with Docker for consistent development and production environments.

### Quick Start

1. **Build the Docker image:**
   ```bash
   ./docker-build.sh
   # or
   npm run docker:build
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 adscod-app
   # or
   npm run docker:run
   ```

3. **Visit your app:** Open http://localhost:3000

### Using Docker Compose (Recommended)

**Production:**
```bash
docker-compose up -d
# or
npm run docker:up
```

**Development (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up
# or
npm run docker:dev
```

**Stop containers:**
```bash
docker-compose down
# or
npm run docker:down
```

### Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build the production Docker image |
| `npm run docker:run` | Run the production container |
| `npm run docker:up` | Start with Docker Compose (production) |
| `npm run docker:dev` | Start with Docker Compose (development) |
| `npm run docker:down` | Stop and remove containers |

### Features

- ✅ Multi-stage build for optimized production images
- ✅ Handles dependency conflicts with `--legacy-peer-deps`
- ✅ Prisma client generation included
- ✅ SQLite database persistence
- ✅ Health checks included
- ✅ Non-root user for security
- ✅ Development mode with hot reload
- ✅ Automatic retry logic for network issues

### Troubleshooting

If you encounter build issues:

1. **Clear Docker cache:**
   ```bash
   docker builder prune
   ```

2. **Install dependencies locally first:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Check Docker daemon:**
   ```bash
   docker system info
   ```

