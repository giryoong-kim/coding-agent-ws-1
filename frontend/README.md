# Issue Tracker — Frontend

React + Vite frontend for the Issue Tracker API.

## Prerequisites

- Node.js 18 or later (Node.js 22 recommended)
- The backend service running and serving `/api/v1/*` endpoints

## File Structure

```
frontend/
├── package.json              # npm manifest & scripts
├── vite.config.js            # Vite config with dev proxy
├── index.html                # HTML entry point
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component (navigation, layout)
    ├── api/
    │   └── client.js         # Dedicated API client — all fetch calls to /api/v1
    ├── components/
    │   ├── StatusBadge.jsx   # Colored status pill (open / in_progress / done)
    │   ├── SummaryPanel.jsx  # Per-status count panel (GET /api/v1/summary)
    │   ├── IssueList.jsx     # Issue list with status filter tabs
    │   ├── IssueCard.jsx     # Single issue row
    │   ├── IssueDetail.jsx   # Full issue view (description, status, comments)
    │   ├── CreateIssueModal.jsx    # Modal form; surfaces backend 422 errors inline
    │   ├── StatusChangeControl.jsx # Transition buttons; surfaces 409/422 errors
    │   ├── CommentThread.jsx       # Comment list + add-comment form
    │   └── AddCommentForm.jsx      # Inline form; surfaces backend errors inline
    └── styles/
        └── globals.css       # CSS custom properties, design system, component styles
```

## Installing Dependencies

```bash
cd frontend
npm install
```

## Building for Production

```bash
cd frontend
npm run build
```

The compiled static assets are written to `frontend/dist/`. The backend should
serve these files as static assets so the frontend and API share the same origin.
When served this way, no configuration is needed — the frontend defaults to
`window.location.origin` and all `/api/v1` calls resolve same-origin.

## Running the Dev Server

During development you can run the Vite dev server, which proxies `/api` requests
to the backend:

```bash
# Backend is expected on port 8000 by default
cd frontend
npm run dev

# Or, point at a different port:
BACKEND_URL=http://localhost:3000 npm run dev
```

Open `http://localhost:5173` in your browser.

## Previewing the Production Build

After building, you can preview the production bundle locally:

```bash
cd frontend
npm run preview
# Serves on http://localhost:4173
```

Use `?endpoint=http://localhost:8000` to point the page at a local backend when
previewing without a proxy.

## Backend Origin Resolution

The frontend resolves the backend address at runtime in this order:

1. **`?endpoint=<url>` query parameter** — explicit override.
   Example: `http://localhost:4173?endpoint=http://localhost:8000`

2. **`window.BACKEND_ORIGIN` global** — injected by the server in `index.html`:
   ```html
   <script>window.BACKEND_ORIGIN = "https://api.example.com";</script>
   ```

3. **`window.location.origin`** — the page's own origin (default).
   Works with no configuration when the backend serves these static files.

The resolved address is displayed in the header of every page.

## Backend Contract

The frontend consumes these endpoints (base path `/api/v1`):

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/issues` | Create issue |
| `GET` | `/issues[?status=]` | List issues (optional filter) |
| `GET` | `/issues/:id` | Get single issue |
| `PATCH` | `/issues/:id/status` | Transition status |
| `POST` | `/issues/:id/comments` | Add comment |
| `GET` | `/issues/:id/comments` | List comments |
| `GET` | `/summary` | Per-status counts |

CORS headers must allow the origin this frontend is served from so that browser
preflight requests succeed when the frontend and backend are on different origins.
In production (same-origin), CORS is not required.
