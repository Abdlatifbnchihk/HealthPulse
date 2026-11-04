# HealthPulse

HealthPulse is organized as a monorepo with separate frontend and backend apps:

- `frontend/` - React interface built with Vite.
- `backend/` - Laravel API, database migrations, and queue workers.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env` to the backend API URL when connecting
the interface to Laravel.

## Run the backend

```powershell
cd backend
composer install
php artisan serve
```

Run the queue worker in a separate terminal:

```powershell
cd backend
php artisan queue:work
```

Keep the backend's `.env` and AI provider credentials private. Configure Laravel
CORS to allow the frontend's development origin before making browser API calls.

See [backend/README.md](./backend/README.md) for backend API notes.
