# EnvVault Backend Implementation

## Overview

EnvVault backend provides the API layer for the secrets management system.
It handles authentication, secret management, environment filtering, audit logging, and `.env` file exports.

The backend connects to a **Neon PostgreSQL database** which acts as the centralized secrets store.

---

## Technology Stack

- Node.js
- Express.js
- PostgreSQL (Neon)
- pg (Postgres driver)
- JWT Authentication
- bcryptjs
- dotenv
- cors
- uuid

---

## Project Structure

```text
envvault-backend/
├── src/
│   ├── controllers/
│   │   ├── auditController.js
│   │   ├── authController.js
│   │   └── secretController.js
│   ├── db/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auditRoutes.js
│   │   ├── authRoutes.js
│   │   └── secretRoutes.js
│   └── server.js
├── .env
└── package.json
```

---

## Features Implemented

1. **Authentication**: Uses `jsonwebtoken` and `bcryptjs` for secure login and token issuance. Contains middleware to protect secrets routes.
2. **Secrets CRUD**: Supports Creating, Reading, Updating, and Deleting secrets in the Postgres DB.
3. **Environment Support**: Secrets can be stored and retrieved explicitly for `Development`, `Staging`, or `Production` environments.
4. **Audit Logging**: Any actions performed on secrets (`Created`, `Updated`, `Deleted`, `Revealed`, `Exported`) are securely logged to the `audit_logs` table.
5. **Masking & Reveal**: Built-in support to restrict full value access until explicitly requested via the `/reveal` API route.
6. **Env Export**: Automatically formats and exports an `.env` file based on a target environment.

---

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure your `.env` file contains your Neon Postgres URI:
   ```env
   PORT=5000
   DATABASE_URL=your_neon_connection_string
   JWT_SECRET=envvault_super_secret
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:5000`.*
