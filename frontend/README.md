# Issue Tracker — Frontend

React + TypeScript + Vite frontend for the issue tracker. Calls the backend API
at `/api/v1` on the same origin and renders every response exactly as received.

## Quick start

```bash
# From this directory (frontend/)
npm install
npm run build   # produces ../public/
```

The backend serves the static assets from `../public` (relative to itself, at
the workspace root). Place the built assets there before starting the backend.

## Build output

| Config key | Value |
|---|---|
| `build.outDir` in `vite.config.ts` | `../public` |
| Resolved path (from workspace root) | `./public` |

The backend is configured to serve `./public` as its static root, so the Vite
build output lands in exactly the right place.

## Development (with the backend running)

```bash
npm install
npm run dev     # starts Vite dev server on http://localhost:5173
```

The dev server proxies `/api/*` requests to `http://localhost:3000` (the
backend's default port), so same-origin API calls work without CORS
configuration.

## Backend address resolution

The page resolves the API origin at runtime in this priority order:

1. **`?endpoint=` query parameter** — `http://localhost:5173/?endpoint=http://custom-host`
2. **`window.__API_ORIGIN__`** — inject via a `<script>` tag in the host page
3. **`window.location.origin`** — default; works with no config when the backend
   serves the built assets (same origin)

The resolved address is displayed in the page header.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 with /api proxy to :3000 |
| `npm run build` | TypeScript type-check + Vite production build → `../public` |
| `npm run preview` | Preview the production build on port 4173 |

## Component structure

```
src/
├── api/
│   └── client.ts          Runtime-resolved API client for all endpoints
├── types/
│   └── index.ts           Issue, Comment, IssueStatus, helpers
├── components/
│   ├── Header/            App header with API endpoint display
│   ├── StatusBadge/       Reusable coloured status pill
│   ├── ErrorMessage/      Accessible error alert
│   ├── LoadingSpinner/    Loading state indicator
│   ├── IssueForm/         Create-issue form (client + server validation)
│   ├── IssueList/         Issue list with per-status filter control
│   ├── StatusSummary/     Per-status count cards (sourced from API)
│   ├── IssueDetail/       Single issue view + legal-only status transitions
│   ├── CommentList/       Thread of comments for an issue
│   └── CommentForm/       Post-comment form
└── pages/
    ├── IssuesPage.tsx     / — summary + create + filtered list
    └── IssuePage.tsx      /issues/:id — detail + comments
```

## API contract consumed

All calls go to `{resolvedOrigin}/api/v1`:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/issues` | Create issue |
| `GET` | `/issues[?status=]` | List issues + summary |
| `GET` | `/issues/:id` | Fetch single issue |
| `PATCH` | `/issues/:id` | Update issue status |
| `POST` | `/issues/:id/comments` | Add comment |
| `GET` | `/issues/:id/comments` | List comments |

Error responses have shape `{ error: string }`.
