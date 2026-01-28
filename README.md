# Heritage Blade (BarberPro)

Static site + Vercel serverless API for bookings and customer notes.

## Deploy on Vercel

1. Import this GitHub repo into Vercel.
2. Project Settings → **Environment Variables**:
   - Add `MONGODB_URI` (MongoDB Atlas recommended).
3. Deploy.

### Routes

- Site: `/` serves `index.html`
- Admin: `/admin.html` (manage customers + persistent comments)
- API:
  - `POST /api/bookings` (saves booking; maps `notes` → `comment`)
  - `GET /api/bookings` (lists recent)
  - `GET /api/customers?q=...` (search)
  - `POST /api/customers` (create)
  - `GET /api/customers/:id` (read)
  - `PUT /api/customers/:id` (update)

## Notes

- Your front-end uses relative URLs like `/api/bookings`, so it works on `https://heritageblade.bario.me/` without hardcoding localhost.
- Vercel does **not** run the Express server in `server/` in production. The production backend is the `/api/` folder.
