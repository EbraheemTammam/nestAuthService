# 🔐 NestJS Authentication API

A robust RESTful authentication API built with **NestJS**, **MongoDB** (via Mongoose), **JWT**, and **Passport.js**. Supports user registration, login, and password management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## Overview

This API provides a complete authentication system with three core capabilities:

- **Sign Up** — register a new user with a hashed password
- **Login** — authenticate and receive a signed JWT
- **Change Password** — update the password of an authenticated user

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com/) |
| Database | [MongoDB](https://www.mongodb.com/) |
| ODM | [Mongoose](https://mongoosejs.com/) |
| Auth Strategy | [Passport.js](http://www.passportjs.org/) |
| Token | [JWT (JSON Web Token)](https://jwt.io/) |
| Password Hashing | [argon2](https://www.npmjs.com/package//argon2) |
| Runtime | [Node.js](https://nodejs.org/) |

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

- **Node.js** `v24+` — [Download](https://nodejs.org/)
- **npm** `v11+` (comes with Node.js)
- **MongoDB** — either:
  - Local installation: [Download](https://www.mongodb.com/try/download/community)
  - Cloud instance: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Git** — [Download](https://git-scm.com/)

To verify your setup:

```bash
node --version    # v24.x.x or higher
npm --version     # 11.x.x or higher
mongod --version  # if using a local MongoDB installation
```

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install dependencies

```bash
npm install
```

---

## Configuration

The app relies on environment variables for sensitive configuration. Create a `.env` file in the root of the project:

```bash
cp .env.example .env   # if an example file exists, otherwise create it manually
```

Then populate `.env` with the following values:

```env
# ── MongoDB ──────────────────────────────────────────────
# Local:
DATABASE_URL=mongodb://localhost:27017/auth-db

# Or MongoDB Atlas:
# DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auth-db?retryWrites=true&w=majority

# ── JWT ──────────────────────────────────────────────────
JWT_SECRET_KEY=your_super_secret_key_change_this_in_production
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/auth-db` |
| `JWT_SECRET_KEY` | Secret key used to sign JWTs | `s0m3-r4nd0m-s3cr3t` |

---

## Running the App

### Development (with hot reload)

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Standard start

```bash
npm run start
```

Once running, the server will be available at:

```
http://localhost:3000
```

---

## API Endpoints

Base URL: `http://localhost:3000`

---

### 1. Sign Up

Register a new user account.

```
POST /auth/signup
```

**Request Body**

```json
{
  "email": "user@example.com",
  "name": "example name",
  "password": "StrongPassword123!"
}
```

**Success Response** `201 Created`

```json
{
  "success": true
}
```

**Error Responses**

| Status | Reason |
|---|---|
| `400` | Validation failed (missing or malformed fields) |
| `409` | Email is already registered |

---

### 2. Login

Authenticate with credentials and receive a JWT.

```
POST /auth/login
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Success Response** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

| Status | Reason |
|---|---|
| `400` | Validation failed |
| `401` | Invalid email or password |

---

### 3. Change Password

Update the password of the currently authenticated user.

> 🔒 **Requires Authentication** — include the JWT from login in the `Authorization` header.

```
PATCH /auth/change-password
```

**Headers**

```
Authorization: Bearer <your_access_token>
```

**Request Body**

```json
{
  "oldPassword": "StrongPassword123!",
  "newPassword": "EvenStronger456@"
}
```

**Success Response** `200 OK`

```json
{
  "message": "Password updated successfully"
}
```

**Error Responses**

| Status | Reason |
|---|---|
| `400` | Validation failed |
| `401` | Missing or invalid JWT / wrong current password |

---

## Authentication Flow

```
[Client]                          [Server]
   │                                  │
   │── POST /auth/signup ────────────▶│  Hash password (bcrypt), save user
   │◀─ 201 { success } ───────────────│
   │                                  │
   │── POST /auth/login ─────────────▶│  Validate credentials, sign JWT
   │◀─ 200 { accessToken } ──────────│
   │                                  │
   │── PATCH /auth/change-password ──▶│  Passport JWT Guard validates token
   │   Authorization: Bearer <token>  │  Verify current password, hash new one
   │◀─ 200 { message } ──────────────│
```

The JWT payload typically contains:

```json
{
  "sub": "64f1a2b3c4d5e6f7a8b9c0d1",
  "email": "user@example.com",
  "iat": 1700000000,
  "exp": 1700604800
}
```

Protected routes use a **Passport JWT Guard** (`@UseGuards(AuthGuard('jwt'))`) that automatically:

1. Extracts the `Bearer` token from the `Authorization` header
2. Verifies the signature using `JWT_SECRET`
3. Checks the expiry
4. Attaches the decoded user to `req.user`

---

## Project Structure

```
src/
├── app.module.ts               # Root module
├── main.ts                     # Entry point, bootstraps the app
│
└── auth/
    ├── auth.module.ts          # Auth module — wires everything together
    ├── auth.controller.ts      # Route handlers (signup, login, change-password)
    ├── auth.service.ts         # Business logic
    │
    ├── dto/
    │   ├── signup.dto.ts       # Validation schema for signup
    │   ├── login.dto.ts        # Validation schema for login
    │   └── change-password.dto.ts
    │
    ├── schemas/
    │   └── user.schema.ts      # Mongoose User schema & model
    │
    └── strategies/
        └── jwt.strategy.ts     # Passport JWT strategy
```

---

## Error Handling

The app uses NestJS's built-in exception layer. All errors follow a consistent shape:

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

Validation errors (from class-validator) return a `400` with a detailed `message` array:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

---

## Testing

### Run unit tests

```bash
npm run test
```

### Run end-to-end tests

```bash
npm run test:e2e
```

### Run tests with coverage

```bash
npm run test:cov
```

---

## Quick Start with cURL

```bash
# 1. Sign up
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"MyPassword123!"}'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"MyPassword123!"}'

# 3. Change password (replace TOKEN with the accessToken from step 2)
curl -X PATCH http://localhost:3000/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"currentPassword":"MyPassword123!","newPassword":"NewPassword456@"}'
```

---

## License

This project is licensed under the MIT License.