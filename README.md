# Deskline — ticket-system frontend

A React (Vite) frontend for the Go ticket-system API: register/login, a
ticket queue with status filters, ticket creation, and the
`open → in_progress → closed` status workflow enforced by the backend.

## Run it

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if your API isn't on :8080
npm run dev
```

This starts the dev server at `http://localhost:5173`. Run the Go API
separately (`go run ./cmd/server` from the backend project).

## CORS — required for local dev

The backend doesn't currently send CORS headers, so a browser at
`localhost:5173` calling `localhost:8080` will be blocked. Add a small
middleware in `internal/app/app.go` around the returned mux:

```go
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
```

Then wrap the final return value: `return withCORS(mux)` at the end of
`NewRouter`. Tighten the allowed origin before deploying anywhere public.

## What's implemented

- **Auth** — register and login against `/auth/register` and `/auth/login`;
  the JWT is stored in `localStorage` and sent as `Authorization: Bearer …`
  on every ticket request.
- **Queue** (`/`) — lists the signed-in user's tickets (`GET /tickets`)
  with client-side status filters.
- **New ticket** (`/tickets/new`) — `POST /tickets`.
- **Ticket detail** (`/tickets/:id`) — `GET /tickets/:id`, plus a single
  "advance status" action that calls `PATCH /tickets/:id/status`. The
  button only ever offers the next legal transition (open → in_progress →
  closed) and disappears once a ticket is closed, matching the backend's
  one-way transition rule.

## Structure

```
src/
  api.js              fetch wrapper for the Go API + token storage
  context/AuthContext.jsx
  components/Shell.jsx, Status.jsx
  pages/Login.jsx, Register.jsx, Tickets.jsx, NewTicket.jsx, TicketDetail.jsx
  styles.css
```
