# Alpha Backend: Student Management

Node.js and Express API for the student management service. PostgreSQL is configured through environment variables. The API lists, adds, reads, updates, and deletes students, and exposes a health check.



## Technologies

- Node.js
- Express.js
- PostgreSQL
- `pg` — PostgreSQL client for Node.js
- `dotenv` — Environment variable configuration
- `postgres-migrations` — Database migration management

## Prerequisites

Before running the application, make sure you have installed:

- Node.js 18 or newer
- npm
- PostgreSQL 14 or newer
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:

   ```bash
   cd alpha-backend-student-management
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create your local environment file from the example:

   **Windows PowerShell:**

   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS/Linux:**

   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your local PostgreSQL credentials.

## Environment Variables

The application uses environment variables to configure the server and database connection.

Create a `.env` file in the project root directory with the following variables:

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port used by the Express server |
| `API_SECRET_KEY` | Yes | None | Secret value clients must send in the `"API-Key` header |
| `FRONTEND_ORIGIN` | No | `http://localhost:5173` | Allowed browser origin; set this to your frontend URL |
| `DB_HOST` | Yes | None | PostgreSQL server host |
| `DB_PORT` | No | `5432` | PostgreSQL server port |
| `DB_USER` | Yes | None | PostgreSQL username |
| `DB_PASSWORD` | Yes | None | PostgreSQL password |
| `DB_NAME` | Yes | None | Database name |

Example `.env.example`:

```env
PORT=3000
API_SECRET_KEY=replace-with-a-long-random-secret
FRONTEND_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=student_management
```

Replace the example values with your actual local database configuration.
Set `API_SECRET_KEY` to a private, long random value, and configure the same value
as the `"API-Key` header on API requests. Do not commit the real key or expose it
in public frontend code. For a deployed frontend, set `FRONTEND_ORIGIN` to its
exact origin (scheme, hostname, and port, with no path).

All `/api` requests require the `"API-Key` header. Requests are also rate-limited
to 100 per client IP in each 15-minute window; the limit is shared by all `/api`
routes. Exceeding it returns `429 Too Many Requests`. `/health` is not rate-limited
or "API-Key protected.

## Database Setup

1. Make sure PostgreSQL is running.
2. Create a database named `student_management`, or use another name and update `DB_NAME`.

Using `psql`:

```sql
CREATE DATABASE student_management;
```

Or using the PostgreSQL command line:

```bash
createdb student_management
```

Make sure the database credentials in `.env` match your PostgreSQL configuration.

## Database Migrations

This project uses `postgres-migrations` to manage database schema changes.

Migration files are stored in:

```text
src/migrations/
```

The current migration creates the `students` table with the following fields:

- `id` — Automatically generated primary key
- `studentId` — Unique student identifier
- `firstName` — Student's first name
- `lastName` — Student's last name
- `email` — Unique email address
- `dateOfBirth` — Student's date of birth
- `contactNumber` — Unique contact number
- `enrollmentDate` — Student enrollment date
- `status` — Active, Inactive, or Graduated
- `profilePicture` — Optional profile picture URL

### Run migrations

After creating the database and configuring `.env`, run:

```bash
npm run db:migrate
```

This executes the migration script:

```text
src/scripts/migrate.js
```

The script connects to PostgreSQL and applies the migration files from `src/migrations/`.

Run migrations whenever new database migration files are added.

## Running the Application

### Development mode

Start the server with automatic restart during development:

```bash
npm run dev
```

### Production mode

Start the application using:

```bash
npm start
```

By default, the server runs on:

```text
http://localhost:3000
```

If you configure a different `PORT`, use that port instead.

## API Endpoints

The following endpoint is currently implemented.

| Method | Endpoint | Description | Success Response |
|---|---|---|---|
| GET | `/health` | Checks whether the API server is running | `200 OK` |

### Health Check

**Request:**

```http
GET /health
```

**Local URL:**

```text
http://localhost:3000/health
```

**Successful response:**

```json
{
  "status": "ok"
}
```

**Status code:** `200 OK`

This endpoint can be used to verify that the API server is responding.

> Additional student management endpoints should be documented here when their routes are implemented.

Failed checks return **400** with `success: false`. A duplicate email, phone, or student id returns **409**. A missing student returns **404**. Database columns are snake_case (`student_id`, `first_name`). JSON bodies and responses are camelCase (`studentId`, `firstName`).

### GET /api/students

Returns one page of students. Query values go in the URL, not in the body.

```http
GET /api/students?page=1&limit=10&search=Alice&status=active&sortBy=name&sortOrder=ASC
```

| Query | Example | Allowed |
| --- | --- | --- |
| `page` | `1` | whole number starting at 1. Default `1` |
| `limit` | `10` | whole number. Default `10` |
| `search` | `Alice` | matches first or last name |
| `status` | `active` | `active` or `inactive` |
| `sortBy` | `name` | `name` or `enrollment_date` |
| `sortOrder` | `ASC` | `ASC` or `DESC` |

