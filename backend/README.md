# Issue Tracker — Backend

Express.js REST API with SQLite persistence for the issue tracker.

## Prerequisites

- Node.js 22+

## Setup

```bash
cd backend
npm install
```

## Start the server

```bash
cd backend
npm start
```

The server binds to `127.0.0.1:3000` by default.

Override the port with the `PORT` environment variable:

```bash
PORT=8080 npm start
```

Override the database file location with `DB_PATH`:

```bash
DB_PATH=/var/data/tracker.db npm start
```

## API

All endpoints are prefixed with `/api/v1`. See the integration brief for the
full contract. Summary:

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/issues | Create an issue |
| GET | /api/v1/issues | List issues (optional `?status=` filter) |
| GET | /api/v1/issues/:id | Get a single issue |
| PATCH | /api/v1/issues/:id/status | Change issue status |
| POST | /api/v1/issues/:id/comments | Add a comment |
| GET | /api/v1/issues/:id/comments | List comments for an issue |
| GET | /api/v1/summary | Per-status count |

## Project structure

```
backend/
├── package.json
├── src/
│   ├── index.js          # Entry point, binds the server
│   ├── app.js            # Express app setup, middleware, route mounting
│   ├── routes/
│   │   ├── issues.js     # Issue CRUD route handlers
│   │   ├── comments.js   # Comment route handlers
│   │   └── summary.js    # Summary endpoint
│   ├── services/
│   │   ├── issueService.js    # Issue business logic
│   │   ├── commentService.js  # Comment business logic
│   │   └── validation.js      # Input validation & status transition rules
│   └── db/
│       ├── connection.js       # SQLite connection & schema init
│       ├── issueRepository.js  # Issue data access
│       └── commentRepository.js # Comment data access
└── data/
    └── issues.db          # SQLite database (created on first run)
```
