# Adscod Docker Setup

This document provides comprehensive instructions for running the Adscod application using Docker with PostgreSQL database.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

### Development Environment

1. **Setup environment file:**
   ```bash
   cp .env.dev.example .env.dev
   ```
   Edit `.env.dev` and customize the values as needed.

2. **Start the development environment:**
   ```bash
   ./docker-manage.sh dev:up
   ```
   or
   ```bash
   npm run docker:dev
   ```

3. **Access the application:**
   - Application: http://localhost:3000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Production Environment

1. **Setup environment file:**
   ```bash
   cp .env.prod.example .env.prod
   ```
   **Important:** Update all the security-sensitive values in `.env.prod`

2. **Start the production environment:**
   ```bash
   ./docker-manage.sh prod:up
   ```
   or
   ```bash
   npm run docker:prod
   ```

## 📋 Available Commands

### Docker Management Script

The `docker-manage.sh` script provides convenient commands for managing the containerized application:

#### Development Commands
```bash
./docker-manage.sh dev:up          # Start development environment
./docker-manage.sh dev:down        # Stop development environment
./docker-manage.sh dev:logs [service]  # Show logs (default: app)
./docker-manage.sh dev:shell       # Open shell in app container
./docker-manage.sh dev:db          # Open PostgreSQL shell
```

#### Production Commands
```bash
./docker-manage.sh prod:up         # Start production environment
./docker-manage.sh prod:down       # Stop production environment
./docker-manage.sh prod:logs [service]  # Show logs (default: app)
```

#### Database Commands
```bash
./docker-manage.sh db:migrate [env]    # Run migrations (default: dev)
./docker-manage.sh db:reset [env]      # Reset database (default: dev)
./docker-manage.sh db:seed [env]       # Seed database (default: dev)
```

#### Build Commands
```bash
./docker-manage.sh build [target]      # Build Docker image (default: production)
```

#### Utility Commands
```bash
./docker-manage.sh status              # Show container status
./docker-manage.sh cleanup             # Clean up Docker resources
./docker-manage.sh help                # Show help
```

### NPM Scripts

You can also use npm scripts for common operations:

```bash
# Development
npm run docker:dev              # Start development environment
npm run docker:dev:down         # Stop development environment
npm run docker:dev:logs         # Show development logs

# Production
npm run docker:prod             # Start production environment
npm run docker:prod:down        # Stop production environment

# Build
npm run docker:build            # Build production image
npm run docker:build:dev        # Build development image

# Database
npm run db:migrate              # Run migrations locally
npm run db:generate             # Generate Prisma client

# Utilities
npm run docker:status           # Show status
npm run docker:cleanup          # Cleanup Docker resources
```

## 🏗️ Architecture

### Services

The Docker Compose setup includes the following services:

1. **PostgreSQL Database (`postgres`)**
   - PostgreSQL 16 with Alpine Linux
   - Persistent data storage
   - Health checks
   - Custom initialization scripts

2. **Redis Cache (`redis`)**
   - Redis 7 with Alpine Linux
   - Used for caching and sessions
   - Persistent data storage

3. **Application (`app`)**
   - Next.js application
   - Multi-stage Dockerfile
   - Development and production targets
   - Health checks

### Volumes

- `postgres_data`: PostgreSQL database files
- `redis_data`: Redis data files
- `app_uploads`: Application file uploads
- `app_cache`: Next.js cache files

### Networks

- `adscod-network`: Bridge network for service communication

## 🔧 Configuration

### Environment Variables

The application uses environment-specific configuration files:

- `.env.dev`: Development environment settings
- `.env.prod`: Production environment settings

Key configuration options:

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Environment name (dev/prod) | `dev` |
| `NODE_ENV` | Node.js environment | `development` |
| `APP_PORT` | Application port | `3000` |
| `POSTGRES_DB` | PostgreSQL database name | `adscod` |
| `POSTGRES_USER` | PostgreSQL username | `adscod_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | **Must be set** |
| `BETTER_AUTH_SECRET` | Auth secret key | **Must be set** |
| `BETTER_AUTH_URL` | Auth base URL | `http://localhost:3000` |

### Database Configuration

The application now uses PostgreSQL instead of SQLite for better production readiness:

- **Development**: Local PostgreSQL container
- **Production**: PostgreSQL container with proper persistence
- **Migrations**: Handled by Prisma
- **Extensions**: UUID, pg_trgm, btree_gin

## 🔄 Development Workflow

### 1. Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd adscod

# Setup development environment
cp .env.dev.example .env.dev
# Edit .env.dev as needed

# Start development environment
./docker-manage.sh dev:up
```

### 2. Working with the Database
```bash
# Run migrations
./docker-manage.sh db:migrate dev

# Access database shell
./docker-manage.sh dev:db

# Reset database (if needed)
./docker-manage.sh db:reset dev
```

### 3. Viewing Logs
```bash
# View all logs
./docker-manage.sh dev:logs

# View specific service logs
./docker-manage.sh dev:logs postgres
./docker-manage.sh dev:logs redis
```

### 4. Development Shell Access
```bash
# Access application container
./docker-manage.sh dev:shell

# Install new packages
./docker-manage.sh dev:shell
npm install <package-name>
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Copy and customize production environment
cp .env.prod.example .env.prod

# Important: Update these values in .env.prod
# - POSTGRES_PASSWORD (use a strong password)
# - BETTER_AUTH_SECRET (use a long random string)
# - BETTER_AUTH_URL (your domain URL)
```

### 2. Database Setup
```bash
# Start production environment
./docker-manage.sh prod:up

# Run production migrations
./docker-manage.sh db:migrate prod
```

### 3. SSL and Reverse Proxy
For production, consider setting up:
- Reverse proxy (nginx, Traefik, etc.)
- SSL certificates (Let's Encrypt)
- Domain configuration

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change ports in .env.dev or .env.prod
   APP_PORT=3001
   POSTGRES_PORT=5433
   REDIS_PORT=6380
   ```

2. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is healthy
   docker-compose --env-file .env.dev ps postgres
   
   # View PostgreSQL logs
   ./docker-manage.sh dev:logs postgres
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $(whoami):$(whoami) .
   ```

4. **Build Issues**
   ```bash
   # Clean rebuild
   ./docker-manage.sh cleanup
   ./docker-manage.sh build development
   ```

### Logs and Debugging

```bash
# View all service logs
./docker-manage.sh dev:logs

# View specific service logs
./docker-manage.sh dev:logs app
./docker-manage.sh dev:logs postgres
./docker-manage.sh dev:logs redis

# Follow logs in real-time
./docker-manage.sh dev:logs -f app
```

### Database Management

```bash
# Connect to PostgreSQL
./docker-manage.sh dev:db

# View database status
./docker-manage.sh status

# Backup database
docker-compose --env-file .env.prod exec postgres pg_dump -U adscod_user adscod > backup.sql

# Restore database
docker-compose --env-file .env.prod exec -T postgres psql -U adscod_user adscod < backup.sql
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs/)

## 🤝 Contributing

When working with the containerized setup:

1. Always test changes in development environment first
2. Update environment examples if adding new configuration
3. Update this README if changing the Docker setup
4. Test both development and production builds