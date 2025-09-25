# User CRUD API Testing Guide

This guide provides examples for testing the User CRUD operations using curl or any HTTP client.

## Prerequisites

1. Start the development server: `npm run dev`
2. Ensure you have a database connection configured
3. Create at least one user account through the sign-up endpoint

## Authentication

All user endpoints require authentication. You need to sign in first to get a JWT token stored in cookies.

### 1. Sign Up (Create an admin user for testing)

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }' \
  -c cookies.txt
```

### 2. Sign In

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

## User CRUD Operations

### 1. Get All Users (Admin Only)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "message": "Successfully retrieved users",
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 2. Get User by ID (Owner or Admin)

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "message": "Successfully retrieved user",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create a Regular User (for testing updates)

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Regular User",
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### 4. Update User (Owner can update own data, Admin can update anyone)

**Update own profile (name and email):**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Admin Name",
    "email": "admin.updated@example.com"
  }' \
  -b cookies.txt
```

**Admin updating another user's role:**
```bash
curl -X PUT http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }' \
  -b cookies.txt
```

**Update password:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }' \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "Updated Admin Name",
    "email": "admin.updated@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "id": 2,
    "name": "Regular User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Error Scenarios

### 1. Unauthorized Access (No Token)

```bash
curl -X GET http://localhost:3000/api/users
```

**Expected Response (401):**
```json
{
  "error": "Authentication required",
  "message": "No authentication token provided"
}
```

### 2. Forbidden Access (Regular user trying to access admin endpoint)

First, sign in as a regular user, then:

```bash
curl -X GET http://localhost:3000/api/users \
  -b user_cookies.txt
```

**Expected Response (403):**
```json
{
  "error": "Insufficient permissions",
  "message": "Access denied for this role"
}
```

### 3. User Not Found

```bash
curl -X GET http://localhost:3000/api/users/999 \
  -b cookies.txt
```

**Expected Response (404):**
```json
{
  "error": "User not found",
  "message": "The requested user does not exist"
}
```

### 4. Validation Errors

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "name": "A"
  }' \
  -b cookies.txt
```

**Expected Response (400):**
```json
{
  "error": "Validation failed",
  "details": "Invalid email format,Name must be at least 2 characters"
}
```

### 5. Role Change Restrictions

**Regular user trying to change role:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }' \
  -b user_cookies.txt
```

**Expected Response (403):**
```json
{
  "error": "Insufficient permissions",
  "message": "Only administrators can change user roles"
}
```

## Authorization Matrix

| Operation | Admin | User (Own Data) | User (Others' Data) |
|-----------|-------|------------------|---------------------|
| GET /users | ✅ | ❌ | ❌ |
| GET /users/:id | ✅ | ✅ | ❌ |
| PUT /users/:id | ✅ | ✅ (no role change) | ❌ |
| DELETE /users/:id | ✅ | ❌ (cannot delete self) | ❌ |

## Additional Security Features

1. **Self-deletion prevention**: Users cannot delete their own accounts
2. **Role change restrictions**: Only admins can change roles, and admins cannot change their own role
3. **Email uniqueness**: Email addresses must be unique across all users
4. **Password hashing**: Passwords are automatically hashed before storage
5. **Input validation**: All inputs are validated using Zod schemas

## Database Migrations

Before testing, ensure you've run the database migrations:

```bash
npm run db:generate
npm run db:migrate
```

## Sign Out

When finished testing:

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
  -b cookies.txt
```

This will clear the authentication token and log you out.