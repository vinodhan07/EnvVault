---
description: EnvVault Secret Management and Retrieval Workflow
---

# EnvVault Secret Management & Retrieval Workflow

This workflow outlines the end-to-end process of how secrets are managed, secured, and retrieved within the EnvVault ecosystem.

![System Architecture](../../public/architecture.png)

## 1. Authentication Phase
When a developer application or the frontend dashboard requests a secret, it must pass through the **Authentication Layer**.

- **External Apps**: Must provide both an **Environment API Key** and a **User Identity Token**.
- **Dual Identity Verification**: The backend validates both tokens before authorizing any request to the secrets layer.

## 2. Secrets Service Layer
Once authorized, the request is handled by the **Secrets Service Layer**.

- **Operations**:
    - `Retrieve`: Fetch secrets for a specific environment.
    - `Store`: Save new secrets or update existing ones.
- **Formats**: Secrets are handled in **JSON** for API responses and **.env** for automated file exports.
- **Endpoints**:
    - `/api/env/secrets`: Core endpoint for secret CRUD operations.
    - `/api-keys`: Endpoint for managing environment-level access keys.

## 3. Data Persistence (Neon DB)
All data is stored in a **Neon Serverless PostgreSQL** database, organized into:
- `Secrets`: The actual encrypted/masked variable values.
- `API Keys`: Authorized keys for environment access.
- `Environments`: Definitions for Development, Staging, and Production.
- `Audit Logs`: A permanent record of every secret access or modification.

## 4. Environment Filtering
The system provides a dedicated **Environment Filtering** module that ensures applications only receive the secrets corresponding to their active environment:
🟢 **DEVELOPMENT**
🟡 **STAGING**
🔴 **PRODUCTION**

## 5. Audit Trail
Any action performed (Reveal, Export, Update) triggers an entry in the **Audit Logs**, providing full traceability for security compliance.
