#!/bin/bash

# Docker Management Script for Adscod Application
# This script provides convenient commands for managing the containerized application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker and docker-compose are installed
check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Function to setup environment file
setup_env() {
    local env_type=$1
    local env_file=".env.${env_type}"
    local example_file=".env.${env_type}.example"
    
    if [[ ! -f $env_file ]]; then
        if [[ -f $example_file ]]; then
            print_status "Creating $env_file from $example_file"
            cp $example_file $env_file
            print_warning "Please review and update the values in $env_file before proceeding"
        else
            print_error "Example environment file $example_file not found"
            exit 1
        fi
    fi
}

# Development environment commands
dev_up() {
    print_status "Starting development environment..."
    setup_env "dev"
    docker-compose --env-file .env.dev up -d
    print_success "Development environment started"
    print_status "Application will be available at http://localhost:3000"
    print_status "PostgreSQL will be available at localhost:5432"
    print_status "Redis will be available at localhost:6379"
}

dev_down() {
    print_status "Stopping development environment..."
    docker-compose --env-file .env.dev down
    print_success "Development environment stopped"
}

dev_logs() {
    docker-compose --env-file .env.dev logs -f ${2:-app}
}

dev_shell() {
    docker-compose --env-file .env.dev exec app sh
}

dev_db_shell() {
    docker-compose --env-file .env.dev exec postgres psql -U adscod_user -d adscod_dev
}

# Production environment commands
prod_up() {
    print_status "Starting production environment..."
    setup_env "prod"
    docker-compose --env-file .env.prod up -d
    print_success "Production environment started"
}

prod_down() {
    print_status "Stopping production environment..."
    docker-compose --env-file .env.prod down
    print_success "Production environment stopped"
}

prod_logs() {
    docker-compose --env-file .env.prod logs -f ${2:-app}
}

# Database management commands
db_migrate() {
    local env_type=${1:-dev}
    print_status "Running database migrations for $env_type environment..."
    docker-compose --env-file .env.$env_type exec app npx prisma migrate dev
    print_success "Database migrations completed"
}

db_reset() {
    local env_type=${1:-dev}
    print_warning "This will reset the database and delete all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database for $env_type environment..."
        docker-compose --env-file .env.$env_type exec app npx prisma migrate reset --force
        print_success "Database reset completed"
    else
        print_status "Database reset cancelled"
    fi
}

db_seed() {
    local env_type=${1:-dev}
    print_status "Seeding database for $env_type environment..."
    docker-compose --env-file .env.$env_type exec app npx prisma db seed
    print_success "Database seeding completed"
}

# Build commands
build() {
    local target=${1:-production}
    print_status "Building Docker image with target: $target"
    docker build --target $target -t adscod:$target .
    print_success "Docker image built successfully"
}

# Cleanup commands
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Status command
status() {
    print_status "Docker containers status:"
    docker-compose ps
    echo
    print_status "Docker images:"
    docker images | grep adscod
    echo
    print_status "Docker volumes:"
    docker volume ls | grep adscod
}

# Help function
show_help() {
    echo "Adscod Docker Management Script"
    echo
    echo "Usage: $0 <command> [options]"
    echo
    echo "Development Commands:"
    echo "  dev:up          Start development environment"
    echo "  dev:down        Stop development environment"
    echo "  dev:logs [service]  Show logs for development environment"
    echo "  dev:shell       Open shell in development app container"
    echo "  dev:db          Open PostgreSQL shell in development"
    echo
    echo "Production Commands:"
    echo "  prod:up         Start production environment"
    echo "  prod:down       Stop production environment"
    echo "  prod:logs [service]  Show logs for production environment"
    echo
    echo "Database Commands:"
    echo "  db:migrate [env]    Run database migrations (default: dev)"
    echo "  db:reset [env]      Reset database (default: dev)"
    echo "  db:seed [env]       Seed database (default: dev)"
    echo
    echo "Build Commands:"
    echo "  build [target]      Build Docker image (default: production)"
    echo
    echo "Utility Commands:"
    echo "  status              Show status of containers, images, and volumes"
    echo "  cleanup             Clean up Docker resources"
    echo "  help                Show this help message"
    echo
    echo "Examples:"
    echo "  $0 dev:up           # Start development environment"
    echo "  $0 dev:logs app     # Show app logs in development"
    echo "  $0 db:migrate prod  # Run migrations in production"
    echo "  $0 build development # Build development image"
}

# Main command dispatcher
main() {
    check_requirements
    
    case $1 in
        dev:up)
            dev_up
            ;;
        dev:down)
            dev_down
            ;;
        dev:logs)
            dev_logs $@
            ;;
        dev:shell)
            dev_shell
            ;;
        dev:db)
            dev_db_shell
            ;;
        prod:up)
            prod_up
            ;;
        prod:down)
            prod_down
            ;;
        prod:logs)
            prod_logs $@
            ;;
        db:migrate)
            db_migrate $2
            ;;
        db:reset)
            db_reset $2
            ;;
        db:seed)
            db_seed $2
            ;;
        build)
            build $2
            ;;
        status)
            status
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"