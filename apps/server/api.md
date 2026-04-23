# Branda API Documentation

## Overview
This is the backend API documentation for **Branda**, an AI-powered business builder. The backend is designed to be built using **Bun**, **ElysiaJS**, and **Better Auth**.

**Tech Stack:**
*   **Runtime:** Bun
*   **Framework:** ElysiaJS
*   **Authentication:** Better Auth (with Email/Password & OAuth)
*   **Database:** PostgreSQL
*   **ORM:** Drizzle ORM (Recommended)
*   **AI:** Google Gemini API (Server-side)

---

## 1. Environment Variables (`.env`)

Required variables to run the server.

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/branda_db"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000" # Base URL of the API

# AI
GOOGLE_GENAI_API_KEY="your-gemini-api-key"

# Email (SMTP for invites/verification)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-smtp-password"
EMAIL_FROM="Branda <noreply@branda.app>"
```

---

## 2. Database Schema

The schema is designed to store the complex JSON objects used in the frontend (`BusinessPlan`) efficiently using `JSONB` columns, while keeping relational data (Users, Workspaces) normalized.

### 2.1 Core Tables

#### `users`
*Managed largely by Better Auth, but extended for app specific data.*
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | Primary Key |
| `name` | TEXT | User's full name |
| `email` | TEXT | Unique email |
| `emailVerified` | BOOLEAN | |
| `image` | TEXT | Profile picture URL |
| `createdAt` | TIMESTAMP | |
| `updatedAt` | TIMESTAMP | |

#### `workspaces`
*The container for a business project.*
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | Primary Key |
| `name` | TEXT | Workspace/Business Name |
| `tier` | ENUM | 'Free', 'Starter', 'Growth', 'Enterprise' |
| `createdAt` | TIMESTAMP | |
| `updatedAt` | TIMESTAMP | |

#### `members`
*Many-to-Many relationship between Users and Workspaces.*
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | Primary Key |
| `userId` | TEXT | FK -> users.id |
| `workspaceId` | TEXT | FK -> workspaces.id |
| `role` | ENUM | 'owner', 'admin', 'editor', 'viewer' |
| `status` | ENUM | 'active', 'pending' |
| `invitedAt` | TIMESTAMP | |

#### `business_plans`
*Stores the AI generated content. Uses JSONB to match the frontend TypeScript interfaces flexibility.*
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | Primary Key |
| `workspaceId` | TEXT | FK -> workspaces.id (Unique 1:1) |
| `brandIdentity` | JSONB | Stores `{ name, slogan, colors, logoSvg... }` |
| `marketing` | JSONB | Stores `{ strategy, targetAudience, channels... }` |
| `systems` | JSONB | Stores `{ sops, techStack... }` |
| `crm` | JSONB | Stores `{ onboarding, mockCustomers... }` |
| `funding` | JSONB | Stores `{ ventureFunds, grants... }` |
| `updatedAt` | TIMESTAMP | |

#### `integrations`
*Stores connected tools and custom tool configurations.*
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | Primary Key |
| `workspaceId` | TEXT | FK -> workspaces.id |
| `name` | TEXT | e.g., "Slack", "Custom API" |
| `category` | TEXT | e.g., "Communication" |
| `type` | ENUM | 'standard', 'api', 'webhook', 'mcp' |
| `status` | ENUM | 'connected', 'disconnected' |
| `config` | JSONB | Stores encrypted API keys, Webhook URLs, etc. |

### 2.2 Better Auth Tables (Standard)
*   `sessions`
*   `accounts` (for OAuth linking)
*   `verifications` (for email tokens)

---

## 3. API Endpoints

All endpoints should be protected by Better Auth middleware, except for Auth routes.

### 3.1 Authentication (`/api/auth/*`)
*Handled by Better Auth library.*
*   `POST /api/auth/sign-up/email`: Register
*   `POST /api/auth/sign-in/email`: Login
*   `POST /api/auth/sign-out`: Logout
*   `GET /api/auth/session`: Get current user session

### 3.2 Workspaces (`/api/workspaces`)

| Method | Endpoint | Description | Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List all workspaces user belongs to | |
| `POST` | `/` | Create a new workspace (and empty plan) | `{ name, country, niche }` |
| `GET` | `/:id` | Get full workspace details | |
| `PATCH` | `/:id` | Update workspace settings | `{ name, tier }` |
| `DELETE` | `/:id` | Delete workspace (Owner only) | |

### 3.3 Business Plan (`/api/workspaces/:wsId/plan`)

| Method | Endpoint | Description | Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get the full business plan JSON | |
| `PATCH` | `/brand` | Update Brand Identity section | `{ brandIdentity: { ... } }` |
| `PATCH` | `/marketing` | Update Marketing section | `{ marketing: { ... } }` |
| `PATCH` | `/systems` | Update Systems section | `{ systems: { ... } }` |
| `PATCH` | `/crm` | Update CRM section | `{ crm: { ... } }` |
| `PATCH` | `/funding` | Update Funding section | `{ funding: { ... } }` |

### 3.4 AI Generation (`/api/ai`)
*Move the Gemini logic from frontend to backend to secure the API Key.*

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/generate-plan` | Generate full initial plan | `{ niche, businessName, details, country }` |
| `POST` | `/brainstorm` | Chat with AI Context | `{ workspaceId, message, chatHistory }` |

### 3.5 Team & Members (`/api/workspaces/:wsId/members`)

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List all collaborators | |
| `POST` | `/invite` | Invite a user by email | `{ email, role }` |
| `PATCH` | `/:userId` | Update member role | `{ role }` |
| `DELETE` | `/:userId` | Remove member | |

### 3.6 Integrations (`/api/workspaces/:wsId/integrations`)

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List active integrations | |
| `POST` | `/` | Add custom tool (MCP/Webhook/API) | `{ name, type, config }` |
| `DELETE` | `/:id` | Remove integration | |

---

## 4. Email Templates

The backend needs to send transactional emails.

### 4.1 Team Invitation Email
**Subject:** You've been invited to join {workspace_name} on Branda

```html
<div style="font-family: sans-serif;">
  <h2>Hello!</h2>
  <p><strong>{inviter_name}</strong> has invited you to collaborate on the <strong>{workspace_name}</strong> workspace.</p>
  
  <p>Role: <strong>{role}</strong></p>
  
  <div style="margin: 20px 0;">
    <a href="{app_url}/invite/{token}" style="background: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Accept Invitation
    </a>
  </div>
  
  <p>If you don't have an account, you will be prompted to create one.</p>
  <p>Cheers,<br/>The Branda Team</p>
</div>
```

### 4.2 Email Verification (Better Auth)
**Subject:** Verify your email for Branda

```html
<div style="font-family: sans-serif;">
  <h2>Welcome to Branda!</h2>
  <p>Please verify your email address to continue setting up your business account.</p>
  
  <div style="margin: 20px 0;">
    <a href="{url}" style="background: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>
  </div>
</div>
```

---

## 5. Security & RBAC Implementation

Using Better Auth and Elysia `derive` or `macro`:

1.  **Authentication Guard:** Ensure `session` exists for all protected routes.
2.  **Workspace Guard:** Middleware that checks `members` table:
    *   Does `session.user.id` exist in `members` where `workspaceId` matches the route param?
    *   Inject `membership` (role) into the context.
3.  **Role Guard:**
    *   **Owner:** Can delete workspace, manage billing.
    *   **Admin:** Can invite users, manage integrations.
    *   **Editor:** Can `PATCH` business plan sections.
    *   **Viewer:** Can only `GET` data.

## 6. Development Workflow

1.  **Install Dependencies:**
    ```bash
    bun add elysia better-auth drizzle-orm pg postgres
    bun add -d drizzle-kit @types/pg
    ```
2.  **Run Migrations:**
    ```bash
    bun drizzle-kit push
    ```
3.  **Start Server:**
    ```bash
    bun dev
    ```
