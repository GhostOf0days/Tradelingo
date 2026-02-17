# Tradelingo

Duolingo for Trading (Class Project)

## Database

SQLite via Bun (`bun:sqlite`).

- **Connection:** `server/db.ts` exports `getDb()` and `closeDb()`. Call `getDb()` from server-side code when for the database.
- **File:** `data/tradelingo.sqlite` (created on first use; `data/` is gitignored).
- **Schema:** I still haven't done this since we didn't decide what we want for schema yet.