**200**

```json
{
  "success": true,
  "message": "The list of all students",
  "data": [],
  "meta": {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### POST /api/students

Adds a student. Field names are camelCase. `studentId`, `email`, and `contactNumber` must not already exist.

```http
POST /api/students
```

```json
{
  "studentId": "STU030",
  "firstName": "Aline",
  "lastName": "Uwimana",
  "email": "aline.uwimana@gmail.com",
  "contactNumber": "+250788100030",
  "dateOfBirth": "2003-04-12",
  "enrollmentDate": "2025-09-01",
  "status": "Active",
  "profilePicture": "https://example.com/aline.png"
}
```

`status` must be `Active`, `Inactive`, or `Graduated`. Dates must be `YYYY-MM-DD`. The email must be a full address, such as `name@gmail.com`.

**201** returns the saved row in `data`. That row includes the numeric `id` used by get, update, and delete.

### GET /api/students/:id

Returns one student. `:id` is the numeric database id, such as `6`, not `STU030`.

```http
GET /api/students/6
```

**200**

```json
{
  "success": true,
  "message": "Student retrieved Successfully.",
  "data": {
    "id": 6,
    "studentId": "STU030",
    "firstName": "Aline",
    "lastName": "Uwimana",
    "email": "aline.uwimana@gmail.com"
  }
}
```

`abc` or `STU030` returns **400**. An unknown number returns **404**.

### PUT /api/students/:id

Updates a student. `:id` is the same numeric database id. Send at least one field. Names are camelCase. In Postman, set **Body** to **raw** and **JSON**.

```http
PUT /api/students/6
```

```json
{
  "firstName": "AHMED",
  "lastName": "Osman",
  "email": "ahmedosnan@gmail.com",
  "contactNumber": "+25078484932",
  "dateOfBirth": "2002-11-02",
  "enrollmentDate": "2022-03-24",
  "status": "Active",
  "profilePicture": "https://example.com/ahmed.png"
}
```

**200** returns the updated student. An unknown id returns **404**. An email or phone already used by another student returns **409**. An empty body returns **400**.

### DELETE /api/students/:id

Deletes a student. `:id` is the numeric database id. No body.

```http
DELETE /api/students/6
```

**200**

```json
{
  "success": true,
  "message": "Successfully deleted a student.",
  "data": {
    "id": 6,
    "name": "Aline Uwimana",
    "email": "aline.uwimana@gmail.com"
  }
}
```

An unknown id returns **404**. A value that is not a positive number returns **400**.



## Project Structure

```text
alpha-backend-student-management/
│
├── src/
│   ├── controllers/
│   ├── db/
│   │   └── index.js
│   ├── middleware/
│   ├── migrations/
│   │   └── 1_create_students.sql
│   ├── routes/
│   ├── scripts/
│   │   └── migrate.js
│   ├── validators/
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the development server |
| `npm start` | Starts the application |
| `npm run db:migrate` | Runs database migrations |

## Security

- Never commit `.env` files or real database credentials.
- Keep `.env` in `.gitignore`.
- Commit `.env.example` with placeholder values only.
- Configure production environment variables through the hosting provider.
- Never expose database passwords or other secrets in source code or documentation.



## Deployment

The Alpha Backend: Student Management API is deployed on [Render](https://alpha-backend-student-management.onrender.com), with sdms_db_ehzi used as the database.

### Production Environment

| Item | Details |
|---|---|
| Hosting Platform | Render |
| Backend Service | Alpha Backend — Student Management |
| Database | sdms_db_ehzi |
| Production API URL | `https://alpha-backend-student-management.onrender.com` |
| Health Check | `https://alpha-backend-student-management.onrender.com/health` |

### Health Check

To verify that the deployed API is running, send a GET request to:

```http
GET  https://alpha-backend-student-management.onrender.com/health
```

**Expected response:**

```json
{
  "status": "ok"
}
```

**Expected status code:** `200 OK`

### Production Environment Variables

Configure the following environment variables in the Render dashboard:

| Variable | Description |
|---|---|
| `PORT` | Port used by the application (Render provides this automatically) |
| `DB_HOST` | Production PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | Production database username |
| `DB_PASSWORD` | Production database password |
| `DB_NAME` | Production database name |

Do not commit production credentials or secrets to GitHub.

### Database Migrations

Before using the production API, ensure that the database migrations have been applied to the production PostgreSQL database.

Run:

```bash
npm run db:migrate
```

Ensure the migration command uses the production database credentials configured in Render.

### Deployment Updates

The application is connected to its GitHub repository. New commits pushed to the configured deployment branch can trigger a new deployment, depending on the Render auto-deploy settings.



