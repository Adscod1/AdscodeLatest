-- PostgreSQL initialization script for Adscod application
-- This script will be run when the PostgreSQL container starts for the first time

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For better indexing

-- Set timezone
SET timezone = 'UTC';

-- The Prisma migrations will handle table creation
-- This script is just for basic database setup and extensions