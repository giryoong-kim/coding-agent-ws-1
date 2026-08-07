# Issue Tracker Backend

Express.js backend service with SQLite persistence for the team issue tracker.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The server starts on port **3000** by default (override with `PORT` env var) and binds to `127.0.0.1` (override with `HOST`).

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `HOST` | `127.0.0.1` | Bind address |
| `DB_PATH` | `./data/issues.db` | SQLite database file path |
| `STATIC_DIR` | `./public` | Directory for frontend static assets |

## Static Assets

The backend serves frontend build output from `./public` (or the directory specified by `STATIC_DIR`). Place the compiled frontend assets there before starting the server. The frontend builder's output should be directed to this directory.

## API

All endpoints are prefixed with `/api/v1`. Content-Type is `application/json`.

### Issues

- `POST /api/v1/issues` — Create issue (`{ title, description }`)
- `GET /api/v1/issues` — List issues (optional `?status=open|in_progress|done`)
- `GET /api/v1/issues/:id` — Get single issue
- `PATCH /api/v1/issues/:id` — Update status (`{ status }`)

### Comments

- `POST /api/v1/issues/:id/comments` — Add comment (`{ body }`)
- `GET /api/v1/issues/:id/comments` — List comments

### Error Responses

All errors return `{ error: string }` with appropriate HTTP status codes:
- 404 — Resource not found
- 409 — Illegal status transition
- 422 — Validation failure

## Data Persistence

Data is stored in a SQLite database file at `./data/issues.db`. The database and its directory are created automatically on first run. Data survives process restarts.
