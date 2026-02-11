# Car Catalog

Full-stack application for managing a car catalog with React + Node.js + PostgreSQL.

## Requirements

- Node.js v18+
- PostgreSQL 14+ (or Docker)
- npm or yarn

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- React Router DOM

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcryptjs

## Setup

### 1. Clone and install dependencies

```bash
cd car-test
npm run install:all
```

### 2. Configure environment variables

Copy the example env file for backend:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/car_catalog
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```

### 3. Setup PostgreSQL Database

#### Option A: Using Docker (recommended)

```bash
# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker ps
```

This will start PostgreSQL on `localhost:5432` with:
- Database: `car_catalog`
- User: `postgres`
- Password: `password`

#### Option B: Local PostgreSQL Installation

**Install PostgreSQL (macOS):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Create database:**
```bash
createdb car_catalog
```

Or via psql:
```bash
psql postgres -c "CREATE DATABASE car_catalog;"
```

**Update `backend/.env`** with your local credentials:
```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/car_catalog
```

### 4. Run migrations and seed

```bash
cd backend

# Create tables (Prisma migrations)
npm run db:migrate

# Populate with test data (30 cars + 2 users)
npm run db:seed

# Or run both at once
npm run db:setup
```

This will:
- Create `users` and `cars` tables via Prisma migrations
- Seed 30 test cars from testCar.json data
- Create 2 test users (admin@example.com, test@example.com)

**Useful Prisma commands:**
```bash
npm run db:studio   # Open Prisma Studio (GUI for database)
```

### 5. Run the application

From the root directory:

```bash
# Auto mode: starts Docker, runs migrations, seeds if needed, then starts app
npm run dev:auto

# Or manual mode (if DB is already running)
npm run dev
```

**Auto mode** (`npm run dev:auto`) will automatically:
1. Check if Docker is running
2. Start PostgreSQL container if not running
3. Wait for database to be ready
4. Run Prisma migrations
5. Seed test data (only if database is empty)
6. Start frontend and backend

This will start both frontend (port 5173) and backend (port 3001) concurrently.

Or run separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## Test Users

After running seed:

| Email | Password |
|-------|----------|
| admin@example.com | password123 |
| test@example.com | password123 |

## Features

- User registration and authentication (JWT)
- View cars list with pagination
- Search cars by brand, model, or VIN
- Sort by any column (click column header)
- Resizable table columns (drag column borders)
- Add new cars
- View car details
- Edit car information
- Delete cars with confirmation
- Protected routes
- 404 Not Found page
- Responsive design

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Cars (all protected)
- `GET /api/cars` - Get cars list (with pagination, search, sort)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

## Project Structure

```
car-test/
├── frontend/
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
│   └── ...
├── backend/
│   ├── src/
│   │   ├── db/           # Database connection, migrations, seed
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API routes
│   │   └── types/        # TypeScript types
│   └── ...
└── package.json          # Root package with run scripts
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret key for JWT tokens | - |
| JWT_EXPIRES_IN | JWT token expiration | 7d |
| PORT | Backend server port | 3001 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Deploy

### Backend (Railway)

1. Create new project in Railway
2. Add PostgreSQL database (one click)
3. Add new service from GitHub, set root directory to `backend`
4. Set environment variables:
   - `DATABASE_URL` — copy from Railway PostgreSQL
   - `JWT_SECRET` — generate secure random string
   - `FRONTEND_URL` — your Vercel app URL (e.g., `https://your-app.vercel.app`)
5. Deploy

### After deployment

Update frontend API URL. Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.railway.app
```

Then update `frontend/src/api/client.ts` to use:
```ts
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```
