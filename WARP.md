# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for an acquisitions system that provides authentication functionality. The application uses:

- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Framework**: Express.js with ES modules
- **Validation**: Zod for request validation
- **Logging**: Winston for structured logging

## Development Commands

### Core Development

- `npm run dev` - Start development server with file watching (uses Node's --watch flag)
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues

### Database Operations

- `npm run db:generate` - Generate database migration files from schema changes
- `npm run db:migrate` - Apply pending database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

### Testing

- Tests are not yet configured (placeholder script exists)

## Architecture Overview

### Module Resolution System

The project uses Node.js import maps for clean module imports:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Application Structure

```
src/
├── app.js          # Express app configuration and middleware setup
├── server.js       # Server startup
├── index.js        # Entry point (loads env and starts server)
├── config/
│   ├── database.js # Neon PostgreSQL connection with Drizzle
│   └── logger.js   # Winston logger configuration
├── models/         # Drizzle ORM schema definitions
├── controllers/    # Request handlers and business logic coordination
├── services/       # Core business logic and data operations
├── routes/         # Express route definitions
├── validations/    # Zod validation schemas
└── utils/          # Shared utilities (JWT, cookies, formatting)
```

### Key Architectural Patterns

**MVC Pattern**: Controllers handle HTTP concerns, Services contain business logic, Models define data structure

**Service Layer**: Business logic is encapsulated in service functions (e.g., `createUser` in auth.service.js)

**Validation-First**: All endpoints use Zod schemas for request validation before processing

**Structured Error Handling**: Custom error formatting utilities and consistent error responses

**Security-First**: JWT tokens stored in HTTP-only cookies, helmet middleware, password hashing

## Database Schema and Migrations

The application uses Drizzle ORM with PostgreSQL. Schema files are in `src/models/` and migrations are generated to the `./drizzle` directory.

**User Model Structure**:

- `id`: Serial primary key
- `name`: Required string (max 255 chars)
- `email`: Required unique string (max 255 chars)
- `password`: Required hashed string (max 255 chars)
- `role`: Enum ('user', 'admin'), defaults to 'user'
- `created_at`, `updated_at`: Timestamps

## Environment Configuration

Environment variables are loaded via dotenv. Key variables:

- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `PORT`: Server port (defaults to 3000)
- `NODE_ENV`: Environment setting for production optimizations
- `LOG_LEVEL`: Winston logging level

## Authentication Flow

1. **Sign-up**: POST `/api/auth/sign-up` validates with Zod, hashes password, creates user, returns JWT in cookie
2. **JWT Handling**: Tokens expire in 1 day, stored in HTTP-only cookies with security flags
3. **Password Security**: Uses bcrypt with salt rounds of 10
4. **Cookie Configuration**: Secure flags based on NODE_ENV, strict SameSite policy

## Code Style and Standards

ESLint configuration enforces:

- ES2022+ syntax with ES modules
- 2-space indentation with switch case indentation
- Single quotes, semicolons required
- Prefer const/arrow functions over var/function
- Unix line endings
- Object shorthand syntax

Files ignored by linting: `node_modules`, `coverage`, `logs`, `drizzle`

## API Endpoints

- `GET /` - Basic health check
- `GET /health` - Detailed health status with uptime
- `GET /api` - API status check
- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)
