# CinemaHub

A movie discovery site for legally available Tamil & Malayalam movies. Shows trailers, ratings, cast, and sends users to official streaming platforms — never hosts or distributes copyrighted films.

## What's included

- **`index.html`** — A complete, working frontend (open it directly in a browser). Built with vanilla HTML/CSS/JS so it needs no build step. Uses mock data + `localStorage` to fully demo every feature: browsing, search, categories, movie details, auth (login/register/forgot password), profile (watchlist/favorites/history), and an admin dashboard (add/edit/delete movies).
- **`backend/`** — A real Node.js + Express + MongoDB + JWT API scaffold, structured to match the frontend's data model. Run this yourself with a MongoDB instance to get real persistence, real authentication, and real role-based admin access.

## Running the backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and a strong JWT_SECRET
npm run dev             # or: npm start
```

Requires a running MongoDB instance (local, Docker, or MongoDB Atlas).

### API overview

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in, get JWT |
| POST | `/api/auth/forgot-password` | — | Request reset token |
| POST | `/api/auth/reset-password` | — | Reset password with token |
| GET | `/api/movies` | — | List/search/filter movies |
| GET | `/api/movies/:id` | — | Movie details |
| POST | `/api/movies` | Admin | Add movie |
| PUT | `/api/movies/:id` | Admin | Edit movie |
| DELETE | `/api/movies/:id` | Admin | Remove movie |
| GET | `/api/users/me` | User | Profile + lists |
| POST | `/api/users/me/watchlist/:id` | User | Toggle watchlist |
| POST | `/api/users/me/favorites/:id` | User | Toggle favorite |
| POST | `/api/users/me/history/:id` | User | Log a view |

Passwords are hashed with bcrypt (never stored in plaintext). JWTs carry `id`, `email`, and `role`, and `requireAdmin` middleware protects catalog-management routes.

## Connecting the two

The `index.html` prototype currently talks to `localStorage` instead of this API so it works instantly with no setup. To wire them together, replace the `LS.*` helper calls in `index.html` with `fetch()` calls to the endpoints above, and store the returned JWT (e.g. in memory or an httpOnly cookie set by the server) instead of the mock session object.

## Legal note

CinemaHub is designed as a **discovery layer only**:
- Trailers link out to official YouTube search results, never embedded pirated video.
- "Watch Now" always redirects to the official streaming platform's site.
- No film is ever uploaded, hosted, or served by CinemaHub itself.
