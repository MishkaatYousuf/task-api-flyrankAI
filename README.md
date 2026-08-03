# Task API

A RESTful Task Management API built with **Node.js**, **Express**, and **PostgreSQL**. The API supports full CRUD (Create, Read, Update, Delete) operations on tasks and is containerized using Docker and Docker Compose.

## Features

- Full CRUD API
- PostgreSQL database
- Docker & Docker Compose support
- Automatic database initialization
- Automatic seeding with example tasks
- Swagger API documentation
- Environment variable configuration

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL driver)
- Docker
- Docker Compose
- Swagger UI

---

# Project Structure

```
task-api/
│
├── repository/
│   └── tasksRepository.js
│
├── server.js
├── openapi.json
├── package.json
├── Dockerfile
├── compose.yaml
├── .env.example
├── .gitignore
└── README.md
```
---

# Environment Variables

Copy the example file:

### Linux / macOS

```bash
cp .env.example .env
```

### Windows Command Prompt

```cmd
copy .env.example .env
```

Contents of `.env.example`

```env
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
```

---

# Running the Project

## Using Docker Compose (Recommended)

Start the complete stack:

```bash
docker compose up
```

or, if running for the first time:

```bash
docker compose up --build
```

The API will be available at:

```
http://localhost:3000
```

Swagger:

http://localhost:3000/docs

## Running Without Docker

Start PostgreSQL separately.

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Endpoint Table:

| Method | Endpoint   | Description  |
| ------ | ---------- | ------------ |
| GET    | /          | API Info     |
| GET    | /health    | Health Check |
| GET    | /tasks     | List Tasks   |
| GET    | /tasks/:id | Single Task  |
| POST   | /tasks     | Create Task  |
| PUT    | /tasks/:id | Update Task  |
| DELETE | /tasks/:id | Delete Task  |

Curl output:
<img width="868" height="611" alt="image" src="https://github.com/user-attachments/assets/c04cfc5e-3be3-4574-b9e4-d068dba1ca9d" />

Swagger UI:
<img width="979" height="502" alt="image" src="https://github.com/user-attachments/assets/7fc622c1-ae8a-4fe1-8460-d4a342ec79b1" />

# Database Initialization

On startup the application automatically:

1. Connects to PostgreSQL.
2. Creates the `tasks` table if it does not already exist.
3. Seeds three example tasks only if the table is empty.

Restarting the application does **not** create duplicate seed data.

---

# Docker

The project uses two services:

- **api** – Express application
- **db** – PostgreSQL database

The PostgreSQL data is stored in a Docker volume named:

```
taskdata
```

This ensures that data persists even after stopping and restarting the containers.

---

# Verification

After starting the application:

Open

```
http://localhost:3000/tasks
```

You should see the seeded tasks.

Swagger documentation is available at

```
http://localhost:3000/docs
```

---

# Database Screenshot

Includes screenshots showing:

- `\dt`
- `SELECT * FROM tasks;`

<img width="979" height="618" alt="image" src="https://github.com/user-attachments/assets/82300ecf-8ea7-4602-afcd-206548751d9a" />


---

# Repository

Push the completed project to your public GitHub repository.

A fresh clone should work by running:

```bash
cp .env.example .env
docker compose up
```

without requiring any manual database setup.
