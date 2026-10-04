# Oral Cancer Awareness — Admin Console

Admin dashboard for the caretaker app. Manages caretaker accounts and shows
real-time watch-time analytics from the same Firebase project used by the
Flutter app.

## What's built

- Admin-only login (no public signup)
- Dashboard: summary cards, recent activity, derived from live Firestore data
- Users: searchable/sortable/paginated table, add/edit/delete, detail page
- Analytics: active-caretaker chart, user growth chart, most-active ranking
- Settings: update display name, change password, logout
- Role-based access control (Firestore rules + server-side checks on every
  user-management API call)

## 1. Firebase setup

1. Create (or reuse) a Firebase project — **the same one your Flutter app uses**.
2. Enable **Authentication → Email/Password**.
3. Enable **Cloud Firestore**.
4. Project Settings → General → add a **Web app**, copy the config into
   `.env.local` (copy `.env.local.example` first).
5. Project Settings → **Service Accounts** → Generate new private key →
   copy `project_id`, `client_email`, `private_key` into `.env.local`.
6. Deploy `firestore.rules` (Firebase console → Firestore → Rules, paste
   the file's contents, or `firebase deploy --only firestore:rules` with
   the Firebase CLI).

**Note on cost:** creating/deleting Auth users from a Next.js API route
via the Admin SDK works out of the box — no Blaze (pay-as-you-go) plan
needed, since this project calls the Admin SDK directly from the app's own
server rather than through Firebase Cloud Functions. Firestore and Auth's
free (Spark) quotas cover this project's use easily during development.

## 2. Bootstrap the first admin

There's no UI for creating the very first admin (by design — only an
admin can create accounts). Do it once, manually:

1. Firebase console → Authentication → **Add user** → create your admin's
   email/password.
2. Firebase console → Firestore → `users` collection → add a document
   with that user's **Auth UID** as the document ID:
   ```
   name: "Your Name"
   email: "you@example.com"
   role: "admin"
   watchTimeSeconds: 0
   createdAt: (Firestore server timestamp)
   lastWatched: null
   ```
3. Log in at `/login` with that email/password.

Every caretaker account after that can be created from the Users page.

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` → redirects to `/login`.

## 4. Deploy

Any Next.js host works (Vercel's free tier is the easiest — set the same
env vars from `.env.local` in the project's dashboard).

## Firestore schema (matches the Flutter app)

```
users/{uid}
  name: string
  email: string
  role: "admin" | "caretaker"
  watchTimeSeconds: number   // written by the Flutter app
  createdAt: timestamp
  lastWatched: timestamp | null   // written by the Flutter app
```

## Notes / next steps if you want to extend this

- **Recent Activity** currently shows "watched a video" events derived from
  `lastWatched`. To also log "Admin created/deleted user" events, add an
  `activity` collection and write to it from the two API routes.
- **Daily/weekly/monthly watch time charts** currently approximate activity
  by day using `lastWatched` (a single running total, not per-session data).
  For exact per-day watch seconds, have the Flutter app write one document
  per viewing session (e.g. `watchSessions/{autoId}`) and aggregate those
  here instead.
