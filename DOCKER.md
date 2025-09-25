# Docker Setup Guide

This guide explains how to run the Acquisitions API using Docker with different configurations for development and production environments.

## Overview

- **Development**: Uses Neon Local proxy for isolated database branches
- **Production**: Connects directly to Neon Cloud database
- **Multi-stage Dockerfile**: Optimized builds for both environments

## Prerequisites

1. **Docker and Docker Compose** installed
2. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
3. **Neon API Key**: Get from [Neon Console](https://console.neon.tech) → Account Settings → API Keys
4. **Neon Project ID**: Found in Project Settings → General

## Development Setup (Neon Local)

### 1. Configure Environment Variables

Copy and update the development environment file:

```bash
cp .env.development .env
```

Update `.env` with your Neon credentials:

```env
# Neon API Configuration
NEON_API_KEY=your-neon-api-key-here
NEON_PROJECT_ID=your-neon-project-id-here
PARENT_BRANCH_ID=main

# JWT Secret (change this!)
JWT_SECRET=your-development-jwt-secret-change-this
```

### 2. Start Development Environment

Start both the application and Neon Local proxy:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will:
- Start Neon Local proxy on port 5432
- Create an ephemeral database branch
- Start your application on port 3000
- Enable hot reloading for code changes

### 3. Access the Application

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: Available at `localhost:5432` (via Neon Local proxy)

### 4. Development Features

- **Hot Reloading**: Code changes are automatically detected
- **Ephemeral Branches**: Fresh database branch on each restart
- **Git Integration**: Branches persist per Git branch (optional)
- **Debug Logging**: Detailed logs for troubleshooting

### 5. Database Operations

Run database migrations inside the container:

```bash
# Generate migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Apply migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Open Drizzle Studio (access at http://localhost:4983)
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## Production Deployment

### 1. Environment Variables

For production, create a `.env.production` file or set environment variables:

```env
NODE_ENV=production
DATABASE_URL=postgres://username:password@ep-example-123456.us-east-1.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secure-production-jwt-secret
PORT=3000
LOG_LEVEL=info
```

### 2. Deploy with Docker Compose

```bash
# Using environment file
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Or with inline environment variables
DATABASE_URL="your-neon-cloud-url" \
JWT_SECRET="your-jwt-secret" \
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Production Features

- **Security Hardened**: Read-only filesystem, dropped capabilities
- **Resource Limits**: CPU and memory constraints
- **Health Checks**: Automatic restart on failure
- **Logging**: Structured JSON logs with rotation
- **No Neon Local**: Direct connection to Neon Cloud

### 4. Production Database Setup

Before deploying, ensure your Neon Cloud database is ready:

```bash
# Run migrations on production database (one-time setup)
DATABASE_URL="your-neon-cloud-url" npm run db:migrate
```

## Docker Architecture

### Multi-Stage Dockerfile

The Dockerfile has three stages:

1. **deps**: Production dependency installation
2. **development**: Development environment with hot reloading
3. **production**: Optimized production build

### Container Details

- **Base Image**: `node:18-alpine` (lightweight)
- **User**: Non-root user (`nodejs`)
- **Init System**: `dumb-init` for proper signal handling
- **Health Checks**: Built-in endpoint monitoring
- **Security**: Minimal privileges and read-only filesystem

## Environment Variables Reference

### Development (.env.development)
- `NODE_ENV=development`
- `DATABASE_URL=postgres://neon:npg@neon-local:5432/acquisitions?sslmode=require`
- `NEON_API_KEY`: Your Neon API key
- `NEON_PROJECT_ID`: Your Neon project ID
- `PARENT_BRANCH_ID`: Parent branch for ephemeral branches (default: main)
- `JWT_SECRET`: Development JWT secret

### Production (.env.production)
- `NODE_ENV=production`
- `DATABASE_URL`: Full Neon Cloud connection string
- `JWT_SECRET`: Production JWT secret
- `PORT`: Application port (default: 3000)
- `LOG_LEVEL`: Logging level (default: info)

## Troubleshooting

### Common Issues

**Connection Refused (Development)**
```bash
# Check if Neon Local is running
docker-compose -f docker-compose.dev.yml logs neon-local

# Restart services
docker-compose -f docker-compose.dev.yml restart
```

**SSL Certificate Issues (Development)**
The application is configured to handle Neon Local's self-signed certificates automatically.

**Permission Issues**
```bash
# Fix logs directory permissions
chmod -R 755 logs/
```

### Useful Commands

```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Execute commands in container
docker-compose -f docker-compose.dev.yml exec app sh

# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

## File Structure

```
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.dev.yml     # Development with Neon Local
├── docker-compose.prod.yml    # Production with Neon Cloud
├── .dockerignore             # Docker build exclusions
├── .env.development          # Development environment template
└── .env.production           # Production environment template
```

## Security Considerations

### Development
- Use strong JWT secrets even in development
- Don't commit real API keys to version control
- Neon Local creates isolated ephemeral branches

### Production
- Use environment variable injection for secrets
- Enable SSL/TLS for database connections
- Regular security updates for base images
- Monitor container logs and metrics

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Configure log aggregation and monitoring
3. Implement database backup strategies
4. Set up health check endpoints for load balancers