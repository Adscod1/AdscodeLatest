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

   
   tom@tom:~/projects/adscod/AdscodeLatest$ sudo docker compose up -d --build
[sudo] password for tom: 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
WARN[0000] The "PWD" variable is not set. Defaulting to a blank string. 
Compose now can delegate build to bake for better performances
Just set COMPOSE_BAKE=true
[+] Building 1158.9s (12/22)                                                                                                               docker:default
 => [app internal] load build definition from Dockerfile                                                                                             1.0s
 => => transferring dockerfile: 2.94kB                                                                                                               0.1s
 => [app internal] load metadata for docker.io/library/node:20-alpine                                                                                4.0s
 => [app internal] load .dockerignore                                                                                                                0.6s
 => => transferring context: 34B                                                                                                                     0.1s
 => [app base 1/4] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722                     0.0s
 => [app internal] load build context                                                                                                              519.8s
 => => transferring context: 927.41MB                                                                                                              517.4s
 => CACHED [app base 2/4] RUN apk update && apk upgrade &&     apk add --no-cache     libc6-compat     curl     && rm -rf /var/cache/apk/*           0.0s
 => CACHED [app base 3/4] WORKDIR /app                                                                                                               0.0s
 => CACHED [app base 4/4] RUN addgroup --system --gid 1001 nodejs &&     adduser --system --uid 1001 nextjs                                          0.0s
 => CACHED [app deps 1/2] COPY package.json package-lock.json* ./                                                                                    0.0s
 => CACHED [app deps 2/2] RUN   if [ -f package-lock.json ]; then     npm ci --legacy-peer-deps &&     cp -R node_modules all_node_modules &&     n  0.0s
 => CACHED [app production 1/8] COPY --from=deps /app/prod_node_modules ./node_modules                                                               0.0s
 => CACHED [app builder 1/4] COPY --from=deps /app/node_modules ./node_modules                                                                       0.0s
 => [app builder 2/4] COPY . .   

//storage
{/* Store Info */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-sm">
                {getInitials(formData.name)}
              </div>
              <h3 className="font-semibold">{formData.name || "Store Name"}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {formData.tagline || "Add a tagline for your store"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-sm">
            {formData.address && (
              <div className="flex items-start space-x-2">
                <div className="mt-1">📍</div>
                <span>
                  {[
                    formData.address,
                    formData.city,
                    formData.state,
                    formData.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {formData.phone && (
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>{formData.phone}</span>
              </div>
            )}
            {formData.email && (
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>{formData.email}</span>
              </div>
            )}
            {formData.website && (
              <div className="flex items-center space-x-2 text-blue-500">
                <LinkIcon className="w-4 h-4" />
                <a href={formData.website} className="hover:underline">
                  {formData.website}
                </a>
              </div>
            )}
          </div>